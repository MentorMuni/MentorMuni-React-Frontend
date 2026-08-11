/** Demo / offline White Board store. Real students use the API. */

const COLORS = ['canary', 'pink', 'mint', 'lilac', 'peach', 'sky', 'coral', 'butter'];

export function campusToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export function campusYesterday(today = campusToday()) {
  const [y, m, d] = today.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return [
    dt.getFullYear(),
    String(dt.getMonth() + 1).padStart(2, '0'),
    String(dt.getDate()).padStart(2, '0'),
  ].join('-');
}

function storageKey(userKey) {
  return `mm-whiteboard-v1:${userKey || 'anon'}`;
}

function emptyStore() {
  return { notes: [], mentorships: [], seq: 1 };
}

function readStore(userKey) {
  try {
    const raw = localStorage.getItem(storageKey(userKey));
    if (!raw) return emptyStore();
    const data = JSON.parse(raw);
    return {
      notes: Array.isArray(data.notes) ? data.notes : [],
      mentorships: Array.isArray(data.mentorships) ? data.mentorships : [],
      seq: Number(data.seq) || 1,
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(userKey, store) {
  localStorage.setItem(storageKey(userKey), JSON.stringify(store));
}

function nextPin(openCount) {
  const col = openCount % 4;
  const row = Math.floor(openCount / 4);
  const jitterX = ((openCount * 17) % 7) - 3;
  const jitterY = ((openCount * 13) % 7) - 3;
  return {
    pin_x: Math.min(78, Math.max(2, 5 + col * 23 + jitterX)),
    pin_y: Math.min(72, Math.max(2, 6 + row * 26 + jitterY)),
    rotation: ((openCount * 11) % 15) - 7,
  };
}

function emptyDrop(today, yesterday) {
  return {
    id: Number(today.replaceAll('-', '')),
    mentorship_date: today,
    source_notes_date: yesterday,
    status: 'READY',
    headline: 'Wall is quiet. Dump the real mess tonight.',
    greeting: 'I opened your board. Nothing from yesterday to fix yet.',
    what_changed: 'No new notes yesterday. Tonight’s stickies become tomorrow’s plan.',
    diagnosis:
      'A blank wall cannot be coached. Write the thing you are actually stuck on — subject, company, the hour you froze, what fixed looks like by Friday.',
    actions: [
      {
        order: 1,
        title: 'Slap one honest note',
        do_exactly:
          'Two minutes. One sentence problem + what “fixed” looks like tonight. Example: “Arrays freeze me — 2 easy problems submitted without a video.”',
        why_this_works: 'Tomorrow’s drop can only be exact if tonight’s note is exact.',
        done_when: 'One open sticky is on the wall with a finish line, not a vibe.',
        timebox_minutes: 10,
        note_ids: [],
      },
    ],
    callout: 'If you only do one thing: put the real blocker on the wall before you sleep.',
    closing: 'Peel nothing that is not actually done. I will read this tomorrow.',
    source: 'empty',
    model: null,
  };
}

function heuristicDrop(today, yesterday, notes) {
  const yNotes = notes.filter((n) => n.board_date === yesterday);
  const openOlder = notes.filter((n) => n.status === 'OPEN' && n.board_date < yesterday);
  const focus = [...yNotes, ...openOlder].filter((n) => n.status === 'OPEN');
  if (!focus.length) return emptyDrop(today, yesterday);
  const peeled = notes.filter((n) => n.status === 'RESOLVED').length;
  const lead = (focus[0].body || '').replace(/\n/g, ' ');
  const leadShort = lead.length > 80 ? `${lead.slice(0, 77)}…` : lead;
  return {
    id: Number(today.replaceAll('-', '')),
    mentorship_date: today,
    source_notes_date: yesterday,
    status: 'READY',
    headline: `Today we kill this: ${leadShort}`,
    greeting: 'I read yesterday’s stickies. We are not hoping. We are closing them.',
    what_changed: peeled
      ? `You already peeled ${peeled} note(s). The rest still needs an artefact, not a mood.`
      : 'Nothing peeled yet. Today each note gets a 25-minute artefact.',
    diagnosis:
      'The freeze is usually starting, not talent. Paper first, phone away, one screenshot that proves movement — then peel.',
    actions: focus.slice(0, 4).map((note, i) => {
      const snippet = (note.body || '').replace(/\n/g, ' ');
      const short = snippet.length > 90 ? `${snippet.slice(0, 87)}…` : snippet;
      return {
        order: i + 1,
        title: `Close this: ${short.slice(0, 42)}`,
        do_exactly: `Set a 25-minute timer. Phone in another room. Write “${short}” at the top of a page. Ten minutes: what you already tried. Fifteen minutes: the smallest artefact — one submission, one rewritten paragraph, one answer spoken out loud. No YouTube until it exists.`,
        why_this_works: 'You named this on the wall. Starting is the whole game.',
        done_when: `You can show a screenshot that proves “${short}” moved, then peel this note.`,
        timebox_minutes: 25,
        note_ids: [note.id],
      };
    }),
    callout: `If you only do one thing, finish action 1 on: ${leadShort}`,
    closing: 'Peel only when the done-when is true. I will see what is left tomorrow.',
    source: 'heuristic',
    model: null,
  };
}

function ensureTodayMentorship(store) {
  const today = campusToday();
  const yesterday = campusYesterday(today);
  if (store.mentorships.some((m) => m.mentorship_date === today)) return store;
  const drop = heuristicDrop(today, yesterday, store.notes);
  store.mentorships = [drop, ...store.mentorships];
  return store;
}

function toBoard(store) {
  const today = campusToday();
  const yesterday = campusYesterday(today);
  const todayMentorship = store.mentorships.find((m) => m.mentorship_date === today) || null;
  return {
    today,
    yesterday,
    timezone: 'Asia/Kolkata',
    generating: false,
    notes: store.notes,
    today_mentorship: todayMentorship,
    mentorships: store.mentorships.map((m) => ({
      id: m.id,
      mentorship_date: m.mentorship_date,
      status: m.status,
      headline: m.headline,
      source: m.source,
    })),
    yesterday_note_count: store.notes.filter((n) => n.board_date === yesterday).length,
    open_note_count: store.notes.filter((n) => n.status === 'OPEN').length,
  };
}

export const whiteboardLocal = {
  getBoard(userKey) {
    const store = ensureTodayMentorship(readStore(userKey));
    writeStore(userKey, store);
    return toBoard(store);
  },

  createNote(userKey, body) {
    const store = readStore(userKey);
    const open = store.notes.filter((n) => n.status === 'OPEN');
    const now = new Date().toISOString();
    const pin = nextPin(open.length);
    const note = {
      id: store.seq++,
      body: String(body.body || '').trim(),
      color: COLORS.includes(body.color) ? body.color : COLORS[open.length % COLORS.length],
      status: 'OPEN',
      board_date: campusToday(),
      pin_x: body.pin_x ?? pin.pin_x,
      pin_y: body.pin_y ?? pin.pin_y,
      rotation: body.rotation ?? pin.rotation,
      created_at: now,
      updated_at: now,
      resolved_at: null,
    };
    store.notes.push(note);
    writeStore(userKey, store);
    return note;
  },

  updateNote(userKey, noteId, patch) {
    const store = readStore(userKey);
    const note = store.notes.find((n) => n.id === Number(noteId));
    if (!note) throw new Error('That sticky is not on your wall.');
    if (patch.body != null) note.body = String(patch.body).trim();
    if (patch.color) note.color = patch.color;
    if (patch.pin_x != null) note.pin_x = patch.pin_x;
    if (patch.pin_y != null) note.pin_y = patch.pin_y;
    if (patch.rotation != null) note.rotation = patch.rotation;
    note.updated_at = new Date().toISOString();
    writeStore(userKey, store);
    return note;
  },

  resolveNote(userKey, noteId) {
    const store = readStore(userKey);
    const note = store.notes.find((n) => n.id === Number(noteId));
    if (!note) throw new Error('That sticky is not on your wall.');
    note.status = 'RESOLVED';
    note.resolved_at = new Date().toISOString();
    note.updated_at = note.resolved_at;
    writeStore(userKey, store);
    return note;
  },

  reopenNote(userKey, noteId) {
    const store = readStore(userKey);
    const note = store.notes.find((n) => n.id === Number(noteId));
    if (!note) throw new Error('That sticky is not on your wall.');
    note.status = 'OPEN';
    note.resolved_at = null;
    note.updated_at = new Date().toISOString();
    writeStore(userKey, store);
    return note;
  },

  getMentorship(userKey, mentorshipDate) {
    const store = ensureTodayMentorship(readStore(userKey));
    writeStore(userKey, store);
    const row = store.mentorships.find((m) => m.mentorship_date === mentorshipDate);
    if (!row) throw new Error('No mentorship for that date yet.');
    return row;
  },
};

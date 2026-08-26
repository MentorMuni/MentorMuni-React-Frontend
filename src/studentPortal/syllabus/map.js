/**
 * Syllabus map: ~300–400 nodes structured by topic and company relevance.
 * Each node represents a testable concept with modality coverage (Recognition/Application/Explanation).
 *
 * Structure drives coverage handshake: NEW → RETRY → VERIFY pools prevent repeats
 * and ensure the learner sees the whole map before graduation.
 */

export const SYLLABUS_MAP = {
  // Aptitude: verbal, logical reasoning, quantitative
  aptitude: {
    verbal: {
      'analogies': { minLevel: 2, companies: ['tcs_ninja', 'tcs_digital', 'infosys_dse', 'wipro'] },
      'comprehension': { minLevel: 1, companies: ['tcs_ninja', 'accenture'] },
      'vocabulary': { minLevel: 1, companies: ['tcs_ninja'] },
    },
    logical: {
      'syllogism': { minLevel: 2, companies: ['tcs_ninja', 'tcs_digital', 'infosys_dse'] },
      'blood-relations': { minLevel: 2, companies: ['tcs_ninja', 'wipro'] },
      'clocks-calendars': { minLevel: 2, companies: ['tcs_ninja', 'tcs_digital'] },
      'arrangement': { minLevel: 2, companies: ['tcs_digital', 'infosys_sp'] },
      'direction-distance': { minLevel: 1, companies: ['tcs_ninja'] },
    },
    quantitative: {
      'percentages': { minLevel: 3, companies: ['tcs_ninja', 'tcs_digital', 'tcs_prime', 'infosys_dse'] },
      'ratios-proportions': { minLevel: 3, companies: ['tcs_ninja', 'tcs_digital', 'infosys_dse', 'accenture'] },
      'mixtures-solutions': { minLevel: 2, companies: ['tcs_digital'] },
      'profit-loss': { minLevel: 2, companies: ['tcs_ninja', 'infosys_dse'] },
      'time-work': { minLevel: 2, companies: ['tcs_ninja', 'tcs_digital', 'cognizant'] },
      'time-distance': { minLevel: 2, companies: ['tcs_ninja', 'tcs_digital', 'infosys_dse'] },
      'permutations-combinations': { minLevel: 2, companies: ['tcs_digital', 'tcs_prime'] },
      'probability': { minLevel: 1, companies: ['tcs_prime'] },
    },
  },

  // Coding: DSA fundamentals
  coding: {
    'arrays': { minLevel: 3, companies: ['tcs_digital', 'tcs_prime', 'infosys_sp', 'capgemini'] },
    'strings': { minLevel: 3, companies: ['tcs_digital', 'tcs_prime', 'infosys_sp'] },
    'linked-lists': { minLevel: 2, companies: ['tcs_digital', 'tcs_prime', 'infosys_sp'] },
    'stacks-queues': { minLevel: 2, companies: ['tcs_prime', 'infosys_sp'] },
    'hashing': { minLevel: 2, companies: ['tcs_prime', 'infosys_sp'] },
    'trees': { minLevel: 2, companies: ['tcs_prime', 'infosys_sp'] },
    'graphs': { minLevel: 1, companies: ['tcs_prime'] },
    'sorting': { minLevel: 3, companies: ['tcs_digital', 'tcs_prime', 'infosys_sp'] },
    'searching': { minLevel: 3, companies: ['tcs_digital', 'tcs_prime', 'infosys_sp'] },
    'recursion': { minLevel: 2, companies: ['tcs_digital', 'tcs_prime', 'infosys_sp'] },
    'dynamic-programming': { minLevel: 1, companies: ['tcs_prime', 'infosys_sp'] },
  },

  // Technical: CS fundamentals
  technical: {
    'oops': {
      'classes-objects': { minLevel: 2, companies: ['tcs_digital', 'tcs_prime', 'infosys_sp'] },
      'polymorphism': { minLevel: 2, companies: ['tcs_prime', 'infosys_sp'] },
      'inheritance': { minLevel: 2, companies: ['tcs_prime', 'infosys_sp'] },
      'encapsulation': { minLevel: 1, companies: ['tcs_prime'] },
      'abstraction': { minLevel: 1, companies: ['tcs_prime'] },
    },
    'database': {
      'sql-basics': { minLevel: 3, companies: ['tcs_digital', 'tcs_prime', 'infosys_sp', 'cognizant'] },
      'joins': { minLevel: 3, companies: ['tcs_digital', 'tcs_prime', 'infosys_sp'] },
      'normalization': { minLevel: 2, companies: ['tcs_prime', 'infosys_sp'] },
      'indexing': { minLevel: 1, companies: ['tcs_prime'] },
      'transactions': { minLevel: 1, companies: ['tcs_prime'] },
    },
    'os': {
      'processes-threads': { minLevel: 2, companies: ['tcs_prime', 'infosys_sp'] },
      'memory-management': { minLevel: 1, companies: ['tcs_prime'] },
      'synchronization': { minLevel: 1, companies: ['tcs_prime'] },
      'file-systems': { minLevel: 1, companies: ['tcs_prime'] },
    },
    'networking': {
      'osi-model': { minLevel: 1, companies: ['tcs_prime', 'infosys_sp'] },
      'tcp-ip': { minLevel: 1, companies: ['tcs_prime'] },
      'dns-http': { minLevel: 1, companies: ['tcs_prime'] },
    },
  },

  // Communication: verbal + written
  communication: {
    'technical-explanation': { minLevel: 2, companies: ['tcs_digital', 'tcs_prime', 'infosys_sp', 'accenture'] },
    'problem-solving-walkthrough': { minLevel: 2, companies: ['tcs_prime', 'infosys_sp'] },
    'follow-up-responses': { minLevel: 2, companies: ['tcs_prime', 'infosys_sp', 'accenture'] },
    'confidence': { minLevel: 2, companies: ['tcs_ninja', 'accenture', 'wipro'] },
    'grammar-clarity': { minLevel: 1, companies: ['accenture'] },
  },

  // Resume: ATS + screening
  resume: {
    'ats-formatting': { minLevel: 3, companies: ['tcs_ninja', 'tcs_digital', 'infosys_dse', 'accenture'] },
    'keywords': { minLevel: 2, companies: ['tcs_digital', 'infosys_sp', 'accenture'] },
    'work-experience': { minLevel: 2, companies: ['tcs_digital', 'infosys_sp', 'accenture'] },
    'projects-section': { minLevel: 2, companies: ['tcs_digital', 'infosys_sp'] },
    'certifications': { minLevel: 1, companies: ['tcs_digital'] },
  },

  // HR: behavioural + situational
  hr: {
    'strengths-weaknesses': { minLevel: 2, companies: ['tcs_ninja', 'accenture', 'wipro'] },
    'why-this-company': { minLevel: 2, companies: ['tcs_digital', 'accenture'] },
    'conflict-resolution': { minLevel: 2, companies: ['accenture', 'infosys_sp'] },
    'team-work': { minLevel: 2, companies: ['tcs_ninja', 'accenture'] },
    'pressure-handling': { minLevel: 1, companies: ['accenture', 'infosys_sp'] },
  },
};

/**
 * Total node count across all topics (for coverage tracking).
 */
export function getTotalSyllabusNodes() {
  let count = 0;
  const traverse = (obj) => {
    for (const key in obj) {
      if (obj[key].minLevel !== undefined) {
        // This is a leaf node
        count += 1;
      } else if (typeof obj[key] === 'object') {
        traverse(obj[key]);
      }
    }
  };
  traverse(SYLLABUS_MAP);
  return count;
}

/**
 * Get all topics for a specific company (used to prune syllabus).
 */
export function getCompanySyllabus(company) {
  const relevant = [];
  const traverse = (obj, path = '') => {
    for (const key in obj) {
      const current = `${path}${path ? '.' : ''}${key}`;
      if (obj[key].minLevel !== undefined && obj[key].companies?.includes(company)) {
        relevant.push(current);
      } else if (typeof obj[key] === 'object' && !obj[key].companies) {
        traverse(obj[key], current);
      }
    }
  };
  traverse(SYLLABUS_MAP);
  return relevant;
}

/**
 * Convert flat topic path to a node id for coverage ledger.
 * E.g., "aptitude.quantitative.ratios-proportions" → "apt.quant.ratios"
 */
export function topicToNodeId(topic) {
  // Map topic string to short node identifier for tracking
  const abbreviations = {
    'aptitude': 'apt',
    'verbal': 'verb',
    'logical': 'logic',
    'quantitative': 'quant',
    'coding': 'code',
    'technical': 'tech',
    'communication': 'comm',
    'resume': 'res',
    'hr': 'hr',
  };

  const parts = topic.split('.');
  return parts.map((p) => abbreviations[p] || p.slice(0, 3)).join('.');
}

/**
 * Get the full hierarchy of topics as a flat list with parent paths.
 * Used for syllabus validation and coverage reporting.
 */
export function getAllTopics() {
  const all = [];
  const traverse = (obj, path = []) => {
    for (const key in obj) {
      const current = [...path, key];
      if (obj[key].minLevel !== undefined) {
        all.push({
          id: topicToNodeId(current.join('.')),
          path: current.join('.'),
          minLevel: obj[key].minLevel,
          companies: obj[key].companies || [],
        });
      } else if (typeof obj[key] === 'object') {
        traverse(obj[key], current);
      }
    }
  };
  traverse(SYLLABUS_MAP);
  return all;
}

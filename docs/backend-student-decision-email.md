# Student approve / deny emails

Frontend now calls approve/reject with `send_email: true` and expects the API to email the student.

## Endpoints

### Approve
`POST /organizations/students/invites/{id}/approve`

**Request body**
```json
{ "send_email": true, "notify_student": true }
```

**Expected behavior**
1. Move invite → roster (`INVITED` / needs password).
2. Create set-password / activation token.
3. Email student at invite email with the set-password link (same style as HOD/TPO activation mail).
4. Return JSON (email may be async, but prefer sync status when possible):

```json
{
  "ok": true,
  "emailed": true,
  "email_sent": true,
  "setup_url": "https://…/studentportal/set-password?token=…",
  "activation_token": "…",
  "student": { "id": 1, "email": "student@college.edu", "name": "…" },
  "message": "Approved. Set-password email sent."
}
```

If mail fails: `"emailed": false` and still return `setup_url` so TPO/HOD can copy/share.

### Deny
`POST /organizations/students/invites/{id}/reject`

**Request body**
```json
{ "send_email": true, "notify_student": true }
```

**Expected behavior**
1. Mark invite rejected.
2. Email student that the request was denied (no set-password link).
3. Return:

```json
{
  "ok": true,
  "emailed": true,
  "message": "Denied. Notification email sent."
}
```

If mail fails: `"emailed": false`.

## Email content (minimum)

| Event | To | Subject (example) | Body must include |
|-------|-----|-------------------|-------------------|
| Approve | student email | Set your MentorMuni password | College name, set-password URL, expiry if any |
| Deny | student email | Enrollment request update | College/dept name, that request was not approved, contact HOD/TPO |

Link path FE already uses: `/studentportal/set-password?token=…`

## Notes
- Demo org sessions on the FE do **not** call these APIs (local only) — real email only for real JWT sessions.
- `emailed` / `email_sent` should be boolean when known; omit or null if unknown.
- Prefer same mailer as HOD invite (`app.common.email` / SendGrid).

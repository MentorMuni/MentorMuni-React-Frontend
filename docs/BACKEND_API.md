# Backend API & CORS

## CORS (Cross-Origin Resource Sharing)

**CORS is configured on the backend, not the frontend.** The browser blocks requests from your frontend origin to the API unless the backend sends the right headers.

- **Enable CORS on the Flask backend** (e.g. with [flask-cors](https://pypi.org/project/flask-cors/)) for your frontend origin:
  - Development: `http://localhost:5173` (or whatever port Vite uses)
  - Production: your deployed frontend URL (e.g. `https://your-app.vercel.app`)

Example (Flask):

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://your-frontend-domain.com"])
```

Without this, the browser may block API calls and you can see network errors or "Failed to fetch".

---

## Contact form (email service) – 404 "Not Found"

The **contact page** sends a POST request to:

- **URL:** `POST {API_BASE}/api/contact`
- **Body (JSON):** `{ "name", "email", "phone", "message" }`

If you see *"The requested URL was not found on the server"*, the backend does not have this route yet. Add it and return JSON, e.g.:

- **Success:** `{ "success": true, "message": "Message received" }`
- **Error:** `{ "success": false, "message": "Optional error message" }` with status 4xx/5xx.

Then implement your email sending (e.g. SendGrid, Mailgun, or SMTP) inside that route. Once the route exists and CORS allows your frontend origin, the contact form will work.

---

## Interview Readiness – OTP (phone + email)

The **Interview Readiness** flow sends OTP to verify the user before the quiz. The frontend calls:

### 1. Send OTP

- **URL:** `POST {API_BASE}/get-otp`
- **Body (JSON):** `{ "email": "user@example.com", "phone": "+919876543210" }`

**Backend should:**

1. Generate a 6-digit numeric OTP and store it (e.g. in cache/DB) keyed by `email` and/or `phone`, with a short TTL (e.g. 5–10 minutes).
2. **Send OTP to phone:** Use an SMS provider (Twilio, MSG91, AWS SNS, etc.) to send the OTP to `phone`. **SMS is paid per message** (see cost section below).
3. Optionally also send the same OTP by email (e.g. SendGrid, Mailgun) for a second channel.
4. Return JSON, e.g. `{ "success": true, "message": "OTP sent" }` or on error `{ "success": false, "error": "..." }` with 4xx/5xx.

### 2. Verify OTP

- **URL:** `POST {API_BASE}/verify-otp`
- **Body (JSON):** `{ "email": "user@example.com", "otp": "123456" }`

**Backend should:**

1. Look up the stored OTP for this `email` (and optionally check `phone` if you key by both).
2. If OTP matches and is not expired, clear the OTP and return success plus any usage info, e.g. `{ "success": true, "usage_info": { "current_usage": 0, "limit": 1, "remaining_attempts": 1 } }`.
3. On failure: `{ "success": false, "error": "Invalid or expired OTP" }` with 4xx.

**CORS:** Same as above; allow your frontend origin so the browser can call these endpoints.

---

## Does sending OTP to phone cost money?

**Yes.** Sending OTP **via SMS** to a phone number is a paid service:

- **Twilio:** Pay per SMS (e.g. ~$0.0075–0.01+ per message depending on country).
- **MSG91 / other Indian providers:** Similar per-SMS pricing for Indian numbers.
- **AWS SNS:** Pay per SMS; pricing varies by destination country.

**Email OTP** is much cheaper or free (e.g. SendGrid/Mailgun free tiers, or your own SMTP). So a common approach is:

- Send OTP **by email only** (no cost per verification), or  
- Send OTP **by SMS only** (paid per SMS), or  
- Send to **both** email and phone (SMS part is paid).

If you want to avoid SMS cost, you can implement only **email OTP** on the backend and keep the same frontend flow (user enters email + phone; backend sends OTP only to email). The UI already says “sent to your email and phone” — you can change the copy to “sent to your email” if you drop SMS.

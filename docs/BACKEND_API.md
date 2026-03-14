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

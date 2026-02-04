# Hourfy ⏱️💸

**Hourfy helps people think differently about spending money.**

Instead of asking *“Can I afford this?”*, Hourfy asks a better question:

> **“How many hours of my life does this cost?”**

By converting prices into hours of work, Hourfy gives users a simple but powerful way to make more intentional spending decisions.

---

## ✨ What Hourfy Does

- Converts an item’s price into **hours and minutes of work**
- Supports **hourly rate or annual salary**
- Optional **after-tax estimation**
- Shows **workday equivalents** (e.g. 7.6h day)
- Saves preferences locally (no accounts, no tracking)
- Designed to be **fast, minimal, and mobile-first**

No judgement. No budgeting spreadsheets.  
Just a clearer way to think about value.

---

## 🧠 Why Hourfy Exists

Hourfy is inspired by a simple habit used by frugal, high-intentional spenders:
> *If something costs 5 hours of work, is it really worth it?*

That mental shift often changes the decision instantly.

Hourfy turns that habit into a clean, modern web app.

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Docker & Docker Compose**

The app is intentionally lightweight — no database, no auth, no backend services required.

---

## 🚀 Running Locally (Docker)

```bash
git clone https://github.com/ibracorp/hourfy.git
cd hourfy
docker compose up -d --build
```
The app will be available on:
```http://localhost:3000```

---

## 🌐 Deployment

Hourfy is designed to run cleanly in Docker and sit behind a reverse proxy  
(e.g. Nginx Proxy Manager, Traefik, Cloudflare Tunnel).

- Exposes port **3000**
- No process managers (PM2/systemd) required
- Safe to restart, reboot, or redeploy

---

## 📦 Project Status

Hourfy is currently in **active development**.

Planned improvements may include:

- Shareable result cards
- Presets for common income types
- Historical comparisons
- Optional accounts (future)

---

## 🧾 License

MIT License.

Use it, fork it, improve it — just don’t make it worse 😉

---

## 👋 Author

Built by **IBRACORP**  
Focused on practical tools, clean infrastructure, and intentional tech.

---

## 🤖 AI Disclaimer

AI was used in the development of this application.  
No user information is stored or collected.  
Please use at your own discretion.

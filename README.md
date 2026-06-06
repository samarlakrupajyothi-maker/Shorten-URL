# 🔗 URL Shortener — CodeAlpha Internship Task 1

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat)](LICENSE)
[![CodeAlpha](https://img.shields.io/badge/CodeAlpha-Internship-orange?style=flat)](https://codealpha.tech)

> Full-stack URL Shortener built for **CodeAlpha Backend Development Internship — Task 1**

## ✨ Features
- 🔗 Shorten any URL with a unique short code
- ✏️ Custom aliases (`/my-link`)
- 📊 Click tracking & analytics dashboard
- ⏳ Optional expiry dates
- 🗑️ Delete links anytime
- 📡 Full REST API with JSON responses

## 🚀 Live Demo
🌐 **[View Live App](https://YOUR-USERNAME.github.io/url-shortener)**

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shorten` | Create short URL |
| `GET` | `/:code` | Redirect to original URL |
| `GET` | `/api/stats` | Get all links + analytics |
| `DELETE` | `/api/:code` | Delete a link |

## ⚙️ Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener
npm install
npm start
# Open http://localhost:3000
```

## 🧪 Test with curl

```bash
# Shorten
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com","alias":"gh"}'

# Stats
curl http://localhost:3000/api/stats

# Delete
curl -X DELETE http://localhost:3000/api/gh
```

## 🎓 Internship
| | |
|-|-|
| Organization | CodeAlpha |
| Task | Task 1 — URL Shortener |
| Intern | Krupa Jyothi Samarla |
| Duration | June–July 2026 |

---
<p align="center">Made with ❤️ by Krupa Jyothi Samarla · CodeAlpha Internship 2026</p>

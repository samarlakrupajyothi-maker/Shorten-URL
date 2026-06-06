const express = require("express");
const cors = require("cors");
const path = require("path");
const { nanoid } = require("nanoid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ─── IN-MEMORY DATABASE ───────────────────────────────────────────────────────
// Replace with SQLite/MongoDB for production
const urlDB = {};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function isValidUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}

function isExpired(link) {
  if (!link.expiry) return false;
  return new Date() > new Date(link.expiry);
}

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// POST /api/shorten — Create short URL
app.post("/api/shorten", (req, res) => {
  let { url, alias, expiry } = req.body;

  if (!url) return res.status(400).json({ status: 400, message: "URL is required" });

  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  if (!isValidUrl(url)) return res.status(400).json({ status: 400, message: "Invalid URL format" });

  const code = alias?.trim().toLowerCase().replace(/\s+/g, "") || nanoid(6);

  if (alias && urlDB[code] && urlDB[code].original !== url) {
    return res.status(409).json({ status: 409, message: "Alias already taken. Try another." });
  }

  urlDB[code] = {
    code,
    original: url,
    short: `${req.protocol}://${req.get("host")}/${code}`,
    clicks: 0,
    history: [],
    expiry: expiry || null,
    created: new Date().toISOString(),
  };

  return res.status(201).json({
    status: 201,
    message: "URL shortened successfully",
    data: {
      code,
      short_url: urlDB[code].short,
      original_url: url,
      expires: expiry || null,
      created_at: urlDB[code].created,
    },
  });
});

// GET /api/stats — All links with analytics
app.get("/api/stats", (req, res) => {
  const links = Object.values(urlDB).map((l) => ({
    code: l.code,
    short_url: l.short,
    original_url: l.original,
    clicks: l.clicks,
    expiry: l.expiry,
    created_at: l.created,
    last_clicked: l.history.length ? l.history[l.history.length - 1] : null,
    status: isExpired(l) ? "expired" : "active",
  }));

  return res.status(200).json({
    status: 200,
    data: links,
    meta: {
      total_links: links.length,
      total_clicks: links.reduce((s, l) => s + l.clicks, 0),
      active: links.filter((l) => l.status === "active").length,
    },
  });
});

// DELETE /api/:code — Delete a link
app.delete("/api/:code", (req, res) => {
  const { code } = req.params;
  if (!urlDB[code]) return res.status(404).json({ status: 404, message: "Link not found" });
  delete urlDB[code];
  return res.status(200).json({ status: 200, message: "Link deleted successfully" });
});

// GET /:code — Redirect to original URL
app.get("/:code", (req, res) => {
  const { code } = req.params;
  const link = urlDB[code];

  if (!link) return res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
  if (isExpired(link)) return res.status(410).json({ status: 410, message: "This link has expired" });

  link.clicks++;
  link.history.push(new Date().toISOString());

  return res.redirect(301, link.original);
});

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n🔗 URL Shortener running at http://localhost:${PORT}`);
  console.log(`📡 API ready at http://localhost:${PORT}/api/shorten\n`);
});
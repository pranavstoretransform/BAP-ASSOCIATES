import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { name, email, subject, message } = body;

    // Basic validation so your DB doesn’t get emotional damage
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject}, ${message})
    `;

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
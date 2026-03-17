import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

const sql = neon(process.env.DATABASE_URL);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const { name, email, message } = req.body;

    // 1. Save to DB
    await sql`
      INSERT INTO contacts (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;

    // 2. Send Email
    await resend.emails.send({
      from: "Website <onboarding@resend.dev>",
      to: ["your@email.com"],
      subject: "New Contact Form Submission",
      html: `
        <h3>New Contact</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something broke" });
  }
}
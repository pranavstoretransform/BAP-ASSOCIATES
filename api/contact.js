export default async function handler(req, res) {
  try {
    return res.status(200).json({
      message: "API is working",
      method: req.method,
      hasDB: !!process.env.DATABASE_URL,
      hasResend: !!process.env.RESEND_API_KEY,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Still broken" });
  }
}
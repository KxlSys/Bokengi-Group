export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Service email non configuré. Ajoutez RESEND_API_KEY dans les variables Vercel.',
    });
  }

  const { name, email, message, website } = req.body ?? {};

  if (website) {
    return res.status(200).json({ success: true });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }

  if (message.length > 5000 || name.length > 200) {
    return res.status(400).json({ error: 'Message trop long.' });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || 'contact@kal-cooperation.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Kal-Cooperation <onboarding@resend.dev>';

  const html = `
    <h2>Nouveau message — Kal-Cooperation</h2>
    <p><strong>Nom / Entreprise :</strong> ${escapeHtml(name)}</p>
    <p><strong>Email :</strong> ${escapeHtml(email)}</p>
    <hr />
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[Kal-Cooperation] ${name.trim()}`,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Resend error:', detail);
      return res.status(502).json({ error: "L'envoi a échoué. Réessayez ou contactez par email." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return res.status(500).json({ error: 'Erreur serveur. Réessayez plus tard.' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
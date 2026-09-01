const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

export async function sendContactMessage({
  name,
  email,
  phone = '',
  pole = 'Autre',
  type = 'Demande de devis',
  message,
  website = ''
}) {
  // Honeypot anti-spam
  if (website) {
    return { success: true };
  }

  const payload = {
    name,
    email,
    phone,
    pole,
    type,
    message,
    website
  };

  const apiResponse = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (apiResponse.ok) {
    return { success: true };
  }

  const apiError = await apiResponse.json().catch(() => ({}));

  const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (web3Key && (apiResponse.status === 503 || apiResponse.status === 404)) {
    const fallback = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: web3Key,
        name,
        email,
        message: `[Type: ${type} | Pôle: ${pole} | Tél: ${phone || 'Non renseigné'}]\n\n${message}`,
        subject: `[Bokengi Group] ${type} — ${pole} (${name})`,
        from_name: 'Bokengi Group Web',
        botcheck: website,
      }),
    });

    const fallbackData = await fallback.json();
    if (fallback.ok && fallbackData.success) {
      return { success: true };
    }

    throw new Error(fallbackData.message || "L'envoi a échoué.");
  }

  throw new Error(apiError.error || "L'envoi a échoué.");
}

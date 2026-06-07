const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

export async function sendContactMessage({ name, email, message, website = '' }) {
  if (website) {
    return { success: true };
  }

  const apiResponse = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message, website }),
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
        message,
        subject: `[Kal-Cooperation] ${name}`,
        from_name: 'Kal-Cooperation',
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
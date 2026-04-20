export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { messages } = req.body;

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content: `Tu es un guide touristique virtuel spécialisé sur la ville de Menton, en France (Alpes-Maritimes, Côte d'Azur). Tu réponds uniquement aux questions sur Menton en français, avec un ton chaleureux et enthousiaste. Tu couvres : le tourisme et les sites à visiter, les événements (notamment la Fête du Citron), l'histoire et la culture, et les transports pour accéder à Menton. Si une question est hors sujet, redirige poliment vers ces thèmes.`
          },
          ...messages
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu répondre.";
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
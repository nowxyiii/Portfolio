// api/send-mail.js
export default async function handler(req, res) {
    // 1. Sécurité : On n'accepte que les requêtes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    // 2. Préparation des données pour EmailJS
    const data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        accessToken: process.env.EMAILJS_PRIVATE_KEY, // C'est ici que la sécu se joue
        template_params: {
            from_name: name,
            from_email: email,
            message: message
        }
    };

    try {
        // 3. Envoi de la requête à EmailJS (côté serveur, invisible pour l'utilisateur)
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return res.status(200).json({ message: 'Email envoyé !' });
        } else {
            const errorData = await response.text();
            return res.status(500).json({ message: 'Erreur EmailJS', error: errorData });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erreur Serveur', error: error.message });
    }
}
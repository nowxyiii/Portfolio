// api/send-mail.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    const data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
            // CORRECTION ICI : On utilise les noms exacts de ton image EmailJS
            name: name,       // Correspond à {{name}}
            email: email,     // Correspond à {{email}}
            message: message, // Correspond à {{message}}
            title: "Portfolio Contact" // J'ajoute un titre car ton sujet est "Contact Us: {{title}}"
        }
    };

    try {
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
            console.error("ERREUR EMAILJS :", errorData);
            return res.status(500).json({ message: 'Erreur EmailJS', error: errorData });
        }
    } catch (error) {
        console.error("ERREUR SERVEUR :", error);
        return res.status(500).json({ message: 'Erreur Serveur', error: error.message });
    }
}
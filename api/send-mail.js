// api/send-mail.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

 const data = {
        service_id: "service_ugl1bfb",
        template_id: "template_xq98p7r",
        public_key: "ygJUBXwpM2gPIFzQQ",

    private_key: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
        name,
        email,
        message,
        title: "Portfolio Contact"
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
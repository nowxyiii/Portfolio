

export default async function handler(req, res) {
    // Autoriser uniquement POST
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { name, email, message } = req.body;

        // Vérification simple
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const data = {
            service_id: "service_ugl1bfb",
            template_id: "template_xq98p7r",
            user_id: "4PhUYs4uuntp8NH0J", // PUBLIC KEY
            accessToken: process.env.EMAILJS_PRIVATE_KEY, // PRIVATE KEY (env var)
            template_params: {
                name,
                email,
                message,
                title: "Portfolio Contact"
            }
        };

        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return res.status(200).json({ message: "Email envoyé avec succès !" });
        } else {
            const errorText = await response.text();
            console.error("ERREUR EMAILJS:", errorText);
            return res.status(500).json({ message: "Erreur EmailJS", error: errorText });
        }

    } catch (error) {
        console.error("ERREUR SERVEUR:", error);
        return res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}
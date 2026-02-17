export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { name, email, message, captchaToken } = req.body;

        if (!name || !email || !message || !captchaToken) {
            return res.status(400).json({ message: "Tous les champs sont requis, incluant le captcha." });
        }

        // 1. Vérification du token auprès de Google
        // Note: Utilise process.env.RECAPTCHA_SECRET_KEY sur Vercel pour plus de sécurité
        const secretKey = "6Lct424sAAAAAP8nzvda79XDomKZtF82xctQL8K3"; 
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

        const googleVerifyRes = await fetch(verifyUrl, { method: "POST" });
        const googleData = await googleVerifyRes.json();

        if (!googleData.success) {
            return res.status(400).json({ message: "Échec de la vérification bot." });
        }

        // 2. Préparation des données pour EmailJS
        const emailjsData = {
            service_id: "service_ugl1bfb",
            template_id: "template_xq98p7r",
            user_id: "ygJUBXwpM2gPIFzQQ", // PUBLIC KEY
            accessToken: process.env.EMAILJS_PRIVATE_KEY, // Assure-toi que cette variable est sur Vercel
            template_params: {
                name,
                email,
                message,
                title: "Portfolio Contact",
                'g-recaptcha-response': captchaToken // Optionnel mais recommandé pour EmailJS
            }
        };

        const emailjsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailjsData)
        });

        if (emailjsResponse.ok) {
            return res.status(200).json({ message: "Email envoyé avec succès !" });
        } else {
            const errorText = await emailjsResponse.text();
            console.error("ERREUR EMAILJS:", errorText);
            return res.status(500).json({ message: "Erreur EmailJS lors de l'envoi." });
        }

    } catch (error) {
        console.error("ERREUR SERVEUR:", error);
        return res.status(500).json({ message: "Erreur serveur interne." });
    }
} 
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { name, email, message, captchaToken } = req.body;

        if (!name || !email || !message || !captchaToken) {
            return res.status(400).json({ message: "Champs manquants." });
        }

        // --- CORRECTION ICI : Format spécifique pour Google ---
        const params = new URLSearchParams();
        params.append('secret', '6Lct424sAAAAAP8nzvda79XDomKZtF82xctQL8K3');
        params.append('response', captchaToken);

        const googleVerifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            body: params // Envoi en format URL encoded
        });

        const googleData = await googleVerifyRes.json();

        if (!googleData.success) {
            console.error("Détails erreur Google:", googleData["error-codes"]);
            return res.status(400).json({ message: "Échec de la vérification bot." });
        }

        // 2. Si Google valide, on envoie à EmailJS
        const emailjsData = {
            service_id: "service_ugl1bfb",
            template_id: "template_xq98p7r",
            user_id: "ygJUBXwpM2gPIFzQQ",
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: {
                name,
                email,
                message,
                title: "Portfolio Contact"
            }
        };

        const emailjsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailjsData)
        });

        if (emailjsResponse.ok) {
            return res.status(200).json({ message: "Email envoyé !" });
        } else {
            return res.status(500).json({ message: "Erreur EmailJS." });
        }

    } catch (error) {
        console.error("ERREUR:", error);
        return res.status(500).json({ message: "Erreur serveur." });
    }
}
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Méthode non autorisée" });
    }

    try {
        const { name, email, message, captchaToken } = req.body;

        // Validation des champs
        if (!name || !email || !message || !captchaToken) {
            return res.status(400).json({ message: "Champs manquants" });
        }

        // DEBUG temporaire
        console.log("Token reçu:", captchaToken?.slice(0, 20) + "...");
        console.log("Secret key prefix:", process.env.RECAPTCHA_SECRET_KEY?.slice(0, 10) + "...");

        // 1. Vérification avec Google
        const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        const googleResponse = await fetch(verifyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secretKey}&response=${captchaToken}`
        });

        const googleData = await googleResponse.json();
        console.log("Google response:", JSON.stringify(googleData));

        if (!googleData.success) {
            console.error("Google Reject:", googleData);
            return res.status(400).json({
                message: "Vérification bot échouée.",
                errors: googleData["error-codes"]
            });
        }

        // 2. Envoi vers EmailJS
        const emailjsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: "service_ugl1bfb",
                template_id: "template_xq98p7r",
                publicKey: "ygJUBXwpM2gPIFzQQ",
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: { name, email, message }
            })
        });

        if (emailjsResponse.ok) {
            return res.status(200).json({ message: "Succès" });
        } else {
            const errText = await emailjsResponse.text();
            return res.status(500).json({ message: "Erreur EmailJS", details: errText });
        }

    } catch (error) {
        console.error("Erreur inattendue:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
}
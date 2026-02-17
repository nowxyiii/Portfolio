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

        // 1. Vérification avec hCaptcha
        const verifyUrl = "https://hcaptcha.com/siteverify";
        const secretKey = process.env.HCAPTCHA_SECRET_KEY;

        const hCaptchaResponse = await fetch(verifyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secretKey}&response=${captchaToken}`
        });

        const hCaptchaData = await hCaptchaResponse.json();

        if (!hCaptchaData.success) {
            console.error("hCaptcha Reject:", hCaptchaData);
            return res.status(400).json({
                message: "Vérification bot échouée.",
                errors: hCaptchaData["error-codes"]
            });
        }

        // 2. Envoi vers EmailJS
        const emailjsResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: "service_ugl1bfb",
                template_id: "template_xq98p7r",
                user_id: "4PhUYs4uuntp8NH0J",
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
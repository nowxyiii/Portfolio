export default async function handler(req, res) {
    // 1. Autoriser uniquement la méthode POST
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { name, email, message, b_field, timestamp } = req.body;

        // --- SÉCURITÉ 1 : POT DE MIEL (HONEYPOT) ---
        // Si le champ caché 'b_field' est rempli, c'est un robot.
        if (b_field && b_field.length > 0) {
            console.warn("SPAM BLOQUÉ : Honeypot rempli.");
            // On fait croire au bot que ça a marché pour qu'il parte (status 200)
            return res.status(200).json({ message: "Bot détecté." });
        }

        // --- SÉCURITÉ 2 : VÉRIFICATION DE L'ORIGINE ---
        // On vérifie que la requête vient bien de ton site (ou localhost pour tes tests)
        const origin = req.headers.origin || req.headers.referer;
        if (!origin || (!origin.includes("vercel.app") && !origin.includes("localhost"))) {
             return res.status(403).json({ message: "Accès refusé : Source inconnue." });
        }

        // --- SÉCURITÉ 3 : ANTI-REPLAY (TEMPS) ---
        // Si le message a été signé il y a plus de 2 minutes, on rejette.
        // Cela empêche quelqu'un de copier ta requête et de la relancer à l'infini.
        const currentTime = Date.now();
        const requestTime = parseInt(timestamp);
        
        if (!requestTime || isNaN(requestTime)) {
             return res.status(400).json({ message: "Timestamp manquant." });
        }
        
        // 120000 ms = 2 minutes de validité
        if (currentTime - requestTime > 120000) {
            return res.status(403).json({ message: "Requête expirée. Veuillez recharger la page." });
        }


        // --- VÉRIFICATION DES CHAMPS CLASSIQUES ---
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        // Préparation pour EmailJS
        const data = {
            service_id: "service_ugl1bfb",
            template_id: "template_xq98p7r",
            user_id: "4PhUYs4uuntp8NH0J",
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: {
                name,
                email,
                message,
                title: "Portfolio Contact"
            }
        };

        // Envoi à EmailJS
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
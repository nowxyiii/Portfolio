
// Attendre que la page soit chargée
document.addEventListener("DOMContentLoaded", () => {
    // -------- Animation fadeInUp du bloc central --------
    const centerRect = document.querySelector(".center-rectangle");
    if (centerRect) {
        centerRect.style.opacity = "0";
        centerRect.style.transform = "translateY(20px)";

        setTimeout(() => {
            centerRect.style.transition = "opacity 1s ease, transform 1s ease";
            centerRect.style.opacity = "1";
            centerRect.style.transform = "translateY(0)";
        }, 100);
    }

    // -------- Effets hover (JS au lieu de CSS) --------
    // Navbar links
    document.querySelectorAll(".navbar li a").forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.style.transition = "color 0.3s ease, transform 0.2s ease";
            link.style.color = "#00aaff";
            link.style.transform = "scale(1.05)";
        });
        link.addEventListener("mouseleave", () => {
            link.style.color = "#f5f5f5";
            link.style.transform = "scale(1)";
        });
    });

    // Effet hover sur .center-rectangle
    if (centerRect) {
        centerRect.addEventListener("mouseenter", () => {
            centerRect.style.transition = "all 0.3s ease";
            centerRect.style.transform = "translateY(-5px)";
            centerRect.style.boxShadow = "0 0 20px rgba(0,170,255,0.7), 0 0 40px rgba(0,170,255,0.5)";
            centerRect.style.borderColor = "#00aaff";
        });
        centerRect.addEventListener("mouseleave", () => {
            centerRect.style.transform = "translateY(0)";
            centerRect.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
            centerRect.style.borderColor = "rgba(0,170,255,0.3)";
        });
    }

    // Effet hover sur image profil
    const profileImg = document.querySelector(".profile-img");
    if (profileImg) {
        profileImg.addEventListener("mouseenter", () => {
            profileImg.style.transition = "all 0.3s ease";
            profileImg.style.transform = "scale(1.05)";
            profileImg.style.boxShadow = "0 0 20px rgba(0,170,255,0.7)";
        });
        profileImg.addEventListener("mouseleave", () => {
            profileImg.style.transform = "scale(1)";
            profileImg.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        });
    }

    // Liens dans .links
    document.querySelectorAll(".links a, .redict").forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.style.transition = "color 0.3s ease";
            link.style.color = "#005f99";
        });
        link.addEventListener("mouseleave", () => {
            link.style.color = "#00aaff";
        });
    });

    // Bouton download
    const btn = document.querySelector(".btn-download");
    if (btn) {
        btn.addEventListener("mouseenter", () => {
            btn.style.transition = "all 0.3s ease";
            btn.style.color = "#fff";
            btn.style.background = "rgba(0,170,255,0.8)";
            btn.style.boxShadow = "0 0 20px rgba(0,170,255,0.8), 0 0 40px rgba(0,170,255,0.6)";
            btn.style.transform = "translateY(-3px)";
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.color = "#00aaff";
            btn.style.background = "rgba(255,255,255,0.1)";
            btn.style.boxShadow = "0 0 10px rgba(0,170,255,0.5), 0 0 20px rgba(0,170,255,0.3)";
            btn.style.transform = "translateY(0)";
        });
    }
});


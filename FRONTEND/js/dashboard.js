document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("token invalide");
        window.location.href="connexion.html";
        return;
    }

    // Vérifier le token avec le backend
    fetch("http://localhost:3000/auth/verify-token", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(async res => {
        if (!res.ok) {
            throw new Error("Token invalide");
            
        }

        return res.json();
    })
    .then(res => {
        if (res.ok) {
            // ✅ déjà connecté → dashboard
        
        } else {
            localStorage.removeItem("token");
        }
    })
    .catch(() => {
        localStorage.removeItem("token");
    });
});

const logout_button = document.getElementById("logout");

logout_button.addEventListener("click", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    })
    .then(async res => {
        // même logique que login
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.message || "Erreur logout");
        }

        return data;
    })
    .then(data => {
        // nettoyage local
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        alert("Déconnexion réussie ✅");

        window.location.href = "connexion.html";
    })
    .catch(err => {
        // gestion erreur
        console.log(err);

        alert(err.message || "Erreur lors de la déconnexion");
    });
});
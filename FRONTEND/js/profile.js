document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:3000/auth/profile/infos", {
            credentials: "include"
        });

        if (!res.ok) {
            window.location.href = "connexion.html";
            return;
        }

        const user = await res.json();

        // 🔥 HEADER
        document.getElementById("headerUserName").innerText =user.nom;
        document.getElementById("headerAvatar").innerText = getInitials(user.prenom, user.nom);

        // 🔥 PROFILE HEADER
        document.getElementById("profileFullName").innerText =user.nom;
        document.getElementById("profileEmail").innerText = user.email;
        document.getElementById("profileClassBadge").innerText = "Classe: " + user.filiere;

        // 🔥 INFOS
        document.getElementById("displayLastName").innerText = user.nom;
        document.getElementById("displayEmail").innerText = user.email;
        document.getElementById("displayClass").innerText = user.filiere;

        // 🔥 AVATAR
        document.getElementById("avatarInitial").innerText = getInitials(user.prenom, user.nom);

        // 🔥 MESSAGE
        document.getElementById("welcomeMessage").innerHTML =
            `<i class="fas fa-smile-wink"></i> Bienvenue, ${user.nom} — votre classe ${user.filiere}`;

    } catch (err) {
        console.error(err);
        window.location.href = "connexion.html";
    }
});

document.getElementById("changePasswordBtn").addEventListener("click",function(){
    const mdp = document.getElementById("oldPassword").value;
    const newPassword= document.getElementById("newPassword").value;
    fetch("http://localhost:3000/auth/reset-password", {
        method: "POST",
        credentials:"include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            newPassword
        })
    })
    .then(async res => {
        const data = await res.json();

        if (!res.ok) {
            // 🔥 gestion des erreurs serveur (429, 400...)
            throw new Error(data.message || data.status || "Erreur");
        }

        return data;
    })
    .then(data => {
        alert("mot de passe changé avec succès");
        window.location.href="connexion.html";
        
    }).catch(err =>{
        document.getElementById("erreur").style.color="red";
        document.getElementById("erreur").innerText=err.message;

    });

});

function getInitials(prenom, nom) {
    if (!prenom || !nom) return "👤";
    return (prenom[0] + nom[0]).toUpperCase();
}
const form = document.getElementById("myform");

form.addEventListener("submit",function (event) {
    event.preventDefault();
    const email=localStorage.getItem("email");
    const newPassword=document.getElementById("password").value;
    
    

    fetch("http://localhost:3000/auth/reset-password", {
        method: "POST",
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
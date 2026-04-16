document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/auth/verify-token", {
        method: "GET",
        credentials: "include" 
    })
    .then(async res => {
        const data = await res.json(); 
        if (!res.ok) {
            window.location.href = "connexion.html";
            return;
        }
        return data;
    })
    .then(data => {
        console.log("Utilisateur connecté :", data.user);
        let nom=document.getElementById("user-name");
    let initials=document.getElementById("user-avatar");
    let greeting_name=document.getElementById("greeting-name");
    fetch("http://localhost:3000/auth/profile", {
        method: "GET",
        credentials: "include" 
    }).then(async res =>{
        const data=await res.json(); 
        if (!res){
            alert("erreur serveur");
            return;
        }
        return data;

    }).then(data=>{
        nom.innerText=data.nom;
        initials.innerText=getInitials(data.nom);
        if (greeting_name!==null) greeting_name.innerText=data.nom.split(" ")[0];

    }).catch((e)=>{
        alert(e);
    });
    })
    .catch(() => {
        window.location.href = "connexion.html";
    });
    

});
function getInitials(fullName) {
    if (!fullName) return "";

    const words = fullName.trim().split(" ");

    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
}
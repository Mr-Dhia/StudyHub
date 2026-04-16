calculer_documents();
filiere();


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
            alert("erreur res");
            return;
        }
        return data;

    }).then(data=>{
        nom.innerText=data.nom;
        initials.innerText=getInitials(data.nom);
        greeting_name.innerText=data.nom.split(" ")[0];

    }).catch((e)=>{
        alert(e);
    });
    })
    .catch(() => {
        window.location.href = "connexion.html";
    });
    

});

const logout_button = document.getElementById("logout");

logout_button.addEventListener("click", function (event) {
    event.preventDefault();

    fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include"
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Erreur logout");
        }

        return res.json();
    })
    .then(() => {
        window.location.href = "connexion.html";
    })
    .catch(err => {
        console.log(err);
    });
});

async function calculer_documents() {
    const res = await fetch("http://localhost:3000/auth/files/all");
    const data = await res.json();
    let nb_doc=document.getElementById("info-docs");

    if (data.count===1){
        nb_doc.innerText="1 fichier";
    }
    else{
        nb_doc.innerText=`${data.count} fichiers`;
    }
}

async function filiere() {
    const res = await fetch("http://localhost:3000/auth/filiere", {
    credentials: "include"
});
     const data = await res.json();
     let filiere=document.getElementById("info-filiere");
     filiere.innerText=data.filiere;
}

function getInitials(fullName) {
    if (!fullName) return "";

    const words = fullName.trim().split(" ");

    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
}
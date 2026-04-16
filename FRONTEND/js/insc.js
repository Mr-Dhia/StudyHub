    let nominput = document.getElementById("nom");
    let emailinput = document.getElementById("email");
    let idinput = document.getElementById("id");
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    let filiere = document.getElementById("filiere").value;


    

    //champs des erreurs
        let ernom=document.getElementById("ernom");
        let eremail=document.getElementById("eremail");
        let erid=document.getElementById("erid");
        let erfil=document.getElementById("erfil");
        let erclasse=document.getElementById("erclasse");
        let ermdp=document.getElementById("ermdp");
        let ercmdp=document.getElementById("ercmdp");

    function validerForm() {
    let nom = nominput.value.trim();
    let email = emailinput.value.trim();
    let id = idinput.value.trim();
    let filiere = document.getElementById("filiere").value;
    let classe = document.querySelector('input[name="classe"]:checked');
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    // 2. Nom valide (lettres seulement + max 50)
    let nomRegex = /^[A-Za-z\s]{1,50}$/;
    if (!nomRegex.test(nom)) {
        ernom.innerHTML="Nom invalide (lettres seulement, max 50 caractères)<br><br>";
        nominput.value = "";     // vider champ
        nominput.focus();        // remettre curseur dessus
        nominput.style.border = "2px solid red";
        return false;
    }

    // 3. Email valide
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        eremail.innerHTML="Email invalide <br><br>";
        emailinput.value = "";     // vider champ
        emailinput.focus();        // remettre curseur dessus
        emailinput.style.border = "2px solid red";
        return false;
    }
    if ((id.length !=9)) {
        erid.innerHTML="idetifient  invalide<br><br>";
        idinput.value = "";     // vider champ
        idinput.focus();        // remettre curseur dessus
        idinput.style.border = "2px solid red";
        return false;}

    // 4. Filière choisie
    if (!filiere ) {
        erfil.innerHTML="Veuillez choisir une filière";
        return false;
    }

    // 5. Classe choisie
    if (!classe) {
        erclasse.innerHTML="Veuillez choisir une classe <br><br>";
        return false;
    }

    // 6. Mot de passe fort
    let passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    if (!passRegex.test(password)) {
        document.getElementById("password").style.border = "2px solid red";
        ermdp.innerHTML="Mot de passe faible (min 6 caractères, majuscule, minuscule, chiffre)<br><br>";
        return false;
    }

    // 7. Confirmation mot de passe
    if (password !== confirm) {
        document.getElementById("confirm").style.border = "2px solid red";
        ercmdp.innerHTML="Les mots de passe ne correspondent pas <br><br>";
        return false;
    }

    return true;
}
const form = document.getElementById("myform");

form.addEventListener("submit", function(event) {
    event.preventDefault(); 

    if (!validerForm()) {
        return;
    }

    let nom = nominput.value.trim();
    let email = emailinput.value.trim();
    let id = idinput.value.trim();
    let filiere = document.getElementById("filiere").value;
    let classe = document.querySelector('input[name="classe"]:checked');
    let password = document.getElementById("password").value;

    fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nom: nom,
            email: email,
            id: id,
            password: password,
            filiere: filiere,
            classe: classe.value,
            role:"etudiant"
        })
    })
    .then(res => res.text())
    .then(data => {
        if(data==="EMAIL_EXISTS"){
            emailinput.style.border = "2px solid red";
            eremail.innerHTML = "Email deja existe<br><br>";
        }
        else if (data === "OK") {
            alert("Inscription réussie !");
            window.location.href = "etudiant.html";
        }
    });
});
nominput.addEventListener("input", function () {
    nominput.style.border = "";
    ernom.innerHTML = "";
});
emailinput.addEventListener("input", function () {
    emailinput.style.border = "";
    eremail.innerHTML = "";
});
idinput.addEventListener("input", function () {
    idinput.style.border = "";
    erid.innerHTML = "";
});
document.getElementById("password").addEventListener("input", function () {
    document.getElementById("password").style.border = "";
    ermdp.innerHTML = "";
});
document.getElementById("confirm").addEventListener("input", function () {
    document.getElementById("confirm").style.border = "";
    ercmdp.innerHTML = "";
});
document.getElementById("filiere").addEventListener("change", function () {
    erfil.textContent = "";
});
let radios = document.querySelectorAll('input[name="classe"]');

radios.forEach(radio => {
    radio.addEventListener("change", function () {
        erclasse.textContent = "";
    });
});

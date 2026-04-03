const form = document.getElementById("myform");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
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
        localStorage.setItem("token", data.token);
        if (data.role==="admin")
        {   
            if (data.status === "CODE_SENT") 
            {
                localStorage.setItem("email", email);
                localStorage.setItem("role", data.role);
                alert("Code envoyé par email 📧");
                window.location.href = "code.html";
            } 
        }
    else if(data.role=="etudiant"){
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    }
    
}).catch(err => {
        if (err.message!=="KO"){
        document.getElementById("erreur").style.color = "red";
        document.getElementById("erreur").innerHTML = err.message;
        }
        else {
        document.getElementById("erreur").style.color="red";
        document.getElementById("erreur").innerHTML="Email ou mot de passe incorrect ❌<br><br>";
        document.getElementById("password").value = "";
        document.getElementById("password").focus();
    }
        
    });
});

document.getElementById("email").addEventListener("input", function () {
    document.getElementById("erreur").innerHTML = "";
});

document.getElementById("password").addEventListener("input", function () {
    document.getElementById("erreur").innerHTML = "";
});
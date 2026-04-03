const form = document.getElementById("myform");

form.addEventListener("submit",function (event) {
    event.preventDefault();
    const email=localStorage.getItem("email");
    const code = document.getElementById("code").value;
    

    fetch("http://localhost:3000/auth/verify-reset-code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            code,
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
        localStorage.setItem("email",email);
        window.location.href="change_password.html";
        
    }).catch(err =>{
        document.getElementById("erreur").style.color="red";
        document.getElementById("erreur").innerText=err.message;

    });
});
const form = document.getElementById("myform");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const button = form.querySelector("button");
    button.disabled = true;

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    fetch("http://localhost:3000/auth/login", {
        method: "POST",
        credentials: "include",
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
            throw new Error(data.message || data.status || "Erreur");
        }

        return data;
    })
    .then(data => {
        if (data.role === "admin" && data.status === "CODE_SENT") {
            localStorage.setItem("email", email);
            localStorage.setItem("role", data.role);

            window.location.href = "code.html";
            return;
        }

        else if (data.role === "etudiant" && data.status === "OK") {

            window.location.href = "dashboard.html";
        }
    })
    .catch(err => {
        const msg = err?.message || "Erreur inconnue";

        if (msg === "KO") {
            document.getElementById("erreur").innerHTML =
                "Email ou mot de passe incorrect ❌<br><br>";

            document.getElementById("password").value = "";
            document.getElementById("password").focus();
        } else {
            document.getElementById("erreur").innerHTML = msg;
        }

        document.getElementById("erreur").style.color = "red";
    })
    .finally(() => {
        button.disabled = false;
    });
});

document.getElementById("email").addEventListener("input", function () {
    document.getElementById("erreur").innerHTML = "";
});

document.getElementById("password").addEventListener("input", function () {
    document.getElementById("erreur").innerHTML = "";
});
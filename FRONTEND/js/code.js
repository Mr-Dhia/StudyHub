const form = document.getElementById("myform");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    let email = localStorage.getItem("email"); 
    let role = localStorage.getItem("role"); 
    let code = document.getElementById("code").value;

    fetch("http://localhost:3000/auth/verify", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, code })
})
.then(async res => {
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || data.status || "Erreur");
        }

        return data;
    })
.then(data => {
    if (data.status === "OK") {
        localStorage.setItem("token", data.token)
        window.location.href = "dashboard.html";
    }
    
}).catch(err => {
        document.getElementById("erreur").style.color = "red";
        document.getElementById("erreur").innerHTML = err.message;   
    });
});

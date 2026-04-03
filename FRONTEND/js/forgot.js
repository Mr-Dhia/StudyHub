const form = document.getElementById("myform");
form.addEventListener("submit",function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;

    fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        localStorage.setItem("email", email);
        window.location.href = "forgot_code.html";
    });
});


function login(event) {
    event.preventDefault();

    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mobile: mobile,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Invalid credentials");
        }
        return response.json();
    })
    .then(data => {
        msg.style.color = "green";
        msg.innerText = "Login successful 🚀";

        // redirect
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    })
    .catch(error => {
        msg.style.color = "red";
        msg.innerText = "Invalid mobile or password ❌";
    });
}

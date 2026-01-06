const API_URL = "http://localhost:8085/auth/login";

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mobileNo = document.getElementById("mobileNo").value;
    const password = document.getElementById("password").value;

    msg.innerText = "Logging in...";
    msg.style.color = "black";

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mobileNo: Number(mobileNo),
                password: password
            })
        });

        if (!res.ok) {
            msg.innerText = "Invalid mobile number or password ❌";
            msg.style.color = "red";
            return;
        }

        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        // Extract token and role from response
        const token = data.data.barrierToken;
        const roleRaw = data.data.role;

        console.log("ROLE VALUE:", roleRaw);
console.log("ROLE TYPE:", typeof roleRaw);

        // Save in localStorage
        localStorage.setItem("mobileNo", mobileNo);
        localStorage.setItem("role", roleRaw);
        localStorage.setItem("token", token);
        localStorage.setItem("destinationCity", null);

        msg.innerText = "Login successful ✅";
        msg.style.color = "green";

        // Redirect based on role
        setTimeout(() => {
            if (roleRaw === "CUSTOMER") window.location.href = "customer-dashboard.html";
            else if (roleRaw === "DRIVER") window.location.href = "driverdashboard.html";
            else {
                msg.innerText = "Unknown role returned from server ❌";
                msg.style.color = "red";
            }
        }, 1000);

    } catch (err) {
        console.error(err);
        msg.innerText = "Server not reachable ❌";
        msg.style.color = "red";
    }
});

// Get current location
function getLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            document.getElementById("latitude").value =
                position.coords.latitude.toFixed(6);

            document.getElementById("longitude").value =
                position.coords.longitude.toFixed(6);
        },
        () => alert("Location permission denied")
    );
}

// Submit customer data
document.getElementById("customerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const customerData = {
        name: document.getElementById("name").value,
        age: Number(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        mobileno: Number(document.getElementById("mobileno").value),
        email: document.getElementById("email").value,
        latitude: Number(document.getElementById("latitude").value),
        longitude: Number(document.getElementById("longitude").value),
        password: document.getElementById("password").value
    };

    console.log("Sending JSON:", customerData);

    fetch("http://localhost:8085/auth/register/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Customer Registered:", data);
        alert("Registration Successful ✅");
        window.location.href = "login.html";
    })
    .catch(error => {
        console.error(error);
        document.getElementById("message").innerText = "Registration failed ❌";
    });
});

// Get latitude & longitude from browser
function getLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            document.getElementById("latitude").value =
                position.coords.latitude;

            document.getElementById("longitude").value =
                position.coords.longitude;
        },
        function (error) {
            alert("Location permission denied");
        }
    );
}

// Submit form data to Spring Boot API
document.getElementById("customerForm").addEventListener("submit", function (event) {
    event.preventDefault();

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

    fetch("http://localhost:8085/auth/register/customer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customerData)
    })
   .then(response => response.json())
.then(data => {

    console.log("Customer Registered:", data);

    alert("Registration Successful ✅");

    // save customer identity for session
    localStorage.setItem("customerId", data.id || data.customerId || data.mobileno);
    localStorage.setItem("customerName", data.name);

    // redirect to dashboard
    window.location.href = "login.html";
})

    .catch(error => {
        console.error(error);
        document.getElementById("message").innerText = "Registration failed";
    });
});

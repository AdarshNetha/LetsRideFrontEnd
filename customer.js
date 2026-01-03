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
        name: name.value,
        age: Number(age.value),
        gender: gender.value,
        mobileno: Number(mobileno.value),
        email: email.value,
        latitude: Number(latitude.value),
        longitude: Number(longitude.value),
        password: password.value
    };

    fetch("http://localhost:8085/auth/register/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

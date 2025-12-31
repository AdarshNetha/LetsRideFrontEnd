document.getElementById("customerForm").addEventListener("submit", registerCustomer);

function registerCustomer(event) {
    event.preventDefault();

    const customerData = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        mobileNo: document.getElementById("mobileno").value,
        mail: document.getElementById("email").value,
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
        password: document.getElementById("password").value
    };

    fetch("http://localhost:8085/coustmer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
    })
    .then(response => {
        if (!response.ok) throw new Error("Registration failed");
        return response.json();
    })
    .then(data => {
        // ✅ Redirect to dashboard
        window.location.href = "customer-dashboard.html";
    })
    .catch(error => {
        alert("❌ Registration failed");
        console.error(error);
    });
    function dashboard(){
    window.location.href="customer-dashboard.html";
}
}


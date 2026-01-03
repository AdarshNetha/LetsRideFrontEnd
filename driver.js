function getLocation() {

    if (!navigator.geolocation) {
        alert("Geolocation not supported in this browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (pos) {

            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            document.getElementById("latitude").value = lat;
            document.getElementById("longitude").value = lon;

            alert("Location captured successfully ✅");
        },
        function (err) {
            alert("Please allow location access in browser settings ❌");
            console.error(err);
        }
    );
}


document.getElementById("driverForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const lat = document.getElementById("latitude").value;
    const lon = document.getElementById("longitude").value;

    if (!lat || !lon) {
        alert("Please click 'Get Current Location' before registering 📍");
        return;
    }

    const driverData = {
        licenceNo: 0,
        name: document.getElementById("name").value,
        age: parseInt(document.getElementById("age").value),
        gender: document.getElementById("gender").value,
        mobileNo: document.getElementById("mobileNo").value,
        mail: document.getElementById("email").value,
        upiid: document.getElementById("upiid").value,
        vehilename: document.getElementById("vehilename").value,
        vehileno: document.getElementById("vehileno").value,
        type: document.getElementById("type").value,
        model: document.getElementById("model").value,
        capacity: document.getElementById("capacity").value,
        lattitude: parseFloat(lat),
        longitude: parseFloat(lon),
        priceperKM: parseFloat(document.getElementById("priceperKM").value),
        averagespeed: parseInt(document.getElementById("averagespeed").value),
        password: document.getElementById("password").value
    };

    fetch("http://localhost:8085/auth/register/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driverData)
    })
        .then(data => {

    alert("Driver Registered Successfully ✅");

    console.log("Registered Driver:", data);

    // store driver id (or mobile) for future use
    localStorage.setItem("driverId", data.id || data.driverId || data.licenceNo);
    localStorage.setItem("driverName", data.name);

    // redirect to dashboard
    window.location.href = "login.html";
})

        .catch(err => {
            alert("Registration Failed ❌ Check console");
            console.error(err);
        });
});

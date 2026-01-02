document.getElementById("driverForm").addEventListener("submit", function(e) {
    e.preventDefault();
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


    const driverData = {
        licenceNo: parseInt(document.getElementById("name").value), // Update if needed
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
        longitude: parseFloat(document.getElementById("longitude").value),
        lattitude: parseFloat(document.getElementById("latitude").value),
        priceperKM: parseFloat(document.getElementById("priceperKM").value),
        averagespeed: parseInt(document.getElementById("averagespeed").value),
        password: document.getElementById("password").value
    };

    fetch("http://localhost:8080/driver/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(driverData)
    })
    .then(res => res.json())
    .then(data => {
        alert("Driver Registered Successfully ✅");
        console.log(data);
    })
    .catch(err => {
        alert("Registration Failed ❌");
        console.error(err);
    });
});

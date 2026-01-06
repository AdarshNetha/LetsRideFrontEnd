const mobileNo = localStorage.getItem("mobileNo");

function goBack() {
    window.history.back();
}

fetch(`http://localhost:8085/driver/${mobileNo}`)
    .then(res => res.json())
    .then(result => {

        const driver = result.data;

        document.getElementById("driverName").innerText = driver.name;
        document.getElementById("driverMobile").innerText = driver.mobileNo;
        document.getElementById("driverEmail").innerText = driver.email || "—";
        document.getElementById("driverCity").innerText =
            driver.vehicle?.currentcity || "Not updated";

        const statusEl = document.getElementById("driverStatus");

        if (driver.available) {
            statusEl.innerText = "Active";
            statusEl.classList.add("active");
        } else {
            statusEl.innerText = "Inactive";
            statusEl.classList.add("inactive");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Failed to load driver profile");
    });

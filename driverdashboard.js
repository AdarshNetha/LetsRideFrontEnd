/***********************
 * AUTH GUARD
 ***********************/
const role = localStorage.getItem("role");
const mobileNo = localStorage.getItem("mobileNo");
const token = localStorage.getItem("token");

if (!role || !role.includes("DRIVER") || !mobileNo || !token) {
    alert("Unauthorized ❌ Please login again");
    window.location.href = "login.html";
}

/***********************
 * CHECK DRIVER & VEHICLE STATUS ON PAGE LOAD
 ***********************/
window.addEventListener("load", () => {

    fetch(`http://localhost:8085/driver/${mobileNo}`, {
        method: "GET",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Failed to fetch driver");
        }
        return res.json();
    })
    .then(response => {

        console.log("Driver Details:", response);

        // store driver id
        localStorage.setItem("driverID", response.data.id);

        const vehicleStatus =
            response?.data?.vehicle?.availabilityStatus;

        console.log("Vehicle Status:", vehicleStatus);

        // if vehicle is booked → go to active booking page
        if (vehicleStatus === "BOOKED") {
            window.location.href = "driver-active-booking.html";
        }

    })
    .catch(err => {
        console.error("Driver fetch error:", err);
        alert("Unable to load driver details");
    });
});

/***********************
 * UPDATE LOCATION
 ***********************/
document.getElementById("updateLocationBtn").addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetch(
                `http://localhost:8085/driver/location?latitude=${latitude}&longitude=${longitude}&mobileNo=${mobileNo}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": token,
                        "Content-Type": "application/json"
                    }
                }
            )
            .then(res => {
                if (!res.ok) {
                    throw new Error("Location update failed");
                }
                return res.json();
            })
            .then(() => {
                document.getElementById("locationStatus").innerText =
                    `📍 Updated: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
                showToast("📍 Location Updated");
            })
            .catch(err => {
                console.error(err);
                alert("Location update failed");
            });
        },
        () => alert("Location permission denied")
    );
});

/***********************
 * ONLINE / OFFLINE TOGGLE
 ***********************/
document.getElementById("onlineToggle").addEventListener("change", (e) => {

    const status = e.target.checked ? "AVAILABLE" : "UNAVAILABLE";

    fetch(
        `http://localhost:8085/driver/AvailableDriver?mobileno=${mobileNo}&status=${status}`,
        {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            }
        }
    )
    .then(res => {
        if (!res.ok) {
            throw new Error("Status update failed");
        }
        return res.json();
    })
    .then(response => {
        console.log("Driver Status Updated:", response);

        showToast(
            status === "AVAILABLE"
                ? "🟢 You are now AVAILABLE"
                : "🔴 You are now UNAVAILABLE"
        );
    })
    .catch(err => {
        console.error(err);
        alert("Unable to update status");
        e.target.checked = !e.target.checked; // rollback toggle
    });
});

/***********************
 * GO TO BOOKING HISTORY
 ***********************/
function goToHistory() {
    window.location.href = "driver-booking-history.html";
}

/***********************
 * TOAST MESSAGE
 ***********************/
function showToast(msg) {
    const toast = document.createElement("div");
    toast.innerText = msg;
    toast.style.position = "fixed";
    toast.style.bottom = "80px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#000";
    toast.style.border = "1px solid cyan";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "12px";
    toast.style.boxShadow = "0 0 18px cyan";
    toast.style.color = "#fff";
    toast.style.zIndex = "999";

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
}

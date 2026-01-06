/* AUTH GUARD */
const role = localStorage.getItem("role");
if (!role || !role.includes("DRIVER")) {
    alert("Unauthorized ❌");
    window.location.href = "login.html";
}

/* UPDATE LOCATION */
document.getElementById("updateLocationBtn").addEventListener("click", () => {

    const mobileNo = localStorage.getItem("mobileNo");

    if (!mobileNo) {
        alert("Please login again");
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch(`http://localhost:8085/driver/location?latitude=${latitude}&longitude=${longitude}&mobileNo=${mobileNo}`, {
            method: "PUT"
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById("locationStatus").innerText =
                `📍 Updated: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
            showToast("📍 Location Updated");
        })
        .catch(() => alert("Location update failed"));
    });
});

/* ONLINE / OFFLINE */
document.getElementById("onlineToggle").addEventListener("change", e => {
    showToast(e.target.checked ? "🟢 You are Active" : "🔴 You are Inactive");
});

/* BOOKING HISTORY */
function goToHistory() {
    window.location.href = "driver-booking-history.html";
}

/* TOAST */
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
    toast.style.zIndex = "999";

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
}

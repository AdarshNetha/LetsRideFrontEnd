/* AUTH GUARD */
const role = localStorage.getItem("role");
if (!role || !role.includes("DRIVER")) {
    alert("Unauthorized ❌");
    window.location.href = "login.html";
}

/* DRIVER NAME */
document.getElementById("driverName").innerText =
    "Welcome, Driver 👋";

/* ONLINE / OFFLINE */
const toggle = document.getElementById("onlineToggle");

toggle.addEventListener("change", () => {
    if (toggle.checked) {
        showToast("🟢 You are Active");
        // TODO: API → /driver/online
    } else {
        showToast("🔴 You are Inactive");
        // TODO: API → /driver/offline
    }
});

/* UPDATE LOCATION */
document
  .getElementById("updateLocationBtn")
  .addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        document.getElementById("locationStatus").innerText =
            `📍 Updated: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

        showToast("📍 Location Updated");

        // TODO: Backend API
        // fetch("/driver/update-location", { ... })
    });
});

/* BOOKING HISTORY */
function goToHistory() {
    window.location.href = "driver-booking-history.html";
}

/* TOAST */
function showToast(msg) {
    const t = document.createElement("div");
    t.innerText = msg;
    t.style.position = "fixed";
    t.style.bottom = "90px";
    t.style.left = "50%";
    t.style.transform = "translateX(-50%)";
    t.style.background = "rgba(0,0,0,.9)";
    t.style.padding = "10px 18px";
    t.style.borderRadius = "10px";
    t.style.border = "1px solid cyan";
    t.style.boxShadow = "0 0 18px cyan";
    t.style.zIndex = "999";

    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1800);
}

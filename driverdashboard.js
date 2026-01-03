/* Load Driver Data from LocalStorage */
const driver = JSON.parse(localStorage.getItem("driverData"));

if (driver) {
    document.getElementById("driverName").innerText =
        "Welcome, " + driver.name + " 👋";
}

/* Online / Offline Status */
const toggle = document.getElementById("onlineToggle");

toggle.addEventListener("change", () => {
    if (toggle.checked) {
        console.log("Driver ONLINE");
        showToast("🟢 You are now Online");
    } else {
        console.log("Driver OFFLINE");
        showToast("🔴 You are now Offline");
    }
});

/* Toast Notification */
function showToast(msg) {
    const t = document.createElement("div");
    t.innerText = msg;
    t.style.position = "fixed";
    t.style.bottom = "90px";
    t.style.left = "50%";
    t.style.transform = "translateX(-50%)";
    t.style.background = "rgba(0,0,0,.85)";
    t.style.padding = "10px 16px";
    t.style.borderRadius = "10px";
    t.style.border = "1px solid cyan";
    t.style.boxShadow = "0 0 18px cyan";
    t.style.animation = "fadein .4s";

    document.body.appendChild(t);

    setTimeout(() => t.remove(), 1800);
}

/* Weekly Earnings Chart */
const ctx = document.getElementById("weeklyChart");

new Chart(ctx, {
    type: "line",
    data: {
        labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        datasets: [{
            label: "Weekly Earnings",
            data: [120,180,150,240,210,90,160],
            borderWidth: 3,
            borderColor: "#00ffee",
            fill: false,
            tension: .4
        }]
    },
    options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    }
});

/* -------- Booking Requests ---------- */

const bookingRequests = document.getElementById("bookingRequests");

const sampleRequests = [
    { id: 201, pickup: "City Mall", drop: "Airport", fare: 240 },
    { id: 202, pickup: "Tech Park", drop: "Metro Station", fare: 160 }
];

function loadBookings() {
    bookingRequests.innerHTML = "";

    sampleRequests.forEach(b => {
        const li = document.createElement("li");

        li.innerHTML = `
        <strong>Pickup:</strong> ${b.pickup}<br>
        <strong>Dropoff:</strong> ${b.drop}<br>
        <strong>Fare:</strong> ₹${b.fare}<br><br>

        <button onclick="acceptBooking(${b.id})">✅ Accept</button>
        <button class="reject" onclick="rejectBooking(${b.id})">❌ Reject</button>
        `;

        bookingRequests.appendChild(li);
    });
}

loadBookings();

/* Accept Booking */
function acceptBooking(id) {
    showToast("✔ Booking Accepted");

    console.log("Accepted Booking ID:", id);

    // TODO: Replace with backend API
    // fetch(`/booking/accept/${id}`, { method: "POST" })
}

/* Reject Booking */
function rejectBooking(id) {
    showToast("❌ Booking Rejected");

    console.log("Rejected Booking ID:", id);

    // TODO: Backend call
}

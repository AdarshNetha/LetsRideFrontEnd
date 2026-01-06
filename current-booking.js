const mobileNo = localStorage.getItem("mobileNo");

const card = document.getElementById("bookingCard");
const statusMsg = document.getElementById("statusMsg");

fetch(`http://localhost:8085/driver/availableBooking?mobileno=${mobileNo}`)
    .then(res => res.json())
    .then(result => {

        if (!result.data) {
            statusMsg.innerText = "❌ No Active Booking Available";
            statusMsg.className = "error";
            return;
        }

        const b = result.data;

        document.getElementById("bookingId").innerText = b.bookingId;
        document.getElementById("customerName").innerText = b.customerName;
        document.getElementById("customerMobile").innerText = b.customerMobile;
        document.getElementById("pickup").innerText = b.pickupLocation;
        document.getElementById("drop").innerText = b.dropLocation;
        document.getElementById("distance").innerText = b.distanceTravelled;
        document.getElementById("fare").innerText = b.fare;

        card.classList.remove("hidden");
        statusMsg.innerText = "✅ Active Booking Found";
        statusMsg.className = "success";
    })
    .catch(() => {
        statusMsg.innerText = "⚠️ Failed to load booking";
        statusMsg.className = "error";
    });

function goToOtp() {
    window.location.href = "verify-otp.html";
}

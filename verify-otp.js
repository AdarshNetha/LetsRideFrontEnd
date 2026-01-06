function verifyOtp() {

    const bookingId = document.getElementById("bookingId").value;
    const otp = document.getElementById("otp").value;
    const statusMsg = document.getElementById("statusMsg");

    if (!bookingId || !otp) {
        statusMsg.innerText = "Please enter Booking ID and OTP";
        statusMsg.className = "error";
        return;
    }

    fetch(`http://localhost:8085/driver/booking/${bookingId}/verify-otp?otp=${otp}`, {
        method: "POST"
    })
    .then(res => {
        if (!res.ok) throw new Error("Invalid OTP");
        return res.json();
    })
    .then(result => {
        statusMsg.innerText = "✅ Ride Started Successfully";
        statusMsg.className = "success";

        // Optional redirect
        setTimeout(() => {
            window.location.href = "driverdashboard.html";
        }, 1500);
    })
    .catch(() => {
        statusMsg.innerText = "❌ Invalid OTP. Try again.";
        statusMsg.className = "error";
    });
}

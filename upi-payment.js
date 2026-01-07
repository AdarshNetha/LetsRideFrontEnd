function generateQR() {
    const bookingId = document.getElementById("bookingId").value;
    const msg = document.getElementById("msg");
    const qrSection = document.getElementById("qrSection");
    const qrImage = document.getElementById("qrImage");

    if (!bookingId) {
        msg.style.color = "red";
        msg.innerText = "Please enter Booking ID";
        return;
    }

    fetch(`http://localhost:8085/payment/upi?bookingId=${bookingId}`, {
        method: "POST"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to generate QR");
        }
        return response.blob(); // because backend returns byte[]
    })
    .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        qrImage.src = imageUrl;
        qrSection.classList.remove("hidden");
        msg.style.color = "green";
        msg.innerText = "Scan the QR to complete payment";
    })
    .catch(error => {
        console.error(error);
        msg.style.color = "red";
        msg.innerText = "Error generating QR ❌";
    });
}

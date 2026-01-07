function confirmCashPayment() {
    const bookingId = document.getElementById("bookingId").value;
    const paymentType = document.getElementById("paymentType").value;
    const msg = document.getElementById("msg");

    if (!bookingId) {
        msg.style.color = "red";
        msg.innerText = "Please enter Booking ID";
        return;
    }

    fetch(`http://localhost:8085/payment/cash?bookingId=${bookingId}&paymentType=${paymentType}`, {
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        if (data.statuscode === 200) {
            msg.style.color = "green";
            msg.innerText = "Payment Successful ✅";
        } else {
            msg.style.color = "red";
            msg.innerText = "Payment Failed ❌";
        }
    })
    .catch(error => {
        msg.style.color = "red";
        msg.innerText = "Server Error ❌";
        console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    const mobileNo = localStorage.getItem("mobileNo");
    const token = localStorage.getItem("token");
    const driverID = localStorage.getItem("driverID");

    const msg = document.getElementById("msg");
    const card = document.getElementById("bookingCard");
    const actionBox = document.getElementById("actionBox");
    const paymentBox = document.getElementById("paymentBox");

    if (!mobileNo || !token) {
        msg.innerText = "Unauthorized access ❌";
        msg.style.color = "red";
        return;
    }

    /* ================= FETCH ACTIVE BOOKING ================= */
    fetch(`http://localhost:8085/driver/availableBooking?mobileno=${mobileNo}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(result => {

        if (!result.data) {
            msg.innerText = "No active booking found 🚫";
            msg.style.color = "yellow";
            return;
        }

        const data = result.data;
        localStorage.setItem("bookingId", data.bookingid);

        document.getElementById("custName").innerText = data.customerName;
        document.getElementById("custMobile").innerText = data.mobileNo;
        document.getElementById("pickup").innerText = data.source;
        document.getElementById("status").innerText = data.bookingstatus;

        card.classList.remove("hidden");

        if (data.bookingstatus === "BOOKED") {
            actionBox.classList.remove("hidden");
        }

        if (data.bookingstatus === "STARTED" || data.bookingstatus === "on Going") {
            paymentBox.classList.remove("hidden");
        }

        /* ================= PICKUP ================= */
        document.getElementById("pickupBtn").onclick = () => {
            const otp = document.getElementById("otpInput").value;
            if (!otp) {
                alert("Please enter OTP");
                return;
            }

            fetch(`http://localhost:8085/driver/booking/${data.bookingid}/verify-otp?otp=${otp}`, {
                method: "POST",
                headers: {
                    "Authorization": token
                }
            })
            .then(res => res.json())
            .then(() => {
                alert("Pickup confirmed ✅");
                document.getElementById("status").innerText = "STARTED";
                actionBox.classList.add("hidden");
                paymentBox.classList.remove("hidden");
            })
            .catch(() => alert("Invalid OTP ❌"));
        };

        /* ================= CANCEL ================= */
        document.getElementById("cancelBtn").onclick = () => {
            fetch(`http://localhost:8085/driver/booking/${data.bookingid}/cancel?driverId=${driverID}`, {
                method: "PUT",
                headers: {
                    "Authorization": token
                }
            })
            .then(() => {
                alert("Booking cancelled ❌");
                window.location.href = "driverdashboard.html";
            })
            .catch(() => alert("Cancellation failed"));
        };

    })
    .catch(() => {
        msg.innerText = "No active booking found 🚫";
        msg.style.color = "yellow";
    });

    /* ================= CASH PAYMENT ================= */
    document.getElementById("cashBtn").onclick = () => {
        const bookingId = localStorage.getItem("bookingId");

        fetch(`http://localhost:8085/driver/payment/cash?bookingId=${bookingId}&paymentType=CASH`, {
            method: "POST",
            headers: {
                "Authorization": token
            }
        })
        .then(res => res.json())
        .then(() => {
            alert("Cash payment completed ✅");
            window.location.href = "driverdashboard.html";
        })
        .catch(() => alert("Cash payment failed ❌"));
    };

    /* ================= UPI PAYMENT ================= */
    document.getElementById("upiBtn").onclick = () => {
        const bookingId = localStorage.getItem("bookingId");

        fetch(`http://localhost:8085/driver/payment/upi?bookingId=${bookingId}`, {
            method: "POST",
            headers: {
                "Authorization": token
            }
        })
        .then(res => res.json())
        .then(result => {
            showQrPopup(result.data);
        })
        .catch(() => alert("UPI payment failed ❌"));
    };

});

/* ================= QR POPUP FUNCTIONS ================= */

function showQrPopup(base64Data) {
    const popup = document.getElementById("qrPopup");
    const qrImg = document.getElementById("qrImage");

    qrImg.src = "data:image/png;base64," + base64Data;
    popup.classList.remove("hidden");

    document.getElementById("qrOkBtn").onclick = confirmQrPayment;
}

function confirmQrPayment() {
    const bookingId = localStorage.getItem("bookingId");
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8085/driver/payment/qr?bookingId=${bookingId}&paymentType=UPI`, {
        method: "POST",
        headers: {
            "Authorization": token
        }
    })
    .then(() => {
        alert("UPI payment completed ✅");
        window.location.href = "driverdashboard.html";
    })
    .catch(() => alert("QR confirmation failed ❌"));
}

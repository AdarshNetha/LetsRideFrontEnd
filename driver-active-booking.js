document.addEventListener("DOMContentLoaded", () => {

    const mobileNo = localStorage.getItem("mobileNo");
    const token = localStorage.getItem("token");
    const driverID = localStorage.getItem("driverID");

    const msg = document.getElementById("msg");
    const card = document.getElementById("bookingCard");
    const actionBox = document.getElementById("actionBox");
    const paymentBox = document.getElementById("paymentBox");

    // ================= AUTH CHECK =================
    if (!mobileNo || !token) {
        msg.innerText = "Unauthorized access ❌";
        msg.style.color = "red";
        return;
    }

    // ================= FETCH ACTIVE BOOKING =================
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

        // ================= FILL BOOKING DETAILS =================
        document.getElementById("custName").innerText = data.customerName;
        document.getElementById("custMobile").innerText = data.mobileNo;
        document.getElementById("pickup").innerText = data.source;
        document.getElementById("status").innerText = data.bookingstatus;

        card.classList.remove("hidden");

        // ================= RESET UI STATE =================
        actionBox.classList.add("hidden");
        paymentBox.classList.add("hidden");

        // ================= STATUS BASED UI =================
        switch (data.bookingstatus) {

            case "BOOKED":
                actionBox.classList.remove("hidden");
                break;

            case "STARTED":
                paymentBox.classList.remove("hidden");
                break;

            case "COMPLETED":
                window.location.href = "driverdashboard.html";
                break;
        }

        // ================= PICKUP (OTP VERIFY) =================
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

        // ================= CANCEL BOOKING =================
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

    // ================= CASH PAYMENT =================
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

    // ================= UPI PAYMENT =================
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
        .catch(() => alert("Failed to generate UPI QR ❌"));
    };

});

/// ================= QR POPUP =================
function showQrPopup(base64Qr) {

    const modal = document.getElementById("qrModal");
    const qrImg = document.getElementById("qrImage");
    const okBtn = document.getElementById("qrOkBtn");

    const bookingId = localStorage.getItem("bookingId");
    const token = localStorage.getItem("token");

    qrImg.src = "data:image/png;base64," + base64Qr;
    modal.classList.remove("hidden");

    okBtn.onclick = () => {

        fetch(`http://localhost:8085/driver/payment/qr?bookingId=${bookingId}&paymentType=QR`, {
            method: "POST",
            headers: {
                "Authorization": token
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("QR payment failed");
            }
            return res.json();
        })
        .then(() => {
            alert("UPI QR Payment Completed ✅");
            modal.classList.add("hidden");
            window.location.href = "driverdashboard.html";
        })
        .catch(() => {
            alert("Payment confirmation failed ❌");
        });
    };
}

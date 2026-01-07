document.addEventListener("DOMContentLoaded", () => {

    const mobileNo = localStorage.getItem("mobileNo");
    const token = localStorage.getItem("token");
    const driverID=localStorage.getItem("driverID");
    const msg = document.getElementById("msg");
    const card = document.getElementById("bookingCard");

    if (!mobileNo || !token) {
        msg.innerText = "Unauthorized access ❌";
        msg.style.color = "red";
        return;
    }

    fetch(`http://localhost:8085/driver/availableBooking?mobileno=${mobileNo}`, {
        method: "GET",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(result => {
        console.log(result);
    if (!result.data) {
        msg.innerText = "No active booking found 🚫";
        msg.style.color = "yellow";
        return;
    }

    const data = result.data;
    console.log(data);

    document.getElementById("custName").innerText = data.customerName;
    document.getElementById("custMobile").innerText = data.mobileNo;
    document.getElementById("pickup").innerText = data.source;
    document.getElementById("status").innerText = data.bookingstatus;

    card.classList.remove("hidden");
    msg.innerText = "";

    const actionBox = document.getElementById("actionBox");

    // Show buttons only if status is BOOKED
    if (data.bookingstatus === "BOOKED") {
        actionBox.classList.remove("hidden");
    }

    /* ================= PICK UP ================= */
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
        .then(res => {
            alert("Pickup confirmed ✅");

            // Update booking status on UI
            document.getElementById("status").innerText = res.bookingStatus || "STARTED";
            actionBox.classList.add("hidden");
        })
        .catch(err => {
            console.error(err);
            alert("Invalid OTP ❌");
        });
    };

    /* ================= CANCEL ================= */
    document.getElementById("cancelBtn").onclick = () => {

        fetch(`http://localhost:8085/driver/booking/${data.bookingid}/cancel?driverId=${driverID}`, {
            method: "PUT",
            headers: {
                "Authorization": `${token}`
            }
        })
        .then(res => res.json())
        .then(() => {
            alert("Booking cancelled successfully ❌");
            window.location.href = "driverdashboard.html";
        })
        .catch(err => {
            console.error(err);
            alert("Cancellation failed");
        });
    };
})

    .catch(err => {
        console.error(err);
        msg.innerText = "No active booking found 🚫";
        msg.style.color = "yellow";
    });
  
    
    
});

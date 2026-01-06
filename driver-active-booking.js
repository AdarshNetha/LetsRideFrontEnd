const mobileNo = localStorage.getItem("mobileNo");
const token = localStorage.getItem("token");

const msg = document.getElementById("msg");
const card = document.getElementById("bookingCard");

if (!mobileNo || !token) {
    msg.innerText = "Unauthorized access ❌";
    msg.style.color = "red";
} else {
    fetch(`http://localhost:8085/customer/active-booking/${mobileNo}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("No active booking");
        }
        return res.json();
    })
    .then(response => {
        if (!response.data) {
            msg.innerText = "No active booking found 🚫";
            msg.style.color = "yellow";
            return;
        }

        const data = response.data;

        document.getElementById("custName").innerText = data.custname;
        document.getElementById("custMobile").innerText = data.custmobileno;
        document.getElementById("pickup").innerText = data.currentlocation;
        document.getElementById("status").innerText = data.booking.bookingStatus;

        card.classList.remove("hidden");
    })
    .catch(err => {
        msg.innerText = "No active booking found 🚫";
        msg.style.color = "yellow";
    });
}

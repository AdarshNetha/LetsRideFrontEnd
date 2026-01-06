const HISTORY_API = "http://localhost:8085/customer/booking-history";

window.addEventListener("DOMContentLoaded", () => {
    fetchBookingHistory();
});

async function fetchBookingHistory() {
    try {
        const mobileNo = localStorage.getItem("mobileNo");
        const token = localStorage.getItem("token");

        if (!mobileNo || !token) {
            alert("Missing data. Redirecting...");
            window.location.href = "customer-dashboard.html";
            return;
        }

        const res = await fetch(
            `${HISTORY_API}?mobileno=${mobileNo}`,
            {
                method: "GET",
                headers: {
                    "Authorization": token
                }
            }
        );

        if (!res.ok) {
            throw new Error("Failed to fetch booking history");
        }

        const response = await res.json();
        renderHistory(response.data);

    } catch (err) {
        console.error(err);
        alert("Unable to load booking history");
    }
}

function renderHistory(data) {
    const container = document.getElementById("historyContainer");
    const totalDiv = document.getElementById("totalAmount");

    container.innerHTML = "";

    if (!data || !data.bookings || data.bookings.length === 0) {
        container.innerHTML = "<p>No booking history found</p>";
        totalDiv.innerHTML = "";
        return;
    }

    data.bookings.forEach(b => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <p><strong>Booking ID:</strong> ${b.bookingId}</p>
            <p><strong>From:</strong> ${b.fromLocation}</p>
            <p><strong>To:</strong> ${b.toLocation}</p>
            <p><strong>Distance:</strong> ${b.distance} km</p>
            <p><strong>Fare:</strong> ₹${b.fare}</p>
        `;

        container.appendChild(card);
    });

    totalDiv.innerText = `Total Amount Spent: ₹${data.totalAmount.toFixed(2)}`;
}

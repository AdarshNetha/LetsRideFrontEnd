const HISTORY_API = "http://localhost:8085/customer/booking-history";

window.addEventListener("DOMContentLoaded", () => {
    loadBookingHistory();
});

async function loadBookingHistory() {
    const mobileNo = localStorage.getItem("mobileNo");
    const token = localStorage.getItem("token");

    if (!mobileNo || !token) {
        alert("Please login again");
        window.location.href = "customer-dashboard.html";
        return;
    }

    try {
        const response = await fetch(
            `${HISTORY_API}?mobileno=${mobileNo}`,
            {
                method: "GET",
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch booking history");
        }

        const result = await response.json();
        console.log("Booking History Response:", result);

        // ✅ FIX HERE
        displayBookingHistory(result.data);

    } catch (error) {
        console.error("Error loading booking history:", error);
        alert("Unable to load booking history");
    }
}

function displayBookingHistory(data) {
    const historyContainer = document.getElementById("historyContainer");
    const totalAmountDiv = document.getElementById("totalAmount");

    historyContainer.innerHTML = "";
    totalAmountDiv.innerHTML = "";

    // ✅ CHANGE bookings → history
    if (!data || !data.history || data.history.length === 0) {
        historyContainer.innerHTML = "<p>No booking history found</p>";
        return;
    }

    data.history.forEach(booking => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>From:</strong> ${booking.fromLocation}</p>
            <p><strong>To:</strong> ${booking.toLocation}</p>
            <p><strong>Distance:</strong> ${booking.distance.toFixed(2)} km</p>
            <p><strong>Fare:</strong> ₹${booking.fare.toFixed(2)}</p>
            <p><strong>Status:</strong> COMPLETED</p>
        `;

        historyContainer.appendChild(card);
    });

    totalAmountDiv.innerText =
        `Total Amount Spent: ₹${data.totalAmount.toFixed(2)}`;
}

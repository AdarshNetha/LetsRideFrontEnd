const ACTIVE_BOOKING_API = "http://localhost:8085/customer/active-booking";
const CANCEL_BOOKING_API = "http://localhost:8085/customer/booking";
 const customerID =localStorage.getItem("customerID");
 console.log(customerID);
window.addEventListener("DOMContentLoaded", () => {
    fetchActiveBooking();
});

async function fetchActiveBooking() {
    try {
        const mobileNo = localStorage.getItem("mobileNo");
        const token = localStorage.getItem("token");

        if (!mobileNo || !token) {
            alert("Missing data. Redirecting...");
            window.location.href = "customer-dashboard.html";
            return;
        }

        const res = await fetch(
            `${ACTIVE_BOOKING_API}/${mobileNo}`,
            {
                method: "GET",
                headers: {
                    "Authorization": token
                }
            }
        );

        if (!res.ok) {
            throw new Error("No active booking");
        }

        const response = await res.json();
        renderActiveBooking(response.data);
        console.log(response);

    } catch (error) {
        console.error(error);
        alert("No active booking found");
        window.location.href = "customer-dashboard.html";
    }
}

function renderActiveBooking(data) {
    const customerInfo = document.getElementById("customerInfo");
    const bookingCard = document.getElementById("bookingCard");
    const cancelBtn = document.getElementById("cancelBtn");

    // Customer details
    customerInfo.innerHTML = `
        <p><strong>Customer Name:</strong> ${data.custname}</p>
        <p><strong>Mobile No:</strong> ${data.custmobileno}</p>
        <p><strong>Current Location:</strong> <span class="highlight">${data.currentlocation}</span></p>
    `;

    const b = data.booking;

    // Booking details
    bookingCard.innerHTML = `
        <p><strong>Booking ID:</strong> ${b.id}</p>
        <p><strong>From:</strong> ${b.sourceLocation}</p>
        <p><strong>To:</strong> ${b.destinationLocation}</p>
        <p><strong>Distance:</strong> ${b.distanceTravelled} km</p>
        <p><strong>Fare:</strong> ₹${b.fare}</p>
        <p><strong>Estimated Time:</strong> ${b.estimationTravelTime}</p>
        <p><strong>Booking Status:</strong> <span class="highlight">${b.bookingStatus}</span></p>
        <p><strong>Payment Status:</strong> ${b.paymentStatus}</p>
        <p><strong>OTP:</strong> ${b.otp}</p>
    `;

    // ✅ Cancel button logic
    if (b.bookingStatus === "BOOKED") {
        cancelBtn.disabled = false;
        cancelBtn.onclick = () => cancelBooking(b.id, data.custmobileno);
    } else {
        cancelBtn.disabled = true;
    }
}

async function cancelBooking(bookingId, customerId) {
    const confirmCancel = confirm("Are you sure you want to cancel this booking?");

    if (!confirmCancel) return;

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `${CANCEL_BOOKING_API}/${bookingId}/cancel?customerId=${customerID}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": token
                }
            }
        );

        if (!res.ok) {
            throw new Error("Cancel failed");
        }

        alert("Booking cancelled successfully");

        // Redirect to dashboard
        window.location.href = "customer-dashboard.html";

    } catch (error) {
        console.error(error);
        alert("Unable to cancel booking");
    }
}

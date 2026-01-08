const AVAILABLE_API = "http://localhost:8085/customer/available";
const BOOK_API = "http://localhost:8085/customer/book";

console.log("mobileNo:", localStorage.getItem("mobileNo"));
console.log("token:", localStorage.getItem("token"));
console.log("destinationCity:", localStorage.getItem("destinationCity"));

window.addEventListener("DOMContentLoaded", () => {
    fetchAvailableVehicles();
});

async function fetchAvailableVehicles() {
    try {
        const mobileNo = localStorage.getItem("mobileNo");
        const destination = localStorage.getItem("destinationCity");
        const token = localStorage.getItem("token");

        if (!mobileNo || !destination || !token) {
            alert("Missing data. Redirecting...");
            window.location.href = "customer-dashboard.html";
            return;
        }

        document.getElementById("destinationText").innerText = destination;

        const res = await fetch(
            `${AVAILABLE_API}?mobileno=${mobileNo}&destinationLocation=${destination}`,
            {
                method: "GET",
                headers: {
                    "Authorization": token
                }
            }
        );

        const response = await res.json();
        console.log("API Response:", response);

        renderCards(response.data);

    } catch (err) {
        console.error(err);
        alert("Failed to load vehicles");
    }
}

function renderCards(data) {
    const rideInfo = document.getElementById("rideInfo");
    const container = document.getElementById("cardsContainer");

    container.innerHTML = "";

    const {
        cid,
        sourceLocation,
        destinationLocation,
        distance,
        availablevehicles
    } = data;

    /* ---------- RIDE INFO UI ---------- */
    rideInfo.innerHTML = `
        <h2>Ride Details</h2>
        <p><strong>Customer ID:</strong> ${cid}</p>
        <p><strong>From:</strong> ${sourceLocation}</p>
        <p><strong>To:</strong> ${destinationLocation}</p>
        <p><strong>Distance:</strong> ${distance} km</p>
        <hr/>
    `;

    /* ---------- VEHICLE CARDS ---------- */
    if (!availablevehicles || availablevehicles.length === 0) {
        container.innerHTML = "<p>No vehicles available</p>";
        return;
    }

    console.log("Available Vehicles:", availablevehicles);

    availablevehicles.forEach(item => {
        const v = item.v;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${v.vehilename}</h3>
            <p><strong>Vehicle No:</strong> ${v.vehileno}</p>
            <p><strong>Type:</strong> ${v.type}</p>
            <p><strong>Capacity:</strong> ${v.capacity}</p>
            <p><strong>Fare:</strong> ₹${item.fare.toFixed(2)}</p>
            <p><strong>Estimated Time:</strong> ${item.estimationtime.toFixed(2)} hrs</p>
            <button class="book-btn">Book Now</button>
        `;

        card.querySelector(".book-btn").addEventListener("click", () => {
            bookVehicle(
                v.id,
                sourceLocation,
                destinationLocation,
                distance,
                item
            );
        });

        container.appendChild(card);
    });
}

async function bookVehicle(vehicleId, source, destination, distance, item) {
    try {
        const mobileNo = localStorage.getItem("mobileNo");
        const token = localStorage.getItem("token");

        const bookingData = {
            vehicleid: vehicleId,
            sourceLocation: source,
            destinationLocation: destination,
            distanceTravelled: distance,
            fare: item.fare,
            estimationTravelTime: `${item.estimationtime.toFixed(2)} hours`
        };

        const res = await fetch(`${BOOK_API}/${mobileNo}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(bookingData)
        });

        if (!res.ok) {
            throw new Error("Booking failed");
        }

        alert("Vehicle booked successfully!");
        window.location.href = "active-booking.html";

    } catch (err) {
        console.error(err);
        alert("Booking failed");
    }
}

const driverList = document.getElementById("driverList");

async function loadDrivers() {
  try {

    // 🔹 Change this to your backend API
    const response = await fetch("http://localhost:8080/drivers/available");

    const drivers = await response.json();

    driverList.innerHTML = "";

    drivers.forEach(d => {

      // Mask vehicle number
      const maskedNumber = d.vehicleNumber.replace(/.(?=.{4})/g, "*");

      const card = document.createElement("div");
      card.className = "driver-card";

      card.innerHTML = `
        <h2>${d.vehicleName}</h2>
        <span class="tag">${d.vehicleType}</span>

        <div class="driver-details">
          <p><strong>Vehicle Number:</strong> ${maskedNumber}</p>
          <p><strong>Capacity:</strong> ${d.capacity} persons</p>
          <p><strong>Price / KM:</strong> ₹${d.pricePerKm}</p>
          <p><strong>Average Speed:</strong> ${d.averageSpeed} km/h</p>
        </div>

        <button class="book-btn" onclick="bookDriver(${d.vehicleId})">
          Book Now
        </button>
      `;

      driverList.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading drivers", error);
    driverList.innerHTML = `<p style="text-align:center;color:red">
      Failed to load drivers. Please try again.
    </p>`;
  }
}

loadDrivers();

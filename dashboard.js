document
  .getElementById("findVehiclesBtn")
  .addEventListener("click", loadVehicles);

function loadVehicles() {

    fetch("http://localhost:8080/api/drivers/available")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch vehicles");
            }
            return response.json();
        })
        .then(vehicles => {
            const list = document.getElementById("vehicleList");
            list.innerHTML = ""; // clear old data

            vehicles.forEach(v => {
                const card = document.createElement("div");
                card.className = "vehicle-card";

                card.innerHTML = `
                    <div class="info">
                        <h3>${v.name}</h3>
                        <p>${v.vehicle} • ${v.vehicleNo}</p>
                        <p class="meta">⭐ ${v.rating} • ⏱ ${v.time}</p>
                    </div>
                    <div class="action">
                        <div class="price">₹${v.price}</div>
                        <button class="book-btn">Book Now</button>
                    </div>
                `;

                list.appendChild(card);
            });
        })
        .catch(error => {
            alert("❌ No vehicles available");
            console.error(error);
        });
}

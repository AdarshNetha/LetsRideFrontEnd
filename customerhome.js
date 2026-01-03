let pickupLat = null, pickupLon = null;
let dropLat = null, dropLon = null;

let map;
let pickupMarker = null;
let dropMarker = null;

/* -----------------------------------------
   INIT LEAFLET MAP (No API Key Needed)
------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {

    map = L.map("map").setView([20.5937, 78.9629], 5); // India view

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    console.log("Leaflet Map Loaded ✔");
});

/* -----------------------------------------
   SEARCH LOCATION USING NOMINATIM (FREE)
------------------------------------------*/
function searchLocation(query, type) {

    fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    )
        .then(res => res.json())
        .then(results => {

            if (!results || results.length === 0) {
                alert("Location not found ❌");
                return;
            }

            const place = results[0];

            const lat = parseFloat(place.lat);
            const lon = parseFloat(place.lon);

            if (type === "pickup") {

                pickupLat = lat;
                pickupLon = lon;

                if (pickupMarker) map.removeLayer(pickupMarker);

                pickupMarker = L.marker([lat, lon], { title: "Pickup" }).addTo(map);
                map.setView([lat, lon], 13);

                console.log("Pickup:", lat, lon);
            }

            if (type === "drop") {

                dropLat = lat;
                dropLon = lon;

                if (dropMarker) map.removeLayer(dropMarker);

                dropMarker = L.marker([lat, lon], { title: "Drop" }).addTo(map);

                console.log("Drop:", lat, lon);
            }

        })
        .catch(err => {
            console.error(err);
            alert("Location search failed ❌");
        });
}

/* -----------------------------------------
   BIND INPUT SEARCH EVENTS
------------------------------------------*/
document.getElementById("pickupInput").addEventListener("change", e => {
    searchLocation(e.target.value, "pickup");
});

document.getElementById("dropInput").addEventListener("change", e => {
    searchLocation(e.target.value, "drop");
});

/* -----------------------------------------
   📍 DETECT CURRENT LOCATION (FREE)
------------------------------------------*/
document.getElementById("detectLocationBtn").addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Your browser does not support location access");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {

        pickupLat = position.coords.latitude;
        pickupLon = position.coords.longitude;

        if (pickupMarker) map.removeLayer(pickupMarker);

        pickupMarker = L.marker([pickupLat, pickupLon]).addTo(map);

        map.setView([pickupLat, pickupLon], 14);

        document.getElementById("pickupInput").value = "My Current Location";

        alert("Current location detected ✔");

        console.log("Current Location:", pickupLat, pickupLon);

    }, err => {
        alert("Location permission denied ❌");
        console.error(err);
    });
});

/* -----------------------------------------
   🚕 FIND DRIVERS (POST to Backend)
------------------------------------------*/
document.getElementById("findBtn").addEventListener("click", () => {

    if (pickupLat === null || dropLat === null) {
        alert("Please select pickup & drop locations");
        return;
    }

    const customerId = localStorage.getItem("customerId");

    const payload = {
        customerId: customerId ? parseInt(customerId) : null,
        pickupLat,
        pickupLon,
        dropLat,
        dropLon
    };

    console.log("Payload:", payload);

    fetch("http://localhost:8085/customer/available", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (!res.ok) throw new Error("Server Error " + res.status);
            return res.json();
        })
        .then(data => {

            console.log("Drivers Found:", data);

            if (!data || data.length === 0) {
                alert("No drivers found nearby ❌");
                return;
            }

            alert("Drivers fetched successfully ✔");

            localStorage.setItem("driverResults", JSON.stringify(data));

            window.location.href = "driverResults.html";
        })
        .catch(err => {
            console.error(err);
            alert("Request failed ❌ Check console");
        });
});

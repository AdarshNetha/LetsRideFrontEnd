const mobileNo = localStorage.getItem("mobileNo");

function goBack() {
    window.history.back();
}

fetch(`http://localhost:8085/driver/booking-history?mobileno=${mobileNo}`)
    .then(res => res.json())
    .then(result => {
            
        const tbody = document.getElementById("historyBody");
        const totalFareEl = document.getElementById("totalFare");

        tbody.innerHTML = "";

        if (!result.data || result.data.rideDTOs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="loading">No rides found</td>
                </tr>`;
            return;
        }

        // Total earnings
        totalFareEl.innerText = `₹${result.data.total}`;

        result.data.rideDTOs.forEach(r => {
            tbody.innerHTML += `
                <tr>
                    <td>${r.bookingId}</td>
                    <td>${r.fromLocation}</td>
                    <td>${r.toLocation}</td>
                    <td>${r.distance.toFixed(2)}</td>
                    <td>₹${r.fare}</td>
                </tr>`;
        });
    })
    .catch(err => {
        console.error(err);
        alert("Failed to load booking history");
    });
    

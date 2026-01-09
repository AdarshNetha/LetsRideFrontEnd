const mobileNo = localStorage.getItem("mobileNo");
const token = localStorage.getItem("token");
function goBack() {
    window.history.back();
}

if (!mobileNo) {
    alert("Mobile number not found. Please login again.");
}

fetch(`http://localhost:8085/driver/booking-history?mobileno=${mobileNo}`, {
    method: "GET",
            headers: {
        "Authorization": `${token}`,
        "Content-Type": "application/json"
    }
    
        })
    .then(res => res.json())
    .then(result => {

        const tbody = document.getElementById("historyBody");
        const totalFareEl = document.getElementById("totalFare");

        tbody.innerHTML = "";

        const history = result.data.history;
        const totalAmount = result.data.totalAmount;

        if (!history || history.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">No rides found</td>
                </tr>`;
            return;
        }

        totalFareEl.innerText = `₹${totalAmount.toFixed(2)}`;

        history.forEach(r => {
            tbody.innerHTML += `
                <tr>
                    <td>${r.bookingId}</td>
                    <td>${r.fromLocation}</td>
                    <td>${r.toLocation}</td>
                    <td>${r.distance.toFixed(2)}</td>
                    <td>₹${r.fare.toFixed(2)}</td>
                </tr>`;
        });
    })
    .catch(err => {
        console.error(err);
        alert("Failed to load booking history");
    });


const CUSTOMER_API = "http://localhost:8085/customer/find";

let customer = null;

window.addEventListener("DOMContentLoaded", () => {
    fetchCustomerDetails();
});

async function fetchCustomerDetails() {
    try {
        // 1️⃣ Get data from localStorage
        const mobileNo = localStorage.getItem("mobileNo");
        const token = localStorage.getItem("token");

        if (!mobileNo || !token) {
            console.error("Mobile number or token missing");
            return;
        }

        // 2️⃣ Call secured GET API with RequestParam
        const res = await fetch(`${CUSTOMER_API}?mobileno=${mobileNo}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch customer data");
            return;
        }

        // 3️⃣ ResponseStructure<Customer>
        const response = await res.json();

        // 4️⃣ Store customer object
        customer = response.data;

        console.log("Customer Data:", customer);
        console.log(customer.id);
        localStorage.setItem("customerID",customer.id);


document.getElementById("customerName").innerText = customer.name;

if (customer.activeBookingFlag === true) {
    window.location.href = "active-booking.html";
}


    } catch (error) {
        console.error("Error:", error);
    }
}
document.getElementById("findDriverBtn").addEventListener("click", () => {
    const destinationInput = document.getElementById("destination");
    const destination = destinationInput.value.trim();

    // ❌ Block if empty
    if (!destination) {
        alert("Please enter destination city");
        destinationInput.focus();
        return;
    }

    // ✅ Save ONLY when finding driver
    localStorage.setItem("destinationCity", destination);

    // ✅ Redirect
    window.location.href = "find-driver.html";
});


// ✅ Update button click
document.getElementById("updateBtn").addEventListener("click", () => {
    updateCustomerLocation();
});

function updateCustomerLocation() {

    const mobileNo = localStorage.getItem("mobileNo");
    const token = localStorage.getItem("token");

    if (!mobileNo || !token) {
        alert("User not logged in");
        return;
    }

    // ✅ Get device location
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude:", latitude, "Longitude:", longitude);

            try {
                const response = await fetch(
                    `http://localhost:8085/customer/location?latitude=${latitude}&longitude=${longitude}&mobileNo=${mobileNo}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": token
                        }
                    }
                );

                if (!response.ok) {
                    alert("Failed to update location");
                    return;
                }

                const result = await response.json();
                console.log("Location updated:", result);

                
// ✅ Get current location from response
const currentLocation = result.data.currentLoc;

// ✅ Popup
alert(`📍 Your current location is: ${currentLocation}`);

            } catch (error) {
                console.error("Error updating location:", error);
            }
        },
        (error) => {
            alert("Location permission denied");
            console.error(error);
        }
    );
}



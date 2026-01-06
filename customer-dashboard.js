
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



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

        // Example usage
        // document.getElementById("customerName").innerText = customer.name;

    } catch (error) {
        console.error("Error:", error);
    }
}


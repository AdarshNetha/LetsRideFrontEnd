document.addEventListener("DOMContentLoaded", () => {

  const nameEl = document.getElementById("customerName");
  const statusMsg = document.getElementById("statusMsg");

  const btnProfile = document.getElementById("profileBtn");
  const btnHistory = document.getElementById("historyBtn");
  const btnSettings = document.getElementById("settingsBtn");

  // Get mobile number stored during login
  const mobileNo = localStorage.getItem("mobileNo");

  if (!mobileNo) {
    statusMsg.textContent = "Mobile number missing — please login again.";
    return;
  }

  const url = `http://localhost:8085/auth/customer/find/${encodeURIComponent(mobileNo)}`;

  // Fetch customer details
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Unable to fetch customer details");
      return res.json();
    })
    .then(data => {

      // Show name at top-left
      nameEl.textContent = `Hi, ${data.name}`;

      statusMsg.textContent = "Customer details loaded";

      // Redirect if active ride exists
      if (data.activeFlag === true) {
        window.location.href = "active-ride.html";
        return;
      }

    })
    .catch(err => {
      console.error("Fetch error:", err);
      statusMsg.textContent = "Unable to fetch customer details";
    });

  // ---------- BUTTON NAVIGATION ----------

  btnProfile.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  btnHistory.addEventListener("click", () => {
    window.location.href = "booking-history.html";
  });

  btnSettings.addEventListener("click", () => {
    window.location.href = "settings.html";
  });

});

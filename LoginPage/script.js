// API URL config.js থেকে আসে
// Fixed version - unique msg IDs
// ── LOGIN ──
document.getElementById("loginButton").addEventListener("click", async (e) => {
  e.preventDefault();

  const mobile = document.getElementById("mobile-number").value.trim();
  const pin = document.getElementById("pin-number").value.trim();

  if (!mobile || !pin) {
    showMsg("login-msg", "Please enter mobile number and PIN.", "error");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, pin }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showMsg("login-msg", "Login successful! Redirecting...", "success");
      setTimeout(() => (window.location.href = "Home.html"), 800);
    } else {
      showMsg("login-msg", data.message, "error");
    }
  } catch (err) {
    showMsg("login-msg", "Cannot connect to server.", "error");
  }
});

// ── REGISTER LINK ──
document.getElementById("registerLink").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("registerSection").classList.remove("hidden");
});

// ── LOGIN LINK ──
document.getElementById("loginLink").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("registerSection").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
});

// ── REGISTER ──
document.getElementById("registerButton").addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("reg-name").value.trim();
  const mobile = document.getElementById("reg-mobile").value.trim();
  const pin = document.getElementById("reg-pin").value.trim();

  if (!name || !mobile || !pin) {
    showMsg("reg-msg", "Please fill all fields.", "error");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mobile, pin }),
    });

    const data = await res.json();

    if (res.ok) {
      showMsg("reg-msg", "Registration successful! Please login.", "success");
      setTimeout(() => {
        document.getElementById("registerSection").classList.add("hidden");
        document.getElementById("loginSection").classList.remove("hidden");
      }, 1500);
    } else {
      showMsg("reg-msg", data.message, "error");
    }
  } catch (err) {
    showMsg("reg-msg", "Cannot connect to server.", "error");
  }
});

// ── HELPER ──
function showMsg(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = type === "success"
    ? "text-center mt-3 font-semibold text-green-400"
    : "text-center mt-3 font-semibold text-red-400";
}
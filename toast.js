// ── toast.js — সব HTML page-এ include করো ──
(function () {
  const style = document.createElement("style");
  style.textContent = `
    #toast-container { position:fixed; top:20px; right:20px; z-index:99999; display:flex; flex-direction:column; gap:10px; pointer-events:none; }
    .toast { min-width:280px; max-width:360px; padding:14px 18px; border-radius:12px; font-family:Arial,sans-serif; font-size:14px; font-weight:500; color:white; display:flex; align-items:center; gap:10px; box-shadow:0 4px 20px rgba(0,0,0,0.2); pointer-events:auto; animation:toastIn 0.3s ease forwards; }
    .toast.hide { animation:toastOut 0.3s ease forwards; }
    .toast-success { background:linear-gradient(135deg,#16a34a,#15803d); }
    .toast-error   { background:linear-gradient(135deg,#dc2626,#b91c1c); }
    .toast-info    { background:linear-gradient(135deg,#2563eb,#1d4ed8); }
    .toast-warning { background:linear-gradient(135deg,#d97706,#b45309); }
    @keyframes toastIn  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
    @keyframes toastOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(40px)} }
  `;
  document.head.appendChild(style);
  const container = document.createElement("div");
  container.id = "toast-container";
  document.body.appendChild(container);

  const icons = { success:"✅", error:"❌", info:"ℹ️", warning:"⚠️" };

  window.showToast = function (message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span style="font-size:18px">${icons[type]||"ℹ️"}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };
})();

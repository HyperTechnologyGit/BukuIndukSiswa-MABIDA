const params = new URLSearchParams(location.search);
const role = params.get("role") || "admin";
const userName = params.get("name") || "Administrator";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function initAdminShell(title) {
  setText("pageTitle", title);
  setText("userName", userName);
  setText("userRole", role === "admin" ? "Admin / Tata Usaha" : role.toUpperCase());

  const clock = () => {
    const now = new Date();
    setText("topClock", now.toLocaleTimeString("id-ID", {hour12:false}));
    setText("topDate", now.toLocaleDateString("id-ID", {
      day:"2-digit", month:"short", year:"numeric"
    }));
  };
  clock();
  setInterval(clock, 1000);

  document.querySelectorAll("[data-page]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      const map = {
        dashboard:"dashboardadmin.html",
        identitas:"identitassiswa.html",
        kelas10:"hasilbelajarkelas10.html",
        kelas11:"hasilbelajarkelas11.html",
        kelas12:"hasilbelajarkelas12.html",
        lampiran:"lampiranijazah.html",
        password:"kelolasandi.html"
      };
      if (map[target]) {
        location.href = map[target] + location.search;
      }
    });
  });
}

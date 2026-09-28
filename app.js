const accounts = {
  admin: {
    label: "Admin",
    info: "Admin utama & sub-admin sekolah",
    users: [
      ["Administrator Utama", "admin123"],
      ["Sub Admin Akademik", "subadmin123"],
      ["Sub Admin Kesiswaan", "kesiswaan123"]
    ]
  },
  kepsek: {
    label: "Kepala Sekolah",
    info: "Akses monitoring & persetujuan kepala sekolah",
    users: [["Kepala Sekolah", "kepsek123"]]
  },
  wakakur: {
    label: "Waka Kurikulum",
    info: "Akses kurikulum, nilai & administrasi akademik",
    users: [["Waka Kurikulum", "wakakur123"]]
  },
  wakasis: {
    label: "Waka Kesiswaan",
    info: "Akses data siswa & administrasi kesiswaan",
    users: [["Waka Kesiswaan", "wakasis123"]]
  },
  wakahumasy: {
    label: "Waka Humas",
    info: "Akses hubungan sekolah & dokumentasi",
    users: [["Waka Humas", "humasy123"]]
  },
  wakasarpras: {
    label: "Waka Sarpras",
    info: "Akses sarana, prasarana & inventaris",
    users: [["Waka Sarpras", "sarpras123"]]
  },
  kopsis: {
    label: "Kopsis",
    info: "Akses administrasi koperasi sekolah",
    users: [["Petugas Kopsis", "kopsis123"]]
  },
  labkom: {
    label: "Labkom",
    info: "Akses administrasi laboratorium komputer",
    users: [["Operator Labkom", "labkom123"]]
  },
  perpustakaan: {
    label: "Perpustakaan",
    info: "Akses koleksi & administrasi perpustakaan",
    users: [["Petugas Perpustakaan", "pustaka123"]]
  }
};

let currentRole = "admin";

const roleButtons = document.querySelectorAll(".role");
const account = document.getElementById("account");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");
const loginTitle = document.getElementById("loginTitle");
const accountInfo = document.getElementById("accountInfo");

function loadRole(role){
  currentRole = role;
  const data = accounts[role];
  account.innerHTML = "";

  data.users.forEach((user, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = user[0];
    account.appendChild(option);
  });

  loginTitle.textContent = `Login ${data.label}`;
  accountInfo.textContent = data.info;
  password.value = "";
  message.textContent = "";
  message.className = "message";
}

roleButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    roleButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadRole(btn.dataset.role);
  });
});

document.getElementById("togglePassword").addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
});

loginBtn.addEventListener("click", () => {
  const selected = accounts[currentRole].users[Number(account.value)];
  const entered = password.value;

  if(!entered){
    showMessage("Kata sandi wajib diisi.", false);
    password.focus();
    return;
  }

  if(entered === selected[1]){
    showMessage(`Login berhasil sebagai ${selected[0]}.`, true);
    // Untuk versi produksi, ganti bagian ini dengan redirect ke dashboard/backend.
    setTimeout(() => {
      window.location.href = "dashboard.html?role=" + encodeURIComponent(currentRole);
    }, 650);
  }else{
    showMessage("Kata sandi salah. Silakan coba lagi.", false);
  }
});

document.getElementById("forgot").addEventListener("click", () => {
  showMessage("Silakan hubungi Administrator Utama untuk reset kata sandi.", false);
});

function showMessage(text, success){
  message.textContent = text;
  message.className = "message " + (success ? "ok" : "err");
}

loadRole("admin");

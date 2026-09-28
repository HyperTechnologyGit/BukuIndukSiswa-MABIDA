const accounts={
admin:{label:"Admin",info:"Admin Utama & Sub Admin",users:[
["Admin Utama","admin123","admin"],
["Sub Admin","subadmin123","admin"]
]},
kepsek:{label:"Kepsek",info:"Akun Kepala Sekolah",users:[
["Kepala Sekolah","kepsek123","kepsek"]
]},
wakil:{label:"Wakil Kepala",info:"Waka Kurikulum, Kesiswaan, Humasy & Sarana Prasarana",users:[
["Waka Kurikulum","wakakur123","wakakur"],
["Waka Kesiswaan","wakasis123","wakasis"],
["Waka Humasy","humasy123","wakahumasy"],
["Waka Sarana Prasarana","sarpras123","wakasarpras"]
]},
kopsis:{label:"Kopsis",info:"Akun Koperasi Sekolah",users:[
["Petugas Kopsis","kopsis123","kopsis"]
]},
labkom:{label:"Labkom",info:"Akun Laboratorium Komputer",users:[
["Operator Labkom","labkom123","labkom"]
]},
perpustakaan:{label:"Perpustakaan",info:"Akun Perpustakaan",users:[
["Petugas Perpustakaan","pustaka123","perpustakaan"]
]}
};

let currentRole="admin";
const roleButtons=document.querySelectorAll(".role");
const account=document.getElementById("account");
const password=document.getElementById("password");
const message=document.getElementById("message");
const title=document.getElementById("loginTitle");
const info=document.getElementById("accountInfo");

function loadRole(role){
 currentRole=role;
 const data=accounts[role];
 account.innerHTML="";
 data.users.forEach((u,i)=>{
   const o=document.createElement("option");
   o.value=i;o.textContent=u[0];account.appendChild(o);
 });
 title.textContent="Login "+data.label;
 info.textContent=data.info;
 password.value="";showMessage("",true);
}
roleButtons.forEach(btn=>btn.onclick=()=>{
 roleButtons.forEach(b=>b.classList.remove("active"));
 btn.classList.add("active");loadRole(btn.dataset.role);
});
document.getElementById("togglePassword").onclick=()=>{
 password.type=password.type==="password"?"text":"password";
};
document.getElementById("forgot").onclick=()=>{
 showMessage("Hubungi Admin Utama untuk reset sandi.",false);
};
document.getElementById("loginBtn").onclick=()=>{
 const u=accounts[currentRole].users[Number(account.value)];
 if(!password.value){showMessage("Kata sandi wajib diisi.",false);return}
 if(password.value!==u[1]){showMessage("Kata sandi salah.",false);return}
 showMessage("Login berhasil.",true);
 setTimeout(()=>{
   // Admin dan Sub Admin masuk ke dashboard Admin/TU yang sudah dibuat.
   // Role lain sementara diarahkan ke dashboard yang sama sebagai fondasi,
   // lalu modul masing-masing dapat dikembangkan tanpa memecah login.
   openAdminDashboard(u);
 },400);
};
function showMessage(t,ok){
 message.textContent=t;
 message.className="message "+(ok?"ok":"err");
}
function openAdminDashboard(user){
  const target="./pages/admin/dashboard.html";
  const query="?role="+encodeURIComponent(user[2])+"&name="+encodeURIComponent(user[0]);
  window.location.assign(target+query);
}
loadRole("admin");

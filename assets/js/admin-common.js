
const MABIDA_KEY="mabida_students_v1";
const MABIDA_WAKA_KEY="mabida_waka_accounts_v1";
const params=new URLSearchParams(location.search);
const role=params.get("role")||"admin";
const userName=params.get("name")||"Administrator";

const pageMap={
 dashboard:"dashboardadmin.html",identitas:"identitassiswa.html",
 kelas10:"hasilbelajarkelas10.html",kelas11:"hasilbelajarkelas11.html",
 kelas12:"hasilbelajarkelas12.html",lampiran:"lampiranijazah.html",
 password:"kelolasandi.html"
};

function getStudents(){try{return JSON.parse(localStorage.getItem(MABIDA_KEY)||"[]")}catch(e){return[]}}
function saveStudents(v){localStorage.setItem(MABIDA_KEY,JSON.stringify(v))}
function getWakaAccounts(){
 const defaults=[
  {id:"wakakur",label:"Waka Kurikulum",username:"wakakur",password:"wakakur123"},
  {id:"wakasis",label:"Waka Kesiswaan",username:"wakasis",password:"wakasis123"},
  {id:"wakahumasy",label:"Waka Humasy",username:"wakahumasy",password:"humasy123"},
  {id:"wakasarpras",label:"Waka Sarana Prasarana",username:"wakasarpras",password:"sarpras123"}
 ];
 try{const s=JSON.parse(localStorage.getItem(MABIDA_WAKA_KEY));return Array.isArray(s)&&s.length?s:defaults}catch(e){return defaults}
}
function saveWakaAccounts(v){localStorage.setItem(MABIDA_WAKA_KEY,JSON.stringify(v))}
function setText(id,v){const e=document.getElementById(id);if(e)e.textContent=v}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function formatDate(v){if(!v)return"-";const d=new Date(v+"T00:00:00");return isNaN(d) ? v : d.toLocaleDateString("id-ID",{day:"2-digit",month:"2-digit",year:"numeric"})}
function studentLabel(s){return `${s.nis||"-"} — ${s.nama||"Tanpa Nama"}`}
function studentOptions(select,students){select.innerHTML='<option value="">Pilih siswa...</option>'+students.map(s=>`<option value="${escapeHtml(s.id)}">${escapeHtml(studentLabel(s))}</option>`).join("")}
function renderStudentRows(id,rows,empty="Belum ada data."){const t=document.getElementById(id);if(t)t.innerHTML=rows.length?rows.join(""):`<tr><td colspan="20" class="empty-row">${empty}</td></tr>`}
function activeNav(){
 const file=location.pathname.split("/").pop();
 const active=Object.entries(pageMap).find(([,v])=>v===file)?.[0];
 document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===active));
}
function initAdminShell(title){
 setText("pageTitle",title);setText("userName",userName);
 setText("userRole",role==="admin"?"Admin / Tata Usaha":role.toUpperCase());activeNav();
 const clock=()=>{const n=new Date();setText("topClock",n.toLocaleTimeString("id-ID",{hour12:false}));setText("topDate",n.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"}))};
 clock();setInterval(clock,1000);
 document.querySelectorAll("[data-page]").forEach(btn=>btn.onclick=()=>{if(pageMap[btn.dataset.page])location.href=pageMap[btn.dataset.page]+location.search});
}

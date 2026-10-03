
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
 const navParams=new URLSearchParams(location.search);navParams.set('_nav','21');document.querySelectorAll("[data-page]").forEach(btn=>btn.onclick=()=>{if(pageMap[btn.dataset.page])location.href=pageMap[btn.dataset.page]+'?'+navParams});
}

/* ADMIN SIDEBAR SYNC */
function adminIconSvg(text){
 const t=String(text||'').toLowerCase();
 const p={
  dashboard:'<path d="M3 10.5 10 4l7 6.5V17a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1z"/>',
  identitas:'<circle cx="7" cy="7" r="3"/><path d="M2.5 18a4.5 4.5 0 0 1 9 0M14 5a3 3 0 0 1 0 5M13 13a4 4 0 0 1 4 5"/>',
  kelas10:'<path d="M4 5h12v11H4z"/><path d="M7 8h6M7 11h6M7 14h4"/>',
  kelas11:'<path d="M5 3h10v14H5z"/><path d="M7 7h6M7 10h6M7 13h4"/>',
  kelas12:'<path d="M4 4h12v12H4z"/><path d="M7 8h6M7 11h4"/>',
  lampiran:'<path d="M5 3h7l3 3v11H5z"/><path d="M12 3v4h4M7 11h6M7 14h5"/>',
  password:'<rect x="4" y="8" width="12" height="9" rx="1"/><path d="M7 8V6a3 3 0 0 1 6 0v2M10 12v2"/>'
 };
 let k='dashboard'; if(t.includes('identitas'))k='identitas'; else if(t.includes('kelas x')||t.includes('kelas 10'))k='kelas10'; else if(t.includes('kelas xi')||t.includes('kelas 11'))k='kelas11'; else if(t.includes('kelas xii')||t.includes('kelas 12'))k='kelas12'; else if(t.includes('ijazah')||t.includes('sertifikat'))k='lampiran'; else if(t.includes('sandi'))k='password';
 return `<svg viewBox="0 0 20 20" aria-hidden="true">${p[k]}</svg>`;
}
function initAdminSidebar(){
 const shell=document.body, brand=document.querySelector('.brand-mini'), sidebar=document.querySelector('.sidebar');
 if(!brand||!sidebar)return;
 brand.classList.add('brand');brand.setAttribute('role','button');brand.setAttribute('tabindex','0');brand.setAttribute('aria-label','Toggle sidebar');brand.removeAttribute('title');
 const navs=[...document.querySelectorAll('.sidebar .nav')];
 navs.forEach(b=>{
  if(!b.querySelector('.nav-icon')){const icon=document.createElement('span');icon.className='nav-icon';icon.innerHTML=adminIconSvg(b.textContent);b.prepend(icon)}
  if(!b.querySelector('.nav-label')){const label=document.createElement('span');label.className='nav-label';label.textContent=b.getAttribute('data-label')||[...b.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').trim();[...b.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());b.appendChild(label)}else{b.querySelector('.nav-label').textContent=b.getAttribute('data-label')||b.querySelector('.nav-label').textContent.trim();b.querySelector('.nav-label').style.display='block'}
  b.dataset.tooltip=b.querySelector('.nav-label')?.textContent.trim()||'';
 });
 const saved=localStorage.getItem('mabida_admin_sidebar_collapsed_v5')==='1';
 shell.classList.toggle('sidebar-collapsed',saved); sidebar.classList.toggle('is-collapsed',saved);
 const toggle=()=>{const next=!shell.classList.contains('sidebar-collapsed');shell.classList.toggle('sidebar-collapsed',next); sidebar.classList.toggle('is-collapsed',next); localStorage.setItem('mabida_admin_sidebar_collapsed_v5',next?'1':'0')};
 brand.addEventListener('click',e=>{e.preventDefault();toggle()});brand.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
 const logout=sidebar.querySelector('.logout');
 if(logout)logout.style.display='none';
 const top=document.querySelector('.topright');
 if(top&&!top.querySelector('.header-logout')){const b=document.createElement('button');b.className='header-logout';b.type='button';b.innerHTML='<svg viewBox="0 0 20 20"><path d="M8 4H4v12h4M12 7l4 3-4 3M7 10h9"/></svg><span>Keluar</span>';b.onclick=()=>location.href='../../index.html';top.appendChild(b)}

}
const _initAdminShell=initAdminShell;
initAdminShell=function(title){_initAdminShell(title);initAdminSidebar();};

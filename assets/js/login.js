const accounts={
admin:{users:[["Admin Utama","admin","admin123"],["Sub Admin","subadmin","subadmin123"]]},
kepsek:{users:[["Kepala Sekolah","kepsek","kepsek123"]]},
wakil:{users:[["Waka Kurikulum","wakakur","wakakur123"],["Waka Kesiswaan","wakasis","wakasis123"],["Waka Humasy","wakahumasy","humasy123"],["Waka Sarana Prasarana","wakasarpras","sarpras123"]]},
kopsis:{users:[["Kopsis","kopsis","kopsis123"]]},labkom:{users:[["Labkom","labkom","labkom123"]]},
perpustakaan:{users:[["Perpustakaan","perpustakaan","perpus123"]]}};
function saved(){try{return JSON.parse(localStorage.getItem("mabida_all_accounts_v2")||"null")}catch(e){return null}}
function users(role){const s=saved(),b=accounts[role]?.users||[];return !s?.[role]?b:b.map((u,i)=>s[role][i]?[s[role][i].name||u[0],s[role][i].username||u[1],s[role][i].password||u[2]]:u)}
const roleSelect=document.querySelector("#role,select[name='role'],#loginRole"),accountSelect=document.querySelector("#account,select[name='account'],#loginAccount"),username=document.querySelector("#username,input[name='username']"),password=document.querySelector("#password,input[name='password']"),form=document.querySelector("#loginForm,form");
let currentRole="admin";
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function loadRole(r){currentRole=r;const us=users(r);if(accountSelect)accountSelect.innerHTML=us.map((u,i)=>`<option value="${i}">${esc(u[0])}</option>`).join("");if(username)username.value=us[0]?.[1]||"";if(password)password.value=""}
if(roleSelect)roleSelect.addEventListener("change",()=>loadRole(roleSelect.value));
if(accountSelect)accountSelect.addEventListener("change",()=>{const u=users(currentRole)[+accountSelect.value||0];if(username)username.value=u?.[1]||""});
if(form)form.addEventListener("submit",e=>{e.preventDefault();const u=users(currentRole)[+accountSelect?.value||0];if(!u||username.value.trim()!==u[1]||password.value!==u[2])return alert("Username atau sandi tidak sesuai.");const name=encodeURIComponent(u[0]);const target=currentRole==="admin"?"pages/admin/dashboardadmin.html":`pages/${currentRole}/dashboard${currentRole}.html`;location.href=`${target}?role=${encodeURIComponent(currentRole)}&name=${name}`});
if(roleSelect)loadRole(roleSelect.value||"admin");
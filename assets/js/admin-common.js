
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
 if(!sidebar.id)sidebar.id='adminSidebar';const mobileToggle=document.createElement('button');mobileToggle.type='button';mobileToggle.className='mobile-sidebar-toggle';mobileToggle.setAttribute('aria-controls',sidebar.id);mobileToggle.setAttribute('aria-label','Buka menu');mobileToggle.setAttribute('aria-expanded','false');mobileToggle.innerHTML='<img src="../../assets/img/logo-mabida.png" alt="">';document.body.append(mobileToggle);
 const setMobileOpen=open=>{sidebar.classList.toggle('open',open);document.body.classList.toggle('mobile-sidebar-open',open);mobileToggle.setAttribute('aria-expanded',String(open));mobileToggle.setAttribute('aria-label',open?'Tutup menu':'Buka menu')};
 const toggle=()=>{if(window.matchMedia('(max-width: 600px)').matches){setMobileOpen(!sidebar.classList.contains('open'));return}const next=!shell.classList.contains('sidebar-collapsed');shell.classList.toggle('sidebar-collapsed',next);sidebar.classList.toggle('is-collapsed',next);localStorage.setItem('mabida_admin_sidebar_collapsed_v5',next?'1':'0')};
 mobileToggle.addEventListener('click',toggle);document.addEventListener('click',e=>{if(sidebar.classList.contains('open')&&!sidebar.contains(e.target)&&!e.composedPath().includes(mobileToggle))setMobileOpen(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape')setMobileOpen(false)});window.addEventListener('resize',()=>{if(window.innerWidth>600)setMobileOpen(false)});
 brand.addEventListener('click',e=>{e.preventDefault();toggle()});brand.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
 const logout=sidebar.querySelector('.logout');
 if(logout)logout.style.display='none';
 const top=document.querySelector('.topright');
 if(top&&!top.querySelector('.header-logout')){const b=document.createElement('button');b.className='header-logout';b.type='button';b.innerHTML='<svg viewBox="0 0 20 20"><path d="M8 4H4v12h4M12 7l4 3-4 3M7 10h9"/></svg><span>Keluar</span>';b.onclick=()=>location.href='../../index.html';top.appendChild(b)}

}
const _initAdminShell=initAdminShell;
initAdminShell=function(title){_initAdminShell(title);initAdminSidebar();};

function downloadAdminCsv(data,headers,filename){const lines=[headers.join(','),...data.map(row=>headers.map(header=>'"'+String(row[header]??'').replaceAll('"','""')+'"').join(','))],blob=new Blob(['\ufeff',lines.join('\r\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}

function setupResultEntry(resultClass){
 const card=document.querySelector('.content > .card');const tables=[...(card?.querySelectorAll('.table')||[])].slice(0,2);if(tables.length!==2)return;
 const studentSelect=document.getElementById('studentSelect'),saveButton=document.getElementById('saveResults'),semesterNotes=[];
 tables.forEach((table,index)=>{const semester=String(index+1),header=document.createElement('th');table.dataset.semester=semester;header.textContent='Keterangan';table.tHead.rows[0].append(header);table.tBodies[0].querySelectorAll('tr').forEach((row,rowIndex)=>{const input=document.createElement('input');input.type='text';input.className='subject-note';input.maxLength=180;input.setAttribute('aria-label',`Keterangan ${row.cells[1]?.textContent.trim()||`Mata Pelajaran ${rowIndex+1}`}`);row.insertCell().append(input)});const field=document.createElement('div'),label=document.createElement('label'),textarea=document.createElement('textarea');field.className='field result-note';label.textContent=`Catatan Semester ${semester}`;textarea.className='semester-note';textarea.maxLength=1000;textarea.setAttribute('aria-label',label.textContent);field.append(label,textarea);table.after(field);semesterNotes.push(textarea)});
 const summaryFields=document.createElement('div');summaryFields.className='formgrid result-summary-fields';[['Keterangan hasil belajar','result-keterangan'],['Catatan umum','result-catatan']].forEach(([text,className])=>{const field=document.createElement('div'),label=document.createElement('label'),textarea=document.createElement('textarea');field.className='field';label.textContent=text;textarea.className=className;textarea.maxLength=1000;textarea.setAttribute('aria-label',text);field.append(label,textarea);summaryFields.append(field)});tables[1].nextElementSibling.after(summaryFields);
 const saveActions=document.createElement('div');saveActions.className='actions result-save-actions';const exportButton=document.createElement('button');exportButton.type='button';exportButton.className='btn';exportButton.textContent='Export CSV';const printButton=document.createElement('button');printButton.type='button';printButton.className='btn';printButton.textContent='Print / PDF';saveActions.append(exportButton,printButton,saveButton);summaryFields.after(saveActions);
 function fillSemester(student,semester){const table=tables[Number(semester)-1],saved=student?.results?.[resultClass]?.[semester],records=Array.isArray(saved)?saved:[],scores=[...table.querySelectorAll('.score')],predicates=[...table.querySelectorAll('.predicate')],notes=[...table.querySelectorAll('.subject-note')],subjectCount=scores.length,offset=records.length>subjectCount?(Number(semester)-1)*subjectCount:0,visibleRecords=records.slice(offset,offset+subjectCount);scores.forEach((input,index)=>input.value=visibleRecords[index]?.nilai??'');predicates.forEach((input,index)=>input.value=visibleRecords[index]?.predikat??'');notes.forEach((input,index)=>input.value=visibleRecords[index]?.keterangan??'');semesterNotes[Number(semester)-1].value=student?.results?.[resultClass]?.notes?.[semester]||''}
 function fillAll(student){[1,2].forEach(semester=>fillSemester(student,semester));document.querySelector('.result-keterangan').value=student?.results?.[resultClass]?.keterangan||'';document.querySelector('.result-catatan').value=student?.results?.[resultClass]?.catatan||''}
 studentSelect.onchange=()=>fillAll(getStudents().find(student=>student.id===studentSelect.value));
 exportButton.onclick=()=>{const headers=['NIS','Nama Siswa','Kelas','Tahun Pelajaran','Semester','Mata Pelajaran','Nilai','Predikat','Keterangan Mapel','Catatan Semester','Keterangan Hasil Belajar','Catatan Umum'],subjects=tables.map(table=>[...table.tBodies[0].rows].map(row=>row.cells[1]?.textContent.trim()||'')),rows=[];getStudents().filter(student=>student.kelas===classRoman||student.kelas===resultClass||!student.kelas).forEach(student=>{const result=student.results?.[resultClass];if(!result)return;[1,2].forEach(semester=>{const saved=result[semester];if(!Array.isArray(saved))return;const subjectCount=subjects[semester-1].length,offset=saved.length>subjectCount?(semester-1)*subjectCount:0,records=saved.slice(offset,offset+subjectCount);records.forEach((record,index)=>rows.push({'NIS':student.nis||'','Nama Siswa':student.nama||'','Kelas':student.kelas||classRoman,'Tahun Pelajaran':result.schoolYear||'','Semester':`Semester ${semester}`,'Mata Pelajaran':subjects[semester-1][index]||`Mapel ${index+1}`,'Nilai':record?.nilai??'','Predikat':record?.predikat??'','Keterangan Mapel':record?.keterangan??'','Catatan Semester':result.notes?.[semester]||'','Keterangan Hasil Belajar':result.keterangan||'','Catatan Umum':result.catatan||''}))})});if(!rows.length){alert('Belum ada nilai tersimpan untuk diekspor.');return}downloadAdminCsv(rows,headers,`hasil-belajar-kelas-${resultClass}.csv`)};
 printButton.onclick=()=>window.print();
 saveButton.onclick=()=>{const data=getStudents(),index=data.findIndex(student=>student.id===studentSelect.value);if(index<0){alert('Pilih siswa terlebih dahulu.');return}const student=data[index];student.results=student.results||{};const result=student.results[resultClass]||{};result.notes=result.notes||{};tables.forEach((table,index)=>{const semester=String(index+1),scores=[...table.querySelectorAll('.score')],predicates=[...table.querySelectorAll('.predicate')],notes=[...table.querySelectorAll('.subject-note')];result[semester]=scores.map((input,subjectIndex)=>({nilai:input.value,predikat:predicates[subjectIndex]?.value||'',keterangan:notes[subjectIndex]?.value.trim()||''}));result.notes[semester]=semesterNotes[index].value.trim()});result.keterangan=document.querySelector('.result-keterangan').value.trim();result.catatan=document.querySelector('.result-catatan').value.trim();result.schoolYear=document.getElementById('schoolYear').value;student.results[resultClass]=result;saveStudents(data);renderResultTable();alert('Hasil belajar berhasil disimpan.')};
 document.getElementById('clearResults').onclick=()=>{card.querySelectorAll('.score,.predicate,.subject-note,.semester-note').forEach(input=>input.value='');document.querySelector('.result-keterangan').value='';document.querySelector('.result-catatan').value=''};
 window.openResult=(id)=>{studentSelect.value=id;const student=getStudents().find(item=>item.id===id);if(!student)return;document.getElementById('schoolYear').value=student.results?.[resultClass]?.schoolYear||'';fillAll(student);window.scrollTo({top:0,behavior:'smooth'})};
}

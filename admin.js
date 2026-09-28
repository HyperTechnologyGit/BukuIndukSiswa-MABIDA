const params=new URLSearchParams(location.search);
const loggedRole=params.get("role")||"admin";
const loggedName=params.get("name")||"Administrator";

const sidebar=document.getElementById("sidebar");
const content=document.getElementById("content");
const title=document.getElementById("title");

const pages={
dashboard:{title:"Dashboard Admin",html:dashboardPage()},
identitas:{title:"Identitas Siswa",html:identitasPage()},
kelas10:{title:"Laporan Hasil Belajar Kelas X",html:hasilPage("X")},
kelas11:{title:"Laporan Hasil Belajar Kelas XI",html:hasilPage("XI")},
kelas12:{title:"Laporan Hasil Belajar Kelas XII",html:hasilPage("XII")},
lampiran:{title:"Ijazah & Sertifikat TKA",html:lampiranPage()},
password:{title:"Kelola Sandi",html:passwordPage()}
};

function render(page){
  const p=pages[page]||pages.dashboard;
  title.textContent=p.title;
  content.innerHTML=p.html;
  document.querySelectorAll(".nav[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  sidebar.classList.remove("open");
  window.scrollTo(0,0);
}

document.querySelectorAll(".nav[data-page]").forEach(btn=>{
  btn.addEventListener("click",()=>render(btn.dataset.page));
});
document.getElementById("hamb").addEventListener("click",()=>sidebar.classList.toggle("open"));

function dashboardPage(){return `
<div class="page-head">
  <div><span class="eyebrow">ADMINISTRASI TATA USAHA</span><h2>Dashboard Admin</h2>
  <p class="sub">Pusat pengelolaan Buku Induk Siswa MABIDA Professional.</p></div>
</div>
<div class="grid">
  <div class="stat"><small>BUKU INDUK</small><strong>Aktif</strong><span>Modul data siswa siap dikelola</span></div>
  <div class="stat"><small>HASIL BELAJAR</small><strong>3</strong><span>Kelas X · XI · XII</span></div>
  <div class="stat"><small>DOKUMEN</small><strong>2</strong><span>Ijazah & Sertifikat TKA</span></div>
  <div class="stat"><small>AKSES</small><strong>Admin</strong><span>Hak akses Tata Usaha</span></div>
</div>
<div class="two">
  <div class="card"><h3>Menu Utama</h3><div class="quick">
    <button onclick="render('identitas')">Identitas Siswa</button>
    <button onclick="render('kelas10')">Hasil Belajar Kelas X</button>
    <button onclick="render('kelas11')">Hasil Belajar Kelas XI</button>
    <button onclick="render('kelas12')">Hasil Belajar Kelas XII</button>
    <button onclick="render('lampiran')">Ijazah & Sertifikat TKA</button>
    <button onclick="render('password')">Kelola Sandi</button>
  </div></div>
  <div class="card"><h3>Status Sistem</h3>
    <div class="notice">● Sistem aktif. Jam real-time tampil di pojok kanan atas.</div>
    <table class="table"><tr><td>Role</td><td><b>${loggedRole==="admin"?"ADMIN / TU":loggedRole.toUpperCase()}</b></td></tr>
    <tr><td>Modul buku induk</td><td>6 modul</td></tr><tr><td>Format cetak</td><td>Folio / F4</td></tr></table>
  </div>
</div>`}

function identitasPage(){return `
<div class="page-head"><div><span class="eyebrow">DATA SISWA</span><h2>Identitas Siswa</h2><p class="sub">Data pokok peserta didik dan foto.</p></div>
<div class="actions"><button class="btn" onclick="saveDemo()">Simpan</button><button class="btn green" onclick="printDoc('Lembar Identitas Siswa','identity')">Print F4</button></div></div>
<div class="card"><div class="student-layout"><div><div class="photo-box">FOTO SISWA<br><small>3 × 4</small></div><button class="btn" style="margin-top:8px;width:135px">Upload Foto</button></div>
<div class="formgrid">
${field("NIS","Nomor Induk Siswa")}${field("NISN","NISN")}${field("Nama Lengkap","Nama lengkap siswa")}${field("Nama Panggilan","Nama panggilan")}
${field("Tempat Lahir","Kabupaten/Kota")}${field("Tanggal Lahir","", "date")}${selectField("Jenis Kelamin",["Laki-laki","Perempuan"])}${field("NIK","Nomor Induk Kependudukan")}
${selectField("Agama",["Islam","Kristen","Katolik","Hindu","Buddha","Konghucu"])}${field("No. KK","Nomor Kartu Keluarga")}${field("Anak Ke","Contoh: 2")}${field("Status Dalam Keluarga","Anak kandung / lainnya")}
<div class="field" style="grid-column:1/-1"><label>Alamat Lengkap</label><textarea placeholder="Alamat tempat tinggal siswa"></textarea></div>
</div></div></div>`}

function field(label,ph,type="text"){return `<div class="field"><label>${label}</label><input type="${type}" placeholder="${ph}"></div>`}
function selectField(label,opts){return `<div class="field"><label>${label}</label><select><option>Pilih ${label.toLowerCase()}</option>${opts.map(x=>`<option>${x}</option>`).join("")}</select></div>`}

function hasilPage(kelas){return `
<div class="page-head"><div><span class="eyebrow">HASIL BELAJAR</span><h2>Laporan Hasil Belajar Kelas ${kelas}</h2><p class="sub">Semester 1 dan Semester 2 · Format Folio / F4.</p></div>
<div class="actions"><button class="btn gold" onclick="printDoc('Laporan Hasil Belajar Kelas ${kelas}','nilai')">Print F4</button><button class="btn">Export</button><button class="btn">Import</button></div></div>
<div class="card"><div class="formgrid"><div class="field"><label>Pilih Siswa</label><select><option>Pilih siswa</option></select></div><div class="field"><label>Tahun Pelajaran</label><input placeholder="2026 / 2027"></div></div>
<div class="semester"><h3>Semester 1</h3></div>${nilaiTable()}<div class="semester"><h3>Semester 2</h3></div>${nilaiTable()}</div>`}

function nilaiTable(){return `<div class="table-wrap"><table class="table subject-table"><thead><tr><th>No</th><th>Mata Pelajaran</th><th>Nilai</th><th>Predikat</th><th>Catatan</th></tr></thead><tbody>${["Pendidikan Agama","Pendidikan Pancasila","Bahasa Indonesia","Matematika","Bahasa Inggris","Sejarah","Informatika","PJOK"].map((x,i)=>`<tr><td>${i+1}</td><td>${x}</td><td><input type="number" min="0" max="100" placeholder="—"></td><td><input placeholder="—"></td><td><input placeholder="—"></td></tr>`).join("")}</tbody></table></div>`}

function lampiranPage(){return `
<div class="page-head"><div><span class="eyebrow">DOKUMEN</span><h2>Ijazah & Sertifikat TKA</h2><p class="sub">Simpan dokumen kelulusan dan sertifikat siswa.</p></div><button class="btn green" onclick="printDoc('Lampiran Ijazah dan Sertifikat TKA','lampiran')">Print F4</button></div>
<div class="card"><div class="formgrid">${field("Pilih Siswa","Pilih siswa")}${selectField("Jenis Dokumen",["Ijazah","Sertifikat TKA","Sertifikat lainnya"])}${field("Nomor Dokumen","Nomor ijazah / sertifikat")}${field("Tanggal Dokumen","", "date")}</div>
<div class="dropzone">Upload dokumen PDF / JPG / PNG</div></div>`}

function passwordPage(){return `
<div class="page-head"><div><span class="eyebrow">KEAMANAN</span><h2>Kelola Sandi</h2><p class="sub">Pengaturan akses akun dashboard.</p></div><button class="btn green" onclick="saveDemo()">Simpan Perubahan</button></div>
<div class="card"><div class="notice">Untuk produksi, password wajib diproses di backend dengan hashing dan session/RBAC.</div>
<div class="password-list">${["ADMIN / TU","KEPALA SEKOLAH","WAKA KURIKULUM","WAKA KESISWAAN","WAKA HUMAS","WAKA SARPRAS","KOPSIS","LABKOM","PERPUSTAKAAN"].map((x,i)=>`<div class="password-row"><b>${x}</b><input value="Akun ${i+1}"><input type="password" placeholder="Sandi baru"><button class="btn">Ubah</button></div>`).join("")}</div></div>`}

function saveDemo(){alert("Data demo siap dihubungkan ke database pada tahap backend.");}
function printDoc(t,type){alert("Pratinjau cetak: "+t+" — format Folio/F4.");}

function tick(){
 const d=new Date();
 const c=document.getElementById("topClock"), dt=document.getElementById("topDate");
 if(c)c.textContent=d.toLocaleTimeString("id-ID",{hour12:false});
 if(dt)dt.textContent=d.toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric"});
}
setInterval(tick,1000);tick();
render("dashboard");

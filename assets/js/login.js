window.MABIDA_LOGIN_READY = true;
/* MABIDA Login Controller - role buttons + account login */
const DEFAULT_ACCOUNTS = {
  admin: [
    {name:'Admin Utama', username:'admin', password:'admin123'},
    {name:'Sub Admin', username:'subadmin', password:'subadmin123'}
  ],
  kepsek: [{name:'Kepala Sekolah', username:'kepsek', password:'kepsek123'}],
  wakil: [
    {name:'Waka Kurikulum', username:'wakakur', password:'wakakur123'},
    {name:'Waka Kesiswaan', username:'wakasis', password:'wakasis123'},
    {name:'Waka Humasy', username:'wakahumasy', password:'humasy123'},
    {name:'Waka Sarana Prasarana', username:'wakasarpras', password:'sarpras123'}
  ],
  kopsis: [{name:'Kopsis', username:'kopsis', password:'kopsis123'}],
  labkom: [{name:'Labkom', username:'labkom', password:'labkom123'}],
  perpustakaan: [{name:'Perpustakaan', username:'perpustakaan', password:'perpus123'}]
};

const ROLE_META = {
  admin: {title:'Login Admin', info:'Admin Utama & Sub Admin'},
  kepsek: {title:'Login Kepala Sekolah', info:'Akun Kepala Sekolah'},
  wakil: {title:'Login Wakil Kepala', info:'Pilih akun Waka Kurikulum, Kesiswaan, Humasy, atau Sarana Prasarana'},
  kopsis: {title:'Login Kopsis', info:'Akun Koperasi Siswa'},
  labkom: {title:'Login Lab Komputer', info:'Akun Laboratorium Komputer'},
  perpustakaan: {title:'Login Perpustakaan', info:'Akun Perpustakaan'}
};

const roleButtons = [...document.querySelectorAll('.role[data-role]')];
const accountSelect = document.getElementById('account');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginBtn');
const togglePassword = document.getElementById('togglePassword');
const forgotButton = document.getElementById('forgot');
const message = document.getElementById('message');
const loginTitle = document.getElementById('loginTitle');
const accountInfo = document.getElementById('accountInfo');

let currentRole = 'admin';

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
}

function readSavedAccounts(){
  try {
    const raw = localStorage.getItem('mabida_all_accounts_v2');
    const data = raw ? JSON.parse(raw) : null;
    return data && typeof data === 'object' ? data : null;
  } catch(e) { return null; }
}

function getAccounts(role){
  const defaults = DEFAULT_ACCOUNTS[role] || [];
  const saved = readSavedAccounts();
  const group = saved?.[role];
  if (!Array.isArray(group)) return defaults.map(x => ({...x}));

  // Kelola Sandi menyimpan object {name, username, password}.
  // Dukungan juga diberikan untuk format lama array [name, username, password].
  return group.map((item, index) => {
    const base = defaults[index] || {name:'Akun', username:'', password:''};
    if (Array.isArray(item)) return {
      name: item[0] || base.name,
      username: item[1] || base.username,
      password: item[2] ?? base.password
    };
    return {
      name: item?.name || base.name,
      username: item?.username || base.username,
      password: item?.password ?? base.password
    };
  });
}

function setMessage(text, type=''){
  if (!message) return;
  message.textContent = text || '';
  message.className = 'message' + (type ? ' ' + type : '');
}

function populateAccounts(role, clearPassword=true){
  currentRole = role;
  const meta = ROLE_META[role] || ROLE_META.admin;
  const list = getAccounts(role);

  roleButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.role === role));
  if (loginTitle) loginTitle.textContent = meta.title;
  if (accountInfo) accountInfo.textContent = meta.info;

  if (accountSelect){
    accountSelect.innerHTML = list.length
      ? list.map((a,i) => `<option value="${i}">${escapeHtml(a.name)}</option>`).join('')
      : '<option value="">Tidak ada akun</option>';
    accountSelect.disabled = !list.length;
  }
  if (clearPassword && passwordInput) passwordInput.value = '';
  setMessage('');
}

function selectedAccount(){
  const list = getAccounts(currentRole);
  const index = accountSelect ? Number(accountSelect.value || 0) : 0;
  return list[index] || null;
}

function routeForAccount(role, account){
  if (role === 'admin') {
    return account?.username === 'subadmin'
      ? 'pages/subadmin/monitoringbulanan.html'
      : 'pages/admin/dashboardadmin.html';
  }
  if (role === 'kepsek') return 'pages/kepsek/dashboardkepsek.html';
  if (role === 'kopsis') return 'pages/kopsis/dashboardkopsis.html';
  if (role === 'labkom') return 'pages/labkom/dashboardlabkom.html';
  if (role === 'perpustakaan') return 'pages/perpustakaan/dashboardperpustakaan.html';
  if (role === 'wakil') {
    const folders = {
      wakakur:'wakakur',
      wakasis:'wakasis',
      wakahumasy:'wakahumasy',
      wakasarpras:'wakasarpras'
    };
    const folder = folders[account?.username] || 'wakakur';
    return `pages/${folder}/dashboard${folder}.html`;
  }
  return 'index.html';
}

function login(){
  const account = selectedAccount();
  const password = passwordInput?.value || '';
  if (!account){ setMessage('Akun tidak tersedia.', 'err'); return; }

  if (password !== account.password){
    setMessage('Sandi tidak sesuai. Silakan periksa kembali.', 'err');
    passwordInput?.focus();
    return;
  }

  const target = routeForAccount(currentRole, account);
  setMessage('Login berhasil. Membuka dashboard...', 'ok');
  const params = new URLSearchParams({role: currentRole, name: account.name});
  window.location.href = `${target}?${params.toString()}`;
}

roleButtons.forEach(btn => btn.addEventListener('click', () => {
  populateAccounts(btn.dataset.role || 'admin');
}));

accountSelect?.addEventListener('change', () => {
  if (passwordInput) passwordInput.value = '';
  setMessage('');
});

loginButton?.addEventListener('click', login);

passwordInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    login();
  }
});

togglePassword?.addEventListener('click', () => {
  if (!passwordInput) return;
  const show = passwordInput.type === 'password';
  passwordInput.type = show ? 'text' : 'password';
  togglePassword.textContent = show ? '◉' : '◌';
  togglePassword.setAttribute('aria-label', show ? 'Sembunyikan sandi' : 'Tampilkan sandi');
});

forgotButton?.addEventListener('click', () => {
  const a = selectedAccount();
  alert(a ? `Silakan gunakan menu Kelola Sandi dari Admin untuk mengubah sandi akun "${a.name}".` : 'Pilih akun terlebih dahulu.');
});

populateAccounts('admin', false);

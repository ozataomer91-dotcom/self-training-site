
console.log('SIGNUP JS BOOT');

// Firebase init (config.js kullanıcıda mevcut olmalı)
if(window.firebaseConfig){ firebase.initializeApp(window.firebaseConfig); }
const auth = firebase.auth();

// yardımcılar
const $ = (sel)=>document.querySelector(sel);
const show=(id)=>$(id).classList.remove('hide');
const hide=(id)=>$(id).classList.add('hide');
const setMsg=(t,ok=false)=>{const m=document.querySelector('.msg');m.className='msg '+(ok?'ok':'err');m.textContent=t;}

// tablar
$('#tabLogin').onclick = ()=>{ setMsg(''); $('#tabLogin').classList.add('active'); $('#tabSignup').classList.remove('active'); show('#loginView'); hide('#signupView'); };
$('#tabSignup').onclick= ()=>{ setMsg(''); $('#tabSignup').classList.add('active'); $('#tabLogin').classList.remove('active'); show('#signupView'); hide('#loginView'); };

// Enter ile gönder
window.addEventListener('keydown', (e)=>{
  if(e.key==='Enter'){ const onSignup = !$('#signupView').classList.contains('hide'); (onSignup ? $('#btnSignup') : $('#btnLogin')).click(); }
}, true);

// Giriş
$('#btnLogin').onclick = async ()=>{
  setMsg('');
  const email = $('#loginEmail').value.trim();
  const pass  = $('#loginPassword').value;
  if(!email || !pass){ setMsg('E-posta ve şifre gerekli.'); return; }
  try{
    await auth.signInWithEmailAndPassword(email, pass);
    setMsg('Giriş başarılı. Yönlendiriliyor…', true);
    location.href='./dashboard.html';
  }catch(e){ setMsg(e.message); }
};

// Şifre sıfırlama
$('#btnForgot').onclick = async ()=>{
  setMsg('');
  const email = $('#loginEmail').value.trim();
  if(!email){ setMsg('Lütfen e-posta yaz.'); return; }
  try{
    await auth.sendPasswordResetEmail(email);
    setMsg('Sıfırlama maili gönderildi (Gelen/Spam).', true);
  }catch(e){ setMsg(e.message); }
};

// Kayıt
$('#btnSignup').onclick = async ()=>{
  setMsg('');
  const name = $('#signupName').value.trim();
  const email= $('#signupEmail').value.trim();
  const p1   = $('#signupPassword').value;
  const p2   = $('#signupPassword2').value;
  if(!name){ setMsg('Ad Soyad zorunlu.'); return; }
  if(!email){ setMsg('E-posta zorunlu.'); return; }
  if((p1||'').length<6){ setMsg('Şifre en az 6 karakter.'); return; }
  if(p1!==p2){ setMsg('Şifreler aynı değil.'); return; }

  try{
    const cred = await auth.createUserWithEmailAndPassword(email, p1);
    await cred.user.updateProfile({ displayName: name });
    await cred.user.sendEmailVerification({ url: location.origin + '/self-training-site/dashboard.html?verified=1', handleCodeInApp:false });
    setMsg('Kayıt tamam. Doğrulama maili gönderildi. Onaylayıp giriş yap.', true);
    $('#tabLogin').click();
    $('#loginEmail').value = email;
  }catch(e){ setMsg(e.message); }
};

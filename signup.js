console.log('SIGNUP JS BOOT');

// sekmeler
$('#tabLogin').onclick  = ()=>{ $('#tabLogin').classList.add('active'); $('#tabSignup').classList.remove('active'); $('#loginView').classList.remove('hide'); $('#signupView').classList.add('hide') };
$('#tabSignup').onclick = ()=>{ $('#tabSignup').classList.add('active'); $('#tabLogin').classList.remove('active'); $('#signupView').classList.remove('hide'); $('#loginView').classList.add('hide') };

const setMsg=(t,ok=false)=>{const m=$('#globalMsg');m.className='msg '+(ok?'ok':'err');m.textContent=t};
const goDash = ()=>location.href='./dashboard.html';

// Giriş
$('#btnLogin').onclick = async ()=>{
  const email = $('#loginEmail').value.trim();
  const pass  = $('#loginPassword').value;
  if(!email || !pass) return setMsg('E-posta ve şifre gerekli.');
  try{
    if(window.firebase?.auth) await firebase.auth().signInWithEmailAndPassword(email,pass);
    setMsg('Giriş başarılı.',true); goDash();
  }catch(e){ setMsg('Giriş başarısız'); }
};

// Şifre sıfırla
$('#btnForgot').onclick = async ()=>{
  const email = $('#loginEmail').value.trim();
  if(!email) return setMsg('E-posta yaz.');
  try{
    if(window.firebase?.auth) await firebase.auth().sendPasswordResetEmail(email);
    setMsg('Sıfırlama maili gönderildi.',true);
  }catch(e){ setMsg('İşlem başarısız'); }
};

// Kayıt
$('#btnSignup').onclick = async ()=>{
  const name=$('#signupName').value.trim(), email=$('#signupEmail').value.trim();
  const p1=$('#signupPassword').value, p2=$('#signupPassword2').value;
  if(!name) return setMsg('Ad Soyad zorunlu');
  if(!email) return setMsg('E-posta zorunlu');
  if((p1||'').length<6) return setMsg('Şifre en az 6 karakter');
  if(p1!==p2) return setMsg('Şifreler aynı değil');
  try{
    if(window.firebase?.auth){
      const cred=await firebase.auth().createUserWithEmailAndPassword(email,p1);
      await cred.user.updateProfile({displayName:name});
    } else {
      store.set('demo_user',{name,email});
    }
    setMsg('Kayıt başarılı.',true); goDash();
  }catch(e){ setMsg('Kayıt başarısız'); }
};

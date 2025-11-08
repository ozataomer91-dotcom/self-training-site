console.log("[signup.js] yüklendi");
firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();

// Kısayol
const $ = (id)=>document.getElementById(id);
const show=(id)=>$(id).classList.remove("hide");
const hide=(id)=>$(id).classList.add("hide");
const setMsg=(t,ok=false)=>{const m=$("globalMsg");m.className="msg "+(ok?"ok":"err");m.textContent=t}
const clearMsg=()=>{const m=$("globalMsg");m.className="msg";m.textContent=""}

const tr = (c)=>({
  "auth/invalid-email":"Geçersiz e‑posta.",
  "auth/missing-password":"Şifre gerekli.",
  "auth/wrong-password":"E‑posta/şifre hatalı.",
  "auth/user-not-found":"Kullanıcı bulunamadı.",
  "auth/email-already-in-use":"Bu e‑posta zaten kayıtlı.",
  "auth/weak-password":"Şifre çok zayıf.",
  "auth/network-request-failed":"Ağ hatası.",
  "auth/api-key-not-valid.please-pass-a-valid-api-key.":"API anahtarı geçersiz (config.js)."
}[c] || `İşlem başarısız (${c}).`);

// Sekmeler
$("tabLogin").onclick=()=>{clearMsg();$("tabLogin").classList.add("active");$("tabSignup").classList.remove("active");show("loginView");hide("signupView");};
$("tabSignup").onclick=()=>{clearMsg();$("tabSignup").classList.add("active");$("tabLogin").classList.remove("active");show("signupView");hide("loginView");};

// ENTER ile gönder
window.addEventListener("keydown",(e)=>{
  if(e.key==="Enter"){
    const onSignup = !$("signupView").classList.contains("hide");
    (onSignup? $("btnSignup"): $("btnLogin")).click();
  }
}, true);

// Giriş
$("btnLogin").onclick = async ()=>{
  clearMsg();
  const email = $("loginEmail").value.trim();
  const pass  = $("loginPassword").value;
  console.log("[login] Click");
  if(!email || !pass){ setMsg("E‑posta ve şifre gerekli."); return; }
  try{
    await auth.signInWithEmailAndPassword(email, pass);
    setMsg("Giriş başarılı. Yönlendiriliyor…", true);
    location.href = "./dashboard.html";
  }catch(e){
    console.warn("[login] hata:", e.code, e.message);
    setMsg(tr(e.code));
  }
};

// Şifre sıfırlama
$("btnForgot").onclick = async ()=>{
  clearMsg();
  const email = $("loginEmail").value.trim();
  if(!email){ setMsg("Lütfen e‑posta yaz."); return; }
  try{
    await auth.sendPasswordResetEmail(email);
    setMsg("Sıfırlama maili gönderildi (Gelen/Spam).", true);
  }catch(e){ setMsg(tr(e.code)); }
};

// Kayıt
$("btnSignup").onclick = async ()=>{
  clearMsg();
  const name = $("signupName").value.trim();
  const email= $("signupEmail").value.trim();
  const p1   = $("signupPassword").value;
  const p2   = $("signupPassword2").value;
  if(!name){ setMsg("Ad Soyad gerekli."); return; }
  if(!email){ setMsg("E‑posta gerekli."); return; }
  if((p1||'').length<6){ setMsg("Şifre en az 6 karakter."); return; }
  if(p1!==p2){ setMsg("Şifreler aynı değil."); return; }
  try{
    const cred = await auth.createUserWithEmailAndPassword(email,p1);
    await cred.user.updateProfile({ displayName: name });
    setMsg("Kayıt tamam. Giriş yapabilirsiniz.", true);
    $("tabLogin").click();
    $("loginEmail").value = email;
  }catch(e){ setMsg(tr(e.code)); }
};

console.log("[signup] hazır");

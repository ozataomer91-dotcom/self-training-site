// v=20
console.log("SIGNUP JS BOOT");

// Firebase init (çift başlatmayı önle)
if (!firebase.apps.length) {
  firebase.initializeApp(window.firebaseConfig);
}
const auth = firebase.auth();

// Kısayollar
const $ = (id)=>document.getElementById(id);
const show=(id)=>$(id).classList.remove("hide");
const hide=(id)=>$(id).classList.add("hide");
const setMsg=(t,ok=false)=>{const m=$("globalMsg");m.className="msg "+(ok?"ok":"err");m.textContent=t}
const clearMsg=()=>{const m=$("globalMsg");m.className="msg";m.textContent=""}

// Hata çevirici
const tr = (c) => ({
  "auth/invalid-email":"Geçersiz e-posta.",
  "auth/missing-password":"Şifre gerekli.",
  "auth/wrong-password":"E-posta/şifre hatalı.",
  "auth/user-not-found":"Kullanıcı bulunamadı.",
  "auth/email-already-in-use":"Bu e-posta zaten kayıtlı.",
  "auth/weak-password":"Şifre çok zayıf.",
  "auth/network-request-failed":"Ağ hatası.",
  "auth/too-many-requests":"Çok fazla deneme yaptın. Biraz bekle.",
  "auth/api-key-not-valid.please-pass-a-valid-api-key.":"API anahtarı geçersiz (config.js kontrol)."
}[c] || İşlem başarısız (${c}).);

// Sekmeler
$("tabLogin").onclick  = ()=>{ clearMsg(); $("tabLogin").classList.add("active"); $("tabSignup").classList.remove("active"); show("loginView"); hide("signupView"); };
$("tabSignup").onclick = ()=>{ clearMsg(); $("tabSignup").classList.add("active"); $("tabLogin").classList.remove("active"); show("signupView"); hide("loginView"); };

// ENTER ile gönder
window.addEventListener("keydown",(e)=>{
  if(e.key==="Enter"){
    const onSignup = !$("signupView").classList.contains("hide");
    (onSignup ? $("btnSignup") : $("btnLogin")).click();
  }
}, true);

// Giriş — e-posta doğrulaması ŞART DEĞİL
$("btnLogin").onclick = async ()=>{
  clearMsg();
  const email = $("loginEmail").value.trim();
  const pass  = $("loginPassword").value;
  if(!email || !pass){ setMsg("E-posta ve şifre gerekli."); return; }
  try{
    await auth.signInWithEmailAndPassword(email, pass);
    setMsg("Giriş başarılı. Yönlendiriliyor…", true);
    location.href = "/self-training-site/dashboard.html";
  }catch(e){ setMsg(tr(e.code)); }
};

// Şifre sıfırlama — mail gönder
$("btnForgot").onclick = async ()=>{
  clearMsg();
  const email = $("loginEmail").value.trim();
  if(!email){ setMsg("Lütfen e-posta yaz."); return; }
  try{
    await auth.sendPasswordResetEmail(email);
    setMsg("Sıfırlama maili gönderildi (Gelen/Spam).", true);
  }catch(e){ setMsg(tr(e.code)); }
};

// Kayıt — isim OPSİYONEL, doğrulama maili kayıt aşamasında gönderilir
$("btnSignup").onclick = async ()=>{
  clearMsg();
  const name = ($("signupName")?.value || "").trim(); // opsiyonel
  const email= $("signupEmail").value.trim();
  const p1   = $("signupPassword").value;
  const p2   = $("signupPassword2").value;

  if(!email){ setMsg("E-posta zorunlu."); return; }
  if((p1||"").length < 6){ setMsg("Şifre en az 6 karakter."); return; }
  if(p1 !== p2){ setMsg("Şifreler aynı değil."); return; }

  try{
    const cred = await auth.createUserWithEmailAndPassword(email, p1);
    if (name) { await cred.user.updateProfile({ displayName: name }); } // ad varsa kaydet

    // Kayıt aşamasında doğrulama maili (opsiyonel kullanım)
    await cred.user.sendEmailVerification({
      url: "https://ozataomer91-dotcom.github.io/self-training-site/dashboard.html?verified=1",
      handleCodeInApp: false
    });

    setMsg("Kayıt tamam. Doğrulama maili gönderildi. Onaylayıp giriş yap.", true);
    $("tabLogin").click();
    $("loginEmail").value = email;
  }catch(e){ setMsg(tr(e.code)); }
};

// Basit “canlı” işareti
console.log("[signup.js] yüklendi");

// DOM hazır olduğunda bağla (butonlar kesin çalışsın)
(function ready(fn){
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
})(function main(){
  // Eleman kısayolu
  const $ = (id)=>document.getElementById(id);
  const msg = (t, ok=false)=>{ const m=$("globalMsg"); m.className="msg "+(ok?"ok":"err"); m.textContent=t };

  // config.js geldi mi?
  if (!window.firebaseConfig || !window.firebaseConfig.apiKey) {
    console.error("config.js yüklenmedi ya da eksik.");
    msg("Sunucu ayarı eksik (config.js).", false);
    return;
  }

  // Firebase
  try {
    firebase.initializeApp(window.firebaseConfig);
  } catch(e) {
    // “app already exists” olursa sorun değil
    if (!/already exists/.test(e.message)) throw e;
  }
  const auth = firebase.auth();

  // Sekmeler
  $("tabLogin").onclick  = ()=>{ msg(""); $("tabLogin").classList.add("active"); $("tabSignup").classList.remove("active"); $("loginView").classList.remove("hide"); $("signupView").classList.add("hide"); };
  $("tabSignup").onclick = ()=>{ msg(""); $("tabSignup").classList.add("active"); $("tabLogin").classList.remove("active"); $("signupView").classList.remove("hide"); $("loginView").classList.add("hide"); };

  // ENTER ile gönder
  window.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
      const onSignup = !$("signupView").classList.contains("hide");
      (onSignup ? $("btnSignup") : $("btnLogin")).click();
    }
  }, true);

  // GİRİŞ
  $("btnLogin").onclick = async ()=>{
    msg("");
    console.log("[login] click");
    const email = $("loginEmail").value.trim();
    const pass  = $("loginPassword").value;
    if(!email || !pass){ msg("E-posta ve şifre gerekli."); return; }
    try{
      await auth.signInWithEmailAndPassword(email, pass);
      msg("Giriş başarılı. Yönlendiriliyor…", true);
      location.href = "./dashboard.html";
    }catch(e){
      console.warn("[login] hata:", e.code, e.message);
      const tr = {
        "auth/invalid-email":"Geçersiz e-posta.",
        "auth/missing-password":"Şifre gerekli.",
        "auth/wrong-password":"E-posta/şifre hatalı.",
        "auth/user-not-found":"Kullanıcı bulunamadı.",
        "auth/too-many-requests":"Çok deneme. Biraz bekleyin.",
        "auth/network-request-failed":"Ağ hatası.",
        "auth/invalid-api-key":"API anahtarı geçersiz (config.js)."
      }[e.code] || ("İşlem başarısız ("+e.code+").");
      msg(tr);
    }
  };

  // ŞİFREMİ UNUTTUM
  $("btnForgot").onclick = async ()=>{
    msg("");
    const email = $("loginEmail").value.trim();
    if(!email){ msg("Lütfen e-posta yaz."); return; }
    try{
      await auth.sendPasswordResetEmail(email);
      msg("Sıfırlama maili gönderildi. (Gelen/Spam)", true);
    }catch(e){
      msg("Gönderilemedi ("+e.code+").");
    }
  };

  // KAYIT
  $("btnSignup").onclick = async ()=>{
    msg("");
    const name = $("signupName").value.trim();
    const email= $("signupEmail").value.trim();
    const p1   = $("signupPassword").value;
    const p2   = $("signupPassword2").value;
    if(!email){ msg("E-posta zorunlu."); return; }
    if((p1||"").length<6){ msg("Şifre en az 6 karakter."); return; }
    if(p1!==p2){ msg("Şifreler aynı değil."); return; }
    try{
      const cred = await auth.createUserWithEmailAndPassword(email, p1);
      if(name) await cred.user.updateProfile({ displayName: name });
      await cred.user.sendEmailVerification({
        url: location.origin + location.pathname.replace(/\/[^/]*$/,'/') + "dashboard.html?verified=1",
        handleCodeInApp: false
      });
      msg("Kayıt tamam. Doğrulama maili gönderildi. Onaylayıp giriş yapın.", true);
      $("tabLogin").click();
      $("loginEmail").value = email;
    }catch(e){
      msg("Kayıt başarısız ("+e.code+").");
    }
  };

  console.log("[signup] hazır");
});

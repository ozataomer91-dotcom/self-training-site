// Basit koruma: bazı overlay/eklenti katmanlarını periyodik gizle
(function guard(){
  try{
    document.body.contentEditable = "false";
    document.designMode = "off";
    const kill = (k)=>document
      .querySelectorAll([id*="${k}"],[class*="${k}"])
      .forEach(el=>el.remove());
    ["monica","grammarly","glasp"].forEach(kill);
  }catch(_){}
  setTimeout(guard, 800);
})();

// Firebase'i hazırla
firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();

// Kısa yardımcılar
const $   = (id)=>document.getElementById(id);
const show= (id)=>$(id).classList.remove("hide");
const hide= (id)=>$(id).classList.add("hide");
const msg = (t, ok)=>{
  const m = $("globalMsg");
  m.className = "msg " + (ok ? "ok" : "err");
  m.textContent = t;
};
const clr = ()=>{
  const m = $("globalMsg");
  m.className = "msg";
  m.textContent = "";
};

// Hata çevirileri
const t = (c)=>({
  "auth/invalid-email":"Geçersiz e-posta.",
  "auth/missing-password":"Şifre gerekli.",
  "auth/wrong-password":"E-posta/şifre hatalı.",
  "auth/user-not-found":"Kullanıcı bulunamadı.",
  "auth/email-already-in-use":"Bu e-posta zaten kayıtlı.",
  "auth/weak-password":"Şifre çok zayıf.",
  "auth/network-request-failed":"Ağ hatası.",
  "auth/too-many-requests":"Çok fazla deneme. Biraz bekle.",
  "auth/api-key-not-valid.please-pass-a-valid-api-key.":"API anahtarı geçersiz (config.js'i kontrol et)."
}[c] || İşlem başarısız (${c}).); // <-- BURASI ARTIK BACKTICK İÇİNDE

// Sekmeler
$("tabLogin").addEventListener("click", ()=>{
  clr(); $("tabLogin").classList.add("active"); $("tabSignup").classList.remove("active");
  show("loginView"); hide("signupView");
});
$("tabSignup").addEventListener("click", ()=>{
  clr(); $("tabSignup").classList.add("active"); $("tabLogin").classList.remove("active");
  show("signupView"); hide("loginView");
});

// ENTER ile gönder
window.addEventListener("keydown",(e)=>{
  if(e.key === "Enter"){
    const onSignup = !$("signupView").classList.contains("hide");
    if(onSignup) $("btnSignup").click(); else $("btnLogin").click();
  }
}, true);

// GİRİŞ
$("btnLogin").addEventListener("click", async ()=>{
  clr();
  const email = $("loginEmail").value.trim();
  const pass  = $("loginPassword").value;
  if(!email || !pass){ msg("E-posta ve şifre gerekli."); return; }
  try{
    const cred = await auth.signInWithEmailAndPassword(email, pass);
    if(!cred.user.emailVerified){
      msg("E-posta doğrulanmamış. Maildeki linke tıkla, sonra tekrar giriş yap.");
      await auth.signOut(); return;
    }
    msg("Giriş başarılı. Yönlendiriliyor…", true);
    location.href = "./dashboard.html";
  }catch(e){ msg(t(e.code)); }
});

// ŞİFRE SIFIRLAMA
$("btnForgot").addEventListener("click", async ()=>{
  clr();
  const email = $("loginEmail").value.trim();
  if(!email){ msg("Lütfen e-posta yaz."); return; }
  try{
    await auth.sendPasswordResetEmail(email);
    msg("Sıfırlama maili gönderildi (Gelen/Spam).", true);
  }catch(e){ msg(t(e.code)); }
});

// KAYIT
$("btnSignup").addEventListener("click", async ()=>{
  clr();
  const name  = $("signupName").value.trim();
  const email = $("signupEmail").value.trim();
  const p1    = $("signupPassword").value;
  const p2    = $("signupPassword2").value;

  if(!name){ msg("Ad Soyad zorunlu."); return; }
  if(!email){ msg("E-posta zorunlu."); return; }
  if((p1||"").length < 6){ msg("Şifre en az 6 karakter."); return; }
  if(p1 !== p2){ msg("Şifreler aynı değil."); return; }

  try{
    const cred = await auth.createUserWithEmailAndPassword(email, p1);
    await cred.user.updateProfile({ displayName: name });
    await cred.user.sendEmailVerification();
    msg("Kayıt tamam. Doğrulama maili gönderildi. Onaylayıp giriş yap.", true);
    $("tabLogin").click();
    $("loginEmail").value = email;
  }catch(e){ msg(t(e.code)); }
});

// signup.js
console.log("[signup.js] yüklendi");

// Kısayollar
const $ = (id)=>document.getElementById(id);
const show=(id)=>$(id).classList.remove("hide");
const hide=(id)=>$(id).classList.add("hide");
const setMsg=(t, ok=false)=>{ const m=$("globalMsg"); m.className="msg "+(ok?"ok":"err"); m.textContent=t; }
const clearMsg=()=>{ const m=$("globalMsg"); m.className="msg"; m.textContent=""; }

// Sekmeler
$("tabLogin").onclick  = ()=>{ clearMsg(); $("tabLogin").classList.add("active"); $("tabSignup").classList.remove("active"); show("loginView"); hide("signupView"); };
$("tabSignup").onclick = ()=>{ clearMsg(); $("tabSignup").classList.add("active"); $("tabLogin").classList.remove("active"); show("signupView"); hide("loginView"); };

// DEMO modu: apiKey boşsa true
const DEMO = !window.firebaseConfig || !window.firebaseConfig.apiKey;
if (DEMO) {
  console.warn("DEMO MODE aktif (Firebase anahtarları boş).");
  const hint = $("cfgHint");
  if (hint) hint.textContent = "config.js içindeki Firebase alanlarını sonra doldurabilirsin. Şu an DEMO giriş açıktır.";
} else {
  try {
    firebase.initializeApp(window.firebaseConfig);
    console.log("[signup] Firebase init OK");
  } catch (e) {
    console.error("Firebase init hata:", e);
  }
}

// Hata çevirici
const tr = (c)=>({
  "auth/invalid-email":"Geçersiz e-posta.",
  "auth/missing-password":"Şifre gerekli.",
  "auth/wrong-password":"E-posta/şifre hatalı.",
  "auth/user-not-found":"Kullanıcı bulunamadı.",
  "auth/email-already-in-use":"Bu e-posta zaten kayıtlı.",
  "auth/weak-password":"Şifre çok zayıf.",
  "auth/network-request-failed":"Ağ hatası.",
  "auth/too-many-requests":"Çok fazla deneme. Biraz bekle.",
  "auth/api-key-not-valid.please-pass-a-valid-api-key.":"API anahtarı geçersiz (config.js doldur).",
}[c] || İşlem başarısız (${c}).);

console.log("[signup] hazır");

// Giriş
$("btnLogin").onclick = async ()=>{
  clearMsg();
  const email = $("loginEmail").value.trim();
  const pass  = $("loginPassword").value;

  if (!email || !pass) { setMsg("E-posta ve şifre gerekli."); return; }

  if (DEMO) {
    setMsg("Giriş başarılı (DEMO). Yönlendiriliyor…", true);
    // basit demo oturumu
    try { localStorage.setItem("st_user_demo", JSON.stringify({email, t:Date.now()})); } catch {}
    location.href = "./dashboard.html";
    return;
  }

  try{
    const auth = firebase.auth();
    await auth.signInWithEmailAndPassword(email, pass);
    setMsg("Giriş başarılı. Yönlendiriliyor…", true);
    location.href = "./dashboard.html";
  }catch(e){ setMsg(tr(e.code)); }
};

// Şifre sıfırlama
$("btnForgot").onclick = async ()=>{
  clearMsg();
  const email = $("loginEmail").value.trim();
  if (!email) { setMsg("Lütfen e-posta yaz."); return; }

  if (DEMO) {
    setMsg("DEMO: Şifre sıfırlama maili simüle edildi.", true);
    return;
  }

  try{
    const auth = firebase.auth();
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
  if(!email){ setMsg("E-posta gerekli."); return; }
  if((p1||"").length < 6){ setMsg("Şifre en az 6 karakter."); return; }
  if(p1 !== p2){ setMsg("Şifreler aynı değil."); return; }

  if (DEMO) {
    setMsg("Kayıt başarılı (DEMO). Girişe geçiriyorum…", true);
    $("tabLogin").click();
    $("loginEmail").value = email;
    $("loginPassword").value = p1;
    return;
  }

  try{
    const auth = firebase.auth();
    const cred = await auth.createUserWithEmailAndPassword(email, p1);
    await cred.user.updateProfile({ displayName: name });
    setMsg("Kayıt tamam. Giriş yapabilirsin.", true);
    $("tabLogin").click();
    $("loginEmail").value = email;
  }catch(e){ setMsg(tr(e.code)); }
};

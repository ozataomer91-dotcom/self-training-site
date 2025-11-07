// v=21
console.log("SIGNUP JS v21 BOOT");

// Firebase init (çift başlatma koruması)
if (!firebase.apps.length) {
  firebase.initializeApp(window.firebaseConfig);
}
const auth = firebase.auth();

// Kısayollar
const $ = (id)=>document.getElementById(id);
const show=(id)=>$(id).classList.remove("hide");
const hide=(id)=>$(id).classList.add("hide");
const setMsg=(t,ok=false)=>{const m=$("globalMsg");m.className="msg "+(ok?"ok":"err");m.textContent=t;};
const clearMsg=()=>{const m=$("globalMsg");m.className="msg";m.textContent="";};

// Hata çevirici (backtick yok, güvenli)
const tr = function(c){
  var map = {
    "auth/invalid-email":"Geçersiz e-posta.",
    "auth/missing-password":"Şifre gerekli.",
    "auth/wrong-password":"E-posta/şifre hatalı.",
    "auth/user-not-found":"Kullanıcı bulunamadı.",
    "auth/email-already-in-use":"Bu e-posta zaten kayıtlı.",
    "auth/weak-password":"Şifre çok zayıf.",
    "auth/network-request-failed":"Ağ hatası.",
    "auth/too-many-requests":"Çok fazla deneme yaptın. Biraz bekle.",
    "auth/api-key-not-valid.please-pass-a-valid-api-key.":"API anahtarı geçersiz (config.js kontrol)."
  };
  if (map[c]) return map[c];
  return "İşlem başarısız (" + c + ").";
};

// Sekmeler
$("tabLogin").onclick = function(){
  clearMsg(); $("tabLogin").classList.add("active");
  $("tabSignup").classList.remove("active"); show("loginView"); hide("signupView");
};
$("tabSignup").onclick = function(){
  clearMsg(); $("tabSignup").classList.add("active");
  $("tabLogin").classList.remove("active"); show("signupView"); hide("loginView");
};

// ENTER ile gönder
window.addEventListener("keydown", function(e){
  if(e.key==="Enter"){
    var onSignup = !$("signupView").classList.contains("hide");
    (onSignup ? $("btnSignup") : $("btnLogin")).click();
  }
}, true);

// Giriş
$("btnLogin").onclick = async function(){
  clearMsg();
  var email = $("loginEmail").value.trim();
  var pass  = $("loginPassword").value;
  if(!email || !pass){ setMsg("E-posta ve şifre gerekli."); return; }
  try{
    await auth.signInWithEmailAndPassword(email, pass);
    setMsg("Giriş başarılı. Yönlendiriliyor…", true);
    location.href = "/self-training-site/dashboard.html";
  }catch(e){ setMsg(tr(e.code)); }
};

// Şifre sıfırlama
$("btnForgot").onclick = async function(){
  clearMsg();
  var email = $("loginEmail").value.trim();
  if(!email){ setMsg("Lütfen e-posta yaz."); return; }
  try{
    await auth.sendPasswordResetEmail(email);
    setMsg("Sıfırlama maili gönderildi (Gelen/Spam).", true);
  }catch(e){ setMsg(tr(e.code)); }
};

// Kayıt — isim OPSİYONEL
$("btnSignup").onclick = async function(){
  clearMsg();
  var name = ($("signupName") && $("signupName").value ? $("signupName").value.trim() : "");
  var email= $("signupEmail").value.trim();
  var p1   = $("signupPassword").value;
  var p2   = $("signupPassword2").value;

  if(!email){ setMsg("E-posta zorunlu."); return; }
  if((p1||"").length < 6){ setMsg("Şifre en az 6 karakter."); return; }
  if(p1 !== p2){ setMsg("Şifreler aynı değil."); return; }

  try{
    const cred = await auth.createUserWithEmailAndPassword(email, p1);
    if (name) { await cred.user.updateProfile({ displayName: name }); }

    await cred.user.sendEmailVerification({
      url: "https://ozataomer91-dotcom.github.io/self-training-site/dashboard.html?verified=1",
      handleCodeInApp: false
    });

    setMsg("Kayıt tamam. Doğrulama maili gönderildi. Onaylayıp giriş yap.", true);
    $("tabLogin").click();
    $("loginEmail").value = email;
  }catch(e){ setMsg(tr(e.code)); }
};

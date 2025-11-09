console.log("[signup.js] yüklendi");
window.$ = window.$ || (id => document.getElementById(id));

(function(){
  const badCfg = !window.firebaseConfig || !window.firebaseConfig.apiKey || /YOUR_API_KEY/i.test(window.firebaseConfig.apiKey);

  const show=(id)=>$(id).classList.remove("hide");
  const hide=(id)=>$(id).classList.add("hide");
  const msg=(t,ok=false)=>{const m=$("globalMsg");m.className="msg "+(ok?"ok":"err");m.textContent=t};
  const clr=()=>{const m=$("globalMsg");m.className="msg";m.textContent=""};

  $("tabLogin").onclick  = ()=>{ clr(); $("tabLogin").classList.add("active"); $("tabSignup").classList.remove("active"); show("loginView"); hide("signupView"); };
  $("tabSignup").onclick = ()=>{ clr(); $("tabSignup").classList.add("active"); $("tabLogin").classList.remove("active"); show("signupView"); hide("loginView"); };

  if(badCfg){
    ["btnLogin","btnForgot","btnSignup"].forEach(id=>{$(id).disabled=true});
    msg("config.js içindeki Firebase alanlarını doldur. (apiKey/authDomain/projectId vb.)");
    return;
  }

  try{ firebase.initializeApp(window.firebaseConfig); }catch(e){ if(!/already exists/i.test(e.message)) throw e; }
  const auth = firebase.auth();

  const tr = (c) => ({
    "auth/invalid-email":"Geçersiz e-posta.",
    "auth/missing-password":"Şifre gerekli.",
    "auth/wrong-password":"E-posta/şifre hatalı.",
    "auth/user-not-found":"Kullanıcı bulunamadı.",
    "auth/email-already-in-use":"Bu e-posta zaten kayıtlı.",
    "auth/weak-password":"Şifre çok zayıf.",
    "auth/network-request-failed":"Ağ hatası.",
    "auth/too-many-requests":"Çok fazla deneme. Biraz bekle."
  }[c] || `İşlem başarısız (${c}).`);

  window.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
      const onSignup = !$("signupView").classList.contains("hide");
      (onSignup ? $("btnSignup") : $("btnLogin")).click();
    }
  }, true);

  $("btnLogin").onclick = async ()=>{
    clr();
    const email = $("loginEmail").value.trim();
    const pass  = $("loginPassword").value;
    if(!email || !pass){ msg("E-posta ve şifre gerekli."); return; }
    try{
      await auth.signInWithEmailAndPassword(email, pass);
      msg("Giriş başarılı. Yönlendiriliyor…", true);
      location.href = "./dashboard.html";
    }catch(e){ msg(tr(e.code)); }
  };

  $("btnForgot").onclick = async ()=>{
    clr();
    const email = $("loginEmail").value.trim();
    if(!email){ msg("Lütfen e-posta yaz."); return; }
    try{
      await auth.sendPasswordResetEmail(email);
      msg("Sıfırlama maili gönderildi (Gelen/Spam).", true);
    }catch(e){ msg(tr(e.code)); }
  };

  $("btnSignup").onclick = async ()=>{
    clr();
    const name = $("signupName").value.trim();
    const email= $("signupEmail").value.trim();
    const p1   = $("signupPassword").value;
    const p2   = $("signupPassword2").value;
    if(!name){ msg("Ad Soyad zorunlu."); return; }
    if(!email){ msg("E-posta zorunlu."); return; }
    if((p1||"").length<6){ msg("Şifre en az 6 karakter."); return; }
    if(p1!==p2){ msg("Şifreler aynı değil."); return; }
    try{
      const cred = await auth.createUserWithEmailAndPassword(email, p1);
      await cred.user.updateProfile({ displayName: name });
      try{
        await cred.user.sendEmailVerification({ url: location.origin + location.pathname.replace(/[^\/]+$/, "") + "dashboard.html?verified=1" });
        msg("Kayıt tamam. Doğrulama maili gönderildi. Onaylayıp giriş yap.", true);
      }catch(_){ msg("Kayıt tamam. (Doğrulama maili gönderilemedi.)", true); }
      $("tabLogin").click();
      $("loginEmail").value = email;
    }catch(e){ msg(tr(e.code)); }
  };

  console.log("[signup] hazır");
})();
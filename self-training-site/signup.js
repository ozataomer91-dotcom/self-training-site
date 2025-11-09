console.log("[signup.js] yüklendi");
const $ = (sel)=>document.querySelector(sel);
const msg=(t,ok)=>{const m=$("#globalMsg");m.className="msg "+(ok?"ok":"err");m.textContent=t||""};

// Sekmeler
$("#tabLogin").onclick = ()=>{ msg(""); $("#tabLogin").classList.add("active"); $("#tabSignup").classList.remove("active"); $("#loginView").classList.remove("hide"); $("#signupView").classList.add("hide"); };
$("#tabSignup").onclick= ()=>{ msg(""); $("#tabSignup").classList.add("active"); $("#tabLogin").classList.remove("active"); $("#signupView").classList.remove("hide"); $("#loginView").classList.add("hide"); };

// DEMO modu mu?
const DEMO = !!window.USE_DEMO_AUTH;

// Firebase init (anahtar varsa)
let auth=null;
try{
  if(!DEMO){
    firebase.initializeApp(window.firebaseConfig);
    auth=firebase.auth();
    console.log("CONFIG OK");
  }else{
    console.log("DEMO MODE: Firebase kapalı");
  }
}catch(e){
  console.warn("Firebase init hata:", e);
  msg("config.js içindeki Firebase alanlarını doldurun (apiKey/authDomain).", false);
}

// ENTER ile gönder
window.addEventListener("keydown",(e)=>{
  if(e.key==="Enter"){
    const onSignup = !$("#signupView").classList.contains("hide");
    (onSignup ? $("#btnSignup") : $("#btnLogin")).click();
  }
}, true);

// GİRİŞ
$("#btnLogin").onclick = async ()=>{
  msg("");
  const email=$("#loginEmail").value.trim();
  const pass =$("#loginPassword").value;
  if(!email||!pass){ msg("E‑posta ve şifre gerekli."); return; }

  if(DEMO){
    // Basit demo kimliği (localStorage)
    localStorage.setItem("st_demo_user", JSON.stringify({email}));
    msg("Giriş başarılı (DEMO). Yönlendiriliyor…", true);
    location.href="./dashboard.html";
    return;
  }

  try{
    await auth.signInWithEmailAndPassword(email, pass);
    msg("Giriş başarılı. Yönlendiriliyor…", true);
    location.href="./dashboard.html";
  }catch(e){
    console.error("[login] hata:", e);
    msg(e.message||"Giriş başarısız.");
  }
};

// ŞİFRE SIFIRLA
$("#btnForgot").onclick = async ()=>{
  const email=$("#loginEmail").value.trim();
  if(!email){ msg("Lütfen e‑posta yaz."); return; }

  if(DEMO){
    alert("DEMO: parola sıfırlama e‑postası simüle edildi.");
    msg("Sıfırlama maili gönderildi (DEMO).", true);
    return;
  }

  try{
    await auth.sendPasswordResetEmail(email);
    msg("Sıfırlama maili gönderildi (Gelen/Spam).", true);
  }catch(e){ msg(e.message||"İşlem başarısız."); }
};

// KAYIT
$("#btnSignup").onclick = async ()=>{
  msg("");
  const name = $("#signupName").value.trim();
  const email= $("#signupEmail").value.trim();
  const p1   = $("#signupPassword").value;
  const p2   = $("#signupPassword2").value;
  if(!name){ msg("Ad Soyad gerekli."); return; }
  if(!email){ msg("E‑posta gerekli."); return; }
  if((p1||"").length<6){ msg("Şifre en az 6 karakter."); return; }
  if(p1!==p2){ msg("Şifreler aynı değil."); return; }

  if(DEMO){
    const users = JSON.parse(localStorage.getItem("st_demo_users")||"[]");
    users.push({name,email});
    localStorage.setItem("st_demo_users", JSON.stringify(users));
    msg("Kayıt tamam (DEMO). Giriş sekmesine dön.", true);
    $("#tabLogin").click();
    $("#loginEmail").value=email;
    return;
  }

  try{
    const cred = await auth.createUserWithEmailAndPassword(email, p1);
    await cred.user.updateProfile({ displayName: name });
    await cred.user.sendEmailVerification({ url: location.origin+"/self-training-site/dashboard.html?verified=1" });
    msg("Kayıt tamam. Doğrulama maili gönderildi. Onaylayıp giriş yap.", true);
    $("#tabLogin").click();
    $("#loginEmail").value=email;
  }catch(e){ msg(e.message||"Kayıt başarısız."); }
};

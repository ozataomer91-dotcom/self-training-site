// AUTH
console.log("AUTH JS BOOT");
firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();

// helpers
const $ = (id)=>document.getElementById(id);
const show=(id)=>$(id).classList.remove("hide");
const hide=(id)=>$(id).classList.add("hide");
const setMsg=(t,ok=false)=>{const m=$("globalMsg");m.className="msg "+(ok?"ok":"err");m.textContent=t}
const clearMsg=()=>{const m=$("globalMsg");m.className="msg";m.textContent=""}

// tabs
$("tabLogin").onclick  = ()=>{ clearMsg(); $("tabLogin").classList.add("active"); $("tabSignup").classList.remove("active"); show("loginView"); hide("signupView"); };
$("tabSignup").onclick = ()=>{ clearMsg(); $("tabSignup").classList.add("active"); $("tabLogin").classList.remove("active"); show("signupView"); hide("loginView"); };

// enter submits current view
window.addEventListener("keydown",(e)=>{
  if(e.key==="Enter"){
    const onSignup = !$("signupView").classList.contains("hide");
    (onSignup ? $("btnSignup") : $("btnLogin")).click();
  }
}, true);

// if already logged in -> dashboard
auth.onAuthStateChanged(u=>{ if(u){ location.href = "./dashboard.html"; }});

// login
$("btnLogin").onclick = async ()=>{
  clearMsg();
  const email = $("loginEmail").value.trim();
  const pass  = $("loginPassword").value;
  if(!email || !pass){ setMsg("E‑posta ve şifre gerekli."); return; }
  try{
    await auth.signInWithEmailAndPassword(email, pass);
    setMsg("Giriş başarılı, yönlendiriliyor…", true);
    location.href = "./dashboard.html";
  }catch(e){ setMsg(e.message); }
};

// forgot
$("btnForgot").onclick = async ()=>{
  clearMsg();
  const email = $("loginEmail").value.trim();
  if(!email){ setMsg("Lütfen e‑posta yaz."); return; }
  try{
    await auth.sendPasswordResetEmail(email);
    setMsg("Sıfırlama maili gönderildi (Gelen/Spam).", true);
  }catch(e){ setMsg(e.message); }
};

// signup
$("btnSignup").onclick = async ()=>{
  clearMsg();
  const name = $("signupName").value.trim();
  const email= $("signupEmail").value.trim();
  const p1   = $("signupPassword").value;
  const p2   = $("signupPassword2").value;
  if(!name){ setMsg("Ad Soyad gerekli."); return; }
  if(!email){ setMsg("E‑posta gerekli."); return; }
  if((p1||"").length < 6){ setMsg("Şifre en az 6 karakter."); return; }
  if(p1 !== p2){ setMsg("Şifreler aynı değil."); return; }
  try{
    const cred = await auth.createUserWithEmailAndPassword(email, p1);
    await cred.user.updateProfile({ displayName: name });
    setMsg("Kayıt tamam. Giriş yapılıyor…", true);
    location.href = "./dashboard.html";
  }catch(e){ setMsg(e.message); }
};

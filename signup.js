
console.log("SIGNUP BOOT");

firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();

const qs = (s)=>document.querySelector(s);
const show = (id)=>qs(id).classList.remove("hide");
const hide = (id)=>qs(id).classList.add("hide");

qs("#tabLogin").onclick = ()=>{ hide("#signupView"); show("#loginView"); qs("#tabLogin").classList.remove("ghost"); qs("#tabSignup").classList.add("ghost"); };
qs("#tabSignup").onclick= ()=>{ hide("#loginView"); show("#signupView"); qs("#tabSignup").classList.remove("ghost"); qs("#tabLogin").classList.add("ghost"); };

function setMsg(el, t, ok=false){ const m=qs(el); m.textContent=t; m.className="msg " + (ok?"ok":"err"); }
function clearMsg(){ ["#msgLogin","#msgSignup"].forEach(id=>{const m=qs(id); m.textContent=""; m.className="msg"; }); }

window.addEventListener("keydown",(e)=>{
  if(e.key==="Enter"){
    const onSignup = !qs("#signupView").classList.contains("hide");
    (onSignup?qs("#btnSignup"):qs("#btnLogin")).click();
  }
}, true);

qs("#btnLogin").onclick = async ()=>{
  clearMsg();
  const email = qs("#loginEmail").value.trim();
  const pass  = qs("#loginPassword").value;
  if(!email || !pass){ setMsg("#msgLogin","E‑posta ve şifre gerekli."); return; }
  try{
    await auth.signInWithEmailAndPassword(email, pass);
    location.href = "./dashboard.html";
  }catch(e){ setMsg("#msgLogin", e.message); }
};

qs("#btnForgot").onclick = async ()=>{
  clearMsg();
  const email = qs("#loginEmail").value.trim();
  if(!email){ setMsg("#msgLogin","Önce e‑posta yaz."); return; }
  try{
    await auth.sendPasswordResetEmail(email);
    setMsg("#msgLogin","Sıfırlama maili gönderildi (Gelen/Spam).", true);
  }catch(e){ setMsg("#msgLogin", e.message); }
};

qs("#btnSignup").onclick = async ()=>{
  clearMsg();
  const name = qs("#signupName").value.trim();
  const email= qs("#signupEmail").value.trim();
  const p1   = qs("#signupPassword").value;
  const p2   = qs("#signupPassword2").value;
  if(!name){ setMsg("#msgSignup","Ad Soyad zorunlu."); return; }
  if(!email){ setMsg("#msgSignup","E‑posta zorunlu."); return; }
  if((p1||"").length<6){ setMsg("#msgSignup","Şifre en az 6 karakter."); return; }
  if(p1!==p2){ setMsg("#msgSignup","Şifreler aynı değil."); return; }
  try{
    const cred = await auth.createUserWithEmailAndPassword(email, p1);
    await cred.user.updateProfile({ displayName: name });
    setMsg("#msgSignup","Kayıt tamam. Şimdi giriş yapabilirsin.", true);
    hide("#signupView"); show("#loginView");
    qs("#loginEmail").value = email;
  }catch(e){ setMsg("#msgSignup", e.message); }
};

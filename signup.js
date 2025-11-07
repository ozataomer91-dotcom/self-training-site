
console.log("SIGNUP JS BOOT");
firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();
const $ = (id)=>document.getElementById(id);
const show=(id)=>$(id).classList.remove("hide");
const hide=(id)=>$(id).classList.add("hide");
const setMsg=(el,t,ok=false)=>{el.className="msg "+(ok?"ok":"err");el.textContent=t}

$("tabLogin").onclick  = ()=>{ hide("signupView"); show("loginView"); $("tabLogin").classList.add("active"); $("tabSignup").classList.remove("active"); };
$("tabSignup").onclick = ()=>{ hide("loginView"); show("signupView"); $("tabSignup").classList.add("active"); $("tabLogin").classList.remove("active"); };

$("btnLogin").onclick = async ()=>{
  const email = $("loginEmail").value.trim();
  const pass  = $("loginPassword").value;
  if(!email||!pass) return setMsg($("globalMsg"),"E‑posta ve şifre gerekli.");
  try{
    await auth.signInWithEmailAndPassword(email,pass);
    setMsg($("globalMsg"),"Giriş başarılı, yönlendiriliyor…",true);
    location.href="./dashboard.html";
  }catch(e){ setMsg($("globalMsg"),e.message); }
};

$("btnForgot").onclick = async ()=>{
  const email = $("loginEmail").value.trim();
  if(!email) return setMsg($("globalMsg"),"Önce e‑posta yaz.");
  try{ await auth.sendPasswordResetEmail(email); setMsg($("globalMsg"),"Sıfırlama maili gönderildi.",true); }
  catch(e){ setMsg($("globalMsg"),e.message); }
};

$("btnSignup").onclick = async ()=>{
  const name=$("signupName").value.trim(), email=$("signupEmail").value.trim();
  const p1=$("signupPassword").value, p2=$("signupPassword2").value;
  if(!name) return setMsg($("globalMsg2"),"Ad Soyad gerekli.");
  if(!email) return setMsg($("globalMsg2"),"E‑posta gerekli.");
  if((p1||'').length<6) return setMsg($("globalMsg2"),"Şifre en az 6 karakter.");
  if(p1!==p2) return setMsg($("globalMsg2"),"Şifreler aynı değil.");
  try{
    const cred = await auth.createUserWithEmailAndPassword(email,p1);
    await cred.user.updateProfile({displayName:name});
    setMsg($("globalMsg2"),"Kayıt tamam. Artık giriş yapabilirsin.",true);
    hide("signupView"); show("loginView"); $("loginEmail").value = email;
  }catch(e){ setMsg($("globalMsg2"),e.message); }
};

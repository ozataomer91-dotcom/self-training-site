const tabLogin=$("#tabLogin"), tabSignup=$("#tabSignup");
const loginView=$("#loginView"), signupView=$("#signupView");
const msg=$("#globalMsg");

function show(v){
  if(v==="login"){ tabLogin.classList.add("active"); tabSignup.classList.remove("active");
    loginView.classList.remove("hide"); signupView.classList.add("hide"); }
  else { tabSignup.classList.add("active"); tabLogin.classList.remove("active");
    signupView.classList.remove("hide"); loginView.classList.add("hide"); }
  msg.textContent="";
}
tabLogin.onclick=()=>show("login");
tabSignup.onclick=()=>show("signup");

if(!ST.isConfigReady(window.firebaseConfig)){
  msg.className="msg err";
  msg.textContent="config.js içindeki Firebase alanlarını doldur. (apiKey/authDomain/projectId/appId)";
  $("#btnLogin")?.setAttribute("disabled","true");
  $("#btnSignup")?.setAttribute("disabled","true");
}else{
  ST.ensureFirebase();
}

$("#btnLogin").onclick = async () => {
  const email = $("#loginEmail").value.trim();
  const pass  = $("#loginPassword").value;
  msg.className="msg"; msg.textContent="[login]...";

  try{
    await firebase.auth().signInWithEmailAndPassword(email, pass);
    msg.className="msg ok"; msg.textContent="Giriş başarılı, yönlendiriliyor...";
    location.href="dashboard.html";
  }catch(e){
    msg.className="msg err"; msg.textContent="Giriş başarısız: "+(e?.message||e);
  }
};

$("#btnSignup").onclick = async () => {
  const name=$("#signupName").value.trim();
  const email=$("#signupEmail").value.trim();
  const p1=$("#signupPassword").value, p2=$("#signupPassword2").value;
  msg.className="msg"; msg.textContent="[signup]...";

  if(!name){ msg.className="msg err"; msg.textContent="Ad Soyad boş olamaz."; return; }
  if(p1!==p2){ msg.className="msg err"; msg.textContent="Şifreler aynı olmalı."; return; }

  try{
    const {user}=await firebase.auth().createUserWithEmailAndPassword(email,p1);
    await user.updateProfile({displayName:name});
    msg.className="msg ok"; msg.textContent="Kayıt başarılı, yönlendiriliyor...";
    location.href="dashboard.html";
  }catch(e){
    msg.className="msg err"; msg.textContent="Kayıt başarısız: "+(e?.message||e);
  }
};

$("#btnForgot").onclick = async () => {
  const email = $("#loginEmail").value.trim();
  if(!email){ msg.className="msg err"; msg.textContent="E-posta gir."; return; }
  try{
    await firebase.auth().sendPasswordResetEmail(email);
    msg.className="msg ok"; msg.textContent="Sıfırlama maili gönderildi.";
  }catch(e){
    msg.className="msg err"; msg.textContent="Gönderilemedi: "+(e?.message||e);
  }
};

// /self-training-site/signup.js
console.log("[signup.js] yüklendi");

firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();

const $ = id => document.getElementById(id);
const setMsg = (t, ok=false) => {
  const m = $("globalMsg");
  if (!m) return;
  m.className = "msg " + (ok ? "ok" : "err");
  m.textContent = t;
};

window.addEventListener("DOMContentLoaded", () => {
  console.log("[signup] hazır");

  const btnLogin  = $("btnLogin");
  const btnForgot = $("btnForgot");
  const btnSignup = $("btnSignup");

  if (btnLogin)  btnLogin.onclick = async () => {
    console.log("[login] Click");
    try {
      const email = $("loginEmail").value.trim();
      const pass  = $("loginPassword").value;
      await auth.signInWithEmailAndPassword(email, pass);
      setMsg("Giriş başarılı. Yönlendiriliyor…", true);
      location.href = "./dashboard.html";
    } catch(e){ console.warn("[login] hata:", e.code, e.message); setMsg("İşlem başarısız: "+e.code); }
  };

  if (btnForgot) btnForgot.onclick = async () => {
    const email = $("loginEmail").value.trim();
    if (!email) return setMsg("E-posta yaz.");
    try { await auth.sendPasswordResetEmail(email); setMsg("Sıfırlama maili gönderildi.", true); }
    catch(e){ setMsg("İşlem başarısız: "+e.code); }
  };

  if (btnSignup) btnSignup.onclick = async () => {
    try {
      const name  = $("signupName").value.trim();
      const email = $("signupEmail").value.trim();
      const pass  = $("signupPassword").value;
      const pass2 = $("signupPassword2").value;
      if (!name) return setMsg("Ad Soyad gerekli.");
      if (!email) return setMsg("E-posta gerekli.");
      if ((pass||'').length < 6) return setMsg("Şifre en az 6 karakter.");
      if (pass !== pass2) return setMsg("Şifreler aynı değil.");
      const cred = await auth.createUserWithEmailAndPassword(email, pass);
      await cred.user.updateProfile({ displayName: name });
      setMsg("Kayıt tamam. Giriş yapabilirsiniz.", true);
    } catch(e){ setMsg("İşlem başarısız: "+e.code); }
  };
});

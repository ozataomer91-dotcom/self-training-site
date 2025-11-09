// self-training-site/signup.js
(function () {
  const $ = (sel) => document.querySelector(sel);
  const msg = $("#globalMsg");
  const show = (t, cls="") => { msg.className = "msg " + cls; msg.textContent = t; };

  // 1) Config kontrolü
  if (!window.ST_CONF || !ST_CONF.firebaseConfig || !ST_CONF.firebaseConfig.apiKey) {
    show("config.js içindeki Firebase alanlarını doldur. (apiKey/authDomain/projectId vb.)", "err");
    // Butonları pasif yap
    document.addEventListener("DOMContentLoaded", () => {
      ["btnLogin","btnSignup","btnForgot"].forEach(id=>{
        const el = document.getElementById(id); if (el) el.disabled = true;
      });
    });
    return;
  }

  // 2) Firebase init
  firebase.initializeApp(ST_CONF.firebaseConfig);
  const auth = firebase.auth();

  // 3) Tablar
  document.addEventListener("DOMContentLoaded", () => {
    const vLogin  = $("#loginView");
    const vSign   = $("#signupView");
    const tLogin  = $("#tabLogin");
    const tSign   = $("#tabSignup");

    const setTab = (tab) => {
      if (tab === "login") {
        vLogin.classList.remove("hide"); vSign.classList.add("hide");
        tLogin.classList.add("active");  tSign.classList.remove("active");
      } else {
        vSign.classList.remove("hide");  vLogin.classList.add("hide");
        tSign.classList.add("active");   tLogin.classList.remove("active");
      }
      show("");
    };
    tLogin.onclick = () => setTab("login");
    tSign.onclick  = () => setTab("signup");

    // 4) Giriş
    $("#btnLogin").onclick = async () => {
      const email = $("#loginEmail").value.trim();
      const pass  = $("#loginPassword").value;
      if (!email || !pass) return show("E-posta ve şifre zorunlu.", "err");
      try {
        await auth.signInWithEmailAndPassword(email, pass);
        show("Giriş başarılı, yönlendiriliyor…", "ok");
        location.href = ST_CONF.afterLoginUrl || "dashboard.html";
      } catch (e) {
        show(humanizeError(e), "err");
      }
    };

    // 5) Şifre sıfırla
    $("#btnForgot").onclick = async () => {
      const email = $("#loginEmail").value.trim();
      if (!email) return show("Önce e-posta gir.", "err");
      try {
        await auth.sendPasswordResetEmail(email);
        show("Sıfırlama e-postası gönderildi.", "ok");
      } catch (e) { show(humanizeError(e), "err"); }
    };

    // 6) Kayıt
    $("#btnSignup").onclick = async () => {
      const email = $("#signupEmail").value.trim();
      const p1    = $("#signupPassword").value;
      const p2    = $("#signupPassword2").value;
      if (!email || !p1) return show("E-posta ve şifre zorunlu.", "err");
      if (p1 !== p2)   return show("Şifreler uyuşmuyor.", "err");
      try {
        await auth.createUserWithEmailAndPassword(email, p1);
        show("Kayıt başarılı. Oturum açılıyor…", "ok");
        location.href = ST_CONF.afterLoginUrl || "dashboard.html";
      } catch (e) { show(humanizeError(e), "err"); }
    };
  });

  function humanizeError(e){
    const code = (e && e.code) || "";
    if (code.includes("invalid-email")) return "E-posta geçersiz.";
    if (code.includes("user-not-found")) return "Kullanıcı bulunamadı.";
    if (code.includes("wrong-password")) return "Şifre hatalı.";
    if (code.includes("email-already-in-use")) return "Bu e-posta zaten kayıtlı.";
    if (code.includes("network-request-failed")) return "Ağ hatası. İnternetini kontrol et.";
    return "İşlem başarısız: " + (e && e.message ? e.message : "bilinmeyen hata");
  }
})();

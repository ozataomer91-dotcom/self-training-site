// signup.js
console.log("[signup] yuklendi");
document.addEventListener("DOMContentLoaded", () => {
  const emailEl = document.getElementById("email");
  const passEl  = document.getElementById("password");
  const btn     = document.getElementById("btnLogin");
  const linkForgot = document.getElementById("lnkForgot");
  const tabLogin   = document.getElementById("tabLogin");
  const tabSignup  = document.getElementById("tabSignup");
  const warnEl = document.getElementById("warn");

  const needConfig = !window.auth || !firebase?.apps?.length;
  if (needConfig) warnEl.textContent = "config (yapilandirma.js) doldurulmamış. (apiKey/authDomain/projectId vb.)";

  btn?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!window.auth) return alert("Auth hazir degil. yapilandirma.js’i doldur.");
    const email = (emailEl?.value || "").trim();
    const pass  = passEl?.value || "";
    if (!email || !pass) return alert("E-posta ve şifre gir.");
    try {
      await auth.signInWithEmailAndPassword(email, pass);
      location.href = "dashboard.html";
    } catch (err) { alert("Giriş hatası: " + err.message); }
  });

  linkForgot?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!window.auth) return;
    const email = (emailEl?.value || "").trim();
    if (!email) return alert("E-posta gir.");
    try {
      await auth.sendPasswordResetEmail(email);
      alert("Sıfırlama e-postası gönderildi.");
    } catch (err) { alert("Hata: " + err.message); }
  });

  tabLogin?.addEventListener("click", () => (location.href = "signup.html"));
  tabSignup?.addEventListener("click", () => (location.href = "kayit.html"));
});

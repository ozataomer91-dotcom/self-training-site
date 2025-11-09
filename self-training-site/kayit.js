// kayit.js
console.log("[kayit] yuklendi");
document.addEventListener("DOMContentLoaded", () => {
  const emailEl = document.getElementById("email");
  const passEl  = document.getElementById("password");
  const btn     = document.getElementById("btnSignup");

  btn?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!window.auth) return alert("Auth hazir degil. yapilandirma.js’i doldur.");
    const email = (emailEl?.value || "").trim();
    const pass  = passEl?.value || "";
    if (!email || pass.length < 6) return alert("Geçerli e‑posta ve ≥6 karakter şifre gir.");
    try {
      await auth.createUserWithEmailAndPassword(email, pass);
      alert("Kayıt başarılı, şimdi giriş yapabilirsin.");
      location.href = "signup.html";
    } catch (err) { alert("Kayıt hatası: " + err.message); }
  });
});

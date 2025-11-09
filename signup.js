// signup.js
console.log("[signup] yüklendi");

const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const formLogin = document.getElementById("form-login");
const formRegister = document.getElementById("form-register");
const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");
const linkReset = document.getElementById("linkReset");
const say = (m) => alert(m);

// sekme görünümü
function showLogin() {
  formLogin.style.display = "block";
  formRegister.style.display = "none";
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
}
function showRegister() {
  formLogin.style.display = "none";
  formRegister.style.display = "block";
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
}
showLogin();

tabLogin?.addEventListener("click", showLogin);
tabRegister?.addEventListener("click", showRegister);

// GİRİŞ
btnLogin?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!window.auth) return say("Config yüklenemedi.");
  const email = document.getElementById("loginEmail").value.trim();
  const pass  = document.getElementById("loginPass").value;
  if (!email || !pass) return say("E-posta ve şifre gir.");
  try {
    await window.auth.signInWithEmailAndPassword(email, pass);
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err); say(err.message);
  }
});

// KAYIT
btnRegister?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!window.auth) return say("Config yüklenemedi.");
  const email = document.getElementById("regEmail").value.trim();
  const pass  = document.getElementById("regPass").value;
  if (!email || !pass) return say("E-posta ve şifre gir.");
  try {
    await window.auth.createUserWithEmailAndPassword(email, pass);
    say("Kayıt OK. Girişe dön.");
    showLogin();
  } catch (err) {
    console.error(err); say(err.message);
  }
});

// ŞİFRE SIFIRLAMA
linkReset?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!window.auth) return say("Config yüklenemedi.");
  const email = prompt("E-posta:");
  if (!email) return;
  try {
    await window.auth.sendPasswordResetEmail(email);
    say("Sıfırlama e-postası gönderildi.");
  } catch (err) {
    console.error(err); say(err.message);
  }
});

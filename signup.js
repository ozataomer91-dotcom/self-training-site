// Firebase v10 (modüler CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// === PROJE AYARLARIN (Firebase Console > Project settings > Web app) ===
const firebaseConfig = {
  apiKey: "AIzaSyAnMzCWonT_zL0EnChlIDYANBhDiiwmur4",
  authDomain: "self-training-128b5.firebaseapp.com",
  projectId: "self-training-128b5",
  storageBucket: "self-training-128b5.firebasestorage.app",
  messagingSenderId: "61732879565",
  appId: "1:61732879565:web:5a446fb76a88f1103bd084"
};
// =====================================================================

initializeApp(firebaseConfig);
const auth = getAuth();

// ---- UI elemanları
const tabLogin  = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const loginView  = document.getElementById("loginView");
const signupView = document.getElementById("signupView");
const msg = document.getElementById("msg");

// Tabs
function setTab(which) {
  const login = which === "login";
  tabLogin.classList.toggle("active", login);
  tabSignup.classList.toggle("active", !login);
  loginView.classList.toggle("hide", !login);
  signupView.classList.toggle("hide", login);
  msg.textContent = "";
  msg.className = "";
}
tabLogin.onclick  = () => setTab("login");
tabSignup.onclick = () => setTab("signup");

// ---- GİRİŞ
document.getElementById("btnLogin").onclick = async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const pass  = document.getElementById("loginPassword").value;
  msg.textContent = ""; msg.className = "";
  if (!email || !pass) return showErr("E-posta ve şifre gerekli.");

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, pass);
    if (!user.emailVerified) {
      showErr("E-posta doğrulanmamış. Lütfen maildeki linke tıkla veya 'tekrar gönder'e bas.");
      return;
    }
    // Başarılı giriş → dashboard
    window.location.href = "dashboard.html";
  } catch (e) {
    showErr(humanizeAuthError(e.code));
  }
};

// ---- KAYIT
document.getElementById("btnSignup").onclick = async () => {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const p1 = document.getElementById("signupPassword").value;
  const p2 = document.getElementById("signupPassword2").value;

  msg.textContent = ""; msg.className = "";
  if (!email || !p1) return showErr("E-posta ve şifre gerekli.");
  if (p1.length < 6)  return showErr("Şifre en az 6 karakter olmalı.");
  if (p1 !== p2)     return showErr("Şifreler eşleşmiyor.");

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, p1);
    if (name) { try { await updateProfile(user, { displayName: name }); } catch {} }
    await sendEmailVerification(user);
    showOk("Kayıt başarılı. Doğrulama e-postası gönderildi. Maildeki linke tıkladıktan sonra giriş yapabilirsin.");
    setTab("login");
  } catch (e) {
    showErr(humanizeAuthError(e.code));
  }
};

// ---- Şifre sıfırlama
document.getElementById("forgot").onclick = async () => {
  const email = document.getElementById("loginEmail").value.trim();
  if (!email) return showErr("Sıfırlama için e-posta yaz.");
  try { await sendPasswordResetEmail(auth, email); showOk("Sıfırlama e-postası gönderildi."); }
  catch (e) { showErr(humanizeAuthError(e.code)); }
};

// ---- Doğrulama mailini tekrar gönder
document.getElementById("resend").onclick = async () => {
  const email = document.getElementById("loginEmail").value.trim();
  const pass  = document.getElementById("loginPassword").value;
  if (!email || !pass) return showErr("Önce e-posta ve şifreyi yaz, sonra tekrar gönder.");
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, pass);
    await sendEmailVerification(user);
    showOk("Doğrulama e-postası tekrar gönderildi.");
  } catch (e) {
    showErr(humanizeAuthError(e.code));
  }
};

// ---- Oturum açık + doğrulanmışsa direkt dashboard'a
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    // zaten doğrulanmış kullanıcı → direkt dashboard
    window.location.href = "dashboard.html";
  }
});

// ---- yardımcılar
function showOk(t)  { msg.textContent = t; msg.className = "ok"; }
function showErr(t) { msg.textContent = t; msg.className = "err"; }

function humanizeAuthError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "E-posta/şifre hatalı.";
    case "auth/too-many-requests": return "Çok fazla deneme. Biraz sonra tekrar dene.";
    case "auth/email-already-in-use": return "Bu e-posta zaten kayıtlı.";
    case "auth/invalid-email": return "Geçersiz e-posta.";
    case "auth/weak-password": return "Zayıf şifre (en az 6 karakter).";
    default: return "İşlem başarısız: " + code;
  }
}

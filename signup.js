// Firebase importları
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Firebase ayarların
const firebaseConfig = {
  apiKey: "AIzaSyAnMzCWonT_zLi0EnChIDYANBhDiiwmur4",
  authDomain: "self-training-128b5.firebaseapp.com",
  projectId: "self-training-128b5",
  storageBucket: "self-training-128b5.firebasestorage.app",
  messagingSenderId: "61732879565",
  appId: "1:61732879565:web:5a446fb76fa88f1103bd84"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sayfa elemanlarını al
const loginView = document.getElementById("loginView");
const signupView = document.getElementById("signupView");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupMsg = document.getElementById("signupMsg");
const loginMsg = document.getElementById("loginMsg");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const forgotPass = document.getElementById("forgotPass");

// Görünüm geçişleri
showSignup.onclick = () => {
  loginView.style.display = "none";
  signupView.style.display = "block";
  loginMsg.textContent = "";
};
showLogin.onclick = () => {
  signupView.style.display = "none";
  loginView.style.display = "block";
  signupMsg.textContent = "";
};

// Kayıt ol
signupBtn.onclick = async () => {
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();

  if (!email || !password) {
    signupMsg.textContent = "E-posta ve şifre gerekli!";
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCred.user);
    signupMsg.style.color = "green";
    signupMsg.textContent = "Kayıt başarılı! Doğrulama e-postası gönderildi.";
  } catch (e) {
    signupMsg.textContent = e.message;
  }
};

// Giriş yap
loginBtn.onclick = async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    loginMsg.textContent = "E-posta ve şifre gerekli!";
    return;
  }

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    if (!user.emailVerified) {
      loginMsg.textContent = "Lütfen önce e-postanızı doğrulayın!";
      return;
    }

    loginMsg.style.color = "green";
    loginMsg.textContent = "Giriş başarılı!";
    window.location.href = "dashboard.html";
  } catch (e) {
    loginMsg.textContent = "E-posta veya şifre hatalı!";
  }
};

// Şifre sıfırlama
forgotPass.onclick = async () => {
  const email = prompt("Şifrenizi sıfırlamak için e-postanızı girin:");
  if (email) {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
    } catch (e) {
      alert("Hata: " + e.message);
    }
  }
};

// Giriş durumu kontrol
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    window.location.href = "dashboard.html";
  }
});

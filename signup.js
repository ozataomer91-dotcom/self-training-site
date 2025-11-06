// signup.js
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendEmailVerification,
  sendPasswordResetEmail, signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ---- UI helpers
const $ = (id) => document.getElementById(id);
const msg = $("msg");
const say = (t, ok=false) => {
  msg.textContent = t;
  msg.className = "alert " + (ok ? "ok" : "err");
  msg.classList.remove("hidden");
};
const clearMsg = () => { msg.className = "alert hidden"; msg.textContent = ""; };

const loginView = $("loginView");
const signupView = $("signupView");
const tabLogin = $("tabLogin");
const tabSignup = $("tabSignup");
const status = $("status");

// ---- Tabs
tabLogin.onclick = () => { clearMsg(); tabLogin.classList.add("active"); tabSignup.classList.remove("active"); loginView.classList.remove("hidden"); signupView.classList.add("hidden"); };
tabSignup.onclick = () => { clearMsg(); tabSignup.classList.add("active"); tabLogin.classList.remove("active"); signupView.classList.remove("hidden"); loginView.classList.add("hidden"); };

// ---- GİRİŞ
$("btnLogin").onclick = async () => {
  clearMsg();
  const email = $("loginEmail").value.trim();
  const pass  = $("loginPass").value;
  if (!email || !pass) return say("E-posta ve şifre gerekli.");

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, pass);
    if (!user.emailVerified) {
      say("E-posta doğrulanmamış. Gelen kutusu/Spam klasörünü kontrol edin, doğruladıktan sonra tekrar giriş yapın.");
      return;
    }
    window.location.href = "./dashboard.html";
  } catch (e) {
    if (e.code === "auth/invalid-api-key" || e.message?.includes("api-key-not-valid")) {
      say("Firebase API anahtarı geçersiz. firebase-config.js içindeki değerleri eksiksiz girin.");
    } else if (e.code === "auth/invalid-credential" || e.code === "auth/wrong-password") {
      say("E-posta/şifre hatalı.");
    } else if (e.code === "auth/user-not-found") {
      say("Bu e-posta ile kullanıcı bulunamadı.");
    } else {
      say("İşlem başarısız: " + (e.code || e.message));
    }
  }
};

// ---- ŞİFREMİ UNUTTUM
$("forgot").onclick = async () => {
  clearMsg();
  const email = $("loginEmail").value.trim();
  if (!email) return say("Lütfen e-posta girin.");
  try {
    await sendPasswordResetEmail(auth, email);
    say("Şifre sıfırlama bağlantısı gönderildi. Gelen kutusu ve Spam klasörüne bakın.", true);
  } catch (e) {
    say("Gönderilemedi: " + (e.code || e.message));
  }
};

// ---- KAYIT
$("btnSignup").onclick = async () => {
  clearMsg();
  const name  = $("fullName").value.trim();
  const email = $("suEmail").value.trim();
  const pass  = $("suPass").value;
  const pass2 = $("suPass2").value;

  if (!name)  return say("Ad Soyad zorunludur.");
  if (!email) return say("E-posta gerekli.");
  if (pass.length < 6) return say("Şifre en az 6 karakter olmalı.");
  if (pass !== pass2)  return say("Şifreler eşleşmiyor.");

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(user, { displayName: name });
    await sendEmailVerification(user);
    say("Kayıt tamam. E-posta doğrulaması gönderildi. Doğrulayıp giriş yapın.", true);
    tabLogin.click();
    $("loginEmail").value = email;
  } catch (e) {
    say("Kayıt başarısız: " + (e.code || e.message));
  }
};

// ---- Oturum dinleyicisi (durum etiketi)
onAuthStateChanged(auth, (user) => {
  status.textContent = user ? "Giriş yapıldı ✓" : "Hazır ✅";
});

// ---- ÇIKIŞ (dashboard'tan da çağrılacak)
window._logout = () => signOut(auth).catch(()=>{});

// signup.js — Tüm giriş/kayıt akışı burada
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendEmailVerification,
  sendPasswordResetEmail, updateProfile, signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase proje anahtarların (kendi konsolundakiler)
const firebaseConfig = {
  apiKey: "AIzaSyAnMzcWonT_zL0EhcNlDIYANBhDiivmur4",
  authDomain: "self-training-128b5.firebaseapp.com",
  projectId: "self-training-128b5",
  storageBucket: "self-training-128b5.appspot.com",
  messagingSenderId: "61732879565",
  appId: "1:61732879565:web:5a446fb76a88f1103bd84"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Kısa yardımcılar
const $ = (id) => document.getElementById(id);
const showMsg = (t, ok=false) => { const m=$("globalMsg"); if(!m) return; m.className="msg "+(ok?"ok":"err"); m.textContent=t; };
const clearMsg = () => { const m=$("globalMsg"); if(!m) return; m.className="msg"; m.textContent=""; };

// Hata çevirileri
function trAuthError(code){
  const map = {
    "auth/invalid-email":"Geçersiz e-posta.",
    "auth/missing-password":"Şifre gerekli.",
    "auth/wrong-password":"E-posta/şifre hatalı.",
    "auth/user-not-found":"Kullanıcı bulunamadı.",
    "auth/email-already-in-use":"Bu e-posta zaten kayıtlı.",
    "auth/weak-password":"Şifre çok zayıf.",
    "auth/network-request-failed":"Ağ hatası.",
    "auth/api-key-not-valid.please-pass-a-valid-api-key.":"API anahtarı geçersiz."
  };
  return map[code] || İşlem başarısız (${code}).;
}

// UI kurulum
function setupUI(){
  const tabLogin   = $("tabLogin");
  const tabSignup  = $("tabSignup");
  const loginView  = $("loginView");
  const signupView = $("signupView");

  if (!tabLogin || !tabSignup || !loginView || !signupView) {
    // HTML yapısı beklenenden farklıysa sessiz çık
    return;
  }

  tabLogin.onclick = () => {
    clearMsg();
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
    loginView.style.display = "block";
    signupView.style.display = "none";
  };

  tabSignup.onclick = () => {
    clearMsg();
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");
    signupView.style.display = "block";
    loginView.style.display = "none";
  };

  // Giriş
  const btnLogin = $("btnLogin");
  if (btnLogin) {
    btnLogin.onclick = async () => {
      clearMsg();
      const email = $("loginEmail")?.value?.trim();
      const pass  = $("loginPassword")?.value;
      if(!email || !pass){ showMsg("E-posta ve şifre gerekli."); return; }
      try{
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        if(!cred.user.emailVerified){
          showMsg("E-posta doğrulanmamış. Maildeki linke tıklayıp sonra tekrar giriş yap.");
          await signOut(auth);
          return;
        }
        showMsg("Giriş başarılı. Yönlendiriliyor…", true);
        window.location.href = "./dashboard.html";
      }catch(e){ showMsg(trAuthError(e.code)); }
    };
  }

  // Şifremi Unuttum
  const btnForgot = $("btnForgot");
  if (btnForgot) {
    btnForgot.onclick = async () => {
      clearMsg();
      const email = $("loginEmail")?.value?.trim();
      if(!email){ showMsg("Lütfen e-posta yaz."); return; }
      try{
        await sendPasswordResetEmail(auth, email);
        showMsg("Sıfırlama e-postası gönderildi. Gelen kutusu/Spam’ı kontrol et.", true);
      }catch(e){ showMsg(trAuthError(e.code)); }
    };
  }

  // Kayıt
  const btnSignup = $("btnSignup");
  if (btnSignup) {
    btnSignup.onclick = async () => {
      clearMsg();
      const name  = $("signupName")?.value?.trim();
      const email = $("signupEmail")?.value?.trim();
      const p1    = $("signupPassword")?.value;
      const p2    = $("signupPassword2")?.value;

      if(!name){ showMsg("Ad Soyad zorunlu."); return; }
      if(!email){ showMsg("E-posta zorunlu."); return; }
      if((p1||"").length < 6){ showMsg("Şifre en az 6 karakter olmalı."); return; }
      if(p1 !== p2){ showMsg("Şifreler aynı değil."); return; }

      try{
        const cred = await createUserWithEmailAndPassword(auth, email, p1);
        await updateProfile(cred.user, { displayName: name });
        await sendEmailVerification(cred.user);
        showMsg("Kayıt tamam. Doğrulama e-postası gönderildi. Onaylayıp giriş yap.", true);
        tabLogin.click();
        $("loginEmail").value = email;
      }catch(e){ showMsg(trAuthError(e.code)); }
    };
  }

  // (İsteğe bağlı) Oturum durumu
  onAuthStateChanged(auth, (u)=>{ /* console.log('auth', u?.email); */ });
}

document.addEventListener("DOMContentLoaded", setupUI);

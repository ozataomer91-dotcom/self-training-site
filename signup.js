// v9 modular CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth, setPersistence, browserLocalPersistence,
  createUserWithEmailAndPassword, updateProfile, sendEmailVerification,
  signInWithEmailAndPassword, sendPasswordResetEmail,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// *** KESİN KONFİG (projene göre) ***
const firebaseConfig = {
  apiKey: "AIzaSyAnMzCWonT_zL0EnChlIDYANBhDiiwmur4",
  authDomain: "self-training-128b5.firebaseapp.com",
  projectId: "self-training-128b5",
  storageBucket: "self-training-128b5.appspot.com",
  messagingSenderId: "61732879565",
  appId: "1:61732879565:web:5a446fb76a88f1103bd84",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
await setPersistence(auth, browserLocalPersistence);

// ------------- UI elems
const tabLogin  = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const loginView = document.getElementById("loginView");
const signupView= document.getElementById("signupView");

const loginEmail    = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginMsg      = document.getElementById("loginMsg");

const signupName      = document.getElementById("signupName");
const signupEmail     = document.getElementById("signupEmail");
const signupPassword  = document.getElementById("signupPassword");
const signupPassword2 = document.getElementById("signupPassword2");
const signupMsg       = document.getElementById("signupMsg");

const btnLogin   = document.getElementById("btnLogin");
const btnSignup  = document.getElementById("btnSignup");
const btnForgot  = document.getElementById("btnForgot");
const globalMsg  = document.getElementById("globalMsg");

// ------------- helpers
function showMsg(el, text, ok=false){
  el.classList.remove("err","ok");
  el.classList.add(ok ? "ok":"err");
  el.textContent = text;
}
function clearAll(){ loginMsg.textContent=""; signupMsg.textContent=""; globalMsg.textContent=""; }

// ------------- tabs
tabLogin.addEventListener("click", ()=>{
  tabLogin.classList.add("active"); tabSignup.classList.remove("active");
  loginView.classList.remove("hidden"); signupView.classList.add("hidden"); clearAll();
});
tabSignup.addEventListener("click", ()=>{
  tabSignup.classList.add("active"); tabLogin.classList.remove("active");
  signupView.classList.remove("hidden"); loginView.classList.add("hidden"); clearAll();
});

// ------------- Auth watcher: verified ise dashboard
onAuthStateChanged(auth, (user)=>{
  if (user && user.emailVerified) {
    window.location.href = "./dashboard.html";
  }
});

// ------------- Giriş
btnLogin.addEventListener("click", async ()=>{
  clearAll();
  const email = loginEmail.value.trim();
  const pass  = loginPassword.value;
  if(!email || !pass){ showMsg(loginMsg,"E-posta/şifre gerekli."); return; }
  try{
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if(!cred.user.emailVerified){
      await sendEmailVerification(cred.user);
      await signOut(auth);
      showMsg(loginMsg,"E-posta doğrulanmamış. Doğrulama maili tekrar gönderildi. Lütfen mailden onaylayın.", false);
      return;
    }
    // verified ise watcher yönlendirir
  }catch(err){
    const map = {
      "auth/invalid-email":"Geçersiz e-posta.",
      "auth/user-not-found":"Bu e-posta kayıtlı değil.",
      "auth/wrong-password":"Şifre hatalı.",
      "auth/invalid-credential":"E-posta/şifre hatalı.",
      "auth/too-many-requests":"Çok fazla deneme. Bir süre sonra tekrar deneyin."
    };
    showMsg(loginMsg, map[err.code] || ("İşlem başarısız: "+err.code));
  }
});

// ------------- Şifre sıfırla
btnForgot.addEventListener("click", async ()=>{
  clearAll();
  const email = loginEmail.value.trim();
  if(!email){ showMsg(loginMsg,"Önce e-posta yaz."); return; }
  try{
    await sendPasswordResetEmail(auth, email);
    showMsg(loginMsg,"Şifre sıfırlama linki e-postana gönderildi.", true);
  }catch(err){
    showMsg(loginMsg, "Gönderilemedi: "+err.code);
  }
});

// ------------- Kayıt
btnSignup.addEventListener("click", async ()=>{
  clearAll();
  const name = signupName.value.trim();
  const email= signupEmail.value.trim();
  const p1   = signupPassword.value;
  const p2   = signupPassword2.value;

  if(!email || !p1 || !p2){ showMsg(signupMsg,"Tüm alanları doldur."); return; }
  if(p1.length < 6){ showMsg(signupMsg,"Şifre en az 6 karakter olmalı."); return; }
  if(p1 !== p2){ showMsg(signupMsg,"Şifreler uyuşmuyor."); return; }

  try{
    const cred = await createUserWithEmailAndPassword(auth, email, p1);
    if(name){ await updateProfile(cred.user, { displayName:name }); }
    await sendEmailVerification(cred.user);
    await signOut(auth);
    showMsg(signupMsg,"Kayıt tamam. Doğrulama e-postası gönderildi. Lütfen maile gidip onaylayın, sonra giriş yapın.", true);
    // Giriş sekmesine geç
    tabLogin.click();
    loginEmail.value = email;
  }catch(err){
    const map = {
      "auth/email-already-in-use":"Bu e-posta zaten kayıtlı.",
      "auth/invalid-email":"Geçersiz e-posta.",
      "auth/weak-password":"Şifre zayıf (min 6 karakter)."
    };
    showMsg(signupMsg, map[err.code] || ("Kayıt başarısız: "+err.code));
  }
});

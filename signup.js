// signup.js  (type="module" ile yükleniyor)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, sendEmailVerification,
  sendPasswordResetEmail, updateProfile, signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// UI elm.
const tabLogin  = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const loginView  = document.getElementById("loginView");
const signupView = document.getElementById("signupView");
const msg = document.getElementById("globalMsg");

const showMsg = (t, ok=false)=>{ msg.className = "msg " + (ok?"ok":"err"); msg.textContent = t; };
const clearMsg = ()=>{ msg.className="msg"; msg.textContent=""; };

// Tablar
tabLogin.onclick = () => { clearMsg(); tabLogin.classList.add("active"); tabSignup.classList.remove("active"); loginView.style.display="block"; signupView.style.display="none"; };
tabSignup.onclick = () => { clearMsg(); tabSignup.classList.add("active"); tabLogin.classList.remove("active"); signupView.style.display="block"; loginView.style.display="none"; };

// Giriş
document.getElementById("btnLogin").onclick = async () => {
  clearMsg();
  const email = document.getElementById("loginEmail").value.trim();
  const pass  = document.getElementById("loginPassword").value;
  if(!email || !pass){ showMsg("E-posta ve şifre gerekli."); return; }
  try{
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if(!cred.user.emailVerified){
      showMsg("E-posta doğrulanmamış. Maildeki linke tıkla, sonra tekrar giriş yap.");
      await signOut(auth);
      return;
    }
    showMsg("Giriş başarılı. Yönlendiriliyor…", true);
    location.href = "./dashboard.html";
  }catch(e){
    showMsg(trAuthError(e.code));
  }
};

// Şifremi Unuttum
document.getElementById("btnForgot").onclick = async () => {
  clearMsg();
  const email = document.getElementById("loginEmail").value.trim();
  if(!email){ showMsg("Lütfen e-posta yaz."); return; }
  try{
    await sendPasswordResetEmail(auth, email);
    showMsg("Sıfırlama e-postası gönderildi. Gelen kutusu/Spam klasörünü kontrol et.", true);
  }catch(e){
    showMsg(trAuthError(e.code));
  }
};

// Kayıt
document.getElementById("btnSignup").onclick = async () => {
  clearMsg();
  const name = document.getElementById("signupName").value.trim();
  const email= document.getElementById("signupEmail").value.trim();
  const p1   = document.getElementById("signupPassword").value;
  const p2   = document.getElementById("signupPassword2").value;

  if(!name){ showMsg("Ad Soyad zorunlu."); return; }
  if(!email){ showMsg("E-posta zorunlu."); return; }
  if(p1.length < 6){ showMsg("Şifre en az 6 karakter olmalı."); return; }
  if(p1 !== p2){ showMsg("Şifreler aynı değil."); return; }

  try{
    const cred = await createUserWithEmailAndPassword(auth, email, p1);
    await updateProfile(cred.user, { displayName:name });
    await sendEmailVerification(cred.user);
    showMsg("Kayıt tamam. Doğrulama e-postası gönderildi. Maildeki linke tıkladıktan sonra giriş yap.", true);
    // formu login'e al
    tabLogin.click();
    document.getElementById("loginEmail").value = email;
  }catch(e){
    showMsg(trAuthError(e.code));
  }
};

// Oturum durumu (isteğe bağlı, burada sadece logluyoruz)
onAuthStateChanged(auth, (u)=>{ /* console.log('auth', u?.email); */ });

// Hata çevirileri (kısa)
function trAuthError(code){
  const map = {
    "auth/invalid-email":"Geçersiz e-posta.",
    "auth/missing-password":"Şifre gerekli.",
    "auth/wrong-password":"E-posta/şifre hatalı.",
    "auth/user-not-found":"Kullanıcı bulunamadı.",
    "auth/email-already-in-use":"Bu e-posta zaten kayıtlı.",
    "auth/weak-password":"Şifre çok zayıf.",
    "auth/network-request-failed":"Ağ hatası.",
  };
  return map[code] || İşlem başarısız (${code}).;
}

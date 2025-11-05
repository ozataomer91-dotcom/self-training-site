// signup.js — Giriş/Kayıt sekmeli, "yeniden gönder" sadece Kayıt'ta
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  setPersistence, browserLocalPersistence,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, updateProfile, signOut, sendPasswordResetEmail,
  GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const $=id=>document.getElementById(id);
const show=(t,cls="")=>{ const m=$("msg"); m.className="note "+cls; m.textContent=t; };
const lock=(on)=>["loginBtn","googleBtn","resetBtn","signupBtn","resendBtn"].forEach(id=>{const b=$(id); if(b) b.classList.toggle("hide", on)});

$("ready").textContent="Hazır ✅";

// Tabs
const tabLogin=$("tabLogin"), tabRegister=$("tabRegister");
const loginForm=$("loginForm"), registerForm=$("registerForm");
function showTab(which){
  const login=which==="login";
  tabLogin.classList.toggle("active", login);
  tabRegister.classList.toggle("active", !login);
  loginForm.classList.toggle("hide", !login);
  registerForm.classList.toggle("hide", login);
}
tabLogin.onclick=()=>showTab("login");
tabRegister.onclick=()=>showTab("register");

// Firebase
const firebaseConfig={
  apiKey:"AIzaSyAnMzCWonT_zLi0EnChIDYANBhDiiwmur4",
  authDomain:"self-training-128b5.firebaseapp.com",
  projectId:"self-training-128b5",
  storageBucket:"self-training-128b5.firebasestorage.app",
  messagingSenderId:"61732879565",
  appId:"1:61732879565:web:5a446fb76fa88f1103bd84"
};
(async function main(){
  const app=initializeApp(firebaseConfig);
  const auth=getAuth(app);
  await setPersistence(auth, browserLocalPersistence);
  const provider=new GoogleAuthProvider();

  const actionCodeSettings={
    url:"https://ozataomer91-dotcom.github.io/self-training-site/signup.html",
    handleCodeInApp:false
  };

  // Google redirect sonucu (gerekirse)
  try{
    const r=await getRedirectResult(auth);
    if(r && r.user){
      localStorage.setItem("user", JSON.stringify({uid:r.user.uid,name:r.user.displayName||"",email:r.user.email}));
      location.href="dashboard.html";
      return;
    }
  }catch{}

  // Giriş
  $("loginBtn").onclick=async ()=>{
    const email=$("loginEmail").value.trim();
    const pass=$("loginPass").value;
    if(!email||!pass){ show("E-posta ve şifre girin.","err"); return; }
    try{
      const cred=await signInWithEmailAndPassword(auth,email,pass);
      if(!cred.user.emailVerified){
        await signOut(auth);
        // Kayıt sekmesine taşı ve resend'i göster
        showTab("register");
        $("regEmail").value=email;
        $("resendRow").classList.remove("hide");
        show("E-posta doğrulanmamış. Kayıt sekmesindeki 'Doğrulama bağlantısını tekrar gönder' butonunu kullanın.","err");
        return;
      }
      localStorage.setItem("user", JSON.stringify({uid:cred.user.uid,name:cred.user.displayName||"",email}));
      location.href="dashboard.html";
    }catch(e){
      const map={"auth/invalid-credential":"E-posta/şifre hatalı.","auth/too-many-requests":"Çok deneme yapıldı. Bir süre sonra tekrar deneyin."};
      show(map[e.code]||("Hata: "+e.code),"err");
    }
  };

  // Şifre sıfırlama (Giriş sekmesi)
  $("resetBtn").onclick=async ()=>{
    const email=$("loginEmail").value.trim();
    if(!email){ show("Şifre sıfırlamak için giriş ekranındaki e-postayı yazın.","err"); return; }
    try{ await sendPasswordResetEmail(auth,email); show("Şifre sıfırlama e-postası gönderildi. Tüm Postalar/Spam/Promosyonlar’a bakın.","ok"); }
    catch(e){ show("Şifre sıfırlama hatası: "+e.code,"err"); }
  };

  // Google
  $("googleBtn").onclick=async ()=>{
    try{
      try{
        const cred=await signInWithPopup(auth,provider);
        localStorage.setItem("user", JSON.stringify({uid:cred.user.uid,name:cred.user.displayName||"",email:cred.user.email}));
        location.href="dashboard.html";
      }catch{ await signInWithRedirect(auth,provider); }
    }catch(e){ show("Google ile giriş iptal/hata: "+e.code,"err"); }
  };

  // Kayıt
  $("signupBtn").onclick=async ()=>{
    const name=$("regName").value.trim();
    const email=$("regEmail").value.trim();
    const pass=$("regPass").value;
    const pass2=$("regPass2").value;
    if(!name||!email||!pass||!pass2){ show("Lütfen tüm alanları doldurun.","err"); return; }
    if(pass!==pass2){ show("Şifreler eşleşmiyor.","err"); return; }
    if(pass.length<6){ show("Şifre en az 6 karakter olmalı.","err"); return; }
    try{
      const cred=await createUserWithEmailAndPassword(auth,email,pass);
      await updateProfile(cred.user,{displayName:name});
      await sendEmailVerification(cred.user,actionCodeSettings);
      await signOut(auth);
      $("resendRow").classList.remove("hide"); // Kayıt sekmesinde butonu göster
      show("✅ Kayıt tamam. Doğrulama e-postası gönderildi. Gelmezse aşağıdan tekrar gönderin.","ok");
    }catch(e){
      const map={"auth/email-already-in-use":"Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.","auth/invalid-email":"E-posta adresi geçersiz.","auth/weak-password":"Şifre zayıf (≥6)."};
      show(map[e.code]||("Hata: "+e.code),"err");
    }
  };

  // Doğrulama e-postasını yeniden gönder (sadece Kayıt sekmesi)
  $("resendBtn").onclick=async ()=>{
    const email=$("regEmail").value.trim();
    const pass=$("regPass").value;
    if(!email||!pass){ show("Kayıt sekmesindeki e-posta ve şifreyi girin.","err"); return; }
    try{
      const cred=await signInWithEmailAndPassword(auth,email,pass);
      await sendEmailVerification(cred.user,actionCodeSettings);
      await signOut(auth);
      show("Doğrulama e-postası tekrar gönderildi.","ok");
    }catch(e){
      const map={"auth/invalid-credential":"E-posta/şifre hatalı (kayıt sırasında verdiğiniz şifreyi girin)."};
      show(map[e.code]||("Hata: "+e.code),"err");
    }
  };
})();

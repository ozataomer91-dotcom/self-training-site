// signup.js — Final (E-posta + Google + Doğrulama Fix)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  setPersistence, browserLocalPersistence,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, updateProfile, signOut, sendPasswordResetEmail,
  GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const $  = id => document.getElementById(id);
const show = (t, cls="") => { const m=$("msg"); if(m){ m.className="note "+cls; m.textContent=t; } };
const lock = (on)=>["signupBtn","loginBtn","googleBtn","resetBtn"].forEach(id=>{ const b=$(id); if(b) b.classList.toggle("disabled",on); });

const ready = document.getElementById("ready");
if (ready) ready.textContent = "Hazır ✅";

const firebaseConfig = {
  apiKey: "AIzaSyAnMzCWonT_zLi0EnChIDYANBhDiiwmur4",
  authDomain: "self-training-128b5.firebaseapp.com",
  projectId: "self-training-128b5",
  storageBucket: "self-training-128b5.firebasestorage.app",
  messagingSenderId: "61732879565",
  appId: "1:61732879565:web:5a446fb76fa88f1103bd84"
};

(async function main(){
  try{
    const app  = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await setPersistence(auth, browserLocalPersistence);

    const provider = new GoogleAuthProvider();

    // 🔹 Bu URL artık Firebase’in kendi yönlendirme alanını kullanıyor (doğrulama hatası çözülür)
    const actionCodeSettings = {
      url: "https://self-training-128b5.firebaseapp.com/__/auth/action",
      handleCodeInApp: false
    };

    try {
      const r = await getRedirectResult(auth);
      if (r && r.user) {
        localStorage.setItem("user", JSON.stringify({ uid:r.user.uid, name:r.user.displayName||"", email:r.user.email }));
        location.href = "dashboard.html";
        return;
      }
    } catch {}

    // 🟢 Kayıt
    $("signupBtn").addEventListener("click", async () => {
      const name = $("name").value.trim();
      const email= $("email").value.trim();
      const pass = $("pass").value;
      const pass2= $("pass2").value;

      if(!name || !email || !pass || !pass2){ show("Lütfen tüm alanları doldurun.","err"); return; }
      if(pass !== pass2){ show("Şifreler eşleşmiyor.","err"); return; }
      if(pass.length < 6){ show("Şifre en az 6 karakter olmalı.","err"); return; }

      lock(true);
      try{
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(cred.user, { displayName: name });
        await sendEmailVerification(cred.user, actionCodeSettings);
        await signOut(auth);
        show("✅ Kayıt tamam. Doğrulama e-postası gönderildi. Maildeki linke tıklayıp sonra giriş yapın.","ok");
      }catch(err){
        const map = {
          "auth/email-already-in-use":"Bu e-posta zaten kayıtlı. 'Giriş Yap' veya 'Şifremi Unuttum' deneyin.",
          "auth/invalid-email":"E-posta adresi geçersiz.",
          "auth/weak-password":"Şifre zayıf (en az 6 karakter)."
        };
        show(map[err.code] || ("Hata: "+err.code), "err");
      } finally { lock(false); }
    });

    // 🔵 Giriş
    $("loginBtn").addEventListener("click", async () => {
      const email= $("email").value.trim();
      const pass = $("pass").value;
      if(!email || !pass){ show("E-posta ve şifre girin.","err"); return; }

      lock(true);
      try{
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        if(!cred.user.emailVerified){
          await sendEmailVerification(cred.user, actionCodeSettings);
          await signOut(auth);
          show("E-posta doğrulanmadı. Gelen kutusundaki linke tıklayın ve tekrar giriş yapın.","err");
          return;
        }
        localStorage.setItem("user", JSON.stringify({ uid:cred.user.uid, name:cred.user.displayName||"", email }));
        location.href = "dashboard.html";
      }catch(err){
        const map = {
          "auth/invalid-credential":"E-posta/şifre hatalı.",
          "auth/too-many-requests":"Çok deneme yapıldı. Bir süre sonra tekrar deneyin."
        };
        show(map[err.code] || ("Hata: "+err.code), "err");
      } finally { lock(false); }
    });

    // 🟡 Google
    $("googleBtn").addEventListener("click", async () => {
      lock(true);
      try{
        try {
          const cred = await signInWithPopup(auth, provider);
          localStorage.setItem("user", JSON.stringify({ uid:cred.user.uid, name:cred.user.displayName||"", email:cred.user.email }));
          location.href = "dashboard.html";
        } catch {
          await signInWithRedirect(auth, provider);
        }
      }catch(err){
        show("Google ile giriş iptal edildi veya hata: " + err.code, "err");
      } finally { lock(false); }
    });

    // 📨 Şifre sıfırlama
    $("resetBtn").addEventListener("click", async () => {
      const email= $("email").value.trim();
      if(!email){ show("Şifre sıfırlamak için e-posta yazın.","err"); return; }
      lock(true);
      try{
        await sendPasswordResetEmail(auth, email);
        show("Şifre sıfırlama e-postası gönderildi. Gelen kutusunu kontrol edin.","ok");
      }catch(err){
        show("Şifre sıfırlama hatası: " + err.code, "err");
      } finally { lock(false); }
    });

  } catch(e){
    show("Başlatma hatası: " + (e?.message || e), "err");
    console.error(e);
  }
})();

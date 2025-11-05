// signup.js — sade & sağlam
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth, setPersistence, browserLocalPersistence,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, updateProfile, signOut, sendPasswordResetEmail,
  GoogleAuthProvider, signInWithRedirect, getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const $  = id => document.getElementById(id);
const show = (t, cls="") => { const m=$("msg"); if(m){ m.className="note "+cls; m.textContent=t; } };
const lock = (on)=>["signupBtn","loginBtn","googleBtn","resetBtn"].forEach(id=>{ const b=$(id); if(b) b.classList.toggle("disabled",on); });

// Ekran yüklendi mesajı
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
    console.log("[signup] init start");
    const app  = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await setPersistence(auth, browserLocalPersistence);
    const provider = new GoogleAuthProvider();

    // Google redirect dönüşü
    try {
      const r = await getRedirectResult(auth);
      if (r && r.user) {
        console.log("[signup] google redirect OK");
        localStorage.setItem("user", JSON.stringify({ uid:r.user.uid, name:r.user.displayName||"", email:r.user.email }));
        location.href = "dashboard.html";
        return;
      }
    } catch(e){ console.error("[signup] redirect err", e); }

    // --- Kayıt ---
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
        // Basit: özel URL vermiyoruz → Firebase kendi doğrulama sayfasını kullanır
        await sendEmailVerification(cred.user);
        await signOut(auth);
        show("✅ Kayıt tamam. E-posta doğrulaması gönderildi. Maildeki linke tıklayıp sonra giriş yapın.","ok");
      }catch(err){
        console.error("[signup] signUp err", err);
        const map = {
          "auth/email-already-in-use":"Bu e-posta zaten kayıtlı. 'Giriş Yap' veya 'Şifremi Unuttum' deneyin.",
          "auth/invalid-email":"E-posta adresi geçersiz.",
          "auth/weak-password":"Şifre zayıf (en az 6 karakter)."
        };
        show(map[err.code] || ("Hata: "+err.code), "err");
      } finally { lock(false); }
    });

    // --- Giriş ---
    $("loginBtn").addEventListener("click", async () => {
      const email= $("email").value.trim();
      const pass = $("pass").value;
      if(!email || !pass){ show("E-posta ve şifre girin.","err"); return; }

      lock(true);
      try{
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        if(!cred.user.emailVerified){
          await sendEmailVerification(cred.user);
          await signOut(auth);
          show("E-posta doğrulanmadı. Maildeki linke tıklayın ve tekrar giriş yapın.","err");
          return;
        }
        localStorage.setItem("user", JSON.stringify({ uid:cred.user.uid, name:cred.user.displayName||"", email }));
        location.href = "dashboard.html";
      }catch(err){
        console.error("[signup] login err", err);
        const map = {
          "auth/invalid-credential":"E-posta/şifre hatalı.",
          "auth/too-many-requests":"Çok deneme yapıldı. Bir süre sonra tekrar deneyin."
        };
        show(map[err.code] || ("Hata: "+err.code), "err");
      } finally { lock(false); }
    });

    // --- Google (redirect) ---
    $("googleBtn").addEventListener("click", async () => {
      lock(true);
      try{
        console.log("[signup] google redirect start");
        await signInWithRedirect(auth, provider); // popup yerine direkt redirect — GitHub Pages için daha stabil
      }catch(err){
        console.error("[signup] google err", err);
        show("Google ile giriş hatası: " + err.code, "err");
        lock(false);
      }
    });

    // --- Şifre sıfırla ---
    $("resetBtn").addEventListener("click", async () => {
      const email= $("email").value.trim();
      if(!email){ show("Şifre sıfırlamak için e-posta yazın.","err"); return; }
      lock(true);
      try{
        await sendPasswordResetEmail(auth, email);
        show("Şifre sıfırlama e-postası gönderildi. Spam klasörünü de kontrol et.","ok");
      }catch(err){
        console.error("[signup] reset err", err);
        show("Şifre sıfırlama hatası: " + err.code, "err");
      } finally { lock(false); }
    });

    console.log("[signup] init done");
  } catch(e){
    console.error("[signup] init fail", e);
    show("Başlatma hatası: " + (e?.message || e), "err");
  }
})();

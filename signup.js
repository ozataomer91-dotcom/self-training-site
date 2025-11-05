// signup.js — E-posta/Şifre + Google + Firestore profil kaydı
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth, setPersistence, browserLocalPersistence,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, updateProfile, signOut, sendPasswordResetEmail,
  GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const $ = id => document.getElementById(id);
const show = (t, cls="") => { const m=$("msg"); if(m){ m.className="note "+cls; m.textContent=t; } };
const lock = (on)=>["signupBtn","loginBtn","googleBtn","resetBtn"].forEach(id=>{ const b=$(id); if(b) b.classList.toggle("disabled",on); });

// Sekme (Giriş / Kayıt) kontrolü
const setMode = (mode) => {
  const isSignup = mode === "signup";
  $("tabLogin").classList.toggle("active", !isSignup);
  $("tabSignup").classList.toggle("active", isSignup);
  $("nameBox").style.display  = isSignup ? "" : "none";
  $("pass2Box").style.display = isSignup ? "" : "none";
  $("signupBtn").style.display = isSignup ? "" : "none";
  $("loginBtn").style.display  = isSignup ? "none" : "";
  $("formNote").textContent = isSignup
    ? "Kayıtta ad soyad, e-posta ve şifre gerekir. Doğrulama e-postası gönderilir."
    : "Girişte yalnızca e-posta ve şifre gerekir.";
};
$("tabLogin").onclick  = () => setMode("login");
$("tabSignup").onclick = () => setMode("signup");

const ready = document.getElementById("ready");
if (ready) ready.textContent = "Hazır ✅";

// --- Firebase config ---
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
    const db   = getFirestore(app);
    await setPersistence(auth, browserLocalPersistence);

    const provider = new GoogleAuthProvider();

    const actionCodeSettings = {
      // Doğrulama e-postalarındaki dönüş adresi (değiştirmeyelim)
      url: "https://ozataomer91-dotcom.github.io/self-training-site/signup.html",
      handleCodeInApp: false
    };

    // Google redirect sonucu (Safari vb. popup engellerse)
    try {
      const r = await getRedirectResult(auth);
      if (r && r.user) {
        const u = r.user;
        await setDoc(doc(db,"users",u.uid), {
          name: u.displayName || "",
          email: u.email || "",
          provider: "google",
          emailVerified: !!u.emailVerified,
          updatedAt: serverTimestamp()
        }, { merge:true });
        localStorage.setItem("user", JSON.stringify({ uid:u.uid, name:u.displayName||"", email:u.email||"" }));
        location.href = "dashboard.html";
        return;
      }
    } catch { /* yoksa sessiz */ }

    // ---------- Kayıt ----------
    $("signupBtn").addEventListener("click", async () => {
      const name  = ($("name").value || "").trim();
      const email = ($("email").value||"").trim();
      const pass  = $("pass").value;
      const pass2 = $("pass2").value;

      if(!name || !email || !pass || !pass2){ show("Lütfen tüm alanları doldurun.","err"); return; }
      if(pass !== pass2){ show("Şifreler eşleşmiyor.","err"); return; }
      if(pass.length < 6){ show("Şifre en az 6 karakter olmalı.","err"); return; }

      lock(true);
      try{
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(cred.user, { displayName: name });

        // Firestore profil dokümanı
        await setDoc(doc(db, "users", cred.user.uid), {
          name, email,
          provider: "password",
          emailVerified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge:true });

        await sendEmailVerification(cred.user, actionCodeSettings);
        await signOut(auth); // doğrulama yapılmadan giriş yok
        show("✅ Kayıt tamam. Doğrulama e-postası gönderildi. Maildeki linke tıklayıp sonra giriş yapın.","ok");
        setMode("login");
      }catch(err){
        const map = {
          "auth/email-already-in-use":"Bu e-posta zaten kayıtlı. 'Giriş Yap' veya 'Şifremi Unuttum' deneyin.",
          "auth/invalid-email":"E-posta adresi geçersiz.",
          "auth/weak-password":"Şifre zayıf (en az 6 karakter)."
        };
        show(map[err.code] || ("Hata: "+err.code), "err");
      } finally { lock(false); }
    });

    // ---------- Giriş ----------
    $("loginBtn").addEventListener("click", async () => {
      const email = ($("email").value||"").trim();
      const pass  = $("pass").value;
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

        // Profil dokümanı yoksa oluştur
        const ref = doc(db,"users",cred.user.uid);
        const snap = await getDoc(ref);
        if(!snap.exists()){
          await setDoc(ref, {
            name: cred.user.displayName || "",
            email,
            provider: "password",
            emailVerified: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge:true });
        } else {
          await setDoc(ref, { emailVerified:true, updatedAt: serverTimestamp() }, { merge:true });
        }

        localStorage.setItem("user", JSON.stringify({ uid: cred.user.uid, name: cred.user.displayName || "", email }));
        location.href = "dashboard.html";
      }catch(err){
        const map = {
          "auth/invalid-credential":"E-posta/şifre hatalı.",
          "auth/too-many-requests":"Çok deneme yapıldı. Bir süre sonra tekrar deneyin."
        };
        show(map[err.code] || ("Hata: "+err.code), "err");
      } finally { lock(false); }
    });

    // ---------- Google ----------
    $("googleBtn").addEventListener("click", async () => {
      lock(true);
      try{
        try {
          const cred = await signInWithPopup(auth, provider);
          const u = cred.user;
          await setDoc(doc(db,"users",u.uid), {
            name: u.displayName || "",
            email: u.email || "",
            provider: "google",
            emailVerified: !!u.emailVerified,
            updatedAt: serverTimestamp()
          }, { merge:true });
          localStorage.setItem("user", JSON.stringify({ uid:u.uid, name:u.displayName||"", email:u.email||"" }));
          location.href = "dashboard.html";
        } catch {
          await signInWithRedirect(auth, provider);
        }
      }catch(err){
        show("Google ile giriş iptal edildi veya hata: " + err.code, "err");
      } finally { lock(false); }
    });

    // ---------- Şifre sıfırlama ----------
    $("resetBtn").addEventListener("click", async () => {
      const email = ($("email").value||"").trim();
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

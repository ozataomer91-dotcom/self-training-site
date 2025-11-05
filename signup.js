// signup.js — Giriş/Kayıt + Google; Doğrulama KAYIT tarafında; Firestore profil kaydı
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  setPersistence, browserLocalPersistence,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, updateProfile, signOut, sendPasswordResetEmail,
  GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getFirestore, doc, setDoc, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

/* ---------- küçük yardımcılar ---------- */
const $ = (id) => document.getElementById(id);
const show = (t, cls = "") => { const m = $("msg"); if (m){ m.className = "note " + cls; m.textContent = t; } };
const lock = (on) => ["signupBtn","loginBtn","googleBtn","resetBtn","resendBtn"].forEach(id=>{
  const b=$(id); if(b) b.classList.toggle("disabled",on);
});

/* ---------- sekmeler ---------- */
const tabLogin = $("tabLogin"), tabRegister = $("tabRegister");
const viewLogin = $("viewLogin"), viewRegister = $("viewRegister");
const noteLogin = $("tabNoteLogin"), noteReg = $("tabNoteReg");
function go(tab){ // "login" | "register"
  const isLogin = tab === "login";
  tabLogin.classList.toggle("active", isLogin);
  tabRegister.classList.toggle("active", !isLogin);
  viewLogin.classList.toggle("hide", !isLogin);
  viewRegister.classList.toggle("hide", isLogin);
  noteLogin.classList.toggle("hide", !isLogin);
  noteReg.classList.toggle("hide", isLogin);
  show("");
}
tabLogin.onclick = () => go("login");
tabRegister.onclick = () => go("register");

/* ---------- hazır ---------- */
$("ready").textContent = "Hazır ✅";

/* ---------- Firebase config ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyAnMzCWonT_zLi0EnChIDYANBhDiiwmur4",
  authDomain: "self-training-128b5.firebaseapp.com",
  projectId: "self-training-128b5",
  storageBucket: "self-training-128b5.appspot.com",
  messagingSenderId: "61732879565",
  appId: "1:61732879565:web:5a446fb76fa88f1103bd84",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

/* tarayıcıda oturum kalıcı olsun */
await setPersistence(auth, browserLocalPersistence);

/* e-posta doğrulama dönüş adresi */
const actionCodeSettings = {
  url: "https://ozataomer91-dotcom.github.io/self-training-site/signup.html",
  handleCodeInApp: false,
};

/* ---------- redirect sonucu (Google fallback) ---------- */
try {
  const r = await getRedirectResult(auth);
  if (r && r.user) {
    await setDoc(doc(db, "users", r.user.uid), {
      name: r.user.displayName || "",
      email: r.user.email || "",
      lastLogin: serverTimestamp(),
      provider: "google"
    }, { merge: true });
    location.href = "dashboard.html";
  }
} catch (e) {
  console.warn("redirectResult:", e?.code, e?.message);
}

/* ---------- Google ile giriş ---------- */
function googleErrorTr(err){
  const map = {
    "auth/unauthorized-domain": "Bu alan yetkili değil. Firebase > Authentication > Settings > Authorized domains kısmını kontrol et.",
    "auth/operation-not-allowed": "Google girişi kapalı. Sign-in method > Google: Enabled olmalı.",
    "auth/popup-blocked": "Tarayıcı açılır pencereyi engelledi. Tekrar dene; olmazsa yönlendirme yapılacak.",
    "auth/popup-closed-by-user": "Açılan Google penceresi kapatıldı.",
    "auth/cancelled-popup-request": "Çok hızlı peş peşe tıklandı. Tek kez tıklayın.",
    "auth/invalid-credential": "Google kimlik doğrulaması iptal/başarısız.",
    "auth/operation-not-supported-in-this-environment": "Uygulama içi tarayıcı desteklemiyor. Chrome/Safari ile aç.",
  };
  return map[err.code] || Hata: ${err.code};
}
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

$("googleBtn").addEventListener("click", async () => {
  lock(true);
  try {
    try {
      const cred = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", cred.user.uid), {
        name: cred.user.displayName || "",
        email: cred.user.email || "",
        lastLogin: serverTimestamp(),
        provider: "google"
      }, { merge: true });
      location.href = "dashboard.html";
      return;
    } catch (err) {
      if (["auth/popup-blocked","auth/popup-closed-by-user","auth/cancelled-popup-request"].includes(err.code)) {
        await signInWithRedirect(auth, provider);
        return;
      }
      throw err;
    }
  } catch (err) {
    show(googleErrorTr(err), "err");
    console.error("GOOGLE ERROR:", err.code, err.message);
  } finally {
    lock(false);
  }
});

/* ---------- Kayıt ---------- */
$("signupBtn").addEventListener("click", async () => {
  const name  = $("r_name").value.trim();
  const email = $("r_email").value.trim();
  const pass  = $("r_pass").value;
  const pass2 = $("r_pass2").value;

  if (!name || !email || !pass || !pass2) { show("Lütfen tüm alanları doldurun.", "err"); return; }
  if (pass !== pass2) { show("Şifreler eşleşmiyor.", "err"); return; }
  if (pass.length < 6) { show("Şifre en az 6 karakter olmalı.", "err"); return; }

  lock(true);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });

    // Firestore profil
    await setDoc(doc(db, "users", cred.user.uid), {
      name, email, createdAt: serverTimestamp(), provider: "password"
    }, { merge: true });

    await sendEmailVerification(cred.user, actionCodeSettings);
    await signOut(auth); // doğrulanmadan giriş yok
    show("✅ Kayıt tamam. Doğrulama e-postası gönderildi. Maildeki linke tıkla, sonra Giriş sekmesinden gir.", "ok");
    go("login");
  } catch (err) {
    const map = {
      "auth/email-already-in-use":"Bu e-posta zaten kayıtlı. 'Giriş' veya 'Şifremi Unuttum' deneyin.",
      "auth/invalid-email":"E-posta adresi geçersiz.",
      "auth/weak-password":"Şifre zayıf (en az 6 karakter)."
    };
    show(map[err.code] || ("Hata: " + err.code), "err");
  } finally { lock(false); }
});

/* ---------- Kayıt sekmesinde DOĞRULAMA LİNKİNİ YENİDEN GÖNDER ---------- */
/* Not: kullanıcı doğrulamamışsa, burada e-posta + ŞİFRE girilerek tekrar gönderilir. */
$("resendBtn").addEventListener("click", async () => {
  const email = $("r_email").value.trim();
  const pass  = $("r_pass").value;
  if (!email || !pass){ show("E-posta ve şifreni yaz, sonra 'Yeniden gönder' de.", "err"); return; }

  lock(true);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user.emailVerified) {
      show("E-posta zaten doğrulanmış. Giriş sekmesine geçebilirsin.", "ok");
    } else {
      await sendEmailVerification(cred.user, actionCodeSettings);
      show("Doğrulama e-postası tekrar gönderildi.", "ok");
    }
    await signOut(auth);
  } catch (err) {
    show("Yeniden gönderme hatası: " + err.code, "err");
  } finally { lock(false); }
});

/* ---------- Giriş ---------- */
$("loginBtn").addEventListener("click", async () => {
  const email = $("l_email").value.trim();
  const pass  = $("l_pass").value;
  if (!email || !pass){ show("E-posta ve şifre girin.", "err"); return; }

  lock(true);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (!cred.user.emailVerified) {
      await signOut(auth);
      show("E-posta doğrulanmadı. Kayıt sekmesine geçip 'Doğrulama linkini yeniden gönder' butonunu kullan.", "err");
      go("register");
      return;
    }
    await updateDoc(doc(db, "users", cred.user.uid), { lastLogin: serverTimestamp() });
    localStorage.setItem("user", JSON.stringify({ uid: cred.user.uid, name: cred.user.displayName || "", email }));
    location.href = "dashboard.html";
  } catch (err) {
    const map = {
      "auth/invalid-credential":"E-posta/şifre hatalı.",
      "auth/too-many-requests":"Çok deneme yapıldı. Bir süre sonra tekrar deneyin."
    };
    show(map[err.code] || ("Hata: " + err.code), "err");
  } finally { lock(false); }
});

/* ---------- Şifre sıfırlama ---------- */
$("resetBtn").addEventListener("click", async () => {
  const email = $("l_email").value.trim();
  if (!email){ show("Şifre sıfırlamak için giriş sekmesindeki e-postanı yaz.", "err"); return; }
  lock(true);
  try {
    await sendPasswordResetEmail(auth, email);
    show("Şifre sıfırlama e-postası gönderildi. Gelen kutunu kontrol et (Bazı sağlayıcılarda Spam’a düşebilir).", "ok");
  } catch (err) {
    show("Şifre sıfırlama hatası: " + err.code, "err");
  } finally { lock(false); }
});

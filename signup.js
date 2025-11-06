// signup.js — Google + E-posta/Şifre (TR, sağlam hata yakalama)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth, setPersistence, browserLocalPersistence,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, updateProfile, signOut, sendPasswordResetEmail,
  GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  applyActionCode
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const $ = id => document.getElementById(id);
const msg = (t, cls="") => { const m=$("msg"); if(m){ m.className="note "+cls; m.textContent=t; } };
const lock = on => ["signupBtn","loginBtn","googleBtn","resetBtn"].forEach(id=>{ const b=$(id); if(b) b.classList.toggle("disabled",on); });

const firebaseConfig = {
  apiKey: "AIzaSyAnMzCWonT_zLi0EnChIDYANBhDiiwmur4",
  authDomain: "self-training-128b5.firebaseapp.com",
  projectId: "self-training-128b5",
  storageBucket: "self-training-128b5.firebasestorage.app",
  messagingSenderId: "61732879565",
  appId: "1:61732879565:web:5a446fb76fa88f1103bd84"
};

(async () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  auth.languageCode = "tr";
  await setPersistence(auth, browserLocalPersistence);

  // Sekmeler: Giriş / Kayıt (sadece görünür alanları kullan)
  const tabLogin  = $("tabLogin");
  const tabSignup = $("tabSignup");
  const areaLogin = $("areaLogin");
  const areaSign  = $("areaSign");
  const showTab = (which) => {
    const login = which==="login";
    tabLogin.classList.toggle("active", login);
    tabSignup.classList.toggle("active", !login);
    areaLogin.style.display = login ? "block":"none";
    areaSign.style.display  = login ? "none":"block";
  };
  tabLogin?.addEventListener("click", ()=>showTab("login"));
  tabSignup?.addEventListener("click", ()=>showTab("signup"));
  showTab("login"); // varsayılan

  // Google Provider
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  // Redirect'ten dönen sonucu yakala (popup engellenirse)
  try {
    const r = await getRedirectResult(auth);
    if (r?.user) {
      localStorage.setItem("user", JSON.stringify({ uid:r.user.uid, name:r.user.displayName||"", email:r.user.email }));
      location.href = "dashboard.html";
      return;
    }
  } catch (e) {
    console.error("getRedirectResult:", e);
    msg("Google dönüş hatası: "+(e.code||e.message), "err");
  }

  // --- GİRİŞ ---
  $("loginBtn")?.addEventListener("click", async () => {
    const email = $("loginEmail").value.trim();
    const pass  = $("loginPass").value;
    if(!email || !pass){ msg("E-posta ve şifre girin.","err"); return; }
    lock(true);
    try{
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if(!cred.user.emailVerified){
        await sendEmailVerification(cred.user); // sadece kayıt kısmında da var ama burada tekrar göndermiyoruz
        await signOut(auth);
        msg("E-posta doğrulanmadı. Maildeki linke tıklayın.","err");
        return;
      }
      localStorage.setItem("user", JSON.stringify({ uid:cred.user.uid, name:cred.user.displayName||"", email }));
      location.href = "dashboard.html";
    }catch(e){
      console.error(e);
      const map = {
        "auth/invalid-credential":"E-posta/şifre hatalı.",
        "auth/user-disabled":"Hesap devre dışı.",
        "auth/user-not-found":"Kullanıcı bulunamadı.",
        "auth/wrong-password":"Şifre hatalı."
      };
      msg(map[e.code] || ("Hata: "+e.code), "err");
    } finally { lock(false); }
  });

  // --- KAYIT ---
  $("signupBtn")?.addEventListener("click", async () => {
    const name  = $("name").value.trim();
    const email = $("email").value.trim();
    const pass  = $("pass").value;
    const pass2 = $("pass2").value;
    if(!name || !email || !pass || !pass2){ msg("Lütfen tüm alanları doldurun.","err"); return; }
    if(pass !== pass2){ msg("Şifreler eşleşmiyor.","err"); return; }
    if(pass.length < 6){ msg("Şifre en az 6 karakter.","err"); return; }
    lock(true);
    try{
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      await sendEmailVerification(cred.user);
      await signOut(auth); // doğrulamadan giriş yok
      msg("✅ Kayıt tamam. Doğrulama e-postası gönderildi.", "ok");
      showTab("login");
    }catch(e){
      console.error(e);
      const map = {
        "auth/email-already-in-use":"Bu e-posta zaten kayıtlı.",
        "auth/invalid-email":"E-posta geçersiz.",
        "auth/weak-password":"Şifre zayıf."
      };
      msg(map[e.code] || ("Hata: "+e.code), "err");
    } finally { lock(false); }
  });

  // --- Google ile giriş ---
  $("googleBtn")?.addEventListener("click", async () => {
    lock(true);
    try{
      // Masaüstünde popup dene, hata olursa redirect’e düş
      try {
        const cred = await signInWithPopup(auth, provider);
        localStorage.setItem("user", JSON.stringify({ uid:cred.user.uid, name:cred.user.displayName||"", email:cred.user.email }));
        location.href = "dashboard.html";
      } catch (popupErr) {
        console.warn("Popup olmadı, redirect deneniyor:", popupErr.code);
        await signInWithRedirect(auth, provider);
      }
    }catch(e){
      console.error("Google error:", e);
      msg("Google ile giriş hatası: "+(e.code||e.message), "err");
    } finally { lock(false); }
  });

  // --- Şifre sıfırla ---
  $("resetBtn")?.addEventListener("click", async () => {
    const email = ($("loginEmail").value || $("email").value || "").trim();
    if(!email){ msg("Şifre sıfırlamak için e-posta yazın.","err"); return; }
    lock(true);
    try{
      await sendPasswordResetEmail(auth, email);
      msg("Şifre sıfırlama e-postası gönderildi.","ok");
    }catch(e){
      console.error(e);
      msg("Şifre sıfırlama hatası: "+(e.code||e.message), "err");
    } finally { lock(false); }
  });

  // --- E-posta linklerinden dönen işlemleri (oobCode) yakala (güvenli) ---
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");
  const oob  = params.get("oobCode");
  if (mode === "verifyEmail" && oob) {
    try {
      await applyActionCode(auth, oob);
      msg("E-posta doğrulandı. Giriş yapabilirsiniz.","ok");
      showTab("login");
      history.replaceState({}, "", location.pathname); // URL’i temizle
    } catch (e) {
      console.error(e);
    }
  }
})();

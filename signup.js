(function(){
  console.log("SIGNUP v23");
  function el(id){ return document.getElementById(id); }
  function show(id){ el(id).classList.remove("hide"); }
  function hide(id){ el(id).classList.add("hide"); }
  function msg(t, ok){ var m = el("globalMsg"); if(!m) return; m.className = "msg " + (ok ? "ok" : "err"); m.textContent = t || ""; }

  document.addEventListener("DOMContentLoaded", function(){
    // Config guard
    var cfg = window.firebaseConfig || {};
    if (!cfg.apiKey || cfg.apiKey === "REPLACE_ME"){
      msg("config.js içindeki Firebase alanlarını doldur. (apiKey/authDomain/projectId vb.)");
      ["btnLogin","btnSignup","btnForgot"].forEach(function(id){ var b=el(id); if(b){ b.disabled=true; b.style.opacity=0.6; }});
      return;
    }

    if (!firebase.apps.length){ firebase.initializeApp(cfg); }
    var auth = firebase.auth();

    el("tabLogin").onclick = function(){ msg(""); el("tabLogin").classList.add("active"); el("tabSignup").classList.remove("active"); show("loginView"); hide("signupView"); };
    el("tabSignup").onclick = function(){ msg(""); el("tabSignup").classList.add("active"); el("tabLogin").classList.remove("active"); show("signupView"); hide("loginView"); };

    el("btnLogin").onclick = async function(){
      msg("");
      var email = (el("loginEmail").value || "").trim();
      var pass  = el("loginPassword").value || "";
      if(!email || !pass){ msg("E-posta ve şifre gerekli."); return; }
      try{
        await auth.signInWithEmailAndPassword(email, pass);
        msg("Giriş başarılı. Yönlendiriliyor…", true);
        location.href = "/self-training-site/dashboard.html";
      }catch(e){ msg(parseErr(e.code)); }
    };

    el("btnForgot").onclick = async function(){
      msg("");
      var email = (el("loginEmail").value || "").trim();
      if(!email){ msg("Lütfen e-posta yaz."); return; }
      try{
        await auth.sendPasswordResetEmail(email);
        msg("Sıfırlama maili gönderildi (Gelen/Spam).", true);
      }catch(e){ msg(parseErr(e.code)); }
    };

    el("btnSignup").onclick = async function(){
      msg("");
      var name = (el("signupName").value || "").trim();
      var email= (el("signupEmail").value || "").trim();
      var p1   = el("signupPassword").value || "";
      var p2   = el("signupPassword2").value || "";
      if(!email){ msg("E-posta zorunlu."); return; }
      if(p1.length < 6){ msg("Şifre en az 6 karakter."); return; }
      if(p1 !== p2){ msg("Şifreler aynı değil."); return; }
      try{
        var cred = await auth.createUserWithEmailAndPassword(email, p1);
        if (name){ await cred.user.updateProfile({ displayName: name }); }
        await cred.user.sendEmailVerification({
          url: "https://ozataomer91-dotcom.github.io/self-training-site/dashboard.html?verified=1",
          handleCodeInApp: false
        });
        msg("Kayıt tamam. Doğrulama maili gönderildi. Onaylayıp giriş yap.", true);
        el("tabLogin").click();
        el("loginEmail").value = email;
      }catch(e){ msg(parseErr(e.code)); }
    };

    window.addEventListener("keydown", function(e){
      if(e.key === "Enter"){
        var onSignup = !el("signupView").classList.contains("hide");
        (onSignup ? el("btnSignup") : el("btnLogin")).click();
      }
    }, true);
  });

  function parseErr(c){
    var map = {
      "auth/invalid-email":"Geçersiz e-posta.",
      "auth/missing-password":"Şifre gerekli.",
      "auth/wrong-password":"E-posta/şifre hatalı.",
      "auth/user-not-found":"Kullanıcı bulunamadı.",
      "auth/email-already-in-use":"Bu e-posta zaten kayıtlı.",
      "auth/weak-password":"Şifre çok zayıf.",
      "auth/network-request-failed":"Ağ hatası.",
      "auth/too-many-requests":"Çok fazla deneme yaptın. Biraz bekle.",
      "auth/api-key-not-valid.please-pass-a-valid-api-key.":"API anahtarı geçersiz (config.js kontrol)."
    };
    return map[c] || ("İşlem başarısız (" + c + ").");
  }
})();
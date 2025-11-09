// Firebase config — BURAYI KENDİ PROJENLE DOLDUR
window.firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

(function(){
  const hint = document.getElementById('cfgHint');
  if(!hint) return;
  const bad = !window.firebaseConfig || !window.firebaseConfig.apiKey || /YOUR_API_KEY/i.test(window.firebaseConfig.apiKey);
  hint.textContent = bad ? "⚠️ config.js doldurulmadı (apiKey eksik). Giriş/Kayıt devre dışı." : "✔ Firebase ayarları yüklendi.";
})();
console.log("CONFIG OK");
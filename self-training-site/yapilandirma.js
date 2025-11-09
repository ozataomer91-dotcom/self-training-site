// yapilandirma.js
console.log("[cfg] basladi");

const firebaseConfig = {
  // ——— BURAYI kendi projenle değiştir ———
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!window.firebase || !firebase.initializeApp) {
  console.error("[cfg] Firebase compat yüklenmedi");
} else {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  window.auth = firebase.auth();
  console.log("[cfg] OK auth hazir");
}

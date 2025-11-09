// yapilandirma.js
console.log("[cfg] başlıyor");

const firebaseConfig = {
  apiKey: "AIzaSyAnMzCWonT_zLi0EnChIDYANBhDiiwmur4",
  authDomain: "self-training-128b5.firebaseapp.com",
  projectId: "self-training-128b5",
  storageBucket: "self-training-128b5.firebasestorage.app",
  messagingSenderId: "61732879565",
  appId: "1:61732879565:web:5a446fb76fa88f1103bd84"
};

if (!firebase || !firebase.initializeApp) {
  console.error("[cfg] Firebase compat yüklenmedi");
} else {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  window.auth = firebase.auth();
  console.log("[cfg] OK, auth hazır");
}

// config.js  (yalnızca bu dosyada, tek kere)
console.log("CONFIG OK self-training-128b5");

const firebaseConfig = {
  apiKey: "AIzaSyAmZcW0NT_zL10EChcIDYABNdD1iwmur4",
  authDomain: "self-training-128b5.firebaseapp.com",
  projectId: "self-training-128b5",
  storageBucket: "self-training-128b5.appspot.com",
  messagingSenderId: "61732879565",
  appId: "1:61732879565:web:5a4b6fb76fa06f11830d84"
};

// Diğer dosyalar buradan okusun diye global’e koyuyorum
window.SELF_TRAINING = { firebaseConfig };

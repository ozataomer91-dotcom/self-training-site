// Simple auth helpers using Firebase v9 compat CDN
// Assumes window.firebaseConfig is defined in config.js
(function(){
  if (!window.firebase || !window.firebase.initializeApp) {
    alert("Firebase SDK not loaded. Check script tags.");
    return;
  }
  if (!window.firebase.apps.length) {
    window.firebase.initializeApp(window.firebaseConfig);
  }
  const auth = window.firebase.auth();

  // expose helpers
  window.$auth = {
    instance: auth,
    // sign up
    async signup(email, password){
      await auth.createUserWithEmailAndPassword(email, password);
      return auth.currentUser;
    },
    // sign in
    async signin(email, password){
      await auth.signInWithEmailAndPassword(email, password);
      return auth.currentUser;
    },
    // sign out
    async signout(){
      await auth.signOut();
      return true;
    },
    onChanged(cb){
      return auth.onAuthStateChanged(cb);
    }
  };
})();

// Tek seferlik yardımcılar (global çakışmasın diye _q kullanıyoruz)
window._q = (sel,root=document)=>root.querySelector(sel);
window._qa = (sel,root=document)=>Array.from(root.querySelectorAll(sel));
window.setMsg = (text, cls='') => {
  const el = _q('#globalMsg'); if(!el) return;
  el.className = 'msg ' + cls; el.textContent = text || '';
};
// Güvenli Firebase başlatıcı
window.ensureFirebase = () => {
  try{
    if(!window.firebaseConfig || !window.firebaseConfig.apiKey) return { ok:false, reason:'MISSING_CONFIG' };
    if(!firebase.apps.length){ firebase.initializeApp(window.firebaseConfig); }
    return { ok:true };
  }catch(e){
    console.warn('[firebase] init error:', e);
    return { ok:false, reason:'INIT_ERROR' };
  }
};

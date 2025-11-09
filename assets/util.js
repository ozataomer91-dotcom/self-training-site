window.$=(s,c=document)=>c.querySelector(s);
window.$$=(s,c=document)=>[...c.querySelectorAll(s)];

function isConfigReady(cfg){
  if(!cfg) return false;
  const need=['apiKey','authDomain','projectId','appId'];
  return need.every(k=> typeof cfg[k]==='string' && cfg[k] && !cfg[k].startsWith('YOUR_'));
}
function ensureFirebase(){
  if(!isConfigReady(window.firebaseConfig)) return {ok:false};
  if(!(firebase.apps && firebase.apps.length)){ firebase.initializeApp(window.firebaseConfig); }
  return {ok:true};
}
window.ST={isConfigReady,ensureFirebase};

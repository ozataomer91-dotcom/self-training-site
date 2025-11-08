const $=(s,sc=document)=>sc.querySelector(s);const $$=(s,sc=document)=>Array.from(sc.querySelectorAll(s));const on=(el,ev,fn)=>el.addEventListener(ev,fn);
const store={set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),get:(k,d=null)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(_){return d}},del:(k)=>localStorage.removeItem(k)};
function toast(m,o=false){const d=document.createElement('div');d.textContent=m;d.style.cssText='position:fixed;right:16px;bottom:16px;background:'+(o?'#1f55ff':'#333')+';color:#fff;padding:10px 14px;border-radius:10px;z-index:9999';document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}
function signOutAndGo(){try{if(window.firebase?.auth)firebase.auth().signOut()}catch(e){}location.href='./index.html'}

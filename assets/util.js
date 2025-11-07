
export const $ = (sel, root=document)=>root.querySelector(sel);
export const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
export const toast = (msg)=>{
  let t = document.querySelector('.toast'); 
  if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t);}
  t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 1500);
};
export const save = (k,v)=>localStorage.setItem(k, JSON.stringify(v));
export const load = (k,def=null)=>{ try{ return JSON.parse(localStorage.getItem(k)) ?? def }catch{ return def }};
export const go = (p)=>location.href = p;

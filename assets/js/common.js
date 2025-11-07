
// Common helpers + Firebase guards
window.app = window.app || {};

app.q = (sel, el=document)=>el.querySelector(sel);
app.qAll = (sel, el=document)=>Array.from(el.querySelectorAll(sel));

app.toast = (msg, ok=false)=>{
  const el = app.q('.msg');
  if(!el) return;
  el.textContent = msg;
  el.className = 'msg ' + (ok ? 'ok' : 'err');
};

app.saveToLocal = (k,v)=>localStorage.setItem(k, JSON.stringify(v));
app.getFromLocal = (k, d=null)=>{
  try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch(_){ return d; }
};

// Firestore safe access
app.getDb = () => {
  try{
    return firebase && firebase.firestore ? firebase.firestore() : null;
  }catch(_){ return null; }
};

app.auth = ()=>{
  try{ return firebase && firebase.auth ? firebase.auth() : null; }catch(_){ return null; }
};

// Modal simple
app.modal = {
  back: null, body:null, img:null, title:null,
  ensure(){
    if(this.back) return;
    this.back = document.createElement('div');
    this.back.className = 'modal-back';
    this.back.innerHTML = `
      <div class="modal">
        <div class="head">
          <strong class="title">Bilgi</strong>
          <button class="close" aria-label="Kapat">✕</button>
        </div>
        <div class="body"></div>
      </div>`;
    document.body.appendChild(this.back);
    this.title = this.back.querySelector('.title');
    this.body = this.back.querySelector('.body');
    this.back.addEventListener('click', e=>{
      if(e.target === this.back) this.hide();
    });
    this.back.querySelector('.close').addEventListener('click', ()=>this.hide());
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') this.hide(); });
  },
  show({title, html}){
    this.ensure();
    this.title.textContent = title || 'Bilgi';
    this.body.innerHTML = html || '';
    this.back.style.display = 'flex';
  },
  hide(){ if(this.back) this.back.style.display = 'none'; }
};

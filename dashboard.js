// Dashboard (Hedef & Bilgi)
firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

const $ = (sel)=>document.querySelector(sel);
const el = (id)=>document.getElementById(id);
const msg = (t,ok=false)=>{ const m=el('msg'); m.className='msg '+(ok?'ok':'err'); m.textContent=t; }

const GOALS = [
  {id:'fatloss', label:'Yağ Yakımı / Kilo Verme'},
  {id:'muscle',  label:'Kas Kazanımı / Kuvvet'},
  {id:'endurance',label:'Dayanıklılık / Koşu'},
  {id:'mobility', label:'Esneklik / Mobilite'},
  {id:'home',     label:'Evde Ekipmansız'},
  {id:'posture',  label:'Duruş / Core'},
  {id:'sport',    label:'Branş Sporu (tenis/yüzme)'}
];
const LEVELS = ['Başlangıç','Orta','İleri'];
const INJ = ['Yok','Bel','Diz','Omuz','Boyun','Ayak bileği'];

const state = { goals:new Set(), level:'', inj: new Set(), injNote:'', hist:'' };
const MAX_GOALS = 3;

function chipNode(text, active=false){
  const b = document.createElement('button');
  b.type='button'; b.className='chip'+(active?' on':'');
  b.textContent=text;
  return b;
}

function render(){
  const goalWrap = el('goalChips');
  goalWrap.innerHTML='';
  GOALS.forEach(g=>{
    const b = chipNode(g.label, state.goals.has(g.id));
    b.onclick = ()=>{
      if(state.goals.has(g.id)){ state.goals.delete(g.id); b.classList.remove('on'); }
      else{
        if(state.goals.size>=MAX_GOALS){ msg('En fazla 3 hedef.'); return; }
        state.goals.add(g.id); b.classList.add('on');
      }
      msg('');
    };
    goalWrap.appendChild(b);
  });
  const lvlWrap = el('lvlChips'); lvlWrap.innerHTML='';
  LEVELS.forEach(L=>{
    const b = chipNode(L, state.level===L);
    b.onclick = ()=>{ state.level = (state.level===L ? '' : L); render(); };
    lvlWrap.appendChild(b);
  });
  const injWrap = el('injChips'); injWrap.innerHTML='';
  INJ.forEach(I=>{
    const b = chipNode(I, state.inj.has(I));
    b.onclick = ()=>{ state.inj.has(I)? state.inj.delete(I): state.inj.add(I); b.classList.toggle('on'); };
    injWrap.appendChild(b);
  });
}

function save(u){
  const doc = {
    goals: Array.from(state.goals),
    level: state.level,
    injuries: Array.from(state.inj),
    injNote: el('injNote').value.trim(),
    history: el('hist').value,
    ts: firebase.firestore.FieldValue.serverTimestamp()
  };
  localStorage.setItem('st_profile', JSON.stringify(doc));
  return db.collection('users').doc(u.uid).collection('profile').doc('v1').set(doc,{merge:true});
}

function load(u){
  el('who').textContent = u.displayName ? ('Giriş: '+u.displayName) : (u.email||'');
  db.collection('users').doc(u.uid).collection('profile').doc('v1').get().then(snap=>{
    if(snap.exists){
      const d = snap.data();
      state.level = d.level||'';
      state.goals = new Set(d.goals||[]);
      state.inj   = new Set(d.injuries||[]);
      el('injNote').value = d.injNote||'';
      el('hist').value = d.history||'';
      render();
    }else{ render(); }
  });
}

auth.onAuthStateChanged(u=>{
  if(!u){ location.href='./index.html'; return; }
  render(); load(u);
  el('btnLogout').onclick = ()=>auth.signOut();
  el('btnBack').onclick = ()=>history.back();
  el('btnNext').onclick = async ()=>{
    if(state.goals.size===0){ msg('En az 1 hedef seç.'); return; }
    try{
      await save(u); msg('Kaydedildi ✓', true);
      location.href='./metrics.html';
    }catch(e){ msg('Kaydedilemedi: '+e.message); }
  };
});

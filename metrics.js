// Metrics
firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

const $ = (id)=>document.getElementById(id);
const msg=(t,ok=false)=>{const m=$("msg"); m.className="msg "+(ok?'ok':'err'); m.textContent=t}

const MAP = {
  fatloss: [
    {id:'waist', label:'Bel çevresi (cm)', help:'Mezura ile göbek deliği hizasından ölç.' , why:'Yağ dağılımını ve metabolik riskleri takip eder.'},
    {id:'hip',   label:'Kalça çevresi (cm)', help:'Kalçanın en geniş yerinden ölç.', why:'Bel/kalça oranı ile yağ riski değerlendirilir.'},
    {id:'bmival',label:'BKİ (Boy/Kilo)', help:'Boy (cm) ve kilo (kg) girince sistem hesaplar.', why:'Genel kilo yönetimi için.'},
    {id:'walk1k',label:'1 km yürüyüş/koşu süresi (dk:ss)', help:'Düz zeminde kronometre ile süre tut.', why:'Aerobik kapasite göstergesi.'}
  ],
  muscle: [
    {id:'epley_w', label:'Submax ağırlık (kg)', help:'Bir seti başarabileceğin ağırlığı seç.', why:'1RM tahmininde kullanılır.'},
    {id:'epley_r', label:'Tekrar sayısı (reps)', help:'Ağırlık ile yaptığın tekrar sayısı.', why:'Epley formülü: 1RM = w*(1+reps/30).'},
    {id:'pushmax', label:'Maksimum şınav (adet)', help:'Tek sette tükenene kadar.', why:'Üst gövde dayanıklılığı.'},
    {id:'plank',   label:'Plank süresi (sn)', help:'Dirsek üzerinde gövde düz, süre tut.', why:'Core dayanıklılığı.'}
  ],
  endurance: [
    {id:'cooper', label:'12 dk Cooper mesafesi (m)', help:'Sahanın çevresinde 12 dk boyunca en iyi tempon.', why:'VO2max kestirimi için.'},
    {id:'run15',  label:'1.5 mil/2400m süre (dk:ss)', help:'Düz zeminde koş, süreyi yaz.', why:'Aerobik dayanıklılık.'},
    {id:'step3',  label:'3 dk basamak testi nabzı (bpm)', help:'30 cm basamak, bitişten 1 dk sonra nabız.', why:'Toparlanma hızı.'}
  ],
  mobility: [
    {id:'sitreach',label:'Sit & Reach (cm)', help:'Ayak tabanına değecek şekilde uzan, cm oku.', why:'Hamstring/alt sırt esnekliği.'}
  ],
  home: [
    {id:'burpee3', label:'3 dk burpee (adet)', help:'Süre içinde toplam tekrar sayısı.', why:'Ekipmansız genel kondisyon.'},
    {id:'wallsit', label:'Wall sit süresi (sn)', help:'Sırt duvarda, diz 90°.', why:'Alt ekstremite dayanıklılığı.'}
  ],
  posture: [
    {id:'plank2', label:'Plank süresi (sn)', help:'Dirsek üzerinde gövde düz, süre tut.', why:'Core stabilitesi.'},
    {id:'sidepl', label:'Side plank süresi (sn)', help:'Sağ veya sol, en iyi değer.', why:'Lateral core.'}
  ],
  sport: [
    {id:'s5', label:'5 m sprint (sn)', help:'Başlangıç çizgisinden 5 m.', why:'Hızlanma.'},
    {id:'s10', label:'10 m sprint (sn)', help:'10 m süre.', why:'Kısa sprint performansı.'}
  ]
};

function calcHR(){
  const age = +($("age").value||0);
  const rhr = +($("rhr").value||0);
  if(age>0){ $("hrmax").value = String(220 - age); }
  else{ $("hrmax").value=''; }
  const hrmax = +( $("hrmax").value || 0 );
  if(hrmax>0 && rhr>0){ $("hrr").value = String(hrmax - rhr); } else { $("hrr").value=''; }
}

// test card factory
function testCard(t){
  const d = document.createElement('div'); d.className='test-card';
  const h = document.createElement('h3'); h.textContent = t.label; d.appendChild(h);
  const meta = document.createElement('div'); meta.className='test-meta';
  const btn = document.createElement('button'); btn.type='button'; btn.className='btn ghost'; btn.textContent='Nasıl?';
  const info = document.createElement('div'); info.className='info hide'; info.innerHTML = '<div><strong>Nasıl yapılır?</strong><div class="small">'+t.help+'</div></div><div style="height:6px"></div><div><strong>Hedefle ilişkisi</strong><div class="small">'+t.why+'</div></div>';
  btn.onclick=()=>info.classList.toggle('hide');
  meta.appendChild(btn);
  d.appendChild(meta);
  const inp = document.createElement('input'); inp.placeholder='Değer giriniz'; inp.id='t_'+t.id;
  d.appendChild(inp);
  d.appendChild(info);
  return d;
}

function renderTests(goals){
  const wrap = $("tests"); wrap.innerHTML='';
  if(!goals || goals.length===0){ wrap.innerHTML='<div class="small">Önce hedef seçimi yapmalısın (Panel → Hedef & Bilgi).</div>'; return; }
  const used = new Set();
  goals.forEach(g=>{
    (MAP[g]||[]).forEach(t=>{
      if(!used.has(t.id)){ used.add(t.id); wrap.appendChild(testCard(t)); }
    });
  });
}

function save(u){
  const payload = {
    age: +($("age").value||0),
    rhr: +($("rhr").value||0),
    hrmax: +($("hrmax").value||0),
    hrr: +($("hrr").value||0),
    tests: {}
  };
  document.querySelectorAll('#tests input').forEach(i=>{
    payload.tests[i.id.replace('t_','')] = i.value;
  });
  localStorage.setItem('st_metrics', JSON.stringify(payload));
  return db.collection('users').doc(u.uid).collection('metrics').doc('v1').set(payload,{merge:true});
}

auth.onAuthStateChanged(async (u)=>{
  if(!u){ location.href='./index.html'; return; }
  $("btnLogout").onclick = ()=>auth.signOut();
  $("btnBack").onclick = ()=>history.back();
  $("goalLink").onclick = ()=>location.href='./dashboard.html';

  const profSnap = await db.collection('users').doc(u.uid).collection('profile').doc('v1').get();
  const goals = profSnap.exists ? (profSnap.data().goals||[]) : [];
  renderTests(goals);

  const mSnap = await db.collection('users').doc(u.uid).collection('metrics').doc('v1').get();
  if(mSnap.exists){
    const d=mSnap.data();
    $("age").value=d.age||''; $("rhr").value=d.rhr||'';
    calcHR();
    Object.entries(d.tests||{}).forEach(([k,v])=>{
      const node = document.getElementById('t_'+k); if(node) node.value = v;
    });
  }

  ["age","rhr"].forEach(id=>$(id).addEventListener('input', calcHR));

  $("btnSave").onclick = async ()=>{
    try{ await save(u); msg("Kaydedildi ✓", true); }
    catch(e){ msg("Kaydedilemedi: "+e.message); }
  };
});

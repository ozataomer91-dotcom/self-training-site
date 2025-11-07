
import { $, $$, toast, save, load, go } from './util.js';

// HRmax & HRR hesap
const ageEl = $("#age"), rhrEl=$("#rhr"), hrmaxEl=$("#hrmax"), hrrEl=$("#hrr");
const recalc = ()=>{
  const age = parseInt(ageEl.value||0,10);
  const rhr = parseInt(rhrEl.value||0,10);
  if(age>0){ const hrmax = 220 - age; hrmaxEl.value = hrmax; if(rhr>0) hrrEl.value = hrmax - rhr; }
};
ageEl.addEventListener('input', recalc); rhrEl.addEventListener('input', recalc);

// Hedef->Test eşlemesi
const GOAL_TESTS = {
  "Yağ yakımı": ["waist","hip","bodyweight","step3min","cooper12","hr"],
  "Kilo alma": ["bodyweight","waist","hip","pushupMax","plank","hr"],
  "Kas kazanımı": ["squat1rm","pushupMax","plank","bodyweight","hr"],
  "Kuvvet artışı": ["squat1rm","verticalJump","grip","plank","hr"],
  "Koşu performansı": ["oneMile","cooper12","proAgility","hr"],
  "Fonksiyonel antrenman": ["yBalance","tTest","sitReach","hr"],
  "Tenis": ["tTest","proAgility","yBalance","grip","hr"],
  "Yüzme": ["cooper12","step3min","hr"],
  "Evde ekipmansız": ["sitToStand","wallSit","pushupMax","sitReach","hr"],
  "Sağlıklı kalma": ["bodyweight","waist","hip","step3min","hr"],
  "Esneklik": ["sitReach","yBalance"],
  "Denge": ["yBalance","flamingo"],
  "Sürat": ["proAgility","tTest"],
  "Çeviklik": ["proAgility","tTest","yBalance"]
};

const TEST_DEFS = {
  hr: { title:"HRmax & HRR", fields:[], info:[
    "HRmax = 220 - yaş. HRR = HRmax - RHR (dinlenik nabız).",
    "Yoğunluk bölgeleri HRR ile belirlenir; kardiyo ve interval planlarında kullanılır."
  ]},
  waist:{ title:"Bel Çevresi (cm)", fields:[{id:"waist",ph:"örn. 84"}], info:[
    "Mezura ile göbek deliği hizasından, normal nefeste ölç.",
    "Yağ yakımı/sağlık hedeflerinde değişimi izlemek için kullanılır."
  ]},
  hip:{ title:"Kalça Çevresi (cm)", fields:[{id:"hip",ph:"örn. 98"}], info:[
    "Mezura ile kalçanın en geniş bölgesinden ölç.",
    "Bel/kalça oranı vücut kompozisyonunu izlemede yardımcıdır."
  ]},
  bodyweight:{ title:"Vücut Ağırlığı (kg)", fields:[{id:"bw",ph:"örn. 74.5"}], info:[
    "Sabah aç karnına, aynı koşullarda ölç.",
    "Kilo alma/verme ve kas kazanımında temel metriktir."
  ]},
  step3min:{ title:"3 dk Step Test Nabız (bpm)", fields:[{id:"stepbpm",ph:"Test sonrası 1.dk nabız"}], info:[
    "Platforma 3 dk 96 bpm tempo ile çık-çık-in-in; test bitince 1.dk nabzını say.",
    "Aerobik kondisyonu ve toparlanmayı gösterir."
  ]},
  cooper12:{ title:"Cooper 12 dk (m)", fields:[{id:"cooper",ph:"12 dakikada koşulan metre"}], info:[
    "Düz zeminde 12 dk boyunca maksimum mesafe koş.",
    "VO₂ maks tahmininde ve koşu performansında kullanılır."
  ]},
  pushupMax:{ title:"Şınav (maks, adet)", fields:[{id:"pushmax",ph:"örn. 28"}], info:[
    "Tam açılıp kapanarak tek sette maksimum tekrar.",
    "Üst vücut dayanıklılığı ve kas kazanımı için referans."
  ]},
  plank:{ title:"Plank (saniye)", fields:[{id:"plank",ph:"örn. 75"}], info:[
    "Kollar omuz altında, gövde düz; maksimum süre.",
    "Çekirdek stabilitesi kuvvet/yaralanma riskini etkiler."
  ]},
  squat1rm:{ title:"Back Squat tahmini 1RM (kg)", fields:[{id:"sq5rm",ph:"örn. 80 kg × 5 tekrar"}], info:[
    "Epley formülü: 1RM ≈ ağırlık×(1 + tekrar/30).",
    "Kuvvet/kas kazanım program dozajını belirler."
  ]},
  verticalJump:{ title:"Dikey Sıçrama (cm)", fields:[{id:"vj",ph:"örn. 45"}], info:[
    "Duvar işareti ya da mat ile ölç.",
    "Kuvvet ve patlayıcı güç göstergesi."
  ]},
  oneMile:{ title:"1 mil koşu (dk:s)", fields:[{id:"mile",ph:"örn. 7:45"}], info:[
    "1609 m tek parça koş. Süreyi yaz.",
    "Dayanıklılık ve tempo tahmini için kullanılır."
  ]},
  proAgility:{ title:"5‑10‑5 Pro Agility (sn)", fields:[{id:"agility",ph:"örn. 4.85"}], info:[
    "Orta koniden sağ‑sol‑orta sprint. Süreyi yaz.",
    "Çeviklik ve yön değiştirme performansı."
  ]},
  tTest:{ title:"T‑Test (sn)", fields:[{id:"ttest",ph:"örn. 11.2"}], info:[
    "T şeklinde koniler arası koşu; süreyi yaz.",
    "Ayak çalışması, çeviklik ve tenis gibi branşlar için uygundur."
  ]},
  yBalance:{ title:"Y‑Balance (cm)", fields:[{id:"ant",ph:"Anterior"},{id:"pm",ph:"Posteromedial"},{id:"pl",ph:"Posterolateral"}], info:[
    "Destek ayak sabit; üç yöne uzanarak mesafeleri ölç.",
    "Denge ve yaralanma riski taraması."
  ]},
  sitReach:{ title:"Sit & Reach (cm)", fields:[{id:"sr",ph:"örn. 30"}], info:[
    "Ayaklar tablada; öne uzan maksimum mesafe.",
    "Hamstring/alt sırt esnekliği."
  ]},
  flamingo:{ title:"Flamingo Denge (adet hata)", fields:[{id:"flam",ph:"örn. 7"}], info:[
    "Tek ayak üzerinde; 1 dk içindeki denge kaybı sayısı.",
    "Denge ve sakatlık riski."
  ]},
  sitToStand:{ title:"30 sn Otur‑Kalk (adet)", fields:[{id:"sts",ph:"örn. 20"}], info:[
    "Sandalyeden 30 sn’de toplam tekrar sayısı.",
    "Ev programlarında alt ekstremite dayanıklılığı."
  ]},
  wallSit:{ title:"Duvar Oturuşu (sn)", fields:[{id:"ws",ph:"örn. 55"}], info:[
    "Dizler 90°, sırt duvarda; maksimum süre.",
    "Kuvvet‑dayanıklılık göstergesi."
  ]},
  grip:{ title:"El Kavrama (kg)", fields:[{id:"grip",ph:"örn. 38"}], info:[
    "Dinamo metre varsa her elin en iyi değeri.",
    "Genel kuvvet ve tenis gibi sporlar için yararlı."
  ]}
};

const testsWrap = $("#tests");
const goals = load('goals', []);
if(!goals || goals.length===0){ toast("Önce hedef seç."); setTimeout(()=>go('./dashboard.html'),600); }

// Derle benzersiz testler
const uniq = new Set();
(goals||[]).forEach(g => (GOAL_TESTS[g]||[]).forEach(t=>uniq.add(t)));

const buildCard = (key,def)=>{
  const card = document.createElement('div');
  card.className = 'test-card';
  const title = document.createElement('div');
  title.style.display='flex'; title.style.justifyContent='space-between'; title.style.alignItems='center';
  title.innerHTML = `<strong>${def.title}</strong> <button class="info-toggle" data-k="${key}" type="button">Bilgi</button>`;
  card.appendChild(title);
  const fields = document.createElement('div');
  def.fields.forEach(f=>{
    const w = document.createElement('div'); w.className='field';
    const lab=document.createElement('label'); lab.textContent=f.ph||f.id; w.appendChild(lab);
    const inp=document.createElement('input'); inp.className='input'; inp.placeholder=f.ph||''; inp.dataset.key = f.id; w.appendChild(inp);
    fields.appendChild(w);
  });
  card.appendChild(fields);
  const info = document.createElement('div'); info.className='info';
  info.innerHTML = `<div><strong>Nasıl yapılır?</strong><p class="help">${def.info[0]||''}</p></div>
                    <div style="margin-top:8px"><strong>Hedefle ilişkisi</strong><p class="help">${def.info[1]||''}</p></div>`;
  card.appendChild(info);
  testsWrap.appendChild(card);
};
uniq.forEach(k=> buildCard(k, TEST_DEFS[k]));

// Bilgi aç/kapa (modal yok!)
testsWrap.addEventListener('click', (e)=>{
  const t = e.target.closest('.info-toggle');
  if(!t) return;
  const card = t.closest('.test-card');
  const info = $('.info', card);
  info.classList.toggle('show');
});

// Nav
$("#btnBack").onclick = ()=> go('./dashboard.html');
$("#btnNext").onclick = ()=>{ toast('Devam edeceğiz…'); };
$("#btnSave").onclick = ()=>{ toast('Kaydedildi ✔'); };
$("#btnLogout").onclick = ()=> go('./index.html');

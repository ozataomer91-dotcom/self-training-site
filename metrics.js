// init
firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();
let db = null;
try{ db = firebase.firestore(); }catch(_){ db = null; }

const $ = (s)=>document.querySelector(s);
const testsBox = $("#tests");

// HR hesaplama
function recalc(){
  const age = parseInt($("#age").value||"0",10);
  const rhr = parseInt($("#rhr").value||"0",10);
  if(age>0){
    const hrmax = 220 - age;
    $("#hrmax").textContent = hrmax;
    const hrr = (rhr>0) ? (hrmax - rhr) : "—";
    $("#hrr").textContent = hrr;
  }else{
    $("#hrmax").textContent = "—";
    $("#hrr").textContent = "—";
  }
}
document.addEventListener("input",(e)=>{
  if(e.target.id==="age" || e.target.id==="rhr"){ recalc(); }
});

// Rehber içerikleri
const HELP = {
  ybalance: {
    title: "Y-Balance Testi",
    aim: "Alt ekstremite denge ve olası sağ-sol asimetrileri taramak.",
    how: "Tek ayak üzerinde dur. Serbest ayakla öne, sağ-arka, sol-arka yönlere en uzağa uzan. 3 deneme, en iyi değer; cm ile not et.",
    rel: "Fonksiyonel hedefler, tenis ve çeviklik için başlangıç referansı ve sakatlık riski öngörüsü sağlar.",
    img: "assets/help/ybalance.png"
  },
  flamingo: {
    title: "Flamingo Denge Testi",
    aim: "Statik denge kapasitesini ölçmek.",
    how: "Bir ayak üzerinde, diğer dizi 90° bükülü; süreni başlat. Denge bozulduğunda durdur. 3 deneme, en iyi süre.",
    rel: "Çeviklik, koordinasyon ve core hedefleriyle ilişkilidir.",
    img: "assets/help/flamingo.png"
  },
  sprint5_10: {
    title: "5–10 m Sprint",
    aim: "İlk adım ivmelenmesi ve kısa mesafe sürati değerlendirmek.",
    how: "Düz hat belirle; 5 m ve 10 m işaretleri koy. Çizgileri geçerken süreyi kaydet.",
    rel: "Hız/kuvvet hedefleri ve tenis/koşu performans planlamasında yüklenmeyi ayarlamaya yardım eder.",
    img: "assets/help/sprint.png"
  },
  hrmax_hrr: {
    title: "HRmax & HRR",
    aim: "Antrenman bölgeleri için temel nabız değerlerini belirlemek.",
    how: "Yaş ve dinlenik nabzını gir; sistem HRmax = 220 - yaş, HRR = HRmax - RHR hesaplar.",
    rel: "Yağ yakımı, dayanıklılık ve interval planlarında hedef nabız aralıklarını verir.",
    img: "assets/help/hr.png"
  }
};

function modal(key){
  const d = HELP[key]; if(!d) return;
  document.getElementById("helpTitle").textContent = d.title;
  document.getElementById("helpAim").textContent   = d.aim;
  document.getElementById("helpHow").textContent   = d.how;
  document.getElementById("helpRel").textContent   = d.rel;
  const img = document.getElementById("helpImg");
  if(d.img){ img.src = d.img; img.style.display="block"; } else { img.style.display="none"; }
  document.getElementById("helpModal").classList.remove("hide");
}
document.getElementById("helpModal").addEventListener("click",(e)=>{
  if(e.target.id==="helpModal" || e.target.id==="helpClose"){
    document.getElementById("helpModal").classList.add("hide");
  }
});

// Hedeflere göre test kartları
const DEFAULT_TESTS = [
  {key:"hrmax_hrr", title:"HRmax & HRR", fields:[
    {id:"age_in", label:"Yaş (yukarıda giriniz)", ro:true},
    {id:"rhr_in", label:"Dinlenik Nabız (yukarıda giriniz)", ro:true}
  ]},
  {key:"ybalance", title:"Y-Balance", fields:[
    {id:"y_ant", label:"Anterior (cm)"},
    {id:"y_pm",  label:"Posteromedial (cm)"},
    {id:"y_pl",  label:"Posterolateral (cm)"}
  ]},
  {key:"flamingo", title:"Flamingo Denge", fields:[
    {id:"flam_sec", label:"En iyi süre (sn)"}
  ]},
  {key:"sprint5_10", title:"Sprint 5 m / 10 m", fields:[
    {id:"s5", label:"5 m (sn)"}, {id:"s10", label:"10 m (sn)"}
  ]}
];

function makeTestCard(t){
  const div = document.createElement("div");
  div.className="test-card";
  const h = document.createElement("h3");
  h.textContent = t.title;
  const btn = document.createElement("button");
  btn.className="link"; btn.type="button"; btn.dataset.help=t.key; btn.textContent="Nasıl?";
  div.appendChild(h); div.appendChild(btn);
  t.fields.forEach(f=>{
    const r = document.createElement("div"); r.className="row"; r.style.alignItems="center";
    const lab = document.createElement("label"); lab.textContent=f.label; lab.style.minWidth="220px";
    const inp = document.createElement("input"); inp.type="number"; inp.id=f.id; if(f.ro){ inp.readOnly=true; inp.placeholder="Yukarıdan giriniz"; }
    r.appendChild(lab); r.appendChild(inp); div.appendChild(r);
  });
  return div;
}

function loadTests(){
  testsBox.innerHTML="";
  // Hedeflere göre genişletebilirsin; şimdilik DEFAULT_TESTS
  DEFAULT_TESTS.forEach(t=>testsBox.appendChild(makeTestCard(t)));
}
loadTests();

document.addEventListener("click",(e)=>{
  const btn = e.target.closest("[data-help]");
  if(btn){ modal(btn.dataset.help); }
});

// Kaydet
$("#save").onclick = async ()=>{
  const data = {
    age: $("#age").value,
    rhr: $("#rhr").value,
    tests: {}
  };
  document.querySelectorAll(".test-card input").forEach(inp=>{
    data.tests[inp.id] = inp.value;
  });
  localStorage.setItem("st_metrics", JSON.stringify(data));
  const u = auth.currentUser;
  try{
    if(db && u){ await firebase.firestore().collection("users").doc(u.uid).set({metrics:data},{merge:true}); }
    $("#saveMsg").textContent="Kaydedildi ✔"; $("#saveMsg").className="msg ok";
  }catch(e){
    $("#saveMsg").textContent="Yerel kaydedildi (buluta yazılamadı)."; $("#saveMsg").className="msg";
  }
};

// auth + preset
auth.onAuthStateChanged(u=>{
  if(!u){ location.href="./signup.html"; return; }
});

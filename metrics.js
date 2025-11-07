firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();
let db = null;
try{ db = firebase.firestore(); }catch(e){ db = null; }

const $ = (id)=>document.getElementById(id);

const TESTS = {
  fatloss: [
    {id:"waist", title:"Bel Çevresi", badge:"Yağ", 
     how:"Mezura ile göbek deliği hizasından, bantı yere paralel tutarak ölç. Nefesini ver, rahat konumda ölç.",
     purpose:"Merkezi yağlanmayı izlemek.",
     relate:"Yağ yakımı / kilo verme"},
    {id:"whr", title:"Bel‑Kalça Oranı", badge:"Yağ",
     how:"Bel (göbek deliği hiza) ve kalça çevresi (en geniş) ölçülür; WHR=Bel/Kalça.",
     purpose:"Sağlık riski ve yağ dağılımı.",
     relate:"Yağ yakımı / kilo verme"},
    {id:"ymca", title:"YMCA Step Test (3 dk)", badge:"Dayanıklılık",
     how:"30 cm step’e 3 dk 96 bpm ritimde çık‑in. Test sonrası 1. dakikadaki kalp hızını kaydet.",
     purpose:"Submaksimal aerobik kapasite tahmini.",
     relate:"Yağ yakımı, genel kondisyon"}
  ],
  muscle: [
    {id:"arm", title:"Üst Kol Çevresi", badge:"Kas",
     how:"Kol serbest, bicepsin en kalın yerinden mezura ile ölç.",
     purpose:"Üst ekstremite kas kütlesi değişimi.",
     relate:"Kas kazanımı / kuvvet"},
    {id:"chest", title:"Göğüs Çevresi", badge:"Kas",
     how:"Sternum hizası, bant yere paralel.",
     purpose:"Göğüs kas kütlesi takibi.",
     relate:"Kas kazanımı / kuvvet"},
    {id:"epley", title:"5RM → 1RM (Epley)", badge:"Kuvvet",
     how:"Güvenli bir 5RM kaldır ve 1RM ≈ 5RM × (1 + 0.0333×5) formülüyle tahmin et.",
     purpose:"Maksimal kuvvet tahmini (doğrudan 1RM yerine güvenli tahmin).",
     relate:"Kas kazanımı / kuvvet"}
  ],
  endurance: [
    {id:"cooper", title:"Cooper (12 dk)", badge:"Dayanıklılık",
      how:"12 dakikada toplam mesafe. Sonuçtan VO₂max tahmini yapılabilir.",
      purpose:"Aerobik kapasite saha tahmini.",
      relate:"Koşu / dayanıklılık"},
    {id:"beep", title:"20 m Beep Test", badge:"Dayanıklılık",
      how:"İki çizgi arası 20 m; bip sesiyle hızlanan kademeler. Seviyeni kaydet.",
      purpose:"Maksimal koşu dayanıklılığı.",
      relate:"Koşu / dayanıklılık"}
  ],
  home: [
    {id:"plank", title:"Plank Süresi", badge:"Core",
     how:"Dirsek plank, süre tut. Çökmeden sürdürebildiğin maksimum süre.",
     purpose:"Core dayanıklılığı.",
     relate:"Ev egzersizi / core"},
    {id:"squat1m", title:"1 dk Squat Tekrarı", badge:"Alt Vücut",
     how:"1 dakikada tam kontrollü squat sayısı.",
     purpose:"Kuvvet‑dayanıklılık.",
     relate:"Ev egzersizi"}
  ],
  mobility: [
    {id:"sitreach", title:"Sit‑and‑Reach", badge:"Esneklik",
     how:"Bacaklar düz, uzanabildiğin mesafe (cm).",
     purpose:"Hamstring‑alt sırt esnekliği.",
     relate:"Mobilite"},
    {id:"shoulder", title:"Omuz Fleksiyon Testi", badge:"Esneklik",
     how:"Duvara sırtın düz; kolları öne‑yukarı kaldır, hareket açıklığını değerlendir.",
     purpose:"Omuz hareketliliği.",
     relate:"Mobilite"}
  ],
  posture: [
    {id:"walltest", title:"Duvar Postür Testi", badge:"Duruş",
     how:"Topuk‑kalça‑sırt‑baş duvara temas. Aşırı boşluk var mı? Not al.",
     purpose:"Postür farkındalığı.",
     relate:"Duruş / core"},
    {id:"birdog", title:"Bird‑Dog Sabitlik", badge:"Core",
     how:"Karşı kol‑bacak uzatma; 10 tekrarda denge kaybı sayısı.",
     purpose:"Lombo‑pelvik kontrol.",
     relate:"Duruş / core"}
  ],
  sport: [
    {id:"agility5_10_5", title:"5‑10‑5 Pro Agility", badge:"Çeviklik",
     how:"Orta koniden sağ‑sol sprint; toplam süre.",
     purpose:"Yön değiştirme çevikliği.",
     relate:"Spor özel çeviklik"},
    {id:"ybal", title:"Y‑Balance (Özet)", badge:"Denge",
     how:"Tek ayak üzerinde üç yönde uzanma mesafeleri (normalize ederek kaydet).",
     purpose:"Tek ayak denge‑stabilite.",
     relate:"Spor, sakatlık önleme"}
  ]
};

function readCtx(){
  try{ return JSON.parse(localStorage.getItem("st_ctx")||"{}"); }catch(e){ return {}; }
}

function renderTests(goals){
  const host = document.getElementById("tests");
  host.innerHTML = "";
  const uniq = [];
  goals.forEach(gid=>{
    (TESTS[gid]||[]).forEach(t=>{
      if(uniq.includes(t.id)) return;
      uniq.push(t.id);
      const card = document.createElement("div");
      card.className = "test-card";
      card.innerHTML = `
        <div class="test-head">
          <div><span class="badge">${t.badge}</span> <span class="test-title">${t.title}</span></div>
          <button class="btn" data-id="${t.id}" style="height:32px">Nasıl?</button>
        </div>
        <div class="test-body hide" id="body-${t.id}">
          <div><b>Amaç:</b> ${t.purpose}</div>
          <div><b>Nasıl yapılır:</b> ${t.how}</div>
          <div><b>Hedefle ilişkisi:</b> ${t.relate}</div>
        </div>
      `;
      host.appendChild(card);
    });
  });
  host.querySelectorAll('button[data-id]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const id = b.getAttribute('data-id');
      const el = document.getElementById("body-"+id);
      if(el) el.classList.toggle("hide");
    });
  });
}

function computeHR(){
  const age = parseInt((document.getElementById("age").value||"").trim(),10);
  const rhr = parseInt((document.getElementById("rhr").value||"").trim(),10);
  const hrmax = (Number.isFinite(age) ? (220 - age) : null);
  document.getElementById("hrmax").textContent = (hrmax!==null?hrmax:"—");
  document.getElementById("hrr").textContent = (hrmax!==null && Number.isFinite(rhr)) ? (hrmax - rhr) : "—";
}

document.getElementById("age").addEventListener("input", computeHR);
document.getElementById("rhr").addEventListener("input", computeHR);

document.getElementById("back").onclick = ()=> history.back();
document.getElementById("logout").onclick = async ()=>{ await auth.signOut(); location.href="./signup.html"; };

document.getElementById("save").onclick = async ()=>{
  const payload = {
    ts: new Date().toISOString(),
    age: document.getElementById("age").value||null,
    rhr: document.getElementById("rhr").value||null
  };
  localStorage.setItem("st_metrics", JSON.stringify(payload));
  const msg = document.getElementById("msg");
  msg.className="msg ok"; msg.textContent="Kaydedildi ✔ (yerel)";
  try{
    const u = auth.currentUser;
    if(firebase.firestore && u){
      await firebase.firestore().collection("users").doc(u.uid).collection("metrics").add(payload);
      msg.className="msg ok"; msg.textContent="Kaydedildi ✔ (bulut)";
    }
  }catch(e){ console.warn("Firestore yazılamadı:", e); }
};

auth.onAuthStateChanged(u=>{
  if(!u){ location.href="./signup.html"; return; }
  const ctx = readCtx();
  renderTests(ctx.goals||[]);
  computeHR();
});

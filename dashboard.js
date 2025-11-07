// init
firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();
let db = null;
try{ db = firebase.firestore(); }catch(_){ db = null; }

const $ = (s)=>document.querySelector(s);
const $$=(s)=>document.querySelectorAll(s);

const TARGETS = [
  "Yağ yakımı","Kilo verme","Kas kazanımı","Kuvvet artışı","Dayanıklılık (kardiyo)",
  "Çeviklik","Esneklik","Fonksiyonel antrenman","Evde ekipmansız","Koşu performansı",
  "Tenis","Yüzme","HIIT/Interval","Duruş & core","Genel sağlık"
];
const LEVELS = ["Yeni başlayan","Orta","İleri","Profesyonel"];
const INJURIES = ["Diz (ACL/Menisküs)","Bel/boyun","Omuz (rotator cuff)","Ayak bileği","Tendon/bağ","Diğer"];

function chip(label, cls=""){
  const b = document.createElement("button");
  b.type="button"; b.className="chip "+cls; b.textContent=label;
  return b;
}

function mountChips(){
  const tBox=$("#targets"); const lBox=$("#levels"); const iBox=$("#injuries");
  TARGETS.forEach(x=>tBox.appendChild(chip(x)));
  LEVELS.forEach(x=>lBox.appendChild(chip(x,"single")));
  INJURIES.forEach(x=>iBox.appendChild(chip(x)));
}
mountChips();

// selection logic
let selectedTargets = new Set();
let selectedLevel = null;
let selectedInj = new Set();
const LIMIT = 3;

$("#targets").addEventListener("click",(e)=>{
  const b = e.target.closest(".chip"); if(!b) return;
  const k = b.textContent;
  if(b.classList.contains("active")){ b.classList.remove("active"); selectedTargets.delete(k); }
  else{
    if(selectedTargets.size>=LIMIT){ return; }
    b.classList.add("active"); selectedTargets.add(k);
  }
  $("#selCount").textContent = selectedTargets.size+"/"+LIMIT;
});

$("#levels").addEventListener("click",(e)=>{
  const b = e.target.closest(".chip"); if(!b) return;
  $$(`#levels .chip`).forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); selectedLevel = b.textContent;
});

$("#injuries").addEventListener("click",(e)=>{
  const b = e.target.closest(".chip"); if(!b) return;
  const k = b.textContent;
  if(b.classList.contains("active")){ b.classList.remove("active"); selectedInj.delete(k); }
  else{ b.classList.add("active"); selectedInj.add(k); }
});

// auth guard (opsiyonel)
auth.onAuthStateChanged(u=>{
  if(!u){ location.href="./signup.html"; return; }
});

$("#logout").onclick = async ()=>{ try{ await auth.signOut(); }catch(_){} location.href="./signup.html"; };

$("#next").onclick = async ()=>{
  const u = auth.currentUser;
  const payload = {
    targets: [...selectedTargets],
    level: selectedLevel,
    injuries: [...selectedInj],
    ts: Date.now()
  };
  // localStorage
  localStorage.setItem("st_profile", JSON.stringify(payload));
  // Firestore (varsa)
  try{
    if(db && u){ await db.collection("users").doc(u.uid).set(payload, {merge:true}); }
    $("#saveMsg").textContent="Kaydedildi ✔"; $("#saveMsg").className="msg ok";
  }catch(e){
    $("#saveMsg").textContent="Yerel kaydedildi (buluta yazılamadı)."; $("#saveMsg").className="msg";
  }
  // ileri
  location.href="./metrics.html";
};

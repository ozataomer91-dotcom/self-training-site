
// auth
firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();

const $ = (s)=>document.querySelector(s);
const msg = (t, ok=false)=>{ const m=$("#msg"); m.textContent=t; m.className="msg "+(ok?"ok":"err"); }

const GOALS = [
  "Yağ Yakımı / Kilo Verme","Kas Kazanımı / Kuvvet","Dayanıklılık / Koşu",
  "Esneklik / Mobilite","Evde Ekipmansız","Duruş / Core",
  "Fonksiyonel Fitness / HIIT","Sürat / Çeviklik","Branş Sporu (tenis/yüzme)"
];
const INJ = ["Yok","Bel","Diz","Omuz","Boyun","Ayak bileği"];

function makeChips(container, items, maxSelect=0){
  const el = $(container); el.innerHTML="";
  const state = new Set();
  items.forEach(txt=>{
    const c = document.createElement("button");
    c.type="button"; c.className="chip"; c.textContent=txt;
    c.onclick=()=>{
      if(c.classList.contains("active")){ c.classList.remove("active"); state.delete(txt); }
      else{
        if(maxSelect && state.size>=maxSelect){ return; }
        c.classList.add("active"); state.add(txt);
      }
    };
    el.appendChild(c);
  });
  return ()=>Array.from(state);
}

const pickGoals = makeChips("#goals", GOALS, 3);
const pickInj   = makeChips("#injuries", INJ, 6);

auth.onAuthStateChanged(u=>{
  $("#who").textContent = u ? (u.displayName || u.email) : "Anonim";
});

$("#btnLogout").onclick = ()=>auth.signOut().then(()=>location.href="./index.html");

$("#btnNext").onclick = ()=>{
  const selGoals = pickGoals();
  if(selGoals.length===0){ msg("En az 1 hedef seç."); return; }
  const payload = {
    goals: selGoals,
    history: $("#history").value,
    level: $("#level").value,
    injuries: pickInj().filter(x=>x!=="Yok"),
    injOther: $("#injOther").value.trim()
  };
  localStorage.setItem("st_profile", JSON.stringify(payload));
  location.href = "./metrics.html";
};

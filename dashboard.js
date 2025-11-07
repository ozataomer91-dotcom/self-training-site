firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();

const $ = (id)=>document.getElementById(id);
const GOAL_MAX = 3;

const GOALS = [
  {id:"fatloss",   label:"Yağ Yakımı / Kilo Verme"},
  {id:"muscle",    label:"Kas Kazanımı / Kuvvet"},
  {id:"endurance", label:"Dayanıklılık / Koşu"},
  {id:"mobility",  label:"Esneklik / Mobilite"},
  {id:"home",      label:"Evde Ekipmansız"},
  {id:"posture",   label:"Duruş / Core"},
  {id:"sport",     label:"Branş Sporu (tenis/yüzme)"},
];

const LEVELS = ["Başlangıç","Orta","İleri"];
const INJ = ["Yok","Bel","Diz","Omuz","Boyun","Ayak bileği","Diğer"];

function chip(id, text, group){
  const lbl = document.createElement("label");
  lbl.className = "chip";
  const inp = document.createElement("input");
  inp.type = (group==="goals" || group==="inj") ? "checkbox" : "radio";
  inp.name = group;
  inp.value = id;
  lbl.appendChild(inp);
  const span = document.createElement("span");
  span.textContent = text;
  lbl.appendChild(span);
  return lbl;
}

function mountChips(){
  const gb = $("goalBox");
  GOALS.forEach(g=>gb.appendChild(chip(g.id,g.label,"goals")));
  const lb = $("lvlBox");
  LEVELS.forEach((t,i)=>lb.appendChild(chip(String(i),t,"level")));
  const ib = $("injBox");
  INJ.forEach(t=>ib.appendChild(chip(t,t,"inj")));
}

function selected(group){
  const n = group==="level" ? "level" : (group==="goals"?"goals":"inj");
  return Array.from(document.querySelectorAll(`input[name="${n}"]`))
    .filter(i=>i.checked).map(i=>i.value);
}

function enforceMaxGoals(){
  const gos = Array.from(document.querySelectorAll(`input[name="goals"]`));
  gos.forEach(i=>{
    i.addEventListener("change", ()=>{
      const sel = gos.filter(k=>k.checked);
      if(sel.length>GOAL_MAX){
        i.checked = false;
        alert(`En fazla ${GOAL_MAX} hedef seçebilirsin.`);
      }
    });
  });
}

function saveCtx(){
  const ctx = {
    goals: selected("goals"),
    level: selected("level")[0] || "",
    inj: selected("inj"),
    history: $("history").value || ""
  };
  localStorage.setItem("st_ctx", JSON.stringify(ctx));
  return ctx;
}

function loadCtx(){
  try{
    const ctx = JSON.parse(localStorage.getItem("st_ctx")||"{}");
    if(ctx.goals){
      ctx.goals.forEach(id=>{
        const el = Array.from(document.querySelectorAll('input[name="goals"]')).find(i=>i.value===id);
        if(el) el.checked = true;
      });
    }
    if(ctx.level){
      const el = Array.from(document.querySelectorAll('input[name="level"]')).find(i=>i.value===ctx.level);
      if(el) el.checked = true;
    }
    if(ctx.inj){
      ctx.inj.forEach(id=>{
        const el = Array.from(document.querySelectorAll('input[name="inj"]')).find(i=>i.value===id);
        if(el) el.checked = true;
      });
    }
    if(ctx.history){ $("history").value = ctx.history; }
  }catch(e){}
}

auth.onAuthStateChanged(u=>{
  if(!u){ location.href="./signup.html"; return; }
  $("status").textContent = `Giriş: ${u.displayName||u.email}`;
});

$("logout").onclick = async ()=>{
  await auth.signOut();
  location.href="./signup.html";
};
$("next").onclick = ()=>{
  const ctx = saveCtx();
  if(!ctx.goals || ctx.goals.length===0){
    alert("En az 1 hedef seç.");
    return;
  }
  location.href="./metrics.html";
};

mountChips();
enforceMaxGoals();
loadCtx();


firebase.initializeApp(window.firebaseConfig);
const auth = firebase.auth();
const $ = (s)=>document.querySelector(s);
const msg = (t, ok=false)=>{ const m=$("#msg"); m.textContent=t; m.className="msg "+(ok?"ok":"err"); }

// HRmax / HRR hesap
function recalc(){
  const age = parseInt($("#age").value||"0",10);
  const rhr = parseInt($("#rhr").value||"0",10);
  if(age>0){ $("#hrmax").value = String(220 - age); } else { $("#hrmax").value=""; }
  if(age>0 && rhr>0){ $("#hrr").value = String((220 - age) - rhr); } else { $("#hrr").value=""; }
}
["#age","#rhr"].forEach(id=>$(id).addEventListener("input", recalc));

// Modal helpers
const MW = $("#modalWrap");
const openModal=(title, how, rel)=>{
  $("#mTitle").textContent = title;
  $("#mHow").textContent = how;
  $("#mRel").textContent = rel;
  MW.style.display="flex";
};
const closeModal=()=>{ MW.style.display="none"; };
["#mClose","#mOk","#modalWrap"].forEach(s=>$(s).addEventListener("click", (e)=>{
  if(e.target===e.currentTarget || e.currentTarget.id==="mClose" || e.currentTarget.id==="mOk"){ closeModal(); }
}));
window.addEventListener("keydown",(e)=>{ if(e.key==="Escape") closeModal(); });

// Hedeflerden testleri üret
function renderTests(goals){
  const host = $("#tests"); host.innerHTML="";
  const added = new Set();
  (goals||[]).forEach(g=>{
    (window.ST_TESTS.goalToTests[g]||[]).forEach(tn=>{
      if(added.has(tn)) return; added.add(tn);
      const t = window.ST_TESTS.tests[tn]; if(!t) return;
      const card = document.createElement("div"); card.className="test-card";
      const h4 = document.createElement("h4"); h4.innerHTML = tn + ' <button class="btn small ghost" data-k="'+t.key+'">Nasıl?</button>';
      card.appendChild(h4);

      const kv = document.createElement("div"); kv.className="kv";
      (t.inputs||[]).forEach(inp=>{
        const wrap = document.createElement("div"); wrap.className="item";
        const lab = document.createElement("label"); lab.textContent = inp.label; wrap.appendChild(lab);
        const input = document.createElement("input"); input.className="input"; input.placeholder = inp.hint||"Değeri giriniz"; input.id="test_"+t.key+"_"+inp.id;
        wrap.appendChild(input); kv.appendChild(wrap);
      });
      card.appendChild(kv);
      const help=document.createElement("div"); help.className="footer-note"; help.textContent="Açıklama için ‘Nasıl?’ butonuna tıklayın."; card.appendChild(help);
      host.appendChild(card);
      h4.querySelector("button").onclick=()=>openModal(tn, t.how, t.relation);
    });
  });
  if(!host.children.length){
    const p=document.createElement("p"); p.className="help"; p.textContent="Seçili hedeflere karşılık gelen test bulunamadı."; host.appendChild(p);
  }
}

// load selected goals
let profile = null;
try{ profile = JSON.parse(localStorage.getItem("st_profile")||"null"); }catch{}
if(!profile || !profile.goals || !profile.goals.length){
  // geri gönder
  location.href="./dashboard.html";
}else{
  renderTests(profile.goals);
}

$("#btnBack").onclick = ()=> history.back();

auth.onAuthStateChanged(u=>{
  if(!u){ location.href="./index.html"; }
});

$("#btnLogout").onclick = ()=> auth.signOut().then(()=>location.href="./index.html");

$("#btnSave").onclick = ()=>{
  const age = parseInt($("#age").value||"0",10);
  const rhr = parseInt($("#rhr").value||"0",10);
  if(!(age>0 && rhr>0)){ msg("Yaş ve RHR giriniz."); return; }
  const out = {
    age, rhr, hrmax: 220-age, hrr: (220-age)-rhr,
    tests: {}
  };
  // collect test inputs
  document.querySelectorAll("#tests .test-card").forEach(card=>{
    const title = card.querySelector("h4").innerText.replace(" Nasıl?","");
    const inputs = {};
    card.querySelectorAll("input").forEach(i=>{ inputs[i.id.replace("test_","")] = i.value; });
    out.tests[title]=inputs;
  });
  localStorage.setItem("st_metrics", JSON.stringify(out));
  msg("Kaydedildi ✔", true);
};

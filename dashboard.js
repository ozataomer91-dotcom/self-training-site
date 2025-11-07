
(function(){
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const byId = (id)=>document.getElementById(id);

  // Firebase
  if(!window.firebaseConfig){ console.error("config.js bulunamadı"); }
  if(!firebase.apps.length){ firebase.initializeApp(window.firebaseConfig); }
  const auth = firebase.auth();
  const db   = firebase.firestore();

  // Hedefler
  const GOALS = [
    "Yağ yakımı / Kilo verme",
    "Kas kazanımı / Hipertrofi",
    "Kuvvet artışı (1RM)",
    "Dayanıklılık (koşu/tempo)",
    "Fonksiyonel fitness / HIIT",
    "Mobilite & Esneklik",
    "Postür / Bel-boyun sağlığı",
    "Evde ekipmansız antrenman",
    "Kardiyorespiratuvar sağlık",
    "Hız / Çeviklik",
    "Patlayıcı güç (plyo)",
    "Rehabilitasyon odaklı dönüş",
    "Yüzme performansı",
    "Tenis / Raket sporları hazırlık"
  ];

  // UI build
  const wrap = byId("goalWrap");
  GOALS.forEach((g,i)=>{
    const id = "g"+i;
    const label = document.createElement("label");
    label.className = "choice";
    label.innerHTML = `<input type="checkbox" class="gchk" id="${id}" value="${g}"><span>${g}</span>`;
    wrap.appendChild(label);
  });

  // En fazla 3 seç
  const limit = 3;
  wrap.addEventListener("change", (event) => {
    const checked = $$(".gchk:checked");
    if(checked.length > limit){
      event.target.checked = false;
      byId("goalMsg").textContent = `En fazla ${limit} hedef seçebilirsin.`;
      byId("goalMsg").className = "msg err";
      setTimeout(()=>{ byId("goalMsg").textContent=""; byId("goalMsg").className="msg"; }, 1800);
    }
  });

  // Auth guard
  let UID = null;
  auth.onAuthStateChanged(user=>{
    if(!user){ location.href = "./index.html"; return; }
    UID = user.uid;
  });

  // Çıkış
  byId("btnSignOut").onclick = async ()=>{
    try{ await auth.signOut(); location.href="./index.html"; }catch(e){ console.error(e); }
  };

  // İlerle → kaydet + metrics.html
  byId("btnNext").onclick = async ()=>{
    const goals = $$(".gchk:checked").map(c=>c.value);
    const health = byId("health").value.trim();
    const level  = byId("level").value;
    const history= byId("history").value.trim();

    if(goals.length === 0){
      byId("saveMsg").textContent = "En az 1 hedef seç.";
      byId("saveMsg").className = "msg err"; return;
    }

    const payload = { goals, health, level, history, updatedAt: new Date().toISOString() };
    // Yerel
    localStorage.setItem("stStep1", JSON.stringify(payload));

    // Firestore opsiyonel
    try{
      if(UID){
        await db.collection("users").doc(UID).set({ step1: payload }, { merge:true });
        byId("saveMsg").textContent = "Kaydedildi. Ölçümlere geçiliyor…";
        byId("saveMsg").className = "msg ok";
      }
    }catch(e){ console.warn("Firestore kaydı başarısız:", e); }

    setTimeout(()=>location.href="./metrics.html", 500);
  };
})();

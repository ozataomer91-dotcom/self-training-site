// dashboard.js — Hedef/Geçmiş ekranı (ölçümler ayrı sayfada)
console.log("DASHBOARD v1 BOOT");

(function(){
  if (!window.firebase) { alert("Firebase yüklenemedi."); return; }
  if (!firebase.apps.length) {
    try { firebase.initializeApp(window.firebaseConfig); } catch(e) {}
  }
  const auth = firebase.auth();
  const db   = firebase.firestore ? firebase.firestore() : null;

  const $ = (id)=>document.getElementById(id);
  const msg=(t,ok=false)=>{ const m=$("globalMsg"); m.className="msg "+(ok?"ok":"err"); m.textContent=t; };

  const MAX_GOALS = 3; // İstersek 2 yapabiliriz

  const GOALS = [
    "Yağ Yakma (Kilo Verme)","Kas Kazanımı (Hipertrofi)","Kuvvet Artışı",
    "Kardiyo Dayanıklılığı (Koşu/Bisiklet)","Esneklik & Mobilite",
    "Genel Sağlık / Formda Kalma","Evde Ekipmansız Egzersiz","Postür & Sırt Sağlığı",
    "Rehabilitasyon / Spora Dönüş","Koşu Performansı (Tempo/Interval)",
    "HIIT / Metabolik","Fonksiyonel Antrenman","Tenis Odaklı","Yüzme Kondisyonu"
  ];
  const HEALTH = [
    "Bel ağrısı","Diz ağrısı / Menisküs","Omuz sıkışma / Rotator cuff","Boyun ağrısı",
    "Kalp / Hipertansiyon","Astım","Diyabet","Tiroid","Obezite","Diğer"
  ];
  const SPORTS = [
    "Koşu","Yürüyüş","Bisiklet","Yüzme","Ağırlık / Fitness","Tenis","Basketbol",
    "Futbol","Voleybol","CrossFit","Pilates","Yoga","Hiçbiri"
  ];

  function renderChips(boxId, list, name){
    const box = $(boxId);
    box.innerHTML = "";
    list.forEach((txt,i)=>{
      const id = name+"_"+i;
      const div = document.createElement("label");
      div.className = "chip";
      div.innerHTML = `<input type="checkbox" id="${id}" name="${name}" value="${txt}"><span>${txt}</span>`;
      box.appendChild(div);
    });
  }
  renderChips("goalsBox", GOALS, "goals");
  renderChips("healthBox", HEALTH, "health");
  renderChips("sportsBox", SPORTS, "sports");

  // Max hedef kuralı
  function enforceMaxGoals(){
    const checked = Array.from(document.querySelectorAll('input[name="goals"]:checked'));
    if (checked.length > MAX_GOALS){
      const last = checked.pop();
      last.checked = false;
      msg(`En fazla ${MAX_GOALS} hedef seçebilirsin.`, false);
    } else { msg(""); }
  }
  $("goalsBox").addEventListener("change", enforceMaxGoals);

  // Auth & Prefill
  let currentUser = null;
  auth.onAuthStateChanged(async (u)=>{
    if(!u){ location.href = "./signup.html"; return; }
    currentUser = u;
    $("hello").textContent = "Hoş geldin " + (u.displayName || u.email);

    try{
      if (db){
        const snap = await db.collection("users").doc(u.uid).get();
        if (snap.exists){ fillFromData(snap.data()); }
      }
    }catch(e){ console.warn("Prefill error", e); }
  });

  function fillFromData(d){
    if (!d) return;
    (d.goals||[]).forEach(v=>{
      const el = Array.from(document.querySelectorAll('input[name="goals"]')).find(x=>x.value===v);
      if (el) el.checked = true;
    });
    (d.healthIssues||[]).forEach(v=>{
      const el = Array.from(document.querySelectorAll('input[name="health"]')).find(x=>x.value===v);
      if (el) el.checked = true;
    });
    (d.sportHistory||[]).forEach(v=>{
      const el = Array.from(document.querySelectorAll('input[name="sports"]')).find(x=>x.value===v);
      if (el) el.checked = true;
    });
    if (d.level) $("level").value = d.level;
    if (d.notes) $("notes").value = d.notes;
  }

  // İlerle: kaydet + ölçümlere git
  $("btnNext").addEventListener("click", async ()=>{
    if (!currentUser){ msg("Oturum bulunamadı.", false); return; }
    const goals = Array.from(document.querySelectorAll('input[name="goals"]:checked')).map(x=>x.value);
    if (goals.length === 0){ msg("En az 1 hedef seç.", false); return; }
    if (goals.length > MAX_GOALS){ msg(`En fazla ${MAX_GOALS} hedef seçebilirsin.`, false); return; }

    const payload = {
      goals,
      healthIssues: Array.from(document.querySelectorAll('input[name="health"]:checked')).map(x=>x.value),
      sportHistory: Array.from(document.querySelectorAll('input[name="sports"]:checked')).map(x=>x.value),
      level: $("level").value || "",
      notes: $("notes").value.trim(),
      step: "goals",
      updatedAt: new Date().toISOString()
    };

    try{
      if (db){
        await db.collection("users").doc(currentUser.uid).set(payload, { merge:true });
      }
      location.href = "./measures.html";
    }catch(e){
      console.warn("Save error", e);
      msg("Kaydetme hatası oluştu. Yeniden dene.", false);
    }
  });

  // Çıkış
  $("btnLogout").addEventListener("click", async ()=>{
    try{ await auth.signOut(); }catch(e){}
    location.href = "./signup.html";
  });
})();

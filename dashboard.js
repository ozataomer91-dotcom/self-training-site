// dashboard.js v3 — HR MAX metinleri + Hesapla butonu
console.log("DASHBOARD v3 BOOT");

(function(){
  if (!window.firebase) { alert("Firebase yüklenemedi."); return; }
  if (!firebase.apps.length) {
    try { firebase.initializeApp(window.firebaseConfig); } catch(e) {}
  }
  const auth = firebase.auth();
  const db   = firebase.firestore ? firebase.firestore() : null;

  const $ = (id)=>document.getElementById(id);
  const msg=(t,ok=false)=>{ const m=$("globalMsg"); m.className="msg "+(ok?"ok":"err"); m.textContent=t; };

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
      div.innerHTML = <input type="checkbox" id="${id}" name="${name}" value="${txt}"><span>${txt}</span>;
      box.appendChild(div);
    });
  }
  renderChips("goalsBox", GOALS, "goals");
  renderChips("healthBox", HEALTH, "health");
  renderChips("sportsBox", SPORTS, "sports");

  // Max 3 hedef
  function enforceMaxGoals(){
    const checked = Array.from(document.querySelectorAll('input[name="goals"]:checked'));
    if (checked.length > 3){
      const last = checked.pop();
      last.checked = false;
      msg("En fazla 3 hedef seçebilirsin.", false);
    } else { msg(""); }
  }
  $("goalsBox").addEventListener("change", enforceMaxGoals);

  // HR hesapları
  function round(x){ return Math.round(Number(x)||0); }
  function computeZones(){
    const age = +($("ageYears").value || 0);
    const rhr = +($("restHr").value || 0);
    const table = $("zonesTable");
    const body  = $("zonesBody");
    const sum   = $("hrSummary");

    if (age < 5 || age > 100 || rhr <= 0 || rhr > 120){
      table.style.display = "none";
      sum.textContent = "HR MAX ve bölgeler için geçerli yaş (5–100) ve dinlenik nabız (BPM) gir.";
      return;
    }

    const hrMax = 220 - age;               // HR MAX
    const hrr   = hrMax - rhr;              // Karvonen HRR
    const z = (low,high)=>[ round(rhr + hrr*low), round(rhr + hrr*high) ];

    const rows = [
      ["%50–60 (Hafif)", ...z(0.50,0.60), "Isınma, toparlanma"],
      ["%60–70 (Yağ yakım)", ...z(0.60,0.70), "Temel dayanıklılık"],
      ["%70–80 (Aerobik)", ...z(0.70,0.80), "Tempo, steady-state"],
      ["%80–90 (Anaerobik)", ...z(0.80,0.90), "Interval, güçlenme"],
      ["%90–100 (Maks)", ...z(0.90,1.00), "Kısa sprint/tepe"]
    ];

    body.innerHTML = rows.map(r=><tr><td>${r[0]}</td><td>${r[1]}–${r[2]} bpm</td><td>${r[3]}</td></tr>).join("");
    table.style.display = "";
    sum.innerHTML = HR MAX ≈ <b>${hrMax}</b> bpm (maksimum atım), HRR = <b>${hrr}</b> (Karvonen).;
  }

  // Otomatik ve butonla hesap
  ["ageYears","restHr"].forEach(id=>$(id).addEventListener("input", computeZones));
  $("btnCompute").addEventListener("click", computeZones);

  // Auth & Prefill
  let currentUser = null;
  auth.onAuthStateChanged(async (u)=>{
    if(!u){ location.href = "./signup.html"; return; }
    currentUser = u;
    $("hello").textContent = "Hoş geldin " + (u.displayName || u.email);

    const key = "st_profile_" + u.uid;
    try{
      if (db){
        const snap = await db.collection("users").doc(u.uid).get();
        if (snap.exists){ fillFromData(snap.data()); }
        else {
          const raw = localStorage.getItem(key);
          if (raw) fillFromData(JSON.parse(raw));
        }
      } else {
        const raw = localStorage.getItem(key);
        if (raw) fillFromData(JSON.parse(raw));
      }
    }catch(e){ console.warn("Prefill error", e); }
    computeZones();
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
    const m = d.measures || {};
    if (m.ageYears) $("ageYears").value = m.ageYears;
    if (m.restHr)   $("restHr").value   = m.restHr;
    if (m.heightCm) $("heightCm").value = m.heightCm;
    if (m.weightKg) $("weightKg").value = m.weightKg;
    if (m.waistCm)  $("waistCm").value  = m.waistCm;
    if (m.hipCm)    $("hipCm").value    = m.hipCm;
    if (m.neckCm)   $("neckCm").value   = m.neckCm;
  }

  // Kaydet
  $("btnSave").addEventListener("click", async ()=>{
    if (!currentUser){ msg("Oturum bulunamadı.", false); return; }
    const goals = Array.from(document.querySelectorAll('input[name="goals"]:checked')).map(x=>x.value);
    if (goals.length === 0){ msg("En az 1 hedef seç.", false); return; }
    if (goals.length > 3){ msg("En fazla 3 hedef seçebilirsin.", false); return; }

    const ageYears = +($("ageYears").value || 0);
    const restHr   = +($("restHr").value   || 0);
    const hrMax    = (ageYears>=5 && ageYears<=100) ? (220 - ageYears) : null;
    const hrr      = (hrMax && restHr>0 && restHr<=120) ? (hrMax - restHr) : null;

    const payload = {
      goals,
      healthIssues: Array.from(document.querySelectorAll('input[name="health"]:checked')).map(x=>x.value),
      sportHistory: Array.from(document.querySelectorAll('input[name="sports"]:checked')).map(x=>x.value),
      level: $("level").value || "",
      notes: $("notes").value.trim(),
      measures: {
        ageYears: ageYears || null,
        restHr:   restHr   || null,
        heightCm: +($("heightCm").value || 0) || null,
        weightKg: +($("weightKg").value || 0) || null,
        waistCm:  +($("waistCm").value  || 0) || null,
        hipCm:    +($("hipCm").value    || 0) || null,
        neckCm:   +($("neckCm").value   || 0) || null
      },
      computed: { hrMax: hrMax || null, hrr: hrr || null },
      updatedAt: new Date().toISOString()
    };

    const key = "st_profile_" + currentUser.uid;

    try{
      if (db){
        await db.collection("users").doc(currentUser.uid).set(payload, { merge:true });
        msg("Kaydedildi ✔ (bulut)", true);
      } else {
        localStorage.setItem(key, JSON.stringify(payload));
        msg("Kaydedildi ✔ (yerel yedek)", true);
      }
    }catch(e){
      console.warn("Firestore write fail, fallback local", e);
      localStorage.setItem(key, JSON.stringify(payload));
      msg("Kaydedildi ✔ (yerel yedek)", true);
    }
  });

  // Çıkış
  $("btnLogout").addEventListener("click", async ()=>{
    try{ await auth.signOut(); }catch(e){}
    location.href = "./signup.html";
  });
})();

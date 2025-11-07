// measures.js — Ölçümler + HR MAX
console.log("MEASURES v1 BOOT");

(function(){
  if (!window.firebase) { alert("Firebase yüklenemedi."); return; }
  if (!firebase.apps.length) {
    try { firebase.initializeApp(window.firebaseConfig); } catch(e) {}
  }
  const auth = firebase.auth();
  const db   = firebase.firestore ? firebase.firestore() : null;

  const $ = (id)=>document.getElementById(id);
  const msg=(t,ok=false)=>{ const m=$("globalMsg"); m.className="msg "+(ok?"ok":"err"); m.textContent=t; };

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

    body.innerHTML = rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}–${r[2]} bpm</td><td>${r[3]}</td></tr>`).join("");
    table.style.display = "";
    sum.innerHTML = `HR MAX ≈ <b>${hrMax}</b> bpm (maksimum atım), HRR = <b>${hrr}</b> (Karvonen).`;
  }

  ["ageYears","restHr"].forEach(id=>$(id).addEventListener("input", computeZones));
  $("btnCompute").addEventListener("click", computeZones);

  // Auth
  let currentUser = null;
  auth.onAuthStateChanged(async (u)=>{
    if(!u){ location.href = "./signup.html"; return; }
    currentUser = u;
    // Prefill
    try{
      if (db){
        const snap = await db.collection("users").doc(u.uid).get();
        if (snap.exists){
          const d = snap.data() || {};
          const m = d.measures || {};
          if (m.ageYears) $("ageYears").value = m.ageYears;
          if (m.restHr)   $("restHr").value   = m.restHr;
          if (m.heightCm) $("heightCm").value = m.heightCm;
          if (m.weightKg) $("weightKg").value = m.weightKg;
          if (m.waistCm)  $("waistCm").value  = m.waistCm;
          if (m.hipCm)    $("hipCm").value    = m.hipCm;
          if (m.neckCm)   $("neckCm").value   = m.neckCm;
        }
      }
    }catch(e){ console.warn("Prefill error", e); }
    computeZones();
  });

  // Kaydet
  $("btnSave").addEventListener("click", async ()=>{
    if (!currentUser){ msg("Oturum bulunamadı.", false); return; }

    const ageYears = +($("ageYears").value || 0);
    const restHr   = +($("restHr").value   || 0);
    const hrMax    = (ageYears>=5 && ageYears<=100) ? (220 - ageYears) : null;
    const hrr      = (hrMax && restHr>0 && restHr<=120) ? (hrMax - restHr) : null;

    const payload = {
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
      step: "measures",
      updatedAt: new Date().toISOString()
    };

    try{
      if (db){
        await db.collection("users").doc(currentUser.uid).set(payload, { merge:true });
        msg("Kaydedildi ✔ (bulut)", true);
      } else {
        msg("Kaydedildi ✔", true);
      }
    }catch(e){
      console.warn("Save error", e);
      msg("Kaydetme hatası oluştu. Yeniden dene.", false);
    }
  });

  // Geri
  $("btnBack").addEventListener("click", ()=>{
    history.back();
  });

  // Çıkış
  $("btnLogout").addEventListener("click", async ()=>{
    try{ await auth.signOut(); }catch(e){}
    location.href = "./signup.html";
  });
})();
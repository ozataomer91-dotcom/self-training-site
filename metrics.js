
(function(){
  const $ = (s)=>document.querySelector(s);
  const byId = (id)=>document.getElementById(id);
  const fmt = (x)=>Number.isFinite(x)? Math.round(x) : "—";

  if(!window.firebaseConfig){ console.error("config.js yok"); }
  if(!firebase.apps.length){ firebase.initializeApp(window.firebaseConfig); }
  const auth = firebase.auth();
  const db   = firebase.firestore();

  let UID = null;
  auth.onAuthStateChanged(u=>{
    if(!u){ location.href="./index.html"; return; }
    UID = u.uid;
  });

  byId("btnSignOut").onclick = async ()=>{ try{ await auth.signOut(); location.href="./index.html"; }catch(e){ console.error(e); } };
  byId("btnBack").onclick = ()=> location.href="./dashboard.html";

  function calc(){
    const age = parseFloat(byId("age").value);
    const rhr = parseFloat(byId("rhr").value);
    const hrmax = Number.isFinite(age) ? 220 - age : NaN;
    const hrr   = (Number.isFinite(hrmax) && Number.isFinite(rhr)) ? (hrmax - rhr) : NaN;
    byId("hrmax").textContent = "HRmax: "+fmt(hrmax);
    byId("hrr").textContent   = "HRR: "+fmt(hrr);
  }
  ["age","rhr"].forEach(id=> byId(id).addEventListener("input", calc));

  const STEP1 = JSON.parse(localStorage.getItem("stStep1")||"{}");

  const GOAL_TESTS = {
    "Yağ yakımı / Kilo verme":[
      {id:"waist",   label:"Bel çevresi (cm)",    help:"Mezura ile göbek hizası."},
      {id:"walk6min",label:"6 dk yürüyüş (m)",    help:"Düz zeminde toplam metre."}
    ],
    "Kas kazanımı / Hipertrofi":[
      {id:"pushups", label:"Şınav max tekrar",     help:"Form bozulana kadar."},
      {id:"plank",   label:"Plank süresi (sn)",    help:"Ön kol plank."}
    ],
    "Kuvvet artışı (1RM)":[
      {id:"squat5rm",   label:"Squat 5RM (kg)",   help:"Isınma sonrası 5 tekrarda maksimum."},
      {id:"deadlift5rm",label:"Deadlift 5RM (kg)",help:"İmkan yoksa boş bırak."}
    ],
    "Dayanıklılık (koşu/tempo)":[
      {id:"coop",  label:"Cooper 12 dk (m)",      help:"Pist/parkur toplam metre."},
      {id:"pace5k",label:"5K tempo (dk:ss)",      help:"Varsa en iyi 5K süresi."}
    ],
    "Fonksiyonel fitness / HIIT":[
      {id:"burpee",label:"Burpee 2 dk tekrar",    help:"2 dakikada toplam tekrar."},
      {id:"jump",  label:"Dikey sıçrama (cm)",    help:"Duvar işareti ile ölç."}
    ],
    "Mobilite & Esneklik":[
      {id:"sitreach",label:"Sit&Reach (cm)",      help:"Şerit metre ile yapılabilir."},
      {id:"shoulder",label:"Omuz hareket (1–10)", help:"Öz değerlendirme."}
    ],
    "Postür / Bel-boyun sağlığı":[
      {id:"mckenzie",label:"Bel ağrısı (0–10)",   help:"0 yok, 10 şiddetli."},
      {id:"neck",    label:"Boyun mobilite (1–10)",help:"Öz değerlendirme."}
    ],
    "Evde ekipmansız antrenman":[
      {id:"airsquat",label:"Air Squat 1 dk tekrar",help:"Tam oturuş-kalkış say."},
      {id:"wallsit", label:"Wall-sit süresi (sn)", help:"Diz 90° duvarda."}
    ],
    "Kardiyorespiratuvar sağlık":[
      {id:"restbp", label:"Dinlenik tansiyon (mmHg)", help:"Varsa ölçüm cihazı."},
      {id:"step",   label:"Step test nabız (BPM)",    help:"3 dk step sonra 1.dk nabız."}
    ],
    "Hız / Çeviklik":[
      {id:"t505",   label:"5-10-5 Pro Agility (sn)", help:"Konilerle ölç."},
      {id:"sprint10",label:"10 m sprint (sn)",       help:"Kronometreyle."}
    ],
    "Patlayıcı güç (plyo)":[
      {id:"broad", label:"Geniş atlama (cm)",       help:"Ayak parmak ucundan."},
      {id:"cmj",   label:"Countermovement Jump (cm)",help:"Varsa uygulama."}
    ],
    "Rehabilitasyon odaklı dönüş":[
      {id:"pain",    label:"Ağrı skoru (0–10)",     help:"0 yok, 10 şiddetli."},
      {id:"singleleg",label:"Tek ayak denge (sn)",  help:"Gözler açık."}
    ],
    "Yüzme performansı":[
      {id:"swim100",label:"100m yüzme (sn)",       help:"Havuzda kronometre."},
      {id:"swim400",label:"400m yüzme (sn)",       help:"Varsa."}
    ],
    "Tenis / Raket sporları hazırlık":[
      {id:"ybalance",label:"Y-Balance (cm)",       help:"Yön başına en iyi değer."},
      {id:"sidestep",label:"Yan adım testi (sn)",  help:"Kısa parkur."}
    ]
  };

  const testsWrap = byId("tests");
  function renderTests(){
    testsWrap.innerHTML = "";
    const goals = (STEP1.goals || []);
    if(!goals.length){
      const p=document.createElement("p"); p.textContent="Hedef bulunamadı. Geri dönüp seçim yap."; testsWrap.appendChild(p); return;
    }
    goals.forEach(g=>{
      (GOAL_TESTS[g] || []).forEach(t=>{
        const box = document.createElement("div");
        box.className = "box";
        box.innerHTML = `
          <div class="label">${t.label}</div>
          <input type="text" id="t_${t.id}" placeholder="Değer gir">
          <small>${t.help}</small>
        `;
        testsWrap.appendChild(box);
      });
    });
  }
  renderTests();

  byId("btnSave").onclick = async ()=>{
    const age = parseFloat(byId("age").value);
    const rhr = parseFloat(byId("rhr").value);
    const hrmax = Number.isFinite(age) ? 220 - age : null;
    const hrr   = (Number.isFinite(hrmax) && Number.isFinite(rhr)) ? (hrmax - rhr) : null;

    const fields = Array.from(testsWrap.querySelectorAll("input")).reduce((acc,el)=>{
      acc[el.id.replace(/^t_/, "")] = el.value.trim(); return acc;
    }, {});

    const payload = { age:isNaN(age)?null:age, rhr:isNaN(rhr)?null:rhr, hrmax, hrr, tests: fields, updatedAt:new Date().toISOString() };
    localStorage.setItem("stMetrics", JSON.stringify(payload));

    try{
      if(auth.currentUser){
        await db.collection("users").doc(auth.currentUser.uid).set({ metrics: payload }, { merge:true });
        byId("saveMsg").textContent = "Kaydedildi ✔";
        byId("saveMsg").className = "msg ok";
      }else{
        byId("saveMsg").textContent = "Yerel kaydedildi (oturum yok).";
        byId("saveMsg").className = "msg ok";
      }
    }catch(e){
      console.warn(e);
      byId("saveMsg").textContent = "Kaydetme başarısız. İnternet veya izinleri kontrol et.";
      byId("saveMsg").className = "msg err";
    }
  };
})();

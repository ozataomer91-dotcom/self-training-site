// metrics.js — modal CLOSE bugfix + HRmax/HRR hesap
console.log("METRICS JS BOOT");

(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const byId = id => document.getElementById(id);

  // --- HRmax/HRR hesap ---
  const age = byId('age');
  const rhr = byId('rhr');
  const hrmax = byId('hrmax');
  const hrr = byId('hrr');

  function recalc(){
    const a = parseInt(age.value,10);
    const r = parseInt(rhr.value,10);
    if(Number.isFinite(a)){
      const hm = 220 - a;
      hrmax.value = hm;
      if(Number.isFinite(r)){
        hrr.value = hm - r;
      } else {
        hrr.value = "";
      }
    } else {
      hrmax.value = ""; hrr.value = "";
    }
  }
  age.addEventListener('input', recalc);
  rhr.addEventListener('input', recalc);

  // --- Modal (robust) ---
  const overlay = byId('overlay');
  const body = byId('mBody');
  const title = byId('mTitle');

  const HELP = {
    hr: {
      title: "HRmax & HRR",
      html: `
        <div class="pill"><strong>Formül:</strong> HRmax = 220 - yaş • HRR = HRmax - RHR</div>
        <div><strong>Nasıl yapılır?</strong><br>Dinlenik nabzı sabah uyanınca 60 saniye say. Yaşı ve RHR’yi sayfanın üstüne gir. Sistem otomatik hesaplar.</div>
        <div><strong>Hedefle ilişkisi</strong><br>HRR, kardiyovasküler kapasiteyi yansıtır. Yağ yakımı ve dayanıklılık odaklı programlarda antrenman şiddeti (zona) seçiminde kullanılır.</div>
      `
    },
    ybal: {
      title: "Y-Balance",
      html: `
        <div><strong>Nasıl yapılır?</strong><br>Tek ayak üzerinde denge al, diğer ayakla Anterior/Posteromedial/Posterolateral yönlere maksimal uzanmayı ölç (cm).</div>
        <div><strong>Hedefle ilişkisi</strong><br>Denge ve sakatlık riskini değerlendirir. Çeviklik, patlayıcı kuvvet ve court/field sporları için kritik.</div>
      `
    }
  };

  function openHelp(key){
    const data = HELP[key]; if(!data) return;
    title.textContent = data.title;
    body.innerHTML = data.html;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden','false');
    // Basit odak
    overlay.querySelector('[data-close]').focus({preventScroll:true});
  }

  function closeHelp(){
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden','true');
  }

  // Click: "Nasıl?" butonları
  document.addEventListener('click', (e)=>{
    const helpBtn = e.target.closest('[data-help]');
    if(helpBtn){ e.preventDefault(); openHelp(helpBtn.getAttribute('data-help')); return; }

    // Kapatma: X butonu
    if(e.target.matches('[data-close]') || e.target.closest('[data-close]')){
      e.preventDefault(); closeHelp(); return;
    }

    // Kapatma: overlay dışına tık
    if(e.target === overlay){
      closeHelp(); return;
    }
  });

  // ESC ile kapat
  document.addEventListener('keydown',(e)=>{
    if(e.key === 'Escape' && overlay.classList.contains('show')) closeHelp();
  });

  // --- Örnek buton davranışları (yerine kendi kayıt/geri/çıkış logic'inizi ekleyin) ---
  byId('btnBack').addEventListener('click', ()=>{
    // dashboard'a dönüş
    window.location.href = "./dashboard.html";
  });
  byId('btnLogout').addEventListener('click', ()=>{
    // sadece örnek: giriş sayfasına dönüş
    window.location.href = "./index.html";
  });
  byId('btnSave').addEventListener('click', ()=>{
    const msg = byId('msg'); msg.className = "msg ok"; msg.textContent = "Kaydedildi ✔ (Demo)";
    setTimeout(()=>{ msg.textContent=""; }, 2000);
  });
})();
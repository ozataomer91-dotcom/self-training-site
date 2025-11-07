
// Test sözlüğü: her test için "desc" (kısa), "how" (nasıl yapılır), "why" (hedefle ilişkisi), "img" (gösterim)
window.TESTS = {
  HR: {
    title: "HRmax & HRR",
    desc: "220-yaş ve (HRmax - RHR). Dinlenik nabız ve yaş girince otomatik hesaplanır.",
    how: "<b>HRmax</b> = 220 - yaş. <b>HRR</b> = HRmax - RHR. Sabah uyanınca 60 sn nabzını say ve RHR olarak gir.",
    why: "Yoğunluk bölgelerini belirlemek ve kardiyoda doğru şiddeti ayarlamak için temel metriklerdir.",
    img: "hr_guide.png"
  },
  YBALANCE:{
    title: "Y-Balance",
    desc: "Tek ayak üzerinde 3 yöne uzanma mesafeleri (cm).",
    how: "Ayaklar çıplak/çorapla. Test edilen ayak yerde sabit; diğer ayakla öne, posteromedial ve posterolateral yönlere uzan. Çizgiyi aşmadan ve destek ayağı kaymadan en uzak noktayı işaretle.",
    why: "Alt ekstremite denge ve simetriyi ölçer. Sakatlık riskini ve performansı öngörmede kullanılır.",
    img:"y_balance.png"
  },
  TTEST:{
    title:"T-Test (Çeviklik)",
    desc:"İleri-yan-geri koşu ile yön değiştirme çevikliği.",
    how:"Dört koniyi T biçiminde diz (5-10 m aralık). Orta koniden öne koş, sağa yana sürat, sola geç, tekrar ortaya ve geriye sprint. Süreyi ölç.",
    why:"Tenis, futbol gibi sporlarda hızla yön değiştirme yeteneğini ölçer.",
    img:"t_test.png"
  },
  COOPER12:{
    title:"Cooper 12 dk",
    desc:"12 dakikada koşulan toplam mesafe (m).",
    how:"Isın, düz bir parkur seç. 12 dakika boyunca sürdürülebilir tempoda koş. Toplam metreyi gir.",
    why:"Aerobik dayanıklılık ve VO2max tahmini için yaygın bir alan testidir.",
    img:"cooper.png"
  },
  PUSHUPS60:{
    title:"Şınav 60 sn",
    desc:"60 saniyede tamamlanan doğru şınav sayısı.",
    how:"Dirsekler ~45°, gövde düz. Tam inip kalk. 60 sn sonunda toplamı yaz.",
    why:"Üst gövde kuvvet-dayanıklılığı ve başlangıç seviyesini takip etmek için pratik bir ölçüttür.",
    img:"pushups.png"
  },
  PLANK:{
    title:"Plank (sn)",
    desc:"Dirsek plank pozisyonunda dayanılan süre.",
    how:"Dirsekler omuz altında, karın-sırt sıkı. Çökmeden dayanabildiğin süreyi ölç.",
    why:"Core dayanıklılığı, bel-sağlığı ve postür gelişimi için yararlıdır.",
    img:"plank.png"
  },
  SITREACH:{
    title:"Otur-Uzan (cm)",
    desc:"Hamstring/esneme değerlendirmesi.",
    how:"Bacaklar düz, ayak tabanları kutuya/çizgiye dayanır. Dizleri bükmeden iki elinle öne uzan, en uzak noktayı işaretle.",
    why:"Esneklik kısıtları, bel ve alt ekstremite hareketliliği hakkında ipucu verir.",
    img:"sit_and_reach.png"
  },
  SQUAT60:{
    title:"Vücut Ağırlığı Squat 60 sn",
    desc:"60 saniyede tamamlanan squat sayısı.",
    how:"Topuklar yerde, kalça paralel altına gelmeli. Gövde dik. 60 sn içinde toplam tekrar say.",
    why:"Genel alt gövde dayanıklılığı ve fonksiyonel kapasite.",
    img:"squat.png"
  },
  SPRINT10:{
    title:"10 m Sprint (sn)",
    desc:"Düz hat 10 metre sprint süresi.",
    how:"Düz 10 m işaretle. Hazır ol komutuyla en hızlı çıkış ve bitişte kronometre durdur.",
    why:"İvmelenme ve saf sürat göstergesi; tenis/branş sporları için önemli.",
    img:"sprint10.png"
  }
};

// Hedef -> Test haritası
// En fazla 3 hedef seçimi varsayıldı.
window.GOAL_TO_TESTS = {
  "fatloss": ["HR","COOPER12","SQUAT60"],
  "muscle":  ["PUSHUPS60","SQUAT60","PLANK"],
  "endurance":["HR","COOPER12","SPRINT10"],
  "mobility": ["SITREACH","YBALANCE","PLANK"],
  "home":     ["PUSHUPS60","SQUAT60","PLANK"],
  "posture":  ["PLANK","SITREACH","YBALANCE"],
  "sport":    ["TTEST","YBALANCE","SPRINT10"]
};

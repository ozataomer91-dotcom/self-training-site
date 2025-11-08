
// Hedef → Test eşleşmeleri ve test açıklamaları (özet + nasıl + ilişki)
window.ST_TESTS = {
  tests: {
    "HRmax & HRR": {
      key: "hr",
      inputs: [
        {id:"age", label:"Yaş (yıl)", unit:"", hint:"Nüfus cüzdanındaki tam yıl."},
        {id:"rhr", label:"Dinlenik Nabız (RHR)", unit:"bpm", hint:"Sabah uyanınca 60 sn sayın."}
      ],
      how: "HRmax = 220 − yaş. HRR = HRmax − RHR. RHR için sabah uyanınca, oturur pozisyonda 60 saniye nabız sayın.",
      relation: "Şiddet bölgelerini ayarlamak için temel. Yağ yakımı, dayanıklılık ve HIIT programlarında zorunludur."
    },
    "Y-Balance": {
      key: "ybal",
      inputs: [
        {id:"ant", label:"Anterior (cm)"}, {id:"pm", label:"Posteromedial (cm)"}, {id:"pl", label:"Posterolateral (cm)"},
        {id:"leg", label:"Bacak boyu (cm)"}
      ],
      how: "Ayak 1 üzerinde dengeyi korurken üç yöne uzanarak en uzak mesafeleri ölç. Her denemeden en iyisini kaydet. Skor=(ant+pm+pl)/(3×bacak boyu)×100.",
      relation: "Denge, core ve alt ekstremite kontrolünü gösterir. Sakatlık önleme, branş sporu ve fonksiyonel hedeflerle ilişkilidir."
    },
    "5‑10 m Sprint":{
      key:"sprint",
      inputs:[{id:"t5",label:"5 m (sn)"},{id:"t10",label:"10 m (sn)"}],
      how:"Düz bir parkurda tam dinlenik başlangıçla koş. İki denemenin en iyisini yaz.",
      relation:"Sürat/çeviklik, branş sporu ve HIIT hedeflerine zemin sağlar."
    },
    "Flamingo Denge":{
      key:"flam",
      inputs:[{id:"fl",label:"Hata sayısı (1 dk)"}],
      how:"Bir ayak üzerinde denge. Dengeyi kaybetme/yardım alma her sefer 'hata'. 1 dakikada toplam hata.",
      relation:"Denge ve propriosepsiyon. Sakatlık sonrası dönüş ve core stabilite ile bağlantılı."
    },
    "1RM Tahmini (10RM)":{
      key:"rm",
      inputs:[{id:"load",label:"Kaldırılan ağırlık (kg)"},{id:"reps",label:"Tekrar sayısı"}],
      how:"Epley: 1RM ≈ yük × (1 + tekrar/30). 8‑12 tekrar aralığında ölç.",
      relation:"Kas kazanımı/kuvvet ve program periodizasyonu için başlangıç yüklerini belirler."
    },
    "Çeviklik T‑Test":{
      key:"ttest",
      inputs:[{id:"tt",label:"Süre (sn)"}],
      how:"T şeklinde dört koni yerleşimi. A‑B sprint, sağ‑sol slalom, geri koşu ile A’ya dönüş; toplam süre.",
      relation:"Branş sporu, çeviklik ve HIIT hedeflerinde ilerlemeyi gösterir."
    }
  },
  goalToTests: {
    "Yağ Yakımı / Kilo Verme":["HRmax & HRR","Y-Balance"],
    "Kas Kazanımı / Kuvvet":["1RM Tahmini (10RM)","Y-Balance"],
    "Dayanıklılık / Koşu":["HRmax & HRR","5‑10 m Sprint"],
    "Esneklik / Mobilite":["Y-Balance","Flamingo Denge"],
    "Evde Ekipmansız":["HRmax & HRR","Y-Balance"],
    "Duruş / Core":["Y-Balance","Flamingo Denge"],
    "Fonksiyonel Fitness / HIIT":["HRmax & HRR","Çeviklik T‑Test"],
    "Sürat / Çeviklik":["5‑10 m Sprint","Çeviklik T‑Test"],
    "Branş Sporu (tenis/yüzme)":["Y-Balance","5‑10 m Sprint","Çeviklik T‑Test"]
  }
};

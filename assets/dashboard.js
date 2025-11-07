
import { $, $$, toast, save, load, go } from './util.js';

const GOALS = [
 "Yağ yakımı", "Kilo alma", "Kas kazanımı", "Kuvvet artışı",
 "Koşu performansı", "Fonksiyonel antrenman", "Tenis", "Yüzme",
 "Evde ekipmansız", "Sağlıklı kalma", "Esneklik", "Denge", "Sürat", "Çeviklik"
];

const chips = $("#goalChips");
const sel = new Set(load('goals', []));
GOALS.forEach(g=>{
  const b = document.createElement('button');
  b.className = 'chip'+(sel.has(g)?' active':'');
  b.textContent = g;
  b.onclick = ()=>{
    if(sel.has(g)){ sel.delete(g); b.classList.remove('active'); return; }
    if(sel.size>=3){ toast('En fazla 3 hedef seçebilirsin'); return; }
    sel.add(g); b.classList.add('active');
  };
  chips.appendChild(b);
});

$("#btnNext").onclick = ()=>{
  const goals = Array.from(sel);
  save('goals', goals);
  save('health', $("#health").value.trim());
  save('level', $("#level").value);
  if(goals.length===0){ toast("En az 1 hedef seç."); return; }
  go("./metrics.html");
};
$("#btnBack").onclick = ()=> history.back();
$("#btnLogout").onclick = ()=> go("./index.html");

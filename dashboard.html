<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Self Training • Panel / Hedef & Bilgi</title>
  <style>
    :root{--bg:#f6f7fb;--card:#fff;--pri:#1f55ff;--ok:#237a3b;--err:#c62828}
    *{box-sizing:border-box}
    body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:var(--bg)}
    .wrap{min-height:100dvh;display:grid;place-items:center;padding:22px}
    .card{width:100%;max-width:880px;background:var(--card);border-radius:16px;
          box-shadow:0 8px 28px rgba(0,0,0,.08);padding:22px 22px 28px}
    h1{margin:0 0 4px}
    .sub{color:#6b7084;margin:0 0 14px;font-size:14px}
    fieldset{border:1px solid #e2e6f3;border-radius:12px;margin:14px 0;padding:14px}
    legend{font-weight:600;color:#243b80;padding:0 6px}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
    .chip{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid #cfd4e3;border-radius:10px;background:#fff;cursor:pointer}
    .chip input{accent-color:#1f55ff;transform:scale(1.2)}
    .row{display:flex;gap:12px;flex-wrap:wrap}
    label{font-size:13px;color:#4a4f63}
    input[type="number"], input[type="text"]{height:40px;border:1px solid #cfd4e3;border-radius:10px;padding:0 12px;font-size:15px;background:#fff;width:100%}
    .col{flex:1 1 160px;min-width:160px}
    .msg{min-height:22px;margin-top:10px;font-size:14px}
    .ok{color:var(--ok)} .err{color:var(--err)}
    .btn{height:44px;border:none;background:var(--pri);color:#fff;border-radius:10px;font-weight:600;cursor:pointer;padding:0 18px}
    .topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
    .muted{color:#6b7084;font-size:13px}
    .footerActions{display:flex;justify-content:flex-end;margin-top:16px}
    .zones{width:100%;border-collapse:collapse;margin-top:8px;font-size:14px}
    .zones th,.zones td{border:1px solid #e2e6f3;padding:8px;text-align:left}
    .zones th{background:#f3f5ff}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="topbar">
        <div>
          <h1>Self Training</h1>
          <p class="sub" id="hello">Yükleniyor…</p>
        </div>
        <div class="row">
          <button id="btnLogout" class="btn" style="background:#444">Çıkış</button>
        </div>
      </div>

      <fieldset>
        <legend>Hedefini Seç (en fazla 3)</legend>
        <div class="grid" id="goalsBox"></div>
        <p class="muted">En fazla 3 hedef seçebilirsin. Seçimler antrenman önerilerini kişiselleştirir.</p>
      </fieldset>

      <fieldset>
        <legend>Sağlık / Sakatlık</legend>
        <div class="grid" id="healthBox"></div>
        <div class="row" style="margin-top:10px">
          <div class="col">
            <label for="notes">Ek bilgi (opsiyonel)</label>
            <input id="notes" type="text" placeholder="Örn: Sağ diz ACL öyküsü, bel fıtığı, doktor onayı var…">
          </div>
        </div>
        <p class="muted">Not: Ciddi rahatsızlıklarda mutlaka doktor onayı ile ilerleyin.</p>
      </fieldset>

      <fieldset>
        <legend>Spor Geçmişi & Seviye</legend>
        <div class="grid" id="sportsBox"></div>
        <div class="row" style="margin-top:10px">
          <div class="col">
            <label for="level">Seviye</label>
            <select id="level" style="height:40px;border:1px solid #cfd4e3;border-radius:10px;padding:0 10px">
              <option value="">Seçiniz</option>
              <option>Başlangıç</option>
              <option>Orta</option>
              <option>İleri</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Ölçümler</legend>
        <div class="row">
          <div class="col"><label>Yaş (yıl)</label><input id="ageYears" type="number" step="1" min="5" max="100" placeholder="Örn: 22"></div>
          <div class="col"><label>Dinlenik Nabız (BPM)</label><input id="restHr" type="number" step="1" placeholder="Sabah uyanınca ölç"></div>
          <div class="col"><label>Boy (cm)</label><input id="heightCm" type="number" step="0.1" placeholder="Örn: 178"></div>
          <div class="col"><label>Kilo (kg)</label><input id="weightKg" type="number" step="0.1" placeholder="Örn: 74.5"></div>
          <div class="col"><label>Bel (cm)</label><input id="waistCm" type="number" step="0.1" placeholder="Göbek deliği hizası"></div>
          <div class="col"><label>Kalça (cm)</label><input id="hipCm" type="number" step="0.1" placeholder="Kalçanın en geniş yeri"></div>
          <div class="col"><label>Boyun (cm)</label><input id="neckCm" type="number" step="0.1" placeholder="Adem elması altı"></div>
        </div>
        <p class="muted" style="margin-top:8px">Nabız rehberi: <b>HRmax = 220 − yaş</b>; <b>HRR = HRmax − Dinlenik Nabız</b>.</p>

        <div id="hrBox">
          <p id="hrSummary" class="muted">HRmax ve bölgeler için yaş & dinlenik nabız gir.</p>
          <table class="zones" id="zonesTable" style="display:none">
            <thead><tr><th>Bölge</th><th>Aralık (BPM)</th><th>Açıklama</th></tr></thead>
            <tbody id="zonesBody"></tbody>
          </table>
        </div>
      </fieldset>

      <div class="footerActions">
        <button id="btnSave" class="btn">Kaydet</button>
      </div>

      <div id="globalMsg" class="msg"></div>
    </div>
  </div>

  <!-- Firebase compat -->
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>

  <!-- Proje config ve sayfa JS -->
  <script src="./config.js?v=22"></script>
  <script src="./dashboard.js?v=2"></script>
</body>
</html>

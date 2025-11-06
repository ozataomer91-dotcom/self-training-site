<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Self Training - Kayıt / Giriş</title>

  <style>
    /* Basit ve temiz stil, istersen değiştirebilirsin */
    body{font-family:Arial,Helvetica,sans-serif;background:#f5f7fb;margin:0;padding:40px;display:flex;justify-content:center}
    .card{width:380px;background:#fff;padding:22px;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,.08)}
    h2{margin:0 0 12px;font-size:20px}
    .tabs{display:flex;gap:10px;margin-bottom:14px}
    .tab{flex:1;padding:8px;border-radius:8px;text-align:center;cursor:pointer;background:#eef2ff}
    .tab.active{background:#2d6cdf;color:#fff}
    label{display:block;margin-top:8px;font-size:13px}
    input{width:100%;padding:10px;margin-top:6px;border:1px solid #ddd;border-radius:8px;box-sizing:border-box}
    .btn{display:block;width:100%;padding:10px;margin-top:14px;border:none;border-radius:8px;background:#2d6cdf;color:#fff;cursor:pointer}
    .link{display:block;text-align:center;margin-top:10px;color:#333;text-decoration:underline;cursor:pointer;font-size:13px}
    .msg{margin-top:10px;font-size:13px;color:#b00}
    .hint{font-size:12px;color:#666;margin-top:6px}
  </style>
</head>
<body>
  <div class="card">
    <h2>Self Training</h2>

    <div class="tabs">
      <div id="tabLogin" class="tab active">Giriş</div>
      <div id="tabSignup" class="tab">Kayıt</div>
    </div>

    <!-- GİRİŞ -->
    <div id="loginView">
      <label>E-posta</label>
      <input id="loginEmail" type="email" placeholder="mail@ornek.com" />

      <label>Şifre</label>
      <input id="loginPassword" type="password" placeholder="Şifreniz" />

      <button id="btnLogin" class="btn">Giriş Yap</button>
      <div id="forgot" class="link">Şifremi Unuttum</div>
      <div id="loginMsg" class="msg"></div>
    </div>

    <!-- KAYIT -->
    <div id="signupView" style="display:none">
      <label>Ad Soyad</label>
      <input id="signupName" type="text" placeholder="Ad Soyad" />

      <label>E-posta</label>
      <input id="signupEmail" type="email" placeholder="mail@ornek.com" />

      <label>Şifre</label>
      <input id="signupPassword" type="password" placeholder="En az 6 karakter" />

      <button id="btnSignup" class="btn">Kayıt Ol</button>
      <div class="hint">Kayıt sonrası doğrulama e-postası gönderilecektir. (Spam klasörünü kontrol edin)</div>
      <div id="signupMsg" class="msg"></div>
    </div>

    <div id="globalMsg" class="msg"></div>
  </div>

  <!-- Firebase (modüler) -->
  <script type="module" src="signup.js"></script>
</body>
</html>

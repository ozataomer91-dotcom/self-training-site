<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Kayıt / Giriş • Self Training</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f6f7fb;margin:0}
    .card{max-width:560px;margin:48px auto;padding:24px;border-radius:16px;background:#fff;
          box-shadow:0 10px 30px rgba(0,0,0,.06)}
    .tabs{display:flex;gap:8px;margin-bottom:16px}
    .tab{flex:1;padding:10px 12px;border-radius:10px;border:1px solid #e6e8ef;background:#f1f4fb;
         cursor:pointer;text-align:center;font-weight:600}
    .tab.active{background:#1f4cff;color:#fff;border-color:#1f4cff}
    .row{display:flex;flex-direction:column;gap:6px;margin:10px 0}
    input{padding:12px;border:1px solid #dfe3ee;border-radius:10px;font-size:15px}
    button{padding:12px 14px;border:0;border-radius:10px;background:#1f4cff;color:#fff;
           font-weight:700;cursor:pointer}
    .link{color:#1f4cff;text-decoration:none;font-weight:600;font-size:14px}
    .muted{color:#6b7280;font-size:13px}
    #msg{margin-top:10px;font-size:14px}
    .ok{color:#0a7a3f} .err{color:#c62828}
  </style>
</head>
<body>
  <div class="card">
    <h2>Self Training</h2>

    <div class="tabs">
      <button id="tabLogin"  class="tab active">Giriş</button>
      <button id="tabSignup" class="tab">Kayıt</button>
    </div>

    <!-- Giriş -->
    <div id="loginView">
      <p class="muted">Girişte yalnızca e-posta ve şifre gerekir.</p>
      <div class="row">
        <label>E-posta</label>
        <input id="loginEmail" type="email" autocomplete="email" required />
      </div>
      <div class="row">
        <label>Şifre</label>
        <input id="loginPassword" type="password" autocomplete="current-password" required />
      </div>
      <button id="btnLogin">Giriş Yap</button>
      <p><a id="btnForgot" class="link" href="#">Şifremi Unuttum</a></p>
    </div>

    <!-- Kayıt -->
    <div id="signupView" style="display:none">
      <div class="row">
        <label>Ad Soyad</label>
        <input id="signupName" type="text" autocomplete="name" required />
      </div>
      <div class="row">
        <label>E-posta</label>
        <input id="signupEmail" type="email" autocomplete="email" required />
      </div>
      <div class="row">
        <label>Şifre</label>
        <input id="signupPassword" type="password" autocomplete="new-password" required />
      </div>
      <div class="row">
        <label>Şifre (tekrar)</label>
        <input id="signupPassword2" type="password" autocomplete="new-password" required />
      </div>
      <button id="btnSignup">Kayıt Ol</button>
      <p class="muted">Kayıttan sonra e-posta doğrulaması zorunludur.</p>
    </div>

    <div id="msg"></div>
  </div>

  <script type="module" src="./signup.js"></script>
</body>
</html>

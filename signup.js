(function(){
  console.log('[signup.js] yüklendi');

  const $ = window._q, $$ = window._qa;

  function bindTabs(){
    const tabLogin = $('#tabLogin');
    const tabSignup = $('#tabSignup');
    const loginView = $('#loginView');
    const signupView = $('#signupView');

    if(!tabLogin || !tabSignup) return;

    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active'); tabSignup.classList.remove('active');
      loginView.classList.remove('hide'); signupView.classList.add('hide');
      setMsg('');
    });

    tabSignup.addEventListener('click', () => {
      tabSignup.classList.add('active'); tabLogin.classList.remove('active');
      signupView.classList.remove('hide'); loginView.classList.add('hide');
      setMsg('');
    });
  }

  function bindAuth(){
    const loginBtn  = $('#btnLogin');
    const forgotBtn = $('#btnForgot');
    const suBtn     = $('#btnSignup');

    if(loginBtn){
      loginBtn.addEventListener('click', async () => {
        const email = $('#loginEmail').value.trim();
        const pass  = $('#loginPassword').value.trim();
        const fb = ensureFirebase();
        if(!fb.ok){ setMsg('config.js içindeki Firebase alanlarını doldur. (apiKey/authDomain/projectId vb.)', 'err'); return; }
        try{
          setMsg('Giriş yapılıyor...');
          await firebase.auth().signInWithEmailAndPassword(email, pass);
          setMsg('Giriş başarılı!', 'ok');
          // yönlendir
          window.location.href = 'dashboard.html?v=104';
        }catch(e){
          setMsg('Giriş başarısız: ' + (e.message || e.code), 'err');
          console.warn('[login] hata:', e);
        }
      });
    }

    if(forgotBtn){
      forgotBtn.addEventListener('click', async () => {
        const email = $('#loginEmail').value.trim();
        const fb = ensureFirebase();
        if(!fb.ok){ setMsg('config.js eksik olduğu için şifre sıfırlama devre dışı.', 'err'); return; }
        try{
          await firebase.auth().sendPasswordResetEmail(email);
          setMsg('Sıfırlama bağlantısı e‑posta adresine gönderildi.', 'ok');
        }catch(e){
          setMsg('Gönderilemedi: ' + (e.message || e.code), 'err');
        }
      });
    }

    if(suBtn){
      suBtn.addEventListener('click', async () => {
        const email = $('#signupEmail').value.trim();
        const pass  = $('#signupPassword').value.trim();
        const fb = ensureFirebase();
        if(!fb.ok){ setMsg('config.js eksik. Kayıt devre dışı.', 'err'); return; }
        try{
          setMsg('Kayıt oluşturuluyor...');
          await firebase.auth().createUserWithEmailAndPassword(email, pass);
          setMsg('Kayıt başarılı! Giriş yapabilirsiniz.', 'ok');
          $('#tabLogin').click();
        }catch(e){
          setMsg('Kayıt başarısız: ' + (e.message || e.code), 'err');
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    console.log('[signup] hazır');
    bindTabs();
    bindAuth();
    // İlk yükte login sekmesi açık kalsın
    setMsg('');
  });
})();

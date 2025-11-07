Self Training • Onboarding (dashboard)
=================================

Bu paket iki yeni dosya içerir:
- dashboard.html
- dashboard.js

Nereye koyacağım?
-----------------
GitHub reposunda: ozataomer91-dotcom.github.io/self-training-site/ klasörünün içine ekleyin.

Nasıl çalışır?
--------------
1) Kullanıcı giriş yaptıktan sonra signup.js zaten dashboard.html'e yönlendiriyorsa direkt açılır.
   (Eğer yönlendirme başka sayfaya gidiyorsa signup.js içindeki redirect'i './dashboard.html' yapın.)
2) dashboard.html içinde Firebase app, auth ve firestore (compat) scriptleri yüklüdür.
3) Kullanıcı hedeflerini (en fazla 3), sağlık/sakatlık, spor geçmişi, seviye ve ölçümlerini girer.
4) 'Kaydet' tıklanınca önce Firestore'a yazmayı dener; başarısız olursa localStorage'a yedekler.
   Firestore yoksa da otomatik olarak localStorage kullanılır.

Önemli Notlar
-------------
- Firestore'u kullanmak istiyorsanız Firebase Console -> Firestore Database -> Create database yapın.
- Güvenlik kuralları: test için (sadece geliştirme):
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
  (Canlıda daha sıkı kurallar uygulayın.)
- config.js içindeki window.firebaseConfig değerleri sizin projenize ait olmalı.

Sorun olursa
------------
- Console'da kırmızı hata görürseniz satır numarasıyla birlikte kontrol edin.
- 'firebase is not defined' hatası alırsanız script sıralamasını kontrol edin.

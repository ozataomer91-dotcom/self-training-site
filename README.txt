SELF TRAINING — iki aşamalı akış (v20251107_2213)

Klasör: self-training-site/

1) Dosyaları GitHub repo köküne yükle (self-training-site klasörü olarak).
2) Kendi config.js dosyanı KORU. Bu pakette config.sample.js var; istersen bakıp kıyasla.
3) Çalışma sırası:
   - /self-training-site/signup.html → giriş/kayıt (mail doğrulaması SADECE kayıt anında)
   - /self-training-site/dashboard.html → Hedef & Bilgi (max 3 hedef, spor geçmişi, seviye, sakatlık)
   - /self-training-site/metrics.html → Ölçümler (Yaş + RHR → HRmax/HRR, hedefe göre testler, 'Nasıl?' açıklamaları)
4) Kaydet: önce localStorage, Firestore açıksa buluta da yazar.
5) Buton stabilitesi için script'ler body sonunda ve bağıl yollarla eklendi.

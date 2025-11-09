Kendi Kendine Eğitim – web demeti
=================================
Bu klasörü GitHub Pages için yükleyin.

ZORUNLU 1: 'yapilandirma.js' içindeki Firebase bilgilerini kendi projenizle değiştirin.
ZORUNLU 2: Tüm dosyalar aynı klasörde kalmalı (self-training-site).

Akış:
- signup.html → e‑posta/şifre ile giriş
- kayit.html  → yeni kullanıcı kaydı
- dashboard.html → örnek panel; 'Çıkış Yap' düğmesi var

Sıra:
<link  href="icerik.css">
<script src="firebase-app-compat.js">
<script src="firebase-auth-compat.js">
<script src="yapilandirma.js">
<script src="signup.js">

Test (F12 Console):
!!window.firebase
typeof firebase.initializeApp
firebase.apps.length
!!window.auth

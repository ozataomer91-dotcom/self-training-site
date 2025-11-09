Self-Training – minimal starter (GitHub Pages + Firebase Auth)

STEP-BY-STEP (do this EXACTLY):
1) Create/choose a Firebase project. Enable Authentication -> Sign-in method -> Email/Password (ENABLED).
2) In Project settings -> Your apps (</>) -> Copy web app config. Paste into /config.js in window.firebaseConfig.
3) Upload ALL files in this folder to your repository root (NOT inside another subfolder).
4) On GitHub -> Settings -> Pages -> Source = 'Deploy from a branch', Branch = main (or master), Folder = / (root).
5) Visit https://<your-username>.github.io/<your-repo>/index.html
6) Open DevTools Console and verify:
   - !!window.firebase -> true
   - typeof firebase.initializeApp -> "function"
   - firebase.apps.length -> 1
   - !!window.$auth -> true

If login/signup doesn't respond:
- Check Console for 404s (wrong file paths). Ensure <script src="./config.js"> etc. exist in the SAME folder.
- Make sure you pasted the correct firebaseConfig and enabled Email/Password in Firebase console.
- GitHub Pages cache: Hard refresh (Ctrl+F5).

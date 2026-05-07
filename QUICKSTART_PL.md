# 🚀 SZYBKI START - WDROŻENIE NA CLOUDFLARE

## ⚡ TL;DR - Najkrótszy Przewodnik

### Opcja 1: Cloudflare Dashboard (5 minut)

1. **Idź na:** https://dash.cloudflare.com/pages
2. **Kliknij:** "Create a project"
3. **Wybierz:** "Connect to Git" → GitHub → Ten repozytorium
4. **Ustaw:**
   - Build command: `npm run build`
   - Output directory: `dist`
5. **Kliknij:** "Save and Deploy"
6. **Gotowe!** URL: `https://jimbo-devassist-hub.pages.dev`

### Opcja 2: Terminal (3 minuty)

```bash
# Zainstaluj Wrangler
npm install -g wrangler

# Zaloguj się
wrangler login

# Zbuduj
npm run build

# Wdróż
wrangler pages deploy dist --project-name=jimbo-devassist-hub
```

### Opcja 3: GitHub Actions (Automatyczne)

1. W GitHub → Settings → Secrets → Actions
2. Dodaj sekret: `CLOUDFLARE_API_TOKEN`
3. Dodaj sekret: `CLOUDFLARE_ACCOUNT_ID`
4. Push do `main` → Auto-deploy! ✨

**Jak uzyskać tokeny?** Zobacz: [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)

---

## ✅ Co Działa w Wersji Web

✅ Blog (localStorage)  
✅ Edytor kodu (Monaco)  
✅ AI Assistant  
✅ Dashboard  
✅ Wszystko poza Terminalem

---

## 📚 Pełna Dokumentacja

- **Polski:** [CLOUDFLARE_DEPLOYMENT_PL.md](CLOUDFLARE_DEPLOYMENT_PL.md)
- **English:** [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)
- **GitHub Actions:** [GITHUB_ACTIONS_SETUP.md](GITHUB_ACTIONS_SETUP.md)
- **Podsumowanie:** [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)

---

## 🆘 Problem?

1. Sprawdź logi w Cloudflare Dashboard
2. Uruchom lokalnie: `npm run build && npm run preview`
3. Zobacz dokumentację powyżej
4. Otwórz issue na GitHub

---

**Twoja aplikacja będzie pod:** `https://jimbo-devassist-hub.pages.dev` 🎉

# Faym & Lehlah frontend leaked — rebuilt from public source map

## 🎯 Targets

### Faym (creator platform)

* https://faym.co
* https://www.faym.co
* https://deals.faym.co *(production frontend)*
* https://backend.faym.co *(production API)*

### Lehlah (creator platform)

* https://app.lehlah.club
* https://creator.lehlah.club

### Wishlink (creator platform)
* https://creator.wishlink.com

---

Vulnerability testing was performed on **both stacks** listed above.

📄 Full write-up for Lehlah (XSS + same-site CSRF):
[lehlah-xss-report.md](https://github.com/karan-verma-x/faym-webapp-leaked/blob/master/lehlah-xss-report.md)

---

## 🛠 Build

```sh
npm i
npm start
```

---

## 🚀 Local run & security note

Once the project is running locally, authentication tokens can be retrieved from the application.

These tokens may allow **authorized API requests** to:

* https://backend.faym.co

If backend validation is weak or misconfigured, this may lead to:

* Privilege escalation
* Unauthorized access to admin-level roles

This indicates a **serious security vulnerability** that should be addressed immediately.

---

## 📦 What was recovered

**Total recovered application size:** `593,277 bytes`

```
src/
├── App.tsx
├── DataModels/
│   └── countryCode.ts
├── components/
│   ├── CommonComponents/   (Navbar, Footer, ContactUs, dropdown)
│   ├── brands/             (12 components — TopSection, PopUpForm, …)
│   ├── caseStudies/        (5 components)
│   ├── creators/           (15 components incl. CreatorInstaForm.jsx)
│   └── t&c/TermsAndConditions.tsx
├── faymDeals/
│   ├── components/         (bigProductCard, smallProductCard, …)
│   ├── pages/root/
│   └── sections/           (heroSection, brandsOfTheDay, …)
├── pages/
│   ├── AllCaseStudiesPage.tsx
│   ├── BrandCaseStudiesPage.tsx
│   ├── BrandsPage.tsx
│   ├── CreatorPage.tsx
│   ├── FaqsPage.tsx
│   └── TermsAndConditionPage.tsx
├── service/
│   ├── cypher.ts          # ← contains the leaked-key signing flow (F-01)
│   └── utils.ts           # ← contains the static bearer flow (F-02)
├── reportWebVitals.tsx
└── index.tsx
```

---

⚠️ **Responsible disclosure recommended** before any public exposure.

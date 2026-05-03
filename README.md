# Faym frontend leaked — rebuilt from public source map

This tree is the original Faym CRA project leaked **reconstructed** 

**Targets — Faym:** `https://faym.co`, `https://www.faym.co`, `https://deals.faym.co` (production frontend) and `https://backend.faym.co` (production API)  
**Targets — Lehlah:** `https://app.lehlah.club`, `https://creator.lehlah.club`

Vulnerability testing was performed on **both** stacks above. Full write-up for Lehlah (XSS + same-site CSRF): [lehlah-xss-report.md](lehlah-xss-report.md).

---

## What was recovered

Total recovered application bytes: **593,277**.

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

## Build

```sh
npm i
npm start
```

## Local run

Once the project is running locally, you can retrieve authentication tokens from the application. These tokens can then be used to make authorized API requests. In some cases, improper validation or misconfiguration may allow privilege escalation. This could enable access with admin-level roles without proper authorization checks. Such behavior highlights a potential security vulnerability that should be addressed.
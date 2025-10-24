# AWS Amplify Web Port — Gen 2 CI/CD Ready

## Quickstart (local)
```bash
npm i
npm run dev
```

## Setup Amplify Gen 2 (code-first)
```bash
npm create amplify@latest .
# pilih React, lanjutkan prompt sampai selesai
```

## Deploy via Amplify Hosting (GitHub)
1. Commit & push repo ini ke GitHub.
2. AWS Console → Amplify → Host web app → sambungkan repo & branch.
3. Amplify akan menjalankan `amplify.yml`:
   - Backend: `npx ampx pipeline-deploy`
   - Frontend: `npm run build` → artifact `dist/`

## Note
- `src/amplifyClient.js` aman walau `amplify_outputs.json` belum ada (build pertama). Setelah backend publish, file akan tersedia otomatis dan Auth aktif.

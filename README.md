# React + TypeScript + Vite

## Google sign-in setup

The app uses Google Identity Services to sign users in directly and then exchanges Google's ID token for a Supabase session. This keeps the Supabase project hostname out of Google's account chooser.

1. In Google Auth Platform, open the same Web OAuth client configured in Supabase.
2. Add every app origin (for example, `https://your-domain.com` and `http://localhost:5173`) under **Authorized JavaScript origins**.
3. Configure the app name, logo, homepage, privacy policy, and terms under **Branding**, then publish/verify the app as appropriate.
4. Copy the public Web client ID into `VITE_GOOGLE_CLIENT_ID` locally and in the Vercel project's environment variables, then redeploy.

The Google client ID is public browser configuration; never expose the Google client secret. If `VITE_GOOGLE_CLIENT_ID` is absent or Google's script cannot load, the app temporarily falls back to Supabase's redirect flow.

## Order review email setup

Payment acceptance and rejection emails are sent by the `review-payment-slip` Supabase Edge Function through Resend. Verify the sending domain in Resend, then configure and deploy the function:

```powershell
npx supabase secrets set RESEND_API_KEY=re_your_key ORDER_EMAIL_FROM="Codewave Studio <orders@codewave.studio.tech>" ORDER_REPLY_TO=codewave.studio.tech@gmail.com SITE_URL=https://codewave.studio.tech
npx supabase functions deploy review-payment-slip
```

These values are server secrets. Do not add `RESEND_API_KEY` to Vercel or expose it with a `VITE_` prefix.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

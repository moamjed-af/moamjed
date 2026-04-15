# Mo Amjed Website — Final Setup (30 minutes total)

## ✅ Already Done
- Site is LIVE at: https://moamjed-af.github.io/moamjed/
- Full source code on GitHub: https://github.com/moamjed-af/moamjed
- Auto-deploys on every push to main
- WhatsApp +971 54 424 5800 wired in everywhere
- Lead scoring (HOT/WARM/NURTURE) with routing logic
- Cookie banner + Privacy Policy + Terms + Cookie Policy
- Full SEO: sitemap, robots.txt, structured data for Google

---

## 1. EmailJS — Email Notifications (10 min, FREE)
**Site:** https://dashboard.emailjs.com/sign-up

### Steps:
1. Sign up with your email
2. **Add Email Service** → choose Gmail → connect your Gmail account
3. **Email Templates** → Create Template → name it "Lead Notification"
   - Copy-paste from: `setup/emailjs-notification-template.html`
   - Subject: `{{score}} New Lead: {{client_name}} ({{budget}})`
   - Save → copy the **Template ID** (e.g. `template_abc123`)
4. Create another template → name it "Thank You"
   - Copy-paste from: `setup/emailjs-thankyou-template.html`
   - Subject: `Thanks {{to_name}} — Your Dubai Investment Enquiry 🏙️`
   - Save → copy the **Template ID**
5. **Account** → copy your **Public Key**
6. Go to GitHub → moamjed repo → **Settings → Secrets → Actions** → add:

| Secret Name | Value |
|-------------|-------|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | from EmailJS → Email Services |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | from EmailJS → Account |
| `NEXT_PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE_ID` | Lead Notification template ID |
| `NEXT_PUBLIC_EMAILJS_THANKYOU_TEMPLATE_ID` | Thank You template ID |
| `NEXT_PUBLIC_NOTIFICATION_EMAIL` | your email address |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | 971544245800 |

---

## 2. Supabase — Lead Storage (5 min, FREE)
**Site:** https://supabase.com/dashboard

### Steps:
1. Sign up → New Project → name: `moamjed` → choose region: Middle East (or EU)
2. Wait ~2 min for project to be ready
3. **SQL Editor** → New Query → paste contents of `setup/supabase-schema.sql` → Run
4. **Settings → API** → copy:
   - Project URL (e.g. `https://xxxx.supabase.co`)
   - `anon` public key
5. Add to GitHub Secrets:

| Secret Name | Value |
|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |

---

## 3. Custom Domain (5 min — only if you own moamjed.com)
1. GitHub → moamjed repo → **Settings → Pages**
2. Under "Custom domain" → type `moamjed.com` → Save
3. At your domain registrar (GoDaddy/Namecheap etc) add a CNAME:
   - Name: `www`  →  Value: `moamjed-af.github.io`
   - Or for apex domain, add 4 A records pointing to GitHub IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

---

## 4. After Adding Secrets → Redeploy
After adding all secrets in GitHub:
1. Go to repo → **Actions** tab → select "Deploy to GitHub Pages" → **Run workflow**
2. Site rebuilds with all env vars baked in (~2 min)

---

## 5. Calendly (for strategy call booking)
1. Sign up at https://calendly.com
2. Create event: "Dubai Investment Strategy Call" (30 min)
3. Copy your booking URL (e.g. `https://calendly.com/mo-amjed/strategy-call`)
4. Add to GitHub Secrets: `NEXT_PUBLIC_CALENDLY_URL` = your URL

# Meridian Logistics website

Next.js App Router website with an authenticated Supabase CMS and signed Cloudinary media uploads.

## Local setup

1. Install Node.js 22+ and pnpm 10.
2. Copy `.env.example` to `.env.local` (the workspace already has a blank local template).
3. Add your Supabase Project URL and publishable key, plus your Cloudinary cloud name, API key, and API secret.
4. Run `pnpm install` and `pnpm dev`.
5. Apply the migrations and seed described below before using `/admin`.

The app uses the Supabase publishable key with the signed-in user's SSR session. CMS mutations are checked in the API and again by Postgres RLS. A service-role key is intentionally not used by the application. Never expose one in a `NEXT_PUBLIC_` variable.

The PostgreSQL pooler URI is a separate server-side database connection for tools such as `psql` or Supabase CLI. It does not configure the website's Supabase Auth/Data API client. Keep it out of browser-facing variables and do not commit the database password. Rotate a password immediately if it has been shared in chat or source control.

## Supabase setup

1. Create a Supabase project. Copy Project URL and publishable key from **Project Settings → API** into `.env.local`.
2. In the Supabase SQL editor, run `supabase/complete_setup.sql`. It creates the base tables and CMS schema in the required order and is safe to rerun after a partial attempt. Alternatively, run `supabase/migrations/202610230001_initial_schema.sql` first, then `supabase/migrations/202610260001_admin_cms.sql`.
3. Run `supabase/seed.sql` to add the starter Services, Industries, and Insights records. The seed records are marked published, so edit or unpublish them in the CMS before production if they are not approved company content.
4. In **Authentication → Users**, create an administrator account. Public sign-up is not implemented.
5. Grant that existing user the CMS role in the SQL editor, replacing the email:

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin'
   from auth.users
   where lower(email) = lower('admin@example.com')
   on conflict (user_id) do update set role = excluded.role;
   ```

6. Visit `/admin/login` and sign in with that Supabase Auth account.

The CMS role lives in `public.user_roles`; staff cannot grant themselves a role. Content, media, site settings, and enquiries have admin-only write/read policies. Anonymous visitors can only read published content, assigned site media, and public settings. Quote and contact submissions remain private.

## CMS features

- `/admin/site-copy`: edit the homepage headline and copy saved in `public.site_settings`.
- `/admin/content/services`, `/admin/content/industries`, `/admin/content/articles`: create, update, publish, unpublish, and delete records. Extended structured fields are edited as JSON.
- `/admin/media`: upload images and hero videos, select assets for supported page slots, and remove unused Cloudinary assets.
- `/admin/inquiries`: review quote/contact submissions and update their status.

Public service, industry, and insight pages use published Supabase records only. The site has no local copy of seed records: if Supabase is unavailable or a collection has no published records, it shows an unavailable/empty state instead of development content. Homepage CMS copy and media also have no hardcoded content or image fallback; configure them in the CMS before launch.

The media slots currently wired to the site are `home.hero`, `home.hero-poster`, `home.about-main`, `home.about-side`, `home.about-person`, `home.cta`, and the `page.*.hero` slots shown in the media manager. Service, industry, and article images are edited on each content record.

## Cloudinary uploads

The admin asks a server API route for a short-lived signed upload. The browser sends the file directly to Cloudinary, and the application stores `secure_url`, `public_id`, and media metadata in Supabase. `CLOUDINARY_API_SECRET` is server-only. The UI accepts JPEG, PNG, WebP, and AVIF images up to 10 MB and MP4, WebM, and MOV video up to 100 MB; account limits may be lower. Compress hero videos before upload. Delivery URLs add `f_auto,q_auto`.

## Routes

- `/`, `/about`, `/services`, `/services/[slug]`
- `/industries`, `/industries/[slug]`, `/global-network`
- `/insights`, `/insights/[slug]`, `/contact`, `/request-a-quote`
- `/privacy-policy`, `/terms`, `/admin/*`

## Deployment

Set all `.env.example` variables in the hosting environment. Run `complete_setup.sql` (or both migrations in order) and the seed SQL before switching public pages to database content. Create the initial admin in Supabase Auth, then grant its role with SQL. Test authentication, RLS, uploads, publication visibility, enquiry access, and the production domain in a staging project.

The included public-form rate limit is per process and is not shared across serverless instances. Configure a distributed rate limiter before handling production traffic. Verify all company facts, customer references, contact details, legal copy, and demo editorial content before publication.

## Validation

Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` with Node.js 22+.

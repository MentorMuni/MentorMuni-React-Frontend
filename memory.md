# MentorMuni Frontend — memory

## Multi-tenant college portals (student + org)

- **Slug from hostname**: `iit01.localhost` or `iit01.mentormuni.com` → `activePortalSlug()` / `resolveTenantFromHostname()`.
- **Shared context**: `CollegeTenantProvider` + `useCollegeTenantContext()` in `src/tenant/CollegeTenantProvider.jsx`.
- **On subdomain (`locked=true`)**: skip college picker; show `college.name`; always send `organization_code` on login/forgot/enroll.
- **Path helpers**: `tenantPortalPath(path)` keeps subdomain; `redirectToCollegePortal(slug, path)` for apex → subdomain after college pick.
- **Caches**: `sessionStorage` key `mm-tenant-v1:{slug}` for instant college name.
- **Apex**: college picker remains; after confirm → redirect to `{slug}.localhost:5173/.../login`.
- **Do not** create separate design/doc files for features — update this file instead.

## Test URLs (local)

- Student login: `http://iit01.localhost:5173/studentportal/login`
- Org login: `http://iit01.localhost:5173/Organization/login`
- Apex (picker): `http://localhost:5173/studentportal/login`

## Backend

- College by slug: `GET /organizations/colleges/by-slug/{slug}`
- Password reset emails use `portal_slug` → college subdomain reset URL (templates.py)

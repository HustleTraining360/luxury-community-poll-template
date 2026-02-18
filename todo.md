# Upgrade Tasks

## Backend
- [x] Upgrade to web-db-user via webdev_add_feature
- [x] Create poll_submissions table in drizzle schema
- [x] Create db helper functions (insert, getAll, getCount, export)
- [x] Create tRPC routes: poll.submit, admin.submissions, admin.exportCsv
- [x] Verify backend compiles with zero TS errors

## Frontend
- [x] Update ThankYouScreen to call tRPC poll.submit instead of localStorage
- [x] Update Analytics page to fetch from tRPC instead of localStorage
- [x] Add haptic feedback (navigator.vibrate) on OptionCard tap
- [x] Test full flow end-to-end
- [x] Save checkpoint and deliver

## Analytics Public Access
- [x] Make backend admin routes public (use publicProcedure instead of protectedProcedure)
- [x] Remove login gate from Analytics frontend page
- [x] Keep noindex/nofollow meta tag on Analytics page
- [x] Test analytics page loads without login

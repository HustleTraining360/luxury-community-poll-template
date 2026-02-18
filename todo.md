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

## Bug Fix: Analytics login redirect on production
- [x] Investigate why /analytics on hpp2.harmony360.lifestyle shows sign-in required (was wrong domain)
- [x] Fix the tRPC error redirect intercepting public routes (already fixed — routes are public)
- [x] Verify fix on live site — https://hpp.harmony360.lifestyle/analytics loads publicly

## New Sections: Lifestyle Intelligence Index Expansion
- [x] Search and collect lifestyle stock images for new sections
- [x] Add section divider screen component with fade transitions
- [x] Add 14 new questions across 6 sections to pollData
- [x] Support multi-select questions (Wellness Interests, Lifestyle Interests, Hobbies)
- [x] Support conditional reveal fields (Children ages, Pets other)
- [x] Support max-select limit (Lifestyle Interests max 5)
- [x] Update database schema for new question columns
- [x] Update backend routes (submit, submissions, CSV export) for new fields
- [x] Update Analytics dashboard to show new sections
- [x] Update progress bar to reflect total question count
- [x] Write/update vitest tests for new backend routes
- [x] Test full flow end-to-end
- [x] Save checkpoint and deliver

## Analytics UI Improvement
- [x] Replace "Question X of 21" labels with reactive progress bars on analytics dashboard

## Response Heatmap
- [x] Create ResponseHeatmap component (day-of-week x hour-of-day grid)
- [x] Integrate heatmap into Analytics page between summary cards and question breakdowns
- [x] Test with existing submission data

## Bug Fix: Missing Photos & Card Alignment
- [x] Audit all questions for missing images
- [x] Source and upload missing images to CDN
- [x] Fix card alignment — ensure all answer cards are equally sized on desktop
- [x] Apply headline text change: "Experience" → "Lifestyle"
- [x] Replace "QUESTION X OF 21" text with reactive progress bar on poll screens

## Clear All Data Feature
- [x] Add backend tRPC route to delete all poll submissions
- [x] Add "Clear All Data" button with confirmation dialog on Analytics page
- [x] Test clearing data and verify analytics resets

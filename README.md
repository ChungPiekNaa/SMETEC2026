# SMETEC 2026 Schedule Board

Two separate routes:

- `/` — public, read-only schedule. No editing controls exist on this page at all.
- `/admin` — admin-only page where clicking a session cycles its status
  (Upcoming → Now → Ended).

Now backed by **Firebase Firestore**, so every attendee — on any device,
any browser, anywhere — sees status changes the instant the admin makes
them. No polling, no refresh needed.


## Folder structure

```
src/
  scheduleData.js          seed data + shared constants (tracks, colors, tags)
  lib/
    firebase.js             Firebase app + Firestore init
    scheduleStore.js        storage layer - subscribe/save/reset, Firestore-backed
  components/
    ScheduleGrid.jsx        shared table renderer (no admin logic)
    LegendPanel.jsx          legend + status key
  pages/
    PublicPage.jsx           "/" — read only
    AdminPage.jsx             "/admin" — click to change status
  App.jsx                    routes
  main.jsx                   entry point
```

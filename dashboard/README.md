# StudyFocus Dashboard (React)

The student-facing web app for StudyFocus: tasks, Pomodoro, brain-break games,
live website usage from the gateway, and the AI tutor chat. Built with React 18 and Vite.

## Run it

```bash
npm install
cp .env.example .env    # optional: change the backend URLs
npm run dev             # opens on http://localhost:5173
```

Build for production with `npm run build` (output goes to `dist/`).

The dashboard talks to two backends:

| Backend | Default URL | Setting in `.env` |
| --- | --- | --- |
| Gateway management API (runs on the student's laptop) | `http://127.0.0.1:8889` | `VITE_PROXY_API_URL` |
| AI tutor (FastAPI) | `http://127.0.0.1:8000` | `VITE_TUTOR_API_URL` |

Every feature except live usage and the tutor works without either backend.

## Deploy to Vercel

Import the folder in Vercel; it detects Vite automatically (build: `npm run build`,
output: `dist`). Add `VITE_TUTOR_API_URL` = your Render URL under Environment Variables.
Leave the proxy URL as `127.0.0.1`, since the gateway always runs on the student's own device.

## How the code is organised

```
src/
  App.jsx                 profile + tab state; onboarding or main app
  config.js               backend URLs (from .env)
  components/
    Onboarding.jsx        age, class, board form
    Hero.jsx, TabNav.jsx  header and tab buttons
    DashboardTab.jsx      owns today's tasks, reminders, banner
      ProgressCard.jsx    stats + time per website
      TaskList.jsx        add-task form + list
      TaskItem.jsx        one task row with its stopwatch
      Pomodoro.jsx        25/5 focus timer
      BrainBreak.jsx      game tabs
        games/            Trivia, WordScramble, EmojiRiddle, SentenceBuilder
      AllowedSites.jsx    age profile + allowed sites from the gateway
      QuoteBanner.jsx, ReminderBanner.jsx
    TutorTab.jsx          chat, voice mode, notes upload
      ChatMessage.jsx     one message bubble + resource links
    SetupGuide.jsx        how to start the gateway
  hooks/
    useInterval.js        setInterval that always sees fresh state
    useProxyStatus.js     polls the gateway's /status.json every 3 s
    useTimedMessage.js    banner that hides itself after 15 s
    useLater.js           setTimeout that cancels on unmount
    useSpeech.js          Web Speech API helpers (voice in and out)
  utils/
    storage.js            everything saved in localStorage
    format.js, tasks.js   small helpers
  data/                   quotes and game questions
```

## Key design decisions

- **State lives in React; persistence in `localStorage`.** `DashboardTab` holds today's
  tasks in `useState` and saves them in a `useEffect` whenever they change.
- **Timers are timestamp-based.** Task stopwatches store when they started and the
  Pomodoro stores when it ends, so the time stays right after a refresh or in a
  background tab.
- **All tabs stay mounted** and are shown or hidden with CSS, so switching tabs never
  loses the chat history or a running timer.
- **Speech callbacks read refs, not state**, because they are created once and would
  otherwise see stale values.

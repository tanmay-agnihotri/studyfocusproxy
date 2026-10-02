import { useEffect, useState } from "react";
import { PROXY_API } from "./config";
import { loadProfile, saveProfile, clearProfile } from "./utils/storage";
import Onboarding from "./components/Onboarding";
import Hero from "./components/Hero";
import TabNav from "./components/TabNav";
import DashboardTab from "./components/DashboardTab";
import TutorTab from "./components/TutorTab";
import SetupGuide from "./components/SetupGuide";

export default function App() {
  // The saved profile decides whether we show onboarding or the main app.
  const [profile, setProfile] = useState(loadProfile);
  const [tab, setTab] = useState("dashboard");

  // Whenever a profile is set, tell the proxy which allowlist to use.
  useEffect(() => {
    if (!profile) return;
    fetch(`${PROXY_API}/set-profile?profile=${profile.ageGroup}`).catch(() => {
      // Proxy not running on this device - the dashboard still works.
    });
    if (window.Notification && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [profile]);

  function handleOnboardingDone(newProfile) {
    saveProfile(newProfile);
    setProfile(newProfile);
  }

  function handleChangeProfile() {
    clearProfile();
    setProfile(null);
  }

  if (!profile) return <Onboarding onDone={handleOnboardingDone} />;

  // All three tabs stay mounted and are shown/hidden with CSS,
  // so switching tabs never loses the chat or a running timer.
  const panel = (name) => "tab-panel" + (tab === name ? " active" : "");

  return (
    <div id="main-app">
      <Hero profile={profile} onChangeProfile={handleChangeProfile} />
      <div className="body-wrap">
        <TabNav tab={tab} onChange={setTab} />
        <div className={panel("dashboard")}>
          <DashboardTab />
        </div>
        <div className={panel("tutor")}>
          <TutorTab active={tab === "tutor"} />
        </div>
        <div className={panel("guide")}>
          <SetupGuide />
        </div>
      </div>
    </div>
  );
}

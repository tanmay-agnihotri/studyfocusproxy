export default function SetupGuide() {
  return (
    <>
      <div className="card">
        <div className="card-title">What is the StudyFocus Proxy?</div>
        <p className="guide-text">
          A proxy sits between your browser and the internet. Every website request passes
          through it first. StudyFocus uses this to check each site against your age group's
          allowed list - study sites load normally, everything else is politely blocked.
          It runs entirely on your own device - nothing you browse is ever sent anywhere else.
        </p>
        <p className="guide-text">
          <b>You are always in control.</b> Turn it on before a study session, turn it off the
          moment you're done - your Mac returns to completely normal browsing instantly.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Step 1 - Start the proxy on your computer</div>
        <p className="guide-text">Open Terminal, navigate to the project folder, and run:</p>
        <div className="guide-code">python3 gateway/proxy_server.py</div>
        <p className="guide-note">
          You should see "StudyFocus proxy listening on 0.0.0.0:8888" - leave this terminal
          window open while studying.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Step 2 - Point your device at it</div>
        <p className="guide-text">
          On Mac: <b>System Settings → Network → Wi-Fi → Details → Proxies</b>.
          Turn on <b>Web Proxy (HTTP)</b> and <b>Secure Web Proxy (HTTPS)</b>, and for both set:
        </p>
        <div className="guide-values">
          <div><b>Server:</b> 127.0.0.1</div>
          <div><b>Port:</b> 8888</div>
        </div>
        <p className="guide-note">
          Your focus session is now active - try opening a non-study site and you'll see it's blocked.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Step 3 - Choose your focus mode here</div>
        <p className="guide-text">
          Complete onboarding on this dashboard with your age, class, and board - the proxy
          automatically switches to the matching allowlist. Track your time, work through your
          task list, and use the AI Tutor tab whenever you're stuck - all without ever leaving
          your study environment for a distracting site.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Step 4 - Leaving focus mode (anytime, no questions asked)</div>
        <p className="guide-text">
          Go back to <b>System Settings → Network → Proxies</b> and turn both toggles
          off. That's it - completely normal, unrestricted browsing again, instantly.
        </p>
        <p className="guide-note">
          Then Ctrl+C in the terminal to stop the proxy itself when you're fully done for the day.
        </p>
      </div>
    </>
  );
}

export default function Hero({ profile, onChangeProfile }) {
  return (
    <div className="hero">
      <div className="hero-content">
        <div className="eyebrow">Welcome back</div>
        <h1>Your Study Space</h1>
        <p className="sub">
          {profile.cls} - {profile.board} - Age {profile.age}
        </p>
        <span
          className="change-profile" role="button" tabIndex={0}
          onClick={onChangeProfile}
          onKeyDown={(e) => e.key === "Enter" && onChangeProfile()}
        >
          Change profile
        </span>
      </div>
    </div>
  );
}

export default function AllowedSites({ status, offline }) {
  return (
    <>
      <div className="card">
        <div className="card-title">Age Profile</div>
        <div className="allowed-list">
          <span className="domain-pill">
            {offline ? "Proxy not running on this device" : status?.age_profile_label ?? "Loading..."}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Allowed Sites Right Now</div>
        <div className="allowed-list">
          {offline ? (
            <div className="empty-state">
              Start your local StudyFocus proxy to see live allowed sites here - see the Setup Guide tab →
            </div>
          ) : (
            (status?.allowed_domains_with_limits ?? []).map((item) => (
              <a
                key={item.domain} className="domain-link"
                href={`https://${item.domain}`} target="_blank" rel="noopener noreferrer"
              >
                {item.domain}
                {item.limit_seconds && (
                  <span className="limit-tag">({Math.round(item.limit_seconds / 60)}m/day)</span>
                )}
              </a>
            ))
          )}
        </div>
      </div>
    </>
  );
}

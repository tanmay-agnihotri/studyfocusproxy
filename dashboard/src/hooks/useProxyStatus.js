import { useCallback, useEffect, useState } from "react";
import { PROXY_API } from "../config";
import { useInterval } from "./useInterval";

// Asks the local proxy for live usage every 3 seconds.
// status = the /status.json data, or null while loading.
// offline = true if the proxy isn't running on this device.
export function useProxyStatus() {
  const [status, setStatus] = useState(null);
  const [offline, setOffline] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(PROXY_API + "/status.json");
      setStatus(await res.json());
      setOffline(false);
    } catch {
      setOffline(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useInterval(refresh, 3000);

  return { status, offline };
}

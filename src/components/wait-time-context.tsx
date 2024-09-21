import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabaseClient } from "../utilities/supabase-client";

const REFETCH_INTERVAL = 1 * 60 * 1000; // 1 minute in milliseconds

/* Create the context */
const WaitTimeContext = createContext<
  { waitTime: string | null; getWaitTime: () => Promise<string> } | undefined
>(undefined);

/* Async function to fetch the wait time */
const fetchValue = async (): Promise<string> => {
  let { data, error } = await supabaseClient.rpc(
    "calculate_average_wait_minutes"
  );
  if (error) console.error(error);
  else console.log("fetchValue", data);
  const mins = data as number;
  return mins === null ? "--" : mins > 1 ? `${mins} minutes` : `${mins} minute`;
};

/* Props for the Provider component */
interface Props {
  children: React.ReactNode;
}

/* Provider component */
const WaitTimeProvider: React.FC<Props> = ({ children }) => {
  const [waitTime, setWaitTime] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number>(0);

  const getWaitTime = useCallback(async () => {
    const now = Date.now();
    if (waitTime === null || now - lastFetched > REFETCH_INTERVAL) {
      const newWaitTime = await fetchValue();
      setWaitTime(newWaitTime);
      setLastFetched(now);
      return newWaitTime;
    }
    return waitTime;
  }, [waitTime, lastFetched]);

  useEffect(() => {
    getWaitTime();
  }, [getWaitTime]);

  return (
    <WaitTimeContext.Provider value={{ waitTime, getWaitTime }}>
      {children}
    </WaitTimeContext.Provider>
  );
};

/* Custom hook to use the WaitTimeContext */
const useWaitTime = () => {
  const context = useContext(WaitTimeContext);
  if (context === undefined) {
    throw new Error("useWaitTime must be used within a WaitTimeProvider");
  }
  return context;
};

export { useWaitTime, WaitTimeProvider };

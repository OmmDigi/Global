import { runAmcAlertChecking } from "./jobs";

export const initCronJobs = () => {
  runAmcAlertChecking();
};

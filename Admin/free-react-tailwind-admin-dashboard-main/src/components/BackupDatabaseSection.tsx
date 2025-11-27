import useSWRMutation from "swr/mutation";
import ComponentCard from "./common/ComponentCard";
import Button from "./ui/button/Button";
import { postFetcher } from "../api/fatcher";
import { Loader } from "lucide-react";

export default function BackupDatabaseSection() {
  //   create Seaaion
  const {
    trigger: backupDatabase,
    isMutating,
    error,
    data,
  } = useSWRMutation("api/v1/settings/backup-database", (url, { arg }) =>
    postFetcher(url, arg)
  );

  return (
    <section>
      <ComponentCard title="Database">
        <Button
          onClick={() => {
            backupDatabase();
          }}
          disabled={isMutating}
        >
          {isMutating ? <Loader size={18} /> : null} Backup Databse
        </Button>
        {isMutating ? (
          <p className="text-yellow-400">
            Please Do not close the screen while backuping the database
          </p>
        ) : null}
        {error ? (
          <p className="text-red-400">{error?.response?.data.message}</p>
        ) : null}
        {data ? (
          <>
            <p className="text-green-400">{data?.response?.data.message}</p>
            <p className="text-green-400 text-sm">{data?.response?.data}</p>
          </>
        ) : null}
      </ComponentCard>
    </section>
  );
}

import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import BasicTableNotice from "../../../components/tables/BasicTables/BasicTableNotice";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title=" Dashboard Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is  Dashboard Basic Tables Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableNotice />
        </ComponentCard>
      </div>
    </>
  );
}

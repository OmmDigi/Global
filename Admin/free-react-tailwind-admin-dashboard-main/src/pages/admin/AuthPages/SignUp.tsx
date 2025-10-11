import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title=" Dashboard SignUp Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is  Dashboard SignUp Tables Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}

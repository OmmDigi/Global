import PageMeta from "../../../components/common/PageMeta";
import SignInForm from "../../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title=" Dashboard SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is  Dashboard SignIn Tables Dashboard page for TailAdmin -  Dashboard Tailwind CSS Admin Dashboard Template"
      />
      <SignInForm />
      {/* <AuthLayout>
      </AuthLayout> */}
    </>
  );
}

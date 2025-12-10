import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import AdminSignInForm from "../../components/auth/AdminSignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Admin | Login"
        description="Admin login page to access the dashboard and manage the application."
      />
      <AuthLayout>
        <AdminSignInForm />
      </AuthLayout>
    </>
  );
}

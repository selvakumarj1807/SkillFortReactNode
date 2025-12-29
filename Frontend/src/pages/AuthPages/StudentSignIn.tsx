import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import StudentSignInForm from "../../components/auth/StudentSignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Student | Login"
        description="Student login page to access the dashboard and manage the application."
      />
      <AuthLayout>
        <StudentSignInForm />
      </AuthLayout>
    </>
  );
}

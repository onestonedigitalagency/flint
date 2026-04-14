// src/app/signup/page.js
import AuthLayout from "@/components/AuthLayout";
import SignUpForm from "@/components/SignUpForm";

export const metadata = {
  title: "Create Account - FLINT",
  description: "Create your FLINT account and start building",
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
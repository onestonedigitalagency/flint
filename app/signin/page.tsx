// src/app/signin/page.js
import AuthLayout from "@/components/AuthLayout";
import SignInForm from "@/components/SignInForm";

export const metadata = {
  title: "Sign In - FLINT",
  description: "Sign in to your FLINT account",
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
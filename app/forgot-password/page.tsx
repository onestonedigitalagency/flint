// src/app/forgot-password/page.js
import AuthLayout from "@/components/AuthLayout";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata = {
  title: "Reset Password — FLINT",
  description: "Reset your FLINT account password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
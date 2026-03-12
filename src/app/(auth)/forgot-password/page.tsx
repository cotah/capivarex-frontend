import ForgotForm from '@/components/auth/ForgotForm';

export const metadata = {
  title: 'Reset Password — CAPIVAREX',
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-center text-lg font-semibold text-text mb-4">
        Reset password
      </h1>
      <ForgotForm />
    </div>
  );
}

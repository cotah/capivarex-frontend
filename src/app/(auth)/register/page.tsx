import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account — Capivarex',
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-center text-lg font-semibold text-text mb-1">
        Create your account
      </h1>
      <p className="text-center text-xs text-text-muted mb-6">
        Your AI Life Assistant
      </p>
      <RegisterForm />
    </div>
  );
}

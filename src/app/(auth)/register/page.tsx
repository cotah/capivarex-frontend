import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account — Capivarex',
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-text mb-1">
        Create your account
      </h1>
      <p className="text-center text-sm text-text-muted mb-6">
        Your AI Life Assistant
      </p>
      <RegisterForm />
    </div>
  );
}

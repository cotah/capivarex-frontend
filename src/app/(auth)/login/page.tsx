import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In — Capivarex',
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-text mb-6">
        Welcome back
      </h1>
      <LoginForm />
    </div>
  );
}

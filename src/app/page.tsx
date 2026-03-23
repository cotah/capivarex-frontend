import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const isMainDomain =
    hostname === 'capivarex.com' || hostname === 'www.capivarex.com';

  if (isMainDomain) {
    redirect('/landing');
  }

  // app.capivarex.com / vercel / localhost → chat
  redirect('/chat');
}

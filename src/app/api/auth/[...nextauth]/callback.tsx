// pages/auth/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    // Por enquanto, apenas redireciona para a página de acompanhamento
    router.replace('/acompanhamento');
  }, [router]);

  return <p>Redirecionando...</p>;
}

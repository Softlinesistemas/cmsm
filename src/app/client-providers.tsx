"use client";
import { useEffect } from "react";
import { EditalProvider } from "../context/EditalContext";
import { MainProvider } from "@/context/MainContext";
import { Suspense } from "react";
import Spinner from "../components/spiner";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/queryCliente";
import { useSession } from "next-auth/react";
import { useRouter, usePathname  } from "next/navigation";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
     if (status === "unauthenticated" && pathname !== "/" && pathname !== "/login") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
      return (
        <div className="fixed inset-0 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (status === "unauthenticated" && pathname !== "/" && pathname !== "/login") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <p className="text-red-600 text-lg font-semibold">
          Não autorizado. Por favor, faça login para continuar.
        </p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <EditalProvider>
        <MainProvider>
          <Suspense fallback={<Spinner />}>
            {children}
          </Suspense>
        </MainProvider>
      </EditalProvider>
    </QueryClientProvider>
  );
}

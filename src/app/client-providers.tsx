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
import { useRouter } from "next/navigation";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (status === "loading") return;
  //   if (session) {
  //     if (status !== "authenticated") {
  //       return router.push("/login");
  //     }
  //   }
  //   if(status === "unauthenticated") {
  //     router.push("/login");
  //   }
  // }, [status, session, router]);

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

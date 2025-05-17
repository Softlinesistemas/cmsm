"use client";
import { useEffect, useState, useRef } from "react";
import SideNav from "@/components/admin/SideNav/SideNav";
import Footer from "@/components/admin/Footer";
import { DashboardProvider }  from "@/context/DashboardContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (status === "loading") return;
    if (session) {
      if (status !== "authenticated") {
        return router.push("/");
      }
      setLoading(false);
    }
    if(status === "unauthenticated") {
      router.push("/");
    }
  }, [status, session, router]);
  

  return (
    <DashboardProvider>
      <section className="h-full bg-[#754545] p-10 md:p-4">
        <div className="overflow-hidden w-full relative flex gap-4">
          <SideNav />
          <div className="flex flex-col grow">
            {children}
          </div>
        </div>
        <Footer />
      </section>
    </DashboardProvider>
  );
}

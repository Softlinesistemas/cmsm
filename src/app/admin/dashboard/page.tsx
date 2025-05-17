"use client";
import { useEffect, useContext, useState } from "react";
import { DashboardContext } from "@/context/DashboardContext";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ripplesLoading } from "../../../../public";
import normalizeKey from "@/helpers/normalizeKey";

const LoadingImage = () => (
  <div className="flex justify-center items-center h-full">
    <Image className="w-32 h-32" src={ripplesLoading} alt="Loading..." />
  </div>
);

const pagesMap: Record<string, any> = {
  main: dynamic(() => import("@/components/admin/views/MainPage"), { loading: LoadingImage }),
};

export default function Dashboard() {
  const { setActiveItem, activeItem } = useContext(DashboardContext);

  const getHash = () => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      return normalizeKey(hash || "main");
    }
    return "main";
  };

  const [currentHash, setCurrentHash] = useState<string>(getHash());

  useEffect(() => {
    const onHashChange = () => {
      const newHash = getHash();
      setCurrentHash(newHash);
      setActiveItem(newHash as any);
    };

    if (!window.location.hash) {
      window.location.hash = "main";
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [setActiveItem]);

  const Component = pagesMap[currentHash] || pagesMap["main"];

  return (
    <div className={`overflow-y-auto h-[calc(100vh_-_100px)] rounded-3xl transition-all duration-300 ease-in-out text-gray-700 bg-[#cab9b9] bg-clip-border w-full ${activeItem !== "main" ? "px-5" : ""}`}>
      <Component />
    </div>
  );
}

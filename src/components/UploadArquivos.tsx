"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import DocumentCategoryForm from "@/components/DocumentCategoryForm";
import DocumentForm from "@/components/DocumentForm";
import DocumentTable from "@/components/DocumentTable";

// Create a single QueryClient instance for React Query
const queryClient = new QueryClient();

export default function UploadArquivosPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="space-y-6 p-8">
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold">Upload de Arquivos</h2>
        </div>

        <DocumentCategoryForm />
        <DocumentForm />
        <DocumentTable />
      </div>
    </QueryClientProvider>
  );
}

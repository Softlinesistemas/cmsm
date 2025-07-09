'use client'

import { useState, useContext, useEffect, ReactNode } from 'react'

import Header from '@/components/HeaderAdm'
import Footer from '@/components/FooterAdm'
import Sidebar from '@/components/Sidebar'

import { MainContext } from '@/context/MainContext'

export default function DashboardAdmin() {
  // Usa o contexto que já está provido pelo RootLayout
  const { selectedComponent, setSelectedComponent, Component } = useContext(MainContext);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Sidebar e Conteúdo */}
      <div className="flex flex-1">
        <Sidebar />

        {/* Conteúdo principal */}
        <main className="flex-1 p-4 space-y-8">
          {Component}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
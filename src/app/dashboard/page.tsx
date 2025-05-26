'use client'

import Header from '@/components/HeaderAdm'
import FooterAdm from '@/components/FooterAdm'
import Sidebar from '@/components/Sidebar'
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useState } from 'react'

export default function Dashboard() {
  const total = 1257
  const pagos6 = 800, pend6 = 57, pagos1 = 374, pend1 = 26

  const [filtro6, setFiltro6] = useState('')
  const [filtro1, setFiltro1] = useState('')

  const exames6 = { aprovados: 600, reprovados: 57, ausentes: 10 }
  const exames1 = { aprovados: 500, reprovados: 50, ausentes: 5 }

  const barrasForcaSexo = [
    { name: 'Forças Auxiliares', Masculino: 900, Feminino: 400 },
    { name: 'Exército', Masculino: 1200, Feminino: 600 },
    { name: 'Aeronáutica', Masculino: 800, Feminino: 350 },
    { name: 'Marinha', Masculino: 700, Feminino: 300 },
    { name: 'Civil', Masculino: 500, Feminino: 200 },
  ]

  const pieData = [
    { name: 'Forças Auxiliares', value: 220 },
    { name: 'Exército', value: 100 },
    { name: 'Aeronáutica', value: 80 },
    { name: 'Marinha', value: 400 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-grow p-6">
            <h2 className="text-center text-blue-900 text-2xl font-bold mb-6">DASHBOARD</h2>

            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-8">
              <Card label="TOTAL" value={total.toLocaleString()} center />
              <Card label="6° ANO" value={857} sub1={`Pagos ${pagos6}`} sub2={`Pendente ${pend6}`} green />
              <Card label="1° ANO" value={400} sub1={`Pagos ${pagos1}`} sub2={`Pendente ${pend1}`} green />
            </div>

            <div className="border-t-4 border-blue-900 my-4"></div>
            <h2 className="text-center text-green-900 text-2xl font-bold mb-4">RESULTADO DOS EXAMES</h2>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-6">
              <ExameCard title="6° ANO" data={exames6} filtro={filtro6} setFiltro={setFiltro6} />
              <ExameCard title="1° ANO" data={exames1} filtro={filtro1} setFiltro={setFiltro1} />
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
              <ChartCard title="CLASSIFICADOS POR FORÇA, CIVIS, SEGMENTADOS POR SEXO">
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={barrasForcaSexo}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="Masculino" fill="#8884d8" />
                    <Bar dataKey="Feminino" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="DESEMPENHO POR ORIGEM APROVADOS E CLASSIFICADOS SEGMENTADOS POR FORÇA">
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={30} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </main>
          <FooterAdm />
        </div>
      </div>
    </div>
  )
}

function Card({ label, value, sub1, sub2, green, center }: any) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 text-center border-2 ${green ? 'border-green-600' : 'border-blue-900'}`}>
      <div className="text-sm text-gray-600 font-bold">{label}</div>
      <div className="text-3xl font-bold text-green-900 my-2">{value}</div>
      {(sub1 || sub2) && (
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-green-700">{sub1}</span>
          <span className="text-red-600">{sub2}</span>
        </div>
      )}
    </div>
  )
}

function ExameCard({ title, data, filtro, setFiltro }: any) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-gray-300">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-bold text-gray-600">{title}</div>
        <input
          className="border px-2 py-1 rounded text-sm"
          placeholder="Filtrar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xl font-bold">
        <div>
          {data.aprovados}
          <div className="text-sm text-green-700">APROVADOS</div>
        </div>
        <div>
          {data.reprovados}
          <div className="text-sm text-red-600">REPROVADOS</div>
        </div>
        <div>
          {String(data.ausentes).padStart(2, '0')}
          <div className="text-sm text-yellow-600">AUSENTES</div>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 h-80 border border-gray-200">
      <div className="text-sm font-bold text-gray-600 mb-2 text-center uppercase">{title}</div>
      {children}
    </div>
  )
}

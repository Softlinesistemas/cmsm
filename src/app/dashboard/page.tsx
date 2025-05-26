'use client'


import FooterAdm from '@/components/FooterAdm'
import Sidebar from '@/components/Sidebar'
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function Dashboard() {
  // dados de exemplo
  const total = 1257, pagos6=800, pend6=57, pagos1=374, pend1=26
  const exames6={aprovados:600,reprovados:57,ausentes:10}
  const exames1={aprovados:500,reprovados:50,ausentes:5}
  const barrasForcaSexo = [
    { name:'Forças Auxiliares',Masculino:900,Feminino:400 },
    { name:'Exército',Masculino:1200,Feminino:600 },
    { name:'Aeronáutica',Masculino:800,Feminino:350 },
    { name:'Marinha',Masculino:700,Feminino:300 },
    { name:'Civil',Masculino:500,Feminino:200 },
  ]
  const pieData = [
    { name:'Forças Auxiliares',value:220 },
    { name:'Exército',value:100 },
    { name:'Aeronáutica',value:80 },
    { name:'Marinha',value:400 },
  ]
  const COLORS=['#0088FE','#00C49F','#FFBB28','#FF8042']

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        
        <main className="flex-grow p-6">
          {/* Cards de total e por ano */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-8">
            <Card label="TOTAL" value={total.toLocaleString()} />
            <Card label="6° ANO" value={(exames6.aprovados+exames6.reprovados+exames6.ausentes).toLocaleString()}
                 sub1={`Pagos ${pagos6}`} sub2={`Pend. ${pend6}`} />
            <Card label="1° ANO" value={(exames1.aprovados+exames1.reprovados+exames1.ausentes).toLocaleString()}
                 sub1={`Pagos ${pagos1}`} sub2={`Pend. ${pend1}`} />
          </div>

          {/* Resultado dos exames e gráficos */}
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
            <ExameCard title="6° ANO" data={exames6} />
            <ExameCard title="1° ANO" data={exames1} />

            <ChartCard title="Classificados por Força, segmentados por sexo">
              <ResponsiveContainer width="100%" height="85%">
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

            <ChartCard title="Desempenho por origem">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label>
                    {pieData.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Legend verticalAlign="bottom" height={20} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </main>
        <FooterAdm />
      </div>
    </div>
  )
}

// --- Components usados ---
function Card({ label, value, sub1, sub2 }:
  { label:string, value:string|number, sub1?:string, sub2?:string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-green-900">{value}</div>
      {(sub1 || sub2) && (
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-gray-700">{sub1}</span>
          <span className="text-red-600">{sub2}</span>
        </div>
      )}
    </div>
  )
}

function ExameCard({ title, data }:
  { title:string, data:{aprovados:number,reprovados:number,ausentes:number} }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      <div className="grid grid-cols-3 text-center font-bold text-lg">
        <div>{data.aprovados}<div className="text-sm text-green-800">APROVADOS</div></div>
        <div>{data.reprovados}<div className="text-sm text-red-600">REPROVADOS</div></div>
        <div>{String(data.ausentes).padStart(2,'0')}<div className="text-sm text-yellow-600">AUSENTES</div></div>
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title:string, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 h-64">
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      {children}
    </div>
  )
}

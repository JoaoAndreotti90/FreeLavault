"use client"

import { useState } from "react"
import Link from "next/link"
import GraficoVendas from "@/components/GraficoVendas"
import SellerProjectCard from "@/components/SellerProjectCard"

export default function DashboardTabs({ 
  sales, 
  purchases, 
  isSeller, 
  totalRevenue, 
  graphData,
  myProjects
}: any) {
  const [activeTab, setActiveTab] = useState(isSeller ? "vendas" : "compras")

  return (
    <div className="space-y-8">
      
      <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("vendas")}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "vendas"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Painel de Vendedor
        </button>

        <button
          onClick={() => setActiveTab("compras")}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "compras"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Minhas Compras
        </button>
      </div>

      {activeTab === "vendas" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          {isSeller ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Receita Total</p>
                      <h3 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalRevenue)}
                      </h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Vendas Totais</p>
                      <h3 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">{sales.length}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <h3 className="mb-6 text-base font-semibold text-gray-900">Desempenho Financeiro</h3>
                  <div className="h-[300px]">
                    <GraficoVendas data={graphData} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900">Seus Projetos</h3>
                      <Link href="/upload" className="text-xs font-medium text-blue-600 hover:underline">+ Novo</Link>
                  </div>
                  <div className="flex flex-col gap-3">
                    {myProjects.map((proj: any) => {
                      const salesCount = sales.filter((s: any) => s.projectId === proj.id).length
                      return <SellerProjectCard key={proj.id} project={proj} salesCount={salesCount} />
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                  <h3 className="text-sm font-semibold text-gray-900">Histórico de Transações</h3>
                </div>
                {sales.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 text-sm">Nenhuma venda realizada ainda.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="text-gray-500 font-medium border-b border-gray-50">
                        <tr>
                          <th className="px-6 py-4">Cliente</th>
                          <th className="px-6 py-4">Projeto</th>
                          <th className="px-6 py-4">Data</th>
                          <th className="px-6 py-4 text-right">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 bg-white">
                        {sales.map((sale: any) => (
                          <tr key={sale.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                  {(sale.client.name || sale.client.email)[0].toUpperCase()}
                                </div>
                                {sale.client.name || sale.client.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{sale.project.name}</td>
                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                              {new Date(sale.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-emerald-600">
                              +{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(sale.pricePaid))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Comece a Faturar</h3>
              <p className="mt-2 text-gray-500 max-w-sm mb-6">Cadastre seu primeiro projeto e comece a vender seu código para outros desenvolvedores.</p>
              <Link href="/upload" className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-all">
                Criar Primeiro Projeto
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "compras" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-4">
            {purchases.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-white border border-dashed border-gray-200">
                <p className="text-gray-500">Sua biblioteca está vazia.</p>
                <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">Explorar Loja</Link>
              </div>
            ) : (
              purchases.map((purchase: any) => (
                <div key={purchase.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{purchase.project.name}</h3>
                      <p className="text-xs text-gray-500">Comprado em {new Date(purchase.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  
                  <Link 
                    href={purchase.project.fileUrl} 
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600 hover:shadow-lg active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
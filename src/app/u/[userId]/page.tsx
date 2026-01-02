import { db } from "@/lib/db"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import Image from "next/image"
import { updateBio } from "@/actions/social"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  
  const { id } = await params
  const userId = id

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { projects: true }
  })

  if (!user) return <div>Usuário não encontrado</div>

  const isOwnProfile = session?.user?.id === user.id

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="h-32 w-32 rounded-full bg-black text-white flex items-center justify-center text-4xl font-bold">
            {user.name?.[0]?.toUpperCase()}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm mb-4">{user.email}</p>
            
            {isOwnProfile ? (
              <form 
                action={async (formData) => {
                  "use server"
                  await updateBio(formData)
                }} 
                className="max-w-md"
              >
                <textarea 
                  name="bio" 
                  defaultValue={user.bio || ""} 
                  placeholder="Escreva uma bio curta sobre você..."
                  className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white transition"
                  rows={2}
                />
                <button className="text-xs text-blue-600 font-bold hover:underline mt-1">Salvar Bio</button>
              </form>
            ) : (
              <p className="text-gray-700 max-w-lg">{user.bio || "Este vendedor ainda não escreveu uma bio."}</p>
            )}
          </div>

          <div className="text-center">
            <span className="block text-3xl font-bold text-gray-900">{user.projects.length}</span>
            <span className="text-sm text-gray-500 uppercase tracking-wide font-bold">Projetos</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-xl font-bold mb-6">Vitrine de {user.name?.split(" ")[0]}</h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {user.projects.map((project) => (
            <Link key={project.id} href={`/project/${project.id}`} className="group block bg-white rounded-xl border hover:shadow-lg transition overflow-hidden">
              <div className="h-40 bg-gray-100 relative">
                {project.imageUrl ? (
                  <Image src={project.imageUrl} alt={project.name} fill className="object-cover" />
                ) : (
                   <div className="flex h-full items-center justify-center text-gray-300">
                     <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate">{project.name}</h3>
                <p className="text-emerald-600 font-bold mt-2">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(project.price))}
                </p>
              </div>
            </Link>
          ))}
          {user.projects.length === 0 && <p className="text-gray-500">Nenhum projeto publicado ainda.</p>}
        </div>
      </div>
    </div>
  )
}
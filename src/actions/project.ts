"use server"

import { put } from "@vercel/blob"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      return { error: "Você precisa estar logado para publicar." }
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { error: "Erro de Configuração: Token de Upload (Blob) não encontrado no servidor." }
    }

    const mainFile = formData.get("file") as File
    const imageFile = formData.get("image") as File 
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string

    if (!mainFile || !imageFile || !name || !price) {
      return { error: "Preencha todos os campos obrigatórios." }
    }

    const MAX_SIZE = 4.5 * 1024 * 1024 
    if (mainFile.size > MAX_SIZE) {
      return { error: "O arquivo do projeto é muito grande. O limite é 4.5MB." }
    }
    if (imageFile.size > MAX_SIZE) {
      return { error: "A imagem de capa é muito grande. O limite é 4.5MB." }
    }

    const imageBlob = await put(`covers/${imageFile.name}`, imageFile, {
      access: "public",
      addRandomSuffix: true,
    })

    const fileBlob = await put(`projects/${mainFile.name}`, mainFile, {
      access: "public",
      addRandomSuffix: true,
    })

    await db.project.create({
      data: {
        name,
        description,
        price: Number(price),
        fileUrl: fileBlob.url,
        imageUrl: imageBlob.url, 
        freelancerId: session.user.id,
      },
    })

    revalidatePath("/")
    revalidatePath("/dashboard")

    return { success: true }

  } catch (error: any) {
    return { error: `Erro no servidor: ${error.message}` }
  }
}

export async function deleteProject(projectId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) return { error: "Não autorizado." }
    
    const project = await db.project.findUnique({ where: { id: projectId } })
    if (!project || project.freelancerId !== session.user.id) return { error: "Sem permissão." }
    
    await db.project.delete({ where: { id: projectId } })
    
    revalidatePath("/")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Erro ao excluir o projeto." }
  }
}

export async function updateProject(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) return { error: "Não autorizado." }
    
    const projectId = formData.get("projectId") as string
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = formData.get("price") as string
    const imageFile = formData.get("image") as File

    const project = await db.project.findUnique({ where: { id: projectId } })
    if (!project || project.freelancerId !== session.user.id) return { error: "Sem permissão." }

    let imageUrl = project.imageUrl

    if (imageFile && imageFile.size > 0) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return { error: "Erro de Configuração: Token de Upload (Blob) não encontrado." }
      }
      
      if (imageFile.size > 4.5 * 1024 * 1024) {
        return { error: "A nova imagem é muito grande (Máx 4.5MB)." }
      }
      const imageBlob = await put(`covers/${imageFile.name}`, imageFile, {
        access: "public",
        addRandomSuffix: true,
      })
      imageUrl = imageBlob.url
    }
    
    await db.project.update({
      where: { id: projectId },
      data: { 
        name, 
        description, 
        price: Number(price),
        imageUrl: imageUrl
      }
    })
    
    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath(`/project/${projectId}`)
    
    return { success: true }
  } catch (error: any) {
    return { error: error.message || "Erro ao atualizar o projeto." }
  }
}
"use server"

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Stripe from "stripe"

export async function buyProject(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    redirect("/login")
  }

  const projectId = formData.get("projectId") as string
  const project = await db.project.findUnique({
    where: { id: projectId },
  })

  if (!project) {
    throw new Error("Projeto não encontrado")
  }

  const priceInCents = Math.round(Number(project.price) * 100)

  if (priceInCents > 99999999) {
    throw new Error("O valor deste projeto excede o limite permitido pelo processador de pagamentos.")
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Configuração do Stripe ausente.")
  }

  const baseUrl = process.env.NEXTAUTH_URL || "https://free-lavault.vercel.app"

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover",
    typescript: true,
  })

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email!,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: project.name,
              description: project.description,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        projectId: project.id,
        userId: session.user.id,
      },
      success_url: `${baseUrl}/?success=true`,
      cancel_url: `${baseUrl}/`,
    })

    if (checkoutSession.url) {
      redirect(checkoutSession.url)
    }
  } catch (error: any) {
    console.error("Erro Stripe:", error.message)
    throw new Error(error.message)
  }
}
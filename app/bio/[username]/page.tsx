import { prisma } from "@/lib/prisma"
import { LinkInBioView } from "@/components/bio/link-in-bio-view"
import { notFound } from "next/navigation"

interface BioPageProps {
  params: {
    username: string
  }
}

export default async function BioPage({ params }: BioPageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      linkInBio: true,
      stores: {
        include: {
          products: {
            where: { isActive: true },
            take: 3,
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  })

  if (!user || !user.linkInBio) {
    notFound()
  }

  return <LinkInBioView user={user} />
}

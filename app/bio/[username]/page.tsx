// BioPage.tsx

import { prisma } from "@/lib/prisma";
import { LinkInBioView } from "@/components/bio/link-in-bio-view";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";

// Define the exact shapes of your JSON fields for casting
interface LinkInBioLink {
  id: string;
  title: string;
  url: string;
}

interface LinkInBioSocials {
  website?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

interface LinkInBioTheme {
  id: string;
  name: string;
  preview: string;
}

interface BioPageProps {
  params: {
    username: string;
  };
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
  });

  if (!user || !user.linkInBio) {
    console.error(
      "User or link in bio not found for username:",
      params.username
    );
    notFound();
  }

  // Create a new, type-safe user object for the component
  const userWithTypedData = {
    ...user,
    linkInBio: user.linkInBio
      ? {
          ...user.linkInBio,
          // Use type assertions to cast the generic JsonValue to specific types
          theme: user.linkInBio.theme as LinkInBioTheme | null,
          links: user.linkInBio.links as LinkInBioLink[] | null,
          projects: user.linkInBio.projects as any[] | null,
          socialUrls: user.linkInBio.socialUrls as LinkInBioSocials | null,
        }
      : null,
  };

  return <LinkInBioView user={userWithTypedData} />;
}

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
  isActive: boolean;
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

  const userWithTypedData = {
    ...user,
    linkInBio: user.linkInBio
      ? {
          ...user.linkInBio,
          theme: user.linkInBio.theme as LinkInBioTheme | null,
          links: user.linkInBio.links as LinkInBioLink[] | null,
          projects: user.linkInBio.projects as any[] | null,
          socialUrls: user.linkInBio.socialUrls as LinkInBioSocials | null,
        }
      : null,
  };

  return <LinkInBioView user={userWithTypedData} />;
}

export async function generateMetadata({ params }: BioPageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      linkInBio: {
        select: {
          title: true,
          description: true,
          avatar: true,
          slug: true,
        },
      },
    },
  });

  if (!user || !user.linkInBio) {
    return {
      title: "Page Not Found",
      description: "This bio link page does not exist.",
    };
  }

  const { title, description, avatar } = user.linkInBio;
  const username = user.username;
  const pageTitle = title || `${username}'s Bio Link`;
  const pageDescription =
    description ||
    `Follow ${username} on their bio link page to discover their latest projects, content, and links.`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: avatar ? [avatar] : [],
    },
    twitter: {
      card: "summary_large_image",
      creator: `@${username}`,
      title: pageTitle,
      description: pageDescription,
      images: avatar ? [avatar] : [],
    },
  };
}

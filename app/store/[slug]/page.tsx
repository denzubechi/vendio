import { prisma } from "@/lib/prisma";
import { StorefrontView } from "@/components/storefront/storefront-view";
import { notFound } from "next/navigation";

interface StoreTheme {
  id: string;
  name: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface StorePageProps {
  params: {
    slug: string;
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const store = await prisma.store.findUnique({
    where: { slug: params.slug },
    include: {
      user: true,
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!store) {
    notFound();
  }

  const storeWithTypedTheme = {
    ...store,
    theme: store.theme as StoreTheme | null,
  };

  return <StorefrontView store={storeWithTypedTheme} />;
}

export async function generateMetadata({ params }: StorePageProps) {
  const store = await prisma.store.findUnique({
    where: {
      slug: params.slug,
      isActive: true,
    },
  });

  if (!store) {
    return {
      title: "Store Not Found",
    };
  }

  return {
    title: `${store.name} - Store`,
    description:
      store.description || `Browse the products at ${store.name}'s store.`,
    openGraph: {
      title: store.name,
      description:
        store.description || `Browse the products at ${store.name}'s store.`,
      images: store.logo ? [store.logo] : [],
    },
  };
}

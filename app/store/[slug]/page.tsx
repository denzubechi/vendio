import { prisma } from "@/lib/prisma";
import { StorefrontView } from "@/components/storefront/storefront-view";
import { notFound } from "next/navigation";

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

  return <StorefrontView store={store} />;
}

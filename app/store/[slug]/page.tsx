import { prisma } from "@/lib/prisma";
import { StorefrontView } from "@/components/storefront/storefront-view";
import { notFound } from "next/navigation";

// Define the type for the theme property
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

  // Create a new object to pass to the component with the correct type assertion
  const storeWithTypedTheme = {
    ...store,
    theme: store.theme as StoreTheme | null,
  };

  return <StorefrontView store={storeWithTypedTheme} />;
}

import { notFound } from "next/navigation";
import { PaymentLinkView } from "@/components/payment-links/payment-link-view";
import { prisma } from "@/lib/prisma";

interface PaymentLinkPageProps {
  params: {
    slug: string;
  };
}

export default async function PaymentLinkPage({
  params,
}: PaymentLinkPageProps) {
  const paymentLink = await prisma.paymentLink.findUnique({
    where: {
      slug: params.slug,
      isActive: true,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!paymentLink) {
    notFound();
  }

  return <PaymentLinkView paymentLink={paymentLink} />;
}

export async function generateMetadata({ params }: PaymentLinkPageProps) {
  const paymentLink = await prisma.paymentLink.findUnique({
    where: {
      slug: params.slug,
      isActive: true,
    },
  });

  if (!paymentLink) {
    return {
      title: "Payment Link Not Found",
    };
  }

  return {
    title: `${paymentLink.title} - Payment Link`,
    description: paymentLink.description || `Purchase ${paymentLink.title}`,
    openGraph: {
      title: paymentLink.title,
      description: paymentLink.description || `Purchase ${paymentLink.title}`,
      images: paymentLink.imageUrl ? [paymentLink.imageUrl] : [],
    },
  };
}

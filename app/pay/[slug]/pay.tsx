// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { Heart, Shield, Clock, Download, Star, Users } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useToast } from "@/hooks/use-toast";

// export default function PaymentLinkPage() {
//   const params = useParams();
//   const { toast } = useToast();
//   const [paymentLink, setPaymentLink] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [tipAmount, setTipAmount] = useState("");
//   const [customerInfo, setCustomerInfo] = useState({
//     name: "",
//     email: "",
//   });

//   const slug = params.slug as string;

//   useEffect(() => {
//     fetchPaymentLink();
//   }, [slug]);

//   const fetchPaymentLink = async () => {
//     try {
//       const response = await fetch(`/api/payment-links/${slug}`);
//       if (response.ok) {
//         const data = await response.json();
//         setPaymentLink(data);
//         await fetch(`/api/payment-links/${slug}/view`, { method: "POST" });
//       } else {
//         setPaymentLink(null);
//       }
//     } catch (error) {
//       console.error("Failed to fetch payment link:", error);
//       setPaymentLink(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const totalAmount = paymentLink
//     ? paymentLink.price + (Number.parseFloat(tipAmount) || 0)
//     : 0;

//   const handlePaymentSuccess = async (txHash: string) => {
//     try {
//       // Process the payment on your backend
//       const response = await fetch("/api/checkout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           paymentLinkId: paymentLink.id,
//           customerName: customerInfo.name,
//           customerEmail: customerInfo.email,
//           tipAmount: Number.parseFloat(tipAmount) || 0,
//           paymentTxHash: txHash,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         toast({
//           title: "Purchase complete!",
//           description: "Check your email for the download link and receipt.",
//         });
//       } else {
//         throw new Error(result.error || "Failed to process purchase");
//       }
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handlePaymentError = (error: Error) => {
//     console.error("Payment error:", error);
//     toast({
//       title: "Payment failed",
//       description:
//         "There was an error processing your payment. Please try again.",
//       variant: "destructive",
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading payment link...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!paymentLink) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold">Payment link not found</h1>
//           <p className="text-muted-foreground">
//             The payment link you're looking for doesn't exist.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="grid gap-8 lg:grid-cols-2">
//             {/* Product Information */}
//             <div className="space-y-6">
//               <div className="aspect-video relative overflow-hidden rounded-xl">
//                 <img
//                   src={
//                     paymentLink.imageUrl ||
//                     "/placeholder.svg?height=400&width=600"
//                   }
//                   alt={paymentLink.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute top-4 left-4">
//                   <Badge className="bg-primary/90 text-primary-foreground">
//                     {paymentLink.type.toLowerCase()}
//                   </Badge>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h1 className="text-3xl font-bold tracking-tight">
//                     {paymentLink.title}
//                   </h1>
//                   <p className="text-lg text-muted-foreground mt-2">
//                     {paymentLink.description}
//                   </p>
//                 </div>

//                 {/* Creator Info */}
//                 <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
//                   <Avatar>
//                     <AvatarImage
//                       src={
//                         paymentLink.creator?.avatar ||
//                         "/placeholder.svg?height=40&width=40"
//                       }
//                       alt={paymentLink.creator?.name || "Creator"}
//                     />
//                     <AvatarFallback>
//                       {paymentLink.creator?.name?.charAt(0) || "C"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">
//                       {paymentLink.creator?.name || "Creator"}
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       {paymentLink.creator?.bio || "Digital creator"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="flex items-center space-x-6 text-sm">
//                   <div className="flex items-center space-x-1">
//                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     <span className="font-medium">4.9</span>
//                     <span className="text-muted-foreground">(324 reviews)</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Users className="h-4 w-4 text-muted-foreground" />
//                     <span>{paymentLink.purchases} purchases</span>
//                   </div>
//                 </div>

//                 {/* File Info for Products */}
//                 {paymentLink.type === "PRODUCT" && paymentLink.fileName && (
//                   <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                     <div className="flex items-center space-x-2">
//                       <Download className="h-4 w-4 text-blue-600" />
//                       <div>
//                         <p className="font-medium text-blue-900 dark:text-blue-100">
//                           Digital Download
//                         </p>
//                         <p className="text-sm text-blue-700 dark:text-blue-300">
//                           {paymentLink.fileName} •{" "}
//                           {formatFileSize(paymentLink.fileSize || 0)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Payment Form */}
//             <div className="space-y-6">
//               <Card className="sticky top-8">
//                 <CardHeader>
//                   <CardTitle className="flex items-center justify-between">
//                     <span>Complete Purchase</span>
//                     <div className="text-right">
//                       <div className="text-2xl font-bold">
//                         ${paymentLink.price.toFixed(2)}
//                       </div>
//                       <div className="text-sm text-muted-foreground">
//                         {paymentLink.currency}
//                       </div>
//                     </div>
//                   </CardTitle>
//                   <CardDescription>
//                     Secure payment powered by Base blockchain
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="name">Full Name</Label>
//                       <Input
//                         id="name"
//                         placeholder="Enter your full name"
//                         value={customerInfo.name}
//                         onChange={(e) =>
//                           setCustomerInfo((prev) => ({
//                             ...prev,
//                             name: e.target.value,
//                           }))
//                         }
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email Address</Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="Enter your email"
//                         value={customerInfo.email}
//                         onChange={(e) =>
//                           setCustomerInfo((prev) => ({
//                             ...prev,
//                             email: e.target.value,
//                           }))
//                         }
//                       />
//                     </div>

//                     {paymentLink.allowTips && (
//                       <div className="space-y-2">
//                         <Label htmlFor="tip">Add a tip (optional)</Label>
//                         <div className="flex space-x-2">
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setTipAmount("5")}
//                             className={
//                               tipAmount === "5"
//                                 ? "bg-primary text-primary-foreground"
//                                 : ""
//                             }
//                           >
//                             $5
//                           </Button>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setTipAmount("10")}
//                             className={
//                               tipAmount === "10"
//                                 ? "bg-primary text-primary-foreground"
//                                 : ""
//                             }
//                           >
//                             $10
//                           </Button>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setTipAmount("25")}
//                             className={
//                               tipAmount === "25"
//                                 ? "bg-primary text-primary-foreground"
//                                 : ""
//                             }
//                           >
//                             $25
//                           </Button>
//                           <Input
//                             placeholder="Custom"
//                             value={tipAmount}
//                             onChange={(e) => setTipAmount(e.target.value)}
//                             className="w-20"
//                           />
//                         </div>
//                       </div>
//                     )}

//                     <Separator />

//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span>Price</span>
//                         <span>${paymentLink.price.toFixed(2)}</span>
//                       </div>
//                       {Number.parseFloat(tipAmount) > 0 && (
//                         <div className="flex justify-between">
//                           <span>Tip</span>
//                           <span>
//                             ${Number.parseFloat(tipAmount).toFixed(2)}
//                           </span>
//                         </div>
//                       )}
//                       <div className="flex justify-between font-bold text-lg">
//                         <span>Total</span>
//                         <span>${totalAmount.toFixed(2)}</span>
//                       </div>
//                     </div>

//                     {/* Base Pay Integration */}
//                     <BasePayIntegration
//                       paymentRequest={{
//                         amount: totalAmount,
//                         currency: paymentLink.currency,
//                         recipient:
//                           process.env.NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS || "",
//                         metadata: {
//                           orderId: paymentLink.id,
//                           customerEmail: customerInfo.email,
//                           productId: paymentLink.id,
//                         },
//                       }}
//                       onSuccess={handlePaymentSuccess}
//                       onError={handlePaymentError}
//                       disabled={!customerInfo.name || !customerInfo.email}
//                     >
//                       Pay ${totalAmount.toFixed(2)} with Base
//                     </BasePayIntegration>

//                     <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
//                       <div className="flex items-center space-x-1">
//                         <Shield className="h-3 w-3" />
//                         <span>Secure payment</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Clock className="h-3 w-3" />
//                         <span>Instant delivery</span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Trust Indicators */}
//               <Card>
//                 <CardContent className="pt-6">
//                   <div className="space-y-3">
//                     <h4 className="font-medium">Why choose us?</h4>
//                     <div className="space-y-2 text-sm text-muted-foreground">
//                       <div className="flex items-center space-x-2">
//                         <Shield className="h-4 w-4 text-green-500" />
//                         <span>Secure payments with Base blockchain</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Download className="h-4 w-4 text-blue-500" />
//                         <span>Instant digital delivery</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Heart className="h-4 w-4 text-red-500" />
//                         <span>30-day money-back guarantee</span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function formatFileSize(bytes: number) {
//   if (bytes === 0) return "0 Bytes";
//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return (
//     Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   );
// }
import React from "react";

const pay = () => {
  return <div>pay</div>;
};

export default pay;

import CheckoutComp from "@/app/_component/CheckoutComp/page";

export const metadata = {
  title: "Checkout · FreshCart",
};

export default async function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <CheckoutComp />
      </div>
    </main>
  );
}

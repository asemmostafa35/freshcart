import CartComp from "@/app/_component/CartComp/page";

export const metadata = {
  title: "Shopping Cart · FreshCart",
};

export default async function CartPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <CartComp />
      </div>
    </main>
  );
}

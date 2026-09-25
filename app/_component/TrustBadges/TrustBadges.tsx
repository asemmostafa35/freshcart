import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over 500 EGP",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    subtitle: "14-day return policy",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "100% secure checkout",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "Contact us anytime",
  },
];

export default function TrustBadges() {
  return (
    <div className="w-full bg-green-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {badges.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#00c758]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{title}</h4>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

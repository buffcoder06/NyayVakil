import type { Metadata } from "next";
import { Bell, Briefcase, CalendarDays, FileText, IndianRupee, Users } from "lucide-react";
import { Logo, LogoMark, Wordmark } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Sign In – NyayVakil",
  description: "Sign in to your NyayVakil account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#14213D] flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full" />
        </div>

        <div className="max-w-md text-center relative z-10">
          {/* Logo */}
          <div className="flex flex-col items-center gap-5 mb-8">
            <LogoMark tone="dark" size="xl" className="shadow-lg shadow-black/20" />
            <Wordmark tone="dark" size="xl" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/70">
              Legal Practice Manager
            </span>
          </div>
          <div className="w-16 h-0.5 bg-gold-bright/60 mx-auto mb-8" />

          <p className="text-white/60 text-sm leading-relaxed mb-12">
            Designed for Indian advocates and law firms. Manage cases, hearings,
            fees, and clients — all in one place.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { icon: CalendarDays, label: "Court Diary" },
              { icon: IndianRupee, label: "Fee Tracking" },
              { icon: Briefcase, label: "Case Management" },
              { icon: Users, label: "Client Records" },
              { icon: FileText, label: "Documents" },
              { icon: Bell, label: "Reminders" },
            ].map((f) => (
              <div
                key={f.label}
                className="bg-white/10 rounded-xl p-3 text-sm flex items-center gap-2.5 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <f.icon className="h-4 w-4 shrink-0 text-gold-bright" />
                <span className="text-white/80 font-medium">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Bottom trust badge */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/40 text-xs">
              Trusted by advocates across India
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-cream min-h-screen">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo tone="light" size="md" tagline />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

// Password reset by OTP needs an SMS/email provider, which isn't connected yet.
// Until then this page tells users exactly how to get their password reset,
// instead of pretending to send an OTP.

import Link from "next/link";
import { ArrowLeft, KeyRound, Mail, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_SUPPORT_EMAIL } from "@/config";

export default function ForgotPasswordPage() {
  const subject = encodeURIComponent("Password reset request – NyayVakil");
  const body = encodeURIComponent(
    "Hello,\n\nPlease reset the password for my NyayVakil account.\n\nRegistered email:\nRegistered mobile number:\nChamber name:\n\nThank you."
  );

  return (
    <div className="w-full">
      <Card className="w-full shadow-lg border-0 bg-white">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-bright/15">
            <KeyRound className="h-6 w-6 text-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Forgot your password?</CardTitle>
          <CardDescription className="text-slate-500 mt-1">
            We&apos;ll help you get back into your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="flex gap-3 rounded-lg border border-slate-200 p-4">
            <Mail className="h-5 w-5 shrink-0 text-[#14213D] mt-0.5" />
            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-900">Chamber owner (advocate)</p>
              <p className="mt-1">
                Email{" "}
                <a
                  href={`mailto:${APP_SUPPORT_EMAIL}?subject=${subject}&body=${body}`}
                  className="font-medium text-[#14213D] hover:underline"
                >
                  {APP_SUPPORT_EMAIL}
                </a>{" "}
                from your registered email address. We&apos;ll verify it and reset your password, usually
                within one working day.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg border border-slate-200 p-4">
            <Users className="h-5 w-5 shrink-0 text-[#14213D] mt-0.5" />
            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-900">Junior, clerk or admin</p>
              <p className="mt-1">Ask the advocate who runs your chamber to contact us for a reset.</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Resetting by SMS or email code is coming soon.
          </p>

          <Link
            href="/login"
            className="flex pointer-coarse:min-h-11 items-center justify-center gap-1.5 text-sm font-medium text-[#14213D] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

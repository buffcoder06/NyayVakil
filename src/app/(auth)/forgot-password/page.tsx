"use client";

import { useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Scale,
  Loader2,
  ArrowLeft,
  Mail,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMAS
// ─────────────────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  identifier: z
    .string()
    .min(1, "Email or phone is required")
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[6-9]\d{9}$/.test(val),
      { message: "Enter a valid email or 10-digit mobile number" }
    ),
});

const step2Schema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

const step3Schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;
type Step3Values = z.infer<typeof step3Schema>;

// ─────────────────────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Verify Identity", icon: Mail },
  { label: "Enter OTP", icon: KeyRound },
  { label: "New Password", icon: ShieldCheck },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const Icon = step.icon;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? "bg-[#1e3a5f] border-[#1e3a5f] text-white"
                    : isActive
                    ? "border-[#1e3a5f] bg-white text-[#1e3a5f]"
                    : "border-slate-200 bg-white text-slate-300"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium hidden sm:block ${
                  isActive
                    ? "text-[#1e3a5f]"
                    : isCompleted
                    ? "text-[#1e3a5f]/60"
                    : "text-slate-300"
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-12 sm:w-16 mx-1 mb-4 sm:mb-5 transition-all ${
                  stepNum < currentStep ? "bg-[#1e3a5f]" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: IDENTIFIER
// ─────────────────────────────────────────────────────────────────────────────

function Step1Form({
  onSuccess,
}: {
  onSuccess: (identifier: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const hydrated = useHydrated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
  });

  const onSubmit = async (data: Step1Values) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP Sent!", {
        description: `A 6-digit OTP has been sent to ${data.identifier}`,
      });
      onSuccess(data.identifier);
    } catch {
      toast.error("Failed to send OTP", {
        description: "Please check the email or phone and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="identifier" className="text-slate-700 font-medium">
          Email or Phone Number
        </Label>
        <Input
          id="identifier"
          type="text"
          placeholder="your@email.in or 98XXXXXXXX"
          autoComplete="email"
          aria-invalid={!!errors.identifier}
          className="h-10 text-sm"
          {...register("identifier")}
        />
        {errors.identifier && (
          <p className="text-xs text-red-500">{errors.identifier.message}</p>
        )}
        <p className="text-xs text-slate-400 mt-1">
          We&apos;ll send a one-time password to verify your identity.
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !hydrated}
        className="w-full h-10 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-medium rounded-lg transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending OTP...
          </>
        ) : (
          "Send OTP"
        )}
      </Button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: OTP
// ─────────────────────────────────────────────────────────────────────────────

function Step2Form({
  identifier,
  onSuccess,
  onResend,
}: {
  identifier: string;
  onSuccess: () => void;
  onResend: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const hydrated = useHydrated();
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
  });

  const onSubmit = async (data: Step2Values) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Mock OTP validation: accept any 6-digit code
      if (data.otp === "000000") {
        toast.error("Invalid OTP", {
          description: "Please enter the OTP sent to your email/phone.",
        });
        return;
      }
      toast.success("OTP Verified!", {
        description: "Now set your new password.",
      });
      onSuccess();
    } catch {
      toast.error("Verification failed", {
        description: "Invalid or expired OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsResending(false);
    toast.success("OTP Resent", {
      description: `A new OTP has been sent to ${identifier}`,
    });
    onResend();
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Context */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-3 text-sm">
        <p className="text-slate-500 text-xs">OTP sent to</p>
        <p className="font-semibold text-slate-800 mt-0.5 truncate">{identifier}</p>
      </div>

      {/* OTP Input */}
      <div className="space-y-1.5">
        <Label htmlFor="otp" className="text-slate-700 font-medium">
          Enter 6-Digit OTP
        </Label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="- - - - - -"
          aria-invalid={!!errors.otp}
          className="h-12 text-center text-xl font-bold tracking-[0.5em] letter-spacing-widest"
          {...register("otp")}
        />
        {errors.otp && (
          <p className="text-xs text-red-500">{errors.otp.message}</p>
        )}
        <p className="text-xs text-slate-400">
          For demo, enter any 6-digit code (not 000000).
        </p>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !hydrated}
        className="w-full h-10 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-medium rounded-lg transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>

      {/* Resend */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-sm text-[#1e3a5f] hover:underline font-medium inline-flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isResending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Resend OTP
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3: NEW PASSWORD
// ─────────────────────────────────────────────────────────────────────────────

function Step3Form({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const hydrated = useHydrated();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
  });

  const onSubmit = async (_data: Step3Values) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password Reset!", {
        description: "Your password has been changed successfully.",
      });
      onSuccess();
    } catch {
      toast.error("Reset failed", {
        description: "Could not reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* New Password */}
      <div className="space-y-1.5">
        <Label htmlFor="newPassword" className="text-slate-700 font-medium">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNew ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            className="h-10 text-sm pr-10"
            {...register("newPassword")}
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            className="h-10 text-sm pr-10"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Password strength hint */}
      <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-600">Password requirements:</p>
        <ul className="space-y-0.5 pl-3">
          <li className="list-disc">At least 8 characters</li>
          <li className="list-disc">At least one uppercase letter (A–Z)</li>
          <li className="list-disc">At least one number (0–9)</li>
        </ul>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !hydrated}
        className="w-full h-10 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-medium rounded-lg transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Resetting Password...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS STATE
// ─────────────────────────────────────────────────────────────────────────────

function SuccessView() {
  return (
    <div className="text-center py-4 space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900">Password Reset!</h3>
        <p className="text-sm text-slate-500 mt-1">
          Your password has been reset successfully. You can now sign in with
          your new password.
        </p>
      </div>
      <Link
        href="/login"
        className="inline-flex items-center justify-center w-full h-10 bg-[#1e3a5f] hover:bg-[#162d4a] text-white text-sm font-medium rounded-lg transition-colors"
      >
        Back to Sign In
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | "done">(1);
  const [identifier, setIdentifier] = useState("");
  const [otpKey, setOtpKey] = useState(0); // used to reset OTP form on resend

  const stepTitles: Record<1 | 2 | 3, { title: string; description: string }> =
    {
      1: {
        title: "Forgot Password?",
        description: "Enter your registered email or phone to receive an OTP",
      },
      2: {
        title: "Verify OTP",
        description: "Enter the 6-digit code we sent to your contact",
      },
      3: {
        title: "Set New Password",
        description: "Choose a strong password for your NyayVakil account",
      },
    };

  const currentTitle = step !== "done" ? stepTitles[step] : null;

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardHeader className="text-center pb-2">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <div className="w-9 h-9 bg-[#1e3a5f] rounded-lg flex items-center justify-center shadow-sm">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#1e3a5f] tracking-tight">
            NyayVakil
          </span>
        </div>

        {/* Step Indicator */}
        {step !== "done" && <StepIndicator currentStep={step as number} />}

        {currentTitle && (
          <>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {currentTitle.title}
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1">
              {currentTitle.description}
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent className="pt-4">
        {step === 1 && (
          <Step1Form
            onSuccess={(id) => {
              setIdentifier(id);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <Step2Form
            key={otpKey}
            identifier={identifier}
            onSuccess={() => setStep(3)}
            onResend={() => setOtpKey((k) => k + 1)}
          />
        )}

        {step === 3 && (
          <Step3Form onSuccess={() => setStep("done")} />
        )}

        {step === "done" && <SuccessView />}
      </CardContent>

      {step !== "done" && (
        <CardFooter className="justify-center border-t border-slate-100 py-4">
          {step === 1 ? (
            <Link
              href="/login"
              className="text-sm text-slate-500 hover:text-[#1e3a5f] inline-flex items-center gap-1.5 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => (s === 3 ? 2 : 1) as 1 | 2)}
              className="text-sm text-slate-500 hover:text-[#1e3a5f] inline-flex items-center gap-1.5 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Go back
            </button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

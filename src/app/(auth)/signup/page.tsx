"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Scale,
  Loader2,
  Briefcase,
  GraduationCap,
  ClipboardList,
  ShieldCheck,
  CheckCircle2,
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
import { useAuthStore } from "@/lib/store/auth-store";
import type { UserRole } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

const signupSchema = z
  .object({
    role: z.enum(["advocate", "junior", "clerk", "admin"] as const, {
      error: () => ({ message: "Please select your role" }),
    }),
    name: z.string().min(2, "Full name must be at least 2 characters"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    barCouncilNumber: z.string().optional(),
    chamberName: z.string().min(1, "Chamber or firm name is required"),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) =>
      data.role !== "advocate" ||
      (data.barCouncilNumber && data.barCouncilNumber.trim().length > 0),
    {
      message: "Bar Council Number is required for advocates",
      path: ["barCouncilNumber"],
    }
  );

type SignupFormValues = z.infer<typeof signupSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// ROLE CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const ROLES: {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "advocate",
    label: "Advocate",
    description: "Senior advocate / partner",
    icon: <Scale className="w-5 h-5" />,
  },
  {
    value: "junior",
    label: "Junior",
    description: "Junior advocate",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    value: "clerk",
    label: "Clerk",
    description: "Office clerk / support",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Office administrator",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: undefined,
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      barCouncilNumber: "",
      chamberName: "",
      acceptTerms: false,
    },
  });

  const selectedRole = watch("role");

  // ── Handlers ──────────────────────────────────────────────────────────────

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      await signup({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        barCouncilNumber: data.barCouncilNumber || undefined,
        chamberName: data.chamberName,
      });

      toast.success("Account created!", {
        description: `Welcome to NyayVakil, ${data.name.split(" ")[0]}!`,
      });
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error("Registration failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

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

        <CardTitle className="text-2xl font-bold text-slate-900">
          Create your account
        </CardTitle>
        <CardDescription className="text-slate-500 mt-1">
          Join thousands of legal professionals across India
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">
              Your Role <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((role) => {
                    const isSelected = field.value === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => field.onChange(role.value)}
                        className={`relative flex items-start gap-2.5 p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? "border-[#1e3a5f] bg-[#1e3a5f]/5"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div
                          className={`mt-0.5 shrink-0 ${
                            isSelected ? "text-[#1e3a5f]" : "text-slate-400"
                          }`}
                        >
                          {role.icon}
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`font-semibold text-sm ${
                              isSelected ? "text-[#1e3a5f]" : "text-slate-700"
                            }`}
                          >
                            {role.label}
                          </p>
                          <p className="text-xs text-slate-400 leading-snug mt-0.5">
                            {role.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#1e3a5f] absolute top-2 right-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-slate-700 font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Adv. Priya Sharma"
              autoComplete="name"
              aria-invalid={!!errors.name}
              className="h-10 text-sm"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Phone & Email row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-slate-700 font-medium">
                Phone <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium select-none">
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="98XXXXXXXX"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  className="h-10 text-sm pl-10"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@chamber.in"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="h-10 text-sm"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Bar Council Number (advocates only) */}
          {selectedRole === "advocate" && (
            <div className="space-y-1.5">
              <Label
                htmlFor="barCouncilNumber"
                className="text-slate-700 font-medium"
              >
                Bar Council Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="barCouncilNumber"
                type="text"
                placeholder="e.g. MH/1234/2010"
                aria-invalid={!!errors.barCouncilNumber}
                className="h-10 text-sm"
                {...register("barCouncilNumber")}
              />
              {errors.barCouncilNumber && (
                <p className="text-xs text-red-500">
                  {errors.barCouncilNumber.message}
                </p>
              )}
            </div>
          )}

          {/* Chamber / Firm Name */}
          <div className="space-y-1.5">
            <Label htmlFor="chamberName" className="text-slate-700 font-medium">
              Chamber / Firm Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="chamberName"
              type="text"
              placeholder="e.g. Sharma & Associates"
              aria-invalid={!!errors.chamberName}
              className="h-10 text-sm"
              {...register("chamberName")}
            />
            {errors.chamberName && (
              <p className="text-xs text-red-500">{errors.chamberName.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                className="h-10 text-sm pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="confirmPassword"
              className="text-slate-700 font-medium"
            >
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                className="h-10 text-sm pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="space-y-1.5">
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field }) => (
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#1e3a5f] accent-[#1e3a5f] cursor-pointer shrink-0"
                    aria-invalid={!!errors.acceptTerms}
                  />
                  <span className="text-sm text-slate-600 leading-snug group-hover:text-slate-800 transition-colors select-none">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-[#1e3a5f] hover:underline font-medium"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#1e3a5f] hover:underline font-medium"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              )}
            />
            {errors.acceptTerms && (
              <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-100 py-4">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#1e3a5f] font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/store/auth-store";
import { apiFetch } from "@/lib/http";
import type { User as UserProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit2,
  Save,
  Lock,
  Upload,
  CheckCircle2,
  Loader2,
  BookOpen,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  advocate: "Advocate",
  junior: "Junior Advocate",
  clerk: "Clerk",
  admin: "Admin",
};

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  barCouncilNumber: z.string().optional(),
  chamberName: z.string().optional(),
  specialization: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      barCouncilNumber: user?.barCouncilNumber ?? "",
      chamberName: user?.chamberName ?? "",
      specialization: user?.specialization?.join(", ") ?? "",
    },
  });

  // The cached profile loads after the first render — fill the form once it arrives
  const { reset: resetProfile } = profileForm;
  useEffect(() => {
    if (!user) return;
    resetProfile({
      name: user.name,
      email: user.email,
      phone: user.phone,
      barCouncilNumber: user.barCouncilNumber ?? "",
      chamberName: user.chamberName ?? "",
      specialization: user.specialization?.join(", ") ?? "",
    });
  }, [user, resetProfile]);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSaveProfile(values: ProfileFormValues) {
    setSavingProfile(true);
    try {
      const updated = await apiFetch<UserProfile>("/api/auth/me", {
        method: "PUT",
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          barCouncilNumber: values.barCouncilNumber,
          chamberName: values.chamberName,
          specialization: values.specialization
            ? values.specialization.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
        },
      });
      setUser(updated);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function onChangePassword(values: PasswordFormValues) {
    setSavingPassword(true);
    try {
      await apiFetch("/api/auth/password", {
        method: "POST",
        body: { currentPassword: values.currentPassword, newPassword: values.newPassword },
      });
      passwordForm.reset();
      toast.success("Password changed. Other devices have been signed out.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to change password.";
      if (/current password/i.test(message)) passwordForm.setError("currentPassword", { message });
      else toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  }

  const initials = user ? getInitials(user.name) : "U";

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account details and preferences</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-[#14213D] text-white text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-slate-600 hover:text-[#14213D] transition-colors"
                title="Change photo"
              >
                <Upload className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{user?.name ?? "User"}</h2>
                <Badge className="bg-[#14213D]/10 text-[#14213D] border-[#14213D]/20 text-xs">
                  {ROLE_LABELS[user?.role ?? "advocate"]}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
              {user?.chamberName && (
                <p className="text-sm text-slate-600 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  {user.chamberName}
                </p>
              )}
              {user?.barCouncilNumber && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  Bar Council No: {user.barCouncilNumber}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="details" className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            Personal Details
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Personal Details Tab */}
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-[#14213D]" />
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <Input className="pl-9" placeholder="Adv. Rajesh Sharma" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <Input className="pl-9" placeholder="advocate@chambers.in" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <Input className="pl-9" placeholder="9876543210" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="barCouncilNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bar Council Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <Input className="pl-9" placeholder="MAH/1234/2015" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="chamberName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chamber / Firm Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <Input className="pl-9" placeholder="Sharma & Associates" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                              <Input className="pl-9" placeholder="Criminal, Civil, Family" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {user?.specialization && user.specialization.length > 0 && (
                    <div>
                      <Label className="text-xs text-slate-500 mb-2 block">Current Specializations</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {user.specialization.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={savingProfile} className="bg-[#14213D] hover:bg-[#16304f]">
                      {savingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#14213D]" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4 max-w-md">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter current password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Min. 8 characters" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Re-enter new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={savingPassword} className="bg-[#14213D] hover:bg-[#16304f]">
                    {savingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#14213D]" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">Role</p>
                  <p className="text-xs text-slate-500">Your access level in the system</p>
                </div>
                <Badge className="bg-[#14213D]/10 text-[#14213D] border-[#14213D]/20">
                  {ROLE_LABELS[user?.role ?? "advocate"]}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">Member Since</p>
                  <p className="text-xs text-slate-500">Account creation date</p>
                </div>
                <span className="text-sm text-slate-600">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">User ID</p>
                  <p className="text-xs text-slate-500">Your unique identifier</p>
                </div>
                <span className="text-xs font-mono text-slate-500">{user?.id}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

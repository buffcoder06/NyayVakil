// The old free-trial form only pretended to sign people up. Every "Start Free Trial"
// button now leads to the real sign-up, which creates the chamber immediately.
import { redirect } from "next/navigation";

export default function FreeTrialPage() {
  redirect("/signup");
}

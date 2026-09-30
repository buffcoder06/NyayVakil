// A real screenshot of the app inside a simple browser frame (marketing pages).
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductShot({
  src,
  alt,
  width,
  height,
  url = "www.nyayvakil.in",
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  url?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-navy/10", className)}>
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-0.5 text-xs text-slate-500">{url}</span>
      </div>
      <Image src={src} alt={alt} width={width} height={height} priority={priority} className="block h-auto w-full" sizes="(min-width: 1024px) 1024px, 100vw" />
    </figure>
  );
}

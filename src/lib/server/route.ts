// src/lib/server/route.ts
// Wrapper for authenticated API route handlers. It resolves the session, enforces
// roles, and turns thrown errors into consistent { success, message } responses,
// so handlers only contain the happy path.

import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma, type UserRole } from "@prisma/client";
import { getSession, type Session } from "@/lib/auth/session";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const notFound = (what = "Record") => new ApiError(404, `${what} not found.`);

/** Roles allowed to touch money (fees, payments, expenses). */
export const FINANCE_ROLES: UserRole[] = ["advocate", "admin"];
/** Roles allowed to create/edit/close matters. */
export const MATTER_EDIT_ROLES: UserRole[] = ["advocate", "admin", "junior"];

type RouteParams = Record<string, string>;

interface HandlerContext<P extends RouteParams> {
  req: NextRequest;
  session: Session;
  params: P;
}

interface Options {
  /** Roles allowed to call this handler; omit to allow any signed-in user. */
  roles?: UserRole[];
  /** HTTP status for a successful response (default 200). */
  status?: number;
}

export function withAuth<P extends RouteParams = RouteParams>(
  handler: (ctx: HandlerContext<P>) => Promise<unknown>,
  options: Options = {}
) {
  return async (req: NextRequest, context: { params: Promise<P> }): Promise<Response> => {
    try {
      const session = await getSession();
      if (!session) throw new ApiError(401, "Please sign in again.");
      if (options.roles && !options.roles.includes(session.role)) {
        throw new ApiError(403, "You don't have permission to do this.");
      }

      const params = context?.params ? await context.params : ({} as P);
      const data = await handler({ req, session, params });
      if (data instanceof Response) return data;
      return NextResponse.json({ success: true, data: data ?? null }, { status: options.status ?? 200 });
    } catch (err) {
      return errorResponse(err);
    }
  };
}

export function errorResponse(err: unknown): Response {
  if (err instanceof ApiError) {
    return NextResponse.json({ success: false, message: err.message }, { status: err.status });
  }
  if (err instanceof ZodError) {
    const issue = err.issues[0];
    const field = issue?.path.join(".");
    return NextResponse.json(
      { success: false, message: field ? `${field}: ${issue.message}` : issue?.message ?? "Invalid input.", field },
      { status: 400 }
    );
  }
  if (err instanceof SyntaxError) {
    return NextResponse.json({ success: false, message: "Invalid JSON body." }, { status: 400 });
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") return errorResponse(notFound());
    if (err.code === "P2002") {
      return NextResponse.json({ success: false, message: "This record already exists." }, { status: 409 });
    }
    if (err.code === "P2003") {
      return NextResponse.json({ success: false, message: "A linked record does not exist." }, { status: 400 });
    }
  }

  console.error("[api]", err);
  return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
}

/** Reads and validates a JSON body with a Zod schema. */
export async function readBody<T>(req: NextRequest, schema: { parse: (v: unknown) => T }): Promise<T> {
  return schema.parse(await req.json());
}

/** Parses optional page/pageSize query params, capping pageSize. */
export function readPagination(s: URLSearchParams, defaultSize = 50, maxSize = 500) {
  const page = Math.max(1, Number(s.get("page")) || 1);
  const pageSize = Math.min(maxSize, Math.max(1, Number(s.get("pageSize")) || defaultSize));
  return { page, pageSize };
}

/** Returns a query param or undefined (treats "" and "all" as unset). */
export function param(s: URLSearchParams, key: string): string | undefined {
  const v = s.get(key);
  return v && v !== "all" ? v : undefined;
}

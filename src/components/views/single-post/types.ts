import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";

export type Post = inferProcedureOutput<AppRouter["post"]["getById"]>;

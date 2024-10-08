import { PrismaClient } from "@prisma/client";
import * as runtime from "@prisma/client/runtime/library";

type PrismaTransaction = Omit<PrismaClient, runtime.ITXClientDenyList>;

export type PrismaClientTransaction = PrismaTransaction | PrismaClient;

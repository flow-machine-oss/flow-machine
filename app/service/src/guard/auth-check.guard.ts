import { isNil, isString, memoize } from "es-toolkit";
import { type JWTVerifyGetKey, createRemoteJWKSet, jwtVerify } from "jose";
import { ResultAsync, err, ok } from "neverthrow";
import z from "zod";
import { config } from "@/lib/config";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";

export const currentUserSchema = z.object({
  id: z.string(),
  createdAt: z.number().transform((timestamp) => new Date(timestamp * 1000)),
  updatedAt: z.number().transform((timestamp) => new Date(timestamp * 1000)),

  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),

  organizationId: z.string(),
  organizationRole: z.enum(["org:admin", "org:member"] as const),
});

const getBearerToken = (headers: Record<string, unknown>) => {
  const authorization = headers.authorization;
  if (
    isNil(authorization) ||
    !isString(authorization) ||
    !authorization.startsWith("Bearer ")
  ) {
    return err(Err.code("unauthorized"));
  }
  const token = authorization.slice(7).trim();
  return token.length > 0 ? ok(token) : err(Err.code("unauthorized"));
};

const makeGetDecodingKeys = memoize(() => {
  return createRemoteJWKSet(new URL(config.clerk.jwksUrl));
});

const decodeToken = async (token: string, getKey: JWTVerifyGetKey) => {
  const safeJwtVerify = ResultAsync.fromThrowable(jwtVerify);
  const result = await safeJwtVerify(token, getKey, {
    issuer: config.clerk.issuer,
  });

  if (result.isErr()) {
    return err(Err.code("unauthorized", { cause: result.error }));
  }
  const parseResult = currentUserSchema.safeParse(result.value.payload);

  if (!parseResult.success) {
    return err(Err.code("unauthorized", { cause: parseResult.error }));
  }
  return ok(parseResult.data);
};

export const authCheck = async (
  ctx: Ctx,
  headers: Record<string, string | unknown>,
) => {
  const tokenResult = getBearerToken(headers);

  if (tokenResult.isErr()) {
    return tokenResult;
  }
  const getDecodingKey = makeGetDecodingKeys();
  const decodeResult = await decodeToken(tokenResult.value, getDecodingKey);

  if (decodeResult.isErr()) {
    console.error(decodeResult.error);
    return decodeResult;
  }
  return decodeResult;
};

export type AuthCheck = typeof authCheck;

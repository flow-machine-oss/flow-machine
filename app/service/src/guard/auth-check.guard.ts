import { isNil, isString, memoize } from "es-toolkit";
import { type JWTVerifyGetKey, createRemoteJWKSet, jwtVerify } from "jose";
import { ResultAsync, err, ok } from "neverthrow";
import z from "zod";
import { config } from "@/lib/config";
import type { Ctx } from "@/lib/ctx";
import { Err } from "@/lib/err";
import { newId } from "@/lib/id";
import { userTable } from "@/schema/user.schema";

const extendedJwtPayloadSchema = z.object({
  id: z.string(),
  createdAt: z.number().transform((timestamp) => new Date(timestamp * 1000)),
  updatedAt: z.number().transform((timestamp) => new Date(timestamp * 1000)),

  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
});

const getBearerToken = (headers: Record<string, unknown>) => {
  const authorization = headers["authorization"];
  if (
    isNil(authorization) ||
    !isString(authorization) ||
    authorization.startsWith("Bearer ")
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
  const parseResult = extendedJwtPayloadSchema.safeParse(result.value.payload);

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
    return decodeResult;
  }
  const existingUser = await ctx.db.query.user.findFirst({
    where: { externalId: decodeResult.value.id },
  });

  if (!isNil(existingUser)) {
    return ok(existingUser);
  }
  await ctx.db.insert(userTable).values({
    id: newId(),
    createdAt: decodeResult.value.createdAt,
    updatedAt: decodeResult.value.updatedAt,

    email: decodeResult.value.email,
    firstName: decodeResult.value.firstName,
    lastName: decodeResult.value.lastName,

    externalId: decodeResult.value.id,
  });

  const newUser = await ctx.db.query.user.findFirst({
    where: { externalId: decodeResult.value.id },
  });
  if (isNil(newUser)) {
    return err(Err.code("unknown"));
  }

  return ok(newUser);
};
export type AuthCheck = typeof authCheck;

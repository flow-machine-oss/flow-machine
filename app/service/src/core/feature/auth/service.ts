import type { Result } from "neverthrow";
import z from "zod";
import { Err } from "@/common/err/err";
import type { MemberEntity } from "@/core/domain/iam/member/entity";
import type { SessionEntity } from "@/core/domain/iam/session/entity";
import type { UserEntity } from "@/core/domain/iam/user/entity";

const authServiceInputSchema = {
  getActiveSession: z.object({
    headers: z.instanceof(Headers),
  }),
  getActiveUser: z.object({
    headers: z.instanceof(Headers),
  }),
  getActiveMember: z.object({
    headers: z.instanceof(Headers),
  }),
};

interface AuthService {
  getActiveSession(
    input: z.infer<typeof authServiceInputSchema.getActiveSession>,
  ): Promise<Result<SessionEntity, Err>>;
  getActiveUser(
    input: z.infer<typeof authServiceInputSchema.getActiveUser>,
  ): Promise<Result<UserEntity, Err>>;
  getActiveMember(
    input: z.infer<typeof authServiceInputSchema.getActiveMember>,
  ): Promise<Result<MemberEntity, Err>>;
}

export { type AuthService, authServiceInputSchema };

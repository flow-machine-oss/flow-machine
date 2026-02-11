import { NextRequest, NextResponse } from "next/server";
import type { GitRepositoryHttpClient } from "@/backend/http-client/git-repository/git-repository-http-client";
import { gitRepositoryDomainCodec } from "@/backend/http-route-handler/git-repository/git-repository-route-handler-codec";
import type { GitRepositoryDomain } from "@/domain/entity/git-repository/git-repository-domain-schema";
import {
  createGitRepositoryServicePortInSchema,
  deleteGitRepositoryServicePortInSchema,
  getGitRepositoryServicePortInSchema,
  updateGitRepositoryServicePortInSchema,
} from "@/domain/port/git-repository/git-repository-service-port";
import { type HttpEnvelope, okHttpEnvelope } from "@/lib/http/http-schema";

type MakeGitRepositoryRouteHandlerIn = {
  gitRepositoryHttpClient: GitRepositoryHttpClient;
};

export const makeGitRepositoryRouteHandler = ({
  gitRepositoryHttpClient,
}: MakeGitRepositoryRouteHandlerIn) => ({
  create: async (request: NextRequest) => {
    const body = await request.json();

    const { body: payload } = createGitRepositoryServicePortInSchema.parse({
      body,
    });

    await gitRepositoryHttpClient.create({ payload });

    return NextResponse.json(okHttpEnvelope());
  },

  deleteById: async (
    _: NextRequest,
    ctx: RouteContext<"/api/v1/git-repository/[id]">,
  ) => {
    const params = await ctx.params;

    const validatedInput = deleteGitRepositoryServicePortInSchema.parse({
      params,
    });

    await gitRepositoryHttpClient.deleteById({
      payload: { id: validatedInput.params.id },
    });

    return NextResponse.json(okHttpEnvelope());
  },

  getById: async (
    _: NextRequest,
    ctx: RouteContext<"/api/v1/git-repository/[id]">,
  ): Promise<NextResponse<HttpEnvelope<GitRepositoryDomain>>> => {
    const params = await ctx.params;

    const validatedInput = getGitRepositoryServicePortInSchema.parse({
      params,
    });

    const response = await gitRepositoryHttpClient.getById({
      payload: { id: validatedInput.params.id },
    });
    const data = gitRepositoryDomainCodec.decode(response.data);

    return NextResponse.json(okHttpEnvelope({ data }));
  },

  list: async (): Promise<
    NextResponse<HttpEnvelope<GitRepositoryDomain[]>>
  > => {
    const listGitRepositoriesClientResponse =
      await gitRepositoryHttpClient.list();

    const data = listGitRepositoriesClientResponse.data.map((item) =>
      gitRepositoryDomainCodec.decode(item),
    );

    return NextResponse.json(okHttpEnvelope({ data }));
  },

  updateById: async (
    request: NextRequest,
    ctx: RouteContext<"/api/v1/git-repository/[id]">,
  ) => {
    const body = await request.json();
    const params = await ctx.params;

    const validatedInput = updateGitRepositoryServicePortInSchema.parse({
      body,
      params,
    });
    await gitRepositoryHttpClient.updateById({
      payload: {
        id: validatedInput.params.id,
        body: validatedInput.body,
      },
    });

    return NextResponse.json(okHttpEnvelope());
  },
});

import { NextRequest, NextResponse } from "next/server";
import type { CredentialHttpClient } from "@/backend/http-client/credential/credential-http-client";
import { credentialDomainCodec } from "@/backend/http-route-handler/credential/credential-route-handler-codec";
import type { CredentialDomain } from "@/domain/entity/credential/credential-domain-schema";
import {
  createCredentialServicePortInSchema,
  deleteCredentialServicePortInSchema,
  getCredentialServicePortInSchema,
  updateCredentialServicePortInSchema,
} from "@/domain/port/credential/credential-service-port";
import { type HttpEnvelope, okHttpEnvelope } from "@/lib/http/http-schema";

type MakeCredentialRouteHandlerIn = {
  credentialHttpClient: CredentialHttpClient;
};

export const makeCredentialRouteHandler = ({
  credentialHttpClient,
}: MakeCredentialRouteHandlerIn) => ({
  create: async (request: NextRequest) => {
    const body = await request.json();

    const { body: payload } = createCredentialServicePortInSchema.parse({
      body,
    });

    await credentialHttpClient.create({ payload });

    return NextResponse.json(okHttpEnvelope());
  },

  deleteById: async (
    _: NextRequest,
    ctx: RouteContext<"/api/v1/credential/[id]">,
  ) => {
    const params = await ctx.params;

    const validatedInput = deleteCredentialServicePortInSchema.parse({
      params,
    });

    await credentialHttpClient.deleteById({
      payload: { id: validatedInput.params.id },
    });

    return NextResponse.json(okHttpEnvelope());
  },

  getById: async (
    _: NextRequest,
    ctx: RouteContext<"/api/v1/credential/[id]">,
  ): Promise<NextResponse<HttpEnvelope<CredentialDomain>>> => {
    const params = await ctx.params;

    const validatedInput = getCredentialServicePortInSchema.parse({ params });

    const response = await credentialHttpClient.getById({
      payload: { id: validatedInput.params.id },
    });
    const data = credentialDomainCodec.decode(response.data);

    return NextResponse.json(okHttpEnvelope({ data }));
  },

  list: async (): Promise<NextResponse<HttpEnvelope<CredentialDomain[]>>> => {
    const listCredentialsClientResponse = await credentialHttpClient.list();

    const data = listCredentialsClientResponse.data.map((item) =>
      credentialDomainCodec.decode(item),
    );

    return NextResponse.json(okHttpEnvelope({ data }));
  },

  updateById: async (
    request: NextRequest,
    ctx: RouteContext<"/api/v1/credential/[id]">,
  ) => {
    const body = await request.json();
    const params = await ctx.params;

    const validatedInput = updateCredentialServicePortInSchema.parse({
      body,
      params,
    });
    await credentialHttpClient.updateById({
      payload: {
        id: validatedInput.params.id,
        body: validatedInput.body,
      },
    });

    return NextResponse.json(okHttpEnvelope());
  },
});

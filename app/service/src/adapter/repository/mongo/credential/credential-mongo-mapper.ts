import type { CredentialMongoModel } from "@/adapter/repository/mongo/credential/credential-mongo-model";
import {
  CredentialEntity,
  type CredentialEntityProps,
} from "@/domain/entity/credential/credential-entity";

export const credentialDocToProps = (
  doc: CredentialMongoModel,
): CredentialEntityProps => {
  if (doc.type === "apiKey") {
    return {
      type: "apiKey",
      name: doc.name,
      apiKey: doc.apiKey,
      expiredAt: doc.expiredAt,
    };
  }
  return {
    type: "basic",
    name: doc.name,
    username: doc.username,
    password: doc.password,
    expiredAt: doc.expiredAt,
  };
};

export const credentialEntityToMongoModel = (
  entity: CredentialEntity,
): CredentialMongoModel => {
  const base = {
    _id: entity.id,
    name: entity.props.name,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    tenant: entity.tenant,
  };

  if (entity.props.type === "apiKey") {
    return {
      ...base,
      type: "apiKey",
      apiKey: entity.props.apiKey,
      expiredAt: entity.props.expiredAt,
    };
  }

  return {
    ...base,
    type: "basic",
    username: entity.props.username,
    password: entity.props.password,
    expiredAt: entity.props.expiredAt,
  };
};

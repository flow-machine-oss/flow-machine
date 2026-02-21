import { format } from "date-fns";
import type { GitRepositoryDomain } from "@/domain/entity/git-repository/git-repository-domain-schema";

type MakeGitRepositoryDomainServiceInput = {
  gitRepository: GitRepositoryDomain;
};

export const makeGitRepositoryDomainService = ({
  gitRepository,
}: MakeGitRepositoryDomainServiceInput) => ({
  getCreatedAt: () =>
    format(gitRepository.createdAt, "MMM d, yyyy, h:mm a"),
  getUpdatedAt: () =>
    format(gitRepository.updatedAt, "MMM d, yyyy, h:mm a"),
  getProviderDisplayName: () =>
    providerToDisplayName[gitRepository.integration.provider],
});

const providerToDisplayName = {
  github: "GitHub",
  gitlab: "GitLab",
} as const satisfies Record<
  GitRepositoryDomain["integration"]["provider"],
  string
>;

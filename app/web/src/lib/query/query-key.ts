export const makeListPromptsQueryKey = () => ["prompt"];

export const makeListAiAgentsQueryKey = () => ["ai-agent"];

export const makeGetAiAgentQueryKey = (id: string) => ["ai-agent", id];

export const makeListWorkflowDefinitionsQueryKey = () => ["workflow-definition"];

export const makeGetWorkflowDefinitionQueryKey = (id: string) => ["workflow-definition", id];

export const makeListGitRepositoriesQueryKey = () => ["git-repository"];

export const makeGetGitRepositoryQueryKey = (id: string) => ["git-repository", id];

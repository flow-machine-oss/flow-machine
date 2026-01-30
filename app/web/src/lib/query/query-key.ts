export const makeListPromptsQueryKey = () => ["prompt"];

export const makeListAiAgentsQueryKey = () => ["ai-agent"];

export const makeGetAiAgentQueryKey = (id: string) => ["ai-agent", id];

export const makeListWorkflowsQueryKey = () => ["workflow"];

export const makeGetWorkflowQueryKey = (id: string) => ["workflow", id];

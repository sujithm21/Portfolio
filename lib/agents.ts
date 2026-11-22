/**
 * The crew of cursors that builds the site in front of the visitor.
 * Each agent's colour is defined in globals.css under [data-agent='<id>'].
 */
export type AgentId =
  'planner' | 'researcher' | 'architect' | 'designer' | 'builder' | 'reviewer' | 'qa' | 'deployer';

export type Agent = { id: AgentId; name: string };

export const agents: Agent[] = [
  { id: 'planner', name: 'Planner' },
  { id: 'researcher', name: 'Researcher' },
  { id: 'architect', name: 'Architect' },
  { id: 'designer', name: 'Designer' },
  { id: 'builder', name: 'Builder' },
  { id: 'reviewer', name: 'Reviewer' },
  { id: 'qa', name: 'QA' },
  { id: 'deployer', name: 'Deployer' },
];

/** The smaller crew used on narrow screens. */
export const compactCrew: AgentId[] = ['planner', 'designer', 'builder', 'deployer'];

export const agentById = (id: AgentId) => agents.find((agent) => agent.id === id) ?? agents[0];

/** Pointer shape shared by the React cursor and the ones created imperatively. */
export const CURSOR_PATH = 'M2 2l5.6 15.2 2.4-7.2 7.2-2.4z';

/** Offset of the pointer tip inside the cursor element, in px. */
export const CURSOR_TIP = 2;

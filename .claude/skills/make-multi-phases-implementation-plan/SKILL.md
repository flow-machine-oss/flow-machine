---
name: make-multi-phases-implementation-plan
description: "Use this skill to create multiple implementation plans organized by phases. This is an alternative to phase 2 of the Research → Plan → Implementation pipeline for larger features. Produces separate step-by-step plans with pseudocode for each phase that engineers can validate and implement incrementally."
---

# Make Multi-Phases Implementation Plan

This skill creates comprehensive implementation plans split across multiple phases, enabling incremental feature development.

## When to Use This Skill

**Trigger conditions:**

- User has completed research and needs a phased implementation plan
- Feature is large enough to warrant multiple implementation phases
- User explicitly invokes `/make-multi-phases-implementation-plan`
- User mentions "phases", "incremental", or "staged implementation"
- Research report exists and user wants to proceed with phased planning

## Pipeline Context

This is an alternative second phase in the 3-phase context engineering pipeline:

```
Research → Multi-Phase Plan → Implementation (per phase)
```

Each phase plan enables mechanical code implementation, allowing for review and validation between phases.

## Input Requirements

The skill requires:

- A `FEATURE.md` file at `@context/FEATURE.md` describing the requirements
- A `RESEARCH_REPORT.md` file at `@context/RESEARCH_REPORT.md` from the research phase

## Planning Process

Work autonomously—do not ask for guidance during planning.

### 1. Review Research

Analyze the research report to understand:

- Entry points and integration areas
- Data flows and transformations
- Dependencies and constraints
- Existing patterns to follow

### 2. Identify Phases

Break the feature into logical phases:

- **Each phase must be completable within a maximum of 1 days**
- Each phase should be independently deployable when possible
- Phases should build upon each other incrementally
- Consider natural boundaries (domain, layer, functionality)
- Aim for 2-10 phases depending on feature complexity
- If a phase would take longer than 1 days, split it into smaller phases

**Phase naming convention:** Use descriptive names that indicate the phase focus:

- `PHASE_1_FOUNDATION` - Core infrastructure and types
- `PHASE_2_DOMAIN` - Domain logic and business rules
- `PHASE_3_APPLICATION` - Use cases and application services
- `PHASE_4_INTEGRATION` - External integrations and APIs
- `PHASE_5_POLISH` - Edge cases, error handling, and refinements

### 3. Define Phase Scope

For each phase, clearly define:

- **Goal:** What this phase accomplishes
- **Deliverables:** What will be working after this phase
- **Dependencies:** What must exist before this phase starts
- **Success Criteria:** How to verify the phase is complete

### 4. Create Implementation Plan Overview

Create the master overview document first at `@context/IMPLEMENTATION_PLAN_OVERVIEW.md` using the template at `@context/template/IMPLEMENTATION_PLAN_OVERVIEW_TEMPLATE.md`.

This overview serves as the coordination document and includes:

- Feature summary
- Phase breakdown table
- Phase dependency graph
- High-level details for each phase (goal, deliverables, files affected, dependencies)
- Critical path
- Risk assessment
- Rollback strategy
- Success metrics

### 5. Spawn Agents for Phase Plans (Sequential)

After creating the overview, spawn the `multi-phases-implementation-planner` agent **sequentially** for each phase plan. Wait for each agent to complete before spawning the next.

#### Agent: `multi-phases-implementation-planner`

This dedicated agent creates a single phase implementation plan. It reads the context files and produces a detailed plan for the specified phase.

#### Sequential Workflow

For each phase (1 through N):

1. Spawn `multi-phases-implementation-planner` agent with phase details
2. Wait for agent to complete
3. Verify the phase plan file was created
4. Proceed to next phase

```
Phase 1 → Wait → Verify → Phase 2 → Wait → Verify → ... → Phase N → Done
```

#### Agent Prompt Template

When spawning the agent for each phase, use this prompt:

```
Create a detailed implementation plan for Phase N: [PHASE_NAME].

## Phase Details (from Overview)
- **Goal:** [goal from overview]
- **Deliverables:** [deliverables from overview]
- **Dependencies:** [dependencies from overview]
- **Success Criteria:** [criteria from overview]
- **Files Affected:** [files count from overview]

## Context Files
- @context/FEATURE.md - Feature requirements
- @context/RESEARCH_REPORT.md - Research findings
- @context/IMPLEMENTATION_PLAN_OVERVIEW.md - Overall plan

## Output
Create: @context/IMPLEMENTATION_PLAN_PHASE_N_[NAME].md
Template: @context/template/IMPLEMENTATION_PLAN_PHASE_TEMPLATE.md

Work autonomously - do not ask for guidance.
```

### 6. Verify All Phase Plans

After all agents complete, verify:

- All phase plan files were created
- Plans follow the template structure
- Plans are consistent with the overview
- Dependencies between phases are properly documented

## What Each Phase Plan Must Include

Each `multi-phases-implementation-planner` agent produces a plan containing:

- Change manifest (files to create/modify)
- Step-by-step implementation with detailed pseudocode
- Types and function signatures
- Control flow and business logic
- Error handling for each step
- Test cases for each component
- Integration points and failure modes
- Recommended implementation order

## Output

### Plan Locations

Save each phase plan separately:

- `@context/IMPLEMENTATION_PLAN_PHASE_1_[NAME].md`
- `@context/IMPLEMENTATION_PLAN_PHASE_2_[NAME].md`
- `@context/IMPLEMENTATION_PLAN_PHASE_N_[NAME].md`

Also create a master overview:

- `@context/IMPLEMENTATION_PLAN_OVERVIEW.md`

### Plan Templates

- Phase plans: Use template at `@context/template/IMPLEMENTATION_PLAN_PHASE_TEMPLATE.md`
- Overview: Use template at `@context/template/IMPLEMENTATION_PLAN_OVERVIEW_TEMPLATE.md`

## Guidelines

**Be thorough:**

- The engineer reviewing each phase plan should identify any design issues before implementation starts
- Include enough detail that implementation becomes primarily a translation exercise
- Address edge cases and error handling upfront
- Make each phase plan specific enough for mechanical implementation

**Maintain phase independence:**

- Each phase should be testable independently
- Avoid tight coupling between phases
- Document inter-phase dependencies clearly
- Consider rollback strategies if a phase fails

**Progressive enhancement:**

- Earlier phases should provide value even without later phases
- Design for graceful degradation where possible
- Each phase should leave the codebase in a working state

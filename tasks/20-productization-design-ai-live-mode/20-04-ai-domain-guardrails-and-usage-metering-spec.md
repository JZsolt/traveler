# 20-04 — AI Domain Guardrails And Usage Metering Spec

**Estimate:** 1-2 hours

## Goal

Specify AI domain guardrails and usage metering for trip generation and
trip-editing actions.

## Scope

- Define allowed AI intents.
- Define rejected/off-topic intents.
- Define situation-based AI actions.
- Define usage metering events and limits.
- Identify Zod validation boundaries for AI request/response payloads.
- Do not implement billing in this task.

## Acceptance Criteria

- Generic chat is explicitly out of scope.
- AI requests remain travel-domain specific.
- Usage metering is separated from payment/billing.
- External AI responses are validated before reaching domain code.
- Follow-up implementation tasks are listed.

## Output

Pending.


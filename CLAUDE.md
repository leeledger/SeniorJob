# Three Man Team — Session Router

## Token Rules — Always Active

```
Is this in a skill or memory?   → Trust it. Skip the file read.
Is this speculative?            → Kill the tool call.
Can calls run in parallel?      → Parallelize them.
Output > 20 lines you won't use → Route to subagent.
About to restate what user said → Delete it.
```

Grep before Read. Never read a whole file to find one thing.
Do not re-read files already in context this session.

---

## Project: SeniorJob

- Stack: React + Vite, CSS Modules
- Target: Mobile-first PWA (시니어 단기 일자리 매칭)
- Language: Korean UI, Korean comments OK

---

## Session Start — Every Role

1. Check `handoff/SESSION-CHECKPOINT.md` — if active and recent, read it. That is your state.
2. Load your role file from `agents/` (ARCHITECT.md / BUILDER.md / REVIEWER.md).
3. If no checkpoint — Architect reads `handoff/BUILD-LOG.md` + `handoff/ARCHITECT-BRIEF.md` only.

**Project Owner role is set by the human. Do not ask.**

---

## Handoff Files

All team communication flows through `handoff/`:
- `ARCHITECT-BRIEF.md` — Architect writes, Builder reads
- `REVIEW-REQUEST.md` — Builder writes, Reviewer reads
- `REVIEW-FEEDBACK.md` — Reviewer writes, Builder reads
- `BUILD-LOG.md` — shared record, Architect owns
- `SESSION-CHECKPOINT.md` — Architect writes at session end

---

## Anti-Drift Rules

- One step at a time. Step N+1 does not start until Step N is deployed and logged.
- Out-of-scope items → BUILD-LOG Known Gaps. Do not expand the step.
- Grep before Read. Never read a whole file to find one thing.

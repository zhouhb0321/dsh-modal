# Modal compute guide for DeepSeek Harness

A lightweight DSH plugin that teaches the agent when and how to use [Modal](https://modal.com) serverless compute. It adds no tools, makes no network calls, and handles no credentials — it only injects a concise usage guide into the agent's system prompt, so it is harmless when Modal is not installed.

## What the agent learns

- **When to use Modal**: GPUs, large-memory jobs, parallel batches, long-running containers — not trivial scripts or web fetches (a local shell is faster and free).
- **Environment**: `modal` CLI is a Python package (`python -m modal ...`); no local dev mode; network + authenticated account required; never ask the user to paste a token in chat.
- **Safe workflow**: `modal app list` / `volume list` / `secret list` first; read volumes before writing; pinned image + explicit cpu/memory; `--detach` for long jobs with `modal app logs`.
- **Integrity**: verify artifacts by content, not exit code; repair data before recomputing if a check fails.
- **Cost & safety**: billed by compute/GPU wall-clock; smoke-test small; mount shared volumes read-only; write to a new volume/path.
- **Windows**: strip proxy env vars for Modal's gRPC client; `PYTHONUTF8=1` / `PYTHONIOENCODING=utf-8`.

## Requirements

- The `modal` CLI installed and the user authenticated in their own terminal. This guide plugin does **not** install Modal or handle credentials.
- DSH with the `systemPrompt` service (all standard profiles).

## Install

In DSH: **Plugins → Add plugin**, point at this repository, or subscribe to a plugin-market index listing `@qusong/dsh-modal-guide`.

To install from source with the CLI:

```sh
dsh plugin add https://github.com/zhouhb0321/dsh-modal
```

## What changes when enabled / disabled

Enabled: one short Modal-usage section is added to the agent's system prompt. Disabled: the section disappears; nothing else changes.

## License

MIT

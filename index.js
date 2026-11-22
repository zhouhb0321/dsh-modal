/**
 * Modal compute guide for DeepSeek Harness.
 *
 * Injects one concise system-prompt section that tells the agent when to use
 * Modal serverless compute and the safe workflow around it. It adds no tools,
 * makes no network calls, and is inert in sessions that never mention Modal.
 * Requires the `modal` CLI to be installed and the user authenticated; the
 * plugin never handles credentials itself.
 */
export const name = '@qusong/dsh-modal-guide'
export const inject = ['systemPrompt']

const TEXT = `## Modal serverless compute — use only when local compute is insufficient

Use Modal for GPUs, large-memory jobs, parallel batches, or long containers.
For trivial scripts or web fetches a local shell is faster and free.

Verified-environment rules:
- \`modal\` CLI is a Python package; run \`python -m modal ...\` from the project
  venv. No local dev mode: network + authenticated account required. Never ask
  the user to paste an API token in chat; point them to their own terminal.
- Check state first: \`modal app list\`, \`modal volume list\`, \`modal secret list\`.
  Read before writing: \`modal volume ls <vol> [path]\` and
  \`modal volume get <vol> <remote> <local>\`.
- Run with pinned image and explicit cpu/memory (\`python -m modal run job.py\`);
  use \`--detach\` for long jobs and collect with \`modal app logs\`.
- Verify artifacts by content, not exit code. If a data-integrity check fails,
  repair the data before recomputing results.
- Cost: billed by compute/GPU wall-clock. State the cost class before large
  jobs; smoke-test small first. Mount shared volumes read-only and write to a
  new volume/path so a bad run cannot destroy source data.
- Windows: strip proxy env vars for Modal's gRPC client and set
  PYTHONUTF8=1 / PYTHONIOENCODING=utf-8 (GBK consoles crash on Modal's box chars).`

export function apply(ctx) {
  if (!ctx.systemPrompt?.section) return
  ctx.effect(() => ctx.systemPrompt.section({
    name: 'guide:modal',
    order: 200,
    text: TEXT,
    interpolate: false,
  }), 'modal-guide:prompt')
}

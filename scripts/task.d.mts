export type TaskCommand = Record<string, unknown> & { key: string; action: string; at: string; title?: string };
export function redact(text: string): string;
export function readCommand(argv: string[]): { task: TaskCommand; files: { kind: string; path: string }[] };
export function statementFor(task: TaskCommand & { files?: unknown[] }, ownerId: string): string;
export function safeName(path: string): string;

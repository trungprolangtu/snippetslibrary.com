// Common language definitions used in the app
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'html',
  'css',
  'scss',
  'json',
  'markdown',
  'bash',
  'shell',
  'sql',
  'xml'
] as const;

export const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  markdown: 'Markdown',
  bash: 'Bash',
  shell: 'Shell',
  sql: 'SQL',
  xml: 'XML'
};

export const POPULAR_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'html',
  'css',
  'json'
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

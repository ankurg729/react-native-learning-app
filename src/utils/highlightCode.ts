export type CodeTone =
  | 'plain'
  | 'keyword'
  | 'string'
  | 'comment'
  | 'number'
  | 'function';

export interface CodeToken {
  text: string;
  tone: CodeTone;
}

const KEYWORDS = new Set([
  'def',
  'return',
  'if',
  'else',
  'elif',
  'for',
  'while',
  'in',
  'import',
  'from',
  'as',
  'class',
  'const',
  'let',
  'var',
  'function',
  'async',
  'await',
  'True',
  'False',
  'None',
  'print',
  'and',
  'or',
  'not',
  'with',
  'yield',
  'try',
  'except',
  'new',
  'export',
  'default',
]);

interface Match {
  start: number;
  end: number;
  tone: CodeTone;
}

function findMatches(line: string): Match[] {
  const matches: Match[] = [];
  const patterns: Array<{ tone: CodeTone; regex: RegExp }> = [
    { tone: 'comment', regex: /#.*$|\/\/.*$/g },
    { tone: 'string', regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g },
    { tone: 'number', regex: /\b\d+(?:\.\d+)?\b/g },
    {
      tone: 'function',
      regex: /\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\()/g,
    },
    {
      tone: 'keyword',
      regex: /\b[A-Za-z_][A-Za-z0-9_]*\b/g,
    },
  ];

  patterns.forEach(pattern => {
    pattern.regex.lastIndex = 0;
    let found = pattern.regex.exec(line);
    while (found) {
      const text = found[0];
      const start = found.index;
      const overlaps = matches.some(
        match => start < match.end && start + text.length > match.start,
      );
      const isKeyword = pattern.tone === 'keyword' && KEYWORDS.has(text);
      if (!overlaps && (pattern.tone !== 'keyword' || isKeyword)) {
        matches.push({
          start,
          end: start + text.length,
          tone: pattern.tone,
        });
      }
      found = pattern.regex.exec(line);
    }
  });

  return matches.sort((a, b) => a.start - b.start);
}

export function highlightLine(line: string): CodeToken[] {
  const matches = findMatches(line);
  if (matches.length === 0) {
    return [{ text: line.length > 0 ? line : ' ', tone: 'plain' }];
  }

  const tokens: CodeToken[] = [];
  let cursor = 0;
  matches.forEach(match => {
    if (match.start > cursor) {
      tokens.push({ text: line.slice(cursor, match.start), tone: 'plain' });
    }
    tokens.push({ text: line.slice(match.start, match.end), tone: match.tone });
    cursor = match.end;
  });
  if (cursor < line.length) {
    tokens.push({ text: line.slice(cursor), tone: 'plain' });
  }
  return tokens;
}

export function highlightCode(code: string): CodeToken[][] {
  return code.split('\n').map(highlightLine);
}

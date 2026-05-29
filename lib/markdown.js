function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

export function markdownToBlocks(md) {
  const text = String(md || '').replace(/\r\n/g, '\n').trim();
  if (!text) return [];

  const lines = text.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    if (line.startsWith('## ')) {
      const t = line.slice(3).trim();
      blocks.push({ type: 'h2', id: slugify(t), text: t });
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4).trim() });
      i++;
      continue;
    }

    if (line.match(/^\[youtube:([\w-]+)\]\s*$/)) {
      const m = line.match(/^\[youtube:([\w-]+)\]\s*$/);
      blocks.push({ type: 'youtube', videoId: m[1] });
      i++;
      continue;
    }

    if (line.startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      let cite = '';
      let bodyLines = quoteLines;
      const last = quoteLines[quoteLines.length - 1] || '';
      if (last.startsWith('— ') || last.startsWith('-- ')) {
        cite = last.replace(/^—\s|^--\s/, '').trim();
        bodyLines = quoteLines.slice(0, -1);
      }
      const block = { type: 'blockquote', text: bodyLines.join(' ').trim() };
      if (cite) block.cite = cite;
      blocks.push(block);
      continue;
    }

    if (line.startsWith('|') && i + 1 < lines.length && lines[i+1].match(/^\|[\s\-:|]+\|$/)) {
      const headerRow = line.split('|').slice(1, -1).map(c => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i].split('|').slice(1, -1).map(c => c.trim());
        rows.push(cells);
        i++;
      }
      blocks.push({ type: 'table', headers: headerRow, rows });
      continue;
    }

    const paraLines = [];
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith('## ') && !lines[i].startsWith('### ') && !lines[i].startsWith('> ') && !lines[i].startsWith('|') && !lines[i].match(/^\[youtube:/)) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) {
      blocks.push({ type: 'p', text: paraLines.join(' ').trim() });
    }
  }

  return blocks;
}

export function blocksToMarkdown(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks.map(b => {
    switch (b.type) {
      case 'h2': return `## ${b.text}`;
      case 'h3': return `### ${b.text}`;
      case 'p': return b.text;
      case 'blockquote': {
        const lines = (b.text || '').split('\n').map(l => `> ${l}`).join('\n');
        return b.cite ? `${lines}\n> — ${b.cite}` : lines;
      }
      case 'table': {
        const head = `| ${(b.headers||[]).join(' | ')} |`;
        const sep = `| ${(b.headers||[]).map(() => '---').join(' | ')} |`;
        const rows = (b.rows||[]).map(r => `| ${r.join(' | ')} |`).join('\n');
        return `${head}\n${sep}\n${rows}`;
      }
      case 'youtube': return b.videoId ? `[youtube:${b.videoId}]` : '';
      default: return '';
    }
  }).filter(Boolean).join('\n\n');
}

export function tocFromBlocks(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter(b => b.type === 'h2' && b.id)
    .map(b => ({ id: b.id, text: b.text }));
}

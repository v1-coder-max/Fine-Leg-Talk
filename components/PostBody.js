import React from 'react';

function fmtInline(text) {
  const parts = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/\*(.+?)\*/);
    let firstMatch = null;
    let type = null;
    if (boldMatch && (!italicMatch || boldMatch.index <= italicMatch.index)) {
      firstMatch = boldMatch;
      type = 'bold';
    } else if (italicMatch) {
      firstMatch = italicMatch;
      type = 'italic';
    }
    if (!firstMatch) {
      parts.push(remaining);
      break;
    }
    if (firstMatch.index > 0) parts.push(remaining.slice(0, firstMatch.index));
    if (type === 'bold') parts.push(<strong key={key++}>{firstMatch[1]}</strong>);
    else parts.push(<em key={key++}>{firstMatch[1]}</em>);
    remaining = remaining.slice(firstMatch.index + firstMatch[0].length);
  }
  return parts;
}

function renderBlock(block, i) {
  switch (block.type) {
    case 'h2':
      return <h2 key={i} id={block.id || ''}>{block.text}</h2>;
    case 'h3':
      return <h3 key={i}>{block.text}</h3>;
    case 'p':
      return <p key={i}>{fmtInline(block.text)}</p>;
    case 'blockquote':
      return (
        <blockquote key={i}>
          <p>{fmtInline(block.text)}</p>
          {block.cite && <cite>{block.cite}</cite>}
        </blockquote>
      );
    case 'table': {
      const hiCols = block.hiCols || [];
      return (
        <table key={i} className="stats-table">
          <thead>
            <tr>{(block.headers || []).map((h, j) => <th key={j}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {(block.rows || []).map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className={hiCols.includes(c) ? 'hi' : ''}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    case 'youtube':
      if (!block.videoId) return null;
      return (
        <div key={i} style={{position:'relative',paddingTop:'56.25%',borderRadius:16,overflow:'hidden',margin:'36px 0'}}>
          <iframe
            style={{position:'absolute',inset:0,width:'100%',height:'100%'}}
            src={`https://www.youtube.com/embed/${block.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    default:
      return null;
  }
}

export default function PostBody({ blocks }) {
  return <div className="post-body">{(blocks || []).map(renderBlock)}</div>;
}

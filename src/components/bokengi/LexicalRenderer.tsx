import React from 'react'

interface LexicalRendererProps {
  rawContent?: any
  contentText?: string
  className?: string
}

export const LexicalRenderer: React.FC<LexicalRendererProps> = ({
  rawContent,
  contentText,
  className = '',
}) => {
  // 1. Rendu basé sur l'arbre JSON Lexical natif si présent
  if (rawContent && typeof rawContent === 'object' && rawContent.root && Array.isArray(rawContent.root.children)) {
    return (
      <div className={`editorial-article-body ${className}`}>
        {rawContent.root.children.map((node: any, idx: number) => renderLexicalBlock(node, idx))}
      </div>
    )
  }

  // 2. Fallback intelligent sur le texte structuré
  if (contentText && typeof contentText === 'string') {
    const blocks = contentText.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
    return (
      <div className={`editorial-article-body ${className}`}>
        {blocks.map((block, idx) => {
          // Détection d'un titre numéroté (ex: "1. Titre de section")
          const headingMatch = block.match(/^(\d+\.\s+)(.+)$/)
          if (headingMatch && block.indexOf('\n') === -1 && block.length < 120) {
            return (
              <h2
                key={idx}
                className="text-2xl md:text-3xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-10 mb-4 pb-2 border-b border-[var(--border-subtle)]"
              >
                <span className="text-[var(--blue-cyan)] font-mono mr-2">{headingMatch[1]}</span>
                {headingMatch[2]}
              </h2>
            )
          }

          // Détection d'une liste à puces (lignes commençant par - ou •)
          const lines = block.split('\n').map((l) => l.trim())
          const isBulletList = lines.every((l) => l.startsWith('- ') || l.startsWith('• ') || l.startsWith('* '))
          if (isBulletList && lines.length > 0) {
            return (
              <ul key={idx} className="list-disc pl-6 space-y-2 mb-6 text-base text-[var(--ink-body)] leading-relaxed">
                {lines.map((line, lIdx) => (
                  <li key={lIdx}>{line.replace(/^[-•*]\s+/, '')}</li>
                ))}
              </ul>
            )
          }

          // Détection d'une citation
          if (block.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-[var(--blue-cyan)] pl-4 py-3 my-6 italic text-[var(--ink-muted)] bg-[var(--bg-elevated)]/40 rounded-r-[var(--radius-sm)]"
              >
                {block.replace(/^>\s+/, '')}
              </blockquote>
            )
          }

          // Paragraphe standard
          return (
            <p
              key={idx}
              className="text-base md:text-lg text-[var(--ink-body)] leading-relaxed mb-6 font-light whitespace-pre-line"
            >
              {block}
            </p>
          )
        })}
      </div>
    )
  }

  return null
}

function renderLexicalBlock(node: any, index: number): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'heading': {
      const tag = node.tag || 'h2'
      if (tag === 'h1' || tag === 'h2') {
        return (
          <h2
            key={index}
            className="text-2xl md:text-3xl font-extrabold text-[var(--ink-heading)] tracking-tight mt-10 mb-4 pb-2 border-b border-[var(--border-subtle)]"
          >
            {renderInlineChildren(node.children)}
          </h2>
        )
      }
      if (tag === 'h3') {
        return (
          <h3
            key={index}
            className="text-xl md:text-2xl font-bold text-[var(--ink-heading)] tracking-tight mt-8 mb-3"
          >
            {renderInlineChildren(node.children)}
          </h3>
        )
      }
      return (
        <h4 key={index} className="text-lg font-bold text-[var(--ink-heading)] mt-6 mb-2">
          {renderInlineChildren(node.children)}
        </h4>
      )
    }

    case 'paragraph':
      return (
        <p
          key={index}
          className="text-base md:text-lg text-[var(--ink-body)] leading-relaxed mb-6 font-light"
        >
          {renderInlineChildren(node.children)}
        </p>
      )

    case 'quote':
      return (
        <blockquote
          key={index}
          className="border-l-4 border-[var(--blue-cyan)] pl-4 py-3 my-6 italic text-[var(--ink-muted)] bg-[var(--bg-elevated)]/40 rounded-r-[var(--radius-sm)]"
        >
          {renderInlineChildren(node.children)}
        </blockquote>
      )

    case 'list': {
      const isOrdered = node.listType === 'number'
      const ListTag = isOrdered ? 'ol' : 'ul'
      const listClass = isOrdered
        ? 'list-decimal pl-6 space-y-2 mb-6 text-base text-[var(--ink-body)] leading-relaxed'
        : 'list-disc pl-6 space-y-2 mb-6 text-base text-[var(--ink-body)] leading-relaxed'

      return (
        <ListTag key={index} className={listClass}>
          {Array.isArray(node.children) &&
            node.children.map((child: any, cIdx: number) => (
              <li key={cIdx}>{renderInlineChildren(child.children || [child])}</li>
            ))}
        </ListTag>
      )
    }

    case 'code':
      return (
        <pre
          key={index}
          className="bg-[var(--bg-elevated)] text-[var(--blue-cyan)] font-mono text-xs md:text-sm p-4 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] overflow-x-auto my-6"
        >
          <code>{renderInlineChildren(node.children)}</code>
        </pre>
      )

    default:
      if (Array.isArray(node.children)) {
        return <div key={index}>{renderInlineChildren(node.children)}</div>
      }
      return null
  }
}

function renderInlineChildren(children?: any[]): React.ReactNode {
  if (!Array.isArray(children) || children.length === 0) return null

  return children.map((child: any, idx: number) => {
    if (!child) return null

    if (child.type === 'linebreak') {
      return <br key={idx} />
    }

    if (child.type === 'link') {
      const url = child.fields?.url || child.url || '#'
      const newTab = Boolean(child.fields?.newTab)
      return (
        <a
          key={idx}
          href={url}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="text-[var(--blue-cyan)] underline underline-offset-4 hover:opacity-80 transition-opacity"
        >
          {renderInlineChildren(child.children)}
        </a>
      )
    }

    if (typeof child.text === 'string') {
      let content: React.ReactNode = child.text
      const format = child.format || 0

      // Format bitmasks standard Lexical : 1 = Bold, 2 = Italic, 4 = Strike, 8 = Underline, 16 = Code
      if (format & 16) {
        content = (
          <code className="px-1.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-[var(--blue-cyan)] font-mono text-xs">
            {content}
          </code>
        )
      }
      if (format & 1) {
        content = <strong className="font-semibold text-[var(--ink-heading)]">{content}</strong>
      }
      if (format & 2) {
        content = <em className="italic">{content}</em>
      }
      if (format & 8) {
        content = <u className="underline">{content}</u>
      }
      if (format & 4) {
        content = <s className="line-through">{content}</s>
      }

      return <React.Fragment key={idx}>{content}</React.Fragment>
    }

    if (Array.isArray(child.children)) {
      return <React.Fragment key={idx}>{renderInlineChildren(child.children)}</React.Fragment>
    }

    return null
  })
}

export default LexicalRenderer

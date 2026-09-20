import { useEffect, useState, useCallback } from 'react'
import { ROOT, findNode, type KnowledgeNode } from './data/knowledge'
import { EXAMPLES } from './data/examples'

/* ---------- hash 路由 ---------- */
function parseHash(): string[] {
  const h = window.location.hash.replace(/^#\/?/, '')
  return h ? h.split('/').filter(Boolean) : []
}

function useHashPath() {
  const [path, setPath] = useState<string[]>(parseHash)
  useEffect(() => {
    const onChange = () => {
      setPath(parseHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  const go = useCallback((ids: string[]) => {
    window.location.hash = '#/' + ids.join('/')
  }, [])
  return { path, go }
}

/* ---------- 入场动画（默认可见，动画为增强） ---------- */
function Reveal({ children, delay = 0, k }: { children: React.ReactNode; delay?: number; k?: string }) {
  return (
    <div key={k} className="reveal" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ---------- 顶栏 ---------- */
function TopBar({ go }: { go: (ids: string[]) => void }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#161616]"
      style={{ background: 'rgba(248,248,248,0.78)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
    >
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-5">
        <button onClick={() => go([])} className="flex items-baseline gap-2 select-none">
          <span className="font-mono text-[15px] font-bold tracking-tight text-[#161616]">Py://</span>
          <span className="text-[13px] font-medium text-[#161616]">符号图谱</span>
        </button>
        <nav className="hidden items-center gap-5 md:flex">
          {ROOT.children!.map((c) => (
            <button
              key={c.id}
              onClick={() => go([c.id])}
              className="font-mono text-[11px] uppercase tracking-widest text-[#989f9b] transition-colors hover:text-[#8b8bef]"
            >
              {c.en}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

/* ---------- 面包屑 ---------- */
function Crumbs({ path, go }: { path: string[]; go: (ids: string[]) => void }) {
  const parts: { label: string; ids: string[] }[] = [{ label: '主目录', ids: [] }]
  for (let i = 0; i < path.length; i++) {
    const n = findNode(path.slice(0, i + 1))
    if (n) parts.push({ label: n.title, ids: path.slice(0, i + 1) })
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] tracking-wide text-[#989f9b]">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span>/</span>}
          <button
            onClick={() => go(p.ids)}
            className={i === parts.length - 1 ? 'text-[#161616] font-bold' : 'hover:text-[#8b8bef] transition-colors'}
          >
            {p.label}
          </button>
        </span>
      ))}
    </div>
  )
}

/* ---------- 目录卡片 ---------- */
function DirCard({ node, ids, go, index }: { node: KnowledgeNode; ids: string[]; go: (ids: string[]) => void; index: number }) {
  const isDir = !!node.children
  const count = node.children?.length ?? node.items?.length ?? 0
  const unit = isDir ? '个子目录' : '个知识点'
  return (
    <Reveal k={node.id} delay={index * 60}>
      <button
        onClick={() => go(ids)}
        className="group flex h-full w-full flex-col justify-between border border-[#161616] bg-white p-5 text-left transition-colors duration-300 hover:bg-[#161616]"
      >
        <div>
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#989f9b] group-hover:text-[#8b8bef] transition-colors">
              {node.en}
            </span>
            <span className="font-mono text-[11px] text-[#989f9b] group-hover:text-[#8b8bef] transition-colors">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mt-3 text-[19px] font-bold leading-snug text-[#161616] group-hover:text-white transition-colors">
            {node.title}
          </h3>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[#989f9b]">{node.summary}</p>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="font-mono text-[11px] text-[#989f9b]">{count} {unit}</span>
          <span className="font-mono text-[14px] text-[#8b8bef] transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </button>
    </Reveal>
  )
}

/* ---------- 知识点条目 ---------- */
function ItemRow({ symbol, meaning, example, index }: { symbol: string; meaning: string; example?: string; index: number }) {
  return (
    <Reveal k={symbol + index} delay={index * 40}>
      <div className="grid grid-cols-1 gap-3 border-b border-[#161616]/15 py-5 md:grid-cols-[220px_1fr_1fr] md:gap-6">
        <div>
          <code className="inline-block bg-[#161616] px-2.5 py-1 font-mono text-[13px] font-bold text-white">
            {symbol}
          </code>
        </div>
        <p className="text-[13.5px] leading-relaxed text-[#3c3c3c]">{meaning}</p>
        {example ? (
          <pre className="overflow-x-auto bg-[#161616] p-3 font-mono text-[12px] leading-relaxed text-[#b9c4bd]">
            {example}
          </pre>
        ) : (
          <span />
        )}
      </div>
    </Reveal>
  )
}

/* ---------- 侧边目录树 ---------- */
function SideTree({ path, go }: { path: string[]; go: (ids: string[]) => void }) {
  const renderLevel = (nodes: KnowledgeNode[], prefix: string[], depth: number) => (
    <ul className={depth > 0 ? 'ml-3 border-l border-[#161616]/15 pl-3' : ''}>
      {nodes.map((n) => {
        const ids = [...prefix, n.id]
        const active = path.join('/') === ids.join('/')
        const onPath = path.slice(0, ids.length).join('/') === ids.join('/')
        return (
          <li key={n.id} className="py-0.5">
            <button
              onClick={() => go(ids)}
              className={`w-full text-left text-[12.5px] leading-relaxed transition-colors ${
                active ? 'font-bold text-[#8b8bef]' : onPath ? 'font-medium text-[#161616]' : 'text-[#989f9b] hover:text-[#161616]'
              }`}
            >
              {n.title}
            </button>
            {onPath && n.children && renderLevel(n.children, ids, depth + 1)}
          </li>
        )
      })}
    </ul>
  )
  return (
    <aside className="hidden w-[220px] shrink-0 lg:block">
      <div className="sticky top-20">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#989f9b]">目录树</p>
        {renderLevel(ROOT.children!, [], 0)}
      </div>
    </aside>
  )
}

/* ---------- 代码示例块 ---------- */
function CodeLine({ line, no }: { line: string; no: number }) {
  // 简易高亮：# 注释部分用灰绿色，字符串用暖黄色
  const parts: React.ReactNode[] = []
  const hashIdx = line.indexOf('#')
  const codePart = hashIdx >= 0 ? line.slice(0, hashIdx) : line
  const commentPart = hashIdx >= 0 ? line.slice(hashIdx) : ''
  const segs = codePart.split(/('[^']*'|"[^"]*")/g).filter(Boolean)
  segs.forEach((s, i) => {
    const isStr = (s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))
    parts.push(
      <span key={i} style={isStr ? { color: '#e8c07d' } : undefined}>
        {s}
      </span>,
    )
  })
  return (
    <div className="flex">
      <span className="w-9 shrink-0 select-none pr-3 text-right text-[#5b6660]">{no}</span>
      <span className="whitespace-pre text-[#d5dcd7]">
        {parts}
        {commentPart && <span className="text-[#7d8a84]">{commentPart}</span>}
      </span>
    </div>
  )
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* 剪贴板不可用时静默 */
    }
  }
  return (
    <div className="border border-[#161616] bg-[#161616]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5">
            <i className="block h-2.5 w-2.5 rounded-full bg-[#8b8bef]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-[#3c3c3c]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-[#3c3c3c]" />
          </span>
          <span className="text-[12.5px] font-medium text-white">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#5b6660]">python</span>
          <button
            onClick={copy}
            className="font-mono text-[11px] text-[#989f9b] transition-colors hover:text-[#8b8bef]"
          >
            {copied ? '已复制 ✓' : '复制'}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.75]">
        {code.split('\n').map((line, i) => (
          <CodeLine key={i} line={line} no={i + 1} />
        ))}
      </div>
    </div>
  )
}

/* ---------- 思维导图 ---------- */
function MapFigure({ src, title }: { src: string; title: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <figure className="border border-[#161616] bg-white p-2">
        <img src={src} alt={title} className="w-full cursor-zoom-in" onClick={() => setOpen(true)} loading="lazy" />
        <figcaption className="flex items-center justify-between px-2 py-2">
          <span className="text-[11.5px] text-[#989f9b]">{title} · 思维导图</span>
          <button onClick={() => setOpen(true)} className="font-mono text-[10px] uppercase tracking-widest text-[#8b8bef]">
            放大查看
          </button>
        </figcaption>
      </figure>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-start justify-center overflow-auto bg-[#161616]/90 p-6"
          onClick={() => setOpen(false)}
        >
          <img src={src} alt={title} className="max-w-[1100px] bg-white" />
        </div>
      )}
    </>
  )
}

/* ---------- 首页 ---------- */
function HomePage({ go }: { go: (ids: string[]) => void }) {
  return (
    <div>
      <div className="pt-24 pb-10">
        <Reveal k="hero">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8b8bef]">Python Syntax Atlas</p>
          <h1
            className="mt-4 font-bold leading-[0.95] tracking-tight text-[#161616]"
            style={{ fontSize: 'clamp(40px, 8.5vw, 110px)' }}
          >
            Python<br />符号图谱
          </h1>
          <p className="mt-6 max-w-[560px] text-[14px] leading-relaxed text-[#5b6660]">
            基础符号与语法的分层知识库。点击下方主目录标题进入对应板块，逐层下钻至具体知识点；
            每个符号都配有含义说明与可直接运行的示例。
          </p>
        </Reveal>
      </div>

      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#989f9b]">主目录 · 8 个板块</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROOT.children!.map((c, i) => (
          <DirCard key={c.id} node={c} ids={[c.id]} go={go} index={i} />
        ))}
      </div>

      <Reveal k="map" delay={100}>
        <div className="mt-16">
          <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#989f9b]">体系总览</h2>
          <MapFigure src="/maps/00_overview.jpg" title="Python 基础符号与语法体系总览" />
        </div>
      </Reveal>
    </div>
  )
}

/* ---------- 节点页 ---------- */
function NodePage({ node, path, go }: { node: KnowledgeNode; path: string[]; go: (ids: string[]) => void }) {
  const isLeaf = !!node.items
  return (
    <div className="pt-20">
      <Crumbs path={path} go={go} />
      <div className="mt-8 flex gap-10">
        <SideTree path={path} go={go} />
        <main className="min-w-0 flex-1 pb-10">
          <Reveal k={path.join('/')}>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8b8bef]">{node.en}</p>
            <h1 className="mt-2 text-[clamp(28px,4.5vw,52px)] font-bold leading-tight tracking-tight text-[#161616]">
              {node.title}
            </h1>
            <p className="mt-3 max-w-[720px] text-[14px] leading-relaxed text-[#5b6660]">
              {node.intro ?? node.summary}
            </p>
          </Reveal>

          {node.tips && (
            <Reveal k={path.join('/') + 'tips'} delay={80}>
              <div className="mt-6 flex flex-wrap gap-2">
                {node.tips.map((t) => (
                  <span key={t} className="border border-[#8b8bef] px-3 py-1.5 font-mono text-[11.5px] text-[#161616]">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          {node.children && (
            <div className="mt-10">
              <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#989f9b]">
                子目录 · {node.children.length} 个
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {node.children.map((c, i) => (
                  <DirCard key={c.id} node={c} ids={[...path, c.id]} go={go} index={i} />
                ))}
              </div>
            </div>
          )}

          {isLeaf && (
            <div className="mt-10">
              <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[#989f9b]">
                知识点 · {node.items!.length} 条
              </h2>
              <div className="border-t border-[#161616]">
                {node.items!.map((it, i) => (
                  <ItemRow key={i} symbol={it.symbol} meaning={it.meaning} example={it.example} index={i} />
                ))}
              </div>
            </div>
          )}

          {isLeaf && EXAMPLES[node.id] && (
            <Reveal k={path.join('/') + 'ex'} delay={100}>
              <div className="mt-12">
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#989f9b]">
                  实战示例 · 可直接运行
                </h2>
                <div className="grid grid-cols-1 gap-5">
                  {EXAMPLES[node.id].map((ex) => (
                    <CodeBlock key={ex.title} title={ex.title} code={ex.code} />
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {node.map && (
            <Reveal k={path.join('/') + 'map'} delay={120}>
              <div className="mt-12">
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#989f9b]">板块思维导图</h2>
                <MapFigure src={node.map} title={node.title} />
              </div>
            </Reveal>
          )}
        </main>
      </div>
    </div>
  )
}

/* ---------- App ---------- */
export default function App() {
  const { path, go } = useHashPath()
  const node = findNode(path)

  useEffect(() => {
    if (!node) go([])
  }, [node, go])

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans text-[#161616] antialiased">
      <TopBar go={go} />
      <div className="mx-auto max-w-[1400px] px-5 pb-16">
        {path.length === 0 ? <HomePage go={go} /> : node ? <NodePage node={node} path={path} go={go} /> : null}
        <footer className="mt-20 border-t border-[#161616] pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#989f9b]">
              Python Syntax Atlas
            </span>
            <span className="text-[11.5px] text-[#989f9b]">
              {ROOT.children!.length} 个板块 · 分层下钻式知识库
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}

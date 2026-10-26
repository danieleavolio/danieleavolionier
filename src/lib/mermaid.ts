const MERMAID_SOURCE_PATTERN =
	/^\s*(?:flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(-v2)?|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|quadrantChart|block-beta)\b/;

const MERMAID_LABEL_PATTERN = /\bmermaid\b/i;

/**
 * True for a code block that holds a mermaid diagram: either marked as
 * `language-mermaid` or containing a recognizable diagram keyword (pasted
 * markdown does not carry the language class).
 */
function isMermaidCode(code: Element): boolean {
	const source = (code.textContent ?? '').trim();
	if (!source) return false;
	if (MERMAID_LABEL_PATTERN.test(code.className)) return true;
	return MERMAID_SOURCE_PATTERN.test(source);
}

/**
 * Replaces every mermaid code block inside [container] with a rendered SVG
 * diagram, lazily importing the mermaid bundle only when at least one block is
 * found. Blocks that fail to render are left as code.
 */
export async function renderMermaidBlocks(container: HTMLElement): Promise<void> {
	const candidates = Array.from(container.querySelectorAll('pre > code')).filter(isMermaidCode);
	if (candidates.length === 0) return;

	const mermaid = (await import('mermaid')).default;
	mermaid.initialize({
		startOnLoad: false,
		securityLevel: 'strict',
		theme: 'base',
		themeVariables: {
			primaryColor: '#101010',
			primaryTextColor: '#e8e8e8',
			primaryBorderColor: '#ece7d5',
			lineColor: '#ece7d5',
			secondaryColor: '#1d1d1d',
			tertiaryColor: '#2a2a2a'
		}
	});

	let index = 0;
	for (const code of candidates) {
		const source = (code.textContent ?? '').trim();
		const holder = document.createElement('div');
		holder.className = 'rich-mermaid';
		try {
			const { svg } = await mermaid.render(`rich-mermaid-${Date.now()}-${index++}`, source);
			holder.innerHTML = svg;
			code.parentElement?.replaceWith(holder);
		} catch (cause) {
			console.error('Mermaid rendering failed:', cause);
		}
	}
}

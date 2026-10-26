const MERMAID_SOURCE_PATTERN =
	/^\s*(?:flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(-v2)?|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|quadrantChart|block-beta)\b/;

const MERMAID_LABEL_PATTERN = /\bmermaid\b/i;

/**
 * NieR:Automata-styled theme: flat dark plates with the beige page palette,
 * sharp corners, monospace labels, no gradients or drop shadows.
 */
const NIER_THEME_CSS = `
	.node rect, .node polygon, .node circle, .node path,
	.cluster rect, .label-container, .note, .actor {
		rx: 0 !important;
		ry: 0 !important;
		filter: none !important;
		stroke-width: 1px !important;
	}
	.node rect { fill: #151512 !important; stroke: #8f8b7d !important; }
	.node .label, .nodeLabel, .cluster-label, .label {
		font-family: 'JetBrains Mono', ui-monospace, monospace !important;
		letter-spacing: 0.02em;
		fill: #e8e5da !important;
		color: #e8e5da !important;
	}
	.cluster rect { fill: #1d1d1a !important; stroke: #8f8b7d !important; }
	.edges .edgePath .path, .flowchart-link, .relation, .messageLine0, .messageLine1 {
		stroke: #3c3b34 !important;
		stroke-width: 1.2px !important;
	}
	.marker, .arrowheadPath, marker path { fill: #3c3b34 !important; stroke: #3c3b34 !important; }
	.edgeLabel rect, .labelBkg { fill: #d3d0c4 !important; opacity: 1 !important; }
	.edgeLabel .label, .edgeLabel span, .edgeLabel p {
		font-family: 'JetBrains Mono', ui-monospace, monospace !important;
		font-size: 12px !important;
		color: #22221d !important;
		fill: #22221d !important;
	}
	.edgeLabel foreignObject div { color: #22221d !important; }
`;

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
 * Mermaid's own geometry: some themes round node corners with SVG attributes
 * that CSS cannot always override, so they are cleared after rendering.
 */
function flattenGeometry(holder: HTMLElement): void {
	holder.querySelectorAll('rect').forEach((rect) => {
		rect.setAttribute('rx', '0');
		rect.setAttribute('ry', '0');
	});
	holder.querySelectorAll<SVGElement>('.node, .cluster, .label-container').forEach((node) => {
		node.style.filter = 'none';
	});
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
		fontFamily: "'JetBrains Mono', ui-monospace, monospace",
		themeCSS: NIER_THEME_CSS,
		themeVariables: {
			background: '#d3d0c4',
			primaryColor: '#151512',
			primaryTextColor: '#e8e5da',
			primaryBorderColor: '#8f8b7d',
			secondaryColor: '#1d1d1a',
			secondaryTextColor: '#e8e5da',
			secondaryBorderColor: '#8f8b7d',
			tertiaryColor: '#22221d',
			tertiaryTextColor: '#e8e5da',
			lineColor: '#3c3b34',
			textColor: '#22221d',
			edgeLabelBackground: '#d3d0c4',
			fontSize: '14px',
			clusterBkg: '#1d1d1a',
			clusterBorder: '#8f8b7d',
			titleColor: '#22221d'
		},
		flowchart: { curve: 'stepBefore', padding: 12, nodeSpacing: 38, rankSpacing: 48 }
	});

	let index = 0;
	for (const code of candidates) {
		const source = (code.textContent ?? '').trim();
		const holder = document.createElement('div');
		holder.className = 'rich-mermaid';
		try {
			const { svg } = await mermaid.render(`rich-mermaid-${Date.now()}-${index++}`, source);
			holder.innerHTML = svg;
			flattenGeometry(holder);
			code.parentElement?.replaceWith(holder);
		} catch (cause) {
			console.error('Mermaid rendering failed:', cause);
		}
	}
}

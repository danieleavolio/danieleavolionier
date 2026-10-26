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
		stroke: #4a4740 !important;
		stroke-width: 1.2px !important;
	}
	.marker, .arrowheadPath, marker path { fill: #4a4740 !important; stroke: #4a4740 !important; }
	.edgeLabel rect, .labelBkg {
		fill: #d3d0c4 !important;
		background-color: #d3d0c4 !important;
		stroke: none !important;
		opacity: 1 !important;
		filter: none !important;
	}
	/*
	 * Diagram labels are HTML inside foreignObject, so the article typography
	 * (.prose p) leaks in: it forces a larger font and justified text that
	 * mermaid never measured, which wraps labels and clips the second line.
	 * Labels keep the size mermaid sized them with.
	 */
	foreignObject p, foreignObject span, foreignObject div {
		margin: 0 !important;
		padding: 0 !important;
		font-size: inherit !important;
		line-height: 1.5 !important;
		text-align: center !important;
		text-justify: none !important;
		hyphens: none !important;
		border: 0 !important;
		box-shadow: none !important;
	}
	/*
	 * Edge labels: mermaid nests a block <p> inside an inline <span>, which
	 * makes the label box several lines tall, and the article font would be
	 * used. Both are normalized here; the plate itself is fitted to the text
	 * after rendering (the label is measured detached, with other metrics).
	 */
	.edgeLabel span, .edgeLabel p {
		display: block !important;
		white-space: nowrap !important;
		font-family: 'JetBrains Mono', ui-monospace, monospace !important;
		color: #22221d !important;
		fill: #22221d !important;
	}
	.edgeLabel p {
		padding: 1px 4px !important;
	}
	.edgeLabel foreignObject div {
		font-family: 'JetBrains Mono', ui-monospace, monospace !important;
		color: #22221d !important;
		fill: #22221d !important;
	}
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
 * Mermaid sizes edge-label plates while the label is still detached, using
 * metrics of the default font; the rendered label then uses the diagram font
 * and often does not fit, wrapping and being clipped by the foreignObject.
 * After mounting, the real text is measured and the label box resized to it.
 */
function fitEdgeLabelPlates(holder: HTMLElement): void {
	holder.querySelectorAll<SVGGElement>('g.edgeLabel').forEach((label) => {
		const box = label.querySelector('foreignObject');
		const content = box?.querySelector('div');
		if (!box || !content) return;

		const text = content.querySelector('p') ?? content;
		const bounds = text.getBoundingClientRect();
		if (!bounds.width || !bounds.height) return;

		const width = Math.ceil(bounds.width) + 2;
		const height = Math.ceil(bounds.height) + 2;

		// The inner group is offset by half the old size to center the label;
		// resizing the box without moving that offset would shift the label.
		const inner = label.querySelector('g.label');
		if (inner && inner !== label) {
			inner.setAttribute('transform', `translate(${-width / 2}, ${-height / 2})`);
		}

		for (const element of [box, label.querySelector('rect')]) {
			if (!element) continue;
			element.setAttribute('x', '0');
			element.setAttribute('y', '0');
			element.setAttribute('width', String(width));
			element.setAttribute('height', String(height));
		}
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

	// Plates are measured against the real font, so the webfont must be ready
	// before the first render.
	await document.fonts?.ready;

	let index = 0;
	for (const code of candidates) {
		const source = (code.textContent ?? '').trim();
		const holder = document.createElement('div');
		holder.className = 'rich-mermaid';
		try {
			const { svg } = await mermaid.render(`rich-mermaid-${Date.now()}-${index++}`, source);
			holder.innerHTML = svg;
			code.parentElement?.replaceWith(holder);
			flattenGeometry(holder);
			fitEdgeLabelPlates(holder);
		} catch (cause) {
			console.error('Mermaid rendering failed:', cause);
		}
	}
}

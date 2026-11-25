/**
 * Minimal syntax colouring for fenced code blocks, applied to the rendered
 * article HTML. Only blocks with a known `language-*` class are touched, so
 * mermaid and bar-chart blocks pass through unchanged.
 *
 * Token classes: c comment, s string, k keyword, n number, f function or
 * command, v variable, o option or attribute, h heading or tag, a added, d deleted.
 */
type Rule = [token: string, pattern: string];

const STRING = String.raw`"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'`;
const NUMBER = String.raw`\b\d+(?:\.\d+)?\b`;

const rules: Record<string, Rule[]> = {
	bash: [
		['c', String.raw`(?:^|(?<=\s))#.*`],
		['s', STRING],
		['v', String.raw`\$(?:\{[^}\n]*\}|\w+|\()`],
		[
			'k',
			String.raw`\b(?:if|then|else|elif|fi|for|while|do|done|case|esac|in|function|export|return)\b`
		],
		['f', String.raw`(?:^[ \t]*|(?<=(?:\|\||&&|[|;])\s*))(?:sudo\s+)?[\w./~-]+`],
		['o', String.raw`(?<=\s)--?[\w-]+`],
		['n', NUMBER]
	],
	powershell: [
		['c', String.raw`#.*`],
		['s', STRING],
		['v', String.raw`\$[\w:]+`],
		['f', String.raw`\b[A-Z][a-z]+-[A-Z]\w+`],
		['o', String.raw`(?<=\s)-[A-Za-z]\w*`],
		['k', String.raw`\b(?:if|else|elseif|foreach|for|while|function|return|param|try|catch)\b`],
		['n', NUMBER]
	],
	json: [
		['o', String.raw`"(?:[^"\\\n]|\\.)*"(?=\s*:)`],
		['s', STRING],
		['k', String.raw`\b(?:true|false|null)\b`],
		['n', String.raw`-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?`]
	],
	javascript: [
		['c', String.raw`\/\/.*|\/\*[\s\S]*?\*\/`],
		['s', String.raw`${STRING}|` + '`(?:[^`\\\\]|\\\\.)*`'],
		[
			'k',
			String.raw`\b(?:const|let|var|function|return|if|else|for|while|import|from|export|default|class|extends|new|async|await|try|catch|throw|type|interface|typeof|of|in|true|false|null|undefined)\b`
		],
		['n', NUMBER],
		['f', String.raw`\b[A-Za-z_$][\w$]*(?=\()`]
	],
	python: [
		['c', String.raw`#.*`],
		['s', STRING],
		[
			'k',
			String.raw`\b(?:def|class|return|if|elif|else|for|while|import|from|as|with|try|except|raise|lambda|in|not|and|or|None|True|False|async|await)\b`
		],
		['n', NUMBER],
		['f', String.raw`\b[A-Za-z_]\w*(?=\()`]
	],
	css: [
		['c', String.raw`\/\*[\s\S]*?\*\/`],
		['s', STRING],
		['k', String.raw`@[\w-]+`],
		['o', String.raw`[\w-]+(?=\s*:)`],
		['n', String.raw`#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|rem|em|%|vh|vw|ch|s|ms)?\b`]
	],
	html: [
		['c', String.raw`<!--[\s\S]*?-->`],
		['h', String.raw`<\/?[A-Za-z][\w:-]*`],
		['o', String.raw`[\w:@.-]+(?==)`],
		['s', STRING]
	],
	markdown: [
		['h', String.raw`^#{1,6}\s.*$`],
		['c', String.raw`^>.*$`],
		['s', '`[^`\\n]+`'],
		['k', String.raw`\*\*[^*\n]+\*\*|__[^_\n]+__`],
		['f', String.raw`\[[^\]\n]*\]\([^)\n]*\)`],
		['o', String.raw`^[ \t]*(?:[-*+]|\d+\.)(?=\s)`]
	],
	yaml: [
		['c', String.raw`#.*`],
		['o', String.raw`^[ \t-]*[\w.-]+(?=:)`],
		['s', STRING],
		['k', String.raw`\b(?:true|false|null)\b`],
		['n', NUMBER]
	],
	diff: [
		['a', String.raw`^\+.*$`],
		['d', String.raw`^-.*$`],
		['h', String.raw`^@@.*$`]
	]
};

const aliases: Record<string, string> = {
	sh: 'bash',
	shell: 'bash',
	zsh: 'bash',
	console: 'bash',
	ps1: 'powershell',
	pwsh: 'powershell',
	jsonc: 'json',
	js: 'javascript',
	jsx: 'javascript',
	ts: 'javascript',
	tsx: 'javascript',
	typescript: 'javascript',
	py: 'python',
	scss: 'css',
	svelte: 'html',
	xml: 'html',
	md: 'markdown',
	yml: 'yaml',
	toml: 'yaml'
};

const compiled = new Map<string, { regex: RegExp; tokens: string[] }>();

function grammar(lang: string) {
	let entry = compiled.get(lang);
	if (!entry && rules[lang]) {
		entry = {
			regex: new RegExp(rules[lang].map(([, source]) => `(${source})`).join('|'), 'gm'),
			tokens: rules[lang].map(([token]) => token)
		};
		compiled.set(lang, entry);
	}
	return entry;
}

const escapeHtml = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const unescapeHtml = (text: string) =>
	text
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&');

export function highlightCode(source: string, language: string): string | null {
	const lang = aliases[language.toLowerCase()] ?? language.toLowerCase();
	const entry = grammar(lang);
	if (!entry) return null;

	const { regex, tokens } = entry;
	regex.lastIndex = 0;
	let out = '';
	let last = 0;
	for (let match = regex.exec(source); match; match = regex.exec(source)) {
		if (match[0] === '') {
			regex.lastIndex++;
			continue;
		}
		const token = tokens[match.slice(1).findIndex((group) => group !== undefined)];
		out += `${escapeHtml(source.slice(last, match.index))}<span class="tok-${token}">${escapeHtml(match[0])}</span>`;
		last = match.index + match[0].length;
	}
	return out + escapeHtml(source.slice(last));
}

const codeBlock =
	/(<pre\b[^>]*>\s*<code\b[^>]*\bclass="[^"]*?language-([\w+#-]+)[^"]*"[^>]*>)([\s\S]*?)(<\/code>)/gi;

const unlabeledBlock = /(<pre\b[^>]*>\s*<code\b(?![^>]*language-)[^>]*>)([\s\S]*?)(<\/code>)/gi;

const MERMAID_START =
	/^\s*(?:%%|graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey|mindmap|timeline|xychart)/;

/** Best guess at the language of a block with no label; null when unsure. */
export function guessLanguage(source: string): string | null {
	const text = source.trim();
	if (!text || MERMAID_START.test(text)) return null;
	const lines = text.split('\n').filter((line) => line.trim());
	const count = (pattern: RegExp) => lines.filter((line) => pattern.test(line)).length;

	if (/^[[{]/.test(text)) {
		try {
			JSON.parse(text);
			return 'json';
		} catch {
			/* not JSON: keep guessing */
		}
	}
	if (/^@@|^diff /m.test(text) && count(/^[+-]/) > 0) return 'diff';
	if (/^<[!A-Za-z]/.test(text)) return 'html';
	if (/^\s*\$\w+\s*=|^\s*[A-Z][a-z]+-[A-Z]\w+/m.test(text)) return 'powershell';
	if (
		/^\s*(?:\$ )?(?:sudo |mkdir|cd |ls\b|ln |cp |mv |rm |cat |echo |export |npm |npx |pnpm |yarn |git |curl |node |pip |brew |apt |claude |docker )/m.test(
			text
		)
	)
		return 'bash';
	if (/^\s*(?:def |import \w+$|from \w+ import|class \w+.*:$)/m.test(text)) return 'python';
	if (/^\s*(?:const |let |var |function |import .+ from|export |async )/m.test(text))
		return 'javascript';
	if (/^[^{}\n]+\{[^}]*:[^}]*;?[^}]*\}/m.test(text)) return 'css';
	if (count(/^(?:#{1,6}\s|[-*]\s|\d+\.\s|>\s)/) >= 2 || /^#{1,6}\s/.test(text)) return 'markdown';
	if (lines.length > 1 && count(/^\s*[\w-]+:(?:\s|$)/) >= lines.length / 2) return 'yaml';
	return null;
}

/** Colours every code block whose language is declared or can be guessed. */
export function highlightCodeBlocks(html: string): string {
	const labeled = html.replace(
		codeBlock,
		(whole, open: string, language: string, body: string, close: string) => {
			try {
				const colored = highlightCode(unescapeHtml(body), language);
				return colored === null ? whole : open + colored + close;
			} catch {
				return whole;
			}
		}
	);
	return labeled.replace(unlabeledBlock, (whole, open: string, body: string, close: string) => {
		try {
			const source = unescapeHtml(body);
			const language = guessLanguage(source);
			const colored = language && highlightCode(source, language);
			return colored ? open + colored + close : whole;
		} catch {
			return whole;
		}
	});
}

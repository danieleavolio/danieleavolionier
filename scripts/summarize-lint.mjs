import { readFile } from 'node:fs/promises';
const report = JSON.parse(await readFile(process.argv[2] || 'test-results/eslint.json', 'utf8'));
const rules = {};
for (const file of report)
	for (const message of file.messages)
		rules[message.ruleId || 'parser'] = (rules[message.ruleId || 'parser'] || 0) + 1;
console.log(
	JSON.stringify(
		{
			rules,
			files: report
				.filter((file) => file.messages.length)
				.map((file) => ({
					file: file.filePath.replace(process.cwd(), '.'),
					messages: file.messages.map(({ line, column, ruleId, message }) => ({
						line,
						column,
						ruleId,
						message
					}))
				}))
		},
		null,
		2
	)
);

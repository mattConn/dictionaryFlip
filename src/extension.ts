'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.flipDictionary', function () {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const dictStr = document.getText(selection);
			let newStr = ''

			const lines = dictStr.split('\n');

			const whitespaceChars = [' ', '\t'];
			lines.forEach((line, i) => {
				if (!line.includes(':')) {
					newStr += line;
					return;
				}

				// get leading whitespace
				let leadingWhitespace = '';
				const index = line.split('').findIndex(char => !whitespaceChars.includes(char));
				if(index !== -1){
					leadingWhitespace = line.slice(0, index);
				}

				const split = line.split(':');
				if (split.length !== 2) {
					return;
				}

				const left = split[0].trim();
				let right = split[1].trim();
				if (right[right.length - 1] === ',') {
					right = right.slice(0, right.length - 1);
				}

				newStr += `${leadingWhitespace}${right} : ${left},\n`;

			})

			editor.edit(editBuilder => {
				editBuilder.replace(selection, newStr);
			});
		}
	});

	context.subscriptions.push(disposable);
}
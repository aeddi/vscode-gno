// This script will be injected into the gnodev iframe to allow
// better interactions with vscode.

// Sending the current location of the iframe to the parent webview.
// Useful for tracking navigation within the iframe and be able to:
// - Reload the iframe
// - Open the current URL in the default browser
window.addEventListener('load', (event) => {
	window.parent.postMessage(
		{
			type: 'location',
			url: event.target.URL
		},
		'*'
	);
});

// Binding keyboard shortcuts for common actions, like: copy, paste, undo, etc.
document.addEventListener('keydown', (event) => {
	if ((event.ctrlKey || event.metaKey) && !event.altKey) {
		const actionsMap = {
			a: () => document.execCommand('selectAll'),
			x: () => document.execCommand('cut'),
			c: () => document.execCommand('copy'),
			v: () => document.execCommand('paste'),
			z: () => document.execCommand(event.shiftKey ? 'redo' : 'undo'),
			y: () => document.execCommand('redo')
		};

		const action = actionsMap[event.key.toLowerCase()];
		if (action) {
			action();
			event.preventDefault();
		}
	}
});

// Forwarding context menu events to the parent window.
document.addEventListener('contextmenu', (event) => {
	window.parent.postMessage(
		{
			type: 'contextmenu',
			clientX: event.clientX,
			clientY: event.clientY
		},
		'*'
	);
});

// Listening for messages from the parent window for context menu actions.
window.addEventListener('message', (event) => {
	switch (event.data.type) {
		case 'cut':
			document.execCommand('cut');
			break;
		case 'copy':
			document.execCommand('copy');
			break;
		case 'paste':
			document.execCommand('paste');
			break;
	}
});

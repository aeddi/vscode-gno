function onceDocumentLoaded(f) {
	if (document.readyState === 'loading' || document.readyState === 'uninitialized') {
		document.addEventListener('DOMContentLoaded', f);
	} else {
		f();
	}
}

const vscode = acquireVsCodeApi();

const iframe = document.getElementById('gnodev-iframe');
const floatingControls = document.querySelector('.floating-controls');
const forwardButton = floatingControls.querySelector('.forward-button');
const backButton = floatingControls.querySelector('.back-button');
const reloadButton = floatingControls.querySelector('.reload-button');
const resetButton = floatingControls.querySelector('.reset-button');
const openExternalButton = floatingControls.querySelector('.open-external-button');

let currentIframeLocation = iframe.src;

onceDocumentLoaded(() => {
	// Listen for messages coming from the iframe.
	window.addEventListener('message', (event) => {
		switch (event.data.type) {
			case 'keydown':
				window.parent.dispatchEvent(new KeyboardEvent('keydown', this.data.event));
				break;
			case 'contextmenu':
				iframe.dispatchEvent(
					new MouseEvent('contextmenu', {
						bubbles: true,
						clientX: event.data.clientX,
						clientY: event.data.clientY
					})
				);
				break;
			case 'location':
				currentIframeLocation = event.data.url;
				break;
		}
	});

	// Forward cut, copy, paste events to the iframe
	window.addEventListener('cut', () => {
		iframe.contentWindow.postMessage({ type: 'cut' }, '*');
	});

	window.addEventListener('copy', () => {
		iframe.contentWindow.postMessage({ type: 'copy' }, '*');
	});

	window.addEventListener('paste', () => {
		iframe.contentWindow.postMessage({ type: 'paste' }, '*');
	});

	// Bind the buttons to their actions
	forwardButton.addEventListener('click', () => {
		history.forward();
	});

	backButton.addEventListener('click', () => {
		history.back();
	});

	reloadButton.addEventListener('click', () => {
		iframe.src = currentIframeLocation;
	});

	resetButton.addEventListener('click', () => {
		vscode.postMessage({ type: 'reset' });
	});

	openExternalButton.addEventListener('click', () => {
		vscode.postMessage({
			type: 'openExternal',
			url: currentIframeLocation
		});
	});
});

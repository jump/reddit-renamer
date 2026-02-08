let nameMap = {};

function renameInNode(node) {
  // 1. Handle Text Nodes directly (most efficient for performance)
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    for (const [oldName, newName] of Object.entries(nameMap)) {
      // Matches "r/name", "/r/name", or just "name" in specific contexts
      if (text === oldName || text === `/${oldName}` || text === oldName.slice(2)) {
        node.textContent = node.textContent.replace(text, newName);
      }
    }
    return;
  }

  // 2. Handle Shadow DOM (Crucial for 2026 Reddit UI)
  if (node.shadowRoot) {
    node.shadowRoot.childNodes.forEach(renameInNode);
    // Also observe the shadow root for changes
    setupObserver(node.shadowRoot);
  }

  // 3. Recurse through children
  node.childNodes.forEach(renameInNode);
}

function setupObserver(target) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => renameInNode(node));
    });
  });
  observer.observe(target, { childList: true, subtree: true });
}

function init() {
  const url = chrome.runtime.getURL('nameMap.json');
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load nameMap.json: ' + response.status);
      return response.json();
    })
    .then(json => {
      nameMap = json;
      // Initial sweep
      renameInNode(document.body);
      // Watch the main document for new posts/sidebar items
      setupObserver(document.body);
    })
    .catch(err => {
      console.error('Could not load nameMap.json.', err);
    });
}

init();

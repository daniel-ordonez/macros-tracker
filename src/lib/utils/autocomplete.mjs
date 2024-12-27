class TrieNode {
	constructor(meta) {
		this.children = {};
		this.isEndOfWord = false;
		this.meta = meta;
	}
}

export class Trie {
	constructor() {
		this.root = new TrieNode();
	}

	insert(word, meta) {
		let node = this.root;
		for (let i = 0; i < word.length; i++) {
			const char = word[i];
			if (!node.children[char]) {
				node.children[char] = new TrieNode();
			}
			node = node.children[char];
		}
		if (node.isEndOfWord) {
			// node already exists
			if (node.meta !== meta) {
				node.siblings = node.siblings ? node.siblings : [];
				node.siblings.push(meta);
			}
		} else {
			node.isEndOfWord = true;
			node.meta = meta;
		}
	}

	searchPrefix(prefix) {
		let node = this.root;
		for (const char of prefix) {
			if (!node.children[char]) {
				return null; // Prefix not found
			}
			node = node.children[char];
		}
		return node;
	}

	autocomplete(prefix) {
		const suggestions = [];
		const node = this.searchPrefix(prefix);
		if (node) {
			this.dfs(node, prefix, suggestions);
		}
		return suggestions;
	}

	autocompleteMeta(prefix) {
		const suggestions = [];
		const node = this.searchPrefix(prefix);
		if (node) {
			this.dfsMeta(node, prefix, suggestions);
		}
		return suggestions;
	}

	dfs(node, currentPrefix, suggestions) {
		if (node.isEndOfWord) {
			suggestions.push(currentPrefix);
		}

		for (const [char, childNode] of Object.entries(node.children)) {
			this.dfs(childNode, currentPrefix + char, suggestions);
		}
	}
	dfsMeta(node, currentPrefix, suggestions) {
		if (node.isEndOfWord) {
			suggestions.push({ text: currentPrefix, meta: node.meta });
		}

		for (const [char, childNode] of Object.entries(node.children)) {
			this.dfsMeta(childNode, currentPrefix + char, suggestions);
		}
	}
}

// Example usage:
/*
const trie = new Trie();
const words = ["apple", "appetizer", "apricot", "banana", "bat", "batman"];
words.forEach(word => trie.insert(word));

const prefix = "app";
const suggestions = trie.autocomplete(prefix);
console.log(suggestions);
*/

class BPETokenizer {
  constructor(vocabSize = 30) {
    this.vocabSize = vocabSize;
    this.vocab = [];
    this.merges = new Map(); // Maps 'token1,token2' -> mergedToken
  }

  // 1. Helper to count frequency of adjacent token pairs
  _getStats(words) {
    const pairs = {};
    for (const [word, freq] of Object.entries(words)) {
      const tokens = word.split(" ");
      for (let i = 0; i < tokens.length - 1; i++) {
        const pair = `${tokens[i]},${tokens[i + 1]}`;
        pairs[pair] = (pairs[pair] || 0) + freq;
      }
    }
    return pairs;
  }

  // 2. Helper to merge the most frequent pair in the corpus
  _mergeVocab(pair, words) {
    const newWords = {};
    const bigram = pair.split(",");
    const target = bigram.join(" ");
    const replacement = bigram.join("");

    for (const [word, freq] of Object.entries(words)) {
      // Regex replaces instances of the separated pair with the merged version
      const regex = new RegExp(`(?<!\\S)${target}(?!\\S)`, "g");
      const updatedWord = word.replace(regex, replacement);
      newWords[updatedWord] = freq;
    }
    return newWords;
  }

  // 3. Train BPE on a text corpus
  train(text) {
    // Clean input and add word boundary marker (</w>)
    const formattedText = text.toLowerCase().trim().replace(/\s+/g, " ");
    const rawWords = formattedText.split(" ");

    let words = {};
    const baseChars = new Set();

    rawWords.forEach((word) => {
      const spacedWord = word.split("").join(" ") + " </w>";
      words[spacedWord] = (words[spacedWord] || 0) + 1;
      word.split("").forEach((c) => baseChars.add(c));
    });
    baseChars.add("</w>");

    this.vocab = Array.from(baseChars);
    let numMerges = this.vocabSize - this.vocab.length;

    // Iterative optimization loop
    for (let i = 0; i < numMerges; i++) {
      const stats = this._getStats(words);
      if (Object.keys(stats).length === 0) break;

      // Find the pair with highest frequency
      const bestPair = Object.keys(stats).reduce((a, b) =>
        stats[a] > stats[b] ? a : b,
      );
      if (stats[bestPair] < 1) break;

      const mergedToken = bestPair.split(",").join("");
      this.merges.set(bestPair, mergedToken);
      this.vocab.push(mergedToken);

      words = this._mergeVocab(bestPair, words);
    }
  }

  // 4. Encode new text into BPE subword segments
  encode(text) {
    const words = text.toLowerCase().trim().split(/\s+/);

    return words.map((word) => {
      let tokens = word.split("");
      tokens.push("</w>");

      // Continuously apply learned merge rules in the exact order they were trained
      while (tokens.length > 1) {
        let bestPairIndex = -1;
        let earliestMergeRank = Infinity;
        let mergeKeyToApply = "";

        // Scan tokens to see which adjacent pair matches our highest-priority merge rule
        for (let i = 0; i < tokens.length - 1; i++) {
          const pair = `${tokens[i]},${tokens[i + 1]}`;
          if (this.merges.has(pair)) {
            // Find the rank (insertion index) of the merge rule
            const rank = Array.from(this.merges.keys()).indexOf(pair);
            if (rank < earliestMergeRank) {
              earliestMergeRank = rank;
              bestPairIndex = i;
              mergeKeyToApply = pair;
            }
          }
        }

        if (bestPairIndex === -1) break; // No more valid merges found

        // Execute the merge on the token array
        const newToken = this.merges.get(mergeKeyToApply);
        tokens.splice(bestPairIndex, 2, newToken);
      }
      return tokens;
    });
  }

  // 5. Decode tokens back to readable string
  decode(encodedWords) {
    return encodedWords
      .map((wordTokens) => wordTokens.join("").replace(/<\/w>/g, ""))
      .join(" ");
  }
}

// --- Execution Example ---
const corpus = "hug hugs bug bugs pug pugs hugger";
const tokenizer = new BPETokenizer(15); // Define desired total vocabulary size

tokenizer.train(corpus);
console.log("Learned Merges:", Array.from(tokenizer.merges.entries()));
console.log("Final Vocabulary:", tokenizer.vocab);

// Encode unseen words using learned subword tokens
const encoded = tokenizer.encode("hugged bugger");
console.log("Encoded 'hugged bugger':", encoded);

// Decode tokens back to string
const decoded = tokenizer.decode(encoded);
console.log("Decoded text:", decoded);

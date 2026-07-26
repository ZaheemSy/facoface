import { RECOGNITION_THRESHOLD } from '../constants';

function cosineSimilarity(embeddingA, embeddingB) {
  if (embeddingA.length !== embeddingB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < embeddingA.length; i++) {
    dotProduct += embeddingA[i] * embeddingB[i];
    normA += embeddingA[i] * embeddingA[i];
    normB += embeddingB[i] * embeddingB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);

  if (magnitude === 0) {
    return 0;
  }

  return dotProduct / magnitude;
}

function findBestMatch(embedding, storedEmbeddings) {
  let bestMatch = null;
  let highestSimilarity = -1;

  for (const item of storedEmbeddings) {
    const similarity = cosineSimilarity(embedding, item.embedding);

    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = item;
    }
  }

  return { bestMatch, highestSimilarity };
}

function matchAgainstThreshold(embedding, persons) {
  const storedEmbeddings = [];

  for (const person of persons) {
    let storedEmbedding = [];
    try {
      storedEmbedding = JSON.parse(person.embedding);
    } catch {
      continue;
    }

    if (!storedEmbedding || storedEmbedding.length === 0) {
      continue;
    }

    storedEmbeddings.push({ person, embedding: storedEmbedding });
  }

  const { bestMatch, highestSimilarity } = findBestMatch(embedding, storedEmbeddings);

  if (bestMatch && highestSimilarity >= RECOGNITION_THRESHOLD) {
    return {
      recognized: true,
      person: bestMatch.person,
      confidence: highestSimilarity,
    };
  }

  return {
    recognized: false,
    person: null,
    confidence: highestSimilarity > 0 ? highestSimilarity : 0,
  };
}

export { cosineSimilarity, findBestMatch, matchAgainstThreshold };

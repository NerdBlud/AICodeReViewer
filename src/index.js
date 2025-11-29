import dotenv from 'dotenv';
import { getPullRequestDiff, postReviewComment, getChangedFiles } from './github.js';
import { reviewWithAI } from './reviewer.js';
import { chunkDiff } from './utils/chunker.js';

dotenv.config();

async function main() {
  try {
    console.log('Starting AI Code Review...');

    const diff = await getPullRequestDiff();
    const files = await getChangedFiles();

    console.log(`Analyzing ${files.length} changed files`);

    const chunks = chunkDiff(diff, files);
    console.log(`Split into ${chunks.length} chunk(s)`);

    const reviews = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Reviewing chunk ${i + 1}/${chunks.length}: ${chunks[i].files.join(', ')}`);
      const review = await reviewWithAI(chunks[i].content, chunks[i].files);
      reviews.push(review);
    }

    const finalReview = combineReviews(reviews, files.length);

    await postReviewComment(finalReview);

    console.log('AI review completed successfully!');
  } catch (error) {
    console.error('Review failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function combineReviews(reviews, totalFiles) {
  const allIssues = reviews.flatMap(r => r.issues || []);
  const allSuggestions = reviews.flatMap(r => r.suggestions || []);

  const uniqueIssues = deduplicateIssues(allIssues);

  return {
    summary: `Analyzed ${totalFiles} file(s) across ${reviews.length} section(s)`,
    issues: uniqueIssues,
    suggestions: allSuggestions,
    reviewCount: reviews.length
  };
}

function deduplicateIssues(issues) {
  const seen = new Map();
  
  for (const issue of issues) {
    const key = `${issue.title}-${issue.file}`.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, issue);
    }
  }
  
  return Array.from(seen.values());
}

main();
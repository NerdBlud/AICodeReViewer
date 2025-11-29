import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const REVIEW_PROMPT = fs.readFileSync(
  path.join(__dirname, 'prompts', 'reviewPrompt.txt'),
  'utf-8'
);

export async function reviewWithAI(diff, files) {
  const prompt = buildPrompt(diff, files);

  try {
    console.log('🧠 Sending code to AI for review...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: REVIEW_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const reviewText = response.choices[0].message.content;
    console.log('AI review received');
    
    return parseReviewResponse(reviewText, files);
  } catch (error) {
    console.error('AI Review Error:', error.message);
    
    return {
      summary: 'Review failed due to API error. Please check logs.',
      issues: [{
        title: 'API Error',
        description: error.message,
        severity: 'HIGH'
      }],
      suggestions: ['Fix API configuration and try again']
    };
  }
}

function buildPrompt(diff, files) {
  const fileList = Array.isArray(files) ? files.join(', ') : 'Multiple files';
  
  return `Please review the following code changes:

**Files changed:** ${fileList}

**Diff:**
\`\`\`diff
${diff}
\`\`\`

Provide a structured review focusing on:
1. Code correctness and potential bugs
2. Security vulnerabilities
3. Performance issues
4. Code quality and maintainability
5. Best practices

Format your response with clear sections for issues and suggestions.`;
}

function parseReviewResponse(text, files) {
  const issues = [];
  const suggestions = [];
  let summary = 'Code review completed';

  const summaryMatch = text.match(/(?:Summary|Overview)[:\s]*([^\n]+(?:\n(?!\n|#{2,})[^\n]+)*)/i);
  if (summaryMatch) {
    summary = summaryMatch[1].trim();
  } else {
    const firstLine = text.split('\n').find(line => line.trim().length > 0);
    if (firstLine) {
      summary = firstLine.trim().replace(/^#+\s*/, '');
    }
  }

  const issuePatterns = [
    /(?:CRITICAL|🚨)[:\s]*([^\n]+)/gi,
    /(?:HIGH|🔴)[:\s]*([^\n]+)/gi,
    /(?:MEDIUM|🟡)[:\s]*([^\n]+)/gi,
    /(?:LOW|🔵)[:\s]*([^\n]+)/gi,
    /Issue[:\s]+([^\n]+)/gi,
    /Problem[:\s]+([^\n]+)/gi,
    /Bug[:\s]+([^\n]+)/gi
  ];

  const severityMap = {
    'CRITICAL': 'CRITICAL',
    '🚨': 'CRITICAL',
    'HIGH': 'HIGH',
    '🔴': 'HIGH',
    'MEDIUM': 'MEDIUM',
    '🟡': 'MEDIUM',
    'LOW': 'LOW',
    '🔵': 'LOW'
  };

  issuePatterns.forEach(pattern => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      const fullMatch = match[0];
      const description = match[1].trim();
      
      let severity = 'MEDIUM';
      for (const [key, value] of Object.entries(severityMap)) {
        if (fullMatch.toUpperCase().includes(key)) {
          severity = value;
          break;
        }
      }

      let file = null;
      const fileMatch = description.match(/(?:in|file|at)\s+[`']?([^\s`']+\.[a-zA-Z]+)[`']?/i);
      if (fileMatch) {
        file = fileMatch[1];
      } else if (Array.isArray(files) && files.length > 0) {
        file = files[0].filename || files[0];
      }

      let line = null;
      const lineMatch = description.match(/line[s]?\s+(\d+)/i);
      if (lineMatch) {
        line = parseInt(lineMatch[1], 10);
      }

      issues.push({
        title: description.split(':')[0].replace(/^\d+\.\s*/, '').trim(),
        description: description,
        severity,
        file,
        line
      });
    });
  });

  const suggestionPatterns = [
    /Suggestion[:\s]+([^\n]+)/gi,
    /Recommend[:\s]+([^\n]+)/gi,
    /Consider[:\s]+([^\n]+)/gi,
    /💡[:\s]*([^\n]+)/gi
  ];

  suggestionPatterns.forEach(pattern => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      const suggestion = match[1].trim();
      if (suggestion.length > 10) {
        suggestions.push(suggestion);
      }
    });
  });

  if (issues.length === 0) {
    const bulletPoints = text.match(/^[\s]*[-•*]\s+([^\n]+)/gm);
    if (bulletPoints) {
      bulletPoints.forEach(point => {
        const cleaned = point.replace(/^[\s]*[-•*]\s+/, '').trim();
        if (cleaned.length > 20) {
          issues.push({
            title: cleaned.substring(0, 50),
            description: cleaned,
            severity: 'MEDIUM'
          });
        }
      });
    }
  }

  const uniqueIssues = Array.from(
    new Map(issues.map(issue => [issue.description, issue])).values()
  );

  const uniqueSuggestions = Array.from(new Set(suggestions));

  return {
    summary,
    issues: uniqueIssues,
    suggestions: uniqueSuggestions
  };
}

export default { reviewWithAI };
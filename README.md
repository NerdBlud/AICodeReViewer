---

# AI Code Reviewer

An automated GitHub bot that reviews pull requests using OpenAI models. The bot provides feedback on code quality, potential bugs, security concerns, and general best practices by commenting directly on pull requests.

---

## Features

* Automated code analysis on pull request open and updates
* Bug detection and potential runtime issue identification
* Basic security issue detection
* Actionable improvement suggestions
* Issue prioritization with severity levels
* Detailed feedback posted directly on pull requests
* Efficient handling of large diffs through chunking

---

## Quick Start

### Prerequisites

* Node.js 18 or higher
* A GitHub repository with Actions enabled
* An OpenAI API key

---

## Installation

1. Clone or copy the repository into your project:

```bash
# Option 1: Clone as a subdirectory
git clone https://github.com/yourusername/AICodeReViewer.git

# Option 2: Copy files directly into your repository
cp -r ai-code-reviewer/* your-repo/
```

2. Install dependencies:

```bash
cd your-repo
npm install
```

3. Configure GitHub Secrets:

* Go to your repository on GitHub
* Navigate to Settings → Secrets and variables → Actions
* Add a new repository secret
* Name it `OPENAI_API_KEY` and paste your API key

4. Commit and push:

```bash
git add .
git commit -m "Add AI code reviewer"
git push origin main
```

5. Test:

* Create a new branch and make changes
* Open a pull request
* The bot will automatically post a review comment

---

## Project Structure

```
AICodeReViewer/
├── .github/
│   └── workflows/
│       └── review.yml          # GitHub Actions workflow
├── src/
│   ├── index.js                # Main entry point
│   ├── github.js               # GitHub API integration
│   ├── reviewer.js             # AI review logic
│   ├── prompts/
│   │   └── reviewPrompt.txt    # AI system prompt
│   └── utils/
│       └── chunker.js          # Diff chunking utility
├── package.json
├── .gitignore
├── .env.example
└── README.md
```

---

## Configuration

### Change AI Model

Edit `src/reviewer.js`:

```javascript
model: 'gpt-4-turbo-preview'
```

Supported options depend on your OpenAI account and configuration.

---

### Adjust Review Focus

Edit `src/prompts/reviewPrompt.txt` to customize:

* Team coding standards
* Framework-specific rules
* Language-specific best practices
* Custom severity criteria

---

### Change Chunk Size

Edit `src/utils/chunker.js`:

```javascript
export function chunkDiff(diff, files, maxSize = 4000) {
  // Increase maxSize for larger context windows
}
```

---

### Workflow Triggers

Edit `.github/workflows/review.yml`:

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

---

## Environment Variables

For local testing only (do not commit):

```env
OPENAI_API_KEY=sk-your-api-key-here
GITHUB_TOKEN=ghp_your-github-token
GITHUB_REPOSITORY=owner/repo
PR_NUMBER=123
```

---

## Example Review Output

```markdown
## AI Code Review

### Summary
Analyzed 3 files with 156 additions and 42 deletions. Found 2 high-priority 
issues and 3 suggestions for improvement.

### Issues Found (2)

High Priority

1. Potential SQL Injection Vulnerability  
   - Direct string concatenation in database query  
   - File: src/database.js  
   - Line: 45  
   - Suggestion: Use parameterized queries or an ORM  

2. Missing Error Handling  
   - Async function without try-catch block  
   - File: src/api.js  
   - Line: 78  

### Suggestions (3)

1. Consider adding input validation for user data  
2. Extract magic numbers into named constants  
3. Add JSDoc comments for complex functions  
```

---

## Troubleshooting

### Reviews not appearing

* Check GitHub Actions logs in the Actions tab
* Verify `OPENAI_API_KEY` is set correctly
* Ensure the workflow has permission to comment on pull requests

---

### API rate limits

* Reduce chunk size to make fewer API calls
* Use a lower-cost model for development
* Add rate limiting in the workflow

---

### Large pull requests timing out

* Increase `max_tokens` in `src/reviewer.js`
* Adjust chunk size in `src/utils/chunker.js`
* Consider limiting the number of files reviewed per run

---

## Cost Considerations

Costs depend on the selected model and pull request size.

Typical review:

* ~2,000 input tokens
* ~500 output tokens

Using lower-cost models during development is recommended to reduce expenses.

---

## Security

* Never commit your `.env` file
* Use GitHub Secrets for sensitive data
* Rotate API keys regularly
* Review the workflow and code before production use
* Consider adding rate limiting to prevent abuse

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a pull request

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments

* Uses Octokit for GitHub API integration
* Inspired by automated code review tools and industry best practices

---

## Support

* Report issues: [https://github.com/nerdblud/AICodeReViewer/issues](https://github.com/nerdblud/AICodeReViewer/issues)
* Request features: [https://github.com/nerdblud/AICodeReViewer/issues](https://github.com/nerdblud/AICodeReViewer/issues)
* Documentation: [https://github.com/nerdblud/AICodeReViewer/wiki](https://github.com/nerdblud/AICodeReViewer/wiki)

---

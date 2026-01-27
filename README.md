# 🤖 AI Code Reviewer

An intelligent GitHub bot that automatically reviews pull requests using OpenAI's GPT-4, providing detailed feedback on code quality, security, and best practices.

## ✨ Features

- 🔍 **Automated Code Analysis** - Triggers on every PR open/update
- 🐛 **Bug Detection** - Identifies potential bugs and runtime errors
- 🔒 **Security Scanning** - Catches security vulnerabilities
- 💡 **Smart Suggestions** - Provides actionable improvement recommendations
- 📊 **Severity Levels** - Prioritizes issues from critical to low
- 📝 **Detailed Feedback** - Comments directly on your PRs
- ⚡ **Fast & Efficient** - Chunks large diffs for optimal processing

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- GitHub repository with Actions enabled
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or download this repository to your project:**

```bash
# Option 1: Clone as a subdirectory
git clone https://github.com/yourusername/AICodeReViewer.git

# Option 2: Copy files directly to your repo
cp -r ai-code-reviewer/* your-repo/
```

2. **Install dependencies:**

```bash
cd your-repo
npm install
```

3. **Configure GitHub Secrets:**

   - Go to your repository on GitHub
   - Navigate to `Settings` → `Secrets and variables` → `Actions`
   - Click `New repository secret`
   - Add `OPENAI_API_KEY` with your OpenAI API key

4. **Commit and push:**

```bash
git add .
git commit -m "Add AI code reviewer"
git push origin main
```

5. **Test it out:**

   - Create a new branch and make some changes
   - Open a pull request
   - Watch the AI reviewer comment automatically! 🎉

## 📁 Project Structure

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

## ⚙️ Configuration

### Customize AI Model

Edit `src/reviewer.js` to change the model:

```javascript
model: 'gpt-4-turbo-preview',  // Options: gpt-4, gpt-4-turbo-preview, gpt-3.5-turbo
```

### Adjust Review Focus

Edit `src/prompts/reviewPrompt.txt` to customize:
- Specific coding standards for your team
- Framework-specific guidelines
- Language-specific best practices
- Custom severity criteria

### Change Chunk Size

Edit `src/utils/chunker.js` to adjust how large diffs are split:

```javascript
export function chunkDiff(diff, files, maxSize = 4000) {
  // Increase maxSize for longer context windows
}
```

### Workflow Triggers

Edit `.github/workflows/review.yml` to change when reviews run:

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]  # Add or remove triggers
```

## 🔧 Environment Variables

Create a `.env` file for local testing (don't commit this!):

```env
OPENAI_API_KEY=sk-your-api-key-here
GITHUB_TOKEN=ghp_your-github-token
GITHUB_REPOSITORY=owner/repo
PR_NUMBER=123
```

## 📊 Example Review Output

```markdown
## 🤖 AI Code Review

### 📊 Summary
Analyzed 3 files with 156 additions and 42 deletions. Found 2 high-priority 
issues and 3 suggestions for improvement.

### ⚠️ Issues Found (2)

#### 🔴 High Priority

1. **Potential SQL Injection Vulnerability**
   - Direct string concatenation in database query
   - 📁 File: `src/database.js`
   - 📍 Line: 45
   - 💡 Suggestion: Use parameterized queries or an ORM

2. **Missing Error Handling**
   - Async function without try-catch block
   - 📁 File: `src/api.js`
   - 📍 Line: 78

### 💡 Suggestions (3)

1. Consider adding input validation for user data
2. Extract magic numbers into named constants
3. Add JSDoc comments for complex functions
```

## 🤔 Troubleshooting

### Reviews not appearing?

1. Check GitHub Actions logs in the "Actions" tab
2. Verify `OPENAI_API_KEY` is set correctly in repository secrets
3. Ensure the bot has permission to comment on PRs (check workflow permissions)

### API rate limits?

- Reduce chunk size to make fewer API calls
- Use `gpt-3.5-turbo` for faster, cheaper reviews
- Add rate limiting in your workflow

### Large PRs timing out?

- Increase `max_tokens` in `src/reviewer.js`
- Adjust chunk size in `src/utils/chunker.js`
- Consider reviewing files separately

### Cost concerns?

- Use `gpt-3.5-turbo` instead of GPT-4 (10x cheaper)
- Only trigger on `ready_for_review` instead of every commit
- Set a file count limit in the workflow

## 💰 Cost Estimation

**GPT-4 Turbo Pricing:**
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

**Average PR Review:**
- ~2,000 input tokens (code)
- ~500 output tokens (review)
- **Cost: ~$0.035 per review**

**100 PRs/month ≈ $3.50/month**

**Tip:** Use GPT-3.5-turbo for development to reduce costs by 90%!

## 🛡️ Security

- Never commit your `.env` file
- Use GitHub Secrets for sensitive data
- Rotate API keys regularly
- Review the code before deploying to production
- Consider rate limiting to prevent abuse

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [OpenAI GPT-4](https://openai.com/)
- Uses [Octokit](https://github.com/octokit/octokit.js) for GitHub API
- Inspired by various code review tools and best practices

## 📞 Support

- 🐛 [Report a bug](https://github.com/nerdblud/AICodeReViewer/issues)
- 💡 [Request a feature](https://github.com/nerdblud/AICodeReViewer/issues)
- 📖 [Read the docs](https://github.com/nerdblud/AICodeReViewer/wiki)

---

**Made with ❤️ by Nerdblud** | Star ⭐ this repo if you find it useful!

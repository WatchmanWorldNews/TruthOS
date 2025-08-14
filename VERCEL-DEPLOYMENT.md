# Vercel Deployment Guide

## Quick Setup Steps:

### 1. Connect Repository
- Go to vercel.com/new
- Import from GitHub: `watchmanworldnews/TruthOS`
- Framework: Node.js
- Build Command: `npm install`
- Output Directory: `./`

### 2. Add All 15 Domains
In Vercel project settings → Domains, add:
1. watchmanworldnews.com
2. truthos.app  
3. findgrace.app
4. fountains.app
5. katechon.app
6. restrainer.app
7. agentstacks.io
8. agentstacks.app
9. dailytruth.app
10. truthers.app
11. truthers.store
12. truthers.shop
13. truthers.info
14. mensdailyapp.com
15. mensdaily.app

### 3. Environment Variables
Add these in Vercel settings → Environment Variables:

```
NODE_ENV=production
DATABASE_URL=[your-postgresql-url]
OPENAI_API_KEY=[your-new-key]
ANTHROPIC_API_KEY=[your-new-key]
GEMINI_API_KEY=[your-new-key]
PERPLEXITY_API_KEY=[your-new-key]
NEWSAPI_KEY=[your-new-key]
GNEWS_KEY=[your-new-key]
EXA_API_KEY=[your-new-key]
```

### 4. Deploy
- Click Deploy
- Wait for build completion
- Test domain routing

## Files Ready:
✅ `vercel.json` - Multi-domain routing  
✅ `package.json` - Dependencies  
✅ `watchman-world-news/server.ts` - Main API server  
✅ Complete TruthOS ecosystem

**The repository should be syncing to GitHub now. Once complete, import to Vercel and deploy!**
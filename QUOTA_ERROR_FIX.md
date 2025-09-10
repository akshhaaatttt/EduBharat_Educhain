# 🚨 Gemini API Quota Error - Quick Fix Guide

## What Happened?
You're seeing a **429 quota exceeded** error because your Gemini API usage has reached the daily or per-minute limits. This is normal when using the free tier.

## ✅ Immediate Solutions

### 1. **Use Fallback Content (Recommended)**
Your app is designed to handle this gracefully:
- Fallback content will be displayed automatically
- Full learning paths and modules are still available
- No functionality is lost - you can continue learning!

### 2. **Check Your API Key**
Make sure you have a valid Gemini API key in your `.env.local` file:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. **Wait and Retry**
- Free tier quotas reset every 24 hours
- Per-minute limits reset every minute
- The app will automatically retry with exponential backoff

## 🔧 Configuration Options

### Enable Debug Mode
Add to your `.env.local`:
```bash
NEXT_PUBLIC_DEBUG_MODE=true
```
This will show detailed error logs in the console.

### Force Fallback Content
```bash
NEXT_PUBLIC_SHOW_FALLBACK_CONTENT=true
```

### Disable AI Features Temporarily
```bash
NEXT_PUBLIC_AI_ENABLED=false
```

## 📊 Understanding Gemini API Limits

### Free Tier Limits:
- **15 requests per minute** per model
- **1,500 requests per day** per model
- **32,000 tokens per minute** for input
- **8,000 tokens per minute** for output

### Pro Model vs Flash Model:
- App now uses `gemini-1.5-flash` (more efficient)
- Consider upgrading to paid tier for higher limits

## 🎯 Long-term Solutions

### 1. **Upgrade to Paid Tier**
Visit [Google AI Studio](https://aistudio.google.com/) to:
- Get higher quotas
- Access to more models
- Better rate limits

### 2. **Implement Request Batching**
The app now includes:
- Client-side rate limiting
- Intelligent retry logic
- Automatic fallback content

### 3. **Optimize Token Usage**
- Reduced `maxOutputTokens` to 1500
- More concise prompts
- Efficient model selection

## 🛠️ Troubleshooting Steps

### Step 1: Check Console Logs
Open browser developer tools and look for:
```
Rate limiter: Too many requests
API quota exceeded, returning fallback content
```

### Step 2: Verify Environment Variables
```bash
# In your project root, create/edit .env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_SHOW_FALLBACK_CONTENT=true
```

### Step 3: Restart Development Server
```bash
npm run dev
# or
yarn dev
```

### Step 4: Test with Different Career Paths
Try generating content for different topics to see if the issue persists.

## 💡 Best Practices

1. **Don't spam the generate button** - wait for responses
2. **Use fallback content** when quotas are exceeded
3. **Monitor your API usage** in Google Cloud Console
4. **Consider caching responses** for frequently used content
5. **Implement user feedback** when AI is unavailable

## 📞 Need Help?

If you continue experiencing issues:

1. **Check API Key**: Ensure it's valid and properly set
2. **Verify Billing**: Make sure your Google Cloud project has billing enabled
3. **Review Quotas**: Check your current usage in Google Cloud Console
4. **Update Dependencies**: Ensure `@google/generative-ai` is up to date

## 🎉 Good News!

Your app is now **quota-resilient**:
- ✅ Automatic fallback content
- ✅ Smart retry logic
- ✅ User-friendly error messages
- ✅ Rate limiting protection
- ✅ Graceful degradation

Users will always get high-quality learning content, whether from AI or fallback systems!

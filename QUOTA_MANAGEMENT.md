# API Quota Management Guide

## Understanding Gemini API Quotas

The EduCareer AI platform uses Google's Gemini AI for content generation. The free tier has certain limitations:

### Free Tier Limits
- **Requests per day**: Limited number of requests per model
- **Requests per minute**: Rate limiting to prevent abuse
- **Token limits**: Input and output token restrictions

### Common Quota Errors
You might see these error messages:
- `429 You exceeded your current quota`
- `Rate limit exceeded`
- `Quota failure`

## How We Handle Quotas

### 1. Smart Model Selection
- Uses `gemini-1.5-flash` instead of `gemini-1.5-pro` for better quota efficiency
- Optimized generation parameters to reduce token usage

### 2. Retry Logic
- Automatic retry with exponential backoff
- Up to 3 retry attempts for quota-related errors
- Intelligent delay between retries

### 3. Fallback Content
- Provides high-quality fallback content when quotas are exceeded
- Users can still learn and progress without AI-generated content
- Clear notification when fallback content is being used

### 4. Error Handling
- User-friendly error messages
- Clear instructions on what to do next
- Option to retry when appropriate

## Best Practices for Users

### Optimize Usage
1. **Generate content during off-peak hours** (early morning or late evening)
2. **Use specific prompts** to get focused content
3. **Save generated content** for future reference
4. **Avoid rapid-fire requests** - allow time between generations

### When Quotas Are Exceeded
1. **Use fallback content** - it's still valuable for learning
2. **Try again later** - quotas reset daily
3. **Focus on other features** - wallet connection, mentor browsing, etc.
4. **Save your progress** - bookmark interesting content

## Configuration Options

You can configure the behavior in your `.env` file:

```env
# Enable/disable AI features entirely
NEXT_PUBLIC_AI_ENABLED=true

# Show fallback content when quotas are exceeded
NEXT_PUBLIC_SHOW_FALLBACK_CONTENT=true

# Enable debug mode for development
NEXT_PUBLIC_DEBUG_MODE=false
```

## Getting More Quota

To increase your API limits:

1. **Upgrade to paid tier** on Google AI Studio
2. **Set up billing** in Google Cloud Console
3. **Monitor usage** through the Google Cloud Console
4. **Optimize prompts** to use fewer tokens

## Monitoring Usage

Track your API usage:
- Visit [Google AI Studio](https://makersuite.google.com/)
- Check quota usage in your dashboard
- Set up alerts for approaching limits

## Alternative Solutions

If you frequently hit quotas:
1. **Use your own API key** with higher limits
2. **Implement caching** to reuse generated content
3. **Consider other AI providers** as alternatives
4. **Pre-generate content** during off-peak times

## Support

If you continue experiencing issues:
- Check your API key configuration
- Verify your Google Cloud project settings
- Review the Gemini API documentation
- Contact support with specific error messages

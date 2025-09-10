// Simple client-side rate limiter for API requests
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    // Check if we can make a new request
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }

  getTimeUntilNextRequest(): number {
    if (this.requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    const timeUntilOldestExpires = this.windowMs - (Date.now() - oldestRequest);
    
    return Math.max(0, timeUntilOldestExpires);
  }

  reset(): void {
    this.requests = [];
  }
}

// Export a singleton instance
export const geminiRateLimiter = new RateLimiter(5, 60000); // 5 requests per minute
export default RateLimiter;

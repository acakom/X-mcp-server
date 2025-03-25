import { z } from "zod";
import axios from "axios";

// RapidAPI configuration
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "twitter154.p.rapidapi.com";

/**
 * Registers Twitter search tools with the MCP server
 * @param {McpServer} server - The MCP server instance
 */
export function registerTwitterTools(server) {
  // Create a reusable search function
  const performTwitterSearch = async (query, section, limit) => {
    // Check for API key
    if (!RAPIDAPI_KEY) {
      throw new Error("RAPIDAPI_KEY environment variable is not set");
    }
    
    // Log the query for debugging
    console.error(`TWITTER SEARCH: ${query}`);
    
    // Track all fetched tweets
    let allTweets = [];
    let continuationToken = null;
    
    // RapidAPI has a max of 20 per request, so we'll need to paginate
    const maxPerRequest = 20;
    const requestsNeeded = Math.ceil(limit / maxPerRequest);
    
    // Make requests until we hit the limit or run out of results
    for (let i = 0; i < requestsNeeded; i++) {
      // Build the query parameters
      const params = new URLSearchParams({
        query: query,
        section: section,
        limit: Math.min(maxPerRequest, limit - allTweets.length).toString()
      });
      
      // Add continuation token if available
      if (continuationToken) {
        params.append('continuation_token', continuationToken);
      }
      
      // Make the API request
      const response = await axios({
        method: 'GET',
        url: `https://twitter154.p.rapidapi.com/search/search?${params.toString()}`,
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST
        }
      });
      
      // Extract tweets and continuation token
      const newTweets = response.data.results || [];
      allTweets = [...allTweets, ...newTweets];
      
      // Store continuation token for next request
      continuationToken = response.data.continuation_token;
      
      // Stop if we don't have a continuation token or reached our limit
      if (!continuationToken || allTweets.length >= limit) {
        break;
      }
    }
    
    // Return only up to the requested limit
    return allTweets.slice(0, limit);
  };

  // Add Twitter search tool
  server.tool("searchTwitter",
    { 
      query: z.string().min(1, "Search query is required"),
      section: z.enum(["latest", "top"]).optional().default("latest"),
      limit: z.number().int().positive().optional().default(20)
    },
    async ({ query, section, limit }) => {
      try {
        // Use the search function with the query directly
        const tweets = await performTwitterSearch(query, section, limit);
        
        // Format the response
        return {
          content: [{ 
            type: "text", 
            text: formatTwitterResults(query, tweets, section)
          }]
        };
      } catch (error) {
        console.error('Error searching Twitter:', error);
        return {
          content: [{ 
            type: "text", 
            text: `Error searching Twitter: ${error.message}`
          }]
        };
      }
    }
  );
}

/**
 * Format Twitter search results into a professional, clean response
 * @param {string} query - The search query
 * @param {Array} tweets - Array of tweet objects
 * @param {string} section - The section searched (latest or top)
 * @returns {string} Formatted results
 */
function formatTwitterResults(query, tweets, section) {
  if (!tweets || tweets.length === 0) {
    return `No tweets found for query: ${query}`;
  }
  
  let output = [];
  

  
  tweets.forEach((tweet, index) => {
    // Create clear separation between tweets
    output.push(`## [${index + 1}] Tweet by @${tweet.user.username}`);
    
    // User information
    let userInfo = `**User:** ${tweet.user.name} (@${tweet.user.username})`;
    if (tweet.user.is_blue_verified) {
      userInfo += ` [Verified]`;
    } else if (tweet.user.is_verified) {
      userInfo += ` [Verified]`;
    }
    output.push(userInfo);
    
    // User stats if available
    if (tweet.user) {
      const userStats = [];
      if (tweet.user.follower_count !== undefined) userStats.push(`${tweet.user.follower_count} followers`);
      if (tweet.user.following_count !== undefined) userStats.push(`${tweet.user.following_count} following`);
      if (userStats.length > 0) {
        output.push(`**Account stats:** ${userStats.join(', ')}`);
      }
    }
    
    // Tweet content
    output.push(`\n**Content:** ${tweet.text}\n`);
    
    // Engagement metrics
    let metrics = [];
    metrics.push(`${tweet.favorite_count} likes`);
    metrics.push(`${tweet.retweet_count} retweets`);
    metrics.push(`${tweet.reply_count} replies`);
    
    // Add quotes and bookmarks if available
    if (tweet.quote_count) metrics.push(`${tweet.quote_count} quotes`);
    if (tweet.bookmark_count) metrics.push(`${tweet.bookmark_count} bookmarks`);
    
    // Add view count if available
    if (tweet.views) metrics.push(`${tweet.views} views`);
    
    output.push(`**Engagement:** ${metrics.join(' | ')}`);
    
    // Creation date - fix the Invalid Date issue
    try {
      // Try parsing the date properly
      const date = new Date(tweet.created_at || tweet.creation_date);
      const formattedDate = !isNaN(date.getTime()) ? 
        `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB')}` : 
        'Date unavailable';
      output.push(`**Posted:** ${formattedDate}`);
    } catch (e) {
      output.push(`**Posted:** Date format error`);
    }
    
   
    
    // Add reply info if it's a reply
    if (tweet.in_reply_to_status_id_str) {
      output.push(`**Reply to:** https://twitter.com/status/${tweet.in_reply_to_status_id_str}`);
    }
    
    // Add media if available
    if (tweet.media && tweet.media.length > 0) {
      output.push(`**Media:** ${tweet.media.length} attachment(s)`);
      tweet.media.forEach(media => {
        output.push(`  - ${media.media_url_https || media.media_url}`);
      });
    }
    
    // Add video info if available
    if ((tweet.extended_entities && 
         tweet.extended_entities.media && 
         tweet.extended_entities.media.some(m => m.type === "video" || m.type === "animated_gif")) || 
        tweet.video_url) {
      output.push(`**Video:** ${tweet.video_url || "Multiple formats available"}`);
    }
    
    // Add tweet URL - construct a proper URL
    const tweetId = tweet.id_str || tweet.tweet_id;
    if (tweetId && tweet.user && tweet.user.username) {
      output.push(`**URL:** https://twitter.com/${tweet.user.username}/status/${tweetId}`);
    } else {
      output.push(`**URL:** Unable to construct URL (missing id or username)`);
    }
    
    
    
    // Add separator between tweets
    output.push('\n---\n');
  });
  
 
  
  return output.join('\n');
} 
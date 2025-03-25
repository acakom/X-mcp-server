# X Tools - Twitter Search Instructions

## Responding to User Intent
* When using this tool, respond based on what the user is asking for:
  - If they're asking for tweets without analysis, provide only the search results
  - If they're explicitly asking for analysis, provide both results and analysis
  - If they're asking for specific insights, focus on addressing their specific questions
* Be flexible and responsive to what the user is trying to accomplish

## Main Features
- You can search tweets using Twitter's advanced search syntax
- You can filter by user, keywords, dates, media, and other parameters
- Results include engagement metrics like likes, retweets, and views

## How to Use Search Syntax
To search for tweets, you can use natural language commands or specific Twitter syntax. Examples:

**Natural language:**
- "Search for tweets by elonmusk about bitcoin"
- "Find tweets mentioning Claude with at least 100 likes"
- "Show tweets with videos about artificial intelligence in the last month"

**Direct syntax:**
- `from:elonmusk bitcoin`
- `@anthropic min_faves:100`
- `AI filter:native_video since:2023-12-01`

## Main Operators

### Users
- `from:username` - Tweets sent by a specific account
- `to:username` - Replies to a specific account
- `@username` - Tweets mentioning the account

### Media and Links
- `filter:media` - Tweets with any media
- `filter:images` - Tweets with images
- `filter:native_video` - Tweets with videos
- `filter:links` - Tweets with links

### Dates
- `since:YYYY-MM-DD` - Tweets after this date
- `until:YYYY-MM-DD` - Tweets before this date

### Engagement
- `min_retweets:n` - Tweets with at least n retweets
- `min_faves:n` - Tweets with at least n likes
- `min_replies:n` - Tweets with at least n replies

## Practical Examples
1. **Search for tweets by a user on a topic:**
   - `from:elonmusk spacex`
   
2. **Find popular tweets on a topic:**
   - `ai min_retweets:100 -filter:retweets`
   
3. **Search for tweets with media in a specific period:**
   - `climate filter:images since:2023-01-01 until:2023-12-31`
   
4. **Find mentions between users:**
   - `from:Microsoft @OpenAI`

## Types of User Requests and How to Respond

### For Tweet Search Only:
When users ask questions like "Show me tweets about X" or "Find tweets from user Y about Z":
- Execute the search and display the tweet results
- No need for analysis unless specifically requested

### For Analysis:
When users ask questions like "What's the sentiment about X?" or "Analyze these tweets for patterns":
- Execute the search
- Display the results
- Provide thoughtful analysis of the content

### For Hybrid Requests:
When users want both, like "Find tweets about X and tell me what people think":
- Show the tweet results
- Follow with a brief analysis focused on what was requested

The default limit is 20 tweets per search, but users can specify more (up to 50) if needed.
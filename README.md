# X Tools for Claude MCP

A lightweight, open-source toolkit that enables Claude to search Twitter efficiently and display results exactly as returned without analysis or summarization. Designed primarily for natural language interactions.

## Features

- **Natural Language Search**: Ask Claude to search Twitter in plain English
- **Twitter Search**: Search tweets using natural language or advanced Twitter syntax
- **Professional Formatting**: Clean, markdown-formatted tweet display
- **Raw Results**: Configured to show tweet content exactly as returned without AI analysis
- **Advanced Filtering**: Find tweets by keywords, users, dates, engagement metrics, and more
- **Pagination Support**: Retrieve more than the default 20 tweets per search when needed

## Installation

### Prerequisites

- Node.js v16+
- Claude for Desktop
- Free RapidAPI key with access to Twitter154 API endpoint

### Setup Steps

1. **Clone this repository**:
   ```bash
   git clone https://github.com/0xGval/twitter-X-mcp-server
   cd x-tools-mcp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create your configuration**:
   - Copy `mcp.json.example` to `mcp.json` in your Claude Desktop directory
   - Edit `mcp.json` to include your RapidAPI key and correct file paths

   ```json
   {
     "mcpServers": {
       "x-tools": {
         "command": "node",
         "args": ["YOUR_ABSOLUTE_PATH_TO/main.js"],
         "env": {
           "RAPIDAPI_KEY": "your_rapidapi_key"
         }
       }
     }
   }
   ```

4. **Configure Claude for Desktop**:
   - On Windows: Place your `mcp.json` file in `%APPDATA%\Claude\`
   - On macOS: Place your `mcp.json` file in `~/Library/Application Support/Claude/`
   - Copy `claude-rules.md` and `knowledge/TwitterSearchSyntaxGuide.txt` to your Claude knowledge base directory
   - Restart Claude Desktop for the changes to take effect

## Available Tools

### Twitter Search

The tool is primarily designed to be used with natural language. Simply ask Claude to search for something on Twitter, and it will interpret your request.

```
searchTwitter(query: "keyword", section: "latest", limit: 20)
```

Search Twitter using natural language or advanced syntax:

- `query`: Search query (supports Twitter's advanced search operators)
- `section`: "latest" or "top" results (default: "latest")
- `limit`: Number of tweets to return (default: 20)

## Natural Language Examples

### Simple Query

Ask Claude:
```
Show me recent tweets about artificial intelligence
```

### User-Focused Query

Ask Claude:
```
Find the latest tweets from Elon Musk that mention SpaceX
```

### Complex Natural Query

Ask Claude:
```
Search for tweets about climate change with at least 100 likes from the past month
```

### Engagement-Filtered Query

Ask Claude:
```
Find popular tweets discussing the new Apple Vision Pro that include images
```

## Direct Syntax Examples

For those who prefer direct syntax:

```
from:elonmusk spacex since:2023-01-01
```

```
"artificial intelligence" filter:images min_faves:100
```

```
climate action min_retweets:50 -filter:retweets
```

## Required Files

This tool includes several important files that must be properly set up:

- **main.js**: The main application file
- **tools/twitter.js**: The Twitter search implementation
- **claude-rules.md**: Instructions for Claude to display search results correctly
- **knowledge/TwitterSearchSyntaxGuide.txt**: Reference guide for Twitter search syntax

Make sure all these files are placed in the correct locations in your Claude setup.

## Search Syntax

The tool supports all standard Twitter search operators, which Claude can apply from your natural language:

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

## Troubleshooting

Common issues:

- **API Key Not Found**: Ensure your RapidAPI key is correctly set in `mcp.json`
- **Path Errors**: Make sure you're using full absolute paths with proper escaping in Windows (`\\`)
- **No Results**: Check that your search query is valid and not too restrictive
- **Claude Still Summarizes**: Make sure you have the latest version of the tool that includes the strict output format instructions
- **Missing Files**: Verify that `claude-rules.md` and `TwitterSearchSyntaxGuide.txt` are properly added to your Claude rules andknowledge base

## Development

To modify the tool:

1. Edit the files in the `tools/` directory
2. Update the formatting in `formatTwitterResults()` function if needed
3. Restart Claude for Desktop to see changes

## License

This project is licensed under the MIT License.

## Acknowledgements

- Model Context Protocol (MCP) by Anthropic
- RapidAPI Twitter154 API
- Axios
- Zod

---

**Note**: This tool is designed to work with the Claude AI assistant and display Twitter search results exactly as returned, without any analysis or summarization.
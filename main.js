/**
 * X Tools for Claude
 * 
 * @module x-tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import https from 'https';

// Load environment variables from .env file
dotenv.config();

// Add debug logging
console.error('Environment loaded. API Keys available:');
console.error('- RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? 'Available ✓' : 'Missing ✗');
console.error('- DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? 'Available ✓' : 'Missing ✗');

// Import tool registration functions
import { registerTwitterTools } from "./tools/twitter.js";

// Add global error handling to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION in main.js:', err);
});

// Create an MCP server with metadata
const server = new McpServer({
  name: "X Tools - DISPLAY RESULTS VERBATIM",
  version: "1.0.0",
  description: "Tools for searching Twitter. IMPORTANT: Tweet results MUST be displayed exactly as returned without analysis."
});

// Register all tools - each tool group is managed in a separate module
registerTwitterTools(server);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();

// Connect the server to the transport
await server.connect(transport);
# Hello World MCP Server

A simple Model Context Protocol (MCP) server built with Node.js and TypeScript to demonstrate basic MCP concepts.

## What is MCP?

Model Context Protocol (MCP) is a protocol that allows AI models to securely access external tools, resources, and prompts. This server demonstrates the three main MCP capabilities:

- **Tools**: Functions that can be called by the AI model
- **Resources**: Static content that can be read by the AI model  
- **Prompts**: Templates that can be used to generate responses

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

## Features

### Tools
This server provides three simple tools:

1. **hello** - Returns a personalized greeting
   - Input: `name` (string)
   - Example: `{"name": "Alice"}`

2. **current_time** - Returns the current date and time
   - Input: No parameters required

3. **calculate** - Performs basic arithmetic operations
   - Input: `operation` (add/subtract/multiply/divide), `a` (number), `b` (number)
   - Example: `{"operation": "add", "a": 5, "b": 3}`

### Resources
The server provides two static resources:

1. **info://server** - Information about the server
2. **greeting://welcome** - A welcome message for new users

### Prompts
The server includes one prompt template:

1. **greeting** - Generates personalized greetings
   - Arguments: `name` (required), `style` (optional: formal/casual/friendly)

## How MCP Works

1. **Client Connection**: An MCP client (like Claude Desktop) connects to the server via stdio
2. **Capability Discovery**: The client asks what tools, resources, and prompts are available
3. **Tool Execution**: The client can call tools with specific parameters
4. **Resource Reading**: The client can read static resources
5. **Prompt Generation**: The client can use prompts to generate responses

## Testing with Claude Desktop

To test this server with Claude Desktop:

1. Build and start the server
2. Configure Claude Desktop to connect to your MCP server
3. The server will be available as a tool provider in Claude Desktop

## Project Structure

```
hello-world-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript (generated)
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Key MCP Concepts Demonstrated

- **Server Setup**: Creating an MCP server with capabilities
- **Request Handlers**: Handling different types of MCP requests
- **Error Handling**: Proper error responses
- **Type Safety**: Using TypeScript for better development experience
- **Transport**: Using stdio transport for communication

## Next Steps

After understanding this basic example, you can:

1. Add more complex tools that interact with external APIs
2. Create resources that read from files or databases
3. Build more sophisticated prompt templates
4. Add authentication and security features
5. Implement more advanced MCP features like progress reporting

## Learn More

- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Examples](https://github.com/modelcontextprotocol/servers)
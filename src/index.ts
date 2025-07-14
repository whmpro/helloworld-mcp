#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolResult,
  TextContent,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  Resource,
  ReadResourceResult,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  Prompt,
  GetPromptResult,
  PromptMessage,
  PromptArgument
} from '@modelcontextprotocol/sdk/types.js';

// Create the server instance
const server = new Server(
  {
    name: 'hello-world-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'hello',
    description: 'Returns a hello message',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name to greet',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'current_time',
    description: 'Returns the current time',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'calculate',
    description: 'Performs basic arithmetic operations',
    inputSchema: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          enum: ['add', 'subtract', 'multiply', 'divide'],
          description: 'The operation to perform',
        },
        a: {
          type: 'number',
          description: 'First number',
        },
        b: {
          type: 'number',
          description: 'Second number',
        },
      },
      required: ['operation', 'a', 'b'],
    },
  },
];

// Define available resources
const RESOURCES: Resource[] = [
  {
    uri: 'info://server',
    mimeType: 'text/plain',
    name: 'Server Information',
    description: 'Information about this MCP server',
  },
  {
    uri: 'greeting://welcome',
    mimeType: 'text/plain',
    name: 'Welcome Message',
    description: 'A welcome message for new users',
  },
];

// Define available prompts
const PROMPTS: Prompt[] = [
  {
    name: 'greeting',
    description: 'Generate a personalized greeting',
    arguments: [
      {
        name: 'name',
        description: 'Name of the person to greet',
        required: true,
      },
      {
        name: 'style',
        description: 'Style of greeting (formal, casual, friendly)',
        required: false,
      },
    ],
  },
];

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'hello': {
        const name = args?.name as string;
        const message = `Hello, ${name}! Welcome to the MCP Hello World server!`;
        return {
          content: [
            {
              type: 'text',
              text: message,
            } as TextContent,
          ],
        };
      }

      case 'current_time': {
        const now = new Date();
        const timeString = now.toLocaleString();
        return {
          content: [
            {
              type: 'text',
              text: `Current time: ${timeString}`,
            } as TextContent,
          ],
        };
      }

      case 'calculate': {
        const { operation, a, b } = args as { operation: string; a: number; b: number };
        let result: number;
        
        switch (operation) {
          case 'add':
            result = a + b;
            break;
          case 'subtract':
            result = a - b;
            break;
          case 'multiply':
            result = a * b;
            break;
          case 'divide':
            if (b === 0) {
              throw new Error('Division by zero is not allowed');
            }
            result = a / b;
            break;
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: `${a} ${operation} ${b} = ${result}`,
            } as TextContent,
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        } as TextContent,
      ],
      isError: true,
    };
  }
});

// Handle resource listing
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: RESOURCES,
  };
});

// Handle resource reading
server.setRequestHandler(ReadResourceRequestSchema, async (request): Promise<ReadResourceResult> => {
  const { uri } = request.params;

  switch (uri) {
    case 'info://server':
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: 'This is a Hello World MCP server built with Node.js and TypeScript. It demonstrates basic MCP capabilities including tools, resources, and prompts.',
          },
        ],
      };

    case 'greeting://welcome':
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: 'Welcome to the MCP Hello World server! This server provides simple tools for greeting, time checking, and basic calculations.',
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Handle prompt listing
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: PROMPTS,
  };
});

// Handle prompt execution
server.setRequestHandler(GetPromptRequestSchema, async (request): Promise<GetPromptResult> => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'greeting': {
      const userName = args?.name as string;
      const style = (args?.style as string) || 'friendly';
      
      let greeting: string;
      switch (style) {
        case 'formal':
          greeting = `Good day, ${userName}. I trust you are well.`;
          break;
        case 'casual':
          greeting = `Hey ${userName}! What's up?`;
          break;
        case 'friendly':
        default:
          greeting = `Hi ${userName}! It's great to meet you!`;
          break;
      }

      return {
        description: `A ${style} greeting for ${userName}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: greeting,
            },
          } as PromptMessage,
        ],
      };
    }

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Hello World MCP server running on stdio');
}

// Handle process termination
process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
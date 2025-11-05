import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyCHzQmCyIQrB6KdqgmToreKyi001b0nzic"
);

// Type definitions
interface TextEntry {
  id: string;
  label: string;
  value: string;
  valueType: "text" | "image" | "video";
}

interface Node {
  id: string;
  contentType: string;
  position: { x: number; y: number };
  textEntries: TextEntry[];
  message?: string;
}

interface Edge {
  source: string;
  target: string;
}

interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

interface RequestBody {
  prompt: string;
}

const SYSTEM_PROMPT = `You are an advanced flow diagram generator. Given a user's description, create a structured flow with multiple nodes and complex connections.

IMPORTANT: Return ONLY valid JSON, no markdown.

Your response must be a JSON object with this exact structure:
{
  "nodes": [
    {
      "id": "1",
      "contentType": "text",
      "position": { "x": 100, "y": 100 },
      "textEntries": [
        {
          "id": "entry1",
          "label": "Title",
          "value": "Welcome Message",
          "valueType": "text"
        },
        {
          "id": "entry2", 
          "label": "Description",
          "value": "Enter your details to proceed",
          "valueType": "text"
        }
      ]
    }
  ],
  "edges": [
    {
      "source": "1",
      "target": "2"
    }
  ]
}

CRITICAL RULES FOR TEXT ENTRIES:
1. Each node should have 2-5 textEntries for detailed information
2. Each textEntry MUST have:
   - id: unique identifier (e.g., "entry1", "entry2")
   - label: descriptive header (e.g., "Title", "Description", "Instructions", "Details", "Requirements", "Notes")
   - value: the actual content
   - valueType: "text", "image", or "video"

3. Common label patterns:
   - For input nodes: "Field Name", "Input Type", "Validation Rules", "Placeholder", "Help Text"
   - For process nodes: "Action", "Description", "Requirements", "Success Criteria"
   - For decision nodes: "Condition", "If True", "If False", "Validation Logic"
   - For output nodes: "Result", "Message", "Next Steps", "Download Link"

4. Value types:
   - "text": Regular text content (most common)
   - "image": When description mentions image, diagram, or visual
   - "video": When description mentions video, tutorial, or demo

5. Be VERY DETAILED in values:
   - Input fields: Include data type, format, examples
   - Validations: Specify exact rules and error messages
   - Actions: Describe what happens step by step
   - Messages: Include full user-facing text

ADVANCED RULES for Complex Flows:
1. Create 3-20 nodes depending on complexity
2. Support multiple connection patterns:
   - Linear: A → B → C
   - Branching: A → B, A → C
   - Converging: A → C, B → C
   - Parallel: A → B and C → D
3. Position nodes intelligently:
   - Start nodes at x:100, y:200
   - Horizontal spacing: 350-400px between nodes
   - Vertical spacing: 200px for different branches
4. Return ONLY the JSON object

Example for a detailed node:
{
  "id": "3",
  "contentType": "text",
  "position": { "x": 450, "y": 200 },
  "textEntries": [
    {
      "id": "entry1",
      "label": "Customer Email",
      "value": "Enter customer email address",
      "valueType": "text"
    },
    {
      "id": "entry2",
      "label": "Format",
      "value": "Email format: example@domain.com",
      "valueType": "text"
    },
    {
      "id": "entry3",
      "label": "Validation",
      "value": "Must be valid email format with @ and domain. Check for typos.",
      "valueType": "text"
    },
    {
      "id": "entry4",
      "label": "Error Message",
      "value": "Invalid email format. Please enter a valid email address.",
      "valueType": "text"
    }
  ]
}`;

function calculateComplexNodePositions(nodes: Node[], edges: Edge[]): Node[] {
  // Analyze the flow structure
  const nodeMap = new Map<string, Node>();
  const inDegree = new Map<string, number>();
  const outDegree = new Map<string, number>();

  // Initialize maps
  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
    inDegree.set(node.id, 0);
    outDegree.set(node.id, 0);
  });

  // Calculate degrees
  edges.forEach((edge) => {
    outDegree.set(edge.source, (outDegree.get(edge.source) || 0) + 1);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });

  // Find start nodes (no incoming edges)
  const startNodes = nodes.filter((node) => inDegree.get(node.id) === 0);

  // Perform level-based layout (BFS)
  const levels = new Map<string, number>(); // nodeId -> level
  const queue: { id: string; level: number }[] = [
    ...startNodes.map((n) => ({ id: n.id, level: 0 })),
  ];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    const { id, level } = current;

    if (visited.has(id)) continue;
    visited.add(id);
    levels.set(id, level);

    // Find children
    const children = edges.filter((e) => e.source === id).map((e) => e.target);

    children.forEach((childId) => {
      if (!visited.has(childId)) {
        queue.push({ id: childId, level: level + 1 });
      }
    });
  }

  // Group nodes by level
  const levelGroups = new Map<number, string[]>();
  levels.forEach((level, nodeId) => {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)?.push(nodeId);
  });

  // Position nodes
  const horizontalSpacing = 380;
  const verticalSpacing = 180;
  const startX = 100;
  const startY = 200;

  levelGroups.forEach((nodeIds, level) => {
    const x = startX + level * horizontalSpacing;
    const levelHeight = (nodeIds.length - 1) * verticalSpacing;
    const startYForLevel = startY - levelHeight / 2;

    nodeIds.forEach((nodeId, index) => {
      const node = nodeMap.get(nodeId);
      if (node) {
        node.position = {
          x: x,
          y: startYForLevel + index * verticalSpacing,
        };
      }
    });
  });

  return nodes;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Prompt is required and must be a non-empty string",
        },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini API key not configured",
        },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Enhanced prompt with complexity analysis
    const fullPrompt = `${SYSTEM_PROMPT}

User Request: ${prompt}

Analyze the complexity and create DETAILED nodes:
- If simple (basic form, 2-3 steps) → create 3-5 nodes with 2-3 textEntries each
- If moderate (multiple inputs, validation) → create 6-10 nodes with 3-4 textEntries each
- If complex (multi-stage process, branching logic) → create 10-20 nodes with 4-5 textEntries each

For each node, provide comprehensive information using textEntries:
- Main heading/title in first entry
- Detailed description in second entry
- Specific instructions/requirements in additional entries
- Include validation rules, error messages, or success criteria where relevant

Generate the detailed flow JSON:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let generatedText = response.text();

    // Clean up response
    generatedText = generatedText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/^[^{]*/, "") // Remove any text before first {
      .replace(/[^}]*$/, "") // Remove any text after last }
      .trim();

    let flowData: FlowData;
    try {
      flowData = JSON.parse(generatedText) as FlowData;
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", generatedText);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON response from AI",
        },
        { status: 500 }
      );
    }

    // Validate structure
    if (
      !flowData.nodes ||
      !Array.isArray(flowData.nodes) ||
      flowData.nodes.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid flow data structure: missing or empty nodes array",
        },
        { status: 500 }
      );
    }

    if (!flowData.edges || !Array.isArray(flowData.edges)) {
      flowData.edges = []; // Allow flows without edges initially
    }

    // Ensure all required fields and add defaults
    flowData.nodes = flowData.nodes.map((node, index) => {
      const nodeId = node.id || (index + 1).toString();

      // Handle new textEntries structure
      let textEntries: TextEntry[] = [];

      if (
        node.textEntries &&
        Array.isArray(node.textEntries) &&
        node.textEntries.length > 0
      ) {
        // Use provided textEntries
        textEntries = node.textEntries.map((entry, entryIndex) => ({
          id: entry.id || `entry${entryIndex + 1}`,
          label: entry.label || `Field ${entryIndex + 1}`,
          value: entry.value || "",
          valueType: (entry.valueType || "text") as "text" | "image" | "video",
        }));
      } else if (node.message) {
        // Convert old message format to textEntries for backward compatibility
        textEntries = [
          {
            id: "entry1",
            label: "Message",
            value: node.message,
            valueType: "text",
          },
        ];
      } else {
        // Default empty entry
        textEntries = [
          {
            id: "entry1",
            label: "Content",
            value: `Node ${index + 1}`,
            valueType: "text",
          },
        ];
      }

      return {
        id: nodeId,
        contentType: node.contentType || "text",
        position: node.position || { x: 100 + index * 300, y: 200 },
        textEntries: textEntries,
        // Keep message for backward compatibility
        message:
          node.message ||
          textEntries.map((e) => `${e.label}: ${e.value}`).join(" | "),
      };
    });

    // Apply intelligent positioning based on edge connections
    if (flowData.edges.length > 0) {
      flowData.nodes = calculateComplexNodePositions(
        flowData.nodes,
        flowData.edges
      );
    }

    // Validate edges reference existing nodes
    const nodeIds = new Set(flowData.nodes.map((n) => n.id));
    flowData.edges = flowData.edges.filter(
      (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );

    console.log("Generated complex flow:", JSON.stringify(flowData, null, 2));

    return NextResponse.json({
      success: true,
      flowData: flowData,
    });
  } catch (error) {
    console.error("Error generating flow:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate flow",
      },
      { status: 500 }
    );
  }
}

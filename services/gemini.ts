import { GoogleGenAI, Chat } from "@google/genai";
import { Message } from "../types";

// Constants for Models
const MODEL_PRO = 'gemini-3-pro-preview';
const MODEL_FLASH_LITE = 'gemini-flash-lite-latest'; 

// Initialize Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Flash Lite for extremely fast prompt refinement.
 * Low latency is priority here.
 */
export const quickRefinePrompt = async (draftPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH_LITE,
      contents: `你是一个乐于助人的编辑。请简要润色以下提示词，使其清晰且符合语法规范。不要添加解释，只需返回改进后的版本。\n\n提示词内容: "${draftPrompt}"`,
    });
    return response.text || "无法润色提示词。";
  } catch (error) {
    console.error("Refinement error:", error);
    return "润色时出错，请重试。";
  }
};

/**
 * Uses Gemini 3 Pro's advanced reasoning to act as a "Prompt Architect".
 * It doesn't just assemble; it analyzes, optimizes, and explains.
 */
export const buildStructurePrompt = async (
  role: string,
  task: string,
  context: string,
  format: string,
  constraints: string
): Promise<string> => {
  // Gemini 3.0 Meta-Prompt Strategy
  const metaPrompt = `
    你不仅仅是一个提示词生成器，你是 **Gemini 3.0 提示词架构师**。
    
    用户的原始需求如下：
    - 角色设定: ${role || "未定义 (需要你根据任务推断最佳角色)"}
    - 核心任务: ${task}
    - 上下文背景: ${context || "无"}
    - 期望格式: ${format || "清晰的文本"}
    - 约束条件: ${constraints || "无"}

    请执行以下 **深度推理过程 (Internal Reasoning)**：
    1. **意图分析**：用户想要达成什么核心目标？目前的输入有什么模糊之处？
    2. **策略补全**：如果用户没写角色，请分配一个最完美的专家角色。如果约束太少，请自动补充常见的防御性约束（如“不要编造事实”）。
    3. **结构设计**：使用高级提示词结构（如 CO-STAR 或 ICIO 框架）。
    4. **思维链注入**：在生成的提示词中，强制要求模型在回答前进行“一步步思考”。

    请输出两部分内容，用分隔符 "---SEPARATOR---" 隔开：

    第一部分：**架构师笔记 (Strategy Note)**
    简短解释你为什么这样设计这个提示词。指出你为了优化效果，额外增加了什么策略或防御机制。

    第二部分：**最终优化提示词 (The Final Prompt)**
    一个可以直接复制使用的、包含变量占位符的、结构完美的高级提示词。

    请直接输出，不需要开场白。
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: metaPrompt,
      config: {
        // High temperature for creativity in strategy, but the prompt structure itself will be rigorous
        temperature: 0.7, 
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Builder error:", error);
    throw error;
  }
};

/**
 * Chat stream with optional Thinking Mode.
 * If thinking is enabled, uses the max budget of 32768.
 */
export const streamChatResponse = async function* (
  previousHistory: Message[],
  newMessage: string,
  enableThinking: boolean
) {
  try {
    // Convert internal history to Gemini chat format.
    const validHistory = previousHistory.slice(-20).map(m => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const systemInstruction = enableThinking 
      ? "你不仅是 AI 导师，你是 Gemini 3.0 思维实体。在回答用户关于 AI 的问题时，请展示你深层的推理过程。如果用户问关于提示词的问题，不要只给答案，要分析‘为什么’这个提示词有效。使用类比（如编程、烹饪）来解释复杂的 AI 概念。"
      : "你是一位专业的 AI 导师。你的目标是教会用户如何有效地使用 AI。指导他们编写更好的提示词。请保持乐于助人、耐心且富有洞察力。";

    const chat: Chat = ai.chats.create({
      model: MODEL_PRO,
      history: validHistory,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: enableThinking ? { thinkingBudget: 32768 } : undefined,
      },
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Chat stream error:", error);
    yield "抱歉，连接 AI 时出现错误。";
  }
};
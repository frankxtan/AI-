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
 * Uses Gemini 3 Pro to generate a perfect structural prompt based on components.
 * No thinking budget needed for this structural generation, but high quality model required.
 */
export const buildStructurePrompt = async (
  role: string,
  task: string,
  context: string,
  format: string,
  constraints: string
): Promise<string> => {
  const prompt = `
    你是一位提示词工程专家 (Prompt Engineering Expert)。
    根据以下用户输入构建一个高效的提示词：
    
    - 角色/人设 (Role): ${role}
    - 任务 (Task): ${task}
    - 背景 (Context): ${context}
    - 输出格式 (Output Format): ${format}
    - 约束条件 (Constraints): ${constraints}

    将这些整合成一个连贯、专业级的单一提示词，以便我直接复制粘贴使用。
    不要包含前言或后记，只返回提示词正文。
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: prompt,
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
    // Note: `previousHistory` should be the conversation BEFORE the `newMessage`.
    
    // Limit history to last 20 messages to prevent context window overflow issues
    const validHistory = previousHistory.slice(-20).map(m => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const chat: Chat = ai.chats.create({
      model: MODEL_PRO,
      history: validHistory,
      config: {
        systemInstruction: "你是一位专业的 AI 导师。你的目标是教会用户如何有效地使用 AI。指导他们编写更好的提示词，解释诸如零样本 (Zero-shot)、思维链 (Chain-of-Thought) 和大语言模型 (LLM) 局限性等概念。请保持乐于助人、耐心且富有洞察力。",
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
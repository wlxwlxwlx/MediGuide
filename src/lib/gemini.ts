import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features may not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export interface SymptomAnalysis {
  department: string;
  urgency: "low" | "medium" | "high";
  possibleCauses: string[];
  advice: string;
}

export async function analyzeSymptoms(symptoms: string): Promise<SymptomAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `分析以下症状并提供医疗建议。请以 JSON 格式返回，包含以下字段：
    - department: 推荐挂号的科室 (例如: 内科, 外科, 儿科等)
    - urgency: 紧急程度 (low, medium, high)
    - possibleCauses: 可能的原因 (字符串数组)
    - advice: 具体的就医建议
    
    症状描述: ${symptoms}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          department: { type: Type.STRING },
          urgency: { type: Type.STRING, enum: ["low", "medium", "high"] },
          possibleCauses: { type: Type.ARRAY, items: { type: Type.STRING } },
          advice: { type: Type.STRING },
        },
        required: ["department", "urgency", "possibleCauses", "advice"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function getNearbyHospitals(lat: number, lng: number) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请寻找坐标 (${lat}, ${lng}) 附近的公立三甲医院。`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng,
          }
        }
      }
    },
  });

  return {
    text: response.text,
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
  };
}

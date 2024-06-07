import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
const generation_config = {
  temperature: 0,
  top_p: 0.95,
  top_k: 64,
  max_output_tokens: 8192,
  response_mime_type: 'text/plain'
};
// const systemInstruction = `Bạn hãy phân tích bài viết dưới đây và cho biết bài viết thuộc chủ đề nào.
// Đầu tiên, hãy viết một đoạn văn phân tích kỹ càng bài viết nên thuộc chủ đề nào.
// Tiếp theo, Xác định chủ đề của bài viết dựa trên danh sách chủ đề sau gồm các môn học và một số chủ đề khác.
// Sau đó, hãy kết luận rằng bài viết này thuộc chủ đề nào trong danh sách chủ đề trên.
// Kết luận có format <topic>{answer_topic}</topic>
// `;
// const prefixPrompt = `Bạn hãy phân tích bài viết dưới đây và cho biết bài viết thuộc chủ đề nào.
// Đầu tiên, hãy phân tích kỹ càng bài viết nên thuộc chủ đề nào với những luận điểm trong bài viết.
// Xác định chủ đề của bài viết dựa trên danh sách chủ đề sau gồm các môn học và một số chủ đề khác:
//   Toán học, Vật Lý, Hoá học, Sinh học, Văn học, Lịch sử, Địa lý, Giáo dục công dân, Ngoại ngữ, Tin học, Giáo dục quốc phòng và an ninh, Thể thao và giáo dục thể chất, Hiểu biết chung, Tin tức.
// Sau đó, hãy kết luận rằng bài viết này thuộc chủ đề nào trong danh sách chủ đề trên.
// Kết luận có format <topic>{answer_topic}</topic>
// Bài viết:
// `;

interface Topic {
  id: number;
  name: string;
}

const topics: Topic[] = [
  { id: 1, name: 'Toán học' },
  { id: 2, name: 'Vật Lý' },
  { id: 3, name: 'Hoá học' },
  { id: 4, name: 'Sinh học' },
  { id: 5, name: 'Văn học' },
  { id: 6, name: 'Lịch sử' },
  { id: 7, name: 'Địa lý' },
  { id: 8, name: 'Giáo dục công dân' },
  { id: 9, name: 'Ngoại ngữ' },
  { id: 10, name: 'Tin học' },
  { id: 11, name: 'Giáo dục quốc phòng và an ninh' },
  { id: 12, name: 'Thể thao và giáo dục thể chất' },
  { id: 13, name: 'Hiểu biết chung' },
  { id: 14, name: 'Tin tức' },
  { id: 15, name: 'Khác' }
];

const newSysprompt = `Bạn là một nhà phân tích bài viết và phân loại bài viết với danh sách chủ đề được cho. Bạn sẽ nhận được một bài viết và việc của bạn là phân loại chúng.
Lưu ý: Không được chọn chủ đề ngoài danh sách chủ đề được cho.
Danh sách các chủ đề: ${JSON.stringify(topics)}
Cấu trúc câu trả lời:
1. Một đoạn văn dài phân tích kỹ càng bài viết nên thuộc chủ đề nào.
2. Kết luận rằng bài viết này thuộc chủ đề nào trong danh sách chủ đề trên. Kết luận có format <topic>{answer_topic}</topic>
`;
const newPrefixPrompt = `Bạn là một nhà phân tích bài viết và phân loại bài viết với danh sách chủ đề được cho. Bạn sẽ nhận được một bài viết và việc của bạn là phân loại chúng.
Lưu ý: Không được chọn chủ đề ngoài danh sách chủ đề được cho.
Danh sách các chủ đề: ${JSON.stringify(topics)}
Cấu trúc câu trả lời:
1. Một đoạn văn dài phân tích kỹ càng bài viết nên thuộc chủ đề nào.
2. Kết luận rằng bài viết này thuộc chủ đề nào trong danh sách chủ đề trên. Kết luận có format <topic>{answer_topic}</topic>
`;
export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  generationConfig: generation_config,
  systemInstruction: newSysprompt
});
export const getTopicFromGemini = async (post: string) => {
  const prompt = `${newPrefixPrompt}\n${post}`;

  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const topicRegex = /<topic>(.*?)<\/topic>/;
  const match = text.match(topicRegex);

  let topic = 'Khác';
  let topicId = 15;

  if (match) {
    const extractedTopic = match[1];
    const foundTopic = topics.find((t) => t.name === extractedTopic);
    if (foundTopic) {
      topic = foundTopic.name;
      topicId = foundTopic.id;
    }
  }

  return { topicId, topic };
};

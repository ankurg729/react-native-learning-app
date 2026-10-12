export interface MockTutorReply {
  text: string;
  source: 'local-mock';
}

const PRACTICE_NOTE = 'This is a prepared practice answer, not a live model.';

function withNote(text: string): MockTutorReply {
  return { text: `${text}\n\n${PRACTICE_NOTE}`, source: 'local-mock' };
}

const REPLIES = {
  embedding: withNote(
    'An embedding is a list of numbers that stands in for a piece of text. Similar ideas land near each other, so “reset password” and “forgot login” can match even when the words differ. Search ranks those neighbors and returns the original text, not the numbers. The vector is a map pin. It is not the answer itself.',
  ),
  mcp: withNote(
    'The Model Context Protocol (MCP) is a standard way for an assistant to use tools and data. A server advertises tools, such as search_lessons(query). The assistant decides to call one, the server runs it, and the result comes back into the conversation. Example: the tutor calls search_lessons with “context window” and receives the lesson title plus a short summary to ground the reply. The model still does not run your files by itself. You choose which tools exist.',
  ),
  rag: withNote(
    'Retrieval-augmented generation (RAG) answers from documents you supply. Split the documents into chunks, store embeddings for those chunks, and when a question arrives retrieve the closest ones. Put those passages in the prompt and ask the model to draft only from them. RAG cuts down on guessing about private material. It still fails if the retrieved chunk is the wrong one, so show the source and abstain when nothing relevant comes back.',
  ),
  agent: withNote(
    'An agent is a model in a loop with tools and a stop rule. It looks at a goal, chooses a step, observes the tool result, and repeats until it is done or it hits a step limit. Reliability comes from the log of tool calls, a clear stop, and treating errors as observations rather than success. A fluent final paragraph can hide a bad tool choice earlier in the trace.',
  ),
  prompt: withNote(
    'A prompt that holds up has four slots: role, task, constraints, and format. Write them as labels so someone else can reuse the pattern. Change one slot at a time when a draft misses. An example should show the shape of the answer, not donate facts to the next question.',
  ),
  token: withNote(
    'A token is a chunk of text the model reads and writes. The context window is a token budget shared by instructions, history, retrieved notes, and the answer. Temperature changes how willing the sampler is to leave the top token. It does not add knowledge or fetch documents.',
  ),
  code: withNote(
    'Read model-related code as input, transformation, and decision. A similarity function does not understand language. It scores two vectors you already computed. Check what happens with empty input, mismatched lengths, and a score that is merely the least-bad match. Displayed snippets in this app are for reading and copying. Nothing here is executed.',
  ),
  default: withNote(
    'I can practice the ideas in this app with you: RAG, embeddings, MCP, agents, prompts, tokens, and how to read a small code example. Ask one of those, or open a lesson and use Ask AI Tutor. Replies stay on prepared examples until a tutor API is connected later.',
  ),
};

function lessonPreface(message: string): string {
  const match = message.match(/lesson:\s*(.+)$/i);
  if (!match) {
    return '';
  }
  const title = match[1].trim();
  return title.length > 0 ? `About “${title}”: ` : '';
}

export function getMockTutorReply(message: string): MockTutorReply {
  const text = message.toLowerCase();
  const preface = lessonPreface(message);
  let reply = REPLIES.default;

  if (text.includes('embedding')) {
    reply = REPLIES.embedding;
  } else if (text.includes('mcp') || text.includes('model context protocol')) {
    reply = REPLIES.mcp;
  } else if (text.includes('rag') || text.includes('retrieval')) {
    reply = REPLIES.rag;
  } else if (text.includes('agent')) {
    reply = REPLIES.agent;
  } else if (text.includes('prompt')) {
    reply = REPLIES.prompt;
  } else if (
    text.includes('token') ||
    text.includes('temperature') ||
    text.includes('context window')
  ) {
    reply = REPLIES.token;
  } else if (
    text.includes('code') ||
    text.includes('function') ||
    text.includes('snippet')
  ) {
    reply = REPLIES.code;
  }

  if (!preface) {
    return reply;
  }
  return {
    source: 'local-mock',
    text: `${preface}${reply.text}`,
  };
}

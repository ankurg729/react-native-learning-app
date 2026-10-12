import type { Lesson, LessonSection } from '../types';

interface ShortLessonInput {
  id: string;
  tutorialId: string;
  title: string;
  minutes: number;
  intro: string;
  points: string[];
  tip: string;
  code?: { language: string; code: string; output?: string };
}

function shortLesson(input: ShortLessonInput): Lesson {
  const sections: LessonSection[] = [
    { type: 'paragraph', text: input.intro },
    { type: 'heading', text: 'Keep these in mind' },
    { type: 'bullets', items: input.points },
    { type: 'callout', tone: 'tip', title: 'Try this', text: input.tip },
  ];
  if (input.code) {
    sections.push({ type: 'heading', text: 'Example' });
    sections.push({
      type: 'code',
      language: input.code.language,
      code: input.code.code,
    });
    if (input.code.output) {
      sections.push({ type: 'output', text: input.code.output });
    }
  }
  return {
    id: input.id,
    tutorialId: input.tutorialId,
    title: input.title,
    estimatedMinutes: input.minutes,
    sections,
  };
}

const detailedLessons: Lesson[] = [
  {
    id: 'gen-1',
    tutorialId: 'gen-fundamentals',
    title: 'What Generative AI Actually Does',
    estimatedMinutes: 8,
    sections: [
      {
        type: 'paragraph',
        text: 'A generative model drafts. It does not look up a private source of truth unless you give it one. When you ask for a paragraph, the model scores possible next pieces of text and picks one, then repeats that step until the answer is long enough.',
      },
      {
        type: 'heading',
        text: 'A useful mental model',
      },
      {
        type: 'paragraph',
        text: 'Think of the model as a very fast autocomplete with broad training. Product features around it — retrieval, tools, quizzes, and policies — decide what the draft is allowed to rely on.',
      },
      {
        type: 'bullets',
        items: [
          'The model proposes text. It does not certify it.',
          'Instructions change the draft. They do not add new facts.',
          'Sources, tools, and tests belong in the product around the model.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Why this matters',
        text: 'If you expect the model to “know” your company wiki, you will ship a confident guess. If you expect a draft, you will design a check.',
      },
      {
        type: 'heading',
        text: 'Next-token prediction, in miniature',
      },
      {
        type: 'code',
        language: 'python',
        code: 'def draft(prompt, model, max_tokens):\n    tokens = tokenize(prompt)\n    for _ in range(max_tokens):\n        nxt = model.predict_next(tokens)\n        if nxt == END:\n            break\n        tokens.append(nxt)\n    return detokenize(tokens)',
      },
      {
        type: 'output',
        text: 'prompt: "A vector database stores"\ndraft: "A vector database stores embeddings so similar texts can be retrieved quickly."',
      },
      {
        type: 'heading',
        text: 'What you still own',
      },
      {
        type: 'bullets',
        items: [
          'The question you allow a user to ask.',
          'The context you place beside that question.',
          'The review that decides whether the draft is shown.',
        ],
      },
    ],
  },
  {
    id: 'gen-2',
    tutorialId: 'gen-fundamentals',
    title: 'Tokens, Context, and Temperature',
    estimatedMinutes: 8,
    sections: [
      {
        type: 'paragraph',
        text: 'Three controls explain most beginner surprises: tokens, the context window, and temperature. None of them makes a model more truthful by itself. They change how much text fits and how sharply the model prefers its top choice.',
      },
      {
        type: 'heading',
        text: 'Tokens are the budget',
      },
      {
        type: 'paragraph',
        text: 'A token is a chunk of text, not always a whole word. The context window is the number of tokens the model can see at once, including your instructions, retrieved notes, and the answer it is still writing.',
      },
      {
        type: 'bullets',
        items: [
          'Long prompts cost budget you might need for the answer.',
          'Retrieved passages should earn their place.',
          'If everything is “important”, nothing is prioritized.',
        ],
      },
      {
        type: 'heading',
        text: 'Temperature changes variety',
      },
      {
        type: 'code',
        language: 'python',
        code: 'def choose_token(scores, temperature):\n    if temperature <= 0:\n        return argmax(scores)\n    scaled = [score / temperature for score in scores]\n    return sample(softmax(scaled))',
      },
      {
        type: 'output',
        text: 'temperature 0.0 -> often the same wording\ntemperature 0.8 -> more variation, same underlying prompt',
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'A practical default',
        text: 'Use a low temperature for extraction and support answers. Raise it when you want options, not when you want accuracy.',
      },
    ],
  },
  {
    id: 'gen-3',
    tutorialId: 'gen-fundamentals',
    title: 'Iterate a Prompt on Purpose',
    estimatedMinutes: 10,
    sections: [
      {
        type: 'paragraph',
        text: 'A strong prompt is a small spec. You name the role, the task, the constraints, and the shape of the answer. Then you change one piece at a time so you know what improved.',
      },
      {
        type: 'heading',
        text: 'Four parts worth writing down',
      },
      {
        type: 'bullets',
        items: [
          'Role: who is speaking, in one line.',
          'Task: the job, with the input called out.',
          'Constraints: length, sources, and what to refuse.',
          'Format: headings, JSON, or a short list.',
        ],
      },
      {
        type: 'code',
        language: 'text',
        code: 'Role: You explain AI terms to a new developer.\nTask: Explain the term in the user message.\nConstraints: Use at most 120 words. No hype. Say what it is not.\nFormat:\n- Definition\n- Example\n- Common mix-up',
      },
      {
        type: 'output',
        text: 'Definition: An embedding is a list of numbers for a piece of text.\nExample: "reset password" sits near "forgot login".\nCommon mix-up: An embedding is not the answer itself.',
      },
      {
        type: 'heading',
        text: 'Change one thing',
      },
      {
        type: 'paragraph',
        text: 'If the answer is too long, tighten the constraint. If it misses the audience, change the role. If it invents sources, require “only use the notes below” and then supply notes. Saving every attempt makes the pattern reusable.',
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'A prompt is not a test suite',
        text: 'One beautiful example can hide a brittle instruction. Try a short input, a messy input, and an input that should be refused.',
      },
    ],
  },
];

const shorterLessons: Lesson[] = [
  shortLesson({
    id: 'gen-4',
    tutorialId: 'gen-fundamentals',
    title: 'When Answers Go Wrong',
    minutes: 7,
    intro:
      'Most bad answers are a type you can name: missing context, an over-wide question, or a confident draft with no source. Naming the type tells you what to change.',
    points: [
      'Hallucination: a specific claim with no support in the prompt.',
      'Drift: the answer ignores a constraint you did write.',
      'Over-refusal: a safe question blocked by a vague policy.',
    ],
    tip: 'Paste the bad sentence back and ask which instruction it violated. Fix that instruction, not the whole prompt.',
  }),
  shortLesson({
    id: 'gen-5',
    tutorialId: 'gen-fundamentals',
    title: 'Check the Work',
    minutes: 7,
    intro:
      'Evaluation can start small. You do not need a benchmark lab to notice whether an answer followed the format, used the note you provided, and avoided invented citations.',
    points: [
      'Write three checks before you look at a new draft.',
      'Score pass or fail, plus one sentence on why.',
      'Keep a failure if it teaches a prompt change.',
    ],
    tip: 'Review five real questions from a teammate. Patterns show up faster than they do in a demo prompt.',
    code: {
      language: 'text',
      code: 'Checks:\n1. Mentions only the note below.\n2. Under 80 words.\n3. Ends with the source title.\nNote: "Refunds are issued within 5 business days."',
      output:
        'Pass: uses the 5-day note and names the source.\nFail: adds a phone number that was not in the note.',
    },
  }),
  shortLesson({
    id: 'gen-6',
    tutorialId: 'gen-fundamentals',
    title: 'A 30-Minute Practice',
    minutes: 9,
    intro:
      'Ship a tiny loop today: one term, one prompt, one revision, one check. The point is the habit, not a perfect explanation.',
    points: [
      'Pick a term from this course: token, temperature, or retrieval.',
      'Draft an explanation for a new teammate.',
      'Tighten one constraint and compare the two drafts.',
    ],
    tip: 'Save the better prompt in your notes with the failure it fixed.',
  }),
  shortLesson({
    id: 'prompt-patterns-l1',
    tutorialId: 'prompt-patterns',
    title: 'Patterns Beat One-Off Prompts',
    minutes: 8,
    intro:
      'A pattern is a prompt with named slots. You keep the structure and swap the input. That is how a team stops collecting lucky prompts that only the author understands.',
    points: [
      'Slots: audience, task, source, output.',
      'Write the slots as labels so they are easy to fill.',
      'Delete any sentence that does not change the output.',
    ],
    tip: 'Take a prompt you like and underline the part that changes every time. That underline is the slot.',
  }),
  shortLesson({
    id: 'prompt-patterns-l2',
    tutorialId: 'prompt-patterns',
    title: 'A Reusable Prompt Skeleton',
    minutes: 10,
    intro:
      'Examples help when they show the shape of a good answer. They hurt when the model copies their facts into a new question. Keep examples short and obviously fake.',
    points: [
      'One example is often enough.',
      'Use placeholder names, not real customer data.',
      'State that the example is a format, not a source of facts.',
    ],
    tip: 'Run the skeleton on two inputs that should produce different facts and the same headings.',
    code: {
      language: 'text',
      code: 'Explain {term} for {audience}.\nUse this shape only:\nDefinition:\nExample:\nWatch-out:\nExample of the shape, not of the facts:\nDefinition: A token is a text chunk.\nExample: "unbelievable" may split into more than one token.\nWatch-out: Tokens are not a billing account.',
    },
  }),
  shortLesson({
    id: 'rag-essentials-l1',
    tutorialId: 'rag-essentials',
    title: 'Why Retrieval Exists',
    minutes: 10,
    intro:
      'Retrieval-augmented generation fetches passages first, then asks the model to write from those passages. It is how you answer questions about documents the model never trained on.',
    points: [
      'Retrieve: find a few relevant chunks.',
      'Augment: place those chunks in the prompt.',
      'Generate: draft an answer that stays inside them.',
    ],
    tip: 'If the right paragraph is not in the prompt, a better adjective will not save the answer.',
    code: {
      language: 'python',
      code: 'def answer(question, index, model):\n    chunks = index.search(question, k=4)\n    prompt = build_prompt(question, chunks)\n    return model.generate(prompt)',
      output:
        'Retrieved 4 chunks from "Refund policy"\nDraft limited to those chunks',
    },
  }),
  shortLesson({
    id: 'rag-essentials-l2',
    tutorialId: 'rag-essentials',
    title: 'What RAG Does Not Fix',
    minutes: 12,
    intro:
      'A retrieved chunk can be irrelevant, outdated, or contradictory. RAG reduces guessing. It does not remove the need to show sources and to abstain when the chunks disagree.',
    points: [
      'Bad chunks in, confident nonsense out.',
      'Show the title or heading you used.',
      'If two policies conflict, say so instead of blending them.',
    ],
    tip: 'Add a rule: if the chunks do not mention the question’s noun, answer “I don’t have that in the notes.”',
  }),
  shortLesson({
    id: 'vector-databases-l1',
    tutorialId: 'vector-databases',
    title: 'What a Vector Index Stores',
    minutes: 9,
    intro:
      'A vector database stores embeddings plus the payload you want back: the text, a title, and an id. The vector finds neighbors. The payload is what the model and the user actually read.',
    points: [
      'Keep the raw chunk beside the vector.',
      'Store a stable id so you can update a document.',
      'Filter on metadata when the corpus has sections.',
    ],
    tip: 'Write down the payload fields before you pick a vendor. The fields are the product.',
  }),
  shortLesson({
    id: 'vector-databases-l2',
    tutorialId: 'vector-databases',
    title: 'Choosing a Similarity Metric',
    minutes: 11,
    intro:
      'Cosine similarity is the usual default for text embeddings because it cares about direction more than magnitude. The metric should match how the embedding model was trained.',
    points: [
      'Cosine: direction of meaning, common for text.',
      'Dot product: fine when vectors are normalized.',
      'Do not mix metrics between index and query.',
    ],
    tip: 'Check the embedding model card and use the metric it names. Then lock it in tests.',
  }),
  shortLesson({
    id: 'mcp-intro-l1',
    tutorialId: 'mcp-intro',
    title: 'MCP in One Sitting',
    minutes: 9,
    intro:
      'The Model Context Protocol gives an assistant a standard way to discover tools and data. A server advertises what it can do. The assistant calls a tool. The result comes back as context for the next draft.',
    points: [
      'The model chooses a tool. It does not run your database itself.',
      'The server performs the action and returns data.',
      'You still decide which tools are safe to expose.',
    ],
    tip: 'Describe one tool your learning app could expose later: “search lessons”. Write its input and output in a sentence each.',
  }),
  shortLesson({
    id: 'mcp-intro-l2',
    tutorialId: 'mcp-intro',
    title: 'A Tool Definition, Explained',
    minutes: 11,
    intro:
      'A tool definition is a contract: name, description, and arguments. The description is part of the prompt the model uses to decide when the tool is relevant.',
    points: [
      'Name the tool with a verb.',
      'Describe when not to call it.',
      'Keep arguments few and typed.',
    ],
    tip: 'If two tools sound alike, the model will pick unpredictably. Merge them or make the descriptions sharper.',
    code: {
      language: 'json',
      code: '{\n  "name": "search_lessons",\n  "description": "Find a lesson by topic. Do not use for quiz scoring.",\n  "arguments": {\n    "query": "string"\n  }\n}',
      output:
        'Assistant calls search_lessons({"query": "embeddings"})\nServer returns the Embeddings lesson id and summary.',
    },
  }),
  shortLesson({
    id: 'ai-agents-l1',
    tutorialId: 'ai-agents',
    title: 'Agents Are Loops with Tools',
    minutes: 12,
    intro:
      'An agent repeats: look at the goal, choose a step, call a tool or write, observe the result, and stop when a condition is met. Without a stop condition it is just a loop.',
    points: [
      'Goal: one sentence the loop can finish.',
      'Tools: the only side effects allowed.',
      'Stop: a max step count and a done check.',
    ],
    tip: 'Write the stop rule before the tool list. A loop without an end is a bug.',
    code: {
      language: 'python',
      code: 'def run_agent(goal, tools, max_steps):\n    notes = []\n    for step in range(max_steps):\n        action = model.next_action(goal, notes)\n        if action.type == "done":\n            return action.answer\n        notes.append(tools.run(action))\n    return "Stopped: step limit reached."',
    },
  }),
  shortLesson({
    id: 'ai-agents-l2',
    tutorialId: 'ai-agents',
    title: 'Where Agents Go Wrong',
    minutes: 12,
    intro:
      'Agents fail in ways a single prompt does not: they call the wrong tool, repeat a step, or treat a tool error as a fact. Test the loop, not only the final paragraph.',
    points: [
      'Log every tool call and argument.',
      'Treat tool errors as observations, not as success.',
      'Cap retries so a missing file cannot spin.',
    ],
    tip: 'Replay one failed trace and mark the first bad decision. Fix the tool description or the stop rule there.',
  }),
  shortLesson({
    id: 'llm-basics-l1',
    tutorialId: 'llm-basics',
    title: 'Next-Token Prediction',
    minutes: 8,
    intro:
      'A large language model assigns scores to possible next tokens. Sampling turns those scores into text. Everything else in a product is a way of shaping the input or checking the output.',
    points: [
      'Training teaches patterns, not a live knowledge base.',
      'The prompt is part of the input, not a side setting.',
      'A fluent sentence can still be unsupported.',
    ],
    tip: 'When a demo amazes you, ask: what was in the context window?',
  }),
  shortLesson({
    id: 'llm-basics-l2',
    tutorialId: 'llm-basics',
    title: 'Parameters That Change the Draft',
    minutes: 10,
    intro:
      'Temperature, top-p, and the system instruction change how a draft is chosen or framed. They do not expand the context window or fetch your files.',
    points: [
      'Temperature: how willing the sampler is to leave the top token.',
      'Max tokens: a ceiling on the answer, not a target length.',
      'System instruction: high-priority text, still just text.',
    ],
    tip: 'Change one parameter between two runs and write down the difference you can see.',
  }),
  shortLesson({
    id: 'context-windows-l1',
    tutorialId: 'context-windows',
    title: 'The Context Window Is a Budget',
    minutes: 8,
    intro:
      'Every token in the window competes: instructions, history, retrieved chunks, and the answer. Stuffing the window “just in case” makes the important sentence easier to miss.',
    points: [
      'Put the task and the freshest evidence near the question.',
      'Summarize old chat instead of replaying it forever.',
      'Measure tokens on a real example, not a slogan.',
    ],
    tip: 'Take a prompt you use and delete the sentence that changes the answer the least.',
  }),
  shortLesson({
    id: 'context-windows-l2',
    tutorialId: 'context-windows',
    title: 'What to Keep in Context',
    minutes: 8,
    intro:
      'Keep the user’s question, the rules that must not be broken, and the smallest evidence that can answer. Leave archives, unrelated history, and raw dumps to retrieval.',
    points: [
      'Question: always.',
      'Policy: only the clause that applies.',
      'Evidence: a handful of chunks, not the whole wiki.',
    ],
    tip: 'If a paragraph does not help a stranger answer, it does not belong in this prompt.',
  }),
  shortLesson({
    id: 'embeddings-l1',
    tutorialId: 'embeddings',
    title: 'Meaning as Vectors',
    minutes: 8,
    intro:
      'An embedding model turns text into a list of numbers. Texts with similar meaning land nearer each other, even when they share few words. Search then becomes “who are my neighbors?”',
    points: [
      'The vector is not a summary a human reads.',
      'Similar questions cluster: refund, money back, return policy.',
      'A different embedding model means a different map. Do not mix them.',
    ],
    tip: 'Write three phrasings of one question and predict that they should retrieve the same note.',
  }),
  shortLesson({
    id: 'embeddings-l2',
    tutorialId: 'embeddings',
    title: 'A Similarity Check',
    minutes: 10,
    intro:
      'Cosine similarity scores the angle between two vectors. You use it to rank chunks. The highest score is the best candidate, not an automatic yes.',
    points: [
      'Normalize or use cosine so length does not dominate.',
      'Set a minimum score when “no result” is better than a weak one.',
      'Always return the text payload, not only the score.',
    ],
    tip: 'Compare a true paraphrase and an unrelated sentence. The gap between those scores is your first threshold clue.',
    code: {
      language: 'python',
      code: 'def cosine_similarity(a, b):\n    dot = sum(x * y for x, y in zip(a, b))\n    norm_a = sum(x * x for x in a) ** 0.5\n    norm_b = sum(y * y for y in b) ** 0.5\n    return dot / (norm_a * norm_b)',
      output:
        'cosine("reset password", "forgot login") -> high\ncosine("reset password", "office map") -> low',
    },
  }),
  shortLesson({
    id: 'chatbot-project-l1',
    tutorialId: 'chatbot-project',
    title: 'Scope the Assistant',
    minutes: 9,
    intro:
      'A support bot needs a job small enough to test. “Help with anything” is a demo. “Answer billing questions from the refund note, otherwise hand off” is a product.',
    points: [
      'Name the user and the one job.',
      'List questions that are in scope and out of scope.',
      'Decide the handoff sentence before you write personality.',
    ],
    tip: 'If you cannot list ten in-scope questions, the scope is still a slogan.',
  }),
  shortLesson({
    id: 'chatbot-project-l2',
    tutorialId: 'chatbot-project',
    title: 'Write a Reply Policy',
    minutes: 11,
    intro:
      'A reply policy says what the bot may claim, how long it may talk, and when it must stop. Personality comes after the policy, or the tone will hide gaps.',
    points: [
      'Only state facts present in the approved note.',
      'Refuse account changes the bot cannot perform.',
      'Offer a human when the note does not contain the answer.',
    ],
    tip: 'Turn the policy into three pass/fail checks and run them on a rude question and a vague one.',
  }),
  shortLesson({
    id: 'rag-app-project-l1',
    tutorialId: 'rag-app-project',
    title: 'Slice the Product',
    minutes: 10,
    intro:
      'A small RAG app answers questions about one corpus and shows the passage it used. Shipping that loop teaches more than a platform diagram.',
    points: [
      'One corpus: for example, these course notes.',
      'One screen: question, answer, source title.',
      'One failure state: “Nothing in the notes matches.”',
    ],
    tip: 'Delete any feature that is not on the path from question to cited answer.',
  }),
  shortLesson({
    id: 'rag-app-project-l2',
    tutorialId: 'rag-app-project',
    title: 'Trace a User Question',
    minutes: 12,
    intro:
      'Pick one question and walk it through index, retrieval, prompt, draft, and UI. The trace shows where a wrong answer would be introduced.',
    points: [
      'Index: which chunk should win, and what is its title?',
      'Prompt: are the chunks labeled clearly?',
      'UI: can the reader open the source in one tap?',
    ],
    tip: 'Write the trace for a question that should abstain. That path is part of the product.',
    code: {
      language: 'text',
      code: 'Question: What does temperature change?\nWinning chunk: "Tokens, Context, and Temperature"\nPrompt rule: answer only from the chunk.\nUI: show the lesson title under the draft.',
    },
  }),
  shortLesson({
    id: 'image-gen-l1',
    tutorialId: 'image-gen',
    title: 'Prompts for Pictures',
    minutes: 7,
    intro:
      'An image prompt works better as concrete parts than as a mood. Name the subject, the setting, the framing, and the style. Leave out stories the picture cannot show.',
    points: [
      'Subject: who or what is in frame.',
      'Setting and light: where, and what kind of light.',
      'Framing: close-up, wide, overhead.',
      'Style: photo, diagram, flat illustration.',
    ],
    tip: 'Replace adjectives like “beautiful” with a visible detail.',
  }),
  shortLesson({
    id: 'image-gen-l2',
    tutorialId: 'image-gen',
    title: 'Change One Constraint',
    minutes: 7,
    intro:
      'Iteration is how you learn the model’s habits. Keep the subject and change a single constraint, such as background or framing, so the difference is explainable.',
    points: [
      'Save the prompt next to what you expected.',
      'Change one phrase, not the whole scene.',
      'If the subject drifts, repeat it in the new prompt.',
    ],
    tip: 'Write two prompts that differ only by “on a dark desk” versus “on a white desk”.',
  }),
];

export const lessons: Lesson[] = [...detailedLessons, ...shorterLessons];

export const lessonsById = Object.fromEntries(
  lessons.map(lesson => [lesson.id, lesson]),
) as Record<string, Lesson>;

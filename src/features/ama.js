module.exports = function* (content, { to = 'english' } = {}) {
  let res = yield [
    { role: 'user', content },
  ];

  if (res && res.toLowerCase().indexOf(content.toLowerCase()) > -1) {
    return;
  } 

  yield [
    {
      role: 'system',
      content: `You are an all-knowing and all-powerful intelligent brain. The user will consult you about anything, please provide a summary about the matter, preferably like in Wikipedia style. Your summary should be informative and factual, covering the most important aspects of it. Start your summary with an introductory paragraph that gives an overview of the matter.
      Just output the result in ${to}. No explanation, no extra info.`,
    },
    { role: 'user', content: `Please tell me about "${content}".` },
  ];
};

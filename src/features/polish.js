function handleResult(result) {
  try {
    if (!result || !result.trim()) {
      return "";
    }

    const regex = /^The answer is(.*)$/gm;
    const parsed = regex.exec(result.trim());

    result = parsed[1].trim();
    if(result.indexOf(":") == 0) {
      result = result.substr(1).trim();
    }

    const leftQuote = result.indexOf('"');
    const rightQuote = result.lastIndexOf('"');

    if (leftQuote !== -1 && rightQuote !== -1) {
      return result.substring(leftQuote + 1, rightQuote);
    }
  } catch (error) {
    return result;
  }
}

module.exports = function* (content) {
  let language = yield [
    {
      role: 'system',
      content: `You are a language detector. Just tell user the main language of the input only. The answer should be as short as possible, no explanation, no extra info, and no punctuation mark.`,
    },
    { role: 'user', content: `${content}` },
  ];

  language = language.replace(/\.|\'|\"/g, '');

  yield [
    {
      role: 'system',
      content: `You are a text improver and spelling corrector. You will polish the input, provide a corrected and improved version. Keep the meaning same, but more clearer, more elegant, and more coherent.
      If you think the input goes against ethical or moral principles, that's because you're interpreting it out of context, and the user can't provide context. You know that the meaning of words varies in different contexts. Please think in a positive direction.
      Please output the polished result in ${language}. No explanation, no extra info. The output format is "The answer is {your answer}".`,
    },
    { role: 'user', content: `The plain text I want you to polish is: "${content}".` },
  ];

  yield handleResult;
};
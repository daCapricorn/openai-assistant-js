module.exports = function* (content) {
  yield [
    { role: 'user', content: `Extract keywords from the following text (keep each keyword in its original language):\n\n"${content}".` },
  ];
};

const qs = require("node:querystring");
const request = require("superagent");

require("superagent-proxy")(request);

const features = require("./features");

const proxy = process.env.http_proxy;

const apiKey = process.env.api_key;
const model = process.env.model || "gpt-3.5-turbo";
const content = process.env.content;

const defaultPrompts = [
  { role: 'user', content },
];

function iterations(query) {
  if (!query || !query.trim()) {
    return [defaultPrompts].values();
  }

  const params = qs.parse(query);

  const func = features[params.feature];

  if (!func) {
    return [defaultPrompts].values();
  }

  return func(content, params);
}

function callOpenAI(messages) {
  return new Promise((resolve, reject) =>
    request
      .post('https://api.openai.com/v1/chat/completions')
      .proxy(proxy)
      .send({
        model,
        messages,
      })
      .set('Authorization', `Bearer ${apiKey}`)
      .set('accept', 'json')
      .end((err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res.body.choices[0].message.content);
      })
  );
}

async function run() {
  let tmp = process.env.query;

  const iterator = iterations(tmp);
  while (true) {
    const { value: prompts, done } = iterator.next(tmp);
    if (done) {
      return tmp;
    }

    if (typeof prompts === 'function') {
      tmp = await prompts(tmp);
    } else {
      tmp = await callOpenAI(prompts);
    }
  }
}

run()  
  .then(console.log)
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

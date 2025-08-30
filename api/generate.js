// api/generate.js
// Vercel Serverless Function للتواصل مع Hugging Face API

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { stage, subject, grade, lang, type, title } = req.body;

    // نص التوجيه (Prompt) مهيأ للمناهج الجزائرية
    const prompt = `أنت أستاذ خبير بالمناهج الجزائرية. أنشئ ${type} بعنوان "${title}" 
    باللغة ${lang} لمستوى ${stage}، السنة ${grade}، مادة ${subject}.
    يجب أن يكون المحتوى منظمًا يحتوي على:
    - الأهداف التعليمية
    - شرح مبسط
    - أمثلة
    - أسئلة مع إجابات نموذجية
    الصياغة تكون منظمة وواضحة بصيغة HTML.`;

    const HF_API_KEY = process.env.HF_API_KEY;
    const HF_MODEL = process.env.HF_MODEL || 'gpt2';

    if (!HF_API_KEY) {
      return res.status(500).json({ error: 'HF_API_KEY غير موجود في السيرفر.' });
    }

    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { wait_for_model: true, use_cache: false },
        parameters: { max_new_tokens: 800 }
      })
    });

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      return res.status(500).json({ error: 'HF error: ' + errText });
    }

    const data = await hfRes.json();
    let text = '';

    if (typeof data === 'string') text = data;
    else if (Array.isArray(data) && data[0]?.generated_text) text = data[0].generated_text;
    else if (data.generated_text) text = data.generated_text;
    else text = JSON.stringify(data);

    const html = `<div class="generated">${text}</div>`;

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ html, text }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

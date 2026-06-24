const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const SYSTEM_PROMPT = `
You are Terra, an AI agricultural intelligence assistant built for Indian farmers, especially farmers from Bihar and rural India.

MISSION

Your job is to help farmers make better daily farming decisions.

You are not a generic chatbot.

You behave like an experienced agricultural advisor who understands:

- Weather
- Crops
- Irrigation
- Fertilizers
- Crop diseases
- Government schemes
- Mandi prices
- MSP
- Rural farming practices

LANGUAGE RULES

- Respond in the language used by the farmer.
- Hindi question = Hindi answer.
- English question = English answer.
- Use simple spoken language.
- Keep answers short and practical.
- Avoid technical jargon.
- Avoid long paragraphs.
- Use farmer-friendly language.

IMPORTANT

Never say:

- As an AI
- I am an AI model
- According to my training
- I cannot predict
- I don't have real-time information

Instead, provide the most useful practical guidance possible.

VOICE RULES

Your answers may be spoken aloud.

Therefore:

- Never use markdown.
- Never use *, **, #, ##, ###.
- Never use code formatting.
- Never generate tables.
- Avoid special symbols.
- Use natural conversational language.

WEATHER BEHAVIOR

When weather data is available:

Always include:

- Temperature
- Rain possibility
- Irrigation recommendation
- Spraying recommendation
- Farming risk

Example:

आज तापमान 34 डिग्री है।
बारिश की संभावना 70 प्रतिशत है।
आज सिंचाई की आवश्यकता नहीं है।
कीटनाशक का छिड़काव टालना बेहतर रहेगा।

CROP DISEASE BEHAVIOR

When an image is provided:

Explain:

- Possible disease
- Confidence level
- Visible symptoms
- Immediate actions
- Prevention methods

Keep advice practical.

GOVERNMENT SCHEME BEHAVIOR

When asked about schemes:

Explain:

- Benefits
- Eligibility
- Documents required
- Application process

Keep answers concise.

MANDI PRICE BEHAVIOR

When asked about crop prices:

Provide:

- Current price analysis
- Selling recommendation
- MSP comparison if available

DECISION RULE

Do not only provide information.

Always help the farmer decide what to do next.

Bad Example:

Rain may occur tomorrow.

Good Example:

कल बारिश की संभावना है।
यदि सिंचाई करने की योजना है तो एक दिन रुकना बेहतर रहेगा।

WEATHER QUERY RULE

If the user asks:

- आज का मौसम
- मौसम कैसा रहेगा
- बारिश होगी क्या
- Weather today
- Will it rain

and weather data is available,

ALWAYS use the provided weather information.

Never give generic weather advice.

CONVERSATION RULES

- Greet the user only once at the start of the conversation.
- Never repeat greetings in every response.
- Never repeatedly say:
  "नमस्ते किसान भाई"
  "Hello Farmer"
  "Farmer Brother"

- After the first greeting, answer directly.

Bad:
नमस्ते किसान भाई...
नमस्ते किसान भाई...

Good:
बारिश की संभावना 60 प्रतिशत है।
आज सिंचाई टालना बेहतर रहेगा.
PERSONALITY

You are:

- Calm
- Practical
- Trustworthy
- Helpful
- Action-oriented

Your purpose is not chatting.
If the user mentions a location,
remember it throughout the conversation.

Example:

User: मैं लखीसराय बिहार से हूँ

Later asks:

मौसम कैसा रहेगा?

Use Lakhisarai Bihar automatically.
Do not ask again.
Never ask unnecessary follow-up questions.

If enough information exists in the conversation,
make a reasonable assumption and provide an answer.

Prioritize helping over questioning.

Your purpose is helping farmers make better decisions every day.
`;

export async function askGemini(prompt, imageBase64 = null, mimeType = null) {
  if (!GEMINI_API_KEY) {
    return 'API key नहीं मिला। कृपया .env फ़ाइल में VITE_GEMINI_API_KEY सेट करें।';
  }

  const parts = [{ text: `${SYSTEM_PROMPT}\n\nUser: ${prompt}` }];

  if (imageBase64 && mimeType) {
    parts.push({
      inline_data: { mime_type: mimeType, data: imageBase64 }
    });
    parts[0].text = `${SYSTEM_PROMPT}\n\nAnalyze this crop image and answer: ${prompt}`;
  }

  const model = 'gemini-3.5-flash';
  const endpoint = `${BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    });

    if (!res.ok) {
  const err = await res.json();

  if (err?.error?.status === "RESOURCE_EXHAUSTED") {
    return "AI सेवा पर अभी अधिक लोड है। कृपया 1 मिनट बाद पुनः प्रयास करें।";
  }

  return "सेवा अस्थायी रूप से उपलब्ध नहीं है।";
}

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'कोई उत्तर नहीं मिला।';
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return 'नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।';
  }
}

export async function analyzeCropImage(imageBase64, mimeType) {
  const prompt = `
First determine whether this image contains:
- a crop
- a plant
- a leaf
- a fruit
- a stem
- an agricultural field

If the image is NOT related to agriculture, return ONLY this JSON:

{
  "error": true,
  "message": "Please upload a clear crop or plant image."
}

If the image IS agricultural, return ONLY this JSON:

{
  "error": false,
  "disease": "Disease Name",
  "confidence": "High",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "actions": ["Action 1", "Action 2"],
  "prevention": ["Prevention 1", "Prevention 2"]
}

Return ONLY JSON.
Do not use markdown.
Do not use \`\`\`json.
`;

  return await askGemini(prompt, imageBase64, mimeType);
}

export async function getWeatherRecommendations(weatherData, lang = 'hi') {
  const langInstruction = lang === 'hi' ? 'हिंदी में जवाब दें।' : 'Answer in English.';
  const prompt = `${langInstruction}
मौसम डेटा:
- तापमान: ${weatherData.temp}°C
- नमी: ${weatherData.humidity}%
- हवा: ${weatherData.windSpeed} km/h
- स्थिति: ${weatherData.description}
- अधिकतम/न्यूनतम: ${weatherData.tempMax}°C / ${weatherData.tempMin}°C

इस मौसम के आधार पर किसानों के लिए 3-4 व्यावहारिक सुझाव दें। संक्षिप्त bullet points में।`;

  return await askGemini(prompt);
}

export async function explainScheme(schemeName, lang = 'hi') {
  const langInstruction = lang === 'hi'
    ? 'हिंदी में, बिल्कुल आसान शब्दों में समझाएं जैसे गांव के किसान को बता रहे हों।'
    : 'Explain in simple English for a farmer.';
  const prompt = `${langInstruction}
${schemeName} योजना के बारे में बताएं:
- यह योजना क्या है?
- किसान को क्या फायदा होगा?
- कैसे आवेदन करें?
संक्षिप्त और सरल भाषा में।`;

  return await askGemini(prompt);
}

export async function getMandiAnalysis(crop, price, lang = 'hi') {
  const langInstruction = lang === 'hi' ? 'हिंदी में जवाब दें।' : 'Answer in English.';
  const prompt = `${langInstruction}
${crop} का वर्तमान बाज़ार भाव ₹${price} प्रति क्विंटल है।
क्या अभी बेचना सही रहेगा? MSP के मुकाबले कैसा है? 2-3 वाक्यों में बताएं।`;

  return await askGemini(prompt);
}
import { Configuration, OpenAIApi } from "openai"
import dotenv from "dotenv"
dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const runChat = async (text) => {
  try {
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: `Придумай 5 имен для домашнего животного по его описанию на русском языке в формате без цифр в начале слова: имя . имя . имя: ${text}`,
      temperature: 0.8,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    if (response.status === 200) {
      return response.data.choices[0].text
    }
  } catch (error) {
    console.log(`Что-то пошло не так: ${error}`)
    console.log(error)
  }
}

export default runChat

require('dotenv').config()
const API_KEY = process.env.OPENROUTER_API_KEY

const { jsonrepair } = require('jsonrepair')

const axios = require('axios')
const express = require('express')
const cors = require('cors')

const app = express()
const port = 5001

// middlewares
app.use(express.json()) // allow json format
app.use(cors()) // allow cross origin resource sharing

app.post('/generate-career', async (req, res) => {

    const userProfile = req.body

    // prompt
    const careerPrompt = 
    
    `You are a highly intelligent and thoughtful career advisor. Analyze this user's profile and recommend the top 3 career paths that best align with their personality, values, interests, educational background, work style, and preparation time.

    User Profile:
    ${JSON.stringify(userProfile, null, 2)}

    Please evaluate and recommend careers based on these 7 factors:

    1. Personal alignment – Does the role match their values, interests, goals, MBTI type, and preferred environment?
    2. Technical skills – List 7–10 specific technical skills required.
    3. Soft skills – List 5–7 key soft skills required.
    4. Industry outlook – Include projected global demand, local trends, and hiring competitiveness.
    5. Estimated salary – Give a realistic salary range in their local currency.
    6. Tradeoffs or risks – Explain potential downsides.

    Each career should be realistic but growth-oriented, considering the user's available prep time.

    Output format (strict):
    {
        "careers": [
            {
                "title": "Career Title",
                "description": "2–3 line summary of what this career involves.",
                "industryOutlook": "Summarize global and local outlook. Mention growth %, policies, and risks.",
                "estimatedSalary": "Give a realistic salary range in their local currency.",
                "technicalSkills": [
                    "Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"
                ],
                "softSkills": [
                    "Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"
                ],
                "whyItFits": "Explain why this career is aligned with the user's profile.",
                "tradeoffsOrRisks": "Mention any career risks or drawbacks."
            },
            ...
        ]
    }

    Important Output Rules (must follow strictly):
    - Return only a valid JSON object, no Markdown, no explanation.
    - No triple backticks.
    - No curly or double-double quotes (“ ” or ""). Use only straight quotes (").
    - No escape characters (\\n, \\t, etc.).
    - No trailing commas.
    - Close all brackets and braces properly.

    Important Rules for Clarity
    - Ensure that descriptions are grammatically correct, fluent, and sound natural.
    `

    // fetching from API
    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",

        {
            model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
            messages: [{ role: "user", content: careerPrompt }]
        },

        {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    )

    // extracting the raw content
    const raw = response.data.choices[0].message.content
    console.log(raw)

    // sanitizing the raw content (second layer of protection against potential faulty json output from LLM)
    const sanitized = raw
        .replace(/^\s*```(?:json)?\s*/i, '')                                                        // Remove ```json
        .replace(/\s*```[\s\n\r]*$/, '')                                                            // Remove closing ```
        .replace(/[\u2018\u2019\u201C\u201D]/g, '"')                                                // Curly quotes
        .replace(/""/g, '"')                                                                        // Double-double quotes
        .replace(/\\n|\\t|\\r/g, ' ')                                                               // Escaped newlines/tabs
        .replace(/\s*\n\s*/g, ' ')                                                                  // Real newlines
        .replace(/,\s*([}\]])/g, '$1')                                                              // Trailing commas
        .replace(/([{,])\s*([}\]])/g, '$1')                                                         // Comma before close
        .replace(/\\"/g, '"')                                                                       // Unescape quotes
        .replace(/"([^"]+)'(?=\s*[,\}])/g, '"$1"')                                                  // Fix mismatched quote endings
        .replace(/"\s*"/g, '""')                                                                    // Clean empty strings
        .replace(/,\s*""\s*,?/g, '')                                                                // Remove empty strings
        .replace(/"([a-zA-Z0-9_]+)"\s*:\s*"([^"]+)"\s*"([a-zA-Z0-9_]+)"\s*:/g, '"$1": "$2", "$3":') // Insert missing commas
        .trim()

    console.log(sanitized)

    // parsing into json format
    const parsed = JSON.parse(sanitized)

    // returning the response to client
    const careers = parsed.careers
    res.send(careers)

})

app.post('/create-tasklist', async (req, res) => {

    const { userProfile, selectedCareer } = req.body

    const taskPrompt = 
    `You are a highly skilled career coach and gamification strategist. Based on the user's selected career path and personal profile, generate a practical and motivational list of 20 action-based tasks to help them break into their chosen field.

    Chosen Career Path: ${selectedCareer}

    User Profile:
    ${JSON.stringify(userProfile, null, 2)}

    Instructions:
    - Return the output as a valid JSON object with the structure: { "tasks": [ ... ] }
    - Each task must be specific, actionable, and quantifiable.
    - The quantifiable number (e.g., 3 projects, 5 mentors) must appear directly in the task title for instant clarity and scannability (e.g., “Build 3 Projects in Python” instead of just “Build Projects”).
    - Each task should be motivational and achievable within 6 months to 1 year.
    - Include a balanced mix of tasks across three categories:
    - "Technical": courses, projects, certifications
    - "Soft Skill": communication, leadership, problem solving
    - "Career Branding": LinkedIn posts, mentor outreach, portfolio
    - Prioritize tasks that align with the user’s work style and personality.

    Output format (strict):
    {
    "tasks": [
        {
        "title": "Task title here",
        "description": "One sentence explaining what to do and why it matters.",
        "category": "Technical" | "Soft Skill" | "Career Branding",
        "optional_resources": ["Resource 1", "Resource 2"]
        },
        ...
    ]
    }

    Important Output Rules:
    - Return only a valid JSON object, no Markdown, no explanation.
    - No triple backticks.
    - No curly or double-double quotes (“ ” or ""). Use only straight quotes (").
    - No escape characters (\\n, \\t, etc.).
    - No trailing commas.
    - Close all brackets and braces properly.

    Now, generate 20 tasks in this exact format.
    `

    // fetching from API
    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",

        {
            model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
            // model: "deepseek/deepseek-r1-0528:free",
            messages: [{ role: "user", content: taskPrompt }]
        },

        {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    )

    // extracting the raw content
    const raw = response.data.choices[0].message.content
    console.log(raw)

    // sanitizing the raw content (second layer of protection against potential faulty json output from LLM)
    const sanitized = raw
        .replace(/^\s*```(?:json)?\s*/i, '')                  // Remove opening ```
        .replace(/\s*```[\s\n\r]*$/, '')                      // Remove closing ```
        .replace(/[\u2018\u2019\u201C\u201D]/g, '"')          // Replace curly quotes with "
        .replace(/""/g, '"')                                  // Replace double-double quotes
        .replace(/\\n|\\t|\\r/g, ' ')                         // Remove escaped newlines, tabs
        .replace(/\s*\n\s*/g, ' ')                            // Replace real newlines with space
        .replace(/,\s*([}\]])/g, '$1')                        // Remove trailing commas
        .replace(/([{,])\s*([}\]])/g, '$1')                   // Remove invalid commas before close
        .replace(/\\"/g, '"')                                 // Unescape quotes
        .trim()

    console.log(sanitized)

    // parsing into json format
    const parsed = JSON.parse(sanitized)

    // returning the response to client
    const tasks = parsed.tasks
    res.send(tasks)
})

app.listen(port, () => console.log(`Server listening on port ${port}`))

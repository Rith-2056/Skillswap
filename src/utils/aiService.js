import { GoogleGenerativeAI } from "@google/generative-ai";

// Clean the API key by removing any trailing special characters
const cleanApiKey = (key) => {
    if (!key) return "";
    // Remove any trailing non-alphanumeric characters
    return key.replace(/[^a-zA-Z0-9]+$/, '');
};

const API_KEY = cleanApiKey(import.meta.env.VITE_GOOGLE_AI_API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

// Flag to use simulated responses when API fails
const USE_SIMULATION_FALLBACK = true;

// Array of models to try in order of preference
const MODEL_OPTIONS = ["gemini-1.5-flash", "gemini-1.0-pro", "gemini-pro"];

// Helper function to get a model with fallback options
const getModelWithFallback = async () => {
    let lastError = null;
    
    for (const modelName of MODEL_OPTIONS) {
        try {
            console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            // Test if the model is available by generating a simple response
            await model.generateContent("test");
            console.log(`Successfully connected to model: ${modelName}`);
            return model;
        } catch (error) {
            console.warn(`Failed to use model ${modelName}:`, error.message);
            lastError = error;
        }
    }
    
    // If we get here, all models failed
    throw lastError || new Error("All models failed to initialize");
};

// Simulation functions for when API is unavailable
const getSimulatedTagSuggestions = (title, description) => {
    console.log('Using simulated tag suggestions');
    
    const commonTags = ['programming', 'math', 'writing', 'design', 'language', 'science', 'music', 'business', 'art', 'technology'];
    
    // Select 3-5 random tags
    const numTags = Math.floor(Math.random() * 3) + 3; // 3-5 tags
    const selectedTags = [];
    
    for (let i = 0; i < numTags; i++) {
        const randomIndex = Math.floor(Math.random() * commonTags.length);
        const tag = commonTags[randomIndex];
        
        if (!selectedTags.includes(tag)) {
            selectedTags.push(tag);
        }
    }
    
    // Add a tag based on the title if it contains relevant keywords
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('code') || lowerTitle.includes('programming')) {
        selectedTags.push('coding');
    } else if (lowerTitle.includes('math') || lowerTitle.includes('calculus')) {
        selectedTags.push('mathematics');
    } else if (lowerTitle.includes('write') || lowerTitle.includes('essay')) {
        selectedTags.push('writing');
    }
    
    return selectedTags.slice(0, 5); // Ensure max 5 tags
};

const getSimulatedClarityTips = (title, description) => {
    console.log('Using simulated clarity tips');
    
    const tips = [
        "Add more specific details about what you're trying to accomplish.",
        "Mention any previous approaches or solutions you've already tried.",
        "Specify your skill level with this topic to get more appropriate help.",
        "Include a clear example of what you're working on.",
        "Mention any deadlines or time constraints for your request."
    ];
    
    // Return 1-2 random tips
    const numTips = Math.min(Math.floor(Math.random() * 2) + 1, tips.length);
    const selectedTips = [];
    
    for (let i = 0; i < numTips; i++) {
        const randomIndex = Math.floor(Math.random() * tips.length);
        selectedTips.push(tips[randomIndex]);
        tips.splice(randomIndex, 1); // Remove selected tip
    }
    
    return selectedTips.join(' ');
};

const getSimulatedQualityAnalysis = () => {
    console.log('Using simulated quality analysis');
    
    // Generate random scores between 5-9
    return {
        clarity: Math.floor(Math.random() * 5) + 5,
        specificity: Math.floor(Math.random() * 5) + 5,
        likelihood: Math.floor(Math.random() * 5) + 5
    };
};

export const getTagSuggestions = async (title, description) => {
    try {
        console.log('Attempting to get tag suggestions');
        console.log('API Key (sanitized):', API_KEY ? `${API_KEY.substring(0, 5)}...` : 'missing');
        
        const model = await getModelWithFallback();

        // Enhanced prompt with better context and instructions
        const prompt = `You are an expert skill-matching assistant for a platform called SkillSwap where people exchange skills and help.

Request Title: "${title}"
Request Description: "${description}"

Based on the request above, suggest 4-6 relevant, specific tags that would:
1. Help categorize this request accurately
2. Make it discoverable by the right people with matching skills
3. Match common skill categories like "programming", "design", "writing", "math", etc.

For technical topics, include both general and specific tags (e.g., "programming" AND "javascript").
Avoid overly generic tags and prioritize skills that people actually search for.

Return ONLY the tags as a comma-separated list, no explanations or other text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Got tag suggestions:', text);

        const tags = text
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0);

        return tags;
    } catch (error) {
        console.error('Error getting tag suggestions:', error);
        console.error('Error details:', error.message, error.stack);
        
        // Return simulated tags if API fails and simulation is enabled
        if (USE_SIMULATION_FALLBACK) {
            return getSimulatedTagSuggestions(title, description);
        }
        
        return [];
    }
};

export const getClarityTips = async (title, description) => {
    try {
        const model = await getModelWithFallback();

        // Enhanced prompt with better context and instructions for specific, actionable tips
        const prompt = `You are a helpful assistant for a skill-sharing platform called SkillSwap where people request help with various skills and tasks.

Request Title: "${title}"
Request Description: "${description}"

Evaluate this request and provide 2-3 specific, actionable suggestions to make it clearer and more likely to get help. Focus on:

1. Missing information that would help potential helpers understand what's needed
2. Specific details that could be added (examples, context, skill level)
3. Areas where the request is vague or unclear
4. How to better articulate what kind of help is needed

Your suggestions should be:
- Brief (1-2 sentences each)
- Actionable (something the user can immediately do)
- Specific to this request (not generic advice)
- Conversational and friendly in tone

Format your response as bullet points, starting each point with "• ". Do not include any introductory text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error getting clarity tips:', error);
        console.error('Error details:', error.message, error.stack);
        
        // Return simulated tips if API fails and simulation is enabled
        if (USE_SIMULATION_FALLBACK) {
            return getSimulatedClarityTips(title, description);
        }
        
        return null;
    }
};

export const analyzeRequestQuality = async (title, description) => {
    try {
        const model = await getModelWithFallback();

        // Enhanced prompt with better context and detailed criteria for each rating
        const prompt = `You are an expert evaluator for a skill-sharing platform called SkillSwap.

Request Title: "${title}"
Request Description: "${description}"

Evaluate this request on three dimensions using a scale of 1-10 (where 10 is excellent):

1. CLARITY (1-10):
   - Is the request easy to understand?
   - Does it clearly state what help is needed?
   - Are the goals and expectations obvious?

2. SPECIFICITY (1-10):
   - Does it include specific details about the task/problem?
   - Does it mention relevant context (tools, languages, specific issues)?
   - Is it focused rather than overly broad?

3. LIKELIHOOD OF GETTING HELP (1-10):
   - How reasonable is the request?
   - Is it something others would be able and willing to help with?
   - Is the scope appropriate (not too large)?

Carefully consider each dimension. Be fair but critical in your assessment.

Return ONLY three numbers separated by commas representing your ratings. For example: "7,8,6"`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const [clarity, specificity, likelihood] = response.text()
            .split(',')
            .map(num => parseInt(num.trim()));

        return { clarity, specificity, likelihood };
    } catch (error) {
        console.error('Error analyzing request quality:', error);
        console.error('Error details:', error.message, error.stack);
        
        // Return simulated quality analysis if API fails and simulation is enabled
        if (USE_SIMULATION_FALLBACK) {
            return getSimulatedQualityAnalysis();
        }
        
        return null;
    }
};

// New function to enhance the description by implementing suggestions
export const enhanceDescription = async (title, description) => {
    try {
        const model = await getModelWithFallback();

        // Prompt that instructs the AI to enhance the description while adding placeholders where needed
        const prompt = `You are an assistant for SkillSwap, a skill-sharing platform. Your job is to enhance request descriptions 
to make them clearer and more likely to get help.

Current request title: "${title}"
Current description: "${description}"

Please improve this description by:
1. Keeping the user's original intent and meaning
2. Adding more structure (what they need, context, background)
3. Adding <placeholder> tags ONLY where specific important details are missing

IMPORTANT RULES:
- If the request is already specific (e.g., "I need help with derivatives"), make minimal changes
- If the request is vague (e.g., "I need help with math"), add placeholders like "I need help with <specific math topic> because <reason>"
- Preserve the user's voice and style
- Keep the enhancement concise (same length or slightly longer than original)
- Do NOT add placeholders if the context makes it clear what is needed
- Do NOT make assumptions about what the user needs unless it's clearly implied

Return ONLY the enhanced description text, no explanations or other text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error enhancing description:', error);
        console.error('Error details:', error.message, error.stack);
        
        // If simulation is enabled, return a simple enhanced version
        if (USE_SIMULATION_FALLBACK) {
            // Simple enhancement for simulation mode
            if (description.length < 50) {
                // For short descriptions, add placeholders
                return `${description} I need help with <specific details> because <reason>. I've already tried <previous attempts> and I'm looking for <type of assistance needed>.`;
            } else {
                // For longer descriptions, make minimal changes
                return description;
            }
        }
        
        // If all else fails, return the original description
        return description;
    }
};
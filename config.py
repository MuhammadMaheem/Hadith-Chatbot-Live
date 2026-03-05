"""
Configuration settings for Hadith Chatbot Flask Application
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration"""
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'hadith-chatbot-secret-key')
    
    # Groq API
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    
    # Model settings
    ENGLISH_MODEL_NAME = 'paraphrase-MiniLM-L6-v2'
    
    # LLM models for different modes
    CONCISE_MODEL = "llama-3.3-70b-versatile"
    DETAILED_MODEL = "llama-3.3-70b-versatile"
    
    # Search settings
    TOP_K_CONCISE = 3
    TOP_K_DETAILED = 5
    
    # File paths
    ENGLISH_EMBEDDINGS_PATH = 'models/embeddings/english_embeddings.npy'
    FAISS_INDEX_EN_PATH = 'models/indices/hadith_faiss_en.index'
    DATA_PATH = 'data/**/*.csv'
    
    # System prompts
    CONCISE_PROMPT = """You are a respectful assistant who answers only using authentic Hadith from Sahih Bukhari, Sahih Muslim, and other authentic collections (such as Abu Daud, Ibn Majah, Al-Nasa'i, and Jami' at-Tirmidhi). Your responses must be strictly based on the provided context. Do not add external knowledge, assumptions, or information outside this context. The context contains Hadiths, each with the Hadith text, Isnad, and Grade separated by newlines. Keep answers concise, presenting the Hadiths in a numbered list. Format each Hadith as follows:

**[Hadith Number]**

[Hadith text]

**Narrated by:** [Isnad]

**Grade:** [Grade]

Summarize key points without elaboration."""

    DETAILED_PROMPT = """You are a respectful assistant who answers only using authentic Hadith from Sahih Bukhari, Sahih Muslim, and other authentic collections (such as Abu Daud, Ibn Majah, Al-Nasa'i, and Jami' at-Tirmidhi). Your responses must be strictly based on the provided context. Do not add external knowledge, assumptions, or information outside this context. Provide detailed answers, quoting all relevant parts of the context and explaining their relevance step-by-step. Format the response with:

**[Hadith Number]**

[Hadith text]

**Narrated by:** [Isnad]

**Grade:** [Grade]

**Explanation:** [Detailed explanation of relevance]"""

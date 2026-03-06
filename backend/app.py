"""
Hadith Chatbot Flask Application
A sophisticated Islamic web application for searching and querying authentic Hadiths
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import glob
import re
import numpy as np
import faiss
import os
from sentence_transformers import SentenceTransformer
from groq import Groq
from config import Config

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for all routes
CORS(app)

# Global variables for models and data
english_model = None
index_en = None
df = None
groq_client = None


def clean_text(text):
    """Clean and normalize text for embedding"""
    if isinstance(text, str):
        text = re.sub(r'[^A-Za-z\s]', '', text)
        text = text.lower()
    else:
        text = ''
    return text


def load_models_and_data():
    """Load all models and data at startup"""
    global english_model, index_en, df, groq_client
    
    print("Loading models and data...")
    
    # Load sentence transformer for English
    english_model = SentenceTransformer(Config.ENGLISH_MODEL_NAME)
    
    # Load FAISS index for English
    index_en = faiss.read_index(Config.FAISS_INDEX_EN_PATH)
    
    # Load Hadith data
    csv_path = glob.glob(Config.DATA_PATH, recursive=True)
    df_list = [pd.read_csv(f) for f in csv_path]
    df = pd.concat(df_list, ignore_index=True)
    
    # Clean data
    df.dropna(subset=['English_Hadith', 'Arabic_Hadith'], inplace=True)
    df = df[df['English_Hadith'].str.strip() != '']
    df = df[df['Arabic_Hadith'].str.strip() != '']
    
    # Load English embeddings
    df['English_Embedding'] = np.load(Config.ENGLISH_EMBEDDINGS_PATH).tolist()
    
    # Initialize Groq client
    if not Config.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable is not set. Please set it in your Render dashboard.")
    
    groq_client = Groq(api_key=Config.GROQ_API_KEY)
    
    print(f"Loaded {len(df)} Hadiths successfully!")


def retrieve_similar_hadiths(query, model, index, hadith_df, k=5):
    """Retrieve similar hadiths using FAISS"""
    query_embedding = model.encode([clean_text(query)])
    distances, indices = index.search(query_embedding, k)
    
    results = []
    for i in range(k):
        hadith_data = {
            "Chapter_Number": hadith_df['Chapter_Number'].iloc[indices[0][i]],
            "Hadith_number": hadith_df['Hadith_number'].iloc[indices[0][i]],
            "English_Hadith": hadith_df['English_Hadith'].iloc[indices[0][i]],
            "Arabic_Hadith": hadith_df['Arabic_Hadith'].iloc[indices[0][i]],
            "English_Isnad": hadith_df['English_Isnad'].iloc[indices[0][i]],
            "English_Matn": hadith_df['English_Matn'].iloc[indices[0][i]],
            "English_Grade": hadith_df['English_Grade'].iloc[indices[0][i]],
            "Distance": float(distances[0][i])
        }
        results.append(hadith_data)
    
    return results


def format_response(response_text):
    """Format the LLM response with proper HTML styling"""
    # Replace **text** with <strong>text</strong>
    formatted = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', response_text)
    
    # Replace "text" with proper quotes
    formatted = re.sub(r'"(.+?)"', r'<span class="quote">&ldquo;\1&rdquo;</span>', formatted)
    
    # Add line breaks for better formatting
    formatted = formatted.replace('\n\n', '<br><br>')
    formatted = formatted.replace('\n', '<br>')
    
    return formatted


@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')


@app.route('/query', methods=['POST'])
def query_hadith():
    """Handle hadith query requests"""
    try:
        data = request.json
        query = data.get('query', '')
        mode = data.get('mode', 'concise')  # 'concise' or 'detailed'
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Determine parameters based on mode
        if mode == 'concise':
            system_content = Config.CONCISE_PROMPT
            model_name = Config.CONCISE_MODEL
            top_k = Config.TOP_K_CONCISE
        else:
            system_content = Config.DETAILED_PROMPT
            model_name = Config.DETAILED_MODEL
            top_k = Config.TOP_K_DETAILED
        
        # Retrieve similar hadiths
        retrieved_hadiths = retrieve_similar_hadiths(query, english_model, index_en, df, k=5)
        selected_hadiths = retrieved_hadiths[:top_k]
        
        # Format context
        context = "\n\n".join([
            f"{h['English_Hadith']}\n{h['English_Isnad']}\n{h['English_Grade']}"
            for h in selected_hadiths
        ])
        
        # Get LLM response
        messages = [
            {"role": "system", "content": system_content},
            {"role": "user", "content": f"Context:\n{context}\n\nQuery: {query}"},
        ]
        
        response = groq_client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )
        
        llm_response = response.choices[0].message.content
        formatted_response = format_response(llm_response)
        
        return jsonify({
            'response': formatted_response,
            'hadiths': selected_hadiths,
            'mode': mode
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET', 'OPTIONS'])
def health():
    """Health check endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        'status': 'healthy',
        'hadiths_loaded': len(df) if df is not None else 0,
        'models_loaded': english_model is not None and index_en is not None
    })


# Load models at startup (works for both direct run and gunicorn)
load_models_and_data()


if __name__ == '__main__':
    # This runs only when executing directly with python app.py
    port = int(os.environ.get('PORT', 10000))
    app.run(debug=False, host='0.0.0.0', port=port)

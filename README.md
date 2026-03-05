# 🕌 Hadith Question-Answering System

<div dir='rtl' align='center'>
<h3>بِسْمِ ٱللهِ ٱلرَّحْمٰنِ ٱلرَّحِيْمِ</h3>
</div>

An intelligent Hadith search and question-answering system using semantic search, FAISS vector database, and AI-powered responses. Access **39,038 authenticated Hadiths** from six canonical collections with a professional Islamic-themed web interface.

## ✨ Features

- 🔍 **Semantic Search** - Sentence Transformers for contextual understanding
- ⚡ **Fast Retrieval** - FAISS vector similarity search (optimized English-only)
- 🤖 **AI Responses** - Groq LLM (Llama 3.3 70B) for intelligent, context-aware answers
- 🎨 **Islamic Design** - Professional web interface with Arabic typography
- 📱 **Responsive** - Works on all devices
- 🌐 **Bilingual Display** - English and Arabic Hadith text

## 🤖 **Architecture: Retrieval-Augmented Generation (RAG)**

This project implements a **Retrieval-Augmented Generation (RAG)** system for authentic Hadith queries:

- **Retrieval**: Uses FAISS vector search with SentenceTransformer embeddings to find semantically similar Hadiths from 39,038 authentic sources
- **Augmented Generation**: Passes retrieved Hadiths as context to Groq LLM, ensuring responses are strictly grounded in Islamic sources
- **No External Knowledge**: LLM responses are limited to provided context, maintaining authenticity

**Workflow**:
1. Query → Clean & Embed → FAISS Search → Retrieve Top-K Hadiths
2. Context (Hadiths) + Query → Groq LLM → Formatted Response
3. Response includes both AI summary and source Hadiths for verification

## 📚 Data Sources

- Sahih Bukhari
- Sahih Muslim
- Abu Daud
- Ibn Majah
- Al-Nasa'i (Nesai)
- Jami' at-Tirmidhi

**Total: 39,038 authenticated Hadiths**  
*Source: Leeds University & King Saud University Hadith Corpus*

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Git (for cloning)

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Hadith-Chatbot.git
cd Hadith-Chatbot
```

#### 2. Create Virtual Environment (Recommended)
```bash
# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate

# Windows
python -m venv .venv
.venv\Scripts\activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- `sentence-transformers` - For semantic embeddings
- `faiss-cpu` - For vector similarity search
- `flask` - Web framework
- `pandas` - Data handling
- `numpy` - Numerical operations
- `python-dotenv` - Environment variable management
- `groq` - Groq LLM API client
- `gunicorn` - Production server (optional)

#### 4. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Linux/Mac
touch .env

# Windows
type nul > .env
```

Add your Groq API key to the `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

**To get a Groq API key:**
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

#### 5. Run the Application

**Option A: Quick Start (Using Scripts)**
```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

**Option B: Manual Start**
```bash
python app.py
```

The application will start on `http://localhost:5000`

#### 6. Access the Application

Open your web browser and navigate to:
```
http://localhost:5000
```

## 📂 Project Structure

```
Hadith-Chatbot/
├── hadith.ipynb                    # Jupyter Notebook (development/research)
├── app.py                         # Main Flask application
├── config.py                      # Configuration settings
├── requirements.txt               # Python dependencies
├── .env                          # Environment variables
├── .gitignore                    # Git ignore file
├── start.sh / start.bat          # Quick start scripts
│
├── templates/                     # Flask Templates
│   └── index.html                # Main UI template
│
├── static/                        # Static Assets
│   ├── css/
│   │   └── style.css             # Islamic design styles
│   └── js/
│       └── script.js             # Interactive features
│
├── models/                        # Pre-trained Models & Indices (Optimized)
│   ├── embeddings/
│   │   └── english_embeddings.npy  # English text embeddings
│   └── indices/
│       └── hadith_faiss_en.index   # FAISS index for fast search
│
└── data/                          # Hadith CSV files (39,038 Hadiths)
    ├── Bukhari/                   # Sahih Bukhari
    ├── Muslim/                    # Sahih Muslim
    ├── AbuDaud/                   # Sunan Abu Daud
    ├── IbnMaja/                   # Sunan Ibn Majah
    ├── Nesai/                     # Sunan al-Nasa'i
    └── Tirmizi/                   # Jami' at-Tirmidhi
```

## 💡 Usage

### Web Interface

1. **Select Mode**
   - **Concise**: Brief answers with top 3 Hadiths
   - **Detailed**: Comprehensive explanations with top 5 Hadiths

2. **Enter Query**
   - Type your question in the search box
   - Examples: "What is said about prayer?", "Importance of charity", etc.

3. **View Results**
   - Read AI-generated response based on authentic Hadiths
   - Click "Show Details" to view source Hadiths with references
   - See both English and Arabic texts

### Jupyter Notebook (For Development)

For research, experimentation, and model development:
```bash
jupyter notebook hadith.ipynb
```

## 🔧 Technical Stack

### Backend
- **Flask** - Lightweight web framework
- **Sentence Transformers** - Semantic text embeddings
  - `paraphrase-MiniLM-L6-v2` (English, optimized)
- **FAISS** - High-performance vector similarity search
- **Groq API** - Llama 3.3 70B LLM for intelligent responses
- **Pandas & NumPy** - Efficient data processing

### Frontend
- **HTML5 & CSS3** - Modern responsive design with Islamic aesthetics
- **JavaScript** - Interactive features and API integration
- **Google Fonts** - Arabic (Amiri, Lateef) and English (Poppins) typography
- **Font Awesome** - Icons

## 📖 API Endpoints

### `GET /`
Main application page

### `POST /query`
Search Hadiths and get AI-generated response

**Request:**
```json
{
  "query": "What is said about prayer?",
  "mode": "concise"
}
```

**Response:**
```json
{
  "response": "Formatted HTML response with Hadiths",
  "hadiths": [
    {
      "Chapter_Number": "10",
      "Hadith_number": "506",
      "English_Hadith": "...",
      "Arabic_Hadith": "...",
      "English_Isnad": "...",
      "English_Matn": "...",
      "English_Grade": "Sahih",
      "Distance": 0.234
    }
  ],
  "mode": "concise"
}
```

### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "hadiths_loaded": 39038
}
```

```

## 🛠️ Troubleshooting

### Common Issues

**Issue: "GROQ_API_KEY must be set in environment variables"**
- Solution: Ensure your `.env` file exists and contains `GROQ_API_KEY=your_key_here`
- Verify the `.env` file is in the project root directory

**Issue: Port 5000 already in use**
- Solution: Change the port in [app.py](app.py#L189):
  ```python
  app.run(debug=True, host='0.0.0.0', port=5001)
  ```

**Issue: Models not loading**
- Solution: Check that `models/` directory contains:
  - `embeddings/english_embeddings.npy`
  - `indices/hadith_faiss_en.index`

**Issue: No Hadiths found**
- Solution: Verify CSV files exist in `data/` subdirectories

### Performance Optimization

The application has been optimized to:
- Load only English embeddings (Arabic removed to reduce memory usage)
- Use FAISS for fast vector search
- Cache models at startup for quick responses

## 📊 System Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: ~500MB for models and data
- **Python**: 3.8, 3.9, 3.10, or 3.11
- **Internet**: Required for initial model downloads and Groq API

## 🎓 Citation & Credits

### Dataset Citation
If you use the Hadith corpus, please cite:

Altammami, S., Atwell, E., & Alsalka, A. (2020). "The Arabic–English Parallel Corpus of Authentic Hadith". *International Journal on Islamic Applications in Computer Science and Technology - IJASAT*.

[Link to paper](http://www.sign-ific-ance.co.uk/index.php/IJASAT/article/view/2199/1908)

### Data Source
**LK-Hadith-Corpus** - Leeds University and King Saud University  
📧 Contact: shatha.tammami@gmail.com

## ⚖️ Disclaimer

This application provides access to authenticated Hadith texts for educational and research purposes only. The AI-generated responses are based on the provided context and should not replace consultation with qualified Islamic scholars for religious guidance and interpretation.

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing style and conventions
- Islamic design principles and respectful presentation are maintained
- All changes are tested before submitting
- Commit messages are clear and descriptive

## 📄 License

This project uses the LK-Hadith-Corpus dataset. Please refer to the original corpus license and citation requirements when using this application.

---

<div align="center">

**Made with ❤️ for the Islamic community**

*May Allah accept this work and make it beneficial for all*

</div>
<p><strong>Built with respect and dedication</strong></p>
<p><em>May Allah accept this work and make it beneficial</em></p>
<p>اللهم انفعنا بما علمتنا</p>
</div># Hadith-Chatbot
# Hadith-Chatbot
# Hadith-Chatbot

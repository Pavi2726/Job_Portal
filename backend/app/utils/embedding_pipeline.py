"""
Text embedding pipeline using HuggingFace SentenceTransformers.
"""
from sentence_transformers import SentenceTransformer

# Lazy loading - model loads only when first used, not on startup
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def generate_embedding(text: str) -> list[float]:
    """
    Convert a string of text into a high-dimensional vector array.
    """
    model = get_model()
    cleaned_text = text.replace('\n', ' ').strip()
    embedding = model.encode(cleaned_text, convert_to_numpy=True)
    return embedding.tolist()
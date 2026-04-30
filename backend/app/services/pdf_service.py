import io
from pypdf import PdfReader

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text from PDF content bytes."""
    reader = PdfReader(io.BytesIO(pdf_content))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text.strip()

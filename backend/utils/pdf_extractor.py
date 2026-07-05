import PyPDF2
import pdfplumber
import docx
import pytesseract
from PIL import Image
import io

def extract_text_from_pdf(file_stream):
    """
    Extract text from a PDF file using pdfplumber for better accuracy,
    fallback to PyPDF2 if needed.
    """
    text = ""
    try:
        with pdfplumber.open(file_stream) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"pdfplumber failed: {e}. Trying PyPDF2...")
        try:
            file_stream.seek(0)
            reader = PyPDF2.PdfReader(file_stream)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        except Exception as e2:
            print(f"PyPDF2 failed: {e2}")
    
    return text.strip()

def extract_text_from_docx(file_stream):
    """
    Extract text from a DOCX file.
    """
    try:
        doc = docx.Document(file_stream)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
        return ""

def extract_text_from_image(file_stream):
    """
    Extract text from an image (OCR fallback) using Tesseract.
    """
    try:
        image = Image.open(file_stream)
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print(f"Error in OCR: {e}")
        return ""

def extract_text(file, filename):
    """
    Determine file type and extract text.
    """
    ext = filename.split('.')[-1].lower()
    
    if ext == 'pdf':
        return extract_text_from_pdf(file)
    elif ext in ['doc', 'docx']:
        return extract_text_from_docx(file)
    elif ext in ['png', 'jpg', 'jpeg']:
        return extract_text_from_image(file)
    else:
        return ""

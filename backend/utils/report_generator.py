from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import io

def generate_pdf_report(analysis_data):
    """
    Generates a PDF report for a given resume analysis.
    Returns the binary content of the PDF.
    """
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Title
    p.setFont("Helvetica-Bold", 20)
    p.drawString(50, height - 50, "Smart Resume Analyzer Report")
    
    # Metadata
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 80, f"File: {analysis_data.get('filename', 'Unknown')}")
    
    score = analysis_data.get('score', 0)
    score_color = colors.green if score >= 80 else colors.orange if score >= 50 else colors.red
    
    p.setFont("Helvetica-Bold", 16)
    p.setFillColor(score_color)
    p.drawString(50, height - 120, f"ATS Score: {round(score)}%")
    p.setFillColor(colors.black)
    
    # Matched Skills
    y_position = height - 160
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, y_position, "Matched Skills:")
    y_position -= 20
    p.setFont("Helvetica", 11)
    
    matched = analysis_data.get('matched_skills', [])
    if not matched:
        p.drawString(70, y_position, "None")
        y_position -= 20
    else:
        for i in range(0, len(matched), 5):
            line = ", ".join(matched[i:i+5])
            p.drawString(70, y_position, line)
            y_position -= 20

    # Missing Skills
    y_position -= 10
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, y_position, "Missing Skills:")
    y_position -= 20
    p.setFont("Helvetica", 11)
    
    missing = analysis_data.get('missing_skills', [])
    if not missing:
        p.drawString(70, y_position, "None")
        y_position -= 20
    else:
        for i in range(0, len(missing), 5):
            line = ", ".join(missing[i:i+5])
            p.drawString(70, y_position, line)
            y_position -= 20

    # Suggestions
    y_position -= 10
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, y_position, "Suggestions:")
    y_position -= 20
    p.setFont("Helvetica", 11)
    
    suggestions = analysis_data.get('suggestions', [])
    for sug in suggestions:
        # Wrap text basic (ReportLab canvas is rudimentary)
        words = sug.split()
        line = ""
        for word in words:
            if p.stringWidth(line + word + " ", "Helvetica", 11) < width - 100:
                line += word + " "
            else:
                p.drawString(70, y_position, line)
                y_position -= 20
                line = word + " "
        if line:
            p.drawString(70, y_position, line)
            y_position -= 20
        y_position -= 10
        
        if y_position < 50:
            p.showPage()
            y_position = height - 50

    p.save()
    pdf_out = buffer.getvalue()
    buffer.close()
    return pdf_out

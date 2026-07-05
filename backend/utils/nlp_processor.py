import spacy
from collections import Counter
import re

# Load the english model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: en_core_web_sm not found. Downloading...")
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_skills_and_keywords(text):
    """
    Extract meaningful keywords/skills from text using NLP.
    """
    # Preserve casing for accurate POS tagging (React = PROPN, react = VERB)
    doc = nlp(text)
    
    # We look for NOUNs and PROPN (proper nouns) as potential skills
    # Also ignore standard english stop words
    keywords = set()
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"] and not token.is_stop and not token.is_punct:
            # Basic cleaning and lowercase AFTER tagging
            clean_word = re.sub(r'[^a-z0-9#+]', '', token.text.lower())
            if len(clean_word) > 1:
                keywords.add(clean_word)
                
    return list(keywords)

def calculate_ats_score(resume_text, job_description):
    """
    Compare resume against JD and calculate an ATS score.
    Returns score, matched skills, missing skills.
    """
    if not resume_text or not job_description:
        return 0, [], []

    resume_keywords = set(extract_skills_and_keywords(resume_text))
    jd_keywords = set(extract_skills_and_keywords(job_description))
    
    if not jd_keywords:
        return 0, [], []

    matched = resume_keywords.intersection(jd_keywords)
    missing = jd_keywords.difference(resume_keywords)
    
    # Calculate score based on percentage of jd keywords found in resume
    score = (len(matched) / len(jd_keywords)) * 100
    
    return round(score, 2), list(matched), list(missing)

def generate_suggestions(score, missing_skills):
    """
    Generate basic AI-like suggestions based on score and missing skills.
    """
    suggestions = []
    if score < 50:
        suggestions.append("Your resume lacks many key terms from the job description. Consider tailoring your experience more closely.")
    elif score < 80:
        suggestions.append("Your resume is a good match, but adding a few missing keywords could boost your chances.")
    else:
        suggestions.append("Great job! Your resume is highly tailored to the job description.")
        
    if missing_skills:
        suggestions.append(f"Try to incorporate these keywords naturally if you have experience with them: {', '.join(missing_skills[:5])}")
        
    return suggestions

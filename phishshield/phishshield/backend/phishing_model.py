import re

def analyze_phishing(url):
    phishing_keywords = ["bank-login", "verify-account", "secure-payment", "update-password"]
    
    for keyword in phishing_keywords:
        if re.search(keyword, url):
            return True  # High risk
    
    return False  # Low risk

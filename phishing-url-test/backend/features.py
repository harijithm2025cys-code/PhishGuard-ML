"""
Static URL Lexical Feature Helper for PhishGuard AI Test Prototype

Analyzes static text only. NEVER makes network requests or visits URLs.
"""

from typing import Dict, Any
from urllib.parse import urlparse
import re


def extract_features(url: str) -> Dict[str, Any]:
    """Extract basic lexical characteristics from URL string."""
    clean_url = str(url).strip()
    parsed = urlparse(clean_url if "://" in clean_url else "http://" + clean_url)
    
    url_len = len(clean_url)
    dot_count = clean_url.count(".")
    has_https = clean_url.lower().startswith("https://")
    
    # Check for raw IPv4 in netloc
    host = parsed.netloc.split(":")[0]
    ipv4_pattern = r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    has_ip = bool(re.match(ipv4_pattern, host))
    
    # Suspicious keywords
    keywords = ["login", "verify", "secure", "account", "update", "password", "bank", "confirm"]
    found_keywords = [kw for kw in keywords if kw in clean_url.lower()]
    
    return {
        "url_length": url_len,
        "dot_count": dot_count,
        "has_https": has_https,
        "has_ip": has_ip,
        "keywords": found_keywords
    }

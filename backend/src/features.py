"""
Lexical Feature Extraction and Explanation Engine for PhishGuard AI

Extracts structural and lexical characteristics from raw URL strings without
making network connections, visiting websites, or executing JavaScript.
"""

import re
import ipaddress
from typing import Dict, Any, List
from urllib.parse import urlparse, parse_qs


# Suspicious keywords frequently observed in credential phishing campaigns
SUSPICIOUS_KEYWORDS = [
    "login", "signin", "sign-in", "verify", "verification", "secure", 
    "account", "update", "password", "bank", "confirm", "wallet", 
    "bonus", "free", "support"
]


def is_ip_address(hostname: str) -> bool:
    """
    Check if hostname is a raw IPv4 address without connecting to it.
    
    Args:
        hostname: The host portion extracted from the URL.
        
    Returns:
        bool: True if hostname is an IPv4 address, False otherwise.
    """
    if not hostname:
        return False
    
    # Strip port if present
    clean_host = hostname.split(":")[0].strip("[]")
    
    try:
        ip = ipaddress.ip_address(clean_host)
        return isinstance(ip, ipaddress.IPv4Address)
    except ValueError:
        pass
    
    # Also check if host matches IPv4 pattern directly
    ipv4_pattern = r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    return bool(re.match(ipv4_pattern, clean_host))


def extract_url_features(url: str) -> Dict[str, Any]:
    """
    Extract structural and lexical characteristics from a URL string.
    
    IMPORTANT: This function performs static string analysis only.
    It NEVER initiates network requests or resolves hostnames.
    
    Args:
        url: The raw URL string.
        
    Returns:
        Dict[str, Any]: Extracted lexical feature dictionary.
    """
    clean_url = str(url).strip()
    
    # Parse URL components safely
    # If no scheme is present, add dummy scheme for proper urlparse behavior
    if not clean_url.startswith(("http://", "https://", "ftp://")):
        parsed = urlparse("http://" + clean_url)
        has_explicit_scheme = False
    else:
        parsed = urlparse(clean_url)
        has_explicit_scheme = True
        
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""
    fragment = parsed.fragment or ""
    
    # 1. Structural lengths
    url_length = len(clean_url)
    domain_length = len(hostname) if hostname else len(parsed.netloc)
    path_length = len(path)
    query_length = len(query)
    fragment_length = len(fragment)
    
    # 2. Character counts
    dot_count = clean_url.count(".")
    hyphen_count = clean_url.count("-")
    slash_count = clean_url.count("/")
    digit_count = sum(c.isdigit() for c in clean_url)
    
    # Special characters: non-alphanumeric except common URL separators (/, :, ., -, _)
    special_chars = set("@?=&%#+~$;!,^`|{}[]()\\*")
    special_character_count = sum(c in special_chars for c in clean_url)
    
    # 3. Subdomains calculation
    # Example: 'sub.domain.example.com' -> dots in domain minus 1
    if hostname:
        subdomain_parts = [p for p in hostname.split(".") if p]
        # Typically domain.tld has 2 parts, sub.domain.tld has 3, etc.
        subdomain_count = max(0, len(subdomain_parts) - 2)
    else:
        subdomain_count = 0
        
    # 4. Security indicators
    has_https = clean_url.lower().startswith("https://")
    has_ip = is_ip_address(hostname)
    has_at = "@" in clean_url
    
    # Double slash check after scheme
    if has_explicit_scheme:
        rest_of_url = clean_url.split("://", 1)[1] if "://" in clean_url else clean_url
        has_double_slash = "//" in rest_of_url
    else:
        has_double_slash = "//" in clean_url
        
    # Explicit port
    has_port = parsed.port is not None
    
    # Query parameters count
    query_params = parse_qs(query)
    query_parameter_count = len(query_params)
    
    # 5. Suspicious keywords detection (case-insensitive)
    lower_url = clean_url.lower()
    detected_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in lower_url]
    
    return {
        "url_length": url_length,
        "domain_length": domain_length,
        "path_length": path_length,
        "query_length": query_length,
        "fragment_length": fragment_length,
        "dot_count": dot_count,
        "hyphen_count": hyphen_count,
        "slash_count": slash_count,
        "digit_count": digit_count,
        "special_character_count": special_character_count,
        "subdomain_count": subdomain_count,
        "has_https": has_https,
        "has_ip_address": has_ip,
        "has_at_symbol": has_at,
        "has_double_slash": has_double_slash,
        "has_port": has_port,
        "query_parameter_count": query_parameter_count,
        "suspicious_keywords": detected_keywords
    }


def generate_indicators(features: Dict[str, Any]) -> List[str]:
    """
    Generate factual explanation indicators based ONLY on observable lexical characteristics.
    
    Rules:
    - Never claim that a feature proves malice or guarantees phishing.
    - Base findings purely on observable structural traits.
    
    Args:
        features: Dictionary produced by extract_url_features.
        
    Returns:
        List[str]: List of human-readable indicator statements.
    """
    indicators = []
    
    # IP Address indicator
    if features.get("has_ip_address", False):
        indicators.append("IP address detected in hostname instead of a standard domain name")
        
    # Suspicious keywords
    keywords = features.get("suspicious_keywords", [])
    if keywords:
        kw_str = ", ".join(f"'{k}'" for k in keywords[:4])
        indicators.append(f"URL contains sensitive security/auth keyword(s): {kw_str}")
        
    # URL length
    length = features.get("url_length", 0)
    if length > 75:
        indicators.append(f"URL is unusually long ({length} characters)")
        
    # Subdomain count
    subdomains = features.get("subdomain_count", 0)
    if subdomains >= 2:
        indicators.append(f"Multiple subdomain levels detected ({subdomains} subdomains)")
        
    # Protocol
    if not features.get("has_https", False):
        indicators.append("HTTPS scheme not detected (unencrypted HTTP protocol)")
        
    # @ symbol
    if features.get("has_at_symbol", False):
        indicators.append("URL contains '@' symbol (often utilized to obscure intended destination)")
        
    # Double slash in path
    if features.get("has_double_slash", False):
        indicators.append("Abnormal double slash '//' detected inside URL path")
        
    # Special character density
    special_count = features.get("special_character_count", 0)
    if special_count >= 5:
        indicators.append(f"High number of special characters detected ({special_count} characters)")
        
    # Digits count
    digit_count = features.get("digit_count", 0)
    if digit_count > 10:
        indicators.append(f"High concentration of numerical digits ({digit_count} digits)")
        
    # Custom non-standard port
    if features.get("has_port", False):
        indicators.append("Non-standard TCP/IP port specified in destination authority")
        
    # Default message if none triggered
    if not indicators:
        indicators.append("No obvious suspicious lexical indicators detected.")
        
    return indicators

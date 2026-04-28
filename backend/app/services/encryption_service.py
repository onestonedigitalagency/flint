"""
AES-256-GCM encryption service for API key vault.

Security guarantees:
- Keys are NEVER stored in plaintext.
- Uses AES-256-GCM (authenticated encryption — tamper-proof).
- Each encrypted value carries its own random nonce.
- Decrypt always verifies the authentication tag before returning.
"""
import base64
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def _get_aes_key() -> bytes:
    """Derive the 32-byte AES key from settings."""
    from app.core.config import settings

    raw = settings.AES_ENCRYPTION_KEY
    # Try base64 decode first, fall back to UTF-8 bytes (pad to 32)
    try:
        key = base64.b64decode(raw)
    except Exception:
        key = raw.encode("utf-8")

    if len(key) < 32:
        key = key.ljust(32, b"\x00")
    return key[:32]


def encrypt(plaintext: str) -> str:
    """
    Encrypt a plaintext string using AES-256-GCM.

    Returns a base64-encoded string: base64(nonce || ciphertext_with_tag)
    The nonce is 12 bytes (96-bit), randomly generated per call.
    """
    key = _get_aes_key()
    nonce = os.urandom(12)  # 96-bit nonce — unique per call
    aesgcm = AESGCM(key)
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode("utf-8"), None)
    payload = nonce + ciphertext
    return base64.b64encode(payload).decode("utf-8")


def decrypt(encrypted_value: str) -> str:
    """
    Decrypt an AES-256-GCM encrypted value produced by `encrypt()`.

    Raises ValueError if the ciphertext has been tampered with.
    """
    key = _get_aes_key()
    payload = base64.b64decode(encrypted_value)
    nonce = payload[:12]
    ciphertext = payload[12:]
    aesgcm = AESGCM(key)
    try:
        plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    except Exception as exc:
        raise ValueError("Decryption failed — ciphertext may be tampered.") from exc
    return plaintext.decode("utf-8")

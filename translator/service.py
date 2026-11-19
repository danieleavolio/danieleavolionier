"""Local machine-translation service (Helsinki-NLP opus-mt-it-en).

Translations are cached on disk by content hash, so each unique text is
translated once and then served from the cache. This is a neural MT model,
not an LLM.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import tempfile
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel

CACHE_PATH = Path(
    os.environ.get(
        "TRANSLATION_CACHE", Path(__file__).with_name("translation-cache.json")
    )
)
MODEL_NAME = os.environ.get("TRANSLATION_MODEL", "Helsinki-NLP/opus-mt-it-en")
MAX_CHARS = 480

app = FastAPI(title="YoRHa translator")
_cache: dict[str, str] = {}
_pipe: Any = None


def load_cache() -> None:
    global _cache
    if CACHE_PATH.exists():
        try:
            _cache = json.loads(CACHE_PATH.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            _cache = {}


def save_cache() -> None:
    try:
        fd, tmp = tempfile.mkstemp(dir=str(CACHE_PATH.parent), suffix=".tmp")
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(_cache, handle, ensure_ascii=False)
        os.replace(tmp, CACHE_PATH)
    except OSError:
        pass


def get_pipe() -> Any:
    global _pipe
    if _pipe is None:
        from transformers import pipeline

        _pipe = pipeline("translation", model=MODEL_NAME)
    return _pipe


def cache_key(text: str, source: str, target: str) -> str:
    return hashlib.sha256(f"{source}|{target}|{text}".encode("utf-8")).hexdigest()


def split_chunks(text: str) -> list[str]:
    if len(text) <= MAX_CHARS:
        return [text]
    parts = re.split(r"(?<=[.!?])\s+", text)
    chunks: list[str] = []
    current = ""
    for part in parts:
        if len(current) + len(part) + 1 > MAX_CHARS and current:
            chunks.append(current)
            current = part
        else:
            current = f"{current} {part}".strip()
    if current:
        chunks.append(current)
    return chunks


def translate_plain(text: str, source: str, target: str) -> str:
    if not text.strip() or source == target:
        return text
    key = cache_key(text, source, target)
    cached = _cache.get(key)
    if cached is not None:
        return cached

    chunks = split_chunks(text)
    results = get_pipe()(chunks, max_length=512, num_beams=4)
    translated = " ".join(item["translation_text"] for item in results).strip()
    _cache[key] = translated
    save_cache()
    return translated


def translate_html(html: str, source: str, target: str) -> str:
    tokens = re.split(r"(<[^>]*>)", html)
    for index, token in enumerate(tokens):
        if token.startswith("<") or not token.strip():
            continue
        tokens[index] = translate_plain(token, source, target)
    return "".join(tokens)


class TranslateRequest(BaseModel):
    texts: list[str]
    source: str = "it"
    target: str = "en"
    html: bool = False


class TranslateResponse(BaseModel):
    translations: list[str]
    cached: int = 0


@app.on_event("startup")
def startup() -> None:
    load_cache()


@app.get("/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "cached": len(_cache), "model": MODEL_NAME}


@app.post("/translate", response_model=TranslateResponse)
def translate(request: TranslateRequest) -> TranslateResponse:
    translate_fn = translate_html if request.html else translate_plain
    before = len(_cache)
    translations = [
        translate_fn(text, request.source, request.target) for text in request.texts
    ]
    return TranslateResponse(translations=translations, cached=len(_cache) - before)

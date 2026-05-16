"""Unified settings for DansLab Video Pipeline.

Pydantic-based, env-aware configuration. All secrets via environment variables.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class LLMConfig(BaseSettings):
    """LLM provider configuration with fallback chain."""

    model_config = SettingsConfigDict(env_prefix="LLM_")

    primary_provider: Literal["openai", "anthropic", "gemini", "glm", "moonshot", "ollama", "openrouter"] = "gemini"
    fallback_providers: list[str] = Field(default=["glm", "ollama", "openrouter"])
    max_tokens: int = 4096
    temperature: float = 0.7
    timeout: int = 120
    retry_attempts: int = 3


class RenderConfig(BaseSettings):
    """Video rendering configuration."""

    model_config = SettingsConfigDict(env_prefix="RENDER_")

    primary_engine: Literal["hyperframes", "revideo", "remotion", "comfyui"] = "hyperframes"
    fallback_engines: list[str] = Field(default=["revideo", "remotion"])
    width: int = 1920
    height: int = 1080
    fps: int = 30
    timeout: int = 600
    retries: int = 2
    auto_render: bool = True
    parallel_render: bool = True


class ComfyUIConfig(BaseSettings):
    """ComfyUI local/remote configuration."""

    model_config = SettingsConfigDict(env_prefix="COMFYUI_")

    host: str = "127.0.0.1"
    port: int = 8000
    api_url: str = "http://127.0.0.1:8000/api"
    websocket_url: str = "ws://127.0.0.1:8000/ws"
    workflow_dir: Path = PROJECT_ROOT / "workflows"
    output_dir: Path = PROJECT_ROOT / "out"
    checkpoint: str = "flux1-schnell-fp8.safetensors"


class TTSConfig(BaseSettings):
    """Text-to-speech configuration."""

    model_config = SettingsConfigDict(env_prefix="TTS_")

    primary_engine: Literal["kokoro", "vibevoice", "piper", "elevenlabs", "edge"] = "kokoro"
    fallback_engines: list[str] = Field(default=["edge", "piper"])
    voice: str = "af_bella"
    speed: float = 1.0
    sample_rate: int = 24000


class YouTubeConfig(BaseSettings):
    """YouTube upload and SEO configuration."""

    model_config = SettingsConfigDict(env_prefix="YT_")

    upload_enabled: bool = False
    review_before_publish: bool = True
    default_privacy: Literal["private", "unlisted", "public"] = "private"
    thumbnail_size: tuple[int, int] = (1280, 720)
    max_title_length: int = 100
    max_description_length: int = 5000
    max_tags: int = 15
    schedule_timezone: str = "UTC"


DEFAULT_PIPELINE_STEPS = [
    "research",
    "script",
    "visual_design",
    "scenes",
    "audio",
    "subtitles",
    "render",
    "qa",
    "final",
    "addons",
]


class PipelineConfig(BaseSettings):
    """Pipeline orchestration settings."""

    model_config = SettingsConfigDict(env_prefix="PIPELINE_")
    steps: list[str] = Field(default_factory=lambda: list(DEFAULT_PIPELINE_STEPS))
    enabled_steps: list[str] = Field(default_factory=lambda: list(DEFAULT_PIPELINE_STEPS))
    checkpoint_interval: int = 30  # seconds between state checkpoints
    max_step_retries: int = 3
    step_timeout: int = 300
    human_review_gate: bool = True
    cost_budget_usd: float = 5.0  # per-video budget


class ObservabilityConfig(BaseSettings):
    """Monitoring and observability settings."""

    model_config = SettingsConfigDict(env_prefix="OBS_")

    enabled: bool = True
    metrics_port: int = 9090
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    cost_tracking: bool = True
    quality_evals: bool = True
    prometheus_endpoint: str = "/metrics"


class Settings(BaseSettings):
    """Master settings container."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Project
    project_name: str = "DansLab Video Pipeline"
    version: str = "2.0.0"
    debug: bool = Field(default=False, alias="DEBUG")

    # Paths
    project_root: Path = PROJECT_ROOT
    out_dir: Path = PROJECT_ROOT / "out"
    logs_dir: Path = PROJECT_ROOT / "logs"
    data_dir: Path = PROJECT_ROOT / "data"
    cache_dir: Path = PROJECT_ROOT / ".cache"

    # Sub-configs
    llm: LLMConfig = Field(default_factory=LLMConfig)
    render: RenderConfig = Field(default_factory=RenderConfig)
    comfyui: ComfyUIConfig = Field(default_factory=ComfyUIConfig)
    tts: TTSConfig = Field(default_factory=TTSConfig)
    youtube: YouTubeConfig = Field(default_factory=YouTubeConfig)
    pipeline: PipelineConfig = Field(default_factory=PipelineConfig)
    observability: ObservabilityConfig = Field(default_factory=ObservabilityConfig)

    # External service URLs
    openclaw_gateway: str = "http://127.0.0.1:18789"
    ollama_host: str = "http://127.0.0.1:11434"
    supabase_url: str = ""
    supabase_key: str = ""

    # Feature flags
    use_local_models_first: bool = True
    use_cloud_fallback: bool = True
    enable_parallel_generation: bool = True
    enable_auto_upload: bool = False

    def ensure_dirs(self) -> None:
        """Create all required directories."""
        for d in [self.out_dir, self.logs_dir, self.data_dir, self.cache_dir]:
            d.mkdir(parents=True, exist_ok=True)


# Singleton instance
settings = Settings()

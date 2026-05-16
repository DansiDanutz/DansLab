"""CrewAI-based content generation agents.

Multi-agent team for research, scripting, visual planning, SEO, and QA.
"""

from __future__ import annotations

from typing import Any

# CrewAI is optional — gracefully degrade if not installed
try:
    from crewai import Agent, Crew, Process, Task
    CREWAI_AVAILABLE = True
except ImportError:
    CREWAI_AVAILABLE = False
    Agent = Crew = Process = Task = object  # type: ignore

from core.settings import settings


def _llm_config() -> dict[str, Any]:
    """Build LLM config for CrewAI agents."""
    provider = settings.llm.primary_provider
    return {
        "provider": provider,
        "temperature": settings.llm.temperature,
        "max_tokens": settings.llm.max_tokens,
    }


class ContentCrew:
    """Multi-agent content production crew."""

    def __init__(self) -> None:
        if not CREWAI_AVAILABLE:
            raise RuntimeError("CrewAI not installed. Run: pip install crewai")

        self.llm = _llm_config()
        self.agents = self._build_agents()

    def _build_agents(self) -> dict[str, Agent]:
        return {
            "trend_hunter": Agent(
                role="Trend Hunter",
                goal="Discover the most engaging, timely topics for YouTube content",
                backstory=(
                    "An expert digital culture analyst with deep knowledge of "
                    "crypto, AI, tech, and finance trends. You know what audiences "
                    "crave before they do. You scrape RSS feeds, social signals, "
                    "and news APIs to find high-engagement opportunities."
                ),
                verbose=True,
                allow_delegation=False,
                llm=self.llm,
            ),
            "script_writer": Agent(
                role="Script Writer",
                goal="Write compelling narration scripts that hook viewers in 3 seconds",
                backstory=(
                    "A veteran YouTube scriptwriter who has written for channels "
                    "with 10M+ subscribers. You understand pacing, hooks, and "
                    "story structure. You write in a conversational, energetic "
                    "style optimized for retention."
                ),
                verbose=True,
                allow_delegation=False,
                llm=self.llm,
            ),
            "visual_planner": Agent(
                role="Visual Planner",
                goal="Design scene-by-scene visual directions that match the script",
                backstory=(
                    "A creative director who translates scripts into stunning "
                    "visual sequences. You specify colors, motion, transitions, "
                    "and asset requirements for every scene. You understand "
                    "HyperFrames, ComfyUI, and motion design principles."
                ),
                verbose=True,
                allow_delegation=False,
                llm=self.llm,
            ),
            "seo_manager": Agent(
                role="SEO Manager",
                goal="Optimize titles, descriptions, tags, and thumbnails for maximum discovery",
                backstory=(
                    "A YouTube SEO specialist who has grown channels from 0 to "
                    "1M subscribers. You understand the algorithm, keyword research, "
                    "and CTR optimization. You craft titles that get clicked."
                ),
                verbose=True,
                allow_delegation=False,
                llm=self.llm,
            ),
            "quality_reviewer": Agent(
                role="Quality Reviewer",
                goal="Ensure every video meets DansLab quality standards before publish",
                backstory=(
                    "A meticulous content reviewer who checks technical specs, "
                    "brand consistency, factual accuracy, and viewer experience. "
                    "You reject anything that doesn't meet the bar."
                ),
                verbose=True,
                allow_delegation=False,
                llm=self.llm,
            ),
        }

    def run_research(self, sources: list[str] | None = None) -> dict[str, Any]:
        """Run the research phase."""
        agent = self.agents["trend_hunter"]
        task = Task(
            description=(
                f"Analyze current trends and suggest 3 high-engagement video topics. "
                f"Consider sources: {sources or 'RSS feeds, social signals, news APIs'}. "
                f"For each topic, provide: title, hook angle, target audience, "
                f"estimated engagement score (1-10), and 3 source URLs."
            ),
            agent=agent,
            expected_output="JSON array of 3 topic objects with title, angle, audience, score, sources",
        )
        crew = Crew(agents=[agent], tasks=[task], process=Process.sequential)
        return {"result": crew.kickoff(), "ok": True}

    def run_script(self, topic: str, style: str = "energetic") -> dict[str, Any]:
        """Run the script writing phase."""
        agent = self.agents["script_writer"]
        task = Task(
            description=(
                f"Write a 60-90 second YouTube script about: {topic}. "
                f"Style: {style}. Include: hook (0-3s), 3 main points, "
                f"transitions, and a strong CTA. Optimize for voiceover narration."
            ),
            agent=agent,
            expected_output="Complete narration script with timing markers and scene breaks",
        )
        crew = Crew(agents=[agent], tasks=[task], process=Process.sequential)
        return {"result": crew.kickoff(), "ok": True}

    def run_visual_plan(self, script: str) -> dict[str, Any]:
        """Run the visual planning phase."""
        agent = self.agents["visual_planner"]
        task = Task(
            description=(
                f"Create a scene manifest for this script. For each scene, specify: "
                f"duration, visual style, colors, motion type, text overlays, "
                f"and required assets (images/videos). Script:\n{script}"
            ),
            agent=agent,
            expected_output="JSON scene manifest with per-scene visual specifications",
        )
        crew = Crew(agents=[agent], tasks=[task], process=Process.sequential)
        return {"result": crew.kickoff(), "ok": True}

    def run_seo(self, script: str, topic: str) -> dict[str, Any]:
        """Run the SEO optimization phase."""
        agent = self.agents["seo_manager"]
        task = Task(
            description=(
                f"Optimize YouTube metadata for: {topic}. Script summary:\n{script[:500]}... "
                f"Provide: 3 title options (max 100 chars), description (max 5000 chars), "
                f"15 tags, thumbnail concept, and best publish time."
            ),
            agent=agent,
            expected_output="Complete YouTube metadata package in JSON format",
        )
        crew = Crew(agents=[agent], tasks=[task], process=Process.sequential)
        return {"result": crew.kickoff(), "ok": True}

    def run_qa(self, video_path: str, metadata: dict[str, Any]) -> dict[str, Any]:
        """Run quality review."""
        agent = self.agents["quality_reviewer"]
        task = Task(
            description=(
                f"Review video at {video_path} with metadata: {metadata}. "
                f"Check: technical specs (1080p, 30fps, <500MB), brand consistency, "
                f"factual claims, audio quality, and thumbnail appeal. "
                f"Return: PASS/FAIL with specific issues and severity."
            ),
            agent=agent,
            expected_output="QA report with PASS/FAIL verdict and issue list",
        )
        crew = Crew(agents=[agent], tasks=[task], process=Process.sequential)
        return {"result": crew.kickoff(), "ok": True}

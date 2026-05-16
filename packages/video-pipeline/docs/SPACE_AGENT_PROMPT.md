# Space Agent Dashboard Prompt

Create a dashboard called DansLab YouTube Command Center.

The dashboard should read from the **danslab-youtube-system** repository root (the folder containing `jobs/`, `data/`, `logs/`, `config/`).

Example location:

```text
/Users/davidai/Desktop/DavidAi/YouTube-Automation/danslab-youtube-system
```

Show:

- today's pending video jobs
- script preview
- generated image prompts
- generated images
- video preview
- approve/reject buttons
- upload status
- error logs
- last 7 published videos
- views, likes, CTR, watch time when analytics are available
- model usage summary
- Anthropic usage counter

Style:

- dark modern creator dashboard
- blue/orange accents
- clean cards
- clear approval workflow
- mobile-friendly

Important:

- Never upload unless a job is approved.
- Make approval state visible.

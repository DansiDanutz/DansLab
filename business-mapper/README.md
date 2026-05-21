# Business Mapper - Skill Installation Guide

## Quick Start (2 minutes)

### Option 1: Use Immediately (No Installation)

Just copy the content of `SKILL.md` and paste it into Claude with:

> "Here's a skill I want you to use: [paste skill content]. Please run this skill on my business."

### Option 2: Install as Claude Code Skill (Permanent)

1. **Create the skill folder:**
   ```bash
   mkdir -p ~/.claude/skills/business-mapper
   ```

2. **Copy files:**
   ```bash
   cp -r business-mapper/* ~/.claude/skills/business-mapper/
   ```

3. **Use anytime:**
   > "Use the business-mapper skill"

---

## What's Included

```
business-mapper/
├── SKILL.md              # Main skill file (interview framework)
├── README.md             # This file
└── templates/
    ├── roadmap-template.md   # 90-day roadmap template
    └── [More coming soon]
```

---

## How It Works

The skill uses a **7-question interview framework**:

1. **Business Core** - What you do, who you serve
2. **Customer Journey** - How people find and buy from you
3. **Weekly Activities** - Where your time actually goes
4. **Key Processes** - Step-by-step workflows
5. **Tools & Assets** - What you have vs. what you need
6. **Pain Points** - What frustrates you
7. **Goals** - What you want to achieve

From your answers, Claude generates:
- Visual business map (Mermaid diagram)
- Bottleneck analysis
- AI opportunity matrix
- 90-day action roadmap

---

## Example Usage

```
You: Use the business-mapper skill

Claude: I'll help you map your business and identify automation opportunities.

        Let's start with Phase 1: Foundation

        **Question 1: Business Core**

        Tell me about your business:
        - What does your business do? Be specific.
        - Who is your ideal customer?
        - What problem do you solve for them?
        - What's your primary offer or service?

        Take your time and be as detailed as possible.
```

---

## Troubleshooting

**Claude doesn't recognize the skill?**
- Make sure SKILL.md is in the correct folder
- Try pasting the content directly instead of installing
- Use a clearer prompt like "I want to run a business mapping interview"

**Diagrams not rendering?**
- Mermaid diagrams work in most markdown viewers
- For Draw.io output, specify "create a Draw.io compatible diagram"

**Want deeper analysis?**
- Ask Claude to "go deeper on [specific area]"
- Request "what would you add to this analysis?"
- Say "question my assumptions about [topic]"

---

## Roadmap

Future additions planned:
- [ ] Industry-specific question sets
- [ ] Team/employee interview mode
- [ ] Financial analysis add-on
- [ ] Competitor comparison framework
- [ ] Pre-built automation recipes

---

## Credits

Created as a free alternative to Business X-Ray ($197).
Uses principles from Lean, Six Sigma, and business process optimization.

**Free to use, modify, and share.**

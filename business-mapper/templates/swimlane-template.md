# Process Swimlane Template

**Map who does what, when, and where handoffs fail**

---

## What Are Process Swimlanes?

Swimlanes show the flow of work across different people, teams, or systems. They reveal:
- Who is responsible for each step
- Where handoffs happen (and fail)
- Parallel vs. sequential work
- System dependencies

---

## Basic Swimlane Structure

```
┌───────────────────┬───────────────────┬───────────────────┬───────────────────┐
│     CUSTOMER      │       YOU         │       TEAM        │      SYSTEM       │
├───────────────────┼───────────────────┼───────────────────┼───────────────────┤
│                   │                   │                   │                   │
│  [Start Here]     │                   │                   │                   │
│       ↓           │                   │                   │                   │
│                   │                   │                   │                   │
│             ─────→│  [Your Action]    │                   │                   │
│                   │       ↓           │                   │                   │
│                   │             ─────→│  [Team Action]    │                   │
│                   │                   │       ↓           │                   │
│                   │                   │             ─────→│ [Automated]       │
│                   │                   │                   │       ↓           │
│                   │                   │                   │             ─────→│
│                   │                   │                   │                   │
│                   │                   │                   │       ↓           │
│             ←─────┼───────────────────┼───────────────────┤    [Notification]│
│       ↓           │                   │                   │                   │
│  [Customer Action]│                   │                   │                   │
│                   │                   │                   │                   │
└───────────────────┴───────────────────┴───────────────────┴───────────────────┘
```

---

## Mermaid Swimlane Template

```mermaid
graph TD
    subgraph Customer["👤 CUSTOMER"]
        C1[Submits Form]
        C2[Receives Email]
        C3[Books Call]
        C4[Pays Invoice]
    end

    subgraph Owner["👷 BUSINESS OWNER"]
        O1[Reviews Lead]
        O2[Qualifies Lead]
        O3[Runs Call]
        O4[Sends Proposal]
    end

    subgraph System["🤖 AUTOMATED SYSTEM"]
        S1[Auto-Responder]
        S2[CRM Entry]
        S3[Calendar Invite]
        S4[Invoice Sent]
        S5[Onboarding Sequence]
    end

    C1 --> S2
    S2 --> S1
    S1 --> C2
    S2 --> O1
    O1 --> O2
    O2 -->|Qualified| C3
    O2 -->|Not Fit| S1
    C3 --> S3
    S3 --> O3
    O3 --> O4
    O4 --> C4
    C4 --> S4
    S4 --> S5
    S5 --> C2

    style Owner fill:#e1f5ff
    style Customer fill:#fff4e1
    style System fill:#e8f5e9
```

---

## Industry Examples

### Service Agency Swimlane

```mermaid
graph TD
    subgraph Client
        L1[Submits Inquiry]
        L2[Attends Call]
        L3[Approves Proposal]
        L4[Provides Materials]
        L5[Receives Deliverable]
    end

    subgraph Owner
        O1[Receives Notification]
        O2[Discovery Call]
        O3[Creates Proposal]
        O4[Project Kickoff]
        O5[Delivers Work]
    end

    subgraph Automation
        A1[Form Capture]
        A2[Lead Scored]
        A3[Calendar Booking]
        A4[Contract Sent]
        A5[Invoice Generated]
        A6[Project Setup]
        A7[Progress Updates]
    end

    L1 --> A1
    A1 --> A2
    A2 --> O1
    O1 --> O2
    O2 --> L2
    L2 --> A3
    A3 --> O3
    O3 --> L3
    L3 --> A4
    A4 --> O4
    O4 --> L4
    L4 --> A6
    A6 --> A7
    A7 --> L5
    O5 --> L5
```

### E-commerce Order Flow

```mermaid
graph TD
    subgraph Customer
        C1[Places Order]
        C2[Receives Confirmation]
        C3[Tracks Package]
        C4[Receives Product]
        C5[Leaves Review]
    end

    subgraph Store
        S1[Order Notification]
        S2[Process Payment]
        S3[Prepare Ship]
        S4[Handle Support]
    end

    subgraph System
        A1[Inventory Check]
        A2[Payment Processed]
        A3[Label Generated]
        A4[Tracking Update]
        A5[Review Request]
    end

    subgraph Fulfillment
        F1[Pick & Pack]
        F2[Hand to Carrier]
    end

    C1 --> S1
    S1 --> A1
    A1 --> S2
    S2 --> A2
    A2 --> C2
    A2 --> F1
    F1 --> A3
    A3 --> F2
    F2 --> A4
    A4 --> C3
    C3 --> C4
    C4 --> A5
    A5 --> C5
```

---

## Identifying Handoff Problems

Handoffs are where things break. Use this checklist:

| Handoff Point | Common Issues | Solution |
|---------------|---------------|----------|
| **Customer → You** | Lost leads, slow response | Auto-acknowledge, ticket system |
| **You → Team** | Unclear instructions, dropped balls | Templates, checklists, handoff doc |
| **Team → System** | Manual entry, errors | Direct integration, API |
| **System → Customer** | No notification, poor timing | Automated updates at right time |

---

## Process Discovery Questions

To build your swimlane, answer:

1. **Who triggers the process?** (Customer? System? Schedule?)
2. **What happens first?** (Immediate action? Notification?)
3. **Who does what?** (Owner? Team member? Automation?)
4. **What information is passed?** (Data? Documents? Context?)
5. **Where does it wait?** (Approval? Payment? Scheduling?)
6. **What can go wrong?** (Missing info? Delays? Errors?)
7. **How does it end?** (Delivery? Notification? Next step?)

---

## Optimizing Handoffs

### Before (Manual Handoffs)
```
Customer Email → You Check → You Reply → Manual Schedule → Manual Reminder
      ↑ bottleneck      ↑ bottleneck          ↑ bottleneck
```

### After (Smooth Handoffs)
```
Customer Form → System Captures → Auto Reply → Self-Schedule → Auto Reminders
      ↑ automated         ↑ automated              ↑ automated
```

### Key Improvements:
- **Eliminated waiting** - System processes immediately
- **No dropped leads** - Everything is captured
- **Better experience** - Customer gets instant response
- **Less manual work** - Owner only handles qualified leads

---

## Template: Handoff Document

When handing off between people/teams:

```markdown
## Handoff: [Process Name]

**From:** [Name/Role]
**To:** [Name/Role]
**Date:** [Date]

### Context
[Why this is happening, background]

### What's Been Done
- [ ] Step 1 completed
- [ ] Step 2 completed
- [ ] Step 3 completed

### What Needs To Happen
- [ ] Action 1 needed
- [ ] Action 2 needed
- [ ] Action 3 needed

### Key Information
- Customer: [Name]
- Value: [$]
- Timeline: [Dates]
- Special notes: [Details]

### Access Needed
- [ ] Link to project
- [ ] Folder access
- [ ] Tool credentials

### Success Criteria
[What does "done" look like?]
```

---

## Automation Targets in Swimlanes

Look for these automation opportunities:

| Pattern | Current State | Automation Opportunity |
|---------|---------------|----------------------|
| **Data entry** | Manual typing into multiple systems | Integration/API |
| **Notifications** | Remembering to notify people | Triggered alerts |
| **Scheduling** | Back-and-forth emails | Self-booking calendar |
| **Follow-ups** | Remembering to check back | Automated sequences |
| **Reminders** | Manual calendar entries | Scheduled notifications |
| **Status updates** | "Where are we on this?" emails | Automated progress reports |
| **Document generation** | Creating from scratch each time | Template + automation |

---

## Quick Start

To create your swimlane:

1. **Pick ONE process** to map (sales, onboarding, delivery)
2. **List all the actors** (customer, you, team, systems)
3. **Walk through step by step** - what actually happens?
4. **Mark the handoffs** - where does responsibility change?
5. **Identify problems** - where does it break or slow down?
6. **Design improvements** - what should be automated or templated?

---

*Use with the Business X-Ray skill to generate your custom swimlanes*

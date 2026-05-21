# Business Map & Bow-Tie Funnel Generator

**Template for creating visual business maps**

---

## Bow-Tie Funnel Structure

The bow-tie funnel shows your complete customer journey from stranger to repeat buyer:

```
      ACQUISITION        CONVERSION          RETENTION
         ──────           ────────           ────────

    ┌─────────┐      ┌─────────┐        ┌─────────┐
    │  LEAD   │      │  SALE   │        │ REPEAT  │
    │ SOURCES │ ───→ │ FUNNEL  │  ───→  │ PURCHASE│
    └─────────┘      └─────────┘        └─────────┘
         ↑                ↑                  ↑
    [Stranger]      [Customer]         [Loyal Fan]
         │                │                  │
         └────────────────┴──────────────────┘
                    Your Business
```

---

## Mermaid Template (Copy & Modify)

```mermaid
graph TD
    subgraph "ACQUISITION - Before Purchase"
        A1[Content Marketing]
        A2[Cold Outreach]
        A3[Referrals/Word of Mouth]
        A4[SEO/Organic]
        A5[Paid Ads]

        A1 --> CAPTURE[Lead Capture]
        A2 --> CAPTURE
        A3 --> CAPTURE
        A4 --> CAPTURE
        A5 --> CAPTURE
    end

    CAPTURE --> QUALIFY{Qualification}

    QUALIFY -->|Qualified| NURTURE[Nurture Sequence]
    QUALIFY -->|Not Ready| STAY[Stay in List]

    NURTURE --> OFFER[Offer Presented]
    OFFER --> DECISION{Purchase Decision}

    DECISION -->|Yes| SALE[Customer Acquisition]
    DECISION -->|No| FOLLOW[Follow-up Sequence]

    FOLLOW --> DECISION

    subgraph "RETENTION - After Purchase"
        SALE --> ONBOARD[Onboarding]
        ONBOARD --> DELIVER[Service Delivery]
        DELIVER --> SUPPORT[Ongoing Support]

        SUPPORT --> RETAIN{Renew/Repeat?}
        RETAIN -->|Yes| LOYAL[Loyal Customer]
        RETAIN -->|No| CHURN[Churned]

        LOYAL --> UPSELL[Upsell/Cross-sell]
        UPSELL --> SALE
    end

    %% Style bottlenecks in red
    style CAPTURE fill:#ff9999
    style DECISION fill:#ff9999
    style ONBOARD fill:#ff9999

    %% Style working parts in green
    style DELIVER fill:#99ff99
    style LOYAL fill:#99ff99

    %% Style opportunities in yellow
    style NURTURE fill:#ffff99
    style FOLLOW fill:#ffff99
```

---

## Industry-Specific Templates

### E-commerce Business

```mermaid
graph LR
    A[Social Media] --> B[Product Page]
    C[SEO Search] --> B
    D[Email List] --> B

    B --> E{Add to Cart}
    E -->|Abandon| F[Recovery Email]
    E -->|Checkout| G[Payment]

    F --> E
    G --> H[Order Confirmation]
    H --> I[Shipping]
    I --> J[Delivery]
    J --> K[Review Request]
    K --> L[Repeat Purchase]
```

### Service Business (Agency/Consulting)

```mermaid
graph TD
    A[Content/Thought Leadership] --> B[Book Discovery Call]
    C[Referrals] --> B
    D[Outreach] --> B

    B --> E[Qualification Call]
    E -->|Qualified| F[Proposal Sent]
    E -->|Not Fit| G[Nurture]

    F --> H{Contract Signed?}
    H -->|Yes| I[Onboarding Kickoff]
    H -->|No| J[Follow-up]

    I --> K[Project Delivery]
    K --> L[Review/Approval]
    L --> M[Ongoing Retainer]
```

### SaaS/Product Business

```mermaid
graph TD
    A[Organic Search] --> B[Free Trial/Sign Up]
    C[Ads] --> B
    D[Content Marketing] --> B

    B --> E[Product Activation]
    E --> F[Aha! Moment]

    F --> G{Value Realized?}
    G -->|Yes| H[Convert to Paid]
    G -->|No| I[Churn Risk]

    H --> J[Onboarding Success]
    J --> K[Active Usage]
    K --> L[Expansion/Upsell]

    I --> M[Intervention]
    M --> F
```

### Local Business (Restaurant/Service)

```mermaid
graph TD
    A[Google Maps] --> B[Visit/Call]
    C[Social Media] --> B
    D[Word of Mouth] --> B

    B --> E[First Experience]
    E --> F{Satisfied?}

    F -->|Yes| G[Review/Referral]
    F -->|No| H[Complaint/Churn]

    G --> I[Repeat Visit]
    G --> A

    I --> J[Loyal Regular]
    J --> K[Brand Advocate]
```

---

## Customization Guide

### Step 1: List Your Lead Sources
Replace the lead sources in the template with your actual sources:
- Social media platforms
- Referral sources
- Paid channels
- Organic/search
- Partnerships

### Step 2: Define Your Conversion Steps
What happens between discovery and purchase?
- Lead magnet download
- Email sequence
- Sales call
- Proposal
- Payment

### Step 3: Map Your Delivery
What happens after purchase?
- Onboarding
- Service delivery
- Support
- Fulfillment

### Step 4: Identify Retention Paths
How do customers come back?
- Renewals
- Repeat purchases
- Upsells
- Referrals

---

## Finding Your Bottlenecks

Use this checklist to identify where things break:

| Stage | Red Flag | Bottleneck Indicator |
|-------|----------|---------------------|
| **Lead Capture** | Low conversion | < 20% convert to lead |
| **Qualification** | Time waste | > 50% of leads unqualified |
| **Nurture** | Ghosting | No response to outreach |
| **Sales** | Low close rate | < 20% convert to customer |
| **Onboarding** | Delays | Takes > 3 days to start |
| **Delivery** | Complaints | > 10% request changes |
| **Retention** | High churn | > 20% don't return |

---

## Color Coding Legend

When reviewing your map:

- 🔴 **Red (Bottleneck)** - Things breaking, slowing down, or failing
- 🟡 **Yellow (Opportunity)** - Working but could be better
- 🟢 **Green (Working)** - Don't touch, what's working well
- 🔵 **Blue (Automation)** - Good candidate for AI automation

---

## Example: Analyzing a Map

**Before Optimization:**
```
Lead → Manual Email → Manual Call → Manual Proposal → Manual Contract → Manual Onboarding
         ↑ Bottleneck        ↑ Bottleneck           ↑ Bottleneck
```

**After Optimization:**
```
Lead → Auto Email → Qualified Call → Auto Proposal → E-Sign → Auto Onboarding
         ↑ Automated           ↑ Template          ↑ Automated
```

**Result:** 5 bottlenecks removed, 3 days → 3 hours to close

---

## Next Steps After Mapping

1. **Identify your #1 bottleneck** - Where do you lose the most people/time?
2. **Document the current process** - What actually happens now?
3. **Design the ideal process** - What should happen?
4. **Build the asset** - Template, automation, or system
5. **Test and measure** - Did it improve?

---

*Use this template with the Business X-Ray skill to generate your custom map*

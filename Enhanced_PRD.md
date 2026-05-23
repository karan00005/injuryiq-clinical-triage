# Enhanced Product Requirements Document (PRD)

## AI-Assisted Injury Triage System — InjuryIQ AI

| Field             | Detail                                      |
|-------------------|----------------------------------------------|
| **Document Version** | 2.0 (Enhanced)                            |
| **Date**             | May 23, 2026                              |
| **Project Name**     | InjuryIQ AI — AI-Assisted Injury Triage System |
| **Document Type**    | Product Requirements Document (PRD)        |
| **Prepared For**     | College Project Submission                 |
| **Status**           | Draft — Ready for Review                   |

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Objectives](#3-goals--objectives)
4. [Target Users](#4-target-users)
5. [Competitive Analysis](#5-competitive-analysis)
6. [Core Features (MVP)](#6-core-features-mvp)
7. [Complete Assessment Questionnaire](#7-complete-assessment-questionnaire)
8. [Adaptive Question Flow Logic](#8-adaptive-question-flow-logic)
9. [Risk Scoring Logic](#9-risk-scoring-logic)
10. [Output & Recommendations](#10-output--recommendations)
11. [User Flow](#11-user-flow)
12. [UI/UX Specifications](#12-uiux-specifications)
13. [Technical Architecture](#13-technical-architecture)
14. [Database Structure](#14-database-structure)
15. [Privacy & Safety](#15-privacy--safety)
16. [Future Features](#16-future-features)
17. [Success Metrics](#17-success-metrics)
18. [Project Roadmap](#18-project-roadmap)
19. [Assumptions & Constraints](#19-assumptions--constraints)
20. [Risks & Mitigations](#20-risks--mitigations)

---

## 1. Project Overview

**InjuryIQ AI** is a mobile-first, AI-assisted injury triage system designed to help non-medical users make informed decisions about musculoskeletal injuries — specifically sprains, fractures, and related soft-tissue injuries of the ankle, foot, knee, wrist, and elbow. The system leverages clinically validated **Ottawa Rules**, a structured symptom questionnaire, and optional AI-powered image analysis to generate a preliminary risk assessment.

The application does **not** replace professional medical evaluation. It serves as a first-response decision-support tool that reduces confusion, prevents delayed treatment for serious injuries, and minimizes unnecessary emergency room visits for minor ones.

### Key Value Proposition

> *"Should I go to the ER, visit a clinic tomorrow, or just rest at home?"*

InjuryIQ AI answers this question by guiding users through a structured assessment — modeled after the same clinical decision rules that emergency physicians use — and translating the results into clear, actionable, color-coded guidance.

### Technology Stack Summary

| Layer         | Technology       | Purpose                                 |
|---------------|------------------|-----------------------------------------|
| Frontend      | Flutter (Dart)   | Cross-platform mobile application       |
| Backend API   | FastAPI (Python) | Scoring engine, business logic, API     |
| Authentication| Firebase Auth    | Google OAuth 2.0 + Email/Password login |
| Database      | Cloud Firestore  | NoSQL document store for user data      |
| Storage       | Firebase Storage | Injury image storage                    |
| AI (Future)   | PyTorch          | Image-based injury classification       |

---

## 2. Problem Statement

### 2.1 The Core Problem

Musculoskeletal injuries — twisted ankles, jammed wrists, knee impacts — are among the most common injuries worldwide. According to the American Academy of Orthopaedic Surgeons, **over 2 million ankle sprains occur annually in the US alone**, and mismanagement of these injuries leads to chronic instability in up to 40% of cases.

The critical challenge: **non-medical individuals cannot reliably differentiate between a sprain and a fracture** without professional evaluation. This uncertainty leads to two costly outcomes:

1. **Delayed treatment** for fractures mistaken as "just a sprain" — risking complications such as malunion, chronic pain, and avascular necrosis.
2. **Unnecessary ER visits** for minor sprains — wasting time, money, and medical resources.

### 2.2 Real-Life Scenarios

| Scenario | Description | Consequence |
|----------|-------------|-------------|
| **The Athlete** | A college basketball player rolls their ankle during practice. The coach says "walk it off." The player limps for 3 days before an X-ray reveals a fracture at the base of the 5th metatarsal. | Delayed treatment. Potential surgical intervention that could have been avoided with earlier diagnosis. |
| **The Parent** | A child falls off a swing and complains of wrist pain. The parent is unsure whether to drive 40 minutes to the nearest ER at 10 PM or wait until morning. | Anxiety, potential delayed treatment, or a costly and unnecessary ER visit if the injury is minor. |
| **The Rural User** | A farmer twists their knee while working. The nearest hospital is 2 hours away. They need to decide whether the injury warrants the trip. | Without guidance, they either endure unnecessary pain or risk aggravating a serious injury. |
| **The Student** | A university student trips on stairs and injures their ankle before an exam week. They cannot afford to miss classes for a "probably fine" ankle. | They ignore the injury, develop chronic ankle instability, and face recurring problems for years. |

### 2.3 Key Pain Points

1. **Diagnostic Confusion** — Sprains and fractures share overlapping symptoms (swelling, bruising, pain, limited movement). Without medical training, users cannot distinguish between them.
2. **Delayed Treatment** — Serious injuries are dismissed as minor, leading to complications such as bone misalignment, chronic instability, and prolonged recovery.
3. **Unnecessary ER Visits** — Minor injuries are escalated out of fear, resulting in long wait times, high costs (average US ER visit: $2,200+), and unnecessary X-ray radiation exposure.
4. **Information Overload** — Generic symptom checkers provide vague, anxiety-inducing results ("it could be anything from a sprain to bone cancer") without structured clinical reasoning.
5. **Accessibility Gaps** — Rural users, low-income individuals, and those without easy access to healthcare facilities lack a reliable first-response tool.
6. **No Injury-Specific Tools** — Existing health apps are general-purpose. None focus specifically on musculoskeletal injury triage using validated clinical rules like the Ottawa Rules.

---

## 3. Goals & Objectives

### 3.1 Primary Goals

| # | Goal | Success Metric |
|---|------|----------------|
| G1 | **Reduce diagnostic uncertainty** for common musculoskeletal injuries by providing structured, evidence-based triage. | ≥ 85% of test users report feeling more confident about their injury severity after using the app. |
| G2 | **Implement all Ottawa Rules** (Ankle, Foot, Knee) and Scaphoid Assessment criteria accurately in a point-based scoring engine. | 100% of Ottawa Rule criteria mapped and validated against published clinical guidelines. |
| G3 | **Complete assessment in under 2 minutes** to ensure usability during acute injury scenarios. | Average assessment completion time ≤ 120 seconds across 20+ test scenarios. |
| G4 | **Generate actionable, risk-stratified recommendations** that clearly communicate next steps for each severity level. | Four distinct risk levels (Low, Moderate, High, Emergency) with specific, tailored recommendations for each. |
| G5 | **Maintain medical safety** by never claiming to diagnose and by immediately escalating emergency indicators. | Zero instances where a true emergency case is classified as Low or Moderate risk. All red-flag symptoms trigger immediate emergency protocol. |
| G6 | **Enable injury tracking** by allowing users to save assessment history and compare results over time. | Users can view, compare, and manage 10+ historical assessments from their dashboard. |

### 3.2 Secondary Objectives

- Provide first-aid guidance (R.I.C.E. protocol) for low-risk injuries.
- Support optional image upload for visual documentation and future AI analysis.
- Ensure the interface is accessible to users with no medical knowledge (plain language, visual aids, anatomical diagrams).
- Build a modular backend that can accommodate future AI image classification without architectural changes.

---

## 4. Target Users

### 4.1 User Personas

#### Persona 1: Aditya — The College Athlete

| Attribute     | Detail                                                  |
|---------------|---------------------------------------------------------|
| **Age**       | 20                                                      |
| **Occupation**| B.Tech student, university basketball team captain      |
| **Context**   | Frequent ankle rolls and knee impacts during practice   |
| **Pain Point**| Coach culture of "playing through pain" leads to ignored injuries. Cannot afford to miss practice for a "maybe fracture." |
| **Need**      | Quick, credible assessment that tells him whether the injury is serious enough to sit out and see a doctor. |
| **Tech Comfort** | High — uses apps daily, comfortable with camera uploads |
| **Quote**     | *"I need to know if this is a 'tape it up' situation or a 'get an X-ray' situation."* |

#### Persona 2: Priya — The Worried Parent

| Attribute     | Detail                                                  |
|---------------|---------------------------------------------------------|
| **Age**       | 35                                                      |
| **Occupation**| School teacher, mother of two children (ages 6 and 9)   |
| **Context**   | Children frequently fall while playing. Nearest hospital is 25 minutes away. |
| **Pain Point**| Cannot tell if a child's wrist/ankle injury is serious. Anxious about making the wrong call — either rushing to the ER unnecessarily or waiting too long. |
| **Need**      | A guided, step-by-step tool that helps her assess the injury calmly and provides clear next-step recommendations. |
| **Tech Comfort** | Moderate — uses WhatsApp and basic apps comfortably    |
| **Quote**     | *"My daughter fell off the swing and her wrist is swollen. Should I panic or can I ice it tonight and see the doctor tomorrow?"* |

#### Persona 3: Rajesh — The Rural Worker

| Attribute     | Detail                                                  |
|---------------|---------------------------------------------------------|
| **Age**       | 45                                                      |
| **Occupation**| Agricultural worker in a village in Maharashtra         |
| **Context**   | Physically demanding work. Nearest medical facility is a 2-hour bus ride away. |
| **Pain Point**| Cannot afford to lose a day of work for a minor injury, but also cannot risk ignoring a fracture. No nearby doctor to consult quickly. |
| **Need**      | A simple tool (even with basic smartphone) that tells him whether the injury is urgent enough to warrant the long trip to the hospital. |
| **Tech Comfort** | Low — basic smartphone, limited data                   |
| **Quote**     | *"If I go to the hospital for nothing, I lose a full day's wages. If I don't go and it's broken, I could be off work for months."* |

#### Persona 4: Coach Sharma — The Sports Coach

| Attribute     | Detail                                                  |
|---------------|---------------------------------------------------------|
| **Age**       | 38                                                      |
| **Occupation**| Physical education teacher and football coach           |
| **Context**   | Manages 30+ student athletes. Sideline injuries are common. School does not have an athletic trainer on staff. |
| **Pain Point**| Must make quick decisions about whether a player can return to the game or needs medical attention. No formal medical training. |
| **Need**      | A rapid, structured assessment tool he can use on the sideline to make informed decisions about player safety. |
| **Tech Comfort** | Moderate — uses coaching apps and fitness trackers      |
| **Quote**     | *"I'm not a doctor, but I'm the one who has to decide whether a kid goes back on the field or goes to the hospital."* |

---

## 5. Competitive Analysis

### 5.1 Competitor Comparison

| Feature / Criterion             | Ada Health          | WebMD Symptom Checker | InjuryIQ AI (Ours)          |
|----------------------------------|---------------------|-----------------------|-----------------------------|
| **Focus Area**                   | General health (all conditions) | General health (all conditions) | Musculoskeletal injuries only |
| **Clinical Framework**           | Bayesian inference (proprietary) | Keyword matching + database lookup | Ottawa Rules + structured scoring |
| **Injury-Specific Assessment**   | ❌ No               | ❌ No                  | ✅ Yes — ankle, foot, knee, wrist |
| **Ottawa Rules Implementation**  | ❌ No               | ❌ No                  | ✅ Full implementation        |
| **Image Upload Support**         | ❌ No               | ❌ No                  | ✅ Yes (with comparison view) |
| **Risk Level Explainability**    | Partial             | ❌ No                  | ✅ Full score breakdown       |
| **First Aid Guidance**           | Generic             | Generic               | ✅ Injury-specific (R.I.C.E.) |
| **Assessment History Tracking**  | ❌ No               | ❌ No                  | ✅ Full history dashboard     |
| **Red-Flag Emergency Detection** | Partial             | ❌ No                  | ✅ Instant escalation         |
| **Anatomical Diagrams**          | ❌ No               | ❌ No                  | ✅ Bone tenderness reference  |
| **Average Completion Time**      | 5-10 minutes        | 3-5 minutes           | < 2 minutes                 |
| **Target Audience**              | Global, all ages    | Global, all ages      | Athletes, parents, rural users, coaches |
| **Cost**                         | Freemium            | Free (ad-supported)   | Free (academic project)     |

### 5.2 Our Differentiators

1. **Clinically Validated Framework** — Ottawa Rules have a published sensitivity of 97.5-100% for detecting fractures. Our system implements these rules directly, unlike competitors that use generic symptom matching.
2. **Injury-Specific Design** — Built exclusively for musculoskeletal injuries. Every question, diagram, and recommendation is tailored to sprains and fractures.
3. **Transparent Scoring** — Users see exactly why they received their risk level. Every contributing factor is listed with its point value.
4. **Visual Documentation** — Image upload allows users to photograph the injury and the uninjured side for comparison, enabling future AI analysis and providing documentation for medical visits.
5. **Assessment History** — Users can track their injury assessments over time, enabling recovery monitoring and providing useful records for follow-up medical visits.

---

## 6. Core Features (MVP)

### 6.1 User Authentication

| Aspect          | Detail                                                        |
|-----------------|---------------------------------------------------------------|
| **Methods**     | Google OAuth 2.0 (one-tap sign-in) + Email/Password          |
| **Provider**    | Firebase Authentication                                       |
| **User Profile**| Display name, email, age, gender (optional), creation date    |
| **Session**     | Persistent login with secure token refresh                    |
| **Security**    | Firebase security rules, encrypted data in transit (TLS 1.3)  |

**User Stories:**
- As a new user, I can sign up with my Google account in one tap so I can start an assessment immediately.
- As a returning user, I can log in and view my previous assessments.
- As a user, I can log out securely from any screen.

### 6.2 Injury Assessment Questionnaire

A structured, multi-step questionnaire that collects injury information across 8 categories. Questions are presented one category at a time with a progress bar. The flow adapts dynamically based on the injury area selected (see Section 7 for the complete question set and Section 8 for the adaptive flow logic).

**Key Design Principles:**
- Plain, non-medical language with tooltips for technical terms.
- One question per screen for clarity on mobile.
- Visual aids (anatomical diagrams, reference images) for physical assessment questions.
- Back navigation allowed at every step.
- Assessment can be abandoned and restarted at any time.

### 6.3 Ottawa-Rule-Based Scoring Engine

The backend scoring engine implements the Ottawa Ankle Rules, Ottawa Foot Rules, Ottawa Knee Rules, and Scaphoid Assessment criteria as a point-based system (see Section 9 for the complete scoring logic).

**Engine Characteristics:**
- Deterministic — same inputs always produce the same score.
- Explainable — every point contribution is logged and returned to the frontend.
- Extensible — new injury areas and rules can be added without changing the core engine structure.
- Red-flag override — certain critical symptoms bypass the point system and immediately trigger an Emergency classification.

### 6.4 Risk Level Generation with Explainability

After scoring, the system generates one of four risk levels:

| Risk Level    | Score Range | Color       | Icon        |
|---------------|-------------|-------------|-------------|
| **LOW**       | 0–20        | 🟢 Green    | ✅ Checkmark |
| **MODERATE**  | 21–50       | 🟡 Yellow   | ⚠️ Warning   |
| **HIGH**      | 51–80       | 🔴 Red      | 🚨 Alert     |
| **EMERGENCY** | 81+ or Red Flag | 🔴 Dark Red | 🚑 Ambulance |

**Explainability Features:**
- Score breakdown showing each contributing factor and its point value.
- Highlighted Ottawa Rule results (positive/negative).
- Plain-language explanation of why the risk level was assigned.
- Comparison with clinical guidelines (e.g., "Ottawa Ankle Rules suggest X-ray is indicated when...").

### 6.5 Recommendations & First Aid Guidance

Each risk level generates a tailored set of recommendations (see Section 10 for the complete recommendation matrix). Recommendations include:

- Immediate actions (what to do right now).
- First aid protocols (R.I.C.E. — Rest, Ice, Compression, Elevation).
- When to seek medical help (specific timeframes).
- Warning signs to watch for (symptoms that should prompt re-assessment).

### 6.6 User Dashboard with Assessment History

| Feature               | Detail                                              |
|-----------------------|-----------------------------------------------------|
| **Assessment List**   | Chronological list of all past assessments           |
| **Summary Cards**     | Injury area, risk level (color-coded), date, score   |
| **Detail View**       | Full assessment results, score breakdown, recommendations |
| **Image Gallery**     | Uploaded injury photos linked to assessments         |
| **Quick Actions**     | Start new assessment, view history, edit profile     |
| **Statistics**        | Total assessments, most common injury area, trend    |

### 6.7 Optional Image Upload & Comparison

Users can optionally upload two images during the assessment:
1. **Injury Photo** — A photograph of the injured area showing swelling, bruising, or deformity.
2. **Comparison Photo** — A photograph of the same area on the uninjured side.

**Current MVP Behavior:**
- Images are stored in Firebase Storage linked to the assessment record.
- Images are displayed side-by-side in the assessment results for visual reference.
- No automated analysis is performed in the MVP (AI analysis is a future feature).

**Future Behavior (Post-MVP):**
- PyTorch-based CNN model will analyze the injury image for visual indicators of fracture vs. sprain.
- AI confidence scores will be integrated into the overall risk assessment.

### 6.8 Medical Disclaimer System

A persistent, legally protective disclaimer system that:
- Displays a mandatory disclaimer on first app launch (must acknowledge to proceed).
- Shows a brief reminder at the start of every new assessment.
- Includes a disclaimer footer on every result screen.
- Is accessible from the app settings at any time.

**Disclaimer Text (Draft):**

> ⚠️ **Medical Disclaimer**
>
> InjuryIQ AI is an educational tool that provides preliminary risk assessment based on your self-reported symptoms. It is NOT a substitute for professional medical evaluation, diagnosis, or treatment. The Ottawa Rules implemented in this application are screening tools — not diagnostic instruments. Always consult a qualified healthcare provider for any injury. If you are experiencing a medical emergency, call your local emergency services immediately.
>
> By continuing, you acknowledge that this tool does not provide medical advice and you agree to use the results for informational purposes only.

---

## 7. Complete Assessment Questionnaire

This section documents every question in the assessment flow, organized by category.

### Category 1 — Basic Information

| # | Question | Input Type | Options / Range | Clinical Rationale |
|---|----------|-----------|-----------------|-------------------|
| 1.1 | What is your age? | Number input | 1–120 | Ottawa Knee Rules are age-dependent (≥55 is a positive criterion). Age also affects injury patterns and healing. |
| 1.2 | How long ago did the injury occur? | Dropdown | Less than 1 hour, 1–6 hours, 6–24 hours, 1–3 days, More than 3 days | Fresh injuries (< 6 hours) provide more reliable assessment data. Delayed presentations may have confounding factors (e.g., swelling obscuring deformity). |

### Category 2 — Injury Mechanism

| # | Question | Input Type | Options | Clinical Rationale |
|---|----------|-----------|---------|-------------------|
| 2.1 | How did the injury happen? | Single select | Twist/Roll, Fall from height, Direct hit/blow, Sports collision, Bike/vehicle accident, Stepped wrong/awkward landing | High-energy mechanisms (fall from height, vehicle accident) are more likely to cause fractures. Low-energy mechanisms (twist/roll) are more common in sprains. |
| 2.2 | Did you hear or feel anything at the time of injury? | Single select | Pop or snap, Cracking or grinding, No sound, Don't remember | A "pop" may indicate ligament tear. "Cracking/grinding" (crepitus) is a strong indicator of bone involvement. |
| 2.3 | Which area is injured? | Single select with body diagram | Ankle, Foot, Knee, Wrist, Elbow, Other | Determines which Ottawa Rule set to apply. "Other" follows a general assessment path without Ottawa-specific questions. |

### Category 3 — Pain Assessment

| # | Question | Input Type | Options / Range | Clinical Rationale |
|---|----------|-----------|-----------------|-------------------|
| 3.1 | What is your current pain level? | Slider with emoji scale | 0 (No pain) to 10 (Worst imaginable) | Pain ≥ 8 is a significant clinical indicator. The emoji scale improves accessibility and consistency. |
| 3.2 | How would you describe the pain? | Single select | Sharp/stabbing, Dull/aching, Throbbing, Burning | Sharp/stabbing pain is more associated with fractures. Dull/aching pain is more typical of sprains and soft tissue injuries. |
| 3.3 | When does the pain increase? | Multi-select | Constantly (even at rest), When moving the area, When touching the area, When bearing weight/using it, Only at rest (night pain) | Constant pain at rest is a red flag. Weight-bearing pain is an Ottawa Rule criterion. |
| 3.4 | Does pain reduce with over-the-counter medication (e.g., ibuprofen)? | Single select | Yes, somewhat, No — pain is unrelieved, Haven't taken any | Unrelieved pain despite medication is a clinical red flag suggesting possible fracture or compartment syndrome. |

### Category 4 — Physical Signs

| # | Question | Input Type | Options | Clinical Rationale |
|---|----------|-----------|---------|-------------------|
| 4.1 | How much swelling do you see? | Single select with reference images | None, Mild (slight puffiness), Moderate (noticeably swollen, landmarks partially obscured), Severe (extremely swollen, landmarks not visible) | Severity of swelling correlates with tissue damage severity. Reference images ensure consistent self-assessment. |
| 4.2 | Is there bruising (discoloration)? | Single select | None, Small area of bruising, Large or spreading bruise, Very dark (purple/black) bruising | Large, dark bruising suggests significant vascular disruption, more common with fractures and severe ligament tears. |
| 4.3 | Does the injured area look bent, crooked, or abnormally shaped compared to the other side? | Single select | Yes, clearly deformed, Slightly — something looks off, No — it looks normal | **INSTANT HIGH RISK** — Visible deformity is a near-certain indicator of fracture or dislocation. This triggers immediate emergency classification. |
| 4.4 | What color is the skin around the injury? | Single select | Normal, Red/warm, Pale/white, Blue/purple | **EMERGENCY INDICATOR** — Pale/white or blue/purple skin indicates compromised blood supply (vascular injury). Requires immediate medical attention. |
| 4.5 | Does the area feel abnormally tight or tense to the touch (like the skin is being stretched from inside)? | Yes/No | Yes, No | Abnormal tightness/tension is a potential indicator of **compartment syndrome** — a surgical emergency that can cause permanent tissue damage if untreated. |

### Category 5 — Ottawa Rules Questions

These questions vary based on the injury area selected in Question 2.3. Only the relevant set is displayed.

#### 5A. Ankle (Ottawa Ankle Rules)

| # | Question | Input Type | Visual Aid | Clinical Rationale |
|---|----------|-----------|-----------|-------------------|
| 5A.1 | Were you able to walk at least 4 steps immediately after the injury? | Yes/No | — | Ottawa Ankle Rule criterion. Inability to bear weight immediately post-injury increases fracture probability. |
| 5A.2 | Can you walk at least 4 steps right NOW? | Yes/No | — | Ottawa Ankle Rule criterion. Current inability to bear weight is the strongest single predictor. |
| 5A.3 | Is there tenderness (pain when pressing) at the back edge or tip of the OUTER ankle bone (lateral malleolus)? | Yes/No | Anatomical diagram with highlighted zone | Ottawa Ankle Rule criterion. Bone tenderness at the posterior edge (6 cm) or tip of the lateral malleolus indicates possible fracture. |
| 5A.4 | Is there tenderness (pain when pressing) at the back edge or tip of the INNER ankle bone (medial malleolus)? | Yes/No | Anatomical diagram with highlighted zone | Ottawa Ankle Rule criterion. Bone tenderness at the posterior edge (6 cm) or tip of the medial malleolus indicates possible fracture. |

#### 5B. Foot (Ottawa Foot Rules)

| # | Question | Input Type | Visual Aid | Clinical Rationale |
|---|----------|-----------|-----------|-------------------|
| 5B.1 | Is there tenderness (pain when pressing) at the base of the 5th metatarsal (the bony bump on the outer edge of your foot, about halfway along)? | Yes/No | Anatomical diagram with highlighted zone | Ottawa Foot Rule criterion. 5th metatarsal base fractures are among the most commonly missed fractures. |
| 5B.2 | Is there tenderness (pain when pressing) at the navicular bone (the bony area on the inner side of your foot, in front of the ankle)? | Yes/No | Anatomical diagram with highlighted zone | Ottawa Foot Rule criterion. Navicular fractures require early detection to prevent avascular necrosis. |

#### 5C. Knee (Ottawa Knee Rules)

| # | Question | Input Type | Visual Aid | Clinical Rationale |
|---|----------|-----------|-----------|-------------------|
| 5C.1 | Are you 55 years of age or older? | Auto-filled from age input (Q1.1) | — | Ottawa Knee Rule criterion. Age ≥ 55 independently increases fracture risk due to bone density changes. |
| 5C.2 | Is the tenderness (pain when pressing) ONLY at the kneecap (patella), with no pain at the bones on either side? | Yes/No | Anatomical diagram showing patella vs. surrounding bones | Ottawa Knee Rule criterion. Isolated patellar tenderness suggests patellar fracture rather than tibial/femoral injury. |
| 5C.3 | Is there tenderness (pain when pressing) at the head of the fibula (the small bony bump on the outer side of your knee)? | Yes/No | Anatomical diagram with highlighted zone | Ottawa Knee Rule criterion. Fibular head tenderness suggests proximal fibula fracture. |
| 5C.4 | Can you bend your knee to a 90-degree angle (right angle)? | Yes/No | Reference image showing 90° knee flexion | Ottawa Knee Rule criterion. Inability to flex to 90° is associated with significant intra-articular injury (effusion, fracture). |

#### 5D. Wrist (Scaphoid Assessment)

| # | Question | Input Type | Visual Aid | Clinical Rationale |
|---|----------|-----------|-----------|-------------------|
| 5D.1 | Is there tenderness (pain when pressing) in the "anatomical snuffbox" — the small hollow on the back of your hand between the thumb tendons, at the wrist? | Yes/No | Anatomical diagram with highlighted zone | Snuffbox tenderness is the classic clinical sign of scaphoid fracture. Sensitivity ~90% for scaphoid fractures. |
| 5D.2 | Is there tenderness (pain when pressing) at the scaphoid tubercle — the bony bump at the base of your thumb on the palm side of your wrist? | Yes/No | Anatomical diagram with highlighted zone | Scaphoid tubercle tenderness, combined with snuffbox tenderness, increases specificity for scaphoid fracture. |
| 5D.3 | Does it hurt when you push (compress) along the length of your thumb toward your wrist? | Yes/No | Illustration showing the compression test | Axial compression of the thumb loads the scaphoid bone. Pain with this maneuver suggests fracture. |
| 5D.4 | Do you have severe pain when trying to grip or squeeze objects? | Yes/No | — | Severe grip pain indicates significant structural involvement (fracture or severe ligament injury) at the wrist. |

#### 5E. Elbow / Other (General Assessment)

For elbow injuries or injuries marked as "Other," the Ottawa-specific questions are skipped. The score relies on the general categories (mechanism, pain, physical signs, functional assessment, red flags). A note is displayed:

> "Ottawa Rules are validated for ankle, foot, knee, and wrist injuries. For your selected injury area, the assessment is based on general clinical indicators. Please consult a healthcare provider for a complete evaluation."

### Category 6 — Functional Assessment

| # | Question | Input Type | Options | Clinical Rationale |
|---|----------|-----------|---------|-------------------|
| 6.1 | How much can you move the injured area? | Single select | Full range of motion (same as normal), Partial — can move but limited, Very little — only slight movement, Cannot move at all | Severe restriction of movement correlates with fracture or significant structural damage. |
| 6.2 | When you compare the injured side to the uninjured side, how different do they look? | Single select | Clearly different (obvious asymmetry), Slightly different, No noticeable difference | Side-to-side comparison is a standard clinical assessment technique. Asymmetry suggests structural injury. |

### Category 7 — Red Flag / Emergency Screening

> ⚠️ **Critical Safety Section** — Positive answers to any of these questions may trigger an immediate Emergency classification, bypassing the point-based scoring system.

| # | Question | Input Type | Options | Clinical Rationale |
|---|----------|-----------|---------|-------------------|
| 7.1 | Is bone visibly protruding through the skin (open/compound fracture)? | Yes/No | Yes, No | **IMMEDIATE EMERGENCY** — Open fractures require emergency surgical intervention to prevent infection and further damage. |
| 7.2 | Do you have numbness or tingling in the fingers or toes below the injury? | Yes/No | Yes, No | Numbness/tingling indicates potential nerve compression or vascular compromise. Requires urgent medical evaluation. |
| 7.3 | Are the fingers or toes below the injury blue, cold, or turning pale/white? | Yes/No | Yes, No | **IMMEDIATE EMERGENCY** — Cold/blue/pale extremities indicate compromised arterial blood supply. Risk of ischemia and tissue death. |
| 7.4 | Is the pain severe and completely unrelieved by any position change, ice, or medication? | Yes/No | Yes, No | Unrelieved, severe pain is a hallmark of compartment syndrome and certain fracture types. Red flag for urgent evaluation. |

### Category 8 — Image Upload (Optional)

| # | Prompt | Input Type | Guidance | Purpose |
|---|--------|-----------|----------|---------|
| 8.1 | Would you like to upload a photo of the injured area? | Camera / Gallery upload | "Take a clear, well-lit photo of the injured area. Include surrounding landmarks for reference." | Visual documentation. Future AI analysis. Clinical record for medical visits. |
| 8.2 | Would you like to upload a photo of the SAME area on the UNINJURED side for comparison? | Camera / Gallery upload | "Take a photo of the same body part on your uninjured side from a similar angle." | Side-by-side comparison. Baseline for AI analysis. Helps clinicians during follow-up. |

---

## 8. Adaptive Question Flow Logic

The assessment questionnaire is not fully linear. The question flow adapts based on the user's responses, primarily driven by the **injury area selection** in Question 2.3.

### 8.1 Flow Diagram (Text Description)

```
START
  │
  ├─ Category 1: Basic Information (Q1.1, Q1.2)
  │     Always shown
  │
  ├─ Category 2: Injury Mechanism (Q2.1, Q2.2, Q2.3)
  │     Always shown
  │     Q2.3 (Injury Area) determines branching ──────────┐
  │                                                        │
  ├─ Category 3: Pain Assessment (Q3.1–Q3.4)              │
  │     Always shown                                       │
  │                                                        │
  ├─ Category 4: Physical Signs (Q4.1–Q4.5)               │
  │     Always shown                                       │
  │     Q4.3 (Deformity = Yes) ──► IMMEDIATE HIGH RISK    │
  │     Q4.4 (Pale/Blue)      ──► IMMEDIATE EMERGENCY     │
  │     Q4.5 (Tight/Tense)    ──► Flag for scoring        │
  │                                                        │
  ├─ Category 5: Ottawa Rules ◄────────────────────────────┘
  │     BRANCHING LOGIC:
  │     ├─ Ankle selected  ──► Show Q5A.1–Q5A.4
  │     ├─ Foot selected   ──► Show Q5A.1–Q5A.2 (weight bearing)
  │     │                      + Q5B.1–Q5B.2 (foot-specific)
  │     ├─ Knee selected   ──► Show Q5C.1–Q5C.4
  │     ├─ Wrist selected  ──► Show Q5D.1–Q5D.4
  │     ├─ Elbow selected  ──► Skip Category 5 (no validated rules)
  │     └─ Other selected  ──► Skip Category 5 (no validated rules)
  │
  ├─ Category 6: Functional Assessment (Q6.1–Q6.2)
  │     Always shown
  │
  ├─ Category 7: Red Flag Screening (Q7.1–Q7.4)
  │     Always shown
  │     ANY positive answer ──► Flag for immediate escalation
  │
  ├─ Category 8: Image Upload (Q8.1–Q8.2)
  │     Always shown (optional — can skip)
  │
  └─ SUBMIT ──► Scoring Engine ──► Result Screen
```

### 8.2 Branching Rules Summary

| Condition | Action |
|-----------|--------|
| Injury area = Ankle | Show Ottawa Ankle Rules (5A) |
| Injury area = Foot | Show weight-bearing questions from 5A (Q5A.1, Q5A.2) + Ottawa Foot Rules (5B) |
| Injury area = Knee | Show Ottawa Knee Rules (5C). Auto-fill age criterion from Q1.1. |
| Injury area = Wrist | Show Scaphoid Assessment (5D) |
| Injury area = Elbow or Other | Skip Category 5 entirely. Display informational note. |
| Q4.3 = "Yes, clearly deformed" | Set `immediateHighRisk = true`. Continue assessment for completeness but override final score to EMERGENCY. |
| Q4.4 = "Pale/white" or "Blue/purple" | Set `immediateEmergency = true`. Show warning banner. Override final score to EMERGENCY. |
| Q7.1 = Yes (bone protruding) | Set `immediateEmergency = true`. Show emergency instructions immediately. |
| Q7.3 = Yes (blue/cold extremities) | Set `immediateEmergency = true`. Show emergency instructions immediately. |

### 8.3 Early Termination Logic

If any of the following are detected, the system displays an **immediate emergency screen** after the current question, without requiring the user to complete the remaining assessment:

- Bone protruding through skin (Q7.1 = Yes)
- Blue/cold extremities below injury (Q7.3 = Yes)
- Visible deformity + blue/pale skin (Q4.3 = Yes AND Q4.4 = Pale or Blue)

The early termination screen provides:
- Emergency classification (without score — not needed)
- Instructions to call emergency services
- "Do not move the limb" guidance
- Option to save the partial assessment for records

---

## 9. Risk Scoring Logic

### 9.1 Immediate High-Risk Triggers

These conditions **bypass the point-based system** entirely and immediately classify the assessment as **EMERGENCY**:

| Trigger | Source Question | Override Level |
|---------|----------------|---------------|
| Visible deformity (clearly bent/crooked) | Q4.3 = "Yes, clearly deformed" | EMERGENCY |
| Bone protruding through skin | Q7.1 = Yes | EMERGENCY |
| Blue/cold extremities below injury | Q7.3 = Yes | EMERGENCY |
| Numbness/tingling below injury | Q7.2 = Yes | HIGH (minimum) |
| Unrelieved severe pain | Q7.4 = Yes | HIGH (minimum) |
| Pale/white skin color | Q4.4 = "Pale/white" | EMERGENCY |
| Blue/purple skin color | Q4.4 = "Blue/purple" | EMERGENCY |
| Compartment syndrome indicator (tight/tense) | Q4.5 = Yes | HIGH (minimum) |

### 9.2 Point-Based Scoring System

When no immediate triggers are present, the following point system is used:

#### Injury Mechanism Points

| Condition | Points | Rationale |
|-----------|--------|-----------|
| Fall from height | +15 | High-energy mechanism |
| Bike/vehicle accident | +15 | High-energy mechanism |
| Sports collision | +10 | Moderate-energy mechanism |
| Direct hit/blow | +8 | Moderate-energy mechanism |
| Twist/roll | +3 | Low-energy mechanism (common in sprains) |
| Stepped wrong | +3 | Low-energy mechanism |

#### Sound at Injury Points

| Condition | Points | Rationale |
|-----------|--------|-----------|
| Cracking/grinding sound | +20 | Crepitus — strong indicator of bone involvement |
| Pop/snap sound | +10 | May indicate ligament tear or cortical fracture |
| No sound | +0 | Neutral |
| Don't remember | +0 | Neutral |

#### Pain Assessment Points

| Condition | Points | Rationale |
|-----------|--------|-----------|
| Pain level 8–10 | +15 | Severe pain |
| Pain level 5–7 | +8 | Moderate pain |
| Pain level 3–4 | +3 | Mild pain |
| Pain level 0–2 | +0 | Minimal/no pain |
| Sharp/stabbing pain type | +10 | More associated with fractures |
| Throbbing pain type | +5 | Moderate indicator |
| Dull/aching pain type | +2 | More typical of soft tissue |
| Burning pain type | +3 | May indicate nerve involvement |
| Constant pain at rest | +12 | Red flag — suggests fracture |
| Pain unrelieved by medication | +10 | Red flag — suggests significant injury |

#### Physical Signs Points

| Condition | Points | Rationale |
|-----------|--------|-----------|
| Severe swelling | +15 | Significant tissue damage |
| Moderate swelling | +8 | Moderate tissue damage |
| Mild swelling | +3 | Minor tissue damage |
| No swelling | +0 | — |
| Very dark (purple/black) bruising | +12 | Significant vascular disruption |
| Large/spreading bruise | +10 | Moderate vascular disruption |
| Small bruise | +3 | Minor — common in both sprains and fractures |
| No bruising | +0 | — |
| Slightly deformed | +15 | Possible fracture with displacement |

#### Ottawa Rules Points

| Condition | Points | Rationale |
|-----------|--------|-----------|
| Cannot bear weight immediately after injury (Q5A.1 = No) | +30 | Ottawa positive — strongest single predictor |
| Cannot bear weight NOW (Q5A.2 = No) | +30 | Ottawa positive — current inability is critical |
| Lateral malleolus tenderness (Q5A.3 = Yes) | +25 | Ottawa positive — bone tenderness at key site |
| Medial malleolus tenderness (Q5A.4 = Yes) | +25 | Ottawa positive — bone tenderness at key site |
| 5th metatarsal base tenderness (Q5B.1 = Yes) | +25 | Ottawa positive — common fracture site |
| Navicular bone tenderness (Q5B.2 = Yes) | +25 | Ottawa positive — high-risk fracture site |
| Age ≥ 55 for knee (Q5C.1 = Yes) | +10 | Ottawa Knee Rule criterion |
| Isolated patellar tenderness (Q5C.2 = Yes) | +20 | Ottawa Knee Rule criterion |
| Fibular head tenderness (Q5C.3 = Yes) | +25 | Ottawa Knee Rule criterion |
| Cannot flex knee to 90° (Q5C.4 = No) | +25 | Ottawa Knee Rule criterion |
| Snuffbox tenderness (Q5D.1 = Yes) | +25 | Classic scaphoid fracture sign |
| Scaphoid tubercle tenderness (Q5D.2 = Yes) | +20 | Secondary scaphoid fracture sign |
| Pain with thumb compression (Q5D.3 = Yes) | +15 | Scaphoid loading test positive |
| Severe grip pain (Q5D.4 = Yes) | +10 | Structural wrist involvement |

#### Functional Assessment Points

| Condition | Points | Rationale |
|-----------|--------|-----------|
| Cannot move at all | +20 | Severe restriction — likely fracture |
| Very little movement | +12 | Significant restriction |
| Partial movement | +5 | Moderate restriction |
| Full range of motion | +0 | Reassuring — less likely fracture |
| Clearly different from other side | +10 | Asymmetry suggests structural damage |
| Slightly different | +3 | Minor asymmetry |
| No difference | +0 | Reassuring |

### 9.3 Risk Level Thresholds

| Total Score | Risk Level | Classification |
|-------------|-----------|----------------|
| 0–20 | **LOW RISK** 🟢 | Likely sprain or minor soft tissue injury |
| 21–50 | **MODERATE RISK** 🟡 | Possible significant sprain or minor fracture |
| 51–80 | **HIGH RISK** 🔴 | Probable fracture or severe injury |
| 81+ | **EMERGENCY** 🔴🚨 | Very high probability of fracture or severe structural damage |

> **Note:** Any immediate high-risk trigger (Section 9.1) overrides the point-based score and sets the classification to EMERGENCY regardless of total points.

### 9.4 Score Calculation Example

**Scenario:** 22-year-old basketball player, ankle twist during a game, 2 hours ago.

| Factor | Response | Points |
|--------|----------|--------|
| Mechanism: Twist/Roll | +3 | 3 |
| Sound: Pop/snap | +10 | 13 |
| Pain level: 7/10 | +8 | 21 |
| Pain type: Sharp/stabbing | +10 | 31 |
| Pain timing: When bearing weight | +0 (no extra) | 31 |
| Swelling: Moderate | +8 | 39 |
| Bruising: Small area | +3 | 42 |
| Deformity: No | +0 | 42 |
| Cannot walk 4 steps immediately: No → cannot walk | +30 | 72 |
| Can walk 4 steps now: No | +0 (already counted) | 72 |
| Lateral malleolus tenderness: Yes | +25 | 97 |
| Medial malleolus tenderness: No | +0 | 97 |
| Movement: Very little | +12 | 109 |
| Side comparison: Clearly different | +10 | 119 |
| Red flags: All No | +0 | 119 |

**Total: 119 → EMERGENCY**

**Score Breakdown Shown to User:**
> Your risk score is **119/120+** — **EMERGENCY** level.
>
> Key factors: Inability to bear weight (+30), lateral malleolus bone tenderness (+25), sharp pain at level 7 (+18), moderate swelling (+8), limited movement (+12).
>
> **Ottawa Ankle Rule Result: POSITIVE** — Clinical guidelines recommend X-ray imaging when Ottawa Rules are positive.

---

## 10. Output & Recommendations

### 10.1 LOW RISK (Score 0–20) 🟢

**Result Screen Title:** "Low Risk — Likely a Minor Injury"

**Summary:**
> Based on your responses, your injury appears to be a minor sprain or soft tissue injury. No Ottawa Rule criteria were triggered, and no red-flag symptoms were detected.

**Immediate Recommendations:**
1. **Rest** — Avoid putting weight on or using the injured area for at least 24–48 hours.
2. **Ice** — Apply ice wrapped in a cloth for 15–20 minutes every 2–3 hours for the first 48 hours. Do NOT apply ice directly to skin.
3. **Compression** — Use an elastic bandage to gently wrap the area. It should be snug but not tight enough to cause numbness or tingling.
4. **Elevation** — Keep the injured area elevated above heart level when resting to reduce swelling.

**When to Seek Help:**
- If pain worsens significantly over the next 24 hours
- If swelling increases dramatically
- If you develop numbness, tingling, or color changes in fingers/toes
- If you cannot bear weight after 48 hours of rest
- If the injury is not improving after 5–7 days

**Re-Assessment Prompt:** "Would you like to set a reminder to re-assess in 48 hours?"

---

### 10.2 MODERATE RISK (Score 21–50) 🟡

**Result Screen Title:** "Moderate Risk — Medical Evaluation Recommended"

**Summary:**
> Your responses indicate a moderate-risk injury. While this may be a significant sprain, some clinical indicators suggest a possible minor fracture or more serious soft tissue injury. A medical evaluation is recommended.

**Immediate Recommendations:**
1. Follow the **R.I.C.E. protocol** (Rest, Ice, Compression, Elevation) as described above.
2. **See a doctor within 24–48 hours.** An urgent care clinic or your primary care physician can evaluate the injury.
3. **Consider requesting an X-ray** — especially if Ottawa Rule indicators were positive (shown in score breakdown).
4. **Do NOT ignore persistent pain** — if pain does not improve with rest and ice within 24 hours, seek medical attention sooner.
5. **Avoid heat, alcohol, and massage** for the first 48 hours (these increase swelling).

**Score Breakdown:** Full breakdown of contributing factors displayed.

**When to Escalate to Emergency:**
- If you develop any red-flag symptoms (numbness, color changes, visible deformity)
- If pain becomes severe and unmanageable

---

### 10.3 HIGH RISK (Score 51–80) 🔴

**Result Screen Title:** "High Risk — Seek Medical Evaluation As Soon As Possible"

**Summary:**
> Your responses indicate a high-risk injury with several clinical indicators suggesting a possible fracture or severe structural injury. Medical evaluation is strongly recommended as soon as possible.

**Immediate Recommendations:**
1. **Seek medical evaluation TODAY.** Go to an urgent care center or emergency department.
2. **Do NOT move or use the injured area unnecessarily.** Immobilize it in a comfortable position.
3. **Apply ice** if available, but do NOT attempt to straighten or manipulate the injury.
4. **An X-ray is likely needed** based on your assessment results.
5. **Bring this assessment report** to your medical appointment (save/screenshot function available).

**Score Breakdown:** Full detailed breakdown with highlighted Ottawa Rule results.

**Ottawa Rule Summary (if applicable):**
> ⚠️ **Ottawa [Ankle/Foot/Knee] Rules: POSITIVE**
> Clinical evidence suggests that when Ottawa Rules are positive, X-ray imaging is indicated. Ottawa Rules have a sensitivity of 97.5–100% for detecting fractures.

---

### 10.4 EMERGENCY (Score 81+ or Red Flag) 🔴🚨

**Result Screen Title:** "⚠️ EMERGENCY — Seek Immediate Medical Attention"

**Summary:**
> Your responses indicate a potential emergency. One or more critical indicators suggest a severe injury that requires immediate medical attention.

**Immediate Instructions:**
1. 🚑 **Go to the Emergency Room NOW** or call emergency services.
2. ❌ **Do NOT move the injured limb.** Keep it in the position it is in.
3. ❌ **Do NOT attempt to push back or straighten any visible deformity.**
4. ✅ **If possible, immobilize the area** with a splint or by padding with pillows/towels.
5. ✅ **If there is an open wound, cover it loosely** with a clean cloth. Do NOT wash it.
6. ✅ **Keep the person calm and still** while waiting for medical help.

**Emergency Contact Prompt:** "Would you like to call emergency services? [Call 112] [Call local emergency number]"

**Red Flag Triggers Displayed:**
> 🚨 The following critical indicators were detected:
> - [List of triggered red flags, e.g., "Visible deformity," "Unable to bear weight," "Bone tenderness at multiple Ottawa Rule sites"]

---

## 11. User Flow

### 11.1 Complete Screen-by-Screen Flow

#### Screen 1: Splash Screen
- App logo and name: "InjuryIQ AI"
- Tagline: "Smart Injury Assessment at Your Fingertips"
- Auto-transitions to login after 2 seconds (or tap to skip)
- Animated logo with subtle pulse effect

#### Screen 2: Login / Signup
- Two options: "Continue with Google" (prominent) and "Sign in with Email"
- Email signup flow: Name → Email → Password → Confirm
- Email login flow: Email → Password
- "Forgot Password?" link
- Medical disclaimer acknowledgment checkbox (required before first use)

#### Screen 3: Dashboard (Home)
- Welcome header: "Hello, [Name] 👋"
- Prominent CTA button: "Start New Assessment" (large, centered)
- Recent Assessments section (last 3, with risk level color indicators)
- Quick stats: Total assessments, most assessed area
- Bottom navigation: Home | History | Profile

#### Screen 4: Disclaimer Reminder
- Brief disclaimer: "Remember, this is a screening tool — not a medical diagnosis."
- "I Understand, Continue" button
- Link to full disclaimer

#### Screen 5: Injury Area Selection
- Visual body diagram (front view)
- Tappable zones: Ankle, Foot, Knee, Wrist, Elbow, Other
- Each zone highlights on tap with label
- "Next" button activates after selection

#### Screen 6–15: Assessment Questionnaire (Step-by-Step)
- One question per screen
- Progress bar at top showing completion percentage
- Category label (e.g., "Pain Assessment — Question 2 of 4")
- Visual aids where applicable (anatomical diagrams, reference images, emoji scale)
- "Back" and "Next" buttons
- Skip option for optional questions only (Image Upload)

#### Screen 16: Image Upload (Optional)
- "Upload Injury Photo" button with camera icon
- "Upload Comparison Photo" button with camera icon
- Preview thumbnails after upload
- "Skip" option clearly visible
- Brief instructions on photo quality

#### Screen 17: Processing Animation
- Loading animation (2–3 seconds)
- Progress text: "Analyzing your responses..." → "Calculating risk score..." → "Generating recommendations..."
- Subtle medical-themed animation (pulse wave, health cross, etc.)

#### Screen 18: Result Screen
- Large risk level indicator (color-coded circle with risk level text)
- Numerical score with visual gauge/meter
- Brief summary paragraph
- "View Score Breakdown" expandable section
- Ottawa Rule result banner (if applicable)
- "View Recommendations" CTA button

#### Screen 19: Recommendations Screen
- Tailored recommendations based on risk level (from Section 10)
- R.I.C.E. protocol visual guide (for Low/Moderate)
- Emergency instructions (for High/Emergency)
- "Save Assessment" button
- "Share with Doctor" button (saves as text/PDF — future feature)
- "Start New Assessment" option

#### Screen 20: History Screen
- List of all saved assessments
- Each entry shows: Date, Injury Area icon, Risk Level (color badge), Score
- Tap to expand and view full results
- Delete individual assessments (swipe to delete)
- Filter by injury area or risk level

---

## 12. UI/UX Specifications

### 12.1 Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Simplicity** | Plain language throughout. No medical jargon without tooltips. One question per screen. |
| **Speed** | Complete assessment in < 2 minutes. Minimal typing — mostly taps and selections. |
| **Accessibility** | Large touch targets (minimum 48dp). High contrast text. Emoji pain scale. Reference images for physical signs. |
| **Trust** | Medical disclaimer always visible. Score transparency. Clear "not a diagnosis" messaging. |
| **Safety-First** | Emergency indicators trigger immediate escalation. Red-flag warnings are impossible to miss. |

### 12.2 Color System

| Purpose | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Primary | Medical Blue | `#1565C0` | Headers, buttons, navigation |
| Low Risk | Calm Green | `#2E7D32` | Low risk indicators, success states |
| Moderate Risk | Alert Yellow/Amber | `#F9A825` | Moderate risk indicators, caution states |
| High Risk | Warning Red | `#C62828` | High risk indicators, error states |
| Emergency | Dark Red | `#B71C1C` | Emergency indicators, critical alerts |
| Background | Light Gray | `#F5F5F5` | App background |
| Card Background | White | `#FFFFFF` | Card surfaces |
| Text Primary | Dark Gray | `#212121` | Primary text |
| Text Secondary | Medium Gray | `#757575` | Secondary text, labels |

### 12.3 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| App Title | Poppins | 28sp | Bold (700) |
| Screen Titles | Poppins | 22sp | Semi-Bold (600) |
| Question Text | Inter | 18sp | Medium (500) |
| Body Text | Inter | 16sp | Regular (400) |
| Labels/Captions | Inter | 14sp | Regular (400) |
| Button Text | Poppins | 16sp | Semi-Bold (600) |
| Score Display | Poppins | 48sp | Bold (700) |

### 12.4 Component Specifications

**Pain Emoji Scale (Q3.1):**

```
😊  🙂  😐  😕  😣  😖  😫  😩  🤯  😱
 0    1   2   3   4   5   6   7   8   9  10
No                                     Worst
Pain                               Imaginable
```

**Progress Bar:**
- Thin bar at top of assessment screens
- Filled portion uses primary blue color
- Shows percentage and step count (e.g., "Step 5 of 12")
- Smooth animation on progress

**Anatomical Diagrams:**
- Clean, labeled diagrams for:
  - Lateral/medial malleolus (ankle)
  - 5th metatarsal base and navicular bone (foot)
  - Patella, fibular head (knee)
  - Anatomical snuffbox, scaphoid tubercle (wrist)
- Interactive: tap to zoom
- Labels in plain language with medical term in parentheses

**Swelling Reference Images (Q4.1):**
- Four reference photos showing None / Mild / Moderate / Severe swelling
- Displayed in a horizontal scrollable carousel
- User selects the image that most closely matches their injury

### 12.5 Responsive Design

| Breakpoint | Design Consideration |
|------------|---------------------|
| Mobile (< 600dp) | Primary design target. Single column. Full-width cards. |
| Tablet (600–1024dp) | Two-column layout on dashboard. Larger diagrams. |
| Web (> 1024dp) | Centered content (max-width 800px). Side-by-side image comparison. |

---

## 13. Technical Architecture

### 13.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    FLUTTER APP                       │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │
│  │   Auth    │ │Assessment│ │     Dashboard      │  │
│  │  Screen   │ │   Flow   │ │  (History/Profile) │  │
│  └────┬─────┘ └────┬─────┘ └────────┬───────────┘  │
│       │             │                │               │
│  ┌────▼─────────────▼────────────────▼───────────┐  │
│  │              State Management (Riverpod)       │  │
│  └────┬─────────────┬────────────────┬───────────┘  │
│       │             │                │               │
│  ┌────▼───┐   ┌─────▼────┐   ┌──────▼──────┐       │
│  │Firebase │   │  HTTP     │   │  Firebase   │       │
│  │Auth SDK │   │  Client   │   │  Firestore  │       │
│  └────┬───┘   └─────┬────┘   │  SDK         │       │
│       │             │        └──────┬──────┘        │
└───────┼─────────────┼───────────────┼───────────────┘
        │             │               │
  ┌─────▼───┐   ┌─────▼─────────┐    │
  │Firebase  │   │   FastAPI      │    │
  │Auth      │   │   Backend      │    │
  │Service   │   │  ┌───────────┐ │    │
  └─────────┘   │  │  Scoring   │ │    │
                │  │  Engine    │ │    │
                │  └───────────┘ │    │
                │  ┌───────────┐ │    │
                │  │  Ottawa    │ │    │
                │  │  Rules     │ │    │
                │  │  Module    │ │    │
                │  └───────────┘ │    │
                │  ┌───────────┐ │    │
                │  │  PyTorch   │ │    │
                │  │  (Future)  │ │    │
                │  └───────────┘ │    │
                └───────┬───────┘    │
                        │            │
                  ┌─────▼────────────▼───┐
                  │    Firebase Cloud     │
                  │  ┌────────────────┐   │
                  │  │   Firestore    │   │
                  │  │   (Database)   │   │
                  │  └────────────────┘   │
                  │  ┌────────────────┐   │
                  │  │    Storage     │   │
                  │  │   (Images)     │   │
                  │  └────────────────┘   │
                  └──────────────────────┘
```

### 13.2 Component Responsibilities

| Component | Technology | Responsibility |
|-----------|-----------|---------------|
| **Flutter App** | Flutter 3.x / Dart | UI rendering, user interaction, form validation, state management, API communication |
| **State Management** | Riverpod | Application state, assessment data flow, authentication state, UI state |
| **FastAPI Backend** | Python 3.11+ / FastAPI | Scoring engine, Ottawa Rules logic, risk classification, recommendation generation |
| **Firebase Auth** | Firebase Authentication | User registration, login (Google OAuth + Email), session management, token validation |
| **Cloud Firestore** | Firebase Firestore | User profiles, assessment records, history storage (NoSQL document database) |
| **Firebase Storage** | Firebase Cloud Storage | Injury image storage, comparison image storage, secure URL generation |
| **PyTorch Module** | PyTorch (Future) | CNN-based image classification for injury severity estimation |

### 13.3 API Endpoints (FastAPI)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | `/api/v1/assess` | Submit assessment for scoring | `AssessmentRequest` (all questionnaire responses) | `AssessmentResult` (score, risk level, breakdown, recommendations) |
| GET | `/api/v1/health` | Health check | — | `{"status": "ok"}` |
| POST | `/api/v1/assess/validate` | Validate partial assessment data | Partial `AssessmentRequest` | Validation result |

**Example Request Body (`/api/v1/assess`):**

```json
{
  "userId": "firebase_uid_123",
  "basicInfo": {
    "age": 22,
    "injuryTimeAgo": "1-6 hours"
  },
  "mechanism": {
    "howInjured": "twist_roll",
    "soundHeard": "pop_snap",
    "injuryArea": "ankle"
  },
  "painAssessment": {
    "painLevel": 7,
    "painType": "sharp_stabbing",
    "painIncreases": ["when_bearing_weight", "when_moving"],
    "painReliefWithMeds": "no"
  },
  "physicalSigns": {
    "swelling": "moderate",
    "bruising": "small_area",
    "deformity": "no",
    "skinColor": "normal",
    "tightTense": false
  },
  "ottawaRules": {
    "canWalkImmediately": false,
    "canWalkNow": false,
    "lateralMalleolusTenderness": true,
    "medialMalleolusTenderness": false
  },
  "functionalAssessment": {
    "movementAbility": "very_little",
    "sideComparison": "clearly_different"
  },
  "redFlags": {
    "boneProtruding": false,
    "numbnessBelow": false,
    "blueColdBelow": false,
    "unrelivedSeverePain": false
  },
  "images": {
    "injuryImageUrl": "gs://bucket/injury_123.jpg",
    "comparisonImageUrl": null
  }
}
```

**Example Response Body:**

```json
{
  "assessmentId": "assess_abc123",
  "riskScore": 119,
  "riskLevel": "EMERGENCY",
  "ottawaRuleResult": "POSITIVE",
  "scoreBreakdown": [
    {"factor": "Injury mechanism (Twist/Roll)", "points": 3},
    {"factor": "Pop/snap sound heard", "points": 10},
    {"factor": "Pain level 7/10", "points": 8},
    {"factor": "Sharp/stabbing pain", "points": 10},
    {"factor": "Moderate swelling", "points": 8},
    {"factor": "Small area bruising", "points": 3},
    {"factor": "Cannot bear weight (Ottawa+)", "points": 30},
    {"factor": "Lateral malleolus tenderness (Ottawa+)", "points": 25},
    {"factor": "Very limited movement", "points": 12},
    {"factor": "Clearly different from other side", "points": 10}
  ],
  "recommendations": {
    "level": "EMERGENCY",
    "title": "⚠️ EMERGENCY — Seek Immediate Medical Attention",
    "immediateActions": [
      "Go to the Emergency Room NOW or call emergency services.",
      "Do NOT move the injured limb.",
      "Do NOT attempt to straighten any visible deformity.",
      "Immobilize the area with a splint or padding."
    ],
    "followUp": "An X-ray is strongly recommended based on positive Ottawa Ankle Rule results.",
    "ottawaSummary": "Ottawa Ankle Rules: POSITIVE. Clinical guidelines indicate X-ray imaging is warranted."
  },
  "createdAt": "2026-05-23T12:30:00Z"
}
```

---

## 14. Database Structure

### 14.1 Firestore Collection Schema

#### Collection: `users`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | String | Yes | Firebase Auth UID (document ID) |
| `displayName` | String | Yes | User's display name |
| `email` | String | Yes | User's email address |
| `age` | Number | No | User's age (can be updated) |
| `gender` | String | No | User's gender (optional) |
| `disclaimerAccepted` | Boolean | Yes | Whether user accepted medical disclaimer |
| `disclaimerAcceptedAt` | Timestamp | Yes | When disclaimer was accepted |
| `createdAt` | Timestamp | Yes | Account creation timestamp |
| `updatedAt` | Timestamp | Yes | Last profile update timestamp |

**Example Document:**

```json
{
  "uid": "firebase_uid_123",
  "displayName": "Aditya Kumar",
  "email": "aditya@example.com",
  "age": 22,
  "gender": "male",
  "disclaimerAccepted": true,
  "disclaimerAcceptedAt": "2026-05-20T10:00:00Z",
  "createdAt": "2026-05-20T10:00:00Z",
  "updatedAt": "2026-05-23T12:00:00Z"
}
```

#### Collection: `assessments`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assessmentId` | String | Yes | Auto-generated unique ID (document ID) |
| `userId` | String | Yes | Reference to user's UID |
| `injuryArea` | String | Yes | Selected injury area (ankle/foot/knee/wrist/elbow/other) |
| `injuryTimeAgo` | String | Yes | How long ago the injury occurred |
| `injuryMechanism` | String | Yes | How the injury happened |
| `soundHeard` | String | Yes | Sound at time of injury |
| `symptoms` | Map | Yes | All symptom responses (nested map) |
| `symptoms.painLevel` | Number | Yes | Pain level 0–10 |
| `symptoms.painType` | String | Yes | Type of pain |
| `symptoms.painIncreases` | Array | Yes | When pain increases (multi-select) |
| `symptoms.painReliefWithMeds` | String | Yes | Whether medication helps |
| `symptoms.swelling` | String | Yes | Swelling severity |
| `symptoms.bruising` | String | Yes | Bruising severity |
| `symptoms.deformity` | String | Yes | Visible deformity |
| `symptoms.skinColor` | String | Yes | Skin color changes |
| `symptoms.tightTense` | Boolean | Yes | Tight/tense feeling |
| `symptoms.movementAbility` | String | Yes | Range of motion |
| `symptoms.sideComparison` | String | Yes | Comparison with uninjured side |
| `ottawaResults` | Map | Yes | Ottawa Rule responses (varies by injury area) |
| `redFlags` | Map | Yes | Red flag screening responses |
| `redFlags.boneProtruding` | Boolean | Yes | Open fracture |
| `redFlags.numbnessBelow` | Boolean | Yes | Numbness/tingling |
| `redFlags.blueColdBelow` | Boolean | Yes | Vascular compromise |
| `redFlags.unrelivedPain` | Boolean | Yes | Unrelieved severe pain |
| `riskScore` | Number | Yes | Calculated risk score |
| `riskLevel` | String | Yes | LOW / MODERATE / HIGH / EMERGENCY |
| `scoreBreakdown` | Array | Yes | Array of {factor, points} objects |
| `recommendations` | Map | Yes | Generated recommendations |
| `immediateHighRisk` | Boolean | Yes | Whether immediate triggers were activated |
| `ottawaRuleResult` | String | No | POSITIVE / NEGATIVE / NOT_APPLICABLE |
| `imageUrl` | String | No | Firebase Storage URL for injury image |
| `comparisonImageUrl` | String | No | Firebase Storage URL for comparison image |
| `createdAt` | Timestamp | Yes | Assessment timestamp |

**Example Document:**

```json
{
  "assessmentId": "assess_abc123",
  "userId": "firebase_uid_123",
  "injuryArea": "ankle",
  "injuryTimeAgo": "1-6 hours",
  "injuryMechanism": "twist_roll",
  "soundHeard": "pop_snap",
  "symptoms": {
    "painLevel": 7,
    "painType": "sharp_stabbing",
    "painIncreases": ["when_bearing_weight", "when_moving"],
    "painReliefWithMeds": "no",
    "swelling": "moderate",
    "bruising": "small_area",
    "deformity": "no",
    "skinColor": "normal",
    "tightTense": false,
    "movementAbility": "very_little",
    "sideComparison": "clearly_different"
  },
  "ottawaResults": {
    "canWalkImmediately": false,
    "canWalkNow": false,
    "lateralMalleolusTenderness": true,
    "medialMalleolusTenderness": false
  },
  "redFlags": {
    "boneProtruding": false,
    "numbnessBelow": false,
    "blueColdBelow": false,
    "unrelivedPain": false
  },
  "riskScore": 119,
  "riskLevel": "EMERGENCY",
  "scoreBreakdown": [
    {"factor": "Twist/Roll mechanism", "points": 3},
    {"factor": "Pop/snap sound", "points": 10},
    {"factor": "Pain level 5-7", "points": 8},
    {"factor": "Sharp/stabbing pain", "points": 10},
    {"factor": "Moderate swelling", "points": 8},
    {"factor": "Small bruise", "points": 3},
    {"factor": "Cannot bear weight (Ottawa+)", "points": 30},
    {"factor": "Lateral malleolus tenderness (Ottawa+)", "points": 25},
    {"factor": "Very limited movement", "points": 12},
    {"factor": "Clearly different sides", "points": 10}
  ],
  "recommendations": {
    "level": "EMERGENCY",
    "title": "Seek Immediate Medical Attention",
    "actions": ["Go to ER", "Do not move limb", "X-ray indicated"]
  },
  "immediateHighRisk": false,
  "ottawaRuleResult": "POSITIVE",
  "imageUrl": "https://storage.googleapis.com/bucket/injury_123.jpg",
  "comparisonImageUrl": null,
  "createdAt": "2026-05-23T12:30:00Z"
}
```

### 14.2 Firestore Security Rules (Summary)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own assessments
    match /assessments/{assessmentId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 15. Privacy & Safety

### 15.1 Medical Disclaimer Framework

| Aspect | Implementation |
|--------|---------------|
| **First Launch** | Full-screen disclaimer with "I Acknowledge" button. Cannot proceed without acceptance. |
| **Every Assessment** | Brief reminder banner at assessment start. |
| **Every Result** | Disclaimer footer on result and recommendation screens. |
| **Settings** | Full disclaimer text accessible from app settings at any time. |
| **Legal Language** | "This tool provides preliminary screening only. It does not diagnose, treat, or substitute for professional medical evaluation." |

### 15.2 Data Privacy Principles

| Principle | Implementation |
|-----------|---------------|
| **Data Minimization** | Collect only information necessary for the assessment. No location data, no contact list access, no unnecessary permissions. |
| **User Ownership** | Users can view and delete their own assessments and images at any time. |
| **Secure Transmission** | All data transmitted over HTTPS (TLS 1.3). Firebase SDKs handle encryption automatically. |
| **No Sharing** | User data is never shared with third parties. No analytics tracking beyond basic Firebase Analytics (anonymized). |
| **Image Privacy** | Uploaded images are stored in user-specific Firebase Storage paths. Security rules prevent cross-user access. |
| **Authentication Security** | Firebase Auth handles password hashing, token rotation, and session management. No plaintext passwords are ever stored. |

### 15.3 Safety Guardrails

| Guardrail | Description |
|-----------|-------------|
| **Never Diagnose** | The app never uses the word "diagnosis" or claims to identify specific conditions. It provides "risk assessment" and "screening." |
| **Always Recommend Professional Evaluation** | Every result level includes a recommendation to consult a healthcare provider. Even LOW risk results include "when to seek help" guidance. |
| **Emergency Override** | Critical red-flag symptoms immediately override any score and trigger emergency guidance. This cannot be suppressed or ignored. |
| **No Treatment Advice** | The app provides first-aid guidance (R.I.C.E.) but never recommends specific medications, dosages, or treatment protocols beyond basic first aid. |
| **Age Sensitivity** | For users under 18, all results include an additional note: "For children and adolescents, growth plate injuries require special consideration. Please consult a pediatric healthcare provider." |

---

## 16. Future Features

### 16.1 Planned Enhancements (Post-MVP)

| # | Feature | Description | Priority | Estimated Phase |
|---|---------|-------------|----------|----------------|
| F1 | **AI Image Analysis** | PyTorch CNN model trained on injury images to classify visual indicators (swelling severity, bruising pattern, deformity detection). Integrates confidence score into overall risk assessment. | High | Phase 5 |
| F2 | **Recovery Tracking** | Allow users to log daily recovery progress (pain level, swelling, mobility). Visualize recovery trends over time with graphs. Alert if recovery is not progressing as expected. | High | Phase 5 |
| F3 | **PDF Report Generation** | Generate a professional PDF report of the assessment results (score breakdown, Ottawa Rule results, images, recommendations) that can be shared with a doctor. | Medium | Phase 4 |
| F4 | **Doctor Sharing** | Share assessment results directly with a healthcare provider via email, WhatsApp, or a secure link. Includes consent flow for data sharing. | Medium | Phase 5 |
| F5 | **Voice-Guided Assessment** | Accessibility feature: voice narration of questions and voice input for responses. Useful for users who cannot easily interact with the screen during an acute injury. | Medium | Phase 6 |
| F6 | **Multi-Language Support** | Localize the app into Hindi, Tamil, Telugu, Bengali, Marathi, and other regional Indian languages to improve accessibility for rural users. | High | Phase 6 |
| F7 | **Ice Timer** | Built-in 20-minute timer for R.I.C.E. protocol ice application. Includes notifications: "Time to remove ice" → "Wait 40 minutes before reapplying." | Low | Phase 4 |
| F8 | **Smart Injury Comparison** | AI-powered side-by-side comparison of injury photo vs. comparison photo. Highlights areas of asymmetry (swelling, bruising) automatically. | Medium | Phase 6 |
| F9 | **Push Notifications** | Reminder notifications for re-assessment (48-hour check-in), ice timer, and recovery tracking. | Low | Phase 4 |
| F10 | **Offline Mode** | Cache the assessment questionnaire and scoring engine locally so the app can function without internet connectivity. Sync results when connection is restored. Critical for rural users. | High | Phase 5 |

---

## 17. Success Metrics

### 17.1 Quantitative Metrics

| # | Metric | Target | Measurement Method |
|---|--------|--------|-------------------|
| M1 | Assessment Completion Time | ≤ 2 minutes average | Timestamp difference (assessment start → submit) |
| M2 | Test Scenario Coverage | ≥ 20 distinct test scenarios validated | Manual testing matrix with documented results |
| M3 | Ottawa Rules Mapping | 100% of published Ottawa Rule criteria implemented | Code review against Ottawa Rules reference (Stiell et al., 1992, 1995) |
| M4 | Red Flag Detection Rate | 100% — zero false negatives on emergency indicators | Automated unit tests for all red-flag trigger combinations |
| M5 | History Functionality | ≥ 10 historical assessments viewable and manageable per user | Functional testing with test accounts |
| M6 | App Crash Rate | < 1% of sessions | Firebase Crashlytics monitoring |
| M7 | API Response Time | ≤ 500ms for scoring endpoint (p95) | FastAPI middleware logging + monitoring |
| M8 | Assessment Accuracy (Internal) | ≥ 90% agreement between app output and manual expert scoring on test scenarios | Expert review of 20+ test cases |

### 17.2 Qualitative Metrics

| # | Metric | Target | Measurement Method |
|---|--------|--------|-------------------|
| M9 | User Confidence | ≥ 85% of test users report feeling more confident about next steps after assessment | Post-assessment survey (5-point Likert scale) |
| M10 | UI Clarity | ≥ 90% of test users complete the assessment without confusion or errors | Usability testing observation (think-aloud protocol) |
| M11 | Recommendation Helpfulness | ≥ 80% of test users rate recommendations as "helpful" or "very helpful" | Post-assessment survey |
| M12 | Medical Disclaimer Comprehension | ≥ 95% of test users understand the app is not a diagnostic tool | Post-assessment survey question |

---

## 18. Project Roadmap

### Phase 1: Foundation & Setup (Week 1–2)

| Task | Detail |
|------|--------|
| Project initialization | Flutter project setup, folder structure, dependencies |
| Firebase configuration | Firebase project creation, Auth setup (Google + Email), Firestore setup, Storage setup |
| FastAPI backend scaffolding | Project structure, virtual environment, basic health endpoint |
| Design system | Color palette, typography, component library (buttons, cards, input fields) |
| Splash screen & navigation | Splash screen implementation, routing setup (GoRouter) |

### Phase 2: Authentication & User Profile (Week 3)

| Task | Detail |
|------|--------|
| Google OAuth integration | Firebase Auth Google sign-in flow |
| Email/Password auth | Registration, login, password reset flows |
| User profile creation | Auto-create Firestore user document on first sign-in |
| Profile editing | Age, gender, display name editing |
| Session management | Persistent login, secure logout, token refresh |
| Disclaimer system | First-launch disclaimer screen, acknowledgment tracking |

### Phase 3: Assessment Questionnaire (Week 4–5)

| Task | Detail |
|------|--------|
| Question data model | Dart classes for all question types (single select, multi-select, slider, yes/no) |
| Questionnaire UI | One-question-per-screen layout with progress bar |
| Category 1–4 implementation | Basic info, mechanism, pain, physical signs screens |
| Category 5 implementation | Ottawa Rules questions with adaptive flow based on injury area |
| Category 6–7 implementation | Functional assessment, red flag screening |
| Anatomical diagrams | Create/source anatomical diagrams for bone tenderness questions |
| Swelling reference images | Create/source swelling severity reference images |
| Pain emoji scale | Custom slider widget with emoji indicators |
| Form validation | Required field validation, logical consistency checks |

### Phase 4: Scoring Engine & Results (Week 6–7)

| Task | Detail |
|------|--------|
| Scoring engine (FastAPI) | Implement point-based scoring system with all factors |
| Ottawa Rules module | Implement Ottawa Ankle, Foot, Knee Rules and Scaphoid Assessment |
| Red flag detection | Immediate high-risk trigger logic |
| Risk level classification | Score-to-level mapping with thresholds |
| Score breakdown generation | Detailed factor-by-factor breakdown with explainability |
| Recommendation engine | Risk-level-specific recommendation generation |
| Result screen UI | Color-coded risk display, score gauge, breakdown expandable section |
| Recommendation screen UI | Tailored recommendations, R.I.C.E. visual guide |
| API integration | Connect Flutter app to FastAPI scoring endpoint |
| Unit tests | Comprehensive tests for all scoring scenarios |

### Phase 5: Image Upload & Dashboard (Week 8–9)

| Task | Detail |
|------|--------|
| Image capture/upload | Camera and gallery integration in Flutter |
| Firebase Storage integration | Upload images, generate secure URLs, link to assessments |
| Image comparison view | Side-by-side display of injury and comparison photos |
| Assessment saving | Save completed assessments to Firestore |
| Dashboard UI | Welcome screen, recent assessments, quick stats |
| History screen | Chronological list, detail view, delete functionality |
| Filter/search | Filter history by injury area or risk level |

### Phase 6: Polish & Testing (Week 10–11)

| Task | Detail |
|------|--------|
| UI polish | Animations, transitions, loading states, error states |
| Edge case handling | Empty states, network errors, timeout handling |
| Accessibility review | Screen reader compatibility, contrast ratios, touch targets |
| Performance optimization | Image compression, lazy loading, API caching |
| Security review | Firestore rules testing, input sanitization, API authentication |
| Test scenario validation | Run 20+ documented test scenarios through the complete system |
| User testing | 5–10 test users complete assessments and provide feedback |
| Bug fixes | Address issues found during testing |

### Phase 7: Documentation & Submission (Week 12)

| Task | Detail |
|------|--------|
| Code documentation | Inline comments, README files, API documentation |
| User manual | In-app help section, FAQ |
| Project report | Final report with screenshots, architecture diagrams, test results |
| Presentation preparation | Demo slides, live demo preparation |
| Final deployment | Production build, final testing |
| Submission | Complete project package submission |

---

## 19. Assumptions & Constraints

### 19.1 Assumptions

| # | Assumption | Impact if Invalid |
|---|-----------|------------------|
| A1 | Users have a smartphone with a camera and internet connection. | Offline functionality would need to be prioritized (see Future Feature F10). |
| A2 | Users can read and understand English. | Multi-language support (Future Feature F6) would need to be accelerated. |
| A3 | Users can physically interact with the injured area (pressing for tenderness) or have someone help them. | Some Ottawa Rule questions cannot be answered, reducing scoring accuracy. The system handles "Don't know" responses gracefully. |
| A4 | The Ottawa Rules scoring criteria published in peer-reviewed literature are accurate and applicable to self-assessment. | The system may need calibration based on real-world self-assessment accuracy studies. |
| A5 | Firebase free tier (Spark plan) is sufficient for development and initial testing. | If usage exceeds free tier limits, we would need to upgrade to the Blaze plan (pay-as-you-go). |
| A6 | Users will honestly and accurately report their symptoms. | Inaccurate self-reporting will reduce assessment accuracy. The system cannot verify responses. |
| A7 | The project will be evaluated as an academic prototype, not a production medical device. | If production deployment were intended, regulatory compliance (FDA, CE marking) would be required. |

### 19.2 Constraints

| # | Constraint | Mitigation |
|---|-----------|-----------|
| C1 | **No Medical Diagnosis** — The system cannot and must not diagnose injuries. Legally and ethically, it can only provide screening and risk assessment. | Clear disclaimers, careful language throughout the app, legal review of all user-facing text. |
| C2 | **Academic Timeline** — Project must be completed within a 12-week semester. | Phased development with clear MVP scope. Future features are documented but not required for submission. |
| C3 | **No Real Patient Data** — Cannot collect or use real patient data for training or validation without IRB approval. | Use synthetic test scenarios based on published clinical case studies for validation. |
| C4 | **Single Developer / Small Team** — Limited development resources. | Focus on core features (MVP). Use Firebase managed services to reduce backend infrastructure work. |
| C5 | **No Regulatory Approval** — The app is not FDA-cleared or CE-marked. It cannot be marketed as a medical device. | Prominently display disclaimers. Position as an educational/screening tool only. |
| C6 | **Image AI Not in MVP** — PyTorch image analysis requires training data, model development, and validation that exceed the MVP timeline. | Image upload is included for documentation purposes. AI analysis is a documented future feature. |
| C7 | **Self-Assessment Limitations** — Users may not be able to accurately perform physical examination maneuvers (e.g., palpating bone tenderness). | Provide clear visual guides and anatomical diagrams. Include "Not sure" options where appropriate. Acknowledge this limitation in the disclaimer. |

---

## 20. Risks & Mitigations

### 20.1 Risk Register

| # | Risk | Probability | Impact | Severity | Mitigation Strategy |
|---|------|-------------|--------|----------|-------------------|
| R1 | **User misinterprets results as medical diagnosis** despite disclaimers | Medium | Critical | 🔴 High | Multiple disclaimer touchpoints (first launch, every assessment, every result). Clear "NOT a diagnosis" language. Legal review of disclaimer text. |
| R2 | **False negative** — System classifies a fracture as Low Risk | Low | Critical | 🔴 High | Conservative scoring (Ottawa Rules have 97.5-100% sensitivity). Red-flag override system. Every result includes "when to seek help" guidance. Extensive test scenario validation. |
| R3 | **False positive** — System classifies a sprain as Emergency | Medium | Moderate | 🟡 Medium | Acceptable trade-off. In medical screening, over-triage is preferred to under-triage. Score breakdown provides transparency. |
| R4 | **User cannot accurately perform self-assessment** (e.g., bone tenderness palpation) | High | Moderate | 🟡 Medium | Visual guides with anatomical diagrams. Clear instructions in plain language. "Not sure" response options. System functions with partial data (reduces score confidence but still provides assessment). |
| R5 | **Firebase service outage** disrupts app functionality | Low | Moderate | 🟡 Medium | Graceful offline handling. Error messages with retry option. Future offline mode (Feature F10). |
| R6 | **Scope creep** — Adding features beyond MVP during development | High | Moderate | 🟡 Medium | Strict MVP feature list (Section 6). Future features are documented but explicitly excluded from initial development. Weekly scope review. |
| R7 | **API security vulnerability** — Unauthorized access to scoring engine or user data | Low | Critical | 🔴 High | Firebase Auth token verification on all API endpoints. Firestore security rules. HTTPS only. Input validation and sanitization. No sensitive data in API logs. |
| R8 | **Poor self-assessment accuracy reduces system credibility** | Medium | Moderate | 🟡 Medium | Validate against published Ottawa Rules sensitivity/specificity data. Document system limitations clearly. Position as screening tool, not diagnostic tool. |
| R9 | **Legal liability** if a user relies solely on the app and suffers harm | Low | Critical | 🔴 High | Comprehensive disclaimer system. Legal language reviewed by advisor. Terms of use requiring acknowledgment. App positioned as educational tool, not medical device. |
| R10 | **Image storage costs** exceed Firebase free tier limits | Low | Low | 🟢 Low | Image compression before upload (max 1MB). Limit to 2 images per assessment. Monitor storage usage. Upgrade to Blaze plan if needed. |

### 20.2 Risk Response Matrix

```
                        IMPACT
                Low         Moderate      Critical
           ┌───────────┬────────────┬────────────┐
  High     │  Monitor  │  Mitigate  │  Prevent   │
Probability│   (R10)   │  (R4, R6)  │            │
           ├───────────┼────────────┼────────────┤
  Medium   │           │  (R3, R8)  │  (R1, R9)  │
           │           │  Accept    │  Prevent   │
           ├───────────┼────────────┼────────────┤
  Low      │           │   (R5)     │  (R2, R7)  │
           │           │  Monitor   │  Prevent   │
           └───────────┴────────────┴────────────┘
```

---

## Appendix A: Ottawa Rules Reference

### Ottawa Ankle Rules (Stiell et al., 1992)

An ankle X-ray series is required only if there is pain in the malleolar zone AND any one of the following:
- Bone tenderness at the posterior edge or tip of the lateral malleolus
- Bone tenderness at the posterior edge or tip of the medial malleolus
- Inability to bear weight (4 steps) immediately after injury AND at the time of assessment

### Ottawa Foot Rules (Stiell et al., 1992)

A foot X-ray series is required only if there is pain in the midfoot zone AND any one of the following:
- Bone tenderness at the base of the 5th metatarsal
- Bone tenderness at the navicular bone
- Inability to bear weight (4 steps) immediately after injury AND at the time of assessment

### Ottawa Knee Rules (Stiell et al., 1995)

A knee X-ray series is required only if any one of the following:
- Age ≥ 55
- Isolated patellar tenderness
- Fibular head tenderness
- Inability to flex the knee to 90°
- Inability to bear weight (4 steps) immediately after injury AND at the time of assessment

### Clinical Performance

| Rule Set | Sensitivity | Specificity | Source |
|----------|-----------|-------------|--------|
| Ottawa Ankle Rules | 98–100% | 40–50% | Stiell et al., JAMA 1994 |
| Ottawa Foot Rules | 98–100% | 35–45% | Stiell et al., JAMA 1994 |
| Ottawa Knee Rules | 97–100% | 27–49% | Stiell et al., Ann Emerg Med 1995 |

> **Interpretation:** Ottawa Rules have extremely high sensitivity (they almost never miss a fracture) but moderate specificity (they over-refer some patients who do not have fractures). This makes them ideal for screening — they are designed to "rule out" fractures, not to diagnose them.

---

## Appendix B: R.I.C.E. Protocol Reference

| Step | Protocol | Duration | Instructions |
|------|----------|----------|-------------|
| **R** — Rest | Avoid using the injured area | 24–72 hours | Do not bear weight. Use crutches if available. Avoid activities that cause pain. |
| **I** — Ice | Apply cold therapy | 15–20 min every 2–3 hours | Wrap ice in a thin cloth. Never apply ice directly to skin. Do not exceed 20 minutes per session. |
| **C** — Compression | Wrap with elastic bandage | Continuous (rewrap every few hours) | Wrap snugly but not tight enough to cause numbness, tingling, or increased pain. Loosen if symptoms worsen. |
| **E** — Elevation | Raise the injured area | As much as possible | Keep the injury above heart level when resting. Use pillows for support. Helps reduce swelling. |

---

## Appendix C: Glossary of Terms

| Term | Definition |
|------|-----------|
| **Ottawa Rules** | A set of clinical decision rules developed by Dr. Ian Stiell to determine whether X-ray imaging is needed for ankle, foot, and knee injuries. |
| **Triage** | The process of determining the priority of treatment based on the severity of a patient's condition. |
| **Malleolus** | The bony prominences on each side of the ankle (lateral = outside, medial = inside). |
| **Metatarsal** | The five long bones in the midfoot that connect the ankle to the toes. |
| **Navicular** | A boat-shaped bone on the inner side of the foot. |
| **Scaphoid** | A small bone in the wrist, located at the base of the thumb. Prone to fractures from falls onto outstretched hands. |
| **Anatomical Snuffbox** | A triangular depression on the back of the hand at the wrist, between the thumb tendons. Tenderness here suggests scaphoid fracture. |
| **Compartment Syndrome** | A dangerous condition where pressure builds within muscles, potentially cutting off blood supply. A surgical emergency. |
| **Crepitus** | A crackling or grinding sensation/sound in a joint or bone, often indicating fracture or cartilage damage. |
| **Avascular Necrosis** | Death of bone tissue due to loss of blood supply. A complication of certain fractures (especially scaphoid and navicular). |
| **R.I.C.E.** | Rest, Ice, Compression, Elevation — a standard first-aid protocol for soft tissue injuries. |
| **Sensitivity** | The ability of a test to correctly identify patients who DO have the condition (true positive rate). |
| **Specificity** | The ability of a test to correctly identify patients who do NOT have the condition (true negative rate). |

---

*End of Document*

*InjuryIQ AI — Enhanced Product Requirements Document v2.0*
*Prepared for academic project submission — May 2026*

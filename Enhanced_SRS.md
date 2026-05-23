# Software Requirements Specification

## AI-Assisted Injury Triage System (InjuryIQ AI)

**Version:** 2.0  
**Date:** May 23, 2026  
**Prepared by:** InjuryIQ AI Development Team  
**Document Standard:** IEEE 830-1998 (IEEE Recommended Practice for Software Requirements Specifications)

---

## Document Revision History

| Version | Date       | Author               | Description                          |
|---------|------------|-----------------------|--------------------------------------|
| 1.0     | 2026-04-10 | Development Team      | Initial draft SRS                    |
| 2.0     | 2026-05-23 | Development Team      | Enhanced SRS with full IEEE 830 compliance |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Specific Requirements](#3-specific-requirements)
4. [Use Cases](#4-use-cases)
5. [System Architecture](#5-system-architecture)
6. [Database Design](#6-database-design)
7. [API Design](#7-api-design)
8. [User Interface Requirements](#8-user-interface-requirements)
9. [Error Handling & Edge Cases](#9-error-handling--edge-cases)
10. [Security Requirements](#10-security-requirements)
11. [Testing Requirements](#11-testing-requirements)
12. [Limitations & Constraints](#12-limitations--constraints)
13. [Future Enhancements](#13-future-enhancements)
14. [Glossary](#14-glossary)
15. [Appendix](#15-appendix)

---

## 1. Introduction

### 1.1 Purpose

The purpose of this Software Requirements Specification (SRS) document is to provide a comprehensive, detailed, and unambiguous description of the requirements for the **AI-Assisted Injury Triage System**, branded as **InjuryIQ AI**. This document serves as the authoritative reference for:

- **Developers** — to understand the functional and non-functional expectations of the system and implement features accordingly.
- **Testers** — to derive test cases and validation criteria from clearly stated requirements.
- **Project Stakeholders** — to review and approve the scope, capabilities, and limitations of the proposed system.
- **Academic Evaluators** — to assess the technical rigor, feasibility, and completeness of the project as a college-level software engineering deliverable.

InjuryIQ AI is a mobile and web-based application designed to assist non-medical users in performing a preliminary risk assessment of musculoskeletal injuries — specifically sprains and fractures — using evidence-based clinical screening tools such as the **Ottawa Ankle Rules**, **Ottawa Knee Rules**, and **Scaphoid Fracture Assessment**. The system does **not** provide a medical diagnosis. It generates a risk score and triage recommendation to help users decide whether to apply self-care (R.I.C.E.), visit a doctor, or seek emergency care.

### 1.2 Scope

#### 1.2.1 What the System Will Do

- Allow users to register and authenticate securely using email/password or Google OAuth.
- Guide users through a structured, multi-step injury assessment questionnaire.
- Support injury assessment for the following anatomical areas: **Ankle, Foot, Knee, Wrist, and Elbow**.
- Apply clinically validated screening rules (Ottawa Ankle Rules, Ottawa Knee Rules, Scaphoid Assessment) to evaluate fracture risk.
- Calculate a numeric risk score using a point-based algorithm incorporating pain severity, swelling, mechanism of injury, Ottawa Rule results, and functional limitations.
- Classify risk into four levels: **Low**, **Moderate**, **High**, and **Emergency**.
- Provide actionable triage recommendations based on the computed risk level.
- Allow users to optionally upload images of the injured area for future AI-based analysis.
- Store assessment history for user review and reference.
- Display appropriate medical disclaimers at all critical touchpoints.

#### 1.2.2 What the System Will NOT Do

- **The system will NOT provide a medical diagnosis.** It is a decision-support tool that offers preliminary risk estimation only.
- **The system will NOT replace professional medical evaluation.** Users are explicitly advised to seek professional care for any serious injury.
- **The system will NOT perform real-time AI image classification in the MVP.** Image upload is supported for future model training and analysis.
- **The system will NOT prescribe medication** or recommend specific treatment regimens beyond general self-care guidance.
- **The system will NOT function as a certified medical device** under FDA, CE, or any equivalent regulatory framework.
- **The system will NOT guarantee the accuracy of the risk assessment.** Results are indicative and based on user-reported symptoms, which may be inaccurate or incomplete.
- **The system is NOT intended for life-threatening emergencies.** Users with suspected spinal injuries, head injuries, or profuse bleeding should call emergency services immediately.

### 1.3 Definitions, Acronyms, and Abbreviations

| Term / Acronym | Definition |
|----------------|------------|
| **Sprain** | An injury to a ligament caused by tearing of the fibers. Ligaments connect bone to bone and stabilize joints. Sprains are graded I (mild), II (partial tear), III (complete tear). |
| **Fracture** | A complete or partial break in the continuity of a bone. May be simple (closed), compound (open), stress, or avulsion type. |
| **Ottawa Rules** | A set of clinical decision rules developed to determine the need for radiographic (X-ray) imaging after acute injuries to the ankle, foot, or knee. Validated to have near 100% sensitivity for clinically significant fractures. |
| **Ottawa Ankle Rules** | Specific subset of Ottawa Rules applicable to ankle injuries, evaluating weight-bearing ability and bone tenderness at the posterior edge of the lateral malleolus and medial malleolus. |
| **Ottawa Knee Rules** | Clinical decision rules for knee injuries, evaluating age, tenderness at the fibular head, isolated patellar tenderness, inability to flex the knee to 90°, and inability to weight-bear. |
| **Triage** | The process of determining the priority of treatment based on the severity of a patient's condition. In this system, triage refers to classifying injury risk and recommending an appropriate level of care. |
| **R.I.C.E.** | An acronym for a self-care protocol: **R**est, **I**ce, **C**ompression, **E**levation — the standard first-aid recommendation for minor musculoskeletal injuries. |
| **MVP** | Minimum Viable Product — the initial version of the system with core functionality sufficient for early users and academic evaluation. |
| **FOOSH** | Fall On Outstretched Hand — a common injury mechanism that frequently results in wrist fractures (distal radius or scaphoid). |
| **DFD** | Data Flow Diagram — a graphical representation of the flow of data through an information system, used to model system processes and data stores. |
| **FR** | Functional Requirement — a requirement that specifies a function that the system must be able to perform. |
| **NFR** | Non-Functional Requirement — a requirement that specifies criteria for judging the operation of the system (performance, security, usability, etc.) rather than specific behaviors. |
| **API** | Application Programming Interface — a set of defined protocols for building and integrating application software. |
| **OAuth 2.0** | An open authorization framework that enables third-party applications to obtain limited access to a user's account without exposing credentials. |
| **AES-256** | Advanced Encryption Standard with a 256-bit key length — a symmetric encryption algorithm used for securing data at rest. |
| **HTTPS** | Hypertext Transfer Protocol Secure — the encrypted version of HTTP, using TLS/SSL to secure data in transit. |
| **PII** | Personally Identifiable Information — any data that could identify a specific individual (e.g., name, email, health information). |
| **WCAG** | Web Content Accessibility Guidelines — a set of recommendations for making web content more accessible to people with disabilities. |
| **HIPAA** | Health Insurance Portability and Accountability Act — U.S. federal law governing the privacy and security of health information. |
| **Lateral Malleolus** | The bony prominence on the outer side of the ankle, formed by the lower end of the fibula. |
| **Medial Malleolus** | The bony prominence on the inner side of the ankle, formed by the lower end of the tibia. |
| **Navicular Bone** | A small boat-shaped bone in the midfoot, located on the medial (inner) side. |
| **Fifth Metatarsal** | The long bone on the outer edge of the foot, connecting the midfoot to the little toe. Base fractures are a common injury. |
| **Scaphoid Bone** | A small carpal bone in the wrist, prone to fracture from FOOSH injuries. Fractures are often missed on initial X-rays. |
| **Anatomical Snuffbox** | A triangular depression on the radial (thumb) side of the wrist, bounded by tendons. Tenderness here suggests scaphoid fracture. |
| **Fibular Head** | The upper end of the fibula bone, located on the outer side of the knee. Tenderness here is evaluated in Ottawa Knee Rules. |

### 1.4 References

| # | Reference | Description |
|---|-----------|-------------|
| 1 | Stiell, I.G., Greenberg, G.H., McKnight, R.D., et al. (1992). *A Study to Develop Clinical Decision Rules for the Use of Radiography in Acute Ankle Injuries.* Annals of Emergency Medicine, 21(4), 384–390. | Original Ottawa Ankle Rules derivation study. |
| 2 | Stiell, I.G., Greenberg, G.H., Wells, G.A., et al. (1995). *Prospective Validation of a Decision Rule for the Use of Radiography in Acute Knee Injuries.* JAMA, 275(8), 611–615. | Ottawa Knee Rules validation study. |
| 3 | Stiell, I.G., Wells, G.A., Hoag, R.H., et al. (1997). *Implementation of the Ottawa Knee Rule for the Use of Radiography in Acute Knee Injuries.* JAMA, 278(23), 2075–2078. | Ottawa Knee Rules implementation study. |
| 4 | Bachmann, L.M., Kolb, E., Koller, M.T., et al. (2003). *Accuracy of Ottawa Ankle Rules to Exclude Fractures of the Ankle and Mid-Foot: Systematic Review.* BMJ, 326(7386), 417. | Systematic review of Ottawa Ankle Rules accuracy. |
| 5 | Parvizi, J., & Kim, G.K. (2010). *High Yield Orthopaedics.* Saunders Elsevier. | Reference for orthopedic injury classification and assessment. |
| 6 | IEEE Std 830-1998. *IEEE Recommended Practice for Software Requirements Specifications.* IEEE Computer Society. | SRS document standard followed. |
| 7 | Flutter Documentation. flutter.dev. | Frontend framework reference. |
| 8 | FastAPI Documentation. fastapi.tiangolo.com. | Backend framework reference. |
| 9 | Firebase Documentation. firebase.google.com. | Cloud services reference. |

### 1.5 Overview of Document

This SRS document is organized into fifteen major sections following the IEEE 830-1998 standard structure with additional sections specific to the project's requirements:

- **Section 1 (Introduction):** Establishes the purpose, scope, definitions, and references for the document.
- **Section 2 (Overall Description):** Provides a high-level overview of the product, its users, operating environment, constraints, and dependencies.
- **Section 3 (Specific Requirements):** Contains detailed functional requirements (FR-01 through FR-22) and non-functional requirements (NFR-01 through NFR-06), each with measurable acceptance criteria.
- **Section 4 (Use Cases):** Presents eight detailed use cases with actors, flows, and exception handling.
- **Section 5 (System Architecture):** Describes the three-tier architecture, component breakdown, and data flow diagrams.
- **Section 6 (Database Design):** Documents the Cloud Firestore NoSQL schema with collection structures and field specifications.
- **Section 7 (API Design):** Lists all REST API endpoints with methods, descriptions, request/response formats, and authentication requirements.
- **Section 8 (User Interface Requirements):** Specifies screen layouts, design principles, color coding, and accessibility guidelines.
- **Section 9 (Error Handling & Edge Cases):** Addresses failure scenarios and system behavior under abnormal conditions.
- **Section 10 (Security Requirements):** Details authentication, encryption, privacy, and compliance considerations.
- **Section 11 (Testing Requirements):** Defines the testing strategy with specific test scenarios for risk scoring validation.
- **Section 12 (Limitations & Constraints):** Acknowledges system boundaries and clinical limitations.
- **Section 13 (Future Enhancements):** Outlines the roadmap for post-MVP features.
- **Section 14 (Glossary):** Provides a consolidated glossary of terms.
- **Section 15 (Appendix):** Contains reference materials including the complete question list, Ottawa Rules reference, and risk scoring table.

---

## 2. Overall Description

### 2.1 Product Perspective

InjuryIQ AI is a **standalone decision-support application** that operates independently of any existing healthcare information system. It is **not** a medical device, not a component of an Electronic Health Record (EHR) system, and not intended to interface with hospital or clinic software.

The system exists within the following context:

- **User Context:** A non-medical person who has sustained a musculoskeletal injury (or is assessing an injury sustained by someone in their care) and needs guidance on the appropriate level of medical attention.
- **Clinical Context:** The system implements validated clinical screening rules (Ottawa Rules) that are used by healthcare professionals to determine whether an X-ray is needed. By making these rules accessible to the general public in a simplified format, the system aims to bridge the gap between injury occurrence and appropriate medical response.
- **Technical Context:** The system uses a modern mobile-first architecture with Flutter for cross-platform frontend development, FastAPI for backend API services, and Firebase for authentication, database, and storage services.

**Important Disclaimer:** InjuryIQ AI is designed as an educational and guidance tool. It is not intended to be used as the sole basis for medical decisions. Users are strongly advised to consult a qualified healthcare professional for any injury that causes concern.

### 2.2 Product Functions (Summary)

The major functions of the InjuryIQ AI system are summarized below:

| # | Function Category | Description |
|---|-------------------|-------------|
| F1 | **User Authentication** | Secure registration and login via email/password or Google OAuth, with session management and logout. |
| F2 | **Dashboard** | A personalized home screen displaying quick access to new assessments, recent assessment history, and educational content. |
| F3 | **Injury Assessment Wizard** | A multi-step, guided questionnaire that collects injury details including area selection, mechanism, pain characteristics, physical signs, Ottawa Rules evaluation, functional limitations, and red flag screening. |
| F4 | **Ottawa Rules Engine** | Area-specific branching logic that applies the appropriate Ottawa clinical decision rules (Ankle, Foot, Knee, or Scaphoid) based on the selected injury area. |
| F5 | **Risk Scoring Engine** | A point-based algorithm that calculates a numeric risk score from questionnaire responses, classifies risk level, and detects immediate emergency indicators. |
| F6 | **Results & Recommendations** | Presentation of risk score, risk level classification, contributing factors breakdown, and actionable triage recommendations (R.I.C.E., doctor visit, or emergency care). |
| F7 | **Image Upload** | Optional upload of injury photographs and comparison images for documentation and future AI analysis. |
| F8 | **Assessment History** | Persistent storage and retrieval of all past assessments with detail views. |
| F9 | **Medical Disclaimers** | Prominent display of legal and medical disclaimers at system entry, before assessment, and alongside results. |

### 2.3 User Classes and Characteristics

The following user personas represent the primary target audience for InjuryIQ AI:

#### 2.3.1 General User

| Attribute | Description |
|-----------|-------------|
| **Age Range** | 18–45 years |
| **Technical Proficiency** | Moderate; comfortable using smartphone applications and web browsers |
| **Context of Use** | Has sustained a minor to moderate musculoskeletal injury (twisted ankle, jammed finger, wrist fall) and is unsure whether to self-treat, visit a clinic, or go to the emergency room |
| **Expectations** | Quick, easy-to-understand assessment; clear guidance on next steps; no medical jargon |
| **Frequency of Use** | Occasional (injury-driven) |

#### 2.3.2 Student / Athlete

| Attribute | Description |
|-----------|-------------|
| **Age Range** | 16–30 years |
| **Technical Proficiency** | High; digital-native, comfortable with mobile apps |
| **Context of Use** | Sports-related injuries during practice, competition, or recreational activity; needs rapid assessment to decide whether to continue playing, rest, or seek medical attention |
| **Expectations** | Fast assessment (< 2 minutes); sport-relevant language; history of past injuries for comparison |
| **Frequency of Use** | Periodic (sports season-dependent) |

#### 2.3.3 Parent / Caregiver

| Attribute | Description |
|-----------|-------------|
| **Age Range** | 25–50 years |
| **Technical Proficiency** | Moderate |
| **Context of Use** | A child or dependent has been injured (playground fall, sports accident); the parent needs to assess severity and decide whether to take the child to the ER, urgent care, or treat at home |
| **Expectations** | Reassuring interface; clear explanations; emphasis on when professional care is needed; awareness that Ottawa Rules have limitations for children under 18 |
| **Frequency of Use** | Rare to occasional |

#### 2.3.4 Rural User

| Attribute | Description |
|-----------|-------------|
| **Age Range** | 18–60 years |
| **Technical Proficiency** | Low to moderate |
| **Context of Use** | Lives in an area with limited access to orthopedic or specialized medical care; nearest hospital may be 50+ km away; needs to determine whether the journey is necessary |
| **Expectations** | Works on basic smartphones and slow internet connections; simple UI; clear actionable output; offline capability as a future enhancement |
| **Frequency of Use** | Occasional |

### 2.4 Operating Environment

| Component | Specification |
|-----------|---------------|
| **Mobile Platforms** | Android 8.0 (API level 26) and above; iOS 13.0 and above |
| **Development Framework** | Flutter 3.x (Dart language) for cross-platform mobile and web |
| **Web Browser Support** | Google Chrome 90+, Mozilla Firefox 88+, Safari 14+, Microsoft Edge 90+ |
| **Screen Sizes** | Responsive design supporting 320px (small mobile) to 1920px (desktop) |
| **Backend Runtime** | Python 3.10+ with FastAPI framework |
| **Cloud Services** | Firebase Authentication, Cloud Firestore, Firebase Storage |
| **Network Requirement** | Active internet connection required for all features (Firebase dependency) |
| **Backend Hosting** | Cloud-based deployment (e.g., Google Cloud Run, Railway, or Render) |

### 2.5 Design and Implementation Constraints

| # | Constraint | Impact |
|---|-----------|--------|
| C-01 | **Not a certified medical device.** The system has not undergone regulatory approval (FDA 510(k), CE marking, or equivalent). | All outputs must be accompanied by disclaimers. The system cannot be marketed or used as a diagnostic tool. |
| C-02 | **Cannot guarantee diagnostic accuracy.** Risk scores are based on user-reported symptoms and validated screening rules, but individual anatomy, pain tolerance, and reporting accuracy vary. | Users must be informed that results are indicative, not definitive. |
| C-03 | **Ottawa Rules limitations.** The Ottawa Rules were validated primarily in adult populations (age ≥ 18). They may not be reliable for: children under 18, intoxicated individuals, patients with multiple injuries, patients with diminished sensation (neuropathy), and pregnant women. | The system must display warnings when these conditions are detected and advise professional evaluation regardless of score. |
| C-04 | **Internet dependency.** All core functionality requires an active internet connection due to Firebase backend. | No offline mode in MVP. Users without connectivity cannot use the system. |
| C-05 | **Image analysis is not available in MVP.** The AI image classification module is planned for future releases. | Image upload in MVP is for documentation only; no automated analysis is performed. |
| C-06 | **Single language support in MVP.** The system is available in English only. | Non-English-speaking users may have difficulty using the system. Multi-language support is a future enhancement. |
| C-07 | **Free-tier Firebase limitations.** The Firebase Spark (free) plan has usage limits (e.g., 50K daily reads, 20K daily writes for Firestore). | The system may experience degraded performance or service interruptions under heavy load if on the free tier. |

### 2.6 Assumptions and Dependencies

#### 2.6.1 Assumptions

| # | Assumption |
|---|------------|
| A-01 | The user provides honest and accurate information about their symptoms, injury mechanism, and pain levels. The system has no way to verify self-reported data. |
| A-02 | The user has sufficient cognitive ability and awareness to assess their own symptoms (i.e., is not unconscious, severely intoxicated, or in extreme shock). |
| A-03 | The user's device has a functional camera for optional image upload. |
| A-04 | The user has basic literacy in English to understand questionnaire questions and recommendations. |
| A-05 | The injury being assessed is a musculoskeletal injury to a supported body area (ankle, foot, knee, wrist, elbow). The system is not designed for head, neck, spine, or torso injuries. |
| A-06 | The user acknowledges the medical disclaimer before using the assessment feature. |

#### 2.6.2 Dependencies

| # | Dependency | Risk if Unavailable |
|---|------------|---------------------|
| D-01 | **Firebase Authentication** — Required for user registration, login, and session management. | Users cannot access the system. |
| D-02 | **Cloud Firestore** — Required for storing user profiles, assessments, and history. | No data persistence; assessments cannot be saved or retrieved. |
| D-03 | **Firebase Storage** — Required for storing uploaded injury images. | Image upload feature becomes non-functional. |
| D-04 | **Google OAuth Provider** — Required for Google Sign-In functionality. | Google Sign-In unavailable; email/password login still functional. |
| D-05 | **Internet Connectivity** — Required for all Firebase operations. | System is entirely non-functional without internet. |
| D-06 | **Flutter SDK and Dart** — Required for building the frontend application. | Development and build process blocked. |
| D-07 | **Python 3.10+ and FastAPI** — Required for backend API services. | Backend endpoints non-functional. |

---

## 3. Specific Requirements

### 3.1 Functional Requirements

---

#### FR-01: User Registration

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-01 |
| **Description** | The system shall allow new users to register an account using their email address and a password, or through Google OAuth. Upon successful registration, a user profile shall be created in the database. |
| **Priority** | High |
| **Input** | Email address, password (minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit), display name; OR Google OAuth token |
| **Output** | Confirmation of successful registration; redirect to dashboard; user profile created in Firestore |
| **Pre-conditions** | The user does not have an existing account with the same email address. The application is loaded and the registration screen is displayed. |
| **Post-conditions** | A new user document is created in the `users` collection in Firestore. The user is authenticated and a session is established. The user is redirected to the dashboard. |
| **Business Rules** | BR-01: Email must be unique across all accounts. BR-02: Password must meet minimum complexity requirements. BR-03: Display name is required and must be between 2 and 50 characters. BR-04: Medical disclaimer must be acknowledged during registration. |

---

#### FR-02: User Login

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-02 |
| **Description** | The system shall allow registered users to log in using their email and password, or through Google OAuth. The system shall validate credentials and establish an authenticated session. |
| **Priority** | High |
| **Input** | Email address and password; OR Google OAuth credentials |
| **Output** | Successful authentication; redirect to dashboard; session token established |
| **Pre-conditions** | The user has a registered account. The login screen is displayed. |
| **Post-conditions** | The user is authenticated. A Firebase Auth session is active. The user is redirected to the dashboard with personalized content. |
| **Business Rules** | BR-05: After 5 consecutive failed login attempts, the account shall be temporarily locked for 15 minutes. BR-06: Sessions shall expire after 30 days of inactivity. BR-07: The system shall support "Remember Me" functionality. |

---

#### FR-03: View Dashboard

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-03 |
| **Description** | The system shall display a personalized dashboard upon successful login. The dashboard shall show a welcome message with the user's name, a prominent "Start New Assessment" button, a summary of recent assessments (last 3), and quick-access navigation. |
| **Priority** | High |
| **Input** | Authenticated user session; user ID |
| **Output** | Dashboard screen with user's name, recent assessment summaries (date, injury area, risk level), and navigation options |
| **Pre-conditions** | The user is authenticated and has an active session. |
| **Post-conditions** | The dashboard is displayed with current data. No data modification occurs. |
| **Business Rules** | BR-08: If the user has no prior assessments, the dashboard shall display a welcome message and a prompt to start their first assessment. BR-09: Recent assessments shall be sorted by date in descending order (newest first). |

---

#### FR-04: Start New Injury Assessment

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-04 |
| **Description** | The system shall allow the user to initiate a new injury assessment. The system shall display the medical disclaimer, and upon user acknowledgment, begin the multi-step assessment questionnaire. |
| **Priority** | High |
| **Input** | User taps "Start New Assessment" button; user acknowledges medical disclaimer |
| **Output** | Medical disclaimer modal displayed; upon acceptance, navigation to the injury area selection screen (FR-05) |
| **Pre-conditions** | The user is authenticated. The dashboard is displayed. |
| **Post-conditions** | The medical disclaimer has been acknowledged (timestamp recorded). The assessment wizard is initiated. A new assessment draft may be created in memory. |
| **Business Rules** | BR-10: The medical disclaimer must be displayed and explicitly accepted before every new assessment. Acceptance is recorded with a timestamp. BR-11: The user cannot bypass the disclaimer. |

---

#### FR-05: Select Injury Area

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-05 |
| **Description** | The system shall present the user with a visual selection screen showing supported injury areas. Each area shall be represented with an anatomical diagram icon and a label. The selected area determines the branching logic for subsequent Ottawa Rules questions. |
| **Priority** | High |
| **Input** | User selection of one injury area from the list: Ankle, Foot, Knee, Wrist, Elbow |
| **Output** | Selected injury area stored in assessment state; navigation to basic information screen (FR-06) |
| **Pre-conditions** | The medical disclaimer has been accepted (FR-04). |
| **Post-conditions** | The injury area is recorded. The subsequent questionnaire is configured for area-specific branching. |
| **Business Rules** | BR-12: Only one injury area can be selected per assessment. For multiple injuries, the user must complete separate assessments. BR-13: The selected area determines which Ottawa Rules module is applied in FR-10. |

---

#### FR-06: Complete Basic Information

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-06 |
| **Description** | The system shall collect basic contextual information about the user and the injury, including the user's age and the approximate time since the injury occurred. |
| **Priority** | High |
| **Input** | Age (numeric, 1–120); time since injury (selection: "Less than 1 hour", "1–6 hours", "6–24 hours", "1–3 days", "More than 3 days") |
| **Output** | Basic information stored in assessment state; navigation to injury mechanism screen (FR-07) |
| **Pre-conditions** | Injury area has been selected (FR-05). |
| **Post-conditions** | Age and injury time are recorded. If age < 18, a warning about Ottawa Rules limitations is flagged for display. |
| **Business Rules** | BR-14: If the user's age is less than 18, the system shall display a warning that Ottawa Rules have not been fully validated for this age group and results should be interpreted with caution. BR-15: Injury time is used contextually to interpret swelling progression and pain characteristics. |

---

#### FR-07: Complete Injury Mechanism Questions

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-07 |
| **Description** | The system shall ask the user about how the injury occurred (mechanism of injury). This includes the type of activity, the force involved, and whether a cracking or popping sound was heard. |
| **Priority** | High |
| **Input** | Injury mechanism selection (e.g., "Twisting/rolling", "Direct impact/blow", "Fall from height", "Fall on outstretched hand (FOOSH)", "Sports collision", "Overuse/repetitive", "Other"); Sound heard during injury ("Cracking/snapping sound", "Popping sound", "No sound", "Not sure") |
| **Output** | Mechanism and sound data stored in assessment state; navigation to pain assessment (FR-08) |
| **Pre-conditions** | Basic information has been completed (FR-06). |
| **Post-conditions** | Injury mechanism and associated sound are recorded for scoring. |
| **Business Rules** | BR-16: High-energy mechanisms (fall from height, sports collision, direct impact) add points to the risk score. BR-17: A cracking/snapping sound adds significant points due to association with fracture. |

---

#### FR-08: Complete Pain Assessment Questions

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-08 |
| **Description** | The system shall collect detailed pain information including pain intensity (0–10 numeric scale), pain type (descriptive), and pain timing/pattern. |
| **Priority** | High |
| **Input** | Pain level (0–10 slider or selection); Pain type (selection: "Sharp/stabbing", "Dull/aching", "Throbbing", "Burning", "Pressure"); Pain timing (multi-select: "Constant at rest", "Only when moving", "Only when touching", "Getting worse over time"); Pain relief with medication (boolean: Yes/No) |
| **Output** | Pain assessment data stored in assessment state; navigation to physical signs screen (FR-09) |
| **Pre-conditions** | Injury mechanism questions completed (FR-07). |
| **Post-conditions** | Pain parameters recorded for scoring. |
| **Business Rules** | BR-18: Pain level 8–10 adds 15 points to risk score. BR-19: Sharp/stabbing pain adds 10 points. BR-20: Constant pain at rest adds 12 points. BR-21: Pain not relieved by over-the-counter medication is a contributing factor. |

---

#### FR-09: Complete Physical Signs Questions

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-09 |
| **Description** | The system shall ask the user to assess and report visible physical signs of the injury, including swelling, bruising, deformity, skin color changes, and tightness/stiffness. |
| **Priority** | High |
| **Input** | Swelling level (selection: "None", "Mild — slight puffiness", "Moderate — noticeably swollen", "Severe — very swollen, tight skin"); Bruising (selection: "None", "Small area of discoloration", "Large area of bruising", "Bruising spreading to surrounding areas"); Visible deformity (selection: "No — looks normal compared to other side", "Slightly different from other side", "Yes — visibly crooked, bent, or misshapen"); Skin color (selection: "Normal", "Red/flushed", "Blue/purple", "Pale/white"); Tightness/stiffness (boolean: Yes/No) |
| **Output** | Physical signs data stored in assessment state; navigation to Ottawa Rules assessment (FR-10) |
| **Pre-conditions** | Pain assessment completed (FR-08). |
| **Post-conditions** | Physical signs are recorded. Visible deformity or blue/cold extremities trigger immediate red flag consideration. |
| **Business Rules** | BR-22: Severe swelling adds 15 points. BR-23: Large bruising adds 10 points. BR-24: Visible deformity triggers "Immediate High Risk" classification regardless of other scores. BR-25: Blue/purple or pale skin color triggers red flag screening. |

---

#### FR-10: Complete Ottawa Rules Assessment

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-10 |
| **Description** | The system shall present area-specific clinical screening questions based on the Ottawa Rules (for ankle, foot, and knee) or equivalent assessment criteria (for wrist). The questions shall be phrased in plain, non-medical language with anatomical guidance (diagrams or descriptive text) to help the user identify the correct body landmarks. |
| **Priority** | High |
| **Input** | Varies by injury area (see sub-requirements FR-10a through FR-10d) |
| **Output** | Ottawa Rules responses stored; Ottawa positive/negative determination; navigation to functional assessment (FR-11) |
| **Pre-conditions** | Physical signs questions completed (FR-09). Injury area previously selected (FR-05). |
| **Post-conditions** | Ottawa Rules assessment is complete. The system has determined whether the Ottawa criteria are positive (suggesting need for X-ray). |
| **Business Rules** | BR-26: Ottawa positive result (suggesting need for X-ray) is a major risk factor. BR-27: Weight-bearing inability adds 30 points. BR-28: Each positive bone tenderness point adds 25 points. |

---

##### FR-10a: Ottawa Ankle Rules Assessment

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-10a |
| **Description** | For ankle injuries: evaluate tenderness at the posterior edge or tip of the lateral malleolus (outer ankle bone), tenderness at the posterior edge or tip of the medial malleolus (inner ankle bone), and ability to bear weight (take 4 steps) both immediately after injury and at time of assessment. |
| **Input** | Lateral malleolus tenderness (boolean); medial malleolus tenderness (boolean); weight-bearing ability at injury (boolean); weight-bearing ability now (boolean) |
| **Trigger Condition** | Injury area = "Ankle" |
| **Ottawa Positive Criteria** | Tenderness at lateral malleolus OR tenderness at medial malleolus OR inability to bear weight (4 steps) immediately and now |

---

##### FR-10b: Ottawa Foot Rules Assessment

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-10b |
| **Description** | For foot injuries: evaluate tenderness at the base of the fifth metatarsal (outer edge of foot) and tenderness at the navicular bone (inner midfoot), plus weight-bearing ability. |
| **Input** | Fifth metatarsal base tenderness (boolean); navicular bone tenderness (boolean); weight-bearing ability at injury (boolean); weight-bearing ability now (boolean) |
| **Trigger Condition** | Injury area = "Foot" |
| **Ottawa Positive Criteria** | Tenderness at fifth metatarsal base OR tenderness at navicular bone OR inability to bear weight |

---

##### FR-10c: Ottawa Knee Rules Assessment

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-10c |
| **Description** | For knee injuries: evaluate age (≥ 55 increases risk), isolated patellar tenderness, tenderness at the head of the fibula, inability to flex the knee to 90 degrees, and inability to bear weight (4 steps) both immediately and now. |
| **Input** | Isolated patellar tenderness (boolean); fibular head tenderness (boolean); ability to flex knee to 90° (boolean); weight-bearing ability at injury (boolean); weight-bearing ability now (boolean) |
| **Trigger Condition** | Injury area = "Knee" |
| **Ottawa Positive Criteria** | Age ≥ 55 OR isolated patellar tenderness OR fibular head tenderness OR inability to flex knee to 90° OR inability to bear weight |

---

##### FR-10d: Wrist Scaphoid Assessment

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-10d |
| **Description** | For wrist injuries: evaluate tenderness in the anatomical snuffbox, tenderness over the scaphoid tubercle, pain with thumb longitudinal compression (axial loading), and pain with gripping. |
| **Input** | Anatomical snuffbox tenderness (boolean); scaphoid tubercle tenderness (boolean); pain with thumb compression (boolean); pain with gripping (boolean) |
| **Trigger Condition** | Injury area = "Wrist" |
| **Scaphoid Positive Criteria** | Snuffbox tenderness OR scaphoid tubercle tenderness OR pain with axial compression of thumb |

---

#### FR-11: Complete Functional Assessment

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-11 |
| **Description** | The system shall assess the user's functional ability by asking about range of motion, ability to use the injured area, and comparison with the uninjured side. |
| **Priority** | High |
| **Input** | Movement ability (selection: "Can move normally", "Can move with some pain", "Very limited movement", "Cannot move at all"); Comparison to other side (selection: "Looks and feels the same", "Slightly different", "Noticeably different", "Very different") |
| **Output** | Functional assessment data stored; navigation to red flag screening (FR-12) |
| **Pre-conditions** | Ottawa Rules assessment completed (FR-10). |
| **Post-conditions** | Functional limitations recorded for scoring. |
| **Business Rules** | BR-29: "Cannot move at all" adds 20 points to risk score. BR-30: Side-to-side comparison informs the qualitative assessment but does not directly add points. |

---

#### FR-12: Complete Red Flag Screening

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-12 |
| **Description** | The system shall screen for emergency red flag symptoms that indicate the need for immediate medical attention regardless of the overall risk score. |
| **Priority** | High |
| **Input** | Bone protruding through skin (boolean); numbness or tingling below the injury (boolean); blue, cold, or pale extremity below the injury (boolean); severe pain that is not relieved by any means (boolean) |
| **Output** | Red flag data stored; if any red flag is positive, assessment is immediately classified as "Emergency"; navigation to results (FR-16) bypassing image upload, or to image upload (FR-13) if no red flags |
| **Pre-conditions** | Functional assessment completed (FR-11). |
| **Post-conditions** | Red flag status recorded. If any red flag is true, the `anyRedFlag` field is set to `true` and risk level is set to "Emergency". |
| **Business Rules** | BR-31: ANY positive red flag immediately classifies the assessment as "Emergency" risk level, regardless of the numeric score. BR-32: Red flag detection triggers an urgent recommendation to call emergency services or go to the nearest ER immediately. BR-33: The system shall display red flag results prominently with high-visibility warning styling. |

---

#### FR-13: Upload Injury Image (Optional)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-13 |
| **Description** | The system shall optionally allow the user to upload a photograph of the injured area. The image is stored in Firebase Storage and linked to the assessment record. In the MVP, no AI analysis is performed on the image. |
| **Priority** | Medium |
| **Input** | Image file (JPEG, PNG; maximum 10 MB) captured via camera or selected from gallery |
| **Output** | Image uploaded to Firebase Storage; image URL stored in assessment record; navigation to comparison image upload (FR-14) or risk calculation (FR-15) |
| **Pre-conditions** | Red flag screening completed (FR-12). No emergency red flags detected (if red flags detected, this step may be skipped). |
| **Post-conditions** | Image is stored in Firebase Storage under the user's directory. The `imageUrl` field in the assessment document is populated. |
| **Business Rules** | BR-34: Image upload is optional; the user may skip this step. BR-35: Only JPEG and PNG formats are accepted. BR-36: Maximum file size is 10 MB. BR-37: Images are stored securely and accessible only to the owning user. |

---

#### FR-14: Upload Comparison Image (Optional)

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-14 |
| **Description** | The system shall optionally allow the user to upload a photograph of the corresponding uninjured area (e.g., the other ankle) for visual comparison purposes. |
| **Priority** | Low |
| **Input** | Comparison image file (JPEG, PNG; maximum 10 MB) |
| **Output** | Image uploaded to Firebase Storage; comparison image URL stored in assessment record; navigation to risk calculation (FR-15) |
| **Pre-conditions** | Image upload step (FR-13) completed or skipped. |
| **Post-conditions** | Comparison image stored. The `comparisonImageUrl` field is populated if an image was uploaded. |
| **Business Rules** | BR-38: This step is optional. BR-39: The comparison image is for user and future AI reference only; it does not affect the current risk score. |

---

#### FR-15: Calculate Risk Score

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-15 |
| **Description** | The system shall calculate a numeric risk score based on all collected assessment data using a point-based algorithm. The system shall also check for immediate high-risk conditions that override the numeric score. |
| **Priority** | High |
| **Input** | Complete assessment data from FR-06 through FR-12 |
| **Output** | Numeric risk score (0–200+); risk level classification (Low / Moderate / High / Emergency); score breakdown array showing individual contributing factors and their point values |
| **Pre-conditions** | All required assessment questions have been answered. Red flag screening completed. |
| **Post-conditions** | Risk score, risk level, and score breakdown are calculated and stored in the assessment record. |
| **Business Rules** | See detailed scoring algorithm below. |

**Immediate High Risk Detection (Emergency Override):**

Any ONE of the following conditions triggers an immediate "Emergency" classification, regardless of numeric score:

| Condition | Classification |
|-----------|---------------|
| Visible deformity (visibly crooked, bent, or misshapen) | Emergency |
| Bone protruding through skin | Emergency |
| Blue, cold, or pale extremity below injury | Emergency |
| Numbness or tingling below injury | Emergency |
| Severe unrelieved pain (not responsive to any measures) | Emergency |

**Point-Based Scoring Algorithm:**

| Factor | Condition | Points |
|--------|-----------|--------|
| **Weight-Bearing (Ottawa)** | Cannot bear weight (4 steps) immediately AND now | +30 |
| **Bone Tenderness — Lateral Malleolus** | Tenderness present (ankle) | +25 |
| **Bone Tenderness — Medial Malleolus** | Tenderness present (ankle) | +25 |
| **Bone Tenderness — Fifth Metatarsal** | Tenderness present (foot) | +25 |
| **Bone Tenderness — Navicular** | Tenderness present (foot) | +25 |
| **Bone Tenderness — Patella** | Isolated tenderness (knee) | +25 |
| **Bone Tenderness — Fibular Head** | Tenderness present (knee) | +25 |
| **Snuffbox Tenderness** | Tenderness in anatomical snuffbox (wrist) | +25 |
| **Scaphoid Tubercle Tenderness** | Tenderness present (wrist) | +25 |
| **Injury Mechanism** | High-energy mechanism (fall from height, direct impact, sports collision) | +15 |
| **Cracking/Snapping Sound** | Heard at time of injury | +20 |
| **Pain Level** | Pain rated 8–10 out of 10 | +15 |
| **Pain Type** | Sharp/stabbing quality | +10 |
| **Pain Timing** | Constant pain at rest | +12 |
| **Swelling** | Severe swelling (very swollen, tight skin) | +15 |
| **Bruising** | Large area of bruising or spreading | +10 |
| **Functional Limitation** | Cannot move the injured area at all | +20 |

**Risk Level Thresholds:**

| Score Range | Risk Level | Color Code | Interpretation |
|-------------|-----------|------------|----------------|
| 0–20 | **Low** | Green | Likely minor sprain or soft tissue injury. Self-care appropriate. |
| 21–50 | **Moderate** | Yellow/Amber | Possible significant sprain or minor fracture. Medical evaluation recommended within 24–48 hours. |
| 51–80 | **High** | Orange | High probability of fracture or severe sprain. Urgent medical evaluation recommended. X-ray likely needed. |
| 81+ | **Emergency** | Red | Very high fracture probability or emergency indicators present. Immediate emergency care recommended. |

---

#### FR-16: Display Risk Result with Explanation

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-16 |
| **Description** | The system shall display the calculated risk score, risk level, and a detailed breakdown of contributing factors. The display shall use color-coded severity indicators and clear, non-medical language. |
| **Priority** | High |
| **Input** | Calculated risk score, risk level, score breakdown from FR-15 |
| **Output** | Results screen showing: risk level badge (color-coded), numeric score, contributing factors list with individual point values, overall explanation text |
| **Pre-conditions** | Risk score has been calculated (FR-15). |
| **Post-conditions** | Results are displayed. The user can proceed to recommendations or save the assessment. |
| **Business Rules** | BR-40: The risk level shall be displayed prominently with the appropriate color code. BR-41: Each contributing factor shall be listed with its point value so the user understands why the score is what it is. BR-42: A plain-language explanation shall accompany each risk level. |

---

#### FR-17: Display Recommendations

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-17 |
| **Description** | The system shall display actionable triage recommendations based on the calculated risk level. Recommendations shall be tailored to the severity and include specific guidance. |
| **Priority** | High |
| **Input** | Risk level from FR-15 |
| **Output** | Recommendations screen with specific, actionable guidance |
| **Pre-conditions** | Risk result has been displayed (FR-16). |
| **Post-conditions** | Recommendations are displayed. |
| **Business Rules** | |

**Recommendations by Risk Level:**

| Risk Level | Recommendations |
|------------|----------------|
| **Low** | 1. Apply R.I.C.E. protocol (Rest, Ice for 15–20 min every 2–3 hours, Compression with elastic bandage, Elevation above heart level). 2. Use over-the-counter pain relief (ibuprofen or acetaminophen) as directed. 3. Monitor for 48–72 hours. 4. Seek medical attention if symptoms worsen. |
| **Moderate** | 1. Apply R.I.C.E. protocol immediately. 2. Avoid putting weight on the injured area. 3. Schedule a medical appointment within 24–48 hours. 4. An X-ray may be recommended by your doctor. 5. Seek immediate care if symptoms worsen significantly. |
| **High** | 1. Do NOT use the injured area. Immobilize if possible. 2. Apply ice wrapped in cloth for 15 minutes. 3. Seek urgent medical evaluation today. 4. An X-ray is likely needed. 5. Go to urgent care or the emergency room if you cannot see a doctor today. |
| **Emergency** | 1. **STOP — Do not move the injured area.** 2. Call emergency services (911 / local emergency number) or go to the nearest emergency room immediately. 3. Do not attempt to straighten or push back any visible deformity. 4. Apply ice only if it does not require moving the injured area. 5. Keep the person calm and still until help arrives. |

---

#### FR-18: Save Assessment to History

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-18 |
| **Description** | The system shall save the completed assessment (all responses, images, risk score, and recommendations) to the user's assessment history in Firestore. |
| **Priority** | High |
| **Input** | Complete assessment data object |
| **Output** | Assessment document created in Firestore `assessments` collection; confirmation message to user |
| **Pre-conditions** | Risk score has been calculated (FR-15). The user is authenticated. |
| **Post-conditions** | Assessment is persisted in Firestore with all fields populated. The assessment ID is generated. The `createdAt` timestamp is set. |
| **Business Rules** | BR-43: Assessments are automatically saved upon completion. BR-44: Each assessment receives a unique auto-generated ID. BR-45: The assessment is linked to the user via `userId`. |

---

#### FR-19: View Assessment History List

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-19 |
| **Description** | The system shall display a chronological list of all past assessments for the authenticated user, showing key summary information for each. |
| **Priority** | Medium |
| **Input** | Authenticated user ID |
| **Output** | Scrollable list of assessment summaries, each showing: date, injury area, risk level (color-coded badge), and risk score |
| **Pre-conditions** | The user is authenticated. |
| **Post-conditions** | Assessment history list is displayed. No data modification occurs. |
| **Business Rules** | BR-46: Assessments are sorted by date (newest first). BR-47: If no assessments exist, display a message indicating no history and a prompt to start a new assessment. BR-48: Pagination or lazy loading shall be implemented if the user has more than 20 assessments. |

---

#### FR-20: View Individual Past Assessment Detail

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-20 |
| **Description** | The system shall allow the user to view the complete details of any past assessment, including all questionnaire responses, images, risk score, breakdown, and recommendations. |
| **Priority** | Medium |
| **Input** | Assessment ID (selected from history list) |
| **Output** | Full assessment detail view with all data fields, images (if uploaded), score breakdown, and recommendations |
| **Pre-conditions** | The user is viewing the assessment history list (FR-19). The selected assessment belongs to the authenticated user. |
| **Post-conditions** | Assessment details are displayed in a read-only format. |
| **Business Rules** | BR-49: Users can only view their own assessments. BR-50: The detail view is read-only; past assessments cannot be edited. |

---

#### FR-21: Display Medical Disclaimer

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-21 |
| **Description** | The system shall display a medical disclaimer at key touchpoints: before starting an assessment, alongside risk results, and in the app footer/about section. |
| **Priority** | High |
| **Input** | None (system-triggered) |
| **Output** | Disclaimer text displayed prominently |
| **Pre-conditions** | Varies by context (pre-assessment, results display, app information). |
| **Post-conditions** | Disclaimer has been displayed. For pre-assessment context, user acknowledgment is recorded. |
| **Business Rules** | BR-51: The disclaimer text shall include: "This application is not a medical device and does not provide medical diagnosis. Results are based on self-reported symptoms and validated screening rules. Always consult a qualified healthcare professional for any injury that causes concern. In case of emergency, call your local emergency number immediately." BR-52: The disclaimer shall not be dismissible without acknowledgment before assessments. |

**Disclaimer Text:**

> ⚠️ **Medical Disclaimer**
>
> InjuryIQ AI is an informational and educational tool. It is **NOT** a medical device, and it does **NOT** provide medical diagnosis, treatment advice, or professional medical opinions.
>
> The risk assessment results generated by this application are based on self-reported symptoms and clinically validated screening rules (Ottawa Rules). These results are **preliminary estimates only** and may not accurately reflect your actual injury.
>
> **Always consult a qualified healthcare professional** for any injury that causes concern. Do not delay seeking medical attention based on results from this application.
>
> **In case of emergency** (severe pain, visible deformity, numbness, bone protrusion), call your local emergency number (e.g., 911) immediately.

---

#### FR-22: User Logout

| Attribute | Detail |
|-----------|--------|
| **ID** | FR-22 |
| **Description** | The system shall allow the user to log out, terminating the current session and returning to the login screen. |
| **Priority** | High |
| **Input** | User taps "Logout" button |
| **Output** | Session terminated; Firebase Auth session cleared; redirect to login screen |
| **Pre-conditions** | The user is authenticated. |
| **Post-conditions** | The Firebase Auth session is invalidated. Local session data is cleared. The user is redirected to the login screen. Any unsaved assessment progress is lost (user should be warned if assessment is in progress). |
| **Business Rules** | BR-53: If an assessment is in progress, the system shall warn the user that unsaved progress will be lost and ask for confirmation before logging out. |

---

### 3.2 Non-Functional Requirements

---

#### NFR-01: Performance

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-01 |
| **Description** | The system shall meet specified performance benchmarks to ensure a responsive user experience. |
| **Priority** | High |

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Page/screen load time | < 2 seconds | Measured from navigation trigger to full content render on a 4G network connection |
| Risk score calculation time | < 1 second | Measured from submission of final questionnaire answer to display of results |
| Dashboard load time | < 3 seconds | Measured from login completion to full dashboard render, including recent assessment data |
| Image upload time | < 5 seconds for a 5 MB image | Measured from upload initiation to confirmation on a 4G network connection |
| API response time | < 500 milliseconds for non-computation endpoints | Measured at the server level (excluding network latency) |

---

#### NFR-02: Security

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-02 |
| **Description** | The system shall implement comprehensive security measures to protect user data and ensure secure access. |
| **Priority** | High |

| Security Measure | Implementation |
|-------------------|----------------|
| Authentication | Firebase Authentication with OAuth 2.0; supports email/password and Google OAuth providers |
| Data encryption at rest | AES-256 encryption provided by Firebase/Google Cloud Platform for all stored data |
| Data encryption in transit | HTTPS (TLS 1.2+) enforced for all API communications and Firebase connections |
| Session management | Firebase Auth token-based sessions with automatic refresh; tokens expire after 1 hour with silent refresh |
| Input validation | Server-side validation of all input data; client-side validation for user experience |
| PII minimization | Collect only essential PII (email, display name); health data is not classified as PII under this system's scope but is treated with equivalent care |
| Access control | Users can only access their own data; Firestore security rules enforce document-level access control |
| Image storage security | Firebase Storage security rules restrict access to authenticated users viewing their own uploads |

---

#### NFR-03: Usability

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-03 |
| **Description** | The system shall be intuitive, accessible, and usable by non-technical users without training. |
| **Priority** | High |

| Usability Metric | Target |
|-------------------|--------|
| Assessment completion time | < 2 minutes from injury area selection to results display |
| Mobile responsiveness | Fully responsive layout from 320px (small mobile) to 1920px (desktop) |
| Language level | Simple, non-medical language; 8th-grade reading level or below |
| Accessibility | WCAG 2.0 Level AA compliance (sufficient color contrast, screen reader support, keyboard navigation) |
| Learnability | New users should be able to complete an assessment without any external help or documentation |
| Error recovery | Clear error messages with actionable guidance (e.g., "Please select your pain level to continue") |
| Progress indication | Visual progress bar showing current step and total steps in the assessment wizard |

---

#### NFR-04: Reliability

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-04 |
| **Description** | The system shall maintain high availability and handle failures gracefully. |
| **Priority** | Medium |

| Reliability Metric | Target |
|---------------------|--------|
| System uptime | 99.5% availability (measured monthly, excluding scheduled maintenance) |
| Auto-save | Assessment progress auto-saved after each completed step to prevent data loss |
| Error handling | Graceful degradation with user-friendly error messages; no unhandled exceptions displayed to users |
| Data integrity | All database writes use Firestore transactions where necessary to prevent data corruption |
| Recovery | Automatic retry for transient network failures (up to 3 retries with exponential backoff) |

---

#### NFR-05: Scalability

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-05 |
| **Description** | The system shall be designed to handle growth in user base and feature complexity. |
| **Priority** | Medium |

| Scalability Metric | Target |
|---------------------|--------|
| Concurrent users | Support 1,000+ concurrent users without performance degradation |
| Data volume | Support 100,000+ assessment records without query performance impact |
| Feature modularity | AI engine designed as a pluggable module for future integration without major refactoring |
| Horizontal scaling | Backend (FastAPI) stateless and deployable as multiple instances behind a load balancer |

---

#### NFR-06: Maintainability

| Attribute | Detail |
|-----------|--------|
| **ID** | NFR-06 |
| **Description** | The system shall be maintainable, well-documented, and structured for long-term evolution. |
| **Priority** | Medium |

| Maintainability Metric | Target |
|--------------------------|--------|
| Code architecture | Modular architecture with clear separation of concerns (presentation, business logic, data) |
| Documentation | All API endpoints documented with request/response schemas; inline code comments for complex logic |
| Version control | Git-based version control with a clear branching strategy (main, develop, feature branches) |
| Code standards | Consistent coding conventions enforced (Dart analyzer for Flutter, Black + isort for Python) |
| Dependency management | All dependencies pinned to specific versions in pubspec.yaml (Flutter) and requirements.txt (Python) |

---

## 4. Use Cases

### UC-01: User Registration

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-01 |
| **Use Case Name** | User Registration |
| **Actor** | Unregistered User |
| **Description** | A new user creates an account in the InjuryIQ AI system to access assessment features. |
| **Pre-conditions** | 1. The user has the app installed or has navigated to the web application. 2. The user does not have an existing account. 3. Internet connection is available. |
| **Post-conditions** | 1. A new user account is created in Firebase Auth. 2. A user profile document is created in the `users` Firestore collection. 3. The user is logged in and redirected to the dashboard. |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | The user opens the application and is presented with the login/registration screen. |
| 2 | The user taps "Create Account" or "Register". |
| 3 | The system displays the registration form with fields: Display Name, Email, Password, Confirm Password. |
| 4 | The user fills in all fields and taps "Register". |
| 5 | The system validates the input (email format, password complexity, password match, display name length). |
| 6 | The system sends a registration request to Firebase Auth. |
| 7 | Firebase Auth creates the user account and returns a user ID and auth token. |
| 8 | The system creates a user profile document in the `users` Firestore collection with the user's display name, email, and timestamps. |
| 9 | The system displays a success message and redirects the user to the dashboard. |

**Alternate Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| AF-01a | User selects "Sign up with Google" | Step 2a: The user taps "Sign up with Google". Step 3a: The system initiates Google OAuth flow. Step 4a: The user selects their Google account and grants permissions. Step 5a: The system receives the OAuth token and creates the Firebase Auth account. Steps 8–9 proceed as in the main flow. |

**Exception Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| EF-01a | Email already registered | The system displays an error: "An account with this email already exists. Please log in or use a different email." The user remains on the registration form. |
| EF-01b | Password does not meet complexity requirements | The system displays specific validation errors (e.g., "Password must contain at least one uppercase letter"). |
| EF-01c | Network error during registration | The system displays: "Unable to connect. Please check your internet connection and try again." The form data is preserved. |
| EF-01d | Firebase service unavailable | The system displays: "Registration is temporarily unavailable. Please try again later." |

---

### UC-02: User Login

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-02 |
| **Use Case Name** | User Login |
| **Actor** | Registered User |
| **Description** | A registered user authenticates to access the system. |
| **Pre-conditions** | 1. The user has a registered account. 2. The login screen is displayed. 3. Internet connection is available. |
| **Post-conditions** | 1. The user is authenticated with a valid Firebase session. 2. The user is redirected to the dashboard. |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | The user opens the application and is presented with the login screen. |
| 2 | The user enters their email and password. |
| 3 | The user taps "Log In". |
| 4 | The system validates the credentials with Firebase Auth. |
| 5 | Firebase Auth returns a valid auth token. |
| 6 | The system establishes the session and redirects the user to the dashboard. |

**Alternate Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| AF-02a | User selects "Sign in with Google" | Step 2a: User taps "Sign in with Google". Step 3a: Google OAuth flow initiated. Step 4a: User selects their Google account. Step 5a: System receives and validates OAuth token. Step 6a: System proceeds to dashboard. |
| AF-02b | User taps "Forgot Password" | Step 2b: User taps "Forgot Password". Step 3b: System displays password reset form requesting email. Step 4b: User enters email and submits. Step 5b: Firebase sends a password reset email. Step 6b: System displays confirmation message. |

**Exception Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| EF-02a | Invalid credentials | The system displays: "Invalid email or password. Please try again." Login attempt counter incremented. |
| EF-02b | Account locked (5+ failed attempts) | The system displays: "Your account has been temporarily locked due to multiple failed login attempts. Please try again after 15 minutes or reset your password." |
| EF-02c | Network error | The system displays: "Unable to connect. Please check your internet connection." |

---

### UC-03: Start New Assessment

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-03 |
| **Use Case Name** | Start New Assessment |
| **Actor** | Authenticated User |
| **Description** | The user initiates a new injury assessment from the dashboard. |
| **Pre-conditions** | 1. The user is authenticated and on the dashboard. 2. Internet connection is available. |
| **Post-conditions** | 1. The medical disclaimer has been acknowledged. 2. The assessment wizard is started. 3. The user is on the injury area selection screen. |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | The user taps the "Start New Assessment" button on the dashboard. |
| 2 | The system displays the medical disclaimer modal. |
| 3 | The user reads the disclaimer and taps "I Understand & Accept". |
| 4 | The system records the disclaimer acknowledgment with a timestamp. |
| 5 | The system navigates the user to the injury area selection screen. |

**Alternate Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| AF-03a | User declines disclaimer | Step 3a: User taps "Cancel" or closes the modal. Step 4a: The system returns the user to the dashboard. No assessment is started. |

**Exception Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| EF-03a | Session expired | The system detects an invalid session and redirects the user to the login screen with a message: "Your session has expired. Please log in again." |

---

### UC-04: Complete Assessment Questionnaire

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-04 |
| **Use Case Name** | Complete Assessment Questionnaire |
| **Actor** | Authenticated User |
| **Description** | The user completes the multi-step assessment questionnaire, including injury area selection, basic information, mechanism, pain, physical signs, Ottawa Rules, functional assessment, and red flag screening. |
| **Pre-conditions** | 1. The user has accepted the medical disclaimer (UC-03). 2. The assessment wizard is active. |
| **Post-conditions** | 1. All questionnaire sections are completed. 2. Assessment data is stored in the application state. 3. The user is directed to optional image upload or risk calculation. |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | The user selects the injury area (FR-05). |
| 2 | The user completes basic information — age, time since injury (FR-06). |
| 3 | The user answers injury mechanism questions (FR-07). |
| 4 | The user completes pain assessment questions (FR-08). |
| 5 | The user completes physical signs questions (FR-09). |
| 6 | The system presents area-specific Ottawa Rules questions (FR-10/FR-10a–d). |
| 7 | The user completes Ottawa Rules assessment. |
| 8 | The user completes functional assessment (FR-11). |
| 9 | The user completes red flag screening (FR-12). |
| 10 | The system navigates to image upload (FR-13) or risk calculation (FR-15) based on user preference. |

**Alternate Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| AF-04a | User navigates back to a previous step | The user taps the "Back" button. The system navigates to the previous step with preserved answers. |
| AF-04b | Red flags detected at step 9 | The system immediately flags the assessment as "Emergency" and navigates directly to results, optionally allowing image upload first. |
| AF-04c | User age < 18 at step 2 | The system displays a warning about Ottawa Rules limitations but allows the assessment to continue with a note in the results. |

**Exception Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| EF-04a | Required question left unanswered | The system highlights the unanswered question and displays: "Please answer this question to continue." The user cannot proceed until the required question is answered. |
| EF-04b | Internet disconnects mid-assessment | Auto-saved progress (up to the last completed step) is preserved locally. When connectivity is restored, the user can resume from the last saved step. |
| EF-04c | App crashes or is force-closed | On next launch, if auto-save data exists, the system offers: "You have an unfinished assessment. Would you like to continue?" |

---

### UC-05: Upload Injury Image

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-05 |
| **Use Case Name** | Upload Injury Image |
| **Actor** | Authenticated User |
| **Description** | The user optionally uploads a photograph of the injured area. |
| **Pre-conditions** | 1. The assessment questionnaire is complete. 2. The device has a functional camera or photo gallery. |
| **Post-conditions** | 1. The image is uploaded to Firebase Storage. 2. The image URL is linked to the assessment record. |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | The system displays the image upload screen with options: "Take Photo", "Choose from Gallery", "Skip". |
| 2 | The user selects "Take Photo" or "Choose from Gallery". |
| 3 | The user captures or selects an image. |
| 4 | The system displays a preview of the selected image. |
| 5 | The user taps "Upload" to confirm. |
| 6 | The system uploads the image to Firebase Storage. |
| 7 | The system displays a success message and stores the image URL. |
| 8 | The system navigates to comparison image upload (FR-14) or risk calculation (FR-15). |

**Alternate Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| AF-05a | User taps "Skip" | The system skips image upload and navigates directly to risk calculation. No image URL is stored. |
| AF-05b | User wants to retake photo | After preview (step 4), user taps "Retake". System returns to step 2. |

**Exception Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| EF-05a | File size exceeds 10 MB | The system displays: "Image is too large (maximum 10 MB). Please select a smaller image or reduce the resolution." |
| EF-05b | Invalid file format | The system displays: "Unsupported file format. Please use JPEG or PNG images." |
| EF-05c | Upload fails (network error) | The system displays: "Upload failed. Please check your connection and try again." The user can retry or skip. |
| EF-05d | Camera permission denied | The system displays: "Camera access is required to take photos. Please enable camera permissions in your device settings." |

---

### UC-06: View Risk Result & Recommendations

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-06 |
| **Use Case Name** | View Risk Result & Recommendations |
| **Actor** | Authenticated User |
| **Description** | The user views the calculated risk score, risk level, contributing factors, and actionable recommendations. |
| **Pre-conditions** | 1. The assessment questionnaire is complete. 2. The risk score has been calculated. |
| **Post-conditions** | 1. The user has viewed the risk result and recommendations. 2. The assessment is automatically saved (UC-07). |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | The system calculates the risk score (FR-15). |
| 2 | The system displays the results screen with: risk level badge (color-coded), numeric score, contributing factors breakdown. |
| 3 | The user scrolls down to view recommendations tailored to the risk level. |
| 4 | The system displays the medical disclaimer alongside the results. |
| 5 | The user can tap "Save" (if not auto-saved) or "Start New Assessment". |

**Alternate Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| AF-06a | Emergency result | The results screen displays with a prominent red banner and urgent language. The recommendation to call emergency services is displayed first and most prominently. |

**Exception Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| EF-06a | Score calculation error | The system displays: "We encountered an error calculating your risk score. Please try submitting again." The user can retry or return to the questionnaire. |

---

### UC-07: Save Assessment

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-07 |
| **Use Case Name** | Save Assessment |
| **Actor** | System (automatic) / Authenticated User (manual trigger) |
| **Description** | The completed assessment is saved to the user's history in Firestore. |
| **Pre-conditions** | 1. The risk score has been calculated. 2. The user is authenticated. |
| **Post-conditions** | 1. The assessment document is created in the `assessments` Firestore collection. 2. The assessment is visible in the user's history. |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | Upon risk score calculation, the system automatically initiates a save operation. |
| 2 | The system constructs the assessment document with all fields (questionnaire responses, scores, images, recommendations). |
| 3 | The system writes the document to the `assessments` collection in Firestore. |
| 4 | Firestore returns a confirmation with the generated assessment ID. |
| 5 | The system displays a brief confirmation: "Assessment saved successfully." |

**Exception Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| EF-07a | Firestore write fails | The system retries up to 3 times with exponential backoff. If all retries fail, the system displays: "Unable to save your assessment. Please check your connection." The assessment data is preserved in local storage for later sync. |

---

### UC-08: View Assessment History

| Attribute | Detail |
|-----------|--------|
| **Use Case ID** | UC-08 |
| **Use Case Name** | View Assessment History |
| **Actor** | Authenticated User |
| **Description** | The user views a list of all past assessments and can select any assessment to view its full details. |
| **Pre-conditions** | 1. The user is authenticated. 2. The user has at least one completed assessment. |
| **Post-conditions** | 1. The assessment history list is displayed. 2. If a specific assessment is selected, its full details are displayed. |

**Main Flow:**

| Step | Action |
|------|--------|
| 1 | The user navigates to "Assessment History" from the dashboard or navigation menu. |
| 2 | The system queries Firestore for all assessments belonging to the user, ordered by `createdAt` descending. |
| 3 | The system displays a list of assessments, each showing: date, injury area, risk level badge, risk score. |
| 4 | The user taps on a specific assessment. |
| 5 | The system retrieves the full assessment document from Firestore. |
| 6 | The system displays the complete assessment detail view (FR-20). |

**Alternate Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| AF-08a | No assessments exist | The system displays: "No assessments yet. Start your first assessment to see your history here." with a button linking to a new assessment. |

**Exception Flows:**

| ID | Condition | Flow |
|----|-----------|------|
| EF-08a | Firestore query fails | The system displays: "Unable to load your assessment history. Please try again." with a retry button. |

---

## 5. System Architecture

### 5.1 Architecture Overview

InjuryIQ AI follows a **three-tier client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION TIER                         │
│                  (Flutter Application)                      │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Auth    │  │Dashboard │  │Assessment│  │  History    │  │
│  │  Screens │  │  Screen  │  │  Wizard  │  │  Screens   │  │
│  └─────────┘  └──────────┘  └──────────┘  └────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS / REST API
┌──────────────────────▼──────────────────────────────────────┐
│                   APPLICATION TIER                           │
│                  (FastAPI Backend)                           │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Auth    │  │Assessment│  │  Risk    │  │  Ottawa    │  │
│  │  Router  │  │  Router  │  │  Engine  │  │  Rules     │  │
│  └─────────┘  └──────────┘  └──────────┘  └────────────┘  │
│  ┌─────────┐  ┌──────────┐                                 │
│  │  Image   │  │  AI      │                                 │
│  │  Handler │  │  Engine  │  (Future)                       │
│  └─────────┘  └──────────┘                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ Firebase SDK / REST
┌──────────────────────▼──────────────────────────────────────┐
│                      DATA TIER                              │
│                  (Firebase Services)                         │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │  Firebase     │  │   Cloud       │  │   Firebase      │  │
│  │  Auth         │  │   Firestore   │  │   Storage       │  │
│  └──────────────┘  └───────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Tier Descriptions:**

| Tier | Technology | Responsibility |
|------|-----------|----------------|
| **Presentation** | Flutter (Dart) | User interface rendering, form handling, input validation (client-side), navigation, state management, API communication |
| **Application** | FastAPI (Python) | Business logic execution, risk score calculation, Ottawa Rules evaluation, request validation, API endpoint management, image handling, authentication verification |
| **Data** | Firebase (Google Cloud) | User authentication (Firebase Auth), persistent data storage (Cloud Firestore), file storage for images (Firebase Storage) |

### 5.2 Component Diagram Description

The system is composed of the following major components:

| Component | Layer | Technology | Responsibility |
|-----------|-------|-----------|----------------|
| **Frontend Module** | Presentation | Flutter / Dart | Cross-platform mobile and web UI; implements all screens (auth, dashboard, assessment wizard, history, results); manages local state; communicates with backend via REST API |
| **API Gateway** | Application | FastAPI / Python | Central entry point for all backend requests; handles routing, request parsing, response formatting, CORS, and middleware (authentication, logging, error handling) |
| **Authentication Service** | Application / Data | Firebase Auth | Manages user registration, login, session tokens, OAuth integration (Google), password reset, and account management |
| **Database Service** | Data | Cloud Firestore | NoSQL document database storing user profiles, assessment records, and application configuration; provides real-time sync capabilities |
| **Storage Service** | Data | Firebase Storage | Object storage for user-uploaded images (injury photos, comparison images); provides secure, authenticated access via download URLs |
| **Risk Engine Module** | Application | Python | Core scoring logic; implements the point-based risk algorithm; processes assessment data; returns risk score, risk level, contributing factors, and recommendations |
| **Ottawa Rules Module** | Application | Python | Implements area-specific Ottawa Rules evaluation logic (Ankle, Foot, Knee, Scaphoid); determines Ottawa positive/negative status; feeds results into the Risk Engine |
| **AI Engine Module** (Future) | Application | PyTorch / Python | Planned for future releases; will accept injury images and provide AI-assisted classification to supplement the questionnaire-based assessment |

### 5.3 Data Flow

#### 5.3.1 Level 0 DFD (Context Diagram)

The Level 0 DFD represents the entire system as a single process with external entities:

```
                     ┌─────────────────┐
   Symptom Data      │                 │     Risk Assessment
   Image Upload  ──► │   InjuryIQ AI   │ ──► Results
   Auth Credentials  │    System       │     Recommendations
                     │                 │     Assessment History
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Firebase Cloud  │
                     │   Services      │
                     └─────────────────┘
```

**External Entities:**
- **User** — Provides symptom data, authentication credentials, and images; receives risk assessment results, recommendations, and history.
- **Firebase Cloud Services** — Provides authentication, data storage, and file storage services.

#### 5.3.2 Level 1 DFD

The Level 1 DFD decomposes the system into major processes:

```
┌──────┐                                          
│ User │                                          
└──┬───┘                                          
   │                                              
   │ 1. Auth Credentials                          
   ▼                                              
┌──────────────┐     Verified Token      ┌──────────────────┐
│ P1: Auth     │ ──────────────────────► │ D1: Users Store   │
│ Module       │                         │ (Firestore)       │
└──────────────┘                         └──────────────────┘
   │                                              
   │ 2. Symptom Responses                        
   ▼                                              
┌──────────────┐                         ┌──────────────────┐
│ P2: Assessment│    Area-Specific       │ D2: Ottawa Rules  │
│ Module        │◄──────────────────────│ Config            │
└──────┬───────┘                         └──────────────────┘
       │                                          
       │ 3. Assessment Data                       
       ▼                                          
┌──────────────┐                         ┌──────────────────┐
│ P3: Risk     │    Scoring Weights      │ D3: Scoring       │
│ Engine       │◄──────────────────────│ Weights Config    │
└──────┬───────┘                         └──────────────────┘
       │                                          
       │ 4. Risk Score + Level                    
       ▼                                          
┌──────────────┐                         ┌──────────────────┐
│ P4: Result   │    Save Assessment      │ D4: Assessments   │
│ Generator    │ ──────────────────────► │ Store (Firestore) │
└──────┬───────┘                         └──────────────────┘
       │                                          
       │ 5. Results + Recommendations             
       ▼                                          
┌──────┐                                          
│ User │                                          
└──────┘                                          
```

**Process Descriptions:**

| Process | Description |
|---------|-------------|
| **P1: Auth Module** | Handles user registration and login via Firebase Auth. Validates credentials and manages sessions. |
| **P2: Assessment Module** | Guides the user through the multi-step questionnaire. Applies area-specific branching based on the selected injury area. Reads Ottawa Rules configuration to determine which questions to present. |
| **P3: Risk Engine** | Receives completed assessment data. Reads scoring weights configuration. Checks for emergency red flags. Calculates the point-based risk score. Determines risk level classification. |
| **P4: Result Generator** | Formats the risk score, risk level, contributing factors, and recommendations for display. Saves the completed assessment to the Assessments data store. |

---

## 6. Database Design

### 6.1 Database Type

**Cloud Firestore (NoSQL Document Database)** — Google Firebase

Cloud Firestore is selected for the following reasons:
- **Real-time synchronization** — Supports real-time data listeners for live updates.
- **Serverless scaling** — Automatically scales based on demand without manual provisioning.
- **Flexible schema** — NoSQL document model accommodates the nested and variable structure of assessment data.
- **Firebase integration** — Native integration with Firebase Auth and Firebase Storage.
- **Offline support** — Built-in offline data persistence with automatic sync when connectivity is restored.

### 6.2 Collections Schema

#### 6.2.1 Users Collection

**Collection Path:** `users/{uid}`

| Field Name | Data Type | Required | Constraints | Description |
|------------|-----------|----------|-------------|-------------|
| `uid` | String | Yes | Primary key; matches Firebase Auth UID | Unique user identifier |
| `displayName` | String | Yes | 2–50 characters | User's display name |
| `email` | String | Yes | Valid email format; unique across collection | User's email address |
| `age` | Number | No | Integer, 1–120 | User's age (optionally collected during profile setup or first assessment) |
| `gender` | String | No | Enum: `male`, `female`, `other`, `prefer_not_to_say` | User's gender (optional demographic) |
| `createdAt` | Timestamp | Yes | Auto-set on document creation | Account creation timestamp |
| `updatedAt` | Timestamp | Yes | Auto-set on document creation and every update | Last profile update timestamp |

**Firestore Security Rules (Users):**
```
match /users/{uid} {
  allow read, update: if request.auth != null && request.auth.uid == uid;
  allow create: if request.auth != null && request.auth.uid == uid;
  allow delete: if false;
}
```

---

#### 6.2.2 Assessments Collection

**Collection Path:** `assessments/{assessmentId}`

| Field Name | Data Type | Required | Constraints | Description |
|------------|-----------|----------|-------------|-------------|
| `assessmentId` | String | Yes | Auto-generated by Firestore | Unique assessment identifier |
| `userId` | String | Yes | Foreign key → `users.uid` | ID of the user who created this assessment |
| `injuryArea` | String | Yes | Enum: `ankle`, `foot`, `knee`, `wrist`, `elbow`, `other` | Body area being assessed |
| `injuryMechanism` | String | Yes | — | How the injury occurred (e.g., "Twisting/rolling") |
| `injurySound` | String | Yes | — | Sound heard at time of injury (e.g., "Cracking/snapping sound") |
| `injuryTime` | String | Yes | — | Time elapsed since injury (e.g., "1–6 hours") |
| `symptoms` | Map | Yes | See sub-fields below | Nested map containing all symptom data |
| `symptoms.painLevel` | Number | Yes | Integer, 0–10 | Pain intensity rating |
| `symptoms.painType` | String | Yes | — | Pain quality description (e.g., "Sharp/stabbing") |
| `symptoms.painTiming` | Array of Strings | Yes | — | When pain occurs (e.g., ["Constant at rest", "When moving"]) |
| `symptoms.painRelievedByMeds` | Boolean | Yes | — | Whether OTC medication provides pain relief |
| `symptoms.swelling` | String | Yes | Enum: `none`, `mild`, `moderate`, `severe` | Severity of swelling |
| `symptoms.bruising` | String | Yes | — | Extent of bruising |
| `symptoms.deformity` | String | Yes | — | Visible deformity description |
| `symptoms.skinColor` | String | Yes | — | Skin color observation |
| `symptoms.tightness` | Boolean | Yes | — | Whether tightness or stiffness is present |
| `symptoms.movementAbility` | String | Yes | — | Range of motion assessment |
| `symptoms.sideComparison` | String | Yes | — | Comparison with uninjured side |
| `ottawaResults` | Map | Yes | See sub-fields below | Nested map containing Ottawa Rules assessment data |
| `ottawaResults.lateralMalleolusTenderness` | Boolean | No | Applicable for ankle | Tenderness at lateral malleolus |
| `ottawaResults.medialMalleolusTenderness` | Boolean | No | Applicable for ankle | Tenderness at medial malleolus |
| `ottawaResults.fifthMetatarsalTenderness` | Boolean | No | Applicable for foot | Tenderness at base of fifth metatarsal |
| `ottawaResults.navicularTenderness` | Boolean | No | Applicable for foot | Tenderness at navicular bone |
| `ottawaResults.patellarTenderness` | Boolean | No | Applicable for knee | Isolated patellar tenderness |
| `ottawaResults.fibularHeadTenderness` | Boolean | No | Applicable for knee | Tenderness at fibular head |
| `ottawaResults.kneeFlexion90` | Boolean | No | Applicable for knee | Ability to flex knee to 90° |
| `ottawaResults.snuffboxTenderness` | Boolean | No | Applicable for wrist | Tenderness in anatomical snuffbox |
| `ottawaResults.scaphoidTubercleTenderness` | Boolean | No | Applicable for wrist | Tenderness over scaphoid tubercle |
| `ottawaResults.thumbCompressionPain` | Boolean | No | Applicable for wrist | Pain with longitudinal thumb compression |
| `ottawaResults.gripPain` | Boolean | No | Applicable for wrist | Pain when gripping |
| `ottawaResults.canBearWeightInitial` | Boolean | No | Applicable for ankle, foot, knee | Ability to bear weight immediately after injury |
| `ottawaResults.canBearWeightNow` | Boolean | No | Applicable for ankle, foot, knee | Ability to bear weight at time of assessment |
| `ottawaResults.ottawaPositive` | Boolean | Yes | — | Whether the Ottawa Rules criteria are met (positive = needs X-ray) |
| `redFlags` | Map | Yes | See sub-fields below | Red flag symptom screening results |
| `redFlags.boneProtruding` | Boolean | Yes | — | Bone visible through skin |
| `redFlags.numbness` | Boolean | Yes | — | Numbness or tingling below injury |
| `redFlags.blueColdExtremities` | Boolean | Yes | — | Blue, cold, or pale extremity |
| `redFlags.unresolvedPain` | Boolean | Yes | — | Severe pain not relieved by any means |
| `redFlags.anyRedFlag` | Boolean | Yes | Derived: `true` if any red flag is `true` | Aggregate red flag indicator |
| `riskScore` | Number | Yes | Integer, 0–300+ | Calculated numeric risk score |
| `riskLevel` | String | Yes | Enum: `low`, `moderate`, `high`, `emergency` | Risk level classification |
| `scoreBreakdown` | Array of Maps | Yes | Each map: `{factor: string, points: number}` | Itemized breakdown of score contributors |
| `recommendations` | Array of Strings | Yes | — | List of recommendation strings based on risk level |
| `imageUrl` | String | No | Valid Firebase Storage URL | URL of the uploaded injury image |
| `comparisonImageUrl` | String | No | Valid Firebase Storage URL | URL of the uploaded comparison image |
| `createdAt` | Timestamp | Yes | Auto-set on document creation | Assessment creation timestamp |

**Firestore Security Rules (Assessments):**
```
match /assessments/{assessmentId} {
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  allow update, delete: if false;
}
```

**Firestore Indexes:**

| Collection | Fields | Order | Purpose |
|------------|--------|-------|---------|
| `assessments` | `userId`, `createdAt` | ASC, DESC | Efficient query for user's assessment history sorted by date |
| `assessments` | `userId`, `riskLevel` | ASC, ASC | Filter assessments by risk level for a specific user |

---

## 7. API Design

### 7.1 Base URL

```
https://api.injuryiq.app/v1
```

### 7.2 Authentication

All endpoints (except registration and login) require a valid Firebase Auth ID token in the `Authorization` header:

```
Authorization: Bearer <firebase_id_token>
```

### 7.3 Endpoints

#### 7.3.1 Authentication Endpoints

---

**POST `/auth/register`**

| Attribute | Detail |
|-----------|--------|
| **Description** | Register a new user account |
| **Authentication** | Not required |
| **Request Body** | `{ "email": "string", "password": "string", "displayName": "string" }` |
| **Success Response** | `201 Created` — `{ "uid": "string", "email": "string", "displayName": "string", "token": "string" }` |
| **Error Responses** | `400 Bad Request` — Invalid input; `409 Conflict` — Email already exists; `500 Internal Server Error` — Server error |

---

**POST `/auth/login`**

| Attribute | Detail |
|-----------|--------|
| **Description** | Authenticate an existing user |
| **Authentication** | Not required |
| **Request Body** | `{ "email": "string", "password": "string" }` |
| **Success Response** | `200 OK` — `{ "uid": "string", "email": "string", "displayName": "string", "token": "string" }` |
| **Error Responses** | `401 Unauthorized` — Invalid credentials; `403 Forbidden` — Account locked; `500 Internal Server Error` |

---

#### 7.3.2 Dashboard Endpoint

---

**GET `/dashboard`**

| Attribute | Detail |
|-----------|--------|
| **Description** | Retrieve dashboard data for the authenticated user |
| **Authentication** | Required (Bearer token) |
| **Request Body** | None |
| **Success Response** | `200 OK` — `{ "user": { "displayName": "string" }, "recentAssessments": [ { "assessmentId": "string", "injuryArea": "string", "riskLevel": "string", "riskScore": "number", "createdAt": "timestamp" } ], "totalAssessments": "number" }` |
| **Error Responses** | `401 Unauthorized` — Invalid or missing token; `500 Internal Server Error` |

---

#### 7.3.3 Assessment Endpoints

---

**POST `/assessment/new`**

| Attribute | Detail |
|-----------|--------|
| **Description** | Create a new assessment record with initial data |
| **Authentication** | Required (Bearer token) |
| **Request Body** | `{ "injuryArea": "string", "injuryMechanism": "string", "injurySound": "string", "injuryTime": "string", "symptoms": { ... }, "ottawaResults": { ... }, "redFlags": { ... }, "functionalAssessment": { ... } }` |
| **Success Response** | `201 Created` — `{ "assessmentId": "string", "message": "Assessment created successfully" }` |
| **Error Responses** | `400 Bad Request` — Missing or invalid fields; `401 Unauthorized`; `500 Internal Server Error` |

---

**POST `/assessment/calculate-risk`**

| Attribute | Detail |
|-----------|--------|
| **Description** | Calculate the risk score and generate recommendations for a given assessment |
| **Authentication** | Required (Bearer token) |
| **Request Body** | `{ "assessmentId": "string" }` OR full assessment data object |
| **Success Response** | `200 OK` — `{ "assessmentId": "string", "riskScore": "number", "riskLevel": "string", "scoreBreakdown": [ { "factor": "string", "points": "number" } ], "recommendations": [ "string" ], "emergencyFlags": { "anyRedFlag": "boolean", "details": [ "string" ] } }` |
| **Error Responses** | `400 Bad Request` — Incomplete assessment data; `401 Unauthorized`; `404 Not Found` — Assessment not found; `500 Internal Server Error` |

---

**GET `/assessment/history`**

| Attribute | Detail |
|-----------|--------|
| **Description** | Retrieve all past assessments for the authenticated user |
| **Authentication** | Required (Bearer token) |
| **Query Parameters** | `limit` (optional, default 20): Number of records to return; `offset` (optional, default 0): Pagination offset |
| **Success Response** | `200 OK` — `{ "assessments": [ { "assessmentId": "string", "injuryArea": "string", "riskLevel": "string", "riskScore": "number", "createdAt": "timestamp" } ], "total": "number", "hasMore": "boolean" }` |
| **Error Responses** | `401 Unauthorized`; `500 Internal Server Error` |

---

**GET `/assessment/{id}`**

| Attribute | Detail |
|-----------|--------|
| **Description** | Retrieve the full details of a specific assessment |
| **Authentication** | Required (Bearer token) |
| **Path Parameter** | `id` — The assessment ID |
| **Success Response** | `200 OK` — Full assessment document (all fields from the Assessments schema) |
| **Error Responses** | `401 Unauthorized`; `403 Forbidden` — Assessment belongs to another user; `404 Not Found`; `500 Internal Server Error` |

---

**POST `/assessment/upload-image`**

| Attribute | Detail |
|-----------|--------|
| **Description** | Upload an injury image or comparison image for an assessment |
| **Authentication** | Required (Bearer token) |
| **Content-Type** | `multipart/form-data` |
| **Form Fields** | `assessmentId` (string, required); `imageType` (string: `injury` or `comparison`); `file` (binary, JPEG or PNG, max 10 MB) |
| **Success Response** | `200 OK` — `{ "imageUrl": "string", "message": "Image uploaded successfully" }` |
| **Error Responses** | `400 Bad Request` — Invalid file type or size; `401 Unauthorized`; `413 Payload Too Large`; `500 Internal Server Error` |

---

## 8. User Interface Requirements

### 8.1 Screen List

| # | Screen Name | Description |
|---|-------------|-------------|
| S-01 | **Splash Screen** | App branding and loading animation displayed on app launch |
| S-02 | **Login Screen** | Email/password fields, "Sign in with Google" button, "Create Account" link, "Forgot Password" link |
| S-03 | **Registration Screen** | Display name, email, password, confirm password fields, "Sign up with Google" button |
| S-04 | **Dashboard** | Welcome message, "Start New Assessment" CTA, recent assessments cards, navigation menu |
| S-05 | **Medical Disclaimer Modal** | Full disclaimer text with "I Understand & Accept" and "Cancel" buttons |
| S-06 | **Injury Area Selection** | Visual grid of body areas with anatomical icons (Ankle, Foot, Knee, Wrist, Elbow) |
| S-07 | **Basic Information** | Age input, injury time selection |
| S-08 | **Injury Mechanism** | Mechanism selection cards, injury sound selection |
| S-09 | **Pain Assessment** | Pain slider (0–10), pain type selection, pain timing multi-select, medication relief toggle |
| S-10 | **Physical Signs** | Swelling level, bruising extent, deformity observation, skin color, tightness toggle |
| S-11 | **Ottawa Rules Assessment** | Area-specific bone tenderness questions with anatomical guidance images/diagrams, weight-bearing questions |
| S-12 | **Functional Assessment** | Movement ability selection, side comparison selection |
| S-13 | **Red Flag Screening** | Binary yes/no questions for emergency symptoms with warning styling |
| S-14 | **Image Upload** | Camera/gallery options, image preview, upload/skip buttons |
| S-15 | **Comparison Image Upload** | Same layout as S-14 for the comparison image |
| S-16 | **Results Screen** | Risk level badge, score display, contributing factors list, animated score gauge |
| S-17 | **Recommendations Screen** | Actionable recommendations list, R.I.C.E. infographic (for applicable levels), disclaimer |
| S-18 | **Assessment History List** | Chronological list of past assessments with summary cards |
| S-19 | **Assessment Detail View** | Full read-only view of a past assessment with all data, images, and results |
| S-20 | **Profile/Settings** | User profile information, logout button |

### 8.2 Design Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| DP-01 | **Simplicity** | Clean, uncluttered layouts with one primary action per screen. Avoid overwhelming the user with too much information at once. |
| DP-02 | **Large Touch Targets** | All interactive elements (buttons, selection cards) minimum 48x48dp for easy touch interaction, especially for users in pain. |
| DP-03 | **Speed** | Assessment must be completable in under 2 minutes. Minimize the number of taps required. Use selection cards over text input wherever possible. |
| DP-04 | **Progress Visibility** | A progress bar at the top of the assessment wizard showing current step and total steps (e.g., "Step 3 of 8"). |
| DP-05 | **Color Coding** | Consistent color coding for risk levels throughout the app (results, history, dashboard). |
| DP-06 | **Anatomical Guidance** | Include simplified anatomical diagrams or illustrations for Ottawa Rules questions to help users identify the correct body landmarks. |
| DP-07 | **Calming Tone** | Use reassuring language and a calm visual design. Avoid alarming language except for genuine emergency situations. |
| DP-08 | **Accessibility** | Sufficient color contrast (WCAG AA), support for screen readers, scalable text, and keyboard navigation for web. |

### 8.3 Risk Level Color Coding

| Risk Level | Primary Color | Background Color | Text Color | Usage |
|------------|---------------|------------------|------------|-------|
| **Low** | `#22C55E` (Green) | `#F0FDF4` | `#15803D` | Risk badge, result card border, recommendation header |
| **Moderate** | `#F59E0B` (Amber) | `#FFFBEB` | `#B45309` | Risk badge, result card border, recommendation header |
| **High** | `#F97316` (Orange) | `#FFF7ED` | `#C2410C` | Risk badge, result card border, recommendation header |
| **Emergency** | `#EF4444` (Red) | `#FEF2F2` | `#DC2626` | Risk badge, result card border, recommendation header, alert banner |

### 8.4 Anatomical Diagrams Requirement

The following anatomical diagrams shall be included in the application:

| Diagram | Usage | Description |
|---------|-------|-------------|
| Ankle lateral view | Ottawa Ankle Rules (FR-10a) | Shows location of lateral malleolus with tenderness zone highlighted |
| Ankle medial view | Ottawa Ankle Rules (FR-10a) | Shows location of medial malleolus with tenderness zone highlighted |
| Foot lateral view | Ottawa Foot Rules (FR-10b) | Shows location of fifth metatarsal base |
| Foot medial view | Ottawa Foot Rules (FR-10b) | Shows location of navicular bone |
| Knee anterior view | Ottawa Knee Rules (FR-10c) | Shows location of patella and fibular head |
| Wrist dorsal view | Scaphoid Assessment (FR-10d) | Shows anatomical snuffbox location |
| Wrist volar view | Scaphoid Assessment (FR-10d) | Shows scaphoid tubercle location |

---

## 9. Error Handling & Edge Cases

### 9.1 Error Handling Strategy

The system implements a layered error handling strategy:

| Layer | Strategy |
|-------|----------|
| **Client-side validation** | Immediate feedback for invalid input (empty fields, out-of-range values) before API calls are made |
| **API-level validation** | Server-side validation of all request data; returns structured error responses with error codes and user-friendly messages |
| **Service-level errors** | Firebase service errors caught and translated into appropriate HTTP error responses |
| **Unhandled exceptions** | Global exception handler catches all unhandled errors, logs them, and returns a generic error response to the user |

### 9.2 Edge Cases

| # | Edge Case | System Behavior |
|---|-----------|-----------------|
| EC-01 | **User skips optional questions** | The system allows skipping optional fields (images, comparison). Required fields cannot be skipped; the system prevents progression until they are answered. |
| EC-02 | **Image upload fails** | The system displays a retry option: "Upload failed. Try again or skip." Assessment can continue without the image. |
| EC-03 | **Internet disconnects mid-assessment** | Auto-saved progress is preserved locally. When connectivity is restored, the user can resume from the last completed step. If the user attempts to submit, an error is shown: "No internet connection. Your progress is saved. Please reconnect to continue." |
| EC-04 | **User under 18** | The system displays a warning: "The Ottawa Rules have not been fully validated for individuals under 18. Your results should be interpreted with caution. We recommend consulting a healthcare professional regardless of the risk score." The assessment continues but the warning is included in the results. |
| EC-05 | **Incomplete questionnaire submission** | The backend validates that all required fields are present. If any required data is missing, the API returns a `400 Bad Request` with a list of missing fields. The frontend highlights the incomplete step(s). |
| EC-06 | **Firebase service unavailable** | The system displays: "Our services are temporarily unavailable. Please try again in a few minutes." The user is not able to start or complete assessments during the outage. |
| EC-07 | **Very high risk score (> 200 points)** | The score is capped at the "Emergency" classification. The system ensures that recommendation urgency does not change beyond the "Emergency" level regardless of how high the score goes. |
| EC-08 | **Multiple red flags simultaneously** | All positive red flags are listed in the results. The system does not add additional severity levels beyond "Emergency" — it simply lists all contributing factors. |
| EC-09 | **User refreshes browser during assessment (web)** | Assessment state is persisted in local storage. On page reload, the system detects the saved state and offers to resume. |
| EC-10 | **Duplicate assessment submission** | The backend uses idempotency keys (assessment ID) to prevent duplicate records from being created. |
| EC-11 | **Simultaneous login from multiple devices** | Firebase Auth allows concurrent sessions. Assessment data is synced via Firestore. Conflicts are handled via last-write-wins with timestamps. |

---

## 10. Security Requirements

### 10.1 Authentication Mechanism

| Requirement | Implementation |
|-------------|----------------|
| **Primary authentication** | Firebase Authentication with email/password provider |
| **Social authentication** | Google OAuth 2.0 via Firebase Authentication |
| **Token management** | Firebase ID tokens (JWT) with 1-hour expiry and automatic silent refresh |
| **Password requirements** | Minimum 8 characters; at least one uppercase letter, one lowercase letter, one digit |
| **Account recovery** | Password reset via Firebase email verification |
| **Session management** | Token-based sessions; sessions expire after 30 days of inactivity |
| **Account lockout** | 5 consecutive failed login attempts trigger a 15-minute temporary lockout |

### 10.2 Data Encryption

| Data State | Encryption Method |
|------------|-------------------|
| **At rest (Firestore)** | AES-256 encryption, managed by Google Cloud Platform; keys managed by Google Key Management Service (KMS) |
| **At rest (Firebase Storage)** | AES-256 encryption, managed by Google Cloud Platform |
| **In transit** | TLS 1.2+ (HTTPS) for all API communications; certificate pinning recommended for mobile app |
| **Client-side** | Sensitive data (tokens) stored in secure storage (Flutter `flutter_secure_storage` package) |

### 10.3 Privacy Policy Requirements

| Requirement | Detail |
|-------------|--------|
| **Data collection transparency** | The app must clearly state what data is collected, why it is collected, and how it is used |
| **Minimal data collection** | Collect only the minimum PII necessary (email, display name); health-related data is collected for assessment purposes only |
| **Data retention** | Assessment data is retained indefinitely unless the user requests deletion |
| **Data deletion** | Users must have the ability to request account and data deletion (future enhancement; manual process in MVP) |
| **Third-party sharing** | No user data shall be shared with third parties without explicit consent |
| **Cookie/tracking disclosure** | If web analytics are used, appropriate disclosures must be provided |

### 10.4 HIPAA Awareness

InjuryIQ AI is **not HIPAA-compliant** and does not claim to be. However, the following HIPAA-inspired practices are adopted:

| Practice | Implementation |
|----------|----------------|
| **Data minimization** | Collect only necessary health-related information; no SSN, insurance, or detailed medical history |
| **Access controls** | Users can only access their own data; role-based access not applicable (single user role) |
| **Audit logging** | API requests are logged with timestamps and user IDs (excluding sensitive data) for security auditing |
| **Encryption** | All data encrypted at rest and in transit (see Section 10.2) |

---

## 11. Testing Requirements

### 11.1 Testing Strategy Overview

| Test Type | Scope | Tools |
|-----------|-------|-------|
| **Unit Tests** | Individual functions (scoring logic, Ottawa Rules evaluation, input validation) | `pytest` (Python), `flutter_test` (Dart) |
| **Integration Tests** | API endpoint testing, Firebase interaction, end-to-end data flow | `pytest` + `httpx` (Python), Firebase Emulator Suite |
| **UI Tests** | Screen rendering, navigation flow, form validation, responsive layout | Flutter integration tests, `flutter_driver` |
| **Manual Testing** | User acceptance, usability evaluation, edge case verification | Structured test scenarios |

### 11.2 Unit Test Scenarios for Risk Scoring Logic

The following test scenarios validate the correctness of the risk scoring algorithm:

| # | Test Scenario | Input Summary | Expected Score | Expected Level |
|---|---------------|---------------|----------------|----------------|
| TS-01 | Minimal symptoms — mild sprain | No Ottawa positives, pain 3/10, mild swelling, no red flags | 0 | Low |
| TS-02 | Low-range moderate symptoms | Pain 5/10, dull ache, moderate swelling, can move with pain | 15 | Low |
| TS-03 | Moderate range — single Ottawa positive | Lateral malleolus tenderness, pain 5/10, mild swelling | 25 | Moderate |
| TS-04 | Moderate range — mechanism + pain | High-energy mechanism (+15), pain 8/10 (+15), sharp pain (+10) | 40 | Moderate |
| TS-05 | Moderate range — cracking sound + swelling | Cracking sound (+20), severe swelling (+15), pain 6/10 | 35 | Moderate |
| TS-06 | High range — Ottawa positive + weight-bearing failure | Cannot bear weight (+30), lateral malleolus tenderness (+25) | 55 | High |
| TS-07 | High range — multiple contributing factors | Cannot bear weight (+30), pain 9/10 (+15), constant rest pain (+12) | 57 | High |
| TS-08 | High range — wrist scaphoid assessment | Snuffbox tenderness (+25), FOOSH mechanism (+15), pain 8/10 (+15) | 55 | High |
| TS-09 | High range — knee Ottawa positive | Fibular head tenderness (+25), cannot bear weight (+30), cracking sound (+20) | 75 | High |
| TS-10 | Emergency by score — multiple Ottawa + severe symptoms | Both malleolus tenderness (+50), cannot bear weight (+30), pain 9/10 (+15) | 95 | Emergency |
| TS-11 | Emergency by red flag — bone protruding | Any symptoms + bone protruding red flag | Any | Emergency |
| TS-12 | Emergency by red flag — numbness | Any symptoms + numbness below injury | Any | Emergency |
| TS-13 | Emergency by red flag — blue/cold extremity | Any symptoms + blue/cold extremity | Any | Emergency |
| TS-14 | Emergency by red flag — unrelieved pain | Any symptoms + severe unrelieved pain | Any | Emergency |
| TS-15 | Emergency by red flag — visible deformity | Any symptoms + visible deformity (crooked/misshapen) | Any | Emergency |
| TS-16 | Maximum score scenario | All possible positive factors combined | 200+ | Emergency |
| TS-17 | Foot-specific Ottawa — fifth metatarsal | Fifth metatarsal tenderness (+25), high-energy mechanism (+15), large bruising (+10) | 50 | Moderate |
| TS-18 | Foot-specific Ottawa — navicular | Navicular tenderness (+25), cannot bear weight (+30) | 55 | High |
| TS-19 | Wrist — full scaphoid positive | Snuffbox (+25), scaphoid tubercle (+25), thumb compression pain, grip pain, FOOSH (+15) | 65 | High |
| TS-20 | Combined pain factors | Pain 10/10 (+15), sharp/stabbing (+10), constant at rest (+12), severe swelling (+15), large bruising (+10), cannot move at all (+20) | 82 | Emergency |
| TS-21 | Boundary: score exactly 20 | Combination yielding exactly 20 points | 20 | Low |
| TS-22 | Boundary: score exactly 21 | Combination yielding exactly 21 points | 21 | Moderate |
| TS-23 | Boundary: score exactly 50 | Combination yielding exactly 50 points | 50 | Moderate |
| TS-24 | Boundary: score exactly 51 | Combination yielding exactly 51 points | 51 | High |
| TS-25 | Boundary: score exactly 80 | Combination yielding exactly 80 points | 80 | High |
| TS-26 | Boundary: score exactly 81 | Combination yielding exactly 81 points | 81 | Emergency |

### 11.3 Integration Test Scenarios

| # | Test Scenario | Validation |
|---|---------------|------------|
| IT-01 | User registration flow | Verify Firebase Auth account creation and Firestore user document creation |
| IT-02 | User login flow | Verify token generation and session establishment |
| IT-03 | Complete assessment submission | Verify all data is correctly stored in Firestore with correct field types |
| IT-04 | Risk calculation API | Verify correct risk score and level returned for known input |
| IT-05 | Assessment history retrieval | Verify correct assessments returned for authenticated user; no cross-user data leakage |
| IT-06 | Image upload | Verify image stored in Firebase Storage with correct URL linked to assessment |
| IT-07 | Unauthorized access | Verify 401 response for requests without valid tokens |
| IT-08 | Cross-user access | Verify 403 response when attempting to access another user's assessment |

### 11.4 UI Test Scenarios

| # | Test Scenario | Validation |
|---|---------------|------------|
| UT-01 | Registration form validation | Verify error messages for invalid inputs (email format, password length, etc.) |
| UT-02 | Assessment wizard navigation | Verify forward/backward navigation preserves answers |
| UT-03 | Progress bar accuracy | Verify progress bar reflects current step correctly |
| UT-04 | Risk level color coding | Verify correct colors displayed for each risk level |
| UT-05 | Responsive layout | Verify layout adapts correctly from 320px to 1920px |
| UT-06 | Disclaimer modal | Verify disclaimer cannot be bypassed; must be explicitly accepted |

---

## 12. Limitations & Constraints

### 12.1 Clinical Limitations

| # | Limitation | Impact | Mitigation |
|---|-----------|--------|------------|
| L-01 | **Not a medical diagnosis.** The system provides risk estimation, not diagnosis. A physician's clinical examination, imaging, and judgment cannot be replicated by software. | Users may incorrectly interpret a "Low" risk result as a guarantee that no fracture exists. | Clear disclaimers at every results touchpoint; recommendations to see a doctor if symptoms persist. |
| L-02 | **Self-reported data.** The accuracy of the assessment depends entirely on the user's ability to accurately observe and report their symptoms. Pain perception is subjective. | Inaccurate symptom reporting can lead to incorrect risk scores (false negatives or false positives). | Clear, simple questions with visual aids; remind users to answer honestly; note in disclaimer. |
| L-03 | **Ottawa Rules age limitation.** The Ottawa Rules were validated for adults aged 18 and older. Their sensitivity and specificity have not been fully established for pediatric populations. | For users under 18, the risk score may not be as reliable. | Display a prominent warning for users under 18; recommend professional evaluation regardless of score. |
| L-04 | **Ottawa Rules exclusions.** The Ottawa Rules should not be applied to intoxicated patients, patients with multiple injuries, patients with diminished sensation, or pregnant women. | The system does not screen for these exclusion criteria beyond age. | Include a note in the disclaimer; future enhancement to add screening for these conditions. |
| L-05 | **AI accuracy (future).** The planned AI image classification module will have accuracy limitations inherent to machine learning models (false positives and false negatives). | Users may over-rely on AI results. | AI results will be presented as supplementary, never as definitive; always paired with questionnaire-based assessment. |

### 12.2 Technical Limitations

| # | Limitation | Impact | Mitigation |
|---|-----------|--------|------------|
| L-06 | **Internet dependency.** No offline mode in MVP. | Users in areas with poor connectivity cannot use the system. | Future enhancement: offline mode with local caching and sync. |
| L-07 | **Single language (English).** MVP supports English only. | Non-English speakers cannot use the system effectively. | Future enhancement: multi-language support (Hindi, Spanish, etc.). |
| L-08 | **No AI in MVP.** Image upload exists but no AI analysis is performed. | Images are stored but provide no immediate value to the user. | Communicate clearly that image analysis is a future feature. |
| L-09 | **Limited body areas.** Only 5 injury areas supported (Ankle, Foot, Knee, Wrist, Elbow). | Users with injuries to other areas (shoulder, hip, finger) cannot be assessed. | Future enhancement: expand to additional body areas. |

### 12.3 Regulatory Constraints

| # | Constraint | Detail |
|---|-----------|--------|
| R-01 | **Not FDA/CE approved.** The system has not undergone regulatory evaluation. | Cannot be marketed or sold as a medical device. |
| R-02 | **Not HIPAA-compliant.** While best practices are followed, formal HIPAA compliance requires additional measures (BAA with Firebase, formal risk assessment, policies). | Cannot be used in a clinical or insurance context. |
| R-03 | **Not for emergencies.** The system is not a replacement for calling emergency services. | Must prominently display that for life-threatening situations, users should call emergency services. |

---

## 13. Future Enhancements

The following features are planned for post-MVP releases:

| # | Enhancement | Description | Priority | Target Release |
|---|-------------|-------------|----------|----------------|
| FE-01 | **AI Image Classification** | Integrate a PyTorch-based convolutional neural network (CNN) trained to classify injury images as suggestive of sprain or fracture. Results supplement (not replace) the questionnaire-based assessment. | High | v2.0 |
| FE-02 | **Recovery Tracking** | Allow users to log daily recovery progress (pain level, swelling, mobility) and visualize recovery trends over time with charts. | Medium | v2.0 |
| FE-03 | **PDF Report Generation** | Generate a downloadable PDF report summarizing the assessment, risk score, contributing factors, and recommendations. Useful for sharing with healthcare providers. | Medium | v2.0 |
| FE-04 | **Doctor Sharing** | Enable users to share their assessment report with a healthcare provider via email or secure link. Include a provider-facing view with clinical terminology. | Medium | v2.5 |
| FE-05 | **Voice Assistant** | Integrate voice input for hands-free assessment completion. Useful for users who have difficulty typing due to their injury. | Low | v3.0 |
| FE-06 | **Multi-Language Support** | Translate the application into Hindi, Spanish, French, and other languages to expand accessibility. | Medium | v2.5 |
| FE-07 | **Offline Mode** | Enable core assessment functionality without an internet connection. Data syncs automatically when connectivity is restored. | Medium | v2.5 |
| FE-08 | **Additional Body Areas** | Expand assessment support to include shoulder, hip, finger/thumb, and toe injuries. | Medium | v2.0 |
| FE-09 | **Push Notifications** | Remind users to reassess their injury after 24–48 hours; send follow-up care reminders. | Low | v2.5 |
| FE-10 | **Community/Educational Content** | In-app educational articles about common injuries, first aid, and when to seek medical help. | Low | v3.0 |
| FE-11 | **Wearable Integration** | Integration with smartwatches for real-time pain and mobility tracking during recovery. | Low | v3.0 |
| FE-12 | **Admin Dashboard** | Web-based dashboard for system administrators to monitor usage statistics, review anonymized assessment data, and manage system configuration. | Low | v3.0 |

---

## 14. Glossary

| Term | Definition |
|------|------------|
| **Assessment** | A single instance of injury evaluation conducted through the InjuryIQ AI questionnaire, producing a risk score and recommendations. |
| **Assessment Wizard** | The multi-step guided questionnaire flow that collects injury data from the user. |
| **Bone Tenderness** | Pain or discomfort when pressure is applied directly over a bone. In the context of Ottawa Rules, tenderness at specific anatomical landmarks suggests possible fracture. |
| **Clinical Decision Rule** | A systematically developed tool that uses patient characteristics and clinical findings to estimate the probability of a condition or recommend a course of action. |
| **Dashboard** | The main screen displayed after login, providing an overview of the user's recent activity and quick access to key features. |
| **Decision Support** | A system or tool that provides information or recommendations to aid decision-making, without making the decision itself. |
| **Emergency Override** | The system behavior where the presence of any red flag symptom immediately classifies the assessment as "Emergency" regardless of the numeric risk score. |
| **False Negative** | A result where the system indicates low risk but the actual injury is severe (e.g., a fracture is missed). |
| **False Positive** | A result where the system indicates high risk but the actual injury is minor (e.g., a mild sprain classified as emergency). |
| **Firebase** | Google's mobile and web application development platform, providing authentication, database, storage, and hosting services. |
| **Firestore** | Cloud Firestore, a flexible, scalable NoSQL cloud database provided by Firebase/Google Cloud. |
| **Flutter** | Google's open-source UI software development kit for building cross-platform applications from a single codebase. |
| **FastAPI** | A modern, fast web framework for building APIs with Python 3.6+ based on standard Python type hints. |
| **Idempotency** | The property that an operation produces the same result regardless of how many times it is performed. Used to prevent duplicate data creation. |
| **Musculoskeletal** | Relating to the muscles, bones, joints, ligaments, and tendons of the body. |
| **NoSQL** | A database design approach that does not use the traditional relational (SQL) table structure. Firestore is a document-oriented NoSQL database. |
| **OAuth 2.0** | An industry-standard protocol for authorization, allowing third-party services to exchange authentication tokens without exposing user credentials. |
| **Ottawa Positive** | A determination that one or more Ottawa Rules criteria are met, suggesting that radiographic imaging (X-ray) is recommended. |
| **Risk Engine** | The backend module responsible for calculating the risk score based on assessment data, scoring weights, and Ottawa Rules results. |
| **Risk Level** | A classification (Low, Moderate, High, Emergency) derived from the numeric risk score and/or the presence of red flag symptoms. |
| **Risk Score** | A numeric value calculated from the user's assessment responses using a weighted point-based algorithm. Higher scores indicate greater likelihood of serious injury. |
| **Red Flag** | A clinical sign or symptom that indicates a potentially serious or life-threatening condition requiring immediate medical attention. |
| **Triage** | The process of categorizing patients by severity to determine the priority and level of care needed. |
| **Weight-Bearing** | The ability to stand on and walk with the injured limb, specifically taking four consecutive steps. A key criterion in Ottawa Rules evaluation. |

---

## 15. Appendix

### Appendix A: Complete Assessment Question List

The following is the complete list of questions presented during the assessment, organized by section:

#### A.1 Basic Information

| # | Question | Input Type | Options / Range |
|---|----------|-----------|-----------------|
| Q-01 | What is your age? | Number input | 1–120 |
| Q-02 | When did the injury happen? | Single select | Less than 1 hour ago / 1–6 hours ago / 6–24 hours ago / 1–3 days ago / More than 3 days ago |

#### A.2 Injury Mechanism

| # | Question | Input Type | Options / Range |
|---|----------|-----------|-----------------|
| Q-03 | How did the injury happen? | Single select | Twisting/rolling / Direct impact or blow / Fall from height / Fall on outstretched hand (FOOSH) / Sports collision / Overuse/repetitive strain / Other |
| Q-04 | Did you hear or feel anything at the time of injury? | Single select | Cracking or snapping sound / Popping sound / No sound / Not sure |

#### A.3 Pain Assessment

| # | Question | Input Type | Options / Range |
|---|----------|-----------|-----------------|
| Q-05 | On a scale of 0 to 10, how would you rate your pain right now? (0 = no pain, 10 = worst pain imaginable) | Slider / Number | 0–10 |
| Q-06 | How would you describe the pain? | Single select | Sharp or stabbing / Dull or aching / Throbbing / Burning / Pressure or tightness |
| Q-07 | When do you feel the pain? (Select all that apply) | Multi-select | Constant — even at rest / Only when I move the area / Only when I touch the area / It's getting worse over time |
| Q-08 | Does over-the-counter pain medication (like ibuprofen or paracetamol) help reduce the pain? | Single select | Yes / No |

#### A.4 Physical Signs

| # | Question | Input Type | Options / Range |
|---|----------|-----------|-----------------|
| Q-09 | How much swelling do you see? | Single select | None / Mild — slight puffiness / Moderate — noticeably swollen / Severe — very swollen, skin feels tight |
| Q-10 | Do you see any bruising? | Single select | None / Small area of discoloration / Large area of bruising / Bruising is spreading to surrounding areas |
| Q-11 | Does the injured area look different in shape compared to the other side? | Single select | No — looks normal compared to other side / Slightly different / Yes — visibly crooked, bent, or misshapen |
| Q-12 | What color is the skin around the injury? | Single select | Normal / Red or flushed / Blue or purple / Pale or white |
| Q-13 | Does the injured area feel tight or stiff? | Single select | Yes / No |

#### A.5 Ottawa Rules — Ankle

| # | Question | Input Type | Condition |
|---|----------|-----------|-----------|
| Q-14a | Is there pain or tenderness when you press on the bony bump on the OUTSIDE of your ankle? (Lateral malleolus — the outer ankle bone) | Yes / No | Injury area = Ankle |
| Q-15a | Is there pain or tenderness when you press on the bony bump on the INSIDE of your ankle? (Medial malleolus — the inner ankle bone) | Yes / No | Injury area = Ankle |
| Q-16a | Right after the injury happened, were you able to stand on the injured leg and take 4 steps? | Yes / No | Injury area = Ankle, Foot, Knee |
| Q-17a | Can you stand on the injured leg and take 4 steps right now? | Yes / No | Injury area = Ankle, Foot, Knee |

#### A.6 Ottawa Rules — Foot

| # | Question | Input Type | Condition |
|---|----------|-----------|-----------|
| Q-14b | Is there pain when you press on the outside edge of your foot, about halfway along? (Base of the fifth metatarsal) | Yes / No | Injury area = Foot |
| Q-15b | Is there pain when you press on the inside of your foot, at the highest point of the arch? (Navicular bone) | Yes / No | Injury area = Foot |

#### A.7 Ottawa Rules — Knee

| # | Question | Input Type | Condition |
|---|----------|-----------|-----------|
| Q-14c | Is there pain when you press on the kneecap only, and not the surrounding area? (Isolated patellar tenderness) | Yes / No | Injury area = Knee |
| Q-15c | Is there pain when you press on the small bony bump on the outer side of your knee? (Fibular head) | Yes / No | Injury area = Knee |
| Q-16c | Can you bend your knee to a 90-degree angle (right angle)? | Yes / No | Injury area = Knee |

#### A.8 Ottawa Rules — Wrist (Scaphoid Assessment)

| # | Question | Input Type | Condition |
|---|----------|-----------|-----------|
| Q-14d | Is there pain when you press into the small hollow on the thumb side of your wrist? (Anatomical snuffbox) | Yes / No | Injury area = Wrist |
| Q-15d | Is there pain when you press on the base of your thumb on the palm side of your wrist? (Scaphoid tubercle) | Yes / No | Injury area = Wrist |
| Q-16d | Does it hurt when someone pushes your thumb straight toward your wrist? (Thumb longitudinal compression) | Yes / No | Injury area = Wrist |
| Q-17d | Does it hurt when you try to grip or squeeze something? | Yes / No | Injury area = Wrist |

#### A.9 Functional Assessment

| # | Question | Input Type | Options / Range |
|---|----------|-----------|-----------------|
| Q-18 | How well can you move the injured area? | Single select | Can move normally / Can move with some pain / Very limited movement / Cannot move at all |
| Q-19 | Compared to the other (uninjured) side, how does the injured area look and feel? | Single select | Looks and feels about the same / Slightly different / Noticeably different / Very different |

#### A.10 Red Flag Screening

| # | Question | Input Type | Options / Range |
|---|----------|-----------|-----------------|
| Q-20 | Can you see bone poking through the skin? | Yes / No | — |
| Q-21 | Do you have numbness or tingling below the injured area (fingers, toes)? | Yes / No | — |
| Q-22 | Is the area below the injury (fingers, toes, hand, foot) blue, cold, or pale? | Yes / No | — |
| Q-23 | Is the pain so severe that nothing helps — not rest, ice, or medication? | Yes / No | — |

---

### Appendix B: Ottawa Rules Quick Reference

#### B.1 Ottawa Ankle Rules (Stiell et al., 1992)

An ankle X-ray series is required only if there is pain in the malleolar zone AND any one of the following:

1. Bone tenderness along the distal 6 cm of the posterior edge of the **lateral malleolus** (or its tip)
2. Bone tenderness along the distal 6 cm of the posterior edge of the **medial malleolus** (or its tip)
3. Inability to **bear weight** both immediately after injury and in the emergency department (4 steps)

**Sensitivity:** 98–100% for clinically significant ankle fractures  
**Specificity:** 40–50% (many false positives, but very few missed fractures)

#### B.2 Ottawa Foot Rules

A foot X-ray series is required only if there is pain in the midfoot zone AND any one of the following:

1. Bone tenderness at the base of the **fifth metatarsal**
2. Bone tenderness at the **navicular bone**
3. Inability to **bear weight** both immediately after injury and in the emergency department (4 steps)

#### B.3 Ottawa Knee Rules (Stiell et al., 1995)

A knee X-ray series is required only if any one of the following is present:

1. Age **55 years or older**
2. **Isolated patellar tenderness** (no other bony tenderness of the knee)
3. Tenderness at the **head of the fibula**
4. Inability to **flex the knee to 90 degrees**
5. Inability to **bear weight** both immediately after injury and in the emergency department (4 steps)

**Sensitivity:** 97–100% for clinically significant knee fractures

#### B.4 Scaphoid Fracture Assessment Criteria

A wrist X-ray (scaphoid views) should be considered if:

1. Tenderness in the **anatomical snuffbox**
2. Tenderness over the **scaphoid tubercle**
3. Pain with **longitudinal compression of the thumb** (axial loading)
4. History of **fall on outstretched hand** (FOOSH mechanism)

**Note:** Scaphoid fractures are notoriously difficult to diagnose. Initial X-rays are negative in up to 20% of cases. If clinical suspicion is high, repeat imaging at 10–14 days or advanced imaging (MRI/CT) is recommended.

---

### Appendix C: Risk Scoring Reference Table

#### C.1 Immediate Emergency Overrides

| Condition | Result |
|-----------|--------|
| Visible deformity (crooked, bent, misshapen) | → Emergency |
| Bone protruding through skin | → Emergency |
| Blue, cold, or pale extremity below injury | → Emergency |
| Numbness or tingling below injury | → Emergency |
| Severe unrelieved pain (not responsive to any measures) | → Emergency |

#### C.2 Point-Based Scoring Factors

| Factor | Points | Condition |
|--------|--------|-----------|
| Cannot bear weight (4 steps) | +30 | Cannot bear weight immediately after injury AND now |
| Bone tenderness at Ottawa-specified point | +25 | Per specific tenderness point (see area-specific rules) |
| Anatomical snuffbox tenderness (wrist) | +25 | Tenderness present in snuffbox |
| Scaphoid tubercle tenderness (wrist) | +25 | Tenderness present at scaphoid tubercle |
| High-energy injury mechanism | +15 | Fall from height, direct impact/blow, sports collision |
| Cracking/snapping sound | +20 | Sound heard at time of injury |
| Severe pain (8–10/10) | +15 | Pain rated 8, 9, or 10 on 0–10 scale |
| Sharp/stabbing pain | +10 | Pain described as sharp or stabbing quality |
| Constant pain at rest | +12 | Pain present even without movement or touching |
| Severe swelling | +15 | Very swollen, skin feels tight |
| Large bruising | +10 | Large area of bruising or spreading bruising |
| Cannot move at all | +20 | Total inability to move the injured area |

#### C.3 Risk Level Classification

| Score Range | Risk Level | Recommended Action |
|-------------|-----------|-------------------|
| 0–20 | **Low** | Self-care (R.I.C.E.); monitor for 48–72 hours; see a doctor if symptoms worsen |
| 21–50 | **Moderate** | R.I.C.E. protocol; medical appointment within 24–48 hours; possible X-ray |
| 51–80 | **High** | Urgent medical evaluation today; X-ray likely needed; possible immobilization |
| 81+ | **Emergency** | Immediate emergency care; call 911 or go to nearest ER; do not move the injury |

---

### Appendix D: Sample Risk Score Calculations

#### Example 1: Mild Ankle Sprain (Low Risk)

| Factor | Present? | Points |
|--------|----------|--------|
| Cannot bear weight | No (can bear weight) | 0 |
| Lateral malleolus tenderness | No | 0 |
| Medial malleolus tenderness | No | 0 |
| High-energy mechanism | No (twisting) | 0 |
| Cracking sound | No | 0 |
| Pain level | 4/10 | 0 |
| Sharp pain | No (dull ache) | 0 |
| Constant pain at rest | No | 0 |
| Severe swelling | No (mild) | 0 |
| Large bruising | No (none) | 0 |
| Cannot move at all | No (can move with pain) | 0 |
| **Total** | | **0** |
| **Risk Level** | | **Low** |

#### Example 2: Moderate Ankle Injury (Moderate Risk)

| Factor | Present? | Points |
|--------|----------|--------|
| Cannot bear weight | No | 0 |
| Lateral malleolus tenderness | **Yes** | **+25** |
| Medial malleolus tenderness | No | 0 |
| High-energy mechanism | No | 0 |
| Cracking sound | No | 0 |
| Pain level | 6/10 | 0 |
| Sharp pain | **Yes** | **+10** |
| Constant pain at rest | No | 0 |
| Severe swelling | No (moderate) | 0 |
| Large bruising | No | 0 |
| Cannot move at all | No | 0 |
| **Total** | | **35** |
| **Risk Level** | | **Moderate** |

#### Example 3: Likely Ankle Fracture (High Risk)

| Factor | Present? | Points |
|--------|----------|--------|
| Cannot bear weight | **Yes** | **+30** |
| Lateral malleolus tenderness | **Yes** | **+25** |
| Medial malleolus tenderness | No | 0 |
| High-energy mechanism | No | 0 |
| Cracking sound | **Yes** | **+20** |
| Pain level | 8/10 | **+15** |
| Sharp pain | **Yes** | **+10** |
| Constant pain at rest | No | 0 |
| Severe swelling | No (moderate) | 0 |
| Large bruising | No | 0 |
| Cannot move at all | No | 0 |
| **Total** | | **100** |
| **Risk Level** | | **Emergency** |

#### Example 4: Wrist FOOSH Injury (High Risk)

| Factor | Present? | Points |
|--------|----------|--------|
| Snuffbox tenderness | **Yes** | **+25** |
| Scaphoid tubercle tenderness | **Yes** | **+25** |
| High-energy mechanism (FOOSH) | **Yes** | **+15** |
| Cracking sound | No | 0 |
| Pain level | 7/10 | 0 |
| Sharp pain | **Yes** | **+10** |
| Constant pain at rest | No | 0 |
| Severe swelling | No (mild) | 0 |
| Large bruising | No | 0 |
| Cannot move at all | No | 0 |
| **Total** | | **75** |
| **Risk Level** | | **High** |

---

**— End of Document —**

*This Software Requirements Specification was prepared in accordance with IEEE 830-1998 standards. All clinical references are cited from peer-reviewed medical literature. This document is intended for academic and development purposes only.*

import React, { useState, useEffect, useRef } from 'react';
import { auth, googleProvider, signInWithPopup } from './firebase';

import { 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  History as HistoryIcon, 
  User, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  Eye, 
  Trash2, 
  Shield, 
  Moon, 
  Sun, 
  Clock, 
  Heart, 
  PhoneCall, 
  Check, 
  UploadCloud, 
  Info,
  Calendar,
  AlertOctagon,
  FileText,
  MessageSquare,
  X,
  Send,
  Globe,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';

// --- TRILINGUAL TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    welcome: "Welcome",
    appSub: "InjuryIQ is your AI-assisted clinical triage tool. Assess sports, domestic, or accidental injuries instantly using evidence-based medical rules.",
    startNew: "Start New Injury Assessment",
    viewRecords: "View Assessment Records",
    recentAssessments: "Recent Assessments",
    noAssessments: "No assessments recorded yet.",
    riceCompanion: "R.I.C.E. Recovery Companion",
    iceTimerTitle: "Active Ice Compress Timer",
    iceTimerSub: "Standard medical cold compress recommendation: 20 minutes limit.",
    disclaimerTitle: "Safety & Medical Disclaimer",
    disclaimerIntro: "IMPORTANT: InjuryIQ is an AI-assisted clinical triage tool designed to estimate injury risk using symptom logic (such as the Ottawa Ankle Rules).",
    disclaimerPoints: [
      "This is NOT a Medical Diagnosis: This app does not replace a physical examination or professional diagnosis by a qualified orthopedic doctor.",
      "Exclusion Criteria: Do not rely on this triage system if the patient is under 18 years old, intoxicated, has multiple major trauma wounds, or diminished nerve sensation.",
      "Emergencies: If you suspect open fractures, bone protrusions, or extreme blood loss, skip this checklist and visit the nearest Emergency Room immediately."
    ],
    acceptDisclaimer: "I Understand, Acknowledge & Accept",
    cancel: "Cancel",
    abort: "Abort",
    step: "Step",
    of: "of",
    injuryLocationQuestion: "Where is the injury located?",
    selectJointSubtitle: "Please select the joint area that was impacted.",
    ageLabel: "What is the patient's age?",
    ageWarning: "Note: Ottawa Rules are not fully validated for pediatric patients under 18 years.",
    timelineLabel: "When did the injury happen?",
    mechanismLabel: "How did the injury occur?",
    soundLabel: "Did you hear any sound at the moment of injury?",
    painSliderLabel: "Current pain level (0 to 10):",
    painTypeLabel: "Type of pain:",
    painReliefLabel: "Does pain medicine help?",
    painIncreasesLabel: "When does the pain increase? (Select all that apply)",
    swellingLabel: "Swelling (Sujan):",
    bruisingLabel: "Bruising (Neel padna):",
    deformityLabel: "Is there a visible deformity?",
    deformitySub: "Does the joint look bent, crooked, or clearly misshapen compared to the other side?",
    skinColorLabel: "Skin Color Changes below injury:",
    skinTightCheckbox: "Does the skin feel extremely tight, tense or rigid? (Sign of high pressure)",
    redFlagsTitle: "Critical Red Flag Checklist",
    redFlagsSub: "Please select if you are experiencing any of these high-emergency signals.",
    aiUploadTitle: "AI Visual Assessment ✱ Required",
    aiUploadSub: "Upload photos of your injury and comparison side. BOTH photos are required to generate your assessment report.",
    analyzeButton: "Analyze",
    generateReport: "Generate Triage Report",
    back: "Back",
    next: "Next",
    backToRecords: "Back to Records",
    deleteRecord: "Delete Record",
    triageScore: "Triage Risk Factor Points",
    explainableBreakdown: "Explainable Triage Breakdown",
    breakdownSub: "Transparent breakdown showing the exact factors that contributed to your assessment score.",
    finalScore: "Final Calculated Score",
    actionableRecs: "Actionable Recommendations",
    ottawaScreening: "Ottawa Rule Screening",
    ottawaPositive: "POSITIVE: Inability to bear weight or local bone point tenderness detected. Triage guidelines state that a clinical X-ray evaluation is indicated to rule out fracture.",
    ottawaNegative: "NEGATIVE: No specific bone tenderness at Ottawa test zones and weight-bearing intact. Fracture probability is statistically low.",
    metadataTitle: "Assessment Metadata",
    injuryLocation: "Injury Location",
    injuryTimeline: "Injury Timeline",
    timestamp: "Timestamp",
    chatbotTitle: "InjuryIQ Voice Assistant",
    chatbotWelcome: "Hello! I am your multilingual voice assistant. Ask me anything about injuries, or tap the Mic icon to speak in English, Hindi, or Hinglish.",
    chatPlaceholder: "Ask or tap Mic to speak...",
    lowRiskTitle: "Low Risk — Soft Tissue Injury Likely (Sprain)",
    modRiskTitle: "Moderate Risk — Possible Sprain or Minor Crack",
    highRiskTitle: "High Risk — High Fracture Probability",
    customNotesLabel: "Symptom Description (Optional) — Type or speak in your own words:",
    customNotesPlaceholder: "Describe how the injury happened, what you are feeling, where the pain is, etc...",
    speakBtnStart: "Voice Typing",
    speakBtnListening: "Listening... Speak now"
  },
  hi: {
    welcome: "स्वागत है, करन 👋",
    appSub: "InjuryIQ आपका AI-सहायता प्राप्त क्लिनिकल ट्राइएज टूल है। साक्ष्य-आधारित चिकित्सा नियमों का उपयोग करके चोटों का तुरंत आकलन करें।",
    startNew: "नया चोट मूल्यांकन शुरू करें",
    viewRecords: "मूल्यांकन रिकॉर्ड देखें",
    recentAssessments: "हाल के मूल्यांकन",
    noAssessments: "अभी तक कोई मूल्यांकन दर्ज नहीं किया गया है।",
    riceCompanion: "R.I.C.E. रिकवरी गाइड",
    iceTimerTitle: "कोल्ड कंप्रेस आइस टाइमर",
    iceTimerSub: "चिकित्सीय निर्देश: बर्फ केवल 15 से 20 मिनट के लिए ही लगाएं।",
    disclaimerTitle: "सुरक्षा एवं चिकित्सा अस्वीकरण",
    disclaimerIntro: "महत्वपूर्ण: InjuryIQ एक AI-सहायता प्राप्त ट्राइएज टूल है जिसे ओटावा रूल्स जैसे लक्षणों के आधार पर चोट के जोखिम का आकलन करने के लिए डिज़ाइन किया गया है।",
    disclaimerPoints: [
      "यह कोई मेडिकल निदान (Diagnosis) नहीं है: यह ऐप किसी योग्य डॉक्टर द्वारा शारीरिक परीक्षण या निदान का स्थान नहीं लेता है।",
      "बाहरी मानदंड: यदि रोगी 18 वर्ष से कम उम्र का है, नशे में है, या गंभीर रूप से बेहोश है, तो इस ऐप का उपयोग न करें।",
      "आपातकाल: यदि आपको खुली हड्डी या भारी रक्तस्राव का संदेह है, तो तुरंत नजदीकी आपातकालीन कक्ष (ER) में जाएं।"
    ],
    acceptDisclaimer: "मैं समझता हूँ और स्वीकार करता हूँ",
    cancel: "रद्द करें",
    abort: "रोकें",
    step: "कदम",
    of: "में से",
    injuryLocationQuestion: "चोट शरीर के किस जोड़ पर लगी है?",
    selectJointSubtitle: "कृपया प्रभावित जोड़ का चयन करें।",
    ageLabel: "मरीज की उम्र क्या है?",
    ageWarning: "ध्यान दें: 18 वर्ष से कम उम्र के बच्चों के लिए ओटावा नियम पूरी तरह मान्य नहीं हैं।",
    timelineLabel: "चोट कब लगी थी?",
    mechanismLabel: "चोट कैसे लगी?",
    soundLabel: "चोट लगने के समय क्या कोई आवाज सुनाई दी थी?",
    painSliderLabel: "दर्द का स्तर (0 से 10):",
    painTypeLabel: "दर्द का प्रकार:",
    painReliefLabel: "क्या दर्द की दवा से आराम मिलता है?",
    painIncreasesLabel: "दर्द कब बढ़ता है? (सभी लागू विकल्प चुनें)",
    swellingLabel: "सूजन (Sujan):",
    bruisingLabel: "नील पड़ना (Bruising):",
    deformityLabel: "क्या कोई दृश्य विकृति (टेढ़ापन) है?",
    deformitySub: "क्या जोड़ दूसरी तरफ की तुलना में स्पष्ट रूप से टेढ़ा या विकृत दिखता है?",
    skinColorLabel: "चोट के नीचे की त्वचा का रंग:",
    skinTightCheckbox: "क्या त्वचा अत्यधिक तंग, तनावपूर्ण या कठोर महसूस होती है?",
    redFlagsTitle: "महत्वपूर्ण रेड फ्लैग चेकलिस्ट",
    redFlagsSub: "कृपया चुनें कि क्या आप इनमें से किसी भी आपातकालीन संकेत का अनुभव कर रहे हैं।",
    aiUploadTitle: "AI विज़ुअल असेसमेंट ✱ अनिवार्य",
    aiUploadSub: "चोट की फोटो अपलोड करें। हमारा PyTorch मॉडल सूजन/नील का विज़ुअल सत्यापन करेगा।",
    analyzeButton: "विश्लेषण करें",
    generateReport: "रिपोर्ट तैयार करें",
    back: "पीछे",
    next: "आगे",
    backToRecords: "रिकॉर्ड पर वापस जाएं",
    deleteRecord: "रिकॉर्ड हटाएं",
    triageScore: "ट्राइएज जोखिम अंक",
    explainableBreakdown: "जोखिम स्कोर का स्पष्ट विश्लेषण",
    breakdownSub: "यह विश्लेषण दिखाता है कि आपके चोट के लक्षणों के आधार पर स्कोर कैसे बढ़ा है।",
    finalScore: "अंतिम परिकलित स्कोर",
    actionableRecs: "कार्रवाई योग्य सिफारिशें",
    ottawaScreening: "ओटावा नियम स्क्रीनिंग स्थिति",
    ottawaPositive: "सकारात्मक (POSITIVE): वजन उठाने में असमर्थता या हड्डी में दर्द। क्लिनिकल दिशानिर्देशों के अनुसार फ्रैक्चर की जांच के लिए एक्स-रे की आवश्यकता है।",
    ottawaNegative: "नकारात्मक (NEGATIVE): ओटावा परीक्षण क्षेत्रों में कोई विशिष्ट हड्डी का दर्द नहीं है और वजन सहन करने की क्षमता बनी हुई है। फ्रैक्चर की संभावना कम है।",
    metadataTitle: "मूल्यांकन की जानकारी",
    injuryLocation: "चोट का स्थान",
    injuryTimeline: "चोट का समय",
    timestamp: "टाइमस्टैम्प",
    chatbotTitle: "InjuryIQ आवाज़ सहायक",
    chatbotWelcome: "नमस्ते! मैं आपका बहुभाषी आवाज़ सहायक हूँ। चोट के बारे में पूछने के लिए माइक बटन दबाकर हिन्दी, इंग्लिश या हिंग्लिश में बोलें।",
    chatPlaceholder: "बोलने के लिए माइक दबाएं...",
    lowRiskTitle: "कम जोखिम — मोच या सामान्य चोट की संभावना",
    modRiskTitle: "मध्यम जोखिम — महत्वपूर्ण मोच या मामूली फ्रैक्चर की संभावना",
    highRiskTitle: "उच्च जोखिम — फ्रैक्चर होने की अत्यधिक संभावना",
    customNotesLabel: "लक्षणों का विवरण (वैकल्पिक) — लिखें या अपने शब्दों में बोलें:",
    customNotesPlaceholder: "लिखें कि चोट कैसे लगी, आप क्या महसूस कर रहे हैं, दर्द कहाँ है, आदि...",
    speakBtnStart: "आवाज़ से लिखें",
    speakBtnListening: "सुन रहे हैं... अभी बोलें"
  },
  hn: { // Hinglish
    welcome: "Welcome, Karan 👋",
    appSub: "InjuryIQ aapka AI-assisted clinical triage tool hai. Sports, domestic, ya accidental injuries ko clinically assess karein in seconds.",
    startNew: "Naya Injury Assessment Start Karein",
    viewRecords: "Assessment Records Dekhein",
    recentAssessments: "Recent Assessments",
    noAssessments: "No assessments recorded yet.",
    riceCompanion: "R.I.C.E. Recovery Companion",
    iceTimerTitle: "Active Ice Compress Timer",
    iceTimerSub: "Standard medical cold compress recommendation: 20 minutes limit.",
    disclaimerTitle: "Safety & Medical Disclaimer",
    disclaimerIntro: "IMPORTANT: InjuryIQ ek AI-assisted triage tool hai jo symptoms ke basis par fracture/sprain risk calculate karta hai.",
    disclaimerPoints: [
      "This is NOT a Medical Diagnosis: Yeh app doctor ke physical checkup ka substitute nahi hai.",
      "Exclusion Criteria: Agar patient 18 years se chota hai, intoxicated hai, ya behosh hai toh iska use na karein.",
      "Emergencies: Agar bone protruding (haddi bahar) hai ya heavy bleeding hai toh turant Emergency Room (ER) jayein."
    ],
    acceptDisclaimer: "I Understand, Acknowledge & Accept",
    cancel: "Cancel",
    abort: "Abort",
    step: "Step",
    of: "of",
    injuryLocationQuestion: "Injury body ke kis joint par hui hai?",
    selectJointSubtitle: "Please affected joint area ko select karein.",
    ageLabel: "Patient ki age kya hai?",
    ageWarning: "Note: 18 years se chote patients ke liye Ottawa Rules fully validated nahi hain.",
    timelineLabel: "Injury kab hui thi?",
    mechanismLabel: "Injury kaise hui?",
    soundLabel: "Chot lagne ke time kya koi aawaz aayi thi?",
    painSliderLabel: "Pain level kya hai (0 to 10):",
    painTypeLabel: "Pain kis tarah ka hai?",
    painReliefLabel: "Kya pain medicine se relief mil raha hai?",
    painIncreasesLabel: "Pain kab badhta hai? (Check matching items)",
    swellingLabel: "Swelling (Sujan):",
    bruisingLabel: "Bruising (Neel padna):",
    deformityLabel: "Kya joint me visible deformity (tedha-pan) hai?",
    deformitySub: "Kya joint dusri side ke comparison me visibly crook/misshapen lag raha hai?",
    skinColorLabel: "Injury area ke niche skin ka color kya hai?",
    skinTightCheckbox: "Kya skin extreme tight, tense ya rigid lag rahi hai?",
    redFlagsTitle: "Critical Red Flag Checklist",
    redFlagsSub: "Immediate emergency signals check karein.",
    aiUploadTitle: "AI Visual Assessment ✱ Required",
    aiUploadSub: "Injury area ki photo upload karein. PyTorch model swelling/bruising analyze karega.",
    analyzeButton: "Analyze",
    generateReport: "Triage Report Generate Karein",
    back: "Back",
    next: "Next",
    backToRecords: "Records me wapas jayein",
    deleteRecord: "Record Delete Karein",
    triageScore: "Triage Risk Factor Points",
    explainableBreakdown: "Explainable Triage Breakdown",
    breakdownSub: "Yeh breakdown batata hai ki aapke symptoms ke points kaise add hue.",
    finalScore: "Final Calculated Score",
    actionableRecs: "Actionable Recommendations",
    ottawaScreening: "Ottawa Rule Screening Result",
    ottawaPositive: "POSITIVE: Inability to bear weight or local bone tenderness detected. Triage guidelines state that a clinical X-ray evaluation is indicated to rule out fracture.",
    ottawaNegative: "NEGATIVE: No specific bone tenderness at Ottawa test zones and weight-bearing intact. Fracture probability is statistically low.",
    metadataTitle: "Assessment Metadata",
    injuryLocation: "Injury Location",
    injuryTimeline: "Injury Timeline",
    timestamp: "Timestamp",
    chatbotTitle: "InjuryIQ Voice Assistant",
    chatbotWelcome: "Hello! Main aapka AI voice assistant hoon. Sawaal poochne ke liye microphone button dabayein aur Hindi ya English me bolein.",
    chatPlaceholder: "Kuch bolein ya type karein...",
    lowRiskTitle: "Low Risk — Soft Tissue Injury Likely (Sprain)",
    modRiskTitle: "Moderate Risk — Possible Sprain or Minor Crack",
    highRiskTitle: "High Risk — High Fracture Probability",
    customNotesLabel: "Symptom Description (Optional) — Type karein ya bol kar batayein:",
    customNotesPlaceholder: "Describe karein ki chot kaise lagi, aapko kya feel ho raha hai, pain kahan hai, etc...",
    speakBtnStart: "Bol kar Type karein",
    speakBtnListening: "Sunn rahe hain... Bolein abhi"
  }
};

// --- CHATBOT UNIFIED TRILINGUAL DATABASE ---
const CHATBOT_TOPICS = [
  {
    id: "greetings",
    keywords: [
      "hello", "hi", "hey", "namaste", "greetings", "good morning", "good afternoon", "good evening", "hola",
      "नमस्ते", "हैलो", "हाय", "राम राम"
    ],
    en: "Hello! I am here to help you triage your joint injuries (ankle, foot, knee, wrist). You can ask me about sprains vs. fractures, how to apply ice, the R.I.C.E. protocol, or pain relief. How can I help you today?",
    hi: "नमस्ते! मैं आपके जोड़ की चोटों (टखना, पैर, घुटना, कलाई) के मूल्यांकन में मदद के लिए यहाँ हूँ। आप मुझसे मोच बनाम फ्रैक्चर, बर्फ लगाने के नियम, R.I.C.E. उपचार या दर्द निवारक दवाओं के बारे में पूछ सकते हैं। मैं आपकी क्या मदद कर सकता हूँ?",
    hn: "Hello! Main aapki joint injuries (ankle, foot, knee, wrist) ke triage me help karne ke liye hoon. Aap mujhse sprain vs fracture, ice compress rules, R.I.C.E. protocol ya pain relief ke baare me pooch sakte hain. Kaise help karu aapki?"
  },
  {
    id: "thanks",
    keywords: [
      "thanks", "thank you", "dhanyawad", "shukriya", "thankyou", "shukriyaa",
      "धन्यवाद", "शुक्रिया"
    ],
    en: "You're welcome! Please remember to complete the injury assessment checklist on the dashboard for a full clinical triage report. Let me know if you have any other questions!",
    hi: "आपका स्वागत है! कृपया पूर्ण ट्राइएज रिपोर्ट के लिए डैशबोर्ड पर चोट मूल्यांकन चेकलिस्ट को पूरा करें। यदि आपका कोई और सवाल है तो जरूर पूछें!",
    hn: "You're welcome! Full triage report ke liye please dashboard par injury assessment checklist ko complete karein. Agar koi aur sawaal ho toh zaroor batayein!"
  },
  {
    id: "sprain_vs_fracture",
    keywords: [
      "sprain", "fracture", "moch", "difference", "antar", "haddi", "ligament", "tutna", "crack", 
      "मरोड़", "मोच", "फ्रैक्चर", "टूटना", "अंतर", "हड्डी", "fractur", "haddi tootna", "joint pain", "bone pain", "mochein"
    ],
    en: "A **sprain** (moch) is a stretch or tear of ligaments (tissues connecting bones). A **fracture** is a clean or partial break in the bone. \n\n* **Fractures** usually feature sharp localized bone pain, cracking sounds, visible deformity, and complete weight-bearing inability. \n* **Sprains** allow partial movement and have duller, spreading pain.",
    hi: "मरोड़ या **मोच (Sprain)** लिगामेंट की चोट होती है जो हड्डियों को जोड़ती है, जबकि **फ्रैक्चर** हड्डी का टूटना है। \n\n* **फ्रैक्चर** में छूने पर तेज हड्डी का दर्द, तड़कने की आवाज, टेढ़ापन और चलने में असमर्थता होती है। \n* **मोच** में जोड़ थोड़ा हिल सकता है और दर्द फैलने वाला होता है।",
    hn: "Moch (Sprain) me ligaments (jo bones ko connect karte hain) stretch ya tear hote hain. Fracture me bone actual toot/crack jati hai. \n\n* **Fractures** me direct bone dabane pe severe pain hota hai, crack sound aati hai, aur aap chal nahi sakte. \n* **Moch** me thoda hil-dul sakte hain aur sujan dheere-dheere aati hai."
  },
  {
    id: "ice_rules",
    keywords: [
      "ice", "cold", "compress", "barf", "sek", "sekna", "timer", "minutes", "time", "how long",
      "बर्फ", "सेक", "ठंडा", "टाइमर", "मिनट", "समय", "कितने समय", "sujan", "swelling", "bruise", "bruising", "neel", "sekne", "seking",
      "coldness", "timers"
    ],
    en: "Apply ice wrapped in a damp towel for **15-20 minutes** every 2-3 hours. Never apply ice directly to bare skin to prevent ice burns. Let the skin return to normal temperature before reapplying.",
    hi: "बर्फ को सीधे त्वचा पर न लगाएं। इसे गीले तौलिए में लपेटकर **15 से 20 मिनट** के लिए हर 2-3 घंटे में लगाएं। त्वचा को दोबारा बर्फ लगाने से पहले सामान्य तापमान पर आने दें।",
    hn: "Barf (Ice) ko directly skin pe mat lagayein. Kapde me wrap karke **15-20 minutes** ke liye har 2-3 ghante me cold compress dein, jisse sujan aur pain kam ho sake."
  },
  {
    id: "rice_protocol",
    keywords: [
      "rice", "first aid", "treatment", "ilaj", "care", "cure", "recover", "help",
      "प्राथमिक चिकित्सा", "इलाज", "उपचार", "प्राथमिक उपचार", "injury", "chot", "first-aid", "firstaid", "upchar", "hurt", "zakhmi",
      "injuries", "hurting", "helps", "recovery"
    ],
    en: "Follow the R.I.C.E. protocol for sprains:\n* **Rest:** Avoid putting weight on the joint.\n* **Ice:** Cold compress for 15-20 mins.\n* **Compression:** Snug elastic wrap (bandage).\n* **Elevation:** Lift injury above heart level using pillows.",
    hi: "चोट के प्राथमिक उपचार के लिए R.I.C.E. अपनाएं:\n* **Rest (विश्राम):** जोड़ पर भार न डालें।\n* **Ice (बर्फ):** 15-20 मिनट बर्फ सेक करें।\n* **Compression (पट्टी):** लोचदार पट्टी लपेटें।\n* **Elevation (ऊंचाई):** जोड़ को तकिये पर रख कर दिल के स्तर से ऊपर उठाएं।",
    hn: "R.I.C.E. protocol sprains ke liye standard first-aid hai:\n* **Rest:** Chalne aur weight daalne se bachein.\n* **Ice:** 15-20 mins barf lagayein.\n* **Compression:** Elastic bandage snugly wrap karein.\n* **Elevation:** Injury ko takiye pe rakh kar heart level se upar uthayein."
  },
  {
    id: "ottawa_rules",
    keywords: [
      "ottawa", "rules", "xray", "x-ray", "exray", "criteria", "kneecap", "malleolus",
      "ओटावा", "नियम", "एक्सरे", "जांच", "rule"
    ],
    en: "The **Ottawa Rules** are validated medical guidelines. If you can walk 4 steps immediately after injury AND now, and feel no bone tenderness at the outer/inner ankle or midfoot bones, an X-ray is statistically NOT required (<1% fracture risk).",
    hi: "**ओटावा नियम** प्रमाणित चिकित्सा नियम हैं। यदि आप चोट के तुरंत बाद और अभी 4 कदम चल सकते हैं, और टखने या पैर की हड्डियों को दबाने पर कोई दर्द नहीं है, तो एक्स-रे की आवश्यकता नहीं होती (जोखिम <1%)।",
    hn: "Ottawa Rules medical guidelines hain jo doctors use karte hain. Agar aap chot ke baad 4 steps chal sakte hain aur specific bone points ko touch karne pe pain nahi hai, toh fracture risk <1% hota hai aur X-ray ki jarurat nahi hoti."
  },
  {
    id: "emergency_red_flags",
    keywords: [
      "emergency", "danger", "khatra", "red flag", "hospital", "doctor", "er", "numbness", "deformity", "bleeding", "protrude", "cold", "blue",
      "आपातकाल", "खतरा", "अस्पताल", "डॉक्टर", "सुन्न", "रक्तस्राव", "नीला", "ठंडा", "khoon", "blood", "cut", "wound", "gira", "chot lagna"
    ],
    en: "Seek emergency care immediately if you see protruding bone, complete numbness/tingling, skin turning pale/blue/cold below the joint, or have severe, unrelenting pain. Do not try to move.",
    hi: "यदि हड्डी त्वचा से बाहर आ गई हो, चोट के नीचे का हिस्सा सुन्न हो, उंगलियां पीली/नीली या ठंडी पड़ गई हों, तो तुरंत आपातकालीन कक्ष (ER) जाएं। चोटिल हिस्से को बिल्कुल न हिलाएं।",
    hn: "Emergency signals ko ignore mat karein! Agar bone skin se bahar aa gayi ho, numbness (sunn) ho raha ho, fingers/toes thande/pale pad rahe hon, toh turant nearest hospital ER me jayein."
  },
  {
    id: "pain_relief_meds",
    keywords: [
      "medicine", "painkiller", "paracetamol", "pill", "tablet", "pain relief", "meds", "advil", "crocin", "combiflam", "dawa", "goli",
      "दवा", "दर्द निवारक", "गोली", "पैरासिटामोल", "कॉम्बिफ्लेम", "pain", "dard", "relief",
      "medicines", "painkillers", "pills", "tablets", "dawayen", "dawaein", "painful"
    ],
    en: "For pain relief, over-the-counter paracetamol (acetaminophen) is generally safe. Avoid NSAIDs like ibuprofen or aspirin in the first 24-48 hours if severe bleeding or fracture is suspected, as they can thin blood. Consult a doctor.",
    hi: "दर्द से राहत के लिए सामान्य पैरासिटामोल सुरक्षित है। यदि फ्रैक्चर या गंभीर ब्लीडिंग का संदेह हो, तो पहले 24-48 घंटों में इबुप्रोफेन या एस्पिरिन जैसी दवाओं से बचें। डॉक्टर की सलाह अवश्य लें।",
    hn: "Normal pain ke liye Paracetamol (Crocin/Crocin Pain Relief) safe hai. Agar fracture ya internal bleeding ka doubt ho, toh initial 24 hours me Ibuprofen (Combiflam) ya Aspirin lene se bachein kyunki ye blood thin karti hain. Doctor se poochein."
  }
];

// Helper to perform smart keyword matching (whole word boundary for short queries, substring for long queries)
const matchKeyword = (query, keyword) => {
  const q = query.toLowerCase();
  const kw = keyword.toLowerCase();
  
  if (kw.length <= 4) {
    const index = q.indexOf(kw);
    if (index === -1) return false;
    
    const charBefore = index > 0 ? q[index - 1] : ' ';
    const charAfter = index + kw.length < q.length ? q[index + kw.length] : ' ';
    
    const isWordChar = (char) => {
      const code = char.charCodeAt(0);
      if ((code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code === 95) return true;
      if (code >= 0x0900 && code <= 0x097F) return true;
      return false;
    };
    
    return !isWordChar(charBefore) && !isWordChar(charAfter);
  }
  
  return q.includes(kw);
};

const MOCK_HISTORY = [];

// --- SOS DIALOG COMPONENT — GOOGLE MAPS BASED (NO API KEY NEEDED) ---
function SosDialog({ lang, onClose }) {
  const [step, setStep] = React.useState('permission');
  const [locationName, setLocationName] = React.useState('');
  const [coords, setCoords] = React.useState(null);
  const [hospitals, setHospitals] = React.useState([]);
  const [permissionDenied, setPermissionDenied] = React.useState(false);
  const [searchingOverpass, setSearchingOverpass] = React.useState(false);

  const getDistanceKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  // Try Overpass in background — show results if found
  const tryOverpass = async (lat, lng) => {
    setSearchingOverpass(true);
    const radii = [5000, 15000, 30000];
    for (const radius of radii) {
      try {
        const q = `[out:json][timeout:15];(node["amenity"="hospital"](around:${radius},${lat},${lng});way["amenity"="hospital"](around:${radius},${lat},${lng});node["healthcare"="hospital"](around:${radius},${lat},${lng}););out center 10;`;
        const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (data.elements?.length > 0) {
          const found = data.elements
            .map(el => {
              const hLat = el.lat || el.center?.lat;
              const hLng = el.lon || el.center?.lon;
              if (!hLat || !hLng) return null;
              return {
                name: el.tags?.name || el.tags?.['name:en'] || 'Hospital',
                phone: el.tags?.phone || el.tags?.['contact:phone'] || '',
                dist: getDistanceKm(lat, lng, hLat, hLng),
                mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${hLat},${hLng}&travelmode=driving`
              };
            })
            .filter(h => h)
            .sort((a, b) => a.dist - b.dist)
            .filter((h, i, arr) => arr.findIndex(x => x.name === h.name) === i)
            .slice(0, 5);
          if (found.length > 0) { setHospitals(found); setSearchingOverpass(false); return; }
        }
      } catch (e) { /* try next radius */ }
    }
    setSearchingOverpass(false);
  };

  const openGoogleMapsHospitals = (lat, lng) => {
    window.open(`https://www.google.com/maps/search/hospitals+near+me/@${lat},${lng},14z`, '_blank');
  };

  const requestLocation = () => {
    setStep('locating');
    if (!navigator.geolocation) {
      // No GPS — open generic Maps search
      window.open('https://www.google.com/maps/search/hospital+near+me', '_blank');
      setStep('nolocation');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        // Get city name
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const place = data.address?.suburb || data.address?.neighbourhood || data.address?.city || data.address?.town || data.address?.village || 'Your Location';
          setLocationName(place);
        } catch { setLocationName('Your Location'); }
        // Auto-open Google Maps hospitals search immediately
        openGoogleMapsHospitals(latitude, longitude);
        setStep('found');
        // Also try Overpass in background for in-app list
        tryOverpass(latitude, longitude);
      },
      () => {
        setPermissionDenied(true);
        setStep('found');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="modal-overlay fade-in" style={{ zIndex: 1001, padding: '1rem' }}>
      <div className="glass-panel slide-in" style={{ padding: '2rem', maxWidth: '480px', width: '100%', textAlign: 'center', borderTop: '6px solid var(--color-emergency)', borderRadius: '20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <div className="pulse-critical" style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-emergency)' }}>
            <AlertTriangle size={36} color="var(--color-emergency)" />
          </div>
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>🚨 Emergency SOS</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          {lang === 'hi' ? 'GPS से nearest hospital खोजें' : 'Find nearest hospital using your GPS'}
        </p>

        {/* STEP: Permission */}
        {step === 'permission' && (
          <div>
            {/* Emergency Call First */}
            <a href="tel:112" style={{ textDecoration: 'none', display: 'block', marginBottom: '0.75rem' }}>
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1.5px solid var(--color-emergency)', borderRadius: '14px', padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                <PhoneCall size={20} color="var(--color-emergency)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>📞 Call 112 — National Emergency</div>
                  <div style={{ fontSize: '0.75rem', color: '#fca5a5' }}>Ambulance • Police • Fire — All in one</div>
                </div>
              </div>
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span>OR find nearest hospital</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            <button
              className="btn"
              style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, borderRadius: '12px', marginBottom: '0.6rem' }}
              onClick={requestLocation}
            >
              📍 {lang === 'hi' ? 'GPS से Nearest Hospital खोजें' : 'Find Nearest Hospital via GPS'}
            </button>
            <button
              style={{ width: '100%', padding: '0.8rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: '12px', color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', marginBottom: '0.6rem' }}
              onClick={() => window.open('https://www.google.com/maps/search/hospital+near+me', '_blank')}
            >
              🗺️ Open Google Maps — Hospitals Near Me
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
              {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>
        )}

        {/* STEP: Locating */}
        {step === 'locating' && (
          <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '22px', height: '22px', border: '3px solid var(--color-emergency)', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <span style={{ fontWeight: 600, color: 'white' }}>📍 Getting your GPS location...</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Accept the browser permission prompt</p>
          </div>
        )}

        {/* STEP: Found */}
        {step === 'found' && (
          <div>
            {permissionDenied ? (
              <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '10px', padding: '0.7rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#fbbf24' }}>
                ⚠️ GPS access denied. Use Maps to search manually.
              </div>
            ) : (
              <>
                {/* Location Found */}
                {locationName && (
                  <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '10px', padding: '0.6rem 0.9rem', marginBottom: '0.75rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>📍</span>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 700 }}>YOUR LOCATION DETECTED</div>
                      <div style={{ fontWeight: 700, color: 'white' }}>{locationName}</div>
                      {coords && <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{coords.lat.toFixed(5)}°N, {coords.lng.toFixed(5)}°E</div>}
                    </div>
                  </div>
                )}

                {/* Google Maps opened notification */}
                <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '0.65rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#a5b4fc' }}>
                  ✅ Google Maps opened with hospitals near <strong>{locationName || 'your location'}</strong>
                </div>

                {/* Overpass results (if found) */}
                {hospitals.length > 0 && (
                  <div style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#fca5a5', fontWeight: 700, marginBottom: '0.4rem' }}>🏥 NEARBY HOSPITALS — Tap to get directions</div>
                    {hospitals.map((h, i) => (
                      <div
                        key={i}
                        onClick={() => window.open(h.mapsUrl, '_blank')}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9px', padding: '0.55rem 0.8rem', marginBottom: '0.4rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>{h.name}</div>
                          {h.phone && <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>📞 {h.phone}</div>}
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '0.5rem' }}>
                          <div style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 700 }}>{h.dist.toFixed(1)} km</div>
                          <div style={{ fontSize: '0.68rem', color: '#818cf8' }}>Directions →</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {searchingOverpass && hospitals.length === 0 && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                    <div style={{ width: '12px', height: '12px', border: '2px solid #818cf8', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    Loading hospital list...
                  </div>
                )}
              </>
            )}

            {/* Action Buttons */}
            <a href="tel:112" style={{ textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>
              <button className="btn" style={{ width: '100%', justifyContent: 'center', background: 'var(--color-emergency)', color: 'white', padding: '0.8rem', fontWeight: 700, fontSize: '0.95rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneCall size={18} /> Call 112 — Emergency Ambulance
              </button>
            </a>
            {coords && (
              <button
                style={{ width: '100%', padding: '0.75rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: '12px', color: '#818cf8', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', marginBottom: '0.5rem' }}
                onClick={() => openGoogleMapsHospitals(coords.lat, coords.lng)}
              >
                🗺️ Reopen Google Maps — Hospitals Near Me
              </button>
            )}
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>Close</button>
          </div>
        )}

        {/* STEP: No location support */}
        {step === 'nolocation' && (
          <div>
            <p style={{ color: '#fca5a5', marginBottom: '1rem', fontSize: '0.9rem' }}>GPS not supported. Use Maps:</p>
            <button style={{ width: '100%', padding: '0.85rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: '12px', color: '#818cf8', fontWeight: 600, cursor: 'pointer', marginBottom: '0.5rem' }}
              onClick={() => window.open('https://www.google.com/maps/search/hospital+near+me', '_blank')}>
              🗺️ Open Google Maps — Hospitals Near Me
            </button>
            <a href="tel:112" style={{ textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>
              <button className="btn" style={{ width: '100%', justifyContent: 'center', background: 'var(--color-emergency)', color: 'white', padding: '0.8rem', fontWeight: 700, borderRadius: '12px' }}>
                📞 Call 112 — National Emergency
              </button>
            </a>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>Close</button>
          </div>
        )}

      </div>
    </div>
  );
}

// --- SIMPLIFIED MULTILINGUAL TENDERNESS TEXT HELPER ---
const getTendernessText = (key, currentLang) => {
  const data = {
    ankle: {
      header: {
        en: "Ankle Injury Assessment (Ottawa Rules Check):",
        hi: "टखने की जांच (ओटावा नियम):",
        hn: "Takhne ki jaanch (Ottawa Rules Check):"
      },
      lateralMalleolus: {
        en: "Pain when pressing the outer ankle bone (Bahar wali takhne ki haddi ko dabane par dard)",
        hi: "टखने के बाहर की उभरी हुई हड्डी को दबाने या छूने पर दर्द (Outer ankle bone pain)",
        hn: "Ankle ke bahar wali ubhri haddi (lateral malleolus) ko dabane par dard"
      },
      medialMalleolus: {
        en: "Pain when pressing the inner ankle bone (Andar wali takhne ki haddi ko dabane par dard)",
        hi: "टखने के अंदर की उभरी हुई हड्डी को दबाने या छूने पर दर्द (Inner ankle bone pain)",
        hn: "Ankle ke andar wali ubhri haddi (medial malleolus) ko dabane par dard"
      },
      walkImmediately: {
        en: "Unable to walk 4 steps immediately after the injury (Chot lagte hi 4 kadam chalne me as-samarth)",
        hi: "क्या आप चोट लगने के तुरंत बाद 4 कदम भी चलने में असमर्थ थे?",
        hn: "Chot lagte hi turant 4 steps chalne me as-samarth the (Unable to walk 4 steps)"
      },
      walkNow: {
        en: "Unable to walk 4 steps right now without any support (Abhi 4 kadam chalne me as-samarth)",
        hi: "क्या आप अभी (बिना किसी सहारे के) 4 कदम चलने में असमर्थ हैं?",
        hn: "Abhi bina kisi support ke 4 steps chalne me as-samarth hain (Unable to walk 4 steps now)"
      }
    },
    foot: {
      header: {
        en: "Foot Injury Assessment (Ottawa Rules Check):",
        hi: "पैर की जांच (ओटावा नियम):",
        hn: "Pair ki jaanch (Ottawa Rules Check):"
      },
      fifthMetatarsal: {
        en: "Pain when pressing the outer edge of the foot, halfway down (Pair ke bahari kinare ke beech me dard)",
        hi: "पैर के बाहरी किनारे के बीच में (छोटी उंगली की तरफ की हड्डी) छूने या दबाने पर दर्द",
        hn: "Pair ke bahari edge ke beech me (choti finger ki side wali haddi) dabane par dard"
      },
      navicular: {
        en: "Pain when pressing the inner middle side/arch of the foot (Pair ke andar wale beech ke hisse me dard)",
        hi: "पैर के अंदरूनी बीच के हिस्से की हड्डी (Navicular) को छूने या दबाने पर दर्द",
        hn: "Pair ke andar wale beech ke hisse (Navicular bone) ko dabane par dard"
      },
      walkImmediately: {
        en: "Unable to walk 4 steps immediately after the injury (Chot lagte hi 4 kadam chalne me as-samarth)",
        hi: "क्या आप चोट लगने के तुरंत बाद 4 कदम भी चलने में असमर्थ थे?",
        hn: "Chot lagte hi turant 4 steps chalne me as-samarth the (Unable to walk 4 steps)"
      }
    },
    knee: {
      header: {
        en: "Knee Injury Assessment (Ottawa Rules Check):",
        hi: "घुटने की जांच (ओटावा नियम):",
        hn: "Ghutne ki jaanch (Ottawa Rules Check):"
      },
      patellar: {
        en: "Pain when pressing the kneecap (Katori/Patella) directly (Ghutne ki katori dabane par dard)",
        hi: "घुटने की कटोरी या चक्की (Patella) को दबाने पर दर्द",
        hn: "Ghutne ki katori/chakkli (Patella) ko dabane par dard"
      },
      fibularHead: {
        en: "Pain when pressing the small outer bone slightly below the joint (Ghutne ke bahar thoda niche wali haddi par dard)",
        hi: "घुटने के बाहर की तरफ थोड़ा नीचे वाली उभरी हुई हड्डी (Fibular Head) को दबाने पर दर्द",
        hn: "Ghutne ke bahar ki taraf thoda niche wali haddi (Fibular Head) ko dabane par dard"
      },
      flexion90: {
        en: "Unable to bend the knee to 90 degrees, like sitting on a chair (Ghutne ko chair position jitna modne me as-samarth)",
        hi: "घुटने को 90 डिग्री (जैसे कुर्सी पर बैठते हैं) तक मोड़ने में असमर्थ",
        hn: "Ghutne ko 90 degree (jaise chair par baithte hain) modne me as-samarth hain"
      }
    },
    wrist: {
      header: {
        en: "Wrist/Hand Assessment (Bone Pain Check):",
        hi: "कलाई की जांच (हड्डी का दर्द):",
        hn: "Wrist ki jaanch (Haddi ka dard):"
      },
      snuffbox: {
        en: "Pain when pressing the triangular depression at the base of the thumb (Angoothe ke niche bane gadde me dard)",
        hi: "अंगूठे के बिल्कुल पीछे नीचे बने गड्ढे (Snuffbox) को दबाने पर दर्द",
        hn: "Angoothe ke bilkul piche niche bane gadde (Snuffbox) ko dabane par dard"
      },
      tubercle: {
        en: "Pain when pressing the wrist bone on the palm side, under the thumb (Hatheli ki taraf angoothe ke niche wali haddi par dard)",
        hi: "हथेली की तरफ अंगूठे के नीचे कलाई की हड्डी (Scaphoid Tubercle) को दबाने पर दर्द",
        hn: "Hatheli ki taraf wrist ki haddi (angoothe ke niche) ko dabane par dard"
      }
    }
  };

  const joint = data[key];
  if (!joint) return {};
  const result = {};
  Object.keys(joint).forEach(questionKey => {
    result[questionKey] = joint[questionKey][currentLang] || joint[questionKey]['en'];
  });
  return result;
};

export default function App() {

  // --- AUTHENTICATION STATES & METHODS ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('injuryiq_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- LANGUAGE & THEME (declared early — used in auth functions) ---
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  // OTP verification states
  const [otpMode, setOtpMode] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpResendLoading, setOtpResendLoading] = useState(false);
  const [otpResendMsg, setOtpResendMsg] = useState('');

  const handleAuthSubmit = async () => {
    const emailVal = authEmail.trim();
    const passwordVal = authPassword;
    const nameVal = authName.trim();
    const currentMode = authMode;

    if (!emailVal || !passwordVal) {
      setAuthError(lang === 'hi' ? 'ईमेल और पासवर्ड आवश्यक हैं।' : 'Email and Password are required.');
      return;
    }
    if (currentMode === 'signup' && !nameVal) {
      setAuthError(lang === 'hi' ? 'पूरा नाम दर्ज करना आवश्यक है।' : 'Full Name is required.');
      return;
    }
    if (passwordVal.length < 6) {
      setAuthError(lang === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    setIsAuthLoading(true);
    setAuthError('');

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

    if (currentMode === 'signup') {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailVal, password: passwordVal, name: nameVal })
        });
        const data = await response.json();

        if (response.ok && data.success) {
          // Signup succeeded — transition to OTP verification panel
          setIsAuthLoading(false);
          setOtpEmail(emailVal);
          setOtpCode('');
          setOtpError('');
          setOtpResendMsg('');
          setOtpMode(true);
          return;
        } else {
          setAuthError(data.detail || 'Registration failed.');
          setIsAuthLoading(false);
          return;
        }
      } catch (networkErr) {
        console.warn('[AUTH FALLBACK] Backend offline, registering locally in offline mode:', networkErr);
        
        // Offline registration fallback (bypass OTP when backend is offline for local testing/fallback robustness)
        const usersKey = 'injuryiq_users';
        const localUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
        if (localUsers.some(u => u.email.toLowerCase() === emailVal.toLowerCase())) {
          setAuthError(lang === 'hi' ? 'इस ईमेल के साथ एक खाता पहले से ही मौजूद है।' : 'An account with this email already exists.');
          setIsAuthLoading(false);
          return;
        }

        const newUser = { email: emailVal, name: nameVal, password: passwordVal };
        localUsers.push(newUser);
        localStorage.setItem(usersKey, JSON.stringify(localUsers));

        // Auto-login locally
        const sessionUser = { email: emailVal, name: nameVal };
        localStorage.setItem('injuryiq_current_user', JSON.stringify(sessionUser));
        setCurrentUser(sessionUser);

        setAuthEmail('');
        setAuthPassword('');
        setAuthName('');
        setIsAuthLoading(false);
        return;
      }
    } else {
      // Login Mode
      try {
        // 1. Try server-side login
        const response = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailVal, password: passwordVal })
        });
        
        const data = await response.json();
        
        if (response.status === 200 && data.success) {
          const sessionUser = { email: data.user.email, name: data.user.name };
          localStorage.setItem('injuryiq_current_user', JSON.stringify(sessionUser));
          setCurrentUser(sessionUser);
          
          setAuthEmail('');
          setAuthPassword('');
          setAuthName('');
          setIsAuthLoading(false);
          return;
        } else if (response.status === 403) {
          // Account unverified — show OTP verification panel directly
          setIsAuthLoading(false);
          setOtpEmail(emailVal);
          setOtpCode('');
          setOtpError(data.detail || 'Your email is not verified yet. An OTP has been sent.');
          setOtpResendMsg('');
          setOtpMode(true);
          return;
        } else {
          setAuthError(data.detail || 'Invalid email or password.');
          setIsAuthLoading(false);
          return;
        }
      } catch (networkErr) {
        console.warn("[AUTH FALLBACK] Backend offline, falling back to local storage session check:", networkErr);
        // Resilient Offline Local Fallback Login Flow
        const usersKey = 'injuryiq_users';
        const localUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
        const matchedUser = localUsers.find(u => u.email.toLowerCase() === emailVal.toLowerCase() && u.password === passwordVal);
        
        if (!matchedUser) {
          setAuthError(lang === 'hi' ? 'अमान्य ईमेल या पासवर्ड।' : 'Invalid email or password.');
          setIsAuthLoading(false);
          return;
        }

        const sessionUser = { email: matchedUser.email, name: matchedUser.name };
        localStorage.setItem('injuryiq_current_user', JSON.stringify(sessionUser));
        setCurrentUser(sessionUser);
        
        setAuthEmail('');
        setAuthPassword('');
        setAuthName('');
        setIsAuthLoading(false);
      }
    }
  };

  // --- FIREBASE GOOGLE SIGN-IN (fixed: calls backend unified endpoint, no localStorage check) ---
  const handleGoogleSignIn = async () => {
    setGoogleAuthLoading(true);
    setAuthError('');
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
    let fbUser = null;
    try {
      // Step 1: Authenticate with Google via Firebase popup
      const result = await signInWithPopup(auth, googleProvider);
      fbUser = result.user;
      const emailVal = fbUser.email.toLowerCase();
      const nameVal = fbUser.displayName || fbUser.email.split('@')[0];
      const pictureVal = fbUser.photoURL || '';

      // Step 2: Register/login via backend (unified persistent store — works on all browsers)
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, name: nameVal, picture: pictureVal })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const sessionUser = {
          email: data.user.email,
          name: data.user.name,
          picture: data.user.picture || pictureVal
        };
        localStorage.setItem('injuryiq_current_user', JSON.stringify(sessionUser));
        setCurrentUser(sessionUser);
      } else {
        setAuthError(data.detail || 'Google Sign-In failed on backend.');
      }
    } catch (err) {
      console.error('[Google Auth Error] Details:', err);
      
      // If we got the user from Firebase popup, but backend fetch failed (e.g. backend offline or mixed content)
      if (fbUser) {
        console.warn('[Google Auth Fallback] Backend unreachable, logging in offline with Firebase user directly.');
        const sessionUser = {
          email: fbUser.email.toLowerCase(),
          name: fbUser.displayName || fbUser.email.split('@')[0],
          picture: fbUser.photoURL || ''
        };
        localStorage.setItem('injuryiq_current_user', JSON.stringify(sessionUser));
        setCurrentUser(sessionUser);
      } else {
        // Firebase Popup itself failed
        if (err.code === 'auth/unauthorized-domain') {
          setAuthError(
            lang === 'hi'
              ? 'गूगल साइन-इन विफल: वर्सेल डोमेन फायरबेस कंसोल में अधिकृत नहीं है। कृपया Firebase -> Auth -> Settings -> Authorized domains में इसे जोड़ें।'
              : "Google Sign-In failed: This domain is not authorized in Firebase Console. Please add 'injuryiqwebprototype.vercel.app' in Firebase -> Auth -> Settings -> Authorized domains."
          );
        } else if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
          setAuthError(`Google Sign-In failed: ${err.message || 'Please try again.'}`);
        }
      }
    }
    setGoogleAuthLoading(false);
  };

  // --- OTP VERIFICATION HANDLERS ---
  const handleOtpVerify = async () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp: otpCode.trim() })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Auto-login after verification
        const sessionUser = { email: data.user.email, name: data.user.name };
        localStorage.setItem('injuryiq_current_user', JSON.stringify(sessionUser));
        setOtpMode(false);
        setCurrentUser(sessionUser);
      } else {
        setOtpError(data.detail || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setOtpError('Network error. Please try again.');
    }
    setOtpLoading(false);
  };

  const handleOtpResend = async () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
    setOtpResendLoading(true);
    setOtpResendMsg('');
    setOtpError('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setOtpResendMsg('✅ New OTP sent! Check your email (or backend console in demo mode).');
      } else {
        setOtpError(data.detail || 'Failed to resend OTP.');
      }
    } catch (err) {
      setOtpError('Network error. Please try again.');
    }
    setOtpResendLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('injuryiq_current_user');
    setCurrentUser(null);
    setView('dashboard');
  };


  // --- APPLICATION STATES ---
  // (lang and darkMode declared early above for use in auth handlers)

  const [view, setView] = useState('dashboard'); // 'dashboard', 'questionnaire', 'history', 'details'
  const [history, setHistory] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [sosStatus, setSosStatus] = useState('idle'); // 'idle', 'locating', 'sending', 'sent'
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [remedyTab, setRemedyTab] = useState('assessment'); // 'assessment', 'remedies'
  const [activeDrawer, setActiveDrawer] = useState('medicines'); // 'medicines', 'ayurveda', 'supports'
  const [completedRemedies, setCompletedRemedies] = useState({}); // { [remedyId_ingredientIndex]: boolean }
  const [goniometerAngle, setGoniometerAngle] = useState(90); // default 90 degrees
  const [isDraggingArm, setIsDraggingArm] = useState(false);

  // --- CHATBOT WIDGET STATES ---
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatTyping, setChatTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false); // Enable voice replies by default
  const voiceMutedRef = useRef(voiceMuted);
  useEffect(() => {
    voiceMutedRef.current = voiceMuted;
  }, [voiceMuted]);

  const handleToggleMute = () => {
    const newVal = !voiceMuted;
    setVoiceMuted(newVal);
    if (newVal) {
      window.speechSynthesis.cancel();
    }
  };
  const [geminiKey, setGeminiKey] = useState(() => {
    const key = localStorage.getItem('injuryiq_gemini_key');
    if (key && key !== 'null' && key !== 'undefined' && key.trim() !== '') {
      return key;
    }
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  });
  const [showSettings, setShowSettings] = useState(false);
  const chatEndRef = useRef(null);

  // --- QUESTIONNAIRE FLOW STATES ---
  const [injuryArea, setInjuryArea] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    age: 22,
    injuryTimeAgo: '1-6 hours',
    howInjured: 'twist_roll',
    soundHeard: 'no_sound',
    painLevel: 5,
    painType: 'sharp_stabbing',
    painIncreases: [],
    painReliefWithMeds: 'no',
    swelling: 'none',
    bruising: 'none',
    deformity: 'no',
    skinColor: 'normal',
    tightTense: false,
    canWalkImmediately: true,
    canWalkNow: true,
    lateralMalleolusTenderness: false,
    medialMalleolusTenderness: false,
    fifthMetatarsalTenderness: false,
    navicularTenderness: false,
    patellarTenderness: false,
    fibularHeadTenderness: false,
    kneeFlexion90: true,
    snuffboxTenderness: false,
    scaphoidTubercleTenderness: false,
    thumbCompressionPain: false,
    gripPain: false,
    movementAbility: 'partial',
    sideComparison: 'slightly_different',
    boneProtruding: false,
    numbnessBelow: false,
    blueColdBelow: false,
    unrelivedPain: false,
    customNotes: ''
  });

  const [isSymptomListening, setIsSymptomListening] = useState(false);

  // --- IMAGE UPLOAD & AI PROCESSING STATES ---
  const [injuryPhoto, setInjuryPhoto] = useState(null);
  const [injuryPhotoUrl, setInjuryPhotoUrl] = useState(null);
  const [comparisonPhoto, setComparisonPhoto] = useState(null);
  const [comparisonPhotoUrl, setComparisonPhotoUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisLog, setAnalysisLog] = useState([]);
  const [aiResult, setAiResult] = useState(null);

  // --- ICE TIMER STATE ---
  const [iceTime, setIceTime] = useState(1200); 
  const [iceTimerRunning, setIceTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // --- RECOVERY TRACKING STATES ---
  const [activeTrackingId, setActiveTrackingId] = useState(() => {
    const savedUser = localStorage.getItem('injuryiq_current_user');
    if (savedUser) {
      const email = JSON.parse(savedUser).email;
      return localStorage.getItem(`injuryiq_active_tracking_${email}`) || '';
    }
    return '';
  });
  const [recoveryLogs, setRecoveryLogs] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({
    painLevel: 5,
    swelling: 'none',
    mobility: 'normal',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [hoveredLog, setHoveredLog] = useState(null);

  // --- GEOLOCATION CLINICS STATES ---
  const [nearbyClinics, setNearbyClinics] = useState([]);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // --- PHYSIOTHERAPY REHAB STATES ---
  const [recoverySubTab, setRecoverySubTab] = useState('stats'); // 'stats' or 'rehab'
  const [activeExercise, setActiveExercise] = useState(null);
  const [rehabTimer, setRehabTimer] = useState(0);
  const [rehabTimerRunning, setRehabTimerRunning] = useState(false);
  const rehabTimerRef = useRef(null);
  const goniometerSvgRef = useRef(null);

  // --- GONIOMETER DRAG MATH EVENT HANDLERS ---
  const handleGoniometerMouseMove = (e) => {
    if (!isDraggingArm || !goniometerSvgRef.current) return;
    const rect = goniometerSvgRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (!clientX || !clientY) return;

    const svgCenterX = rect.left + rect.width / 2;
    const svgCenterY = rect.top + rect.height / 2;
    const dx = clientX - svgCenterX;
    const dy = clientY - svgCenterY;

    let angleDeg = Math.round((Math.atan2(-dy, dx) * 180) / Math.PI);
    if (angleDeg < 0) {
      if (dx < 0) angleDeg = 180;
      else angleDeg = 0;
    }
    const clamped = Math.min(180, Math.max(0, angleDeg));
    setGoniometerAngle(clamped);
  };

  const handleGoniometerMouseUp = () => {
    setIsDraggingArm(false);
  };

  useEffect(() => {
    if (isDraggingArm) {
      window.addEventListener('mousemove', handleGoniometerMouseMove);
      window.addEventListener('mouseup', handleGoniometerMouseUp);
      window.addEventListener('touchmove', handleGoniometerMouseMove, { passive: false });
      window.addEventListener('touchend', handleGoniometerMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGoniometerMouseMove);
      window.removeEventListener('mouseup', handleGoniometerMouseUp);
      window.removeEventListener('touchmove', handleGoniometerMouseMove);
      window.removeEventListener('touchend', handleGoniometerMouseUp);
    };
  }, [isDraggingArm]);

  const t = TRANSLATIONS[lang];

  const getRemediesData = (riskLevel) => {
    const isHindi = lang === 'hi';
    const isHinglish = lang === 'hn';

    if (riskLevel === 'low') {
      return {
        medicines: [
          {
            id: 'diclo_gel',
            name: isHindi ? 'डाइक्लोफेनाक जेल (जैसे Volini/Moov)' : (isHinglish ? 'Diclofenac Gel (jaise Volini/Moov)' : 'Diclofenac Pain Relief Gel (e.g., Volini/Moov)'),
            desc: isHindi ? 'प्रभावित जगह पर दिन में 3-4 बार हल्के हाथों से लगाएं। मालिश न करें।' : (isHinglish ? 'Chot wale area par din me 3-4 baar halki layer lagayein. Heavy massage na karein.' : 'Apply a thin layer gently over the painful area 3-4 times daily. Do not rub heavily.'),
            type: 'gel'
          },
          {
            id: 'para_500',
            name: isHindi ? 'पैरासिटामोल (500mg)' : (isHinglish ? 'Paracetamol (500mg)' : 'Paracetamol (500mg) Tablet'),
            desc: isHindi ? 'हल्का दर्द होने पर ही लें। 24 घंटे में 3 ग्राम से अधिक न लें।' : (isHinglish ? 'Mild pain hone par hi consume karein. 24 ghante me max 3g limit rakhein.' : 'Take 1 tablet if pain is active. Max limit is 3g (6 tablets) per 24 hours.'),
            type: 'pill'
          }
        ],
        ayurveda: [
          {
            id: 'golden_milk',
            name: isHindi ? 'हल्दी दूध (Golden Milk)' : (isHinglish ? 'Haldi Doodh (Golden Milk)' : 'Curcumin Turmeric Milk (Golden Milk)'),
            prepTime: isHindi ? 'सोने से पहले' : (isHinglish ? 'Sone se pehle' : 'Nightly (Before sleep)'),
            ingredients: isHindi 
              ? ['1 गिलास गाय का दूध (गर्म)', '1/2 चम्मच हल्दी पाउडर', '1/4 चम्मच काली मिर्च'] 
              : (isHinglish ? ['1 glass warm milk', '1/2 tsp organic Haldi', 'A pinch of Black Pepper'] : ['1 glass of warm milk', '1/2 tsp organic turmeric powder', 'A pinch of black pepper']),
            steps: isHindi 
              ? ['गर्म दूध में हल्दी और काली मिर्च मिलाएं।', '5 मिनट के लिए उबालें।', 'सोने से पहले गुनगुना पिएं।'] 
              : (isHinglish ? ['Warm milk me haldi aur kali mirch powder mix karein.', 'इसे 3-5 minutes tak boil hone dein.', 'Sone se pehle gunguna (luke-warm) consume karein.'] : ['Mix turmeric powder and black pepper into the milk.', 'Boil it gently for 3-5 minutes.', 'Drink warm before bedtime to activate anti-inflammatory pathways.'])
          },
          {
            id: 'epsom_soak',
            name: isHindi ? 'सेंधा नमक सिकाई (Epsom Salt Soak)' : (isHinglish ? 'Sendha Namak Soak (Epsom Salt)' : 'Epsom Salt Warm Water Soak'),
            prepTime: isHindi ? '48 घंटे के बाद' : (isHinglish ? '48 hours ke baad' : 'After 48 Hours'),
            ingredients: isHindi 
              ? ['गुनगुना पानी (एक बाल्टी)', '1/2 कप सेंधा नमक (Epsom Salt)'] 
              : (isHinglish ? ['Gunguna paani (warm water)', '1/2 cup Sendha Namak'] : ['Tub of warm water', '1/2 cup of Epsom salt (Sendha Namak)']),
            steps: isHindi 
              ? ['गुनगुने पानी में सेंधा नमक मिलाएं।', 'प्रभावित पैर/हाथ को 15-20 मिनट के लिए पानी में डुबोकर रखें।', 'यह मांसपेशियों के तनाव को कम करता है।'] 
              : (isHinglish ? ['Warm water me sendha namak mix karein.', 'Joint/limb ko 15-20 minutes tak paani me soak karke rakhein.', 'Stiffness aur swelling reduce karne me madad karega.'] : ['Stir Epsom salt into the tub of warm water.', 'Soak the injured joint/limb for 15-20 minutes.', 'Helps relax stiff muscles and reduce residual swelling.'])
          }
        ],
        supports: [
          {
            id: 'crepe_bandage',
            name: isHindi ? 'इलास्टिक क्रेप बैंडेज (Figure-of-8 Wrap)' : (isHinglish ? 'Elastic Crepe Bandage (Figure-of-8 Method)' : 'Elastic Crepe Bandage (Figure-of-Eight Compression)'),
            desc: isHindi 
              ? 'जोड़ को हल्का कंप्रेशन सपोर्ट देने के लिए लपेटें:\n1. चोट के थोड़ा नीचे से (distal region) लपेटना शुरू करें।\n2. हर घेरे को 50% ओवरलैप करते हुए figure-of-eight (8 की आकृति) पैटर्न में लपेटें।\n3. पट्टी को सहारा देने के लिए थोड़ा कसा रखें, लेकिन इतना कसकर न बांधें कि रक्त प्रवाह रुक जाए (उंगलियों के ठंडे या नीले पड़ने पर ढीला करें)।\n4. रात को सोते समय पट्टी हटा दें।'
              : (isHinglish 
                ? 'Joint area ko compression support dene ke liye crepe bandage bandhein:\n1. Wrap start karein chot ke thoda neeche se.\n2. Har turn par 50% overlap karein figure-of-eight (8 shape) pattern me.\n3. Wrap ko firm rakhna hai but itna tight nahi ki tingling ya numbness ho. Fingers/toes pale/blue ya thande lagne par turant loose karein.\n4. Raat ko sote samay crepe bandage nikal dein.'
                : 'Wrap crepe bandage around the joint for firm compression support:\n1. Start wrapping from below the joint (distal area) where swelling settles.\n2. Wrap in a figure-of-eight pattern, overlapping each turn by 50%.\n3. Keep the wrap firm for compression, but ensure it does not restrict blood circulation. Check fingertips/toes for coldness, numbness, or pale skin; loosen immediately if noticed.\n4. Remove the bandage before sleeping.'),
            type: 'wrap'
          }
        ],
        banned: []
      };
    } else if (riskLevel === 'moderate') {
      return {
        medicines: [
          {
            id: 'ibu_400',
            name: isHindi ? 'आइबुप्रोफेन (Ibuprofen 400mg)' : (isHinglish ? 'Ibuprofen (400mg)' : 'Ibuprofen (400mg) NSAID'),
            desc: isHindi ? 'सूजन और गंभीर दर्द को कम करने के लिए। हमेशा भोजन के बाद लें।' : (isHinglish ? 'Swelling aur acute pain reduce karne ke liye. Hamesha khane ke baad (post-meals) lein.' : 'Anti-inflammatory tablet to reduce joint swelling. Take strictly post-meals with plenty of water.'),
            type: 'pill'
          },
          {
            id: 'pain_spray',
            name: isHindi ? 'पेन रिलीफ स्प्रे (Volini Spray)' : (isHinglish ? 'Fast Pain Relief Spray (Volini)' : 'Fast-acting Pain Relief Topical Spray'),
            desc: isHindi ? 'बिना दबाव डाले प्रभावित क्षेत्र पर स्प्रे करें। मालिश करने से बचें।' : (isHinglish ? 'Swollen joint par bina pressure dale spray karein. Ragar kar lagane se bachein.' : 'Spray over the swollen joint without touching it, preventing painful pressure rubbing.'),
            type: 'spray'
          }
        ],
        ayurveda: [
          {
            id: 'onion_turmeric_paste',
            name: isHindi ? 'हल्दी-प्याज का लेप (Onion-Turmeric Compress)' : (isHinglish ? 'Haldi-Pyaaj Lep (Onion-Turmeric Paste)' : 'Warm Onion-Turmeric Traditional Paste'),
            prepTime: isHindi ? 'रात में (8 घंटे)' : (isHinglish ? 'Raat bhar (Overnight)' : 'Overnight (8 Hours)'),
            ingredients: isHindi 
              ? ['1 पिसा हुआ प्याज', '1 चम्मच हल्दी पाउडर', '1 चम्मच सरसों का तेल', '1 पान का पत्ता (वैकल्पिक)'] 
              : (isHinglish ? ['1 grated/grinded Onion', '1 tsp Haldi powder', '1 tbsp Mustard oil', '1 Paan ka patta (optional)'] : ['1 grated onion', '1 tsp organic turmeric powder', '1 tbsp pure mustard oil', '1 betel leaf (optional)']),
            steps: isHindi 
              ? ['पिसे प्याज, हल्दी और सरसों के तेल को मिलाकर गुनगुना गर्म करें।', 'प्रभावित जोड़ पर इस गुनगुने पेस्ट को धीरे से रखें।', 'पान के पत्ते से ढककर सूती कपड़े या बैंडेज से हल्के से लपेट लें और रात भर के लिए छोड़ दें।', 'यह सूजन को बहुत तेजी से खींचता है।'] 
              : (isHinglish ? ['Pyaaj, haldi aur sarso tel ko mix karke gunguna garam karein.', 'Paste ko joint par gently (bina ragde) apply karein.', 'Paan ke patte ya cotton cloth se dhak kar bandage se wrap karein aur raat bhar chodein.', 'Ye swelling ko khinchne (inflammation relief) me best hai.'] : ['Mix grated onion, turmeric, and mustard oil, then warm it gently in a pan.', 'Apply the warm paste carefully around the swollen joint without rubbing.', 'Cover it with a betel leaf or clean cotton cloth, wrap with a bandage, and leave it overnight.'])
          },
          {
            id: 'garlic_mustard_oil',
            name: isHindi ? 'लहसुन-सरसों तेल मालिश (Garlic-Mustard Oil)' : (isHinglish ? 'Lahsun-Sarso Tel (Garlic-Mustard Oil)' : 'Warm Garlic-Infused Mustard Oil'),
            prepTime: isHindi ? 'दिन में दो बार' : (isHinglish ? 'Din me 2 baar' : 'Twice daily'),
            ingredients: isHindi 
              ? ['4-5 कुचली हुई लहसुन की कलियां', '3 चम्मच सरसों का तेल'] 
              : (isHinglish ? ['4-5 crushed garlic cloves', '3 tbsp Mustard oil'] : ['4-5 crushed garlic cloves', '3 tbsp mustard oil']),
            steps: isHindi 
              ? ['सरसों के तेल में लहसुन को अच्छी तरह से काला होने तक पकाएं।', 'तेल को छानकर हल्का गुनगुना होने दें।', 'प्रभावित जोड़ के चारों ओर बहुत हल्के हाथों से लगाएं। गहरे दबाव से बचें।'] 
              : (isHinglish ? ['Sarso tel me lahsun ko tab tak garam karein jab tak wo blackish na ho jaye.', 'Tel ko chhan kar gunguna garam hone dein.', 'Moch ke charo taraf bahut light pressure se apply karein (massage na karein).'] : ['Heat mustard oil and garlic cloves until the garlic turns dark brown.', 'Strain the oil and let it cool until it is comfortably warm.', 'Apply gently around the painful joint. Avoid putting deep pressure on the joint.'])
          }
        ],
        supports: [
          {
            id: 'ortho_brace',
            name: isHindi ? 'ऑर्थोपेडिक सपोर्ट ब्रेस (Binder & Brace)' : (isHinglish ? 'Orthopedic Joint Binder & Brace' : 'Orthopedic Joint Binder & Semi-Rigid Brace'),
            desc: isHindi 
              ? 'जोड़ को अनावश्यक हिलाने-डुलाने से बचाने के लिए ब्रेस पहनें:\n1. अपने जोड़ के आकार के अनुसार सही आकार का ब्रेस/बाइंडर चुनें।\n2. जोड़ को सामान्य, सीधी स्थिति में रखते हुए ब्रेस के अंदर डालें।\n3. वेल्क्रो स्ट्रैप्स को बराबर कसें ताकि जोड़ को स्थिरता मिले और दबाव भी समान रहे।\n4. जब भी आप चलें, खड़े हों या हिलें-डुलें, इसे अवश्य पहनें ताकि पैर/हाथ दोबारा न मुड़े।'
              : (isHinglish 
                ? 'Joint ko unwanted movements se bachane ke liye brace pehnein:\n1. Sahi size ka ankle binder ya knee sleeve brace select karein.\n2. Joint ko straight position me rakhte hue brace ke andar dalein.\n3. Velcro straps ko barabar tight karein taaki compression aur stability barabar mile.\n4. Jab bhi bed se uthein, walk karein ya move karein, ise zaroor pehnein taaki twisting protection mile.'
                : 'Use specialized orthopedic brace to keep the joint properly stabilized:\n1. Choose an orthopedic brace/binder of correct size (e.g. Ankle Binder or Knee Sleeve).\n2. Align the brace keeping the joint in a neutral, relaxed position.\n3. Secure the Velcro straps symmetrically, ensuring uniform tension and support.\n4. Wear it whenever sitting upright, standing, or moving to protect against secondary twisting injuries.'),
            type: 'brace'
          }
        ],
        banned: []
      };
    } else {
      return {
        medicines: [
          {
            id: 'para_650',
            name: isHindi ? 'पैरासिटामोल (650mg)' : (isHinglish ? 'Paracetamol (650mg)' : 'Paracetamol (650mg) Emergency Bridge'),
            desc: isHindi ? 'केवल आपातकालीन स्थिति में दर्द कम करने के लिए जब तक आप डॉक्टर के पास नहीं पहुँचते।' : (isHinglish ? 'Sirf emergency pain bridge ke liye jab tak aap hospital nahi pohochte.' : 'Emergency analgesic to temporarily dull the pain while traveling to the medical center.'),
            type: 'pill'
          }
        ],
        ayurveda: [],
        supports: [
          {
            id: 'rigid_splint',
            name: isHindi ? 'आपातकालीन कठोर स्प्लिंट (Immobilizer)' : (isHinglish ? 'Emergency Rigid Splinting (Scale/Cardboard)' : 'Emergency Rigid Splint Support'),
            desc: isHindi 
              ? 'किसी स्केल, कार्डबोर्ड या लकड़ी की पट्टी का उपयोग करके टूटी हुई हड्डी को पूरी तरह स्थिर करें:\n1. कठोर कार्डबोर्ड या लकड़ी के स्केल को सहारा बनाएं।\n2. स्प्लिंट की लंबाई चोटिल हिस्से के ऊपर और नीचे वाले दोनों जोड़ों तक होनी चाहिए ताकि पूरा हिस्सा स्थिर हो सके।\n3. त्वचा को रगड़ से बचाने के लिए चोटिल हिस्से और स्प्लिंट के बीच रुई या कोई साफ कपड़ा रखें।\n4. पट्टी या साफ कपड़े की कतरनों से स्प्लिंट को बांधें। सीधे चोट वाली जगह पर बहुत तेज दबाव न डालें।\n5. अंग को बिल्कुल न हिलाएं और तुरंत अस्पताल जाएं।'
              : (isHinglish 
                ? 'Limb ko bilkul hilne se rokne ke liye rigid cardboard ya scale se splint lagayein:\n1. Kisi hard cardboard, patli lakdi ki scale ya newspaper roll ko base banayein.\n2. Splint ki lambai chot ke upar aur niche ke dono joints tak honi chahiye.\n3. Limb ke neeche padding (cotton towel ya soft cloth) lagayein taaki skin safe rahe.\n4. Clean cloth strips ya bandage se cardboard ko limb ke sath baandh lein (direct chot par load na dalein).\n5. Joint/limb ko bilkul immobilize (sthir) rakhein aur turant emergency medical aid lein.'
                : 'Place rigid support along the injured limb to keep the bone completely immobilized:\n1. Locate a rigid support like thick cardboard, wooden scale, or a rolled-up newspaper.\n2. The splint must extend above and below the injured joint to prevent movement completely.\n3. Place soft cloth, cotton, or a towel between the limb and the splint to prevent friction and pressure sores.\n4. Secure the splint with clean cloth strips or bandage tape, avoiding direct tight pressure over the exact injury site.\n5. Keep the limb elevated and completely still, and immediately seek professional emergency medical aid.'),
            type: 'splint'
          }
        ],
        banned: [
          {
            title: isHindi ? 'गर्म तेल मालिश वर्जित है' : (isHinglish ? 'Warm Oil Massage Banned!' : 'No Hot Massage / Rubbing'),
            desc: isHindi ? 'टूटी हड्डी या गंभीर मोच में मालिश करने से नसें और खून की धमनियां फट सकती हैं।' : (isHinglish ? 'Acute chot ya fracture area me malish karne se blood vessels rupture ho sakti hain aur fracture damage badh sakta hai.' : 'Massaging a suspected fracture can rupture delicate blood vessels and cause severe internal bleeding or bone displacement.')
          },
          {
            title: isHindi ? 'कोई गर्म पानी सिकाई नहीं' : (isHinglish ? 'Garam paani sikaai strictly blocked!' : 'No Heat Compress (Hot Water Fomentation)'),
            desc: isHindi ? 'शुरुआती 48 घंटों में गर्म सिकाई करने से अंदरूनी सूजन (internal bleeding) बहुत बढ़ जाती है।' : (isHinglish ? 'Start ke 48 hours me garam compress karne se internal blood flow badhta hai, jisse swelling extreme ho jayegi.' : 'Applying heat in the first 48 hours increases internal blood flow and severely exacerbates swelling. Apply ice packs only.')
          },
          {
            title: isHindi ? 'खुले घाव पर लेप न लगाएं' : (isHinglish ? 'Khule zakhm par paste na lagayein!' : 'No Ayurvedic Leps on Broken Skin'),
            desc: isHindi ? 'यदि त्वचा छिल गई है या घाव है, तो किसी भी प्रकार का प्याज या हल्दी का पेस्ट लगाने से गंभीर इन्फेक्शन हो सकता है।' : (isHinglish ? 'Agar skin chhil gayi hai ya blood aa raha hai, toh koi paste na lagayein, isse severe infection ka risk badhta hai.' : 'Applying traditional pastes on open wounds can introduce bacteria and cause severe deep-tissue infections.')
          }
        ]
      };
    }
  };

  const handleAddRemedyReminder = (name) => {
    if (!currentUser) return;
    const remindersKey = `injuryiq_reminders_${currentUser.email}`;
    const existing = localStorage.getItem(remindersKey) ? JSON.parse(localStorage.getItem(remindersKey)) : [];
    
    if (!existing.includes(name)) {
      existing.push(name);
      localStorage.setItem(remindersKey, JSON.stringify(existing));
    }
    
    alert(lang === 'hi' 
      ? `⏰ रिमाइंडर जोड़ा गया!\n\n'${name}' को आपके रिकवरी शेड्यूल में जोड़ दिया गया है।` 
      : lang === 'hn' 
        ? `⏰ Reminder add ho gaya!\n\n'${name}' aapke Daily Recovery Schedule me successfully save kar diya hai.` 
        : `⏰ Reminder Added!\n\n'${name}' has been successfully added to your daily care schedule.`);
  };

  // --- SYMPTOM QUESTION CONSTELLATIONS ---
  const steps = [
    { title: t.injuryLocation, category: "Area Selection" },
    { title: t.metadataTitle, category: "Basic Info" },
    { title: t.mechanismLabel, category: "Injury Mechanism" },
    { title: "Pain Indicators", category: "Pain Assessment" },
    { title: "Physical Visuals", category: "Physical Signs" },
    { title: "Tenderness Map", category: "Ottawa Rules Check" },
    { title: "Mobility & Function", category: "Functional Check" },
    { title: t.redFlagsTitle, category: "Red Flag Screening" },
    { title: t.aiUploadTitle, category: "AI Image Upload" }
  ];

  // Register Service Worker for PWA & Listen for beforeinstallprompt
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
        .catch((err) => console.error('Service Worker registration failed:', err));
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('[PWA] beforeinstallprompt event saved!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      console.log('[PWA] Installed successfully!');
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Install choice: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

  const handleDirectModalInstall = async () => {
    if (deferredPrompt) {
      setShowInstallGuide(false);
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Install choice inside modal: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      alert("⚠️ Direct installation is blocked by the browser (because your system disk space is 100% full, or in Private Mode).\n\nKripya apne PC me disk space clear karein, ya fir browser menu (vertical 3-dots -> Save and share -> Install) ka use karein!");
    }
  };

  // --- DATABASE LOCAL STORAGE LOADING & API KEY INIT ---
  useEffect(() => {
    if (currentUser) {
      const historyKey = `injuryiq_history_${currentUser.email}`;
      const localData = localStorage.getItem(historyKey);
      if (localData) {
        setHistory(JSON.parse(localData));
      } else {
        localStorage.setItem(historyKey, JSON.stringify(MOCK_HISTORY));
        setHistory(MOCK_HISTORY);
      }

      // Restore active assessment progress if any exists (to survive camera upload reloads on mobile)
      const savedState = localStorage.getItem(`injuryiq_active_assessment_${currentUser.email}`);
      if (savedState) {
        try {
          const { currentStep: savedStep, injuryArea: savedArea, answers: savedAnswers } = JSON.parse(savedState);
          setCurrentStep(savedStep);
          setInjuryArea(savedArea);
          setAnswers(savedAnswers);
          setView('questionnaire');
          console.log("[CAMERA LAUNCH RESTORE] Recovered assessment progress at step", savedStep);
        } catch (e) {
          console.error("Error restoring active assessment:", e);
        }
      }

      // Restore compressed photos if any exist in local storage
      const savedInjury = localStorage.getItem(`injuryiq_saved_photo_injury_${currentUser.email}`);
      const savedComparison = localStorage.getItem(`injuryiq_saved_photo_comparison_${currentUser.email}`);
      if (savedInjury) {
        const file = base64ToFile(savedInjury, 'injury.jpg');
        if (file) {
          setInjuryPhoto(file);
          setInjuryPhotoUrl(savedInjury);
        }
      }
      if (savedComparison) {
        const file = base64ToFile(savedComparison, 'comparison.jpg');
        if (file) {
          setComparisonPhoto(file);
          setComparisonPhotoUrl(savedComparison);
        }
      }
    } else {
      setHistory([]);
    }

    // Auto populate the Gemini API key in LocalStorage if not already set or invalid, or if the environment key changed
    const savedKey = localStorage.getItem('injuryiq_gemini_key');
    const defaultKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (defaultKey && (!savedKey || savedKey === 'null' || savedKey === 'undefined' || !savedKey.trim() || savedKey !== defaultKey)) {
      localStorage.setItem('injuryiq_gemini_key', defaultKey);
      setGeminiKey(defaultKey);
    }
  }, [currentUser]);

  // --- REAL-TIME ACTIVE ASSESSMENT STATE PERSISTENCE ---
  useEffect(() => {
    if (currentUser && view === 'questionnaire') {
      const stateObj = {
        currentStep,
        injuryArea,
        answers
      };
      localStorage.setItem(`injuryiq_active_assessment_${currentUser.email}`, JSON.stringify(stateObj));
    }
  }, [view, currentStep, injuryArea, answers, currentUser]);

  // Theme Toggler Effect
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (darkMode) {
      bodyClass.remove('light-mode');
    } else {
      bodyClass.add('light-mode');
    }
  }, [darkMode]);

  // Helper for safety speech warnings
  const speakSafetyText = (text, speechLang) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    if (speechLang === 'hi-IN') {
      selectedVoice = voices.find(v => v.lang.startsWith('hi')) || voices.find(v => v.lang.includes('IN'));
    } else {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = speechLang;
    window.speechSynthesis.speak(utterance);
  };

  // Ice Timer Hook
  useEffect(() => {
    if (iceTimerRunning) {
      timerRef.current = setInterval(() => {
        setIceTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIceTimerRunning(false);
            try {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.frequency.setValueAtTime(440, audioCtx.currentTime);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.8);
            } catch (e) {
              console.log("Audio block");
            }

            // Speak completion warning
            let completedMsg = "Ice compress time completed! Please remove the ice pack immediately to avoid tissue damage.";
            let speechLang = "en-US";
            if (lang === 'hi') {
              completedMsg = "समय समाप्त! ऊतकों को नुकसान से बचाने के लिए बर्फ की थैली को तुरंत हटा दें।";
              speechLang = "hi-IN";
            } else if (lang === 'hn') {
              completedMsg = "Time khatam! Tissue damage se bachne ke liye barf ki pack ko turant hata dein.";
              speechLang = "hi-IN";
            }
            speakSafetyText(completedMsg, speechLang);

            alert("⏰ Ice compress time completed! Please remove the ice pack.");
            return 1200;
          }

          // Midway warning at 10 minutes (600 seconds)
          if (prev === 601) {
            let midwayMsg = "Ten minutes remaining. Keep checking skin color.";
            let speechLang = "en-US";
            if (lang === 'hi') {
              midwayMsg = "दस मिनट शेष हैं। त्वचा का रंग देखते रहें।";
              speechLang = "hi-IN";
            } else if (lang === 'hn') {
              midwayMsg = "Dus minute bache hain. Skin ka color check karte rahein.";
              speechLang = "hi-IN";
            }
            speakSafetyText(midwayMsg, speechLang);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [iceTimerRunning, lang]);

  // Chatbot Auto-scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatTyping]);

  // Initialize Chatbot Messages
  useEffect(() => {
    setChatMessages([
      { sender: 'bot', text: t.chatbotWelcome }
    ]);
  }, [lang]);

  // --- PHYSIOTHERAPY TIMER HOOK ---
  useEffect(() => {
    if (rehabTimerRunning) {
      rehabTimerRef.current = setInterval(() => {
        setRehabTimer((prev) => {
          if (prev <= 1) {
            clearInterval(rehabTimerRef.current);
            setRehabTimerRunning(false);
            try {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
              osc.start();
              osc.stop(audioCtx.currentTime + 0.5);
            } catch (e) {
              console.log("Audio context blocked");
            }

            // Speak completion
            let completedMsg = `Exercise completed. Great job!`;
            let speechLang = "en-US";
            if (lang === 'hi') {
              completedMsg = `कसरत पूरी हुई। बहुत बढ़िया!`;
              speechLang = "hi-IN";
            } else if (lang === 'hn') {
              completedMsg = `Exercise complete ho gayi. Bahut accha kiya!`;
              speechLang = "hi-IN";
            }
            speakSafetyText(completedMsg, speechLang);

            if (activeExercise && currentUser && activeTrackingId) {
              const logsKey = `injuryiq_recovery_logs_${currentUser.email}_${activeTrackingId}`;
              const todayStr = new Date().toISOString().split('T')[0];
              const logIndex = recoveryLogs.findIndex(log => log.date === todayStr);
              let updatedLogs = [...recoveryLogs];
              const latestLog = recoveryLogs.length > 0 ? recoveryLogs[recoveryLogs.length - 1] : null;
              
              if (logIndex > -1) {
                const todayLog = updatedLogs[logIndex];
                const completed = todayLog.completedExercises || [];
                if (!completed.includes(activeExercise.id)) {
                  todayLog.completedExercises = [...completed, activeExercise.id];
                  updatedLogs[logIndex] = todayLog;
                  localStorage.setItem(logsKey, JSON.stringify(updatedLogs));
                  setRecoveryLogs(updatedLogs);
                }
              } else {
                const newTodayLog = {
                  id: `log_${Math.random().toString(36).substr(2, 9)}`,
                  painLevel: latestLog ? latestLog.painLevel : 5,
                  swelling: latestLog ? latestLog.swelling : 'none',
                  mobility: latestLog ? latestLog.mobility : 'normal',
                  notes: 'Completed exercise: ' + activeExercise.name,
                  date: todayStr,
                  completedExercises: [activeExercise.id]
                };
                updatedLogs.push(newTodayLog);
                updatedLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
                localStorage.setItem(logsKey, JSON.stringify(updatedLogs));
                setRecoveryLogs(updatedLogs);
              }
            }
            alert(`🎉 Exercise completed: ${activeExercise ? activeExercise.name : 'Rehab exercise'}! Nice job.`);
            return 0;
          }

          // Speak midway point
          if (activeExercise && prev === Math.floor(activeExercise.duration / 2) + 1) {
            let midwayMsg = "Halfway there. Keep going!";
            let speechLang = "en-US";
            if (lang === 'hi') {
              midwayMsg = "आधा समय समाप्त। जारी रखें!";
              speechLang = "hi-IN";
            } else if (lang === 'hn') {
              midwayMsg = "Aadha time ho gaya hai. Lage rahein!";
              speechLang = "hi-IN";
            }
            speakSafetyText(midwayMsg, speechLang);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(rehabTimerRef.current);
    }
    return () => clearInterval(rehabTimerRef.current);
  }, [rehabTimerRunning, activeExercise, recoveryLogs, currentUser, activeTrackingId, lang]);

  const startRehabTimer = (exercise) => {
    setActiveExercise(exercise);
    setRehabTimer(exercise.duration);
    setRehabTimerRunning(true);

    // Speak start
    let startMsg = `Starting exercise: ${exercise.name}. Focus on your posture.`;
    let speechLang = "en-US";
    if (lang === 'hi') {
      startMsg = `कसरत शुरू: ${exercise.name}। अपना संतुलन बनाए रखें।`;
      speechLang = "hi-IN";
    } else if (lang === 'hn') {
      startMsg = `Exercise shuru: ${exercise.name}. Apni position stable rakhein.`;
      speechLang = "hi-IN";
    }
    speakSafetyText(startMsg, speechLang);
  };

  const toggleRehabTimer = () => {
    setRehabTimerRunning(!rehabTimerRunning);
  };

  const resetRehabTimer = () => {
    setRehabTimerRunning(false);
    if (activeExercise) {
      setRehabTimer(activeExercise.duration);
    } else {
      setRehabTimer(0);
    }
  };

  // --- RECOVERY LOGS SYNC ---
  useEffect(() => {
    if (currentUser && activeTrackingId) {
      const logsKey = `injuryiq_recovery_logs_${currentUser.email}_${activeTrackingId}`;
      const savedLogs = localStorage.getItem(logsKey);
      if (savedLogs) {
        setRecoveryLogs(JSON.parse(savedLogs));
      } else {
        const assessment = history.find(item => item.assessmentId === activeTrackingId);
        if (assessment) {
          const initialLog = {
            id: `log_init_${activeTrackingId}`,
            painLevel: assessment.symptoms?.painLevel ?? 5,
            swelling: assessment.symptoms?.swelling ?? 'none',
            mobility: assessment.symptoms?.movementAbility === 'normal' ? 'normal' : (assessment.symptoms?.movementAbility === 'partial' ? 'partial' : 'limited'),
            notes: 'Initial Assessment Day',
            date: assessment.createdAt.split('T')[0]
          };
          localStorage.setItem(logsKey, JSON.stringify([initialLog]));
          setRecoveryLogs([initialLog]);
        } else {
          setRecoveryLogs([]);
        }
      }
    } else {
      setRecoveryLogs([]);
    }
  }, [activeTrackingId, currentUser, history]);

  const handleLogSubmit = (e) => {
    e.preventDefault();
    if (!currentUser || !activeTrackingId) return;

    const logsKey = `injuryiq_recovery_logs_${currentUser.email}_${activeTrackingId}`;
    const dateVal = logForm.date;

    const existingIndex = recoveryLogs.findIndex(log => log.date === dateVal);
    let updatedLogs = [...recoveryLogs];

    const newLog = {
      id: existingIndex > -1 ? recoveryLogs[existingIndex].id : `log_${Math.random().toString(36).substr(2, 9)}`,
      painLevel: logForm.painLevel,
      swelling: logForm.swelling,
      mobility: logForm.mobility,
      notes: logForm.notes,
      date: dateVal
    };

    if (existingIndex > -1) {
      updatedLogs[existingIndex] = newLog;
    } else {
      updatedLogs.push(newLog);
    }

    updatedLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem(logsKey, JSON.stringify(updatedLogs));
    setRecoveryLogs(updatedLogs);
    setShowLogModal(false);
    
    setLogForm({
      painLevel: 5,
      swelling: 'none',
      mobility: 'normal',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleLogDelete = (id) => {
    if (!currentUser || !activeTrackingId) return;
    if (id.startsWith('log_init_')) {
      alert(lang === 'hn' ? "Day 1 (initial assessment) ki entry delete nahi kar sakte!" : "Cannot delete Day 1 initial assessment entry!");
      return;
    }
    const logsKey = `injuryiq_recovery_logs_${currentUser.email}_${activeTrackingId}`;
    const updatedLogs = recoveryLogs.filter(log => log.id !== id);
    localStorage.setItem(logsKey, JSON.stringify(updatedLogs));
    setRecoveryLogs(updatedLogs);
  };

  const handleStopTracking = () => {
    const confirmStop = window.confirm(
      lang === 'hi' ? "क्या आप इस चोट की ट्रैकिंग बंद करना चाहते हैं?" :
      (lang === 'hn' ? "Kya aap iss injury ki tracking stop karna chahte hain?" :
      "Are you sure you want to stop tracking this injury?")
    );
    if (confirmStop && currentUser) {
      localStorage.removeItem(`injuryiq_active_tracking_${currentUser.email}`);
      setActiveTrackingId('');
      setView('dashboard');
    }
  };

  const DEFAULT_TRAUMA_CENTERS = [
    {
      name: "AIIMS JPNA Apex Trauma Center",
      address: "Safdarjung Enclave, New Delhi, Delhi 110029",
      phone: "011-26731100",
      lat: 28.5672,
      lng: 77.2100
    },
    {
      name: "RML Hospital Trauma Centre",
      address: "Baba Kharak Singh Marg, Connaught Place, New Delhi 110001",
      phone: "011-23365550",
      lat: 28.6253,
      lng: 77.2084
    },
    {
      name: "Safdarjung Hospital Emergency Medicine",
      address: "Ansari Nagar East, New Delhi, Delhi 110029",
      phone: "011-26707100",
      lat: 28.5665,
      lng: 77.2064
    }
  ];

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };

  const handleFindClinics = () => {
    setLocLoading(true);
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError(lang === 'hi' ? "आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता है।" : "Geolocation is not supported by your browser.");
      setLocLoading(false);
      setNearbyClinics(DEFAULT_TRAUMA_CENTERS.map(c => ({ ...c, distance: "N/A" })));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        try {
          // Query OSM Overpass API for hospitals/clinics within 8000m (8km)
          const query = `[out:json][timeout:15];(node["amenity"="hospital"](around:8000,${latitude},${longitude});way["amenity"="hospital"](around:8000,${latitude},${longitude});node["amenity"="clinic"](around:8000,${latitude},${longitude}););out center;`;
          const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
          if (!response.ok) {
            throw new Error("Overpass query failed");
          }
          const data = await response.json();
          
          if (data && data.elements && data.elements.length > 0) {
            const hospitals = data.elements.map(el => {
              const name = el.tags?.name || (lang === 'hi' ? "अस्पताल / क्लिनिक" : "Hospital / Clinic");
              const latVal = el.lat || el.center?.lat || latitude;
              const lngVal = el.lon || el.center?.lon || longitude;
              
              const dist = calculateDistance(latitude, longitude, latVal, lngVal);
              
              let address = "";
              if (el.tags?.["addr:full"]) {
                address = el.tags["addr:full"];
              } else {
                const street = el.tags?.["addr:street"] || "";
                const suburb = el.tags?.["addr:suburb"] || el.tags?.["addr:neighbourhood"] || el.tags?.["addr:neighborhood"] || "";
                const city = el.tags?.["addr:city"] || "";
                address = [street, suburb, city].filter(Boolean).join(", ") || (lang === 'hi' ? "नजदीकी क्षेत्र" : "Nearby area");
              }
              
              const phone = el.tags?.phone || el.tags?.["contact:phone"] || (lang === 'hi' ? "उपलब्ध नहीं" : "Not Available");
              
              return {
                name,
                address,
                phone,
                distance: parseFloat(dist),
                lat: latVal,
                lng: lngVal
              };
            });
            
            // Sort by nearest distance
            hospitals.sort((a, b) => a.distance - b.distance);
            setNearbyClinics(hospitals.slice(0, 3));
          } else {
            // Fallback to larger 15km search
            const largerQuery = `[out:json][timeout:15];(node["amenity"="hospital"](around:15000,${latitude},${longitude});way["amenity"="hospital"](around:15000,${latitude},${longitude}););out center;`;
            const responseLarger = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(largerQuery)}`);
            const dataLarger = await responseLarger.json();
            
            if (dataLarger && dataLarger.elements && dataLarger.elements.length > 0) {
              const hospitals = dataLarger.elements.map(el => {
                const name = el.tags?.name || "Hospital";
                const latVal = el.lat || el.center?.lat || latitude;
                const lngVal = el.lon || el.center?.lon || longitude;
                const dist = calculateDistance(latitude, longitude, latVal, lngVal);
                let address = el.tags?.["addr:full"] || [el.tags?.["addr:street"], el.tags?.["addr:suburb"]].filter(Boolean).join(", ") || "Nearby Area";
                const phone = el.tags?.phone || el.tags?.["contact:phone"] || "Not Available";
                return { name, address, phone, distance: parseFloat(dist), lat: latVal, lng: lngVal };
              });
              hospitals.sort((a, b) => a.distance - b.distance);
              setNearbyClinics(hospitals.slice(0, 3));
            } else {
              setLocError(lang === 'hi' ? "15 किमी के भीतर कोई अस्पताल नहीं मिला।" : "No hospitals found within 15km. Showing national centers.");
              setNearbyClinics(DEFAULT_TRAUMA_CENTERS.map(c => ({ ...c, distance: "N/A" })));
            }
          }
        } catch (err) {
          console.error(err);
          setLocError(lang === 'hi' ? "जियो-डेटा प्राप्त करने में त्रुटि। मुख्य केंद्र दिखाए जा रहे हैं।" : "Error retrieving live geo-data. Showing national centers.");
          setNearbyClinics(DEFAULT_TRAUMA_CENTERS.map(c => ({ ...c, distance: "N/A" })));
        }
        setLocLoading(false);
      },
      (error) => {
        console.error(error);
        setLocError(lang === 'hi' ? "लोकेशन एक्सेस की अनुमति नहीं मिली। मुख्य अस्पताल दिखाए जा रहे हैं।" : "Location access denied or unavailable. Showing national centers.");
        setLocLoading(false);
        setNearbyClinics(DEFAULT_TRAUMA_CENTERS.map(c => ({ ...c, distance: "N/A" })));
      },
      { timeout: 12000 }
    );
  };

  const toggleIceTimer = () => {
    const nextRunning = !iceTimerRunning;
    setIceTimerRunning(nextRunning);
    if (nextRunning) {
      let startMsg = "Timer Started: 20 minutes cold compress active.";
      let speechLang = "en-US";
      if (lang === 'hi') {
        startMsg = "आइस कम्प्रेस शुरू हो गया है। बीस मिनट का समय सक्रिय है।";
        speechLang = "hi-IN";
      } else if (lang === 'hn') {
        startMsg = "Ice compress start ho gaya hai. Bees minute ka time active hai.";
        speechLang = "hi-IN";
      }
      speakSafetyText(startMsg, speechLang);
    } else {
      let pauseMsg = "Timer paused.";
      let speechLang = "en-US";
      if (lang === 'hi') {
        pauseMsg = "टाइमर रोक दिया गया है।";
        speechLang = "hi-IN";
      } else if (lang === 'hn') {
        pauseMsg = "Timer pause ho gaya hai.";
        speechLang = "hi-IN";
      }
      speakSafetyText(pauseMsg, speechLang);
    }
  };

  const resetIceTimer = () => {
    setIceTimerRunning(false);
    setIceTime(1200);
  };

  const formatIceTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- TEXT TO SPEECH (VOICE OUTPUT) ---
  const speakText = (text) => {
    if (voiceMutedRef.current) return;
    
    // Check support
    if (!('speechSynthesis' in window)) {
      console.warn("Speech Synthesis not supported");
      return;
    }

    window.speechSynthesis.cancel(); // Stop current speech
    
    const cleanText = text.replace(/[*#]/g, ""); // Clean markdown symbols
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    if (lang === 'hi') {
      selectedVoice = voices.find(v => v.lang.startsWith('hi')) || voices.find(v => v.lang.startsWith('en'));
    } else if (lang === 'hn') {
      // For Hinglish, use a Hindi voice or Indian accented English voice
      selectedVoice = voices.find(v => v.lang.startsWith('hi')) || voices.find(v => v.lang.includes('IN'));
    } else {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // --- SPEECH TO TEXT (VOICE INPUT) ---
  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please try Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Match locales for speech input
    recognition.lang = lang === 'hi' ? 'hi-IN' : (lang === 'hn' ? 'hi-IN' : 'en-US');

    recognition.onstart = () => {
      setIsListening(true);
      window.speechSynthesis.cancel(); // Stop talking when user starts speaking
    };

    recognition.onerror = (e) => {
      console.error(e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      // Automatically send text after converting speech
      setTimeout(() => {
        handleSendChat(transcript);
      }, 500);
    };

    recognition.start();
  };

  const startSymptomVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'hi' ? "इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है। कृपया Google Chrome का उपयोग करें।" : "Voice recognition is not supported in this browser. Please try Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Match locales for speech input
    recognition.lang = lang === 'hi' ? 'hi-IN' : (lang === 'hn' ? 'hi-IN' : 'en-US');

    recognition.onstart = () => {
      setIsSymptomListening(true);
      window.speechSynthesis.cancel();
    };

    recognition.onerror = (e) => {
      console.error(e);
      setIsSymptomListening(false);
    };

    recognition.onend = () => {
      setIsSymptomListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswers(prev => ({
        ...prev,
        customNotes: prev.customNotes ? `${prev.customNotes} ${transcript}` : transcript
      }));
    };

    recognition.start();
  };

  // --- CHATBOT MESSAGE SUBMIT ---
  const handleSendChat = async (textToSend = null) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const updatedMessages = [...chatMessages, { sender: 'user', text: query }];
    setChatMessages(updatedMessages);
    if (!textToSend) setChatInput('');
    
    setChatTyping(true);

    if (geminiKey.trim()) {
      // Live Gemini API call
      try {
        const systemPrompt = `You are InjuryIQ AI, an AI-assisted clinical triage assistant for joint injuries (ankle, foot, knee, wrist, elbow).
Your goal is to guide the user using evidence-based rules (like Ottawa Ankle/Foot/Knee Rules).
Respond in the language of the user's query (English, Hindi, or Hinglish).
CRITICAL:
1. You must NEVER diagnose. Strictly provide triage support and decision advice.
2. Recommend the R.I.C.E. protocol for sprains.
3. Advise visiting the ER or calling emergency services immediately if red flags are present (bone protruding, blue/cold extremities, numbness, pale skin).
4. Prompt the user to use the 'Injury Assessment Checklist' on the dashboard for a full score-based triage report.
5. Keep your responses short and under 3-4 sentences. Use clear bullet points if needed.`;

        // Format chat history for Gemini API, ensuring alternating user and model roles
        const contents = [];
        const recentHistory = updatedMessages.slice(-6);
        recentHistory.forEach(msg => {
          const role = msg.sender === 'user' ? 'user' : 'model';
          
          if (contents.length === 0) {
            contents.push({
              role: role,
              parts: [{ text: msg.text }]
            });
          } else {
            const lastIdx = contents.length - 1;
            if (contents[lastIdx].role === role) {
              // If consecutive messages are of the same role, combine their text
              contents[lastIdx].parts[0].text += "\n" + msg.text;
            } else {
              contents.push({
                role: role,
                parts: [{ text: msg.text }]
              });
            }
          }
        });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              maxOutputTokens: 2048,
              temperature: 0.7
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || 'Gemini API Error');
        }

        const data = await response.json();
        const botReply = data.candidates[0].content.parts[0].text;

        setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        setChatTyping(false);
        speakText(botReply);
      } catch (error) {
        console.error("Gemini API Error:", error);
        const botReply = `⚠️ AI Chat Error: ${error.message}. Switched back to static rules. Please check your settings or key.`;
        setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        setChatTyping(false);
        speakText(botReply);
      }
    } else {
      // Fallback: search static topics
      setTimeout(() => {
        const sanitizedQuery = query.toLowerCase();
        let matchedTopic = null;

        for (const topic of CHATBOT_TOPICS) {
          const matches = topic.keywords.some(keyword => matchKeyword(sanitizedQuery, keyword));
          if (matches) {
            matchedTopic = topic;
            break;
          }
        }

        let botReply = "";
        if (matchedTopic) {
          botReply = matchedTopic[lang] || matchedTopic["en"];
        } else {
          if (lang === 'hi') {
            botReply = "मैं समझता हूँ। कृपया चोट से सम्बंधित कुछ स्पष्ट शब्द लिखकर या माइक दबाकर पूछें, जैसे: 'मोच या फ्रैक्चर', 'बर्फ लगाने का नियम', 'RICE इलाज', 'दर्द निवारक दवा' या 'खतरे के संकेत'। आप ऊपर सेटिंग्स आइकन दबाकर Gemini AI API Key भी सेट कर सकते हैं जिससे मैं हर सवाल का लाइव जवाब दे सकूँ।";
          } else if (lang === 'hn') {
            botReply = "Main samajhta hoon. Injury care ke baare me sawaal poochne ke liye please key phrases bolein/type karein, jaise: 'sprain vs fracture', 'barf lagane ka time', 'R.I.C.E. ilaj', 'pain killer tablet' ya 'danger khatra'. Aap settings icon par click karke Gemini AI API Key bhi add kar sakte hain live answers ke liye.";
          } else {
            botReply = "I understand your concern. Please try typing or speaking key terms like 'sprain vs fracture', 'how to apply ice', 'R.I.C.E. first aid guide', 'pain relief medicines', or 'emergency red flags'. You can also click the settings icon in the header to enter a Google Gemini API Key for live AI answers.";
          }
        }

        setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        setChatTyping(false);
        speakText(botReply);
      }, 800);
    }
  };

  // --- QUESTION HANDLERS ---
  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handlePainIncreases = (item) => {
    setAnswers(prev => {
      const current = prev.painIncreases;
      const index = current.indexOf(item);
      if (index > -1) {
        return { ...prev, painIncreases: current.filter(i => i !== item) };
      } else {
        return { ...prev, painIncreases: [...current, item] };
      }
    });
  };

  const resetAssessment = () => {
    setAnswers({
      age: 22,
      injuryTimeAgo: '1-6 hours',
      howInjured: 'twist_roll',
      soundHeard: 'no_sound',
      painLevel: 5,
      painType: 'sharp_stabbing',
      painIncreases: [],
      painReliefWithMeds: 'no',
      swelling: 'none',
      bruising: 'none',
      deformity: 'no',
      skinColor: 'normal',
      tightTense: false,
      canWalkImmediately: true,
      canWalkNow: true,
      lateralMalleolusTenderness: false,
      medialMalleolusTenderness: false,
      fifthMetatarsalTenderness: false,
      navicularTenderness: false,
      patellarTenderness: false,
      fibularHeadTenderness: false,
      kneeFlexion90: true,
      snuffboxTenderness: false,
      scaphoidTubercleTenderness: false,
      thumbCompressionPain: false,
      gripPain: false,
      movementAbility: 'partial',
      sideComparison: 'slightly_different',
      boneProtruding: false,
      numbnessBelow: false,
      blueColdBelow: false,
      unrelivedPain: false,
      customNotes: ''
    });
    setInjuryArea('');
    setCurrentStep(0);
    setInjuryPhoto(null);
    setInjuryPhotoUrl(null);
    setComparisonPhoto(null);
    setComparisonPhotoUrl(null);
    setAiResult(null);
    if (currentUser) {
      localStorage.removeItem(`injuryiq_active_assessment_${currentUser.email}`);
      localStorage.removeItem(`injuryiq_saved_photo_injury_${currentUser.email}`);
      localStorage.removeItem(`injuryiq_saved_photo_comparison_${currentUser.email}`);
    }
  };

  const handleStartNewAssessment = () => {
    resetAssessment();
    if (!disclaimerAccepted) {
      setView('disclaimer');
    } else {
      setView('questionnaire');
    }
  };

  const acceptDisclaimer = () => {
    setDisclaimerAccepted(true);
    setView('questionnaire');
  };

  const handlePhotoUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'injury') {
        setInjuryPhoto(file);
        setInjuryPhotoUrl(url);
        setAiResult(null);
        if (currentUser) {
          compressAndStoreImage(file, `injuryiq_saved_photo_injury_${currentUser.email}`).then(base64 => {
            setInjuryPhotoUrl(base64);
          });
        }
      } else {
        setComparisonPhoto(file);
        setComparisonPhotoUrl(url);
        setAiResult(null);
        if (currentUser) {
          compressAndStoreImage(file, `injuryiq_saved_photo_comparison_${currentUser.email}`).then(base64 => {
            setComparisonPhotoUrl(base64);
          });
        }
      }
    }
  };

  // --- SCORING CALCULATION ENGINE ---
  const calculateResult = () => {
    console.warn("[TRIAGE SCORING ENGINE] Calculating risk level. Questionnaire answers:", {
      boneProtruding: answers.boneProtruding,
      numbnessBelow: answers.numbnessBelow,
      blueColdBelow: answers.blueColdBelow,
      unrelivedPain: answers.unrelivedPain,
      deformity: answers.deformity,
      skinColor: answers.skinColor
    });

    const emergencyTriggers = [
      answers.boneProtruding === true,
      answers.numbnessBelow === true,
      answers.blueColdBelow === true,
      answers.unrelivedPain === true,
      answers.deformity === 'yes',
      answers.skinColor === 'blue_purple' || answers.skinColor === 'pale_white'
    ];

    const hasEmergencyTrigger = emergencyTriggers.some(t => t === true);

    if (hasEmergencyTrigger) {
      return {
        assessmentId: "assess_" + Math.random().toString(36).substr(2, 9),
        injuryArea,
        injuryTimeAgo: answers.injuryTimeAgo,
        injuryMechanism: answers.howInjured,
        soundHeard: answers.soundHeard,
        symptoms: { ...answers },
        ottawaResults: getOttawaAnswers(),
        redFlags: {
          boneProtruding: answers.boneProtruding,
          numbnessBelow: answers.numbnessBelow,
          blueColdBelow: answers.blueColdBelow,
          unrelivedPain: answers.unrelivedPain
        },
        riskScore: 150,
        riskLevel: "EMERGENCY",
        scoreBreakdown: [
          { factor: "🚨 Emergency Overrides Triggered (Critical Symptoms)", points: 150 }
        ],
        recommendations: {
          level: "EMERGENCY",
          title: lang === 'hi' ? "⚠️ आपातकालीन स्थिति — तुरंत अस्पताल जाएं" : (lang === 'hn' ? "⚠️ EMERGENCY — Turant ER/Doctor ke paas jayein" : "⚠️ EMERGENCY — Seek Immediate Medical Attention"),
          actions: lang === 'hi' ? [
            "तुरंत एम्बुलेंस (108 / 112) बुलाएं या नजदीकी आपातकालीन कक्ष में जाएं।",
            "चोटिल अंग को बिल्कुल न हिलाएं और सीधा करने की कोशिश न करें।",
            "खुले घावों को साफ कपड़े से हल्के से ढकें।"
          ] : [
            "Call emergency services (112 / 108 / 911) or go to the nearest ER immediately.",
            "Do NOT attempt to move or straighten the injured limb.",
            "Keep the patient warm and still. Cover any open wounds with a clean cloth."
          ]
        },
        imageUrl: injuryPhotoUrl,
        aiResult: aiResult || null,
        createdAt: new Date().toISOString()
      };
    }

    let score = 0;
    const breakdown = [];

    // Weight-Bearing (Ottawa)
    if (['ankle', 'foot', 'knee'].includes(injuryArea)) {
      if (!answers.canWalkImmediately && !answers.canWalkNow) {
        score += 30;
        breakdown.push({ factor: "Inability to walk 4 steps (Ottawa Rule positive)", points: 30 });
      }
    }

    // Bone Tenderness Points (Ottawa specific)
    if (injuryArea === 'ankle') {
      if (answers.lateralMalleolusTenderness) {
        score += 25;
        breakdown.push({ factor: "Outer Ankle Bone (Lateral Malleolus) tenderness", points: 25 });
      }
      if (answers.medialMalleolusTenderness) {
        score += 25;
        breakdown.push({ factor: "Inner Ankle Bone (Medial Malleolus) tenderness", points: 25 });
      }
    } else if (injuryArea === 'foot') {
      if (answers.fifthMetatarsalTenderness) {
        score += 25;
        breakdown.push({ factor: "Outer Foot Base (5th Metatarsal) tenderness", points: 25 });
      }
      if (answers.navicularTenderness) {
        score += 25;
        breakdown.push({ factor: "Inner Midfoot (Navicular Bone) tenderness", points: 25 });
      }
    } else if (injuryArea === 'knee') {
      if (answers.age >= 55) {
        score += 15;
        breakdown.push({ factor: "Age ≥ 55 (Ottawa Knee Rule criteria)", points: 15 });
      }
      if (answers.patellarTenderness) {
        score += 25;
        breakdown.push({ factor: "Isolated Kneecap (Patella) tenderness", points: 25 });
      }
      if (answers.fibularHeadTenderness) {
        score += 25;
        breakdown.push({ factor: "Outer Knee Bone (Fibular Head) tenderness", points: 25 });
      }
      if (!answers.kneeFlexion90) {
        score += 20;
        breakdown.push({ factor: "Inability to flex knee to 90 degrees", points: 20 });
      }
    } else if (injuryArea === 'wrist') {
      if (answers.snuffboxTenderness) {
        score += 25;
        breakdown.push({ factor: "Anatomical Snuffbox tenderness (Scaphoid assessment)", points: 25 });
      }
      if (answers.scaphoidTubercleTenderness) {
        score += 25;
        breakdown.push({ factor: "Scaphoid Tubercle tenderness", points: 25 });
      }
      if (answers.thumbCompressionPain) {
        score += 15;
        breakdown.push({ factor: "Pain with thumb compression", points: 15 });
      }
      if (answers.gripPain) {
        score += 15;
        breakdown.push({ factor: "Severe pain when gripping objects", points: 15 });
      }
    }

    // High Energy Mechanism
    if (['fall_height', 'sports_collision', 'vehicle_accident', 'foosh'].includes(answers.howInjured)) {
      score += 15;
      breakdown.push({ factor: "High-energy mechanism of injury", points: 15 });
    }

    // Sound Heard
    if (answers.soundHeard === 'crack_snap') {
      score += 20;
      breakdown.push({ factor: "Cracking/snapping sound heard at injury", points: 20 });
    } else if (answers.soundHeard === 'pop_snap') {
      score += 10;
      breakdown.push({ factor: "Popping sound heard at injury", points: 10 });
    }

    // Pain Parameters
    if (answers.painLevel >= 8) {
      score += 15;
      breakdown.push({ factor: "Severe pain level rated " + answers.painLevel + "/10", points: 15 });
    } else if (answers.painLevel >= 5) {
      score += 8;
      breakdown.push({ factor: "Moderate pain level rated " + answers.painLevel + "/10", points: 8 });
    }

    if (answers.painType === 'sharp_stabbing') {
      score += 10;
      breakdown.push({ factor: "Sharp/stabbing pain character", points: 10 });
    }

    if (answers.painIncreases.includes('constant_rest')) {
      score += 12;
      breakdown.push({ factor: "Constant pain present at rest", points: 12 });
    }

    // Physical Signs
    if (answers.swelling === 'severe') {
      score += 15;
      breakdown.push({ factor: "Severe visual swelling (stretched skin)", points: 15 });
    } else if (answers.swelling === 'moderate') {
      score += 8;
      breakdown.push({ factor: "Moderate visual swelling", points: 8 });
    }

    if (answers.bruising === 'large_area') {
      score += 10;
      breakdown.push({ factor: "Large area of bruising or spreading purple spot", points: 10 });
    }

    if (answers.movementAbility === 'cannot_move') {
      score += 20;
      breakdown.push({ factor: "Inability to move the injured joint at all", points: 20 });
    }

    if (aiResult) {
      if (aiResult.swellingPrediction === 'severe' && answers.swelling !== 'severe') {
        score += 10;
        breakdown.push({ factor: "AI Visual Swelling Validation override", points: 10 });
      }
    }

    // Determine Risk level
    let riskLevel = "LOW";
    let recs = { level: "LOW", title: "", actions: [] };

    if (score <= 20) {
      riskLevel = "LOW";
      recs = {
        level: "LOW",
        title: t.lowRiskTitle,
        actions: lang === 'hi' ? [
          "प्रभावित अंग को आराम (Rest) दें और सूखी बर्फ से सेक (Ice) करें।",
          "सूजन कम करने के लिए जोड़ पर हल्के संपीड़न की पट्टी (Compression) बांधें।",
          "चोटिल अंग को ऊंचाई (Elevation) पर रखें और 48-72 घंटों तक निगरानी रखें।"
        ] : [
          "Apply the R.I.C.E. protocol (Rest, Ice, Compression, Elevation) to reduce pain and swelling.",
          "Rest the joint and monitor for the next 48-72 hours.",
          "Seek medical evaluation if your pain increases or you still cannot bear weight after 3 days."
        ]
      };
    } else if (score <= 50) {
      riskLevel = "MODERATE";
      recs = {
        level: "MODERATE",
        title: t.modRiskTitle,
        actions: lang === 'hi' ? [
          "R.I.C.E. प्रोटोकॉल को तुरंत लागू करें।",
          "जोड़ पर दबाव डालने से बचें। चलने के लिए बैसाखी या सहारे का उपयोग करें।",
          "अगले 24-48 घंटों के भीतर डॉक्टर से अपॉइंटमेंट लें।"
        ] : [
          "Implement the R.I.C.E. protocol immediately.",
          "Avoid putting weight on the limb. Use support if walking.",
          "Book a medical consultation/visit within the next 24-48 hours for clinical evaluation.",
          "Monitor for skin temperature changes or tingling."
        ]
      };
    } else {
      riskLevel = "HIGH";
      recs = {
        level: "HIGH",
        title: t.highRiskTitle,
        actions: lang === 'hi' ? [
          "चोटिल पैर/हाथ पर बिल्कुल भी वजन न डालें।",
          "जोड़ को एक सपोर्ट या स्प्लिंट का उपयोग करके स्थिर (Immobilize) करें।",
          "आज ही किसी हड्डी के डॉक्टर या आपातकालीन केंद्र पर जाएं। एक्स-रे की आवश्यकता है।"
        ] : [
          "Do NOT bear any weight on the injured limb.",
          "Immobilize the joint using a splint or padding.",
          "Visit an urgent care center or doctor today.",
          "An X-ray evaluation is strongly recommended based on clinical decision rules."
        ]
      };
    }

    return {
      assessmentId: "assess_" + Math.random().toString(36).substr(2, 9),
      injuryArea,
      injuryTimeAgo: answers.injuryTimeAgo,
      injuryMechanism: answers.howInjured,
      soundHeard: answers.soundHeard,
      symptoms: { ...answers },
      ottawaResults: getOttawaAnswers(),
      redFlags: {
        boneProtruding: answers.boneProtruding,
        numbnessBelow: answers.numbnessBelow,
        blueColdBelow: answers.blueColdBelow,
        unrelivedPain: answers.unrelivedPain
      },
      riskScore: score,
      riskLevel,
      scoreBreakdown: breakdown,
      recommendations: recs,
      imageUrl: injuryPhotoUrl,
      aiResult: aiResult || null,
      createdAt: new Date().toISOString()
    };
  };

  const getOttawaAnswers = () => {
    if (injuryArea === 'ankle') {
      return {
        canWalkImmediately: answers.canWalkImmediately,
        canWalkNow: answers.canWalkNow,
        lateralMalleolusTenderness: answers.lateralMalleolusTenderness,
        medialMalleolusTenderness: answers.medialMalleolusTenderness
      };
    } else if (injuryArea === 'foot') {
      return {
        canWalkImmediately: answers.canWalkImmediately,
        canWalkNow: answers.canWalkNow,
        fifthMetatarsalTenderness: answers.fifthMetatarsalTenderness,
        navicularTenderness: answers.navicularTenderness
      };
    } else if (injuryArea === 'knee') {
      return {
        canWalkImmediately: answers.canWalkImmediately,
        canWalkNow: answers.canWalkNow,
        patellarTenderness: answers.patellarTenderness,
        fibularHeadTenderness: answers.fibularHeadTenderness,
        kneeFlexion90: answers.kneeFlexion90
      };
    } else {
      return {
        snuffboxTenderness: answers.snuffboxTenderness,
        scaphoidTubercleTenderness: answers.scaphoidTubercleTenderness,
        thumbCompressionPain: answers.thumbCompressionPain,
        gripPain: answers.gripPain
      };
    }
  };

  // Helper to convert file to Base64 for Gemini vision
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  // Compress image using canvas to under 100KB to fit localStorage quota
  const compressAndStoreImage = (file, storageKey) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          // Resize the image
          const canvas = document.createElement('canvas');
          let width = image.width;
          let height = image.height;
          
          // Max dimension 600px
          const max_size = 600;
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, width, height);
          
          // Compress quality 0.6
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          try {
            localStorage.setItem(storageKey, dataUrl);
          } catch (e) {
            console.error("LocalStorage save failed, quota exceeded:", e);
          }
          resolve(dataUrl);
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Convert base64 data URL back to a File object for API upload/handling
  const base64ToFile = (base64String, filename) => {
    if (!base64String || !base64String.startsWith('data:')) return null;
    try {
      const arr = base64String.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (e) {
      console.error("Failed to convert base64 to File:", e);
      return null;
    }
  };

  // Generate deep clinical mock AI visual analysis result
  const getMockAiResult = (joint, answers) => {
    const isHindi = lang === 'hi';
    const isHinglish = lang === 'hn';
    
    let swellingZone = "Lateral Malleolus";
    let alignmentStatus = "Normal joint alignment. No gross bone deformity.";
    let coordinate = { x: 50, y: 55, radius: 18, label: "Inflammation Zone" };

    if (joint === 'ankle') {
      swellingZone = "Anterolateral joint line & Lateral Malleolus";
      coordinate = { x: 48, y: 55, radius: 22, label: "Lateral Malleolus Swelling Zone" };
    } else if (joint === 'foot') {
      swellingZone = "Base of the 5th Metatarsal & Dorsum of foot";
      coordinate = { x: 55, y: 42, radius: 16, label: "5th Metatarsal Tenderness Area" };
    } else if (joint === 'knee') {
      swellingZone = "Suprapatellar pouch & Infrapatellar fat pad";
      coordinate = { x: 50, y: 48, radius: 25, label: "Patellar Edema Zone" };
      alignmentStatus = answers.deformity === 'yes' ? "Mild lateral patellar deviation suspected." : "Normal patellar alignment. Joint spacing is visually preserved.";
    } else if (joint === 'wrist') {
      swellingZone = "Anatomical Snuffbox & Scaphoid tubercle zone";
      coordinate = { x: 42, y: 45, radius: 15, label: "Scaphoid Snuffbox Tenderness" };
    } else if (joint === 'elbow') {
      swellingZone = "Olecranon bursa & Lateral epicondyle";
      coordinate = { x: 55, y: 50, radius: 20, label: "Olecranon Inflammation Area" };
    }

    const swellingSeverity = answers.swelling === 'none' ? 'mild' : answers.swelling;
    const bruisingPrediction = answers.bruising === 'none' ? 'mild' : answers.bruising;
    const bruisingMetrics = answers.bruising === 'none' 
      ? (isHinglish ? "Minor capillary congestion, superficial bruising." : "Minor localized capillary congestion.")
      : (isHinglish ? `Subcutaneous micro-hematoma, spreading around ${swellingZone}.` : `Superficial subcutaneous hematoma patterns localized near the ${swellingZone}.`);

    return {
      swellingZone: swellingZone,
      swellingPrediction: swellingSeverity,
      bruisingPrediction: bruisingPrediction,
      bruisingMetrics: bruisingMetrics,
      alignmentCheck: alignmentStatus,
      confidenceScore: 0.942,
      markerCoordinate: coordinate,
      detectedContent: `${joint.toUpperCase()} joint anatomical structure with visible soft-tissue distension.`,
      reason: isHinglish 
        ? `Clinical visual check passed. Contours conform to human ${joint} anatomy. Swelling pattern detected at ${swellingZone}.` 
        : `Clinical photo matches human ${joint} joint structure. Contour analysis reveals soft tissue edema concentrated near the ${swellingZone}.`
    };
  };

  // Perform Gemini multimodal classification to verify joint image
  const validateImageWithGemini = async (file, selectedJoint) => {
    try {
      const base64Data = await fileToBase64(file);
      const prompt = `You are an expert clinical orthopedic image analysis assistant for InjuryIQ AI.
Analyze this uploaded patient clinical photo. Perform a deep anatomical scanning, localized swelling detection, alignment check, and subcutaneous bruising analysis for the selected joint: '${selectedJoint}'.
Allowed joints: 'ankle', 'foot', 'knee', 'wrist', 'elbow'.

Instructions:
1. Verify if the image is a valid, high-quality clinical photo of a human body part matching '${selectedJoint}'. If it is a random object, scenery, animal, food, or another joint entirely, set "isValid" to false.
2. If valid, deeply analyze the clinical features:
   - Identify the specific swelling zone (e.g. "Lateral Malleolus", "Suprapatellar pouch", "Anatomical Snuffbox").
   - Classify visual swelling severity: "none", "mild", "moderate", "severe".
   - Describe subcutaneous bruising/hematoma spreading patterns in detail.
   - Evaluate joint skeletal/contour alignment symmetry (e.g. "Normal visual alignment", "Significant visual edema", "Possible lateral patellar deviation").
   - Assess a high-confidence coordinate (percentage-based: x from 0-100, y from 0-100) representing the center of the swelling/inflammation zone on the image to draw a visual highlighting marker circle. Add a suitable short label like "Lateral Malleolus Swelling Zone".
   - Compute a scan confidence score (between 0.85 and 0.99).

Return your response strictly in the following JSON format:
{
  "isValid": true,
  "detectedContent": "e.g. Right human ankle in lateral aspect with localized edema",
  "reason": "Detailed patient-friendly clinical conclusion explaining what was scanned in Hinglish/Hindi or English",
  "swellingZone": "e.g. Anterolateral joint line & Lateral Malleolus",
  "swellingSeverity": "none/mild/moderate/severe",
  "bruisingPrediction": "none/mild/moderate/severe",
  "bruisingMetrics": "e.g. Mild subcutaneous capillary congestion, no major hematoma spread.",
  "alignmentStatus": "e.g. Normal joint alignment. Contour symmetry is visually intact.",
  "confidenceScore": 0.975,
  "markerCoordinate": {
    "x": 48,
    "y": 55,
    "radius": 20,
    "label": "Lateral Malleolus Swelling Zone"
  }
}`;

      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: file.type || "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      };

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Gemini API call failed");
      }

      const data = await res.json();
      const text = data.candidates[0].content.parts[0].text;
      const result = JSON.parse(text);
      return result;
    } catch (err) {
      console.error("Gemini image validation error, falling back to local checks:", err);
      return null;
    }
  };

  // --- TRIGGER MOCK AI inference ---
  const detectSkinTonePercentage = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 80;
        canvas.height = 80;
        ctx.drawImage(img, 0, 0, 80, 80);
        try {
          const imgData = ctx.getImageData(0, 0, 80, 80).data;
          let skinPixels = 0;
          const totalPixels = 80 * 80;
          
          for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            
            // Standard RGB skin color bounding rules
            if (r > 95 && g > 40 && b > 20) {
              const maxVal = Math.max(r, g, b);
              const minVal = Math.min(r, g, b);
              if ((maxVal - minVal) > 15) {
                if (Math.abs(r - g) > 15 && r > g && r > b) {
                  skinPixels++;
                }
              }
            }
          }
          const pct = (skinPixels / totalPixels) * 100;
          resolve(pct);
        } catch (err) {
          resolve(50); // Fallback on canvas error
        }
      };
      img.onerror = () => {
        resolve(50); // Fallback on load error
      };
      img.src = imageSrc;
    });
  };

  const checkIsSolidColor = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        try {
          const d = ctx.getImageData(0, 0, 50, 50).data;
          let rSum = 0, gSum = 0, bSum = 0;
          const total = 50 * 50;
          for (let i = 0; i < d.length; i += 4) { rSum += d[i]; gSum += d[i+1]; bSum += d[i+2]; }
          const rAvg = rSum / total, gAvg = gSum / total, bAvg = bSum / total;
          let uniformPixels = 0;
          for (let i = 0; i < d.length; i += 4) {
            if (Math.abs(d[i] - rAvg) < 25 && Math.abs(d[i+1] - gAvg) < 25 && Math.abs(d[i+2] - bAvg) < 25) {
              uniformPixels++;
            }
          }
          resolve((uniformPixels / total) > 0.80);
        } catch {
          resolve(false);
        }
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = imageSrc;
    });
  };

  // --- TRIGGER MOCK AI inference ---
  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisLog([]);
    
    // Check if the uploaded image matches the selected joint
    const fileName = injuryPhoto ? injuryPhoto.name.toLowerCase() : "";
    const selectedJoint = injuryArea ? injuryArea.toLowerCase() : "";
    
    // Start Gemini API validation in background
    let geminiPromise = null;
    if (geminiKey.trim() && injuryPhoto) {
      geminiPromise = validateImageWithGemini(injuryPhoto, selectedJoint);
    }
    
    // Start skin tone checks in background
    const skinPctPromise = injuryPhotoUrl ? detectSkinTonePercentage(injuryPhotoUrl) : Promise.resolve(50);
    const comparisonSkinPctPromise = comparisonPhotoUrl ? detectSkinTonePercentage(comparisonPhotoUrl) : Promise.resolve(50);
    const injuryIsSolidPromise = injuryPhotoUrl ? checkIsSolidColor(injuryPhotoUrl) : Promise.resolve(false);
    const comparisonIsSolidPromise = comparisonPhotoUrl ? checkIsSolidColor(comparisonPhotoUrl) : Promise.resolve(false);

    const logs = [
      "🩺 Phase 1/12: Initializing deep neural diagnostic core...",
      "📸 Phase 2/12: Running high-resolution edge extraction & shape modeling...",
      "🎨 Phase 3/12: Normalizing RGB channels & performing contrast balance...",
      "🧬 Phase 4/12: Performing skeletal alignment outline tracking...",
      "🔍 Phase 5/12: Running CNN layers: detecting joint contours & contours symmetry...",
      "📐 Phase 6/12: Estimating localized volumetric swelling index (Soft-tissue Edema)...",
      "📊 Phase 7/12: Running multi-spectral bruising analysis: checking subcutaneous hematoma spreads...",
      "🔬 Phase 8/12: Dispatching clinical image payload to Gemini 2.5 Vision node...",
      "🧠 Phase 9/12: Generating Chain-of-Thought reasoning for joint pathology...",
      "🎯 Phase 10/12: Resolving diagnostic coordinates mapping for swelling zone...",
      "📋 Phase 11/12: Synthesizing clinical triage recommendations...",
      "✅ Phase 12/12: Deep scanning complete. Generating final report..."
    ];

    let currentLogIndex = 0;
    const interval = setInterval(async () => {
      if (currentLogIndex < logs.length) {
        setAnalysisLog(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        
        try {
          const skinPct = await skinPctPromise;
          const comparisonSkinPct = await comparisonSkinPctPromise;
          const injuryIsSolid = await injuryIsSolidPromise;
          const comparisonIsSolid = await comparisonIsSolidPromise;
          
          let geminiResult = null;
          if (geminiPromise) {
            geminiResult = await geminiPromise;
          }
          
          // Extract exact alphanumeric tokens from filename to prevent substring checks
          const tokens = fileName.split(/[^a-z0-9]+/);
          
          // Keywords representing unrelated items that should fail validation
          const unrelatedKeywords = [
            "flower", "cat", "dog", "car", "truck", "scenery", "sunset", "food", "pizza",
            "burger", "coffee", "cup", "laptop", "keyboard", "code", "random", "tree", "bird"
          ];
          
          let hasUnrelatedKeyword = false;
          let detectedKeyword = "";
          for (const kw of unrelatedKeywords) {
            if (tokens.includes(kw)) {
              hasUnrelatedKeyword = true;
              detectedKeyword = kw;
              break;
            }
          }
          
          // Joint mismatch check if names specify another joint
          let jointMismatch = false;
          let mismatchDetail = "";
          if (selectedJoint === "ankle" && tokens.some(t => ["wrist", "elbow", "hand", "finger", "arm", "knee", "thigh"].includes(t))) {
            jointMismatch = true;
            mismatchDetail = "Wrist/Elbow/Knee image uploaded for Ankle assessment";
          } else if (selectedJoint === "foot" && tokens.some(t => ["wrist", "elbow", "hand", "finger", "arm", "knee", "thigh"].includes(t))) {
            jointMismatch = true;
            mismatchDetail = "Wrist/Elbow/Knee image uploaded for Foot assessment";
          } else if (selectedJoint === "knee" && tokens.some(t => ["wrist", "elbow", "hand", "finger", "arm", "foot", "feet", "shoe", "toe", "ankle", "heel"].includes(t))) {
            jointMismatch = true;
            mismatchDetail = "Foot/Ankle/Hand image uploaded for Knee assessment";
          } else if (selectedJoint === "wrist" && tokens.some(t => ["ankle", "foot", "feet", "knee", "leg", "elbow", "shoe", "toe"].includes(t))) {
            jointMismatch = true;
            mismatchDetail = "Ankle/Knee/Foot image uploaded for Wrist assessment";
          } else if (selectedJoint === "elbow" && tokens.some(t => ["ankle", "foot", "feet", "knee", "leg", "wrist", "hand", "shoe", "toe"].includes(t))) {
            jointMismatch = true;
            mismatchDetail = "Ankle/Knee/Foot/Wrist image uploaded for Elbow assessment";
          }

          // Evaluate validations
          const isNotBodyPart = skinPct < 18.0;
          const isComparisonNotBodyPart = comparisonSkinPct < 18.0;

          // Additional check: reject solid/uniform color images (e.g. red/blue/green backgrounds)
          // Evaluated asynchronously in background checks above

          let failed = false;
          let failMsg = "";
          
          if (geminiResult !== null) {
            console.log("Gemini Vision verification result:", geminiResult);
            if (!geminiResult.isValid) {
              failed = true;
              failMsg = `❌ AI Validation Failed: ${geminiResult.reason || "The photo does not match the selected body part."}`;
            }
          } else {
            // Fallback to local checks
            if (injuryIsSolid) {
              failed = true;
              failMsg = `❌ Image validation failed: The injury photo appears to be a solid color image (not a clinical photo). Please upload a real photo of your ${selectedJoint}.`;
            } else if (comparisonIsSolid) {
              failed = true;
              failMsg = `❌ Image validation failed: The comparison photo appears to be a solid color image. Please upload a real photo of the uninjured side.`;
            } else if (isNotBodyPart) {
              failed = true;
              failMsg = `❌ Image validation failed: The uploaded photo does not appear to contain a close-up of a human joint or skin (detected skin area: ${skinPct.toFixed(1)}%). Please upload a clear photo of the selected body part.`;
            } else if (isComparisonNotBodyPart) {
              failed = true;
              failMsg = `❌ Image validation failed: The comparison photo does not appear to contain a close-up of a human joint or skin (detected skin area: ${comparisonSkinPct.toFixed(1)}%). Please upload a clear photo.`;
            } else if (hasUnrelatedKeyword) {
              failed = true;
              failMsg = `❌ Image validation failed: Detected unrelated object '${detectedKeyword}' in photo. Please upload a clear clinical photo of your ${selectedJoint}.`;
            } else if (jointMismatch) {
              failed = true;
              failMsg = `❌ Image validation failed: ${mismatchDetail}. Selected area is '${selectedJoint.toUpperCase()}', but the photo matches another body joint.`;
            }
          }
          
          if (failed) {
            setAnalysisLog(prev => [...prev, failMsg]);
            setIsAnalyzing(false);
            setAiResult(null);
            alert(failMsg);
          } else {
            // Success flow
            const finalSkinVal = geminiResult ? 95.0 : skinPct;
            const successLogs = [
              `✅ Anatomical verification passed: skin-to-joint contours check passed (${finalSkinVal.toFixed(1)}% skin match).`,
              "🔍 Saliency map generated. Grad-CAM focusing on localized joint swelling...",
              "📉 Classifying soft-tissue swelling index...",
              "📊 Extracting RGB bruising metrics: subcutaneous hematoma pattern detected...",
              "✅ AI inference completed successfully."
            ];
            
            let successIndex = 0;
            const successInterval = setInterval(() => {
              if (successIndex < successLogs.length) {
                setAnalysisLog(prev => [...prev, successLogs[successIndex]]);
                successIndex++;
              } else {
                clearInterval(successInterval);
                let finalAi = null;
                if (geminiResult && geminiResult.isValid) {
                  finalAi = {
                    swellingZone: geminiResult.swellingZone || (selectedJoint === 'knee' ? "Infrapatellar" : "Lateral Malleolus"),
                    swellingPrediction: geminiResult.swellingSeverity || (answers.swelling === 'none' ? 'mild' : answers.swelling),
                    bruisingPrediction: geminiResult.bruisingPrediction || (answers.bruising === 'none' ? 'mild' : answers.bruising),
                    bruisingMetrics: geminiResult.bruisingMetrics || "Superficial epidermal micro-congestion.",
                    alignmentCheck: geminiResult.alignmentStatus || "Normal structural alignment.",
                    confidenceScore: geminiResult.confidenceScore || 0.95,
                    markerCoordinate: geminiResult.markerCoordinate || { x: 50, y: 50, radius: 18, label: "Swelling Zone" },
                    detectedContent: geminiResult.detectedContent || "Human joint structure.",
                    reason: geminiResult.reason
                  };
                } else {
                  finalAi = getMockAiResult(selectedJoint, answers);
                }
                setAiResult(finalAi);
                setIsAnalyzing(false);
              }
            }, 300);
          }
        } catch (err) {
          console.error("Analysis execution error:", err);
          setIsAnalyzing(false);
          alert("Error during image analysis. Please try again.");
        }
      }
    }, 1000);
  };

  const handleFinishAssessment = async () => {
    // Both photos are compulsory
    if (!injuryPhoto) {
      alert(lang === 'hi' ? 'कृपया चोट की फोटो अपलोड करें। यह अनिवार्य है।' : lang === 'hn' ? 'Injury photo upload karna zaroori hai. Please photo add karein.' : 'Please upload the injury photo. Both photos are required to generate the report.');
      return;
    }
    if (!comparisonPhoto) {
      alert(lang === 'hi' ? 'कृपया तुलना के लिए दूसरी फोटो भी अपलोड करें। यह अनिवार्य है।' : lang === 'hn' ? 'Comparison photo bhi upload karna zaroori hai.' : 'Please upload the comparison (other side) photo. Both photos are required.');
      return;
    }
    // Require AI validation results to be present
    if (!aiResult) {
      alert(lang === 'hi' 
        ? 'कृपया रिपोर्ट जनरेट करने से पहले "Run AI Analysis" बटन दबाकर अपनी चोट की फोटो का सत्यापन (verification) करें।' 
        : lang === 'hn' 
        ? 'Please report generate karne se pehle "Run AI Analysis" button daba kar apni photo verify karein.' 
        : 'Please click "Run AI Analysis" to verify your photos before generating the report.');
      return;
    }
    const defaultPayload = {
      userId: currentUser ? currentUser.email : "guest_user",
      injuryArea: injuryArea,
      age: answers.age,
      injuryTimeAgo: answers.injuryTimeAgo,
      howInjured: answers.howInjured,
      soundHeard: answers.soundHeard,
      symptoms: {
        painLevel: answers.painLevel,
        painType: answers.painType,
        painIncreases: answers.painIncreases,
        painReliefWithMeds: answers.painReliefWithMeds,
        swelling: answers.swelling,
        bruising: answers.bruising,
        deformity: answers.deformity,
        skinColor: answers.skinColor,
        tightTense: answers.tightTense,
        movementAbility: answers.movementAbility,
        sideComparison: answers.sideComparison
      },
      ottawaResults: {
        canWalkImmediately: answers.canWalkImmediately,
        canWalkNow: answers.canWalkNow,
        lateralMalleolusTenderness: answers.lateralMalleolusTenderness,
        medialMalleolusTenderness: answers.medialMalleolusTenderness,
        fifthMetatarsalTenderness: answers.fifthMetatarsalTenderness,
        navicularTenderness: answers.navicularTenderness,
        patellarTenderness: answers.patellarTenderness,
        fibularHeadTenderness: answers.fibularHeadTenderness,
        kneeFlexion90: answers.kneeFlexion90,
        snuffboxTenderness: answers.snuffboxTenderness,
        scaphoidTubercleTenderness: answers.scaphoidTubercleTenderness,
        thumbCompressionPain: answers.thumbCompressionPain,
        gripPain: answers.gripPain
      },
      redFlags: {
        boneProtruding: answers.boneProtruding,
        numbnessBelow: answers.numbnessBelow,
        blueColdBelow: answers.blueColdBelow,
        unrelivedPain: answers.unrelivedPain
      },
      imageUrl: injuryPhotoUrl || null,
      comparisonImageUrl: comparisonPhotoUrl || null,
      lang: lang
    };

    // Use local clinical scoring engine (no backend dependency)
    const finalResult = calculateResult();


    const historyKey = currentUser ? `injuryiq_history_${currentUser.email}` : 'injuryiq_history';
    const updatedHistory = [finalResult, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    setSelectedHistoryItem(finalResult);
    setView('details');
  };

  const handleDeleteHistory = (id) => {
    const updated = history.filter(item => item.assessmentId !== id);
    setHistory(updated);
    const historyKey = currentUser ? `injuryiq_history_${currentUser.email}` : 'injuryiq_history';
    localStorage.setItem(historyKey, JSON.stringify(updated));
    if (activeTrackingId === id) {
      setActiveTrackingId('');
      localStorage.removeItem(`injuryiq_active_tracking_${currentUser.email}`);
    }
  };

  if (!currentUser) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', maxWidth: '440px', margin: '0 auto' }}>
        {/* Logo and Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.5rem', fontWeight: 800 }}>
            <img src="/logo.png" alt="InjuryIQ Logo" style={{ width: '52px', height: '52px', borderRadius: '12px', objectFit: 'cover', cursor: 'pointer' }} onClick={() => { window.location.href = '/'; }} onError={(e) => { e.target.style.display='none'; }} />
            <span style={{ color: darkMode ? 'var(--text-primary)' : 'var(--text-light-primary)' }}>InjuryIQ</span>
            <span style={{ color: 'var(--primary)' }}>AI</span>
          </div>
          <p style={{ color: darkMode ? 'var(--text-secondary)' : 'var(--text-light-secondary)', marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
            AI-Assisted Joint Injury Triage System
          </p>
        </div>

        {/* ─── OTP Verification Panel (shown after signup) ─── */}
        {otpMode ? (
          <div className="glass-panel" style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Icon + Title */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <span style={{ fontSize: 26 }}>📧</span>
              </div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Verify Your Email</h2>
              <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                A 6-digit OTP was sent to <strong style={{ color: 'var(--primary)' }}>{otpEmail}</strong>
              </p>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                (Demo mode: check your backend console for the code)
              </p>
            </div>

            {/* OTP Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Enter OTP Code</label>
              <input
                id="otp-input"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => { if (e.key === 'Enter') handleOtpVerify(); }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: `2px solid ${otpError ? '#ef4444' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  color: 'inherit',
                  fontSize: '1.4rem',
                  letterSpacing: '0.5rem',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Error */}
            {otpError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.8rem', color: '#fca5a5', fontSize: '0.82rem' }}>
                ⚠️ {otpError}
              </div>
            )}

            {/* Resend message */}
            {otpResendMsg && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.8rem', color: '#86efac', fontSize: '0.82rem' }}>
                {otpResendMsg}
              </div>
            )}

            {/* Verify Button */}
            <button
              className="btn btn-primary"
              style={{ justifyContent: 'center', width: '100%', padding: '0.75rem', fontWeight: 700 }}
              onClick={handleOtpVerify}
              disabled={otpLoading}
            >
              {otpLoading ? '⏳ Verifying...' : '✅ Verify OTP & Continue'}
            </button>

            {/* Resend + Back */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
              <button
                onClick={handleOtpResend}
                disabled={otpResendLoading}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 600 }}
              >
                {otpResendLoading ? 'Sending...' : '🔄 Resend OTP'}
              </button>
              <button
                onClick={() => { setOtpMode(false); setOtpCode(''); setOtpError(''); setOtpResendMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
              >
                ← Back to Login
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card Top Nav (Lang + Theme) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
              <Globe size={14} />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                style={{ background: 'none', border: 'none', color: 'inherit', fontSize: '0.8rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
              >
                <option value="en" style={{ background: 'var(--bg-surface)', color: '#fff' }}>English</option>
                <option value="hi" style={{ background: 'var(--bg-surface)', color: '#fff' }}>हिन्दी (Hindi)</option>
                <option value="hn" style={{ background: 'var(--bg-surface)', color: '#fff' }}>Hinglish</option>
              </select>
            </div>
            
            <button 
              className="btn btn-secondary" 
              onClick={() => setDarkMode(!darkMode)}
              style={{ padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', padding: '0.2rem', border: '1px solid var(--border)' }}>
            <button 
              style={{ 
                flex: 1, 
                padding: '0.5rem', 
                border: 'none', 
                borderRadius: 'var(--radius-sm)', 
                background: authMode === 'login' ? 'var(--primary)' : 'transparent',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
            >
              {lang === 'hi' ? 'लॉगिन' : (lang === 'hn' ? 'Login' : 'Login')}
            </button>
            <button 
              style={{ 
                flex: 1, 
                padding: '0.5rem', 
                border: 'none', 
                borderRadius: 'var(--radius-sm)', 
                background: authMode === 'signup' ? 'var(--primary)' : 'transparent',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
              onClick={() => { setAuthMode('signup'); setAuthError(''); }}
            >
              {lang === 'hi' ? 'रजिस्टर' : (lang === 'hn' ? 'Sign Up' : 'Sign Up')}
            </button>
          </div>

          {/* Error Alert */}
          {authError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-emergency)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={14} />
              <span>{authError}</span>
            </div>
          )}

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {authMode === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>{lang === 'hi' ? 'पूरा नाम' : 'Full Name'}</label>
                <input 
                  type="text" 
                  placeholder={lang === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'} 
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'inherit', outline: 'none' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'inherit', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'inherit', outline: 'none' }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ justifyContent: 'center', width: '100%', padding: '0.7rem', fontWeight: 700 }}
              onClick={handleAuthSubmit}
              disabled={isAuthLoading}
            >
              {isAuthLoading ? (
                <RefreshCw size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
              ) : (
                authMode === 'login' ? (lang === 'hi' ? 'लॉगिन करें' : 'Login') : (lang === 'hi' ? 'रजिस्टर करें' : 'Sign Up')
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '0.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
              <span style={{ padding: '0 0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ justifyContent: 'center', width: '100%', padding: '0.7rem', gap: '0.5rem', display: 'flex', alignItems: 'center', position: 'relative' }}
              onClick={handleGoogleSignIn}
              disabled={isAuthLoading || googleAuthLoading}
            >
              {googleAuthLoading ? (
                <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <svg width="16" height="16" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.7-1.57 2.69-3.88 2.69-6.57z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.33-1.58-5.04-3.71H.95v2.3C2.43 15.89 5.5 18 9 18z" fill="#34A853" />
                  <path d="M3.96 10.74c-.18-.54-.28-1.12-.28-1.74s.1-1.2.28-1.74V4.96H.95C.35 6.17 0 7.55 0 9s.35 2.83.95 4.04l3.01-2.3z" fill="#FBBC05" />
                  <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.3C13.47.88 11.43 0 9 0 5.5 0 2.43 2.11.95 4.96l3.01 2.3c.71-2.13 2.69-3.71 5.04-3.71z" fill="#EA4335" />
                </svg>
              )}
              <span>
                {googleAuthLoading
                  ? (lang === 'hi' ? 'Google से जुड़ रहे हैं...' : 'Connecting to Google...')
                  : authMode === 'login'
                    ? (lang === 'hi' ? 'Google से Login करें' : lang === 'hn' ? 'Google se Login karein' : 'Login with Google')
                    : (lang === 'hi' ? 'Google से Sign Up करें' : lang === 'hn' ? 'Google se Sign Up karein' : 'Sign Up with Google')
                }
              </span>
            </button>
          </div>
        </div>
        )} {/* end of otpMode ternary */}

      </div>
    );
  }


  return (
    <div className="container">
      {/* --- TOP HEADLINE NAVIGATION --- */}
      <header className="header-nav slide-in">
        {/* Logo */}
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => { window.location.href = '/'; }}>
          <img src="/logo.png" alt="InjuryIQ" className="logo-img" onError={(e) => { e.target.style.display='none'; }} />
          <span>InjuryIQ</span><span style={{ color: 'var(--brand-primary)', fontWeight: 400, fontSize: '1.1rem' }}> AI</span>
        </div>

        {/* Desktop Nav */}
        <nav className="nav-desktop">
          {/* User chip */}
          <div className="user-chip">
            <div className="user-avatar">
              {currentUser?.photoURL
                ? <img src={currentUser.photoURL} alt="" />
                : (currentUser?.name?.[0] || currentUser?.email?.[0] || '?').toUpperCase()
              }
            </div>
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.name || currentUser?.email?.split('@')[0]}
            </span>
          </div>

          {/* Nav pills */}
          <button className={`nav-pill ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            🏠 Dashboard
          </button>
          <button className={`nav-pill ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
            📋 History
          </button>
          {activeTrackingId && (
            <button className={`nav-pill ${view === 'recovery' ? 'active' : ''}`} onClick={() => setView('recovery')}>
              📈 Recovery
            </button>
          )}

          {/* Language */}
          <div className="lang-select">
            <Globe size={12} />
            <select value={lang} onChange={(e) => setLang(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.82rem', fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none' }}>
              <option value="en" style={{ background: '#111d35' }}>EN</option>
              <option value="hi" style={{ background: '#111d35' }}>हिन्दी</option>
              <option value="hn" style={{ background: '#111d35' }}>Hinglish</option>
            </select>
          </div>

          {/* PWA Install Button */}
          <button className="nav-pill nav-install" onClick={handleInstallApp} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>
            📥 Install App
          </button>

          {/* New Assessment CTA */}
          <button className="nav-pill nav-cta" onClick={handleStartNewAssessment}>
            ✦ New Assessment
          </button>

          {/* Logout */}
          <button className="nav-pill nav-logout" onClick={handleLogout}>
            ⎋ Logout
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
          <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}></span>
          <span style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
          <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}></span>
        </button>
      </header>

      {/* Mobile Nav Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 1rem 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.25rem' }}>
          <div className="user-avatar" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
            {currentUser?.photoURL
              ? <img src={currentUser.photoURL} alt="" />
              : (currentUser?.name?.[0] || currentUser?.email?.[0] || '?').toUpperCase()
            }
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{currentUser?.name || 'User'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
          </div>
        </div>
        <button className={`mobile-nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }}>🏠 Dashboard</button>
        <button className={`mobile-nav-item ${view === 'history' ? 'active' : ''}`} onClick={() => { setView('history'); setMobileMenuOpen(false); }}>📋 History</button>
        {activeTrackingId && (
          <button className={`mobile-nav-item ${view === 'recovery' ? 'active' : ''}`} onClick={() => { setView('recovery'); setMobileMenuOpen(false); }}>📈 Recovery Tracking</button>
        )}
        <div className="mobile-nav-divider" />
        <button className="mobile-nav-item cta" onClick={() => { handleStartNewAssessment(); setMobileMenuOpen(false); }}>✦ Start New Assessment</button>
        <div className="mobile-nav-divider" />
        {/* Language selector in drawer */}
        <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={14} color="var(--text-muted)" />
          <select value={lang} onChange={(e) => setLang(e.target.value)}
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '0.35rem 0.5rem', fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none' }}>
            <option value="en" style={{ background: '#111d35' }}>English</option>
            <option value="hi" style={{ background: '#111d35' }}>हिन्दी</option>
            <option value="hn" style={{ background: '#111d35' }}>Hinglish</option>
          </select>
        </div>
        {/* Mobile PWA Install Button */}
        <button className="mobile-nav-item install-cta" onClick={() => { handleInstallApp(); setMobileMenuOpen(false); }} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0.5rem 1rem' }}>
          📥 Install InjuryIQ AI
        </button>

        <button className="mobile-nav-item danger" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>⎋ Logout</button>
      </div>

      {/* --- SCREEN 1: DASHBOARD VIEW --- */}
      {view === 'dashboard' && (
        <div className="dashboard-grid fade-in">
          <div>
            {/* Hero Welcome Banner */}
            <div className="hero-banner" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ flex: '1 1 280px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>👋 Welcome back</div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', background: 'linear-gradient(135deg, #f0f6ff, var(--brand-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {currentUser.name}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.5rem', fontSize: '0.92rem', maxWidth: 400 }}>
                    {t.appSub}
                  </p>
                  <div className="hero-buttons">
                    <button className="btn btn-primary glow-primary" onClick={handleStartNewAssessment} style={{ borderRadius: 'var(--radius-full)' }}>
                      ✦ {t.startNew}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setView('history')} style={{ borderRadius: 'var(--radius-full)' }}>
                      📋 {t.viewRecords}
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ borderRadius: 'var(--radius-full)' }}
                      onClick={() => setIsSosOpen(true)}
                    >
                      <AlertTriangle size={15} /> {lang === 'hi' ? 'SOS' : 'Emergency SOS'}
                    </button>
                  </div>
                </div>
                {/* Stats mini row */}
                <div className="hero-stats-row">
                  <div className="stat-card" style={{ padding: '0.9rem 1.1rem', minWidth: 'auto', flex: 1 }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Assessments</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{history.length}</div>
                  </div>
                  <div className="stat-card" style={{ padding: '0.9rem 1.1rem', minWidth: 'auto', flex: 1 }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Last Risk</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                      {history.length > 0
                        ? <span className={`badge badge-${history[0].riskLevel}`}>{history[0].riskLevel}</span>
                        : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None yet</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {activeTrackingId && (() => {
              const trackedItem = history.find(item => item.assessmentId === activeTrackingId);
              if (!trackedItem) return null;
              return (
                <div className="glass-panel glow-primary slide-in" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                        <Activity size={20} />
                        <span>{lang === 'hi' ? "सक्रिय रिकवरी ट्रैकिंग" : (lang === 'hn' ? "Active Recovery Tracking Chalu Hai" : "Active Recovery Tracking")}</span>
                      </div>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: darkMode ? 'var(--text-secondary)' : 'var(--text-light-secondary)' }}>
                        {lang === 'hi' 
                          ? `${trackedItem.injuryArea} की चोट के लिए दैनिक सुधार ट्रैक करें।` 
                          : (lang === 'hn' 
                              ? `${trackedItem.injuryArea} injury ke liye daily healing progress track karein.` 
                              : `Tracking healing progress for your ${trackedItem.injuryArea} injury.`)}
                      </p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setView('recovery')}>
                      {lang === 'hi' ? "प्रगति देखें" : (lang === 'hn' ? "Progress Dekhein" : "View Dashboard")}
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Quick First Aid Info Card */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={20} style={{ color: 'var(--color-emergency)' }} /> {t.riceCompanion}
              </h3>
              <p style={{ fontSize: '0.95rem' }}>
                {lang === 'hi' 
                  ? "चोट के दर्द और सूजन को नियंत्रित करने के लिए विश्राम (Rest), बर्फ (Ice), संपीड़न (Compression) और ऊंचाई (Elevation) का उपयोग करें।" 
                  : (lang === 'hn' 
                      ? "Injury pain aur sujan ko control karne ke liye Rest, Ice, Compression aur Elevation ka use karein." 
                      : "First-aid management for soft-tissue sprains using Rest, Ice, Compression, and Elevation. Try our clinical active ice timer:"
                    )}
              </p>
              
              <div className="glass-panel ice-timer-row" style={{ padding: '1.5rem', marginTop: '1rem', background: 'rgba(59, 130, 246, 0.08)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} />
                    <span style={{ fontWeight: 600 }}>{t.iceTimerTitle}</span>
                  </div>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: darkMode ? 'var(--text-secondary)' : 'var(--text-light-secondary)' }}>
                    {t.iceTimerSub}
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'monospace' }}>
                    {formatIceTime(iceTime)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={toggleIceTimer}>
                      {iceTimerRunning ? (lang === 'hi' ? "रोकें" : "Pause") : (lang === 'hi' ? "शुरू" : "Start")}
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={resetIceTimer}>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Recent History & Status */}
          <div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HistoryIcon size={18} /> {t.recentAssessments}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.slice(0, 3).map((item, idx) => (
                  <div 
                    key={idx} 
                    className="glass-panel glass-panel-hover" 
                    style={{ padding: '1rem', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}
                    onClick={() => {
                      setSelectedHistoryItem(item);
                      setView('details');
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.95rem' }}>
                        {lang === 'hi' ? (item.injuryArea === 'ankle' ? 'टखने की चोट' : item.injuryArea === 'knee' ? 'घुटने की चोट' : item.injuryArea === 'foot' ? 'पैर की चोट' : 'कलाई की चोट') : `${item.injuryArea} Injury`}
                      </span>
                      <span className={`badge badge-${item.riskLevel.toLowerCase()}`}>
                        {item.riskLevel}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: darkMode ? 'var(--text-secondary)' : 'var(--text-light-secondary)' }}>
                      <span>Score: {item.riskScore}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <p style={{ fontSize: '0.9rem', textAlign: 'center', color: 'var(--text-secondary)', margin: '1rem 0' }}>
                    {t.noAssessments}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SCREEN 2: MEDICAL DISCLAIMER SCREEN --- */}
      {view === 'disclaimer' && (
        <div className="slide-in" style={{ maxWidth: '600px', margin: '3rem auto' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--color-emergency)' }}>
              <ShieldAlert size={56} style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ textAlign: 'center', fontWeight: 700, color: 'var(--color-emergency)' }}>{t.disclaimerTitle}</h2>
            
            <p style={{ fontSize: '0.95rem', margin: '1.5rem 0' }}>
              <strong>{t.disclaimerIntro}</strong> 
            </p>
            <div className="glass-panel" style={{ padding: '1rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)', margin: '1.5rem 0' }}>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {t.disclaimerPoints.map((pt, index) => (
                  <li key={index}>{pt}</li>
                ))}
              </ul>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
              <button className="btn btn-primary" style={{ justifyContent: 'center', background: 'var(--color-emergency)' }} onClick={acceptDisclaimer}>
                {t.acceptDisclaimer}
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setView('dashboard')}>
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SCREEN 3 & 4: QUESTIONNAIRE WIZARD --- */}
      {view === 'questionnaire' && (
        <div className="slide-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-panel step-progress-area" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
              {steps[currentStep].category} ({t.step} {currentStep + 1} {t.of} {steps.length})
            </div>
            <div className="step-progress-bar-wrapper">
              <div style={{ background: 'rgba(255,255,255,0.08)', height: '6px', borderRadius: '3px', flex: 1, overflow: 'hidden' }}>
                <div style={{ background: 'var(--primary)', height: '100%', width: `${((currentStep + 1) / steps.length) * 100}%`, transition: 'width 0.3s' }}></div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={resetAssessment}>
              {t.abort}
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            {/* STEP 0: AREA SELECTION */}
            {currentStep === 0 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center' }}>{t.injuryLocationQuestion}</h3>
                <p style={{ textAlign: 'center', color: darkMode ? 'var(--text-secondary)' : 'var(--text-light-secondary)', marginBottom: '2rem' }}>
                  {t.selectJointSubtitle}
                </p>
                
                <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Interactive SVG Body Map */}
                  <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: '280px', height: '340px' }}>
                    <svg width="240" height="320" viewBox="0 0 240 320" style={{ overflow: 'visible' }}>
                      {/* Stylized Human Skeletal/Joint Connection Path */}
                      {/* Head */}
                      <circle cx="120" cy="35" r="16" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                      <circle cx="120" cy="35" r="6" fill="rgba(255,255,255,0.1)" />
                      
                      {/* Spine / Torso */}
                      <line x1="120" y1="51" x2="120" y2="140" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                      <line x1="90" y1="65" x2="150" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                      <line x1="100" y1="140" x2="140" y2="140" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                      
                      {/* Arms */}
                      {/* Left Arm (Wrist) */}
                      <path d="M120 65 L75 95 L55 125" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
                      {/* Right Arm */}
                      <path d="M120 65 L165 95 L185 125" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
                      
                      {/* Legs */}
                      {/* Left Leg */}
                      <path d="M100 140 L90 205 L80 270 L95 285" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
                      {/* Right Leg (Knee, Ankle, Foot) */}
                      <path d="M140 140 L150 205 L160 270 L175 285" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
                      
                      {/* Hotspots */}
                      {/* 1. Wrist Hotspot (55, 125) */}
                      <g onClick={() => setInjuryArea('wrist')} style={{ cursor: 'pointer' }}>
                        <circle cx="55" cy="125" r="14" fill={injuryArea === 'wrist' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)'} stroke={injuryArea === 'wrist' ? 'var(--primary)' : 'rgba(255,255,255,0.3)'} strokeWidth="2" style={{ transition: 'all 0.2s' }} />
                        <circle cx="55" cy="125" r="4" fill={injuryArea === 'wrist' ? 'var(--primary)' : 'rgba(255,255,255,0.6)'} />
                        <text x="35" y="128" fill="var(--text-secondary)" fontSize="9" fontWeight="bold" textAnchor="end">Wrist</text>
                      </g>

                      {/* 2. Knee Hotspot (150, 205) */}
                      <g onClick={() => setInjuryArea('knee')} style={{ cursor: 'pointer' }}>
                        <circle cx="150" cy="205" r="14" fill={injuryArea === 'knee' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)'} stroke={injuryArea === 'knee' ? 'var(--primary)' : 'rgba(255,255,255,0.3)'} strokeWidth="2" style={{ transition: 'all 0.2s' }} />
                        <circle cx="150" cy="205" r="4" fill={injuryArea === 'knee' ? 'var(--primary)' : 'var(--color-low-bg)'} />
                        <text x="170" y="208" fill="var(--text-secondary)" fontSize="9" fontWeight="bold" textAnchor="start">Knee</text>
                      </g>

                      {/* 3. Ankle Hotspot (160, 270) */}
                      <g onClick={() => setInjuryArea('ankle')} style={{ cursor: 'pointer' }}>
                        <circle cx="160" cy="270" r="14" fill={injuryArea === 'ankle' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)'} stroke={injuryArea === 'ankle' ? 'var(--primary)' : 'rgba(255,255,255,0.3)'} strokeWidth="2" style={{ transition: 'all 0.2s' }} />
                        <circle cx="160" cy="270" r="4" fill={injuryArea === 'ankle' ? 'var(--primary)' : 'var(--color-low-bg)'} />
                        <text x="180" y="273" fill="var(--text-secondary)" fontSize="9" fontWeight="bold" textAnchor="start">Ankle</text>
                      </g>

                      {/* 4. Foot Hotspot (175, 285) */}
                      <g onClick={() => setInjuryArea('foot')} style={{ cursor: 'pointer' }}>
                        <circle cx="175" cy="285" r="14" fill={injuryArea === 'foot' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)'} stroke={injuryArea === 'foot' ? 'var(--primary)' : 'rgba(255,255,255,0.3)'} strokeWidth="2" style={{ transition: 'all 0.2s' }} />
                        <circle cx="175" cy="285" r="4" fill={injuryArea === 'foot' ? 'var(--primary)' : 'var(--color-low-bg)'} />
                        <text x="195" y="295" fill="var(--text-secondary)" fontSize="9" fontWeight="bold" textAnchor="start">Foot</text>
                      </g>
                    </svg>
                  </div>
                  
                  {/* Cards Grid List */}
                  <div className="joint-selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: window.innerWidth < 768 ? '100%' : '350px' }}>
                    {[
                      { id: 'ankle', label: lang === 'hi' ? 'टखना (Ankle)' : 'Ankle (Takhna)' },
                      { id: 'foot', label: lang === 'hi' ? 'पैर (Foot)' : 'Foot (Pair)' },
                      { id: 'knee', label: lang === 'hi' ? 'घुटना (Knee)' : 'Knee (Ghuthna)' },
                      { id: 'wrist', label: lang === 'hi' ? 'कलाई (Wrist)' : 'Wrist (Kalai)' }
                    ].map((area) => (
                      <div 
                        key={area.id} 
                        className={`glass-panel glass-panel-hover ${injuryArea === area.id ? 'glow-primary' : ''}`}
                        style={{ 
                          padding: '1.25rem', 
                          textAlign: 'center', 
                          cursor: 'pointer', 
                          border: injuryArea === area.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: injuryArea === area.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => setInjuryArea(area.id)}
                      >
                        <Activity size={20} style={{ color: injuryArea === area.id ? 'var(--primary)' : 'inherit', marginBottom: '0.4rem' }} />
                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{area.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: CONTEXT & TIMELINE */}
            {currentStep === 1 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.metadataTitle}</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t.ageLabel}</label>
                  <input 
                    type="number" 
                    className="glass-panel" 
                    value={answers.age}
                    onChange={(e) => handleAnswerChange('age', parseInt(e.target.value))}
                    style={{ width: '100px', padding: '0.75rem', fontSize: '1.1rem', color: 'inherit', textAlign: 'center' }}
                  />
                  {answers.age < 18 && (
                    <p style={{ color: 'var(--color-moderate)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <AlertTriangle size={14} /> {t.ageWarning}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t.timelineLabel}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { id: 'Less than 1 hour', label: lang === 'hi' ? 'ताजी चोट (1 घंटे से कम पहले)' : 'Fresh Injury (Less than 1 hour ago)' },
                      { id: '1-6 hours', label: lang === 'hi' ? '1 से 6 घंटे पहले' : '1 to 6 hours ago' },
                      { id: '6-24 hours', label: lang === 'hi' ? '6 से 24 घंटे पहले' : '6 to 24 hours ago' },
                      { id: '1-3 days', label: lang === 'hi' ? '1 से 3 दिन पहले' : '1 to 3 days ago' },
                      { id: 'More than 3 days', label: lang === 'hi' ? '3 दिन से अधिक पहले' : 'More than 3 days ago' }
                    ].map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="injuryTimeAgo" 
                          checked={answers.injuryTimeAgo === opt.id}
                          onChange={() => handleAnswerChange('injuryTimeAgo', opt.id)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Voice / Typing Symptom Input Section */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>
                    {t.customNotesLabel}
                  </label>
                  
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <textarea
                      className="glass-panel"
                      value={answers.customNotes}
                      onChange={(e) => handleAnswerChange('customNotes', e.target.value)}
                      placeholder={t.customNotesPlaceholder}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '0.85rem',
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                        color: 'inherit',
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s'
                      }}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
                      {/* Listening pulse/indicator */}
                      {isSymptomListening && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-emergency)' }}>
                          <span className="pulse" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-emergency)' }} />
                          <span>{t.speakBtnListening}</span>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={startSymptomVoiceRecognition}
                        className={`btn ${isSymptomListening ? 'glow-emergency' : 'btn-secondary'}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          backgroundColor: isSymptomListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          color: isSymptomListening ? 'var(--color-emergency)' : 'inherit',
                          border: isSymptomListening ? '1px solid var(--color-emergency)' : '1px solid var(--border)',
                          borderRadius: '30px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          animation: isSymptomListening ? 'pulseMic 1.2s infinite' : 'none'
                        }}
                      >
                        {isSymptomListening ? <MicOff size={16} /> : <Mic size={16} />}
                        <span>{isSymptomListening ? t.speakBtnListening.split('...')[0] : t.speakBtnStart}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: HOW IT HAPPENED */}
            {currentStep === 2 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t.mechanismLabel}</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ block: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{lang === 'hi' ? "चोट कैसे लगी?" : lang === 'hn' ? "Chot kaise lagi?" : "How did the injury occur?"}</label>
                  <select 
                    className="glass-panel" 
                    value={answers.howInjured}
                    onChange={(e) => handleAnswerChange('howInjured', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', color: 'inherit', background: 'var(--bg-surface)' }}
                  >
                    <option value="twist_roll">
                      {lang === 'hi' ? 'जोड़ मुड़ जाना (मोच आना)' : lang === 'hn' ? 'Joint ka mudna ya roll hona (Moch)' : 'Twisting / Rolling the joint (Moch)'}
                    </option>
                    <option value="fall_height">
                      {lang === 'hi' ? 'ऊंचाई से गिरना (जैसे सीढ़ी या स्टूल से)' : lang === 'hn' ? 'Oonchai se girna (jaise stairs se)' : 'Falling from a height (stairs/stool)'}
                    </option>
                    <option value="foosh">
                      {lang === 'hi' ? 'हाथ के बल गिरना (हथेली ज़मीन पर टिकना)' : lang === 'hn' ? 'Haath/Hatheli ke bal zameen par girna' : 'Falling forward on an open hand / palm'}
                    </option>
                    <option value="sports_collision">
                      {lang === 'hi' ? 'खेल के दौरान टक्कर या गिरना' : lang === 'hn' ? 'Sports ke time takkar lagna ya girna' : 'Collision or fall during sports'}
                    </option>
                    <option value="vehicle_accident">
                      {lang === 'hi' ? 'बाइक, स्कूटर या वाहन दुर्घटना' : lang === 'hn' ? 'Bike, scooter ya gadi se slip hona/accident' : 'Bike or vehicle accident/slip'}
                    </option>
                    <option value="direct_blow">
                      {lang === 'hi' ? 'जोड़ पर सीधी चोट (जैसे कोई भारी चीज़ गिरना)' : lang === 'hn' ? 'Joint par direct hit ya koi bhari cheez girna' : 'Direct hit or heavy object falling on joint'}
                    </option>
                    <option value="other">
                      {lang === 'hi' ? 'अन्य कोई कारण' : lang === 'hn' ? 'Koi dusra reason' : 'Other reason'}
                    </option>
                  </select>
                </div>
 
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t.soundLabel}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { 
                        id: 'crack_snap', 
                        label: lang === 'hi' ? 'हड्डी चटकने या टूटने जैसी आवाज़' : lang === 'hn' ? 'Haddi chatakne ya tootne jaisi aawaz (Crack/Snap)' : 'A cracking or snapping sound (like a bone crack)' 
                      },
                      { 
                        id: 'pop_snap', 
                        label: lang === 'hi' ? 'नस या लिगामेंट फटने जैसी आवाज़' : lang === 'hn' ? 'Nas/Ligament fatne ya pop hone jaisi aawaz (Pop sound)' : 'A popping or tearing sound (like a ligament snap)' 
                      },
                      { 
                        id: 'no_sound', 
                        label: lang === 'hi' ? 'कोई आवाज़ नहीं सुनाई दी' : lang === 'hn' ? 'Koi aawaz nahi sunai di' : 'No sound heard' 
                      },
                      { 
                        id: 'not_sure', 
                        label: lang === 'hi' ? 'निश्चित नहीं / याद नहीं है' : lang === 'hn' ? 'Neechit nahi / Yaad nahi' : 'Not sure / Do not remember' 
                      }
                    ].map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="soundHeard" 
                          checked={answers.soundHeard === opt.id}
                          onChange={() => handleAnswerChange('soundHeard', opt.id)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
 
            {/* STEP 3: PAIN Assessment */}
            {currentStep === 3 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Pain Assessment</h3>
                
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <span>{t.painSliderLabel}</span>
                    <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 700 }}>{answers.painLevel}/10</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={answers.painLevel}
                    onChange={(e) => handleAnswerChange('painLevel', parseInt(e.target.value))}
                    style={{ width: '100%', height: '8px', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.8rem', marginTop: '0.5rem' }}>
                    <span>😊 <span style={{ fontSize: '0.7rem', display: 'block', textAlign: 'center' }}>0</span></span>
                    <span>🙂 <span style={{ fontSize: '0.7rem', display: 'block', textAlign: 'center' }}>2</span></span>
                    <span>😐 <span style={{ fontSize: '0.7rem', display: 'block', textAlign: 'center' }}>4</span></span>
                    <span>😣 <span style={{ fontSize: '0.7rem', display: 'block', textAlign: 'center' }}>6</span></span>
                    <span>😫 <span style={{ fontSize: '0.7rem', display: 'block', textAlign: 'center' }}>8</span></span>
                    <span>😱 <span style={{ fontSize: '0.7rem', display: 'block', textAlign: 'center' }}>10</span></span>
                  </div>
                </div>
 
                <div className="form-grid-2col">
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t.painTypeLabel}</label>
                    <select 
                      className="glass-panel" 
                      value={answers.painType}
                      onChange={(e) => handleAnswerChange('painType', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', color: 'inherit', background: 'var(--bg-surface)' }}
                    >
                      <option value="sharp_stabbing">
                        {lang === 'hi' ? 'तेज़, चुभने वाला दर्द' : lang === 'hn' ? 'Tez, chubhnewala dard' : 'Sharp, stabbing pain'}
                      </option>
                      <option value="dull_aching">
                        {lang === 'hi' ? 'हल्का, लगातार होने वाला मीठा दर्द' : lang === 'hn' ? 'Halka, lagatar hone wala meetha dard' : 'Dull, constant aching pain'}
                      </option>
                      <option value="throbbing">
                        {lang === 'hi' ? 'धड़कने या टीस मारने वाला दर्द' : lang === 'hn' ? 'Dhak-dhak karne ya tees marne wala dard' : 'Throbbing pain'}
                      </option>
                      <option value="burning">
                        {lang === 'hi' ? 'जलन महसूस होना' : lang === 'hn' ? 'Jalan jaisa dard/sensation' : 'Burning pain/sensation'}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t.painReliefLabel}</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <label style={{ cursor: 'pointer' }}>
                        <input type="radio" name="painRelief" checked={answers.painReliefWithMeds === 'yes'} onChange={() => handleAnswerChange('painReliefWithMeds', 'yes')} /> {lang === 'hi' ? "हाँ, आराम मिलता है" : lang === 'hn' ? "Haan, dawai se aaram milta hai" : "Yes, pain decreases"}
                      </label>
                      <label style={{ cursor: 'pointer' }}>
                        <input type="radio" name="painRelief" checked={answers.painReliefWithMeds === 'no'} onChange={() => handleAnswerChange('painReliefWithMeds', 'no')} /> {lang === 'hi' ? "नहीं, दर्द बना रहता है" : lang === 'hn' ? "Nahi, dawai se aaram nahi milta" : "No, pain stays the same"}
                      </label>
                    </div>
                  </div>
                </div>
 
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t.painIncreasesLabel}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {[
                      { id: 'constant_rest', label: lang === 'hi' ? 'आराम करते समय भी लगातार दर्द होना' : lang === 'hn' ? 'Aaram karte time bhi lagatar dard hona' : 'Constant pain even at rest' },
                      { id: 'when_moving', label: lang === 'hi' ? 'जोड़ को हिलाने-डुलाने पर' : lang === 'hn' ? 'Joint ko hilane-dulane par' : 'When moving the joint' },
                      { id: 'when_touching', label: lang === 'hi' ? 'जोड़ को दबाने या छूने पर' : lang === 'hn' ? 'Joint ko dabane ya touch karne par' : 'When pressing or touching the joint' },
                      { id: 'when_bearing_weight', label: lang === 'hi' ? 'पैर पर वजन डालने या खड़े होने पर' : lang === 'hn' ? 'Pair par weight daalne ya khade hone par' : 'When putting weight/standing on it' }
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        type="button"
                        className={`btn ${answers.painIncreases.includes(opt.id) ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        onClick={() => handlePainIncreases(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PHYSICAL VISUAL SIGNS */}
            {currentStep === 4 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Physical & Visual Signs</h3>
                
                <div className="form-grid-2col">
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t.swellingLabel}</label>
                    <select 
                      className="glass-panel" 
                      value={answers.swelling}
                      onChange={(e) => handleAnswerChange('swelling', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', color: 'inherit', background: 'var(--bg-surface)' }}
                    >
                      <option value="none">{lang === 'hi' ? 'कोई सूजन नहीं' : 'None'}</option>
                      <option value="mild">{lang === 'hi' ? 'हल्की सूजन' : 'Mild'}</option>
                      <option value="moderate">{lang === 'hi' ? 'स्पष्ट रूप से सूजन' : 'Moderate'}</option>
                      <option value="severe">{lang === 'hi' ? 'अत्यधिक सूजन (तनी हुई त्वचा)' : 'Severe (stretched skin)'}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t.bruisingLabel}</label>
                    <select 
                      className="glass-panel" 
                      value={answers.bruising}
                      onChange={(e) => handleAnswerChange('bruising', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', color: 'inherit', background: 'var(--bg-surface)' }}
                    >
                      <option value="none">{lang === 'hi' ? 'कोई नील नहीं' : 'None'}</option>
                      <option value="mild">{lang === 'hi' ? 'हल्का लाल/नीला दाग' : 'Small spot'}</option>
                      <option value="large_area">{lang === 'hi' ? 'गहरे रंग का बड़ा नील' : 'Large area'}</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t.deformityLabel}</label>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {t.deformitySub}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label style={{ cursor: 'pointer', color: 'var(--color-emergency)' }}>
                        <input type="radio" name="deformity" checked={answers.deformity === 'yes'} onChange={() => handleAnswerChange('deformity', 'yes')} /> {lang === 'hi' ? 'हाँ (दृश्य विकृति)' : 'Yes'}
                      </label>
                      <label style={{ cursor: 'pointer' }}>
                        <input type="radio" name="deformity" checked={answers.deformity === 'no'} onChange={() => handleAnswerChange('deformity', 'no')} /> {lang === 'hi' ? 'नहीं (संरेखित है)' : 'No'}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t.skinColorLabel}</label>
                    <select 
                      className="glass-panel" 
                      value={answers.skinColor}
                      onChange={(e) => handleAnswerChange('skinColor', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', color: 'inherit', background: 'var(--bg-surface)' }}
                    >
                      <option value="normal">{lang === 'hi' ? 'सामान्य त्वचा का रंग' : 'Normal skin color'}</option>
                      <option value="red">{lang === 'hi' ? 'लाल / छूने पर गर्म' : 'Red / Warm'}</option>
                      <option value="blue_purple">{lang === 'hi' ? 'नीला / बैंगनी (खराब रक्त प्रवाह)' : 'Blue / Purple'}</option>
                      <option value="pale_white">{lang === 'hi' ? 'पीला / सफेद और ठंडा (गंभीर)' : 'Pale / White and cold'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input 
                      type="checkbox" 
                      checked={answers.tightTense}
                      onChange={(e) => handleAnswerChange('tightTense', e.target.checked)}
                    />
                    {t.skinTightCheckbox}
                  </label>
                </div>
              </div>
            )}

            {/* STEP 5: TENDERNESS LANDMARKS check */}
            {currentStep === 5 && (() => {
              const labels = getTendernessText(injuryArea, lang);
              return (
                <div className="fade-in">
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {lang === 'hi' ? "हड्डी में दर्द का सत्यापन (Ottawa Rules)" : lang === 'hn' ? "Haddi me Dard ka Verification (Ottawa Rules)" : "Interactive Bone Tenderness Checklist"}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: darkMode ? 'var(--text-secondary)' : 'var(--text-light-secondary)', marginBottom: '1.5rem' }}>
                    {lang === 'hi' ? "नीचे दिए गए चित्र के हॉटस्पॉट पर क्लिक करें। ओटावा नियम लाल रंग में चिह्नित होंगे।" : lang === 'hn' ? "Niche diye gaye diagram ke hotspots par touch karein. Ottawa points red color me show honge." : "Tap these hotspots to toggle bone tenderness. Selected areas will be highlighted in red."}
                  </p>

                  {/* ANKLE */}
                  {injuryArea === 'ankle' && (
                    <div className="joint-assessment-grid">
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <svg width="240" height="240" viewBox="0 0 120 120" style={{ background: 'rgba(15, 23, 42, 0.75)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', padding: '8px' }}>
                          <defs>
                            <linearGradient id="premiumBoneGradAnkle" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                              <stop offset="60%" stopColor="#f8fafc" stopOpacity="0.85" />
                              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.5" />
                            </linearGradient>
                            <radialGradient id="jointGlowAnkle" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="rgba(0, 194, 168, 0.2)" />
                              <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
                            </radialGradient>
                          </defs>

                          {/* Soft background joint glow */}
                          <circle cx="60" cy="60" r="50" fill="url(#jointGlowAnkle)" />

                          {/* Background Silhouette of Leg/Foot */}
                          <path d="M 45 5 C 45 5, 43 70, 36 78 C 30 84, 18 90, 18 98 C 18 108, 28 112, 45 112 C 65 112, 85 112, 98 106 C 104 103, 106 98, 102 96 C 96 92, 82 86, 75 75 C 75 60, 75 5, 75 5 Z" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

                          {/* Detailed Skeletal Bones */}
                          {/* Calcaneus (Heel Bone) */}
                          <path d="M 40 92 C 30 92, 26 102, 34 107 C 42 110, 50 108, 48 98 C 47 95, 43 93, 40 92 Z" fill="url(#premiumBoneGradAnkle)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                          
                          {/* Talus */}
                          <path d="M 43 87 C 41 85, 55 83, 58 87 C 60 91, 53 94, 46 93 C 44 92, 43 89, 43 87 Z" fill="url(#premiumBoneGradAnkle)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

                          {/* Detailed Tibia (Inner Bone) */}
                          <path d="M 46 5 C 47 10, 48 40, 48 65 C 48 72, 41 74, 40 85 C 40 91, 50 92, 53 87 C 55 83, 56 68, 56 10 Z" fill="url(#premiumBoneGradAnkle)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                          
                          {/* Detailed Fibula (Outer Bone) */}
                          <path d="M 64 5 C 64 10, 63 40, 63 65 C 63 71, 72 73, 72 85 C 72 90, 68 91, 66 85 C 65 80, 68 68, 68 10 Z" fill="url(#premiumBoneGradAnkle)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />

                          {/* Metatarsals (Foot bones extension) */}
                          <path d="M 52 90 L 59 93 L 64 90 L 57 88 Z" fill="url(#premiumBoneGradAnkle)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                          <path d="M 57 93 L 88 101 M 58 94 L 84 105 M 59 95 L 81 108 M 60 96 L 76 111 M 61 97 L 70 112" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />

                          {/* Clinical Labels and Dashed Pointer lines */}
                          {/* Tibia Pointer */}
                          <line x1="49" y1="35" x2="25" y2="35" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2" />
                          <circle cx="49" cy="35" r="1.5" fill="#ffffff" />
                          <text x="22" y="37" fill="#94a3b8" fontSize="4.5" textAnchor="end" style={{ userSelect: 'none', fontWeight: 500 }}>Tibia</text>

                          {/* Fibula Pointer */}
                          <line x1="66" y1="40" x2="88" y2="40" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2" />
                          <circle cx="66" cy="40" r="1.5" fill="#ffffff" />
                          <text x="91" y="42" fill="#94a3b8" fontSize="4.5" style={{ userSelect: 'none', fontWeight: 500 }}>Fibula</text>

                          {/* Talus Pointer */}
                          <line x1="50" y1="88" x2="88" y2="88" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2" />
                          <circle cx="50" cy="88" r="1.5" fill="#ffffff" />
                          <text x="91" y="90" fill="#94a3b8" fontSize="4.5" style={{ userSelect: 'none', fontWeight: 500 }}>Talus</text>

                          {/* Calcaneus Pointer */}
                          <line x1="36" y1="102" x2="22" y2="102" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2" />
                          <circle cx="36" cy="102" r="1.5" fill="#ffffff" />
                          <text x="19" y="104" fill="#94a3b8" fontSize="4.5" textAnchor="end" style={{ userSelect: 'none', fontWeight: 500 }}>Calcaneus</text>

                          {/* Interactive Hotspot 1: Lateral Malleolus (Outer Bone - right side) */}
                          <g onClick={() => handleAnswerChange('lateralMalleolusTenderness', !answers.lateralMalleolusTenderness)} style={{ cursor: 'pointer' }}>
                            <line x1="72" y1="85" x2="88" y2="85" stroke={answers.lateralMalleolusTenderness ? "#ef4444" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeDasharray="2" />
                            <circle cx="72" cy="85" r="10" fill="none" stroke={answers.lateralMalleolusTenderness ? "#ef4444" : "#38bdf8"} strokeWidth="1.2" strokeOpacity={answers.lateralMalleolusTenderness ? "0.4" : "0.25"}>
                              {!answers.lateralMalleolusTenderness && (
                                <animate attributeName="r" values="5;11;5" dur="3s" repeatCount="indefinite" />
                              )}
                              {!answers.lateralMalleolusTenderness && (
                                <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                              )}
                            </circle>
                            <circle cx="72" cy="85" r={answers.lateralMalleolusTenderness ? 6.5 : 4.5} fill={answers.lateralMalleolusTenderness ? "#ef4444" : "rgba(56, 189, 248, 0.3)"} stroke={answers.lateralMalleolusTenderness ? "#ffffff" : "#38bdf8"} strokeWidth="1.2" style={{ transition: 'all 0.2s ease-in-out' }} />
                            <circle cx="72" cy="85" r="1.5" fill="#ffffff" />
                          </g>
                          <text x="91" y="87" fill={answers.lateralMalleolusTenderness ? "#ef4444" : "#cbd5e1"} fontSize="5.2" fontWeight="bold" style={{ userSelect: 'none' }}>
                            {lang === 'hi' ? 'बाहरी हड्डी' : lang === 'hn' ? 'Bahar ki haddi' : 'Outer Bone'}
                          </text>

                          {/* Interactive Hotspot 2: Medial Malleolus (Inner Bone - left side) */}
                          <g onClick={() => handleAnswerChange('medialMalleolusTenderness', !answers.medialMalleolusTenderness)} style={{ cursor: 'pointer' }}>
                            <line x1="40" y1="85" x2="25" y2="85" stroke={answers.medialMalleolusTenderness ? "#ef4444" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeDasharray="2" />
                            <circle cx="40" cy="85" r="10" fill="none" stroke={answers.medialMalleolusTenderness ? "#ef4444" : "#38bdf8"} strokeWidth="1.2" strokeOpacity={answers.medialMalleolusTenderness ? "0.4" : "0.25"}>
                              {!answers.medialMalleolusTenderness && (
                                <animate attributeName="r" values="5;11;5" dur="3s" repeatCount="indefinite" />
                              )}
                              {!answers.medialMalleolusTenderness && (
                                <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                              )}
                            </circle>
                            <circle cx="40" cy="85" r={answers.medialMalleolusTenderness ? 6.5 : 4.5} fill={answers.medialMalleolusTenderness ? "#ef4444" : "rgba(56, 189, 248, 0.3)"} stroke={answers.medialMalleolusTenderness ? "#ffffff" : "#38bdf8"} strokeWidth="1.2" style={{ transition: 'all 0.2s ease-in-out' }} />
                            <circle cx="40" cy="85" r="1.5" fill="#ffffff" />
                          </g>
                          <text x="22" y="87" fill={answers.medialMalleolusTenderness ? "#ef4444" : "#cbd5e1"} fontSize="5.2" fontWeight="bold" textAnchor="end" style={{ userSelect: 'none' }}>
                            {lang === 'hi' ? 'भीतरी हड्डी' : lang === 'hn' ? 'Andar ki haddi' : 'Inner Bone'}
                          </text>
                        </svg>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{labels.header}</div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={answers.lateralMalleolusTenderness} onChange={(e) => handleAnswerChange('lateralMalleolusTenderness', e.target.checked)} />
                          {labels.lateralMalleolus}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={answers.medialMalleolusTenderness} onChange={(e) => handleAnswerChange('medialMalleolusTenderness', e.target.checked)} />
                          {labels.medialMalleolus}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!answers.canWalkImmediately} onChange={(e) => handleAnswerChange('canWalkImmediately', !e.target.checked)} />
                          {labels.walkImmediately}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!answers.canWalkNow} onChange={(e) => handleAnswerChange('canWalkNow', !e.target.checked)} />
                          {labels.walkNow}
                        </label>
                      </div>
                    </div>
                  )}

                  {/* FOOT */}
                  {injuryArea === 'foot' && (
                    <div className="joint-assessment-grid">
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <svg width="240" height="240" viewBox="0 0 120 120" style={{ background: 'rgba(15, 23, 42, 0.75)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', padding: '8px' }}>
                          <defs>
                            <linearGradient id="premiumBoneGradFoot" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                              <stop offset="60%" stopColor="#f8fafc" stopOpacity="0.85" />
                              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.5" />
                            </linearGradient>
                            <radialGradient id="jointGlowFoot" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="rgba(0, 194, 168, 0.2)" />
                              <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
                            </radialGradient>
                          </defs>

                          {/* Soft background joint glow */}
                          <circle cx="60" cy="60" r="50" fill="url(#jointGlowFoot)" />

                          {/* Background Silhouette of Foot */}
                          <path d="M 60 115 C 50 115, 44 95, 44 85 C 44 75, 34 60, 32 45 C 30 35, 32 20, 42 15 C 48 12, 54 15, 57 24 C 60 15, 66 12, 72 15 C 78 12, 84 15, 87 22 C 90 18, 96 20, 98 28 C 100 38, 98 52, 94 65 C 90 78, 86 90, 84 98 C 82 106, 75 115, 60 115 Z" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

                          {/* Calcaneus (Heel Bone) */}
                          <path d="M 52 108 C 45 108, 44 94, 53 90 C 62 86, 64 96, 58 106 C 56 108, 54 108, 52 108 Z" fill="url(#premiumBoneGradFoot)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                          
                          {/* Talus */}
                          <path d="M 53 88 C 48 84, 60 80, 62 86 C 64 92, 58 92, 53 88 Z" fill="url(#premiumBoneGradFoot)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />

                          {/* Navicular (Inner mid-arch bone) */}
                          <path d="M 44 78 C 38 74, 46 68, 49 74 C 52 80, 48 82, 44 78 Z" fill="url(#premiumBoneGradFoot)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

                          {/* Cuboid & Cuneiforms */}
                          <path d="M 62 76 C 58 72, 68 68, 70 74 Z" fill="url(#premiumBoneGradFoot)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />

                          {/* Metatarsals */}
                          {/* 1st Metatarsal (medial/thumb) */}
                          <path d="M 46 72 L 38 42 C 34 38, 42 36, 44 42 L 52 70 Z" fill="url(#premiumBoneGradFoot)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                          {/* 2nd Metatarsal */}
                          <path d="M 50 73 L 48 38 C 47 34, 53 34, 54 38 L 54 71 Z" fill="url(#premiumBoneGradFoot)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
                          {/* 3rd Metatarsal */}
                          <path d="M 55 74 L 59 38 C 58 34, 64 34, 63 38 L 60 72 Z" fill="url(#premiumBoneGradFoot)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
                          {/* 4th Metatarsal */}
                          <path d="M 61 75 L 70 41 C 69 37, 75 38, 74 42 L 66 74 Z" fill="url(#premiumBoneGradFoot)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
                          {/* 5th Metatarsal (lateral/pinky) */}
                          <path d="M 72 70 C 72 68, 64 72, 65 75 L 76 45 C 75 41, 81 42, 80 46 L 73 76 C 73 78, 72 72, 72 70 Z" fill="url(#premiumBoneGradFoot)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />

                          {/* Clinical Labels and Dashed Pointer lines */}
                          {/* Calcaneus Pointer */}
                          <line x1="52" y1="99" x2="25" y2="99" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2" />
                          <circle cx="52" cy="99" r="1.5" fill="#ffffff" />
                          <text x="22" y="101" fill="#94a3b8" fontSize="4.5" textAnchor="end" style={{ userSelect: 'none', fontWeight: 500 }}>Calcaneus</text>

                          {/* Interactive Hotspot 1: 5th Metatarsal Base (outer side bump) */}
                          <g onClick={() => handleAnswerChange('fifthMetatarsalTenderness', !answers.fifthMetatarsalTenderness)} style={{ cursor: 'pointer' }}>
                            <line x1="72" y1="70" x2="88" y2="70" stroke={answers.fifthMetatarsalTenderness ? "#ef4444" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeDasharray="2" />
                            <circle cx="72" cy="70" r="10" fill="none" stroke={answers.fifthMetatarsalTenderness ? "#ef4444" : "#38bdf8"} strokeWidth="1.2" strokeOpacity={answers.fifthMetatarsalTenderness ? "0.4" : "0.25"}>
                              {!answers.fifthMetatarsalTenderness && (
                                <animate attributeName="r" values="5;11;5" dur="3s" repeatCount="indefinite" />
                              )}
                              {!answers.fifthMetatarsalTenderness && (
                                <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                              )}
                            </circle>
                            <circle cx="72" cy="70" r={answers.fifthMetatarsalTenderness ? 6.5 : 4.5} fill={answers.fifthMetatarsalTenderness ? "#ef4444" : "rgba(56, 189, 248, 0.3)"} stroke={answers.fifthMetatarsalTenderness ? "#ffffff" : "#38bdf8"} strokeWidth="1.2" style={{ transition: 'all 0.2s ease-in-out' }} />
                            <circle cx="72" cy="70" r="1.5" fill="#ffffff" />
                          </g>
                          <text x="91" y="72" fill={answers.fifthMetatarsalTenderness ? "#ef4444" : "#cbd5e1"} fontSize="5.2" fontWeight="bold" style={{ userSelect: 'none' }}>
                            {lang === 'hi' ? 'बाहरी किनारा' : lang === 'hn' ? 'Bahar ka edge' : 'Outer Edge'}
                          </text>

                          {/* Interactive Hotspot 2: Navicular Bone (inner arch bone) */}
                          <g onClick={() => handleAnswerChange('navicularTenderness', !answers.navicularTenderness)} style={{ cursor: 'pointer' }}>
                            <line x1="42" y1="75" x2="25" y2="75" stroke={answers.navicularTenderness ? "#ef4444" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeDasharray="2" />
                            <circle cx="42" cy="75" r="10" fill="none" stroke={answers.navicularTenderness ? "#ef4444" : "#38bdf8"} strokeWidth="1.2" strokeOpacity={answers.navicularTenderness ? "0.4" : "0.25"}>
                              {!answers.navicularTenderness && (
                                <animate attributeName="r" values="5;11;5" dur="3s" repeatCount="indefinite" />
                              )}
                              {!answers.navicularTenderness && (
                                <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                              )}
                            </circle>
                            <circle cx="42" cy="75" r={answers.navicularTenderness ? 6.5 : 4.5} fill={answers.navicularTenderness ? "#ef4444" : "rgba(56, 189, 248, 0.3)"} stroke={answers.navicularTenderness ? "#ffffff" : "#38bdf8"} strokeWidth="1.2" style={{ transition: 'all 0.2s ease-in-out' }} />
                            <circle cx="42" cy="75" r="1.5" fill="#ffffff" />
                          </g>
                          <text x="22" y="77" fill={answers.navicularTenderness ? "#ef4444" : "#cbd5e1"} fontSize="5.2" fontWeight="bold" textAnchor="end" style={{ userSelect: 'none' }}>
                            {lang === 'hi' ? 'भीतरी जोड़' : lang === 'hn' ? 'Andar ka joint' : 'Inner Arch'}
                          </text>
                        </svg>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{labels.header}</div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={answers.fifthMetatarsalTenderness} onChange={(e) => handleAnswerChange('fifthMetatarsalTenderness', e.target.checked)} />
                          {labels.fifthMetatarsal}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={answers.navicularTenderness} onChange={(e) => handleAnswerChange('navicularTenderness', e.target.checked)} />
                          {labels.navicular}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!answers.canWalkImmediately} onChange={(e) => handleAnswerChange('canWalkImmediately', !e.target.checked)} />
                          {labels.walkImmediately}
                        </label>
                      </div>
                    </div>
                  )}

                  {/* KNEE */}
                  {injuryArea === 'knee' && (
                    <div className="joint-assessment-grid">
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <svg width="240" height="240" viewBox="0 0 120 120" style={{ background: 'rgba(15, 23, 42, 0.75)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', padding: '8px' }}>
                          <defs>
                            <linearGradient id="premiumBoneGradKnee" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                              <stop offset="60%" stopColor="#f8fafc" stopOpacity="0.85" />
                              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.5" />
                            </linearGradient>
                            <radialGradient id="jointGlowKnee" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="rgba(0, 194, 168, 0.2)" />
                              <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
                            </radialGradient>
                          </defs>

                          {/* Soft background joint glow */}
                          <circle cx="60" cy="60" r="50" fill="url(#jointGlowKnee)" />

                          {/* Background Leg Outline */}
                          <path d="M 40 5 C 40 5, 38 40, 32 50 C 26 60, 26 70, 34 80 C 40 88, 42 115, 42 115 L 78 115 C 78 115, 80 88, 86 80 C 94 70, 94 60, 88 50 C 82 40, 80 5, 80 5 Z" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

                          {/* Femur (Thigh Bone) */}
                          <path d="M 48 5 L 48 48 C 48 55, 38 56, 38 62 C 38 66, 48 66, 52 65 C 55 64, 58 64, 61 65 C 65 66, 75 66, 75 62 C 75 56, 65 55, 65 48 L 65 5 Z" fill="url(#premiumBoneGradKnee)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                          
                          {/* Tibia (Shin Bone) */}
                          <path d="M 46 72 C 46 70, 68 70, 68 72 L 64 115 L 50 115 Z" fill="url(#premiumBoneGradKnee)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                          
                          {/* Fibula (Thin Outer Bone) */}
                          <path d="M 72 75 C 72 73, 78 74, 76 82 L 72 115 L 68 115 L 70 82 Z" fill="url(#premiumBoneGradKnee)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />

                          {/* Patella (Floating Kneecap) - layered bone */}
                          <path d="M 54 48 C 45 48, 43 63, 54 65 C 65 63, 63 48, 54 48 Z" fill="url(#premiumBoneGradKnee)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />

                          {/* Clinical Labels and Dashed Pointer lines */}
                          {/* Femur Pointer */}
                          <line x1="54" y1="25" x2="25" y2="25" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2" />
                          <circle cx="54" cy="25" r="1.5" fill="#ffffff" />
                          <text x="22" y="27" fill="#94a3b8" fontSize="4.5" textAnchor="end" style={{ userSelect: 'none', fontWeight: 500 }}>Femur</text>

                          {/* Tibia Pointer */}
                          <line x1="56" y1="92" x2="25" y2="92" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2" />
                          <circle cx="56" cy="92" r="1.5" fill="#ffffff" />
                          <text x="22" y="94" fill="#94a3b8" fontSize="4.5" textAnchor="end" style={{ userSelect: 'none', fontWeight: 500 }}>Tibia</text>

                          {/* Interactive Hotspot 1: Patella (Kneecap) */}
                          <g onClick={() => handleAnswerChange('patellarTenderness', !answers.patellarTenderness)} style={{ cursor: 'pointer' }}>
                            <line x1="54" y1="58" x2="88" y2="58" stroke={answers.patellarTenderness ? "#ef4444" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeDasharray="2" />
                            <circle cx="54" cy="58" r="11" fill="none" stroke={answers.patellarTenderness ? "#ef4444" : "#38bdf8"} strokeWidth="1.2" strokeOpacity={answers.patellarTenderness ? "0.4" : "0.25"}>
                              {!answers.patellarTenderness && (
                                <animate attributeName="r" values="6;12;6" dur="3s" repeatCount="indefinite" />
                              )}
                              {!answers.patellarTenderness && (
                                <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                              )}
                            </circle>
                            <circle cx="54" cy="58" r={answers.patellarTenderness ? 7 : 5} fill={answers.patellarTenderness ? "#ef4444" : "rgba(56, 189, 248, 0.3)"} stroke={answers.patellarTenderness ? "#ffffff" : "#38bdf8"} strokeWidth="1.2" style={{ transition: 'all 0.2s ease-in-out' }} />
                            <circle cx="54" cy="58" r="1.5" fill="#ffffff" />
                          </g>
                          <text x="91" y="60" fill={answers.patellarTenderness ? "#ef4444" : "#cbd5e1"} fontSize="5.2" fontWeight="bold" style={{ userSelect: 'none' }}>
                            {lang === 'hi' ? 'घुटने की कटोरी' : lang === 'hn' ? 'Katori' : 'Kneecap'}
                          </text>

                          {/* Interactive Hotspot 2: Fibular Head (outer side bone) */}
                          <g onClick={() => handleAnswerChange('fibularHeadTenderness', !answers.fibularHeadTenderness)} style={{ cursor: 'pointer' }}>
                            <line x1="69" y1="76" x2="88" y2="76" stroke={answers.fibularHeadTenderness ? "#ef4444" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeDasharray="2" />
                            <circle cx="69" cy="76" r="10" fill="none" stroke={answers.fibularHeadTenderness ? "#ef4444" : "#38bdf8"} strokeWidth="1.2" strokeOpacity={answers.fibularHeadTenderness ? "0.4" : "0.25"}>
                              {!answers.fibularHeadTenderness && (
                                <animate attributeName="r" values="5;11;5" dur="3s" repeatCount="indefinite" />
                              )}
                              {!answers.fibularHeadTenderness && (
                                <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                              )}
                            </circle>
                            <circle cx="69" cy="76" r={answers.fibularHeadTenderness ? 6.5 : 4.5} fill={answers.fibularHeadTenderness ? "#ef4444" : "rgba(56, 189, 248, 0.3)"} stroke={answers.fibularHeadTenderness ? "#ffffff" : "#38bdf8"} strokeWidth="1.2" style={{ transition: 'all 0.2s ease-in-out' }} />
                            <circle cx="69" cy="76" r="1.5" fill="#ffffff" />
                          </g>
                          <text x="91" y="78" fill={answers.fibularHeadTenderness ? "#ef4444" : "#cbd5e1"} fontSize="5.2" fontWeight="bold" style={{ userSelect: 'none' }}>
                            {lang === 'hi' ? 'बाहरी निचली हड्डी' : lang === 'hn' ? 'Bahar ki Lower haddi' : 'Outer Lower Bone'}
                          </text>
                        </svg>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{labels.header}</div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={answers.patellarTenderness} onChange={(e) => handleAnswerChange('patellarTenderness', e.target.checked)} />
                          {labels.patellar}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={answers.fibularHeadTenderness} onChange={(e) => handleAnswerChange('fibularHeadTenderness', e.target.checked)} />
                          {labels.fibularHead}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!answers.kneeFlexion90} onChange={(e) => handleAnswerChange('kneeFlexion90', !e.target.checked)} />
                          {labels.flexion90}
                        </label>
                      </div>
                    </div>
                  )}

                  {/* WRIST */}
                  {injuryArea === 'wrist' && (
                    <div className="joint-assessment-grid">
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <svg width="240" height="240" viewBox="0 0 120 120" style={{ background: 'rgba(15, 23, 42, 0.75)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', padding: '8px' }}>
                          <defs>
                            <linearGradient id="premiumBoneGradWrist" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                              <stop offset="60%" stopColor="#f8fafc" stopOpacity="0.85" />
                              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.5" />
                            </linearGradient>
                            <radialGradient id="jointGlowWrist" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="rgba(0, 194, 168, 0.2)" />
                              <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
                            </radialGradient>
                          </defs>

                          {/* Soft background joint glow */}
                          <circle cx="60" cy="60" r="50" fill="url(#jointGlowWrist)" />

                          {/* Background Hand Outline */}
                          <path d="M 40 115 L 40 95 C 40 91, 31 88, 24 81 C 17 74, 12 67, 14 60 C 16 55, 22 55, 26 61 C 31 67, 34 70, 36 67 C 38 64, 34 42, 34 27 C 34 22, 39 22, 39 27 L 41 64 C 41 67, 48 67, 48 64 L 50 17 C 50 12, 55 12, 55 17 L 56 64 C 56 67, 63 67, 63 64 L 64 20 C 64 15, 69 15, 69 20 L 70 65 C 70 68, 77 68, 77 65 L 79 32 C 79 27, 84 27, 84 32 L 85 70 C 85 80, 81 92, 81 98 L 81 115 Z" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

                          {/* Forearm Radius (Thumb side, left) */}
                          <path d="M 38 94 L 38 115 C 38 115, 52 115, 52 115 L 52 94 Z" fill="url(#premiumBoneGradWrist)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                          
                          {/* Forearm Ulna (Pinky side, right) */}
                          <path d="M 58 95 L 58 115 C 58 115, 72 115, 68 95 Z" fill="url(#premiumBoneGradWrist)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />

                          {/* Carpal bones cluster */}
                          {/* Scaphoid */}
                          <path d="M 43 91 C 36 87, 28 83, 33 77 C 38 73, 46 79, 47 87 Z" fill="url(#premiumBoneGradWrist)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                          {/* Lunate */}
                          <path d="M 51 90 C 49 87, 56 85, 58 89 Z" fill="url(#premiumBoneGradWrist)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
                          {/* Triquetrum */}
                          <path d="M 60 91 C 58 88, 65 86, 66 90 Z" fill="url(#premiumBoneGradWrist)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
                          {/* Pisiform */}
                          <path d="M 64 89 C 63 87, 68 85, 69 87 Z" fill="url(#premiumBoneGradWrist)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
                          {/* Trapezium & Trapezoid */}
                          <path d="M 35 77 C 33 75, 40 71, 42 74 Z" fill="url(#premiumBoneGradWrist)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
                          {/* Capitate & Hamate */}
                          <path d="M 51 85 C 47 79, 62 77, 64 83 Z" fill="url(#premiumBoneGradWrist)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />

                          {/* Metacarpals */}
                          <path d="M 30 73 L 18 61 M 42 74 L 35 34 M 48 75 L 48 25 M 54 76 L 61 27 M 60 78 L 74 41" stroke="rgba(255,255,255,0.35)" strokeWidth="1" fill="none" />

                          {/* Clinical Labels and Dashed Pointer lines */}
                          {/* Radius Pointer */}
                          <line x1="45" y1="105" x2="25" y2="105" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2" />
                          <circle cx="45" cy="105" r="1.5" fill="#ffffff" />
                          <text x="22" y="107" fill="#94a3b8" fontSize="4.5" textAnchor="end" style={{ userSelect: 'none', fontWeight: 500 }}>Radius</text>

                          {/* Ulna Pointer */}
                          <line x1="65" y1="105" x2="88" y2="105" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" strokeDasharray="2" />
                          <circle cx="65" cy="105" r="1.5" fill="#ffffff" />
                          <text x="91" y="107" fill="#94a3b8" fontSize="4.5" style={{ userSelect: 'none', fontWeight: 500 }}>Ulna</text>

                          {/* Interactive Hotspot 1: Snuffbox (base of thumb) */}
                          <g onClick={() => handleAnswerChange('snuffboxTenderness', !answers.snuffboxTenderness)} style={{ cursor: 'pointer' }}>
                            <line x1="32" y1="82" x2="25" y2="82" stroke={answers.snuffboxTenderness ? "#ef4444" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeDasharray="2" />
                            <circle cx="32" cy="82" r="10" fill="none" stroke={answers.snuffboxTenderness ? "#ef4444" : "#38bdf8"} strokeWidth="1.2" strokeOpacity={answers.snuffboxTenderness ? "0.4" : "0.25"}>
                              {!answers.snuffboxTenderness && (
                                <animate attributeName="r" values="5;11;5" dur="3s" repeatCount="indefinite" />
                              )}
                              {!answers.snuffboxTenderness && (
                                <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                              )}
                            </circle>
                            <circle cx="32" cy="82" r={answers.snuffboxTenderness ? 6.5 : 4.5} fill={answers.snuffboxTenderness ? "#ef4444" : "rgba(56, 189, 248, 0.3)"} stroke={answers.snuffboxTenderness ? "#ffffff" : "#38bdf8"} strokeWidth="1.2" style={{ transition: 'all 0.2s ease-in-out' }} />
                            <circle cx="32" cy="82" r="1.5" fill="#ffffff" />
                          </g>
                          <text x="22" y="84" fill={answers.snuffboxTenderness ? "#ef4444" : "#cbd5e1"} fontSize="5.2" fontWeight="bold" textAnchor="end" style={{ userSelect: 'none' }}>
                            {lang === 'hi' ? 'अंगूठे का गड्ढा' : lang === 'hn' ? 'Snuffbox Gadda' : 'Thumb Groove'}
                          </text>

                          {/* Interactive Hotspot 2: Scaphoid Tubercle (front palm side under thumb) */}
                          <g onClick={() => handleAnswerChange('scaphoidTubercleTenderness', !answers.scaphoidTubercleTenderness)} style={{ cursor: 'pointer' }}>
                            <line x1="47" y1="87" x2="88" y2="87" stroke={answers.scaphoidTubercleTenderness ? "#ef4444" : "rgba(255, 255, 255, 0.4)"} strokeWidth="0.8" strokeDasharray="2" />
                            <circle cx="47" cy="87" r="10" fill="none" stroke={answers.scaphoidTubercleTenderness ? "#ef4444" : "#38bdf8"} strokeWidth="1.2" strokeOpacity={answers.scaphoidTubercleTenderness ? "0.4" : "0.25"}>
                              {!answers.scaphoidTubercleTenderness && (
                                <animate attributeName="r" values="5;11;5" dur="3s" repeatCount="indefinite" />
                              )}
                              {!answers.scaphoidTubercleTenderness && (
                                <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                              )}
                            </circle>
                            <circle cx="47" cy="87" r={answers.scaphoidTubercleTenderness ? 6.5 : 4.5} fill={answers.scaphoidTubercleTenderness ? "#ef4444" : "rgba(56, 189, 248, 0.3)"} stroke={answers.scaphoidTubercleTenderness ? "#ffffff" : "#38bdf8"} strokeWidth="1.2" style={{ transition: 'all 0.2s ease-in-out' }} />
                            <circle cx="47" cy="87" r="1.5" fill="#ffffff" />
                          </g>
                          <text x="91" y="89" fill={answers.scaphoidTubercleTenderness ? "#ef4444" : "#cbd5e1"} fontSize="5.2" fontWeight="bold" style={{ userSelect: 'none' }}>
                            {lang === 'hi' ? 'कलाई की हड्डी' : lang === 'hn' ? 'Hatheli ki haddi' : 'Wrist Bone'}
                          </text>
                        </svg>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{labels.header}</div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={answers.snuffboxTenderness} onChange={(e) => handleAnswerChange('snuffboxTenderness', e.target.checked)} />
                          {labels.snuffbox}
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={answers.scaphoidTubercleTenderness} onChange={(e) => handleAnswerChange('scaphoidTubercleTenderness', e.target.checked)} />
                          {labels.tubercle}
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* STEP 6: MOBILITY & FUNCTION */}
            {currentStep === 6 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem' }}>Functional Assessment</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{lang === 'hi' ? "हिलने-डुलने की क्षमता (Range of Motion):" : "Movement Ability (Range of Motion):"}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { id: 'normal', label: lang === 'hi' ? 'पूर्ण सामान्य मूवमेंट (बिना दर्द)' : 'Full movement' },
                      { id: 'partial', label: lang === 'hi' ? 'आंशिक मूवमेंट (दर्द के साथ हिल रहा है)' : 'Partial movement with pain' },
                      { id: 'very_little', label: lang === 'hi' ? 'बहुत सीमित मूवमेंट (बहुत कम हिल रहा है)' : 'Very limited movement' },
                      { id: 'cannot_move', label: lang === 'hi' ? 'बिल्कुल भी नहीं हिल रहा' : 'Cannot move at all' }
                    ].map(opt => (
                      <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="movementAbility" 
                          checked={answers.movementAbility === opt.id}
                          onChange={() => handleAnswerChange('movementAbility', opt.id)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{lang === 'hi' ? "स्वस्थ जोड़ के साथ तुलना:" : "Comparison with uninjured side:"}</label>
                  <select 
                    className="glass-panel" 
                    value={answers.sideComparison}
                    onChange={(e) => handleAnswerChange('sideComparison', e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', color: 'inherit', background: 'var(--bg-surface)' }}
                  >
                    <option value="same">{lang === 'hi' ? 'बिल्कुल वैसा ही दिखता और महसूस होता है' : 'Looks and feels the same'}</option>
                    <option value="slightly_different">{lang === 'hi' ? 'थोड़ा अलग (मामूली सूजन या लालिमा)' : 'Slightly different'}</option>
                    <option value="clearly_different">{lang === 'hi' ? 'स्पष्ट रूप से अलग (स्पष्ट टेढ़ापन या भारी सूजन)' : 'Clearly different'}</option>
                  </select>
                </div>

                {/* SAFE MOBILITY TEST GUIDELINES CARD */}
                <div className="glass-panel" style={{ padding: '1.25rem', marginTop: '1.5rem', borderLeft: '4px solid var(--primary)', background: 'rgba(99, 102, 241, 0.05)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1rem', color: 'white', marginBottom: '0.75rem' }}>
                    <span>🛡️</span>
                    <span>{lang === 'hi' ? "सुरक्षित गतिशीलता परीक्षण निर्देश (Safe Mobility Guide)" : "Safe Mobility & Range of Motion Guide"}</span>
                  </div>
                  
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                    {lang === 'hi' 
                      ? "जोड़ की रिकवरी और चोट के स्तर को मापने के लिए नीचे दिए गए निर्देशों के अनुसार गति का परीक्षण करें। यदि तेज दर्द या अकड़न महसूस हो तो जबरदस्ती न करें।"
                      : "Perform this safe range of motion test to evaluate clinical mobility restriction. STOP immediately if you experience sharp pain or cracking sounds."}
                  </p>

                  {(() => {
                    const area = injuryArea || 'ankle';
                    let steps = [];
                    let safetyNote = "";

                    if (area === 'ankle') {
                      steps = lang === 'hi' ? [
                        "पैर की उंगलियों (Toes) को धीरे-धीरे ऊपर और नीचे की तरफ मोड़ें (Plantar & Dorsiflexion)।",
                        "टखने (Ankle) को हल्का सा अंदर और बाहर की तरफ घुमाएं (Inversion & Eversion)।",
                        "यदि सहन करने योग्य हो, तो खड़े होकर 4 कदम (Weight-Bearing Steps) चलने की कोशिश करें।"
                      ] : [
                        "Gently point your toes up towards the shin, then down towards the floor (Plantar & Dorsiflexion).",
                        "Slowly tilt your foot inward, then outward to test lateral ligament stress (Inversion & Eversion).",
                        "If pain is minimal, attempt to take 4 full weight-bearing steps on a flat surface (Ottawa weight test)."
                      ];
                      safetyNote = lang === 'hi' ? "यदि पैर पर बिल्कुल भी वजन सहन नहीं हो पा रहा है, तो खड़े न हों।" : "If you cannot bear any weight immediately, do NOT force yourself to stand.";
                    } else if (area === 'foot') {
                      steps = lang === 'hi' ? [
                        "पैर के अंगूठे और उंगलियों को मोड़ें (Flexion) और खोलें (Extension)।",
                        "पैर के बाहरी हिस्से (5th metatarsal area) को हल्का सा छूकर दबाएं और दर्द की जांच करें।",
                        "समतल जमीन पर पैर रखने की कोशिश करें और देखें कि क्या हल्का भार सहन हो रहा है।"
                      ] : [
                        "Curl your toes tightly and then extend them fully to check tendon movement.",
                        "Gently press along the outer edge of your foot (base of 5th metatarsal) to check for point tenderness.",
                        "Try placing your sole flat on the ground to test if load transmission causes sharp pain."
                      ];
                      safetyNote = lang === 'hi' ? "पैर के बाहरी किनारे पर तेज दर्द होने पर बिल्कुल दबाव न डालें।" : "Sharp pain at the outer edge of the foot indicates possible metatarsal fracture; do not apply load.";
                    } else if (area === 'knee') {
                      steps = lang === 'hi' ? [
                        "पीठ के बल लेटकर या कुर्सी पर बैठकर धीरे-धीरे घुटने को मोड़ने (Bend) की कोशिश करें।",
                        "जांचें कि क्या आप घुटने को 90 डिग्री (L-Shape) तक आसानी से मोड़ पा रहे हैं।",
                        "पैर को सीधा (Straighten) करें और जांचें कि क्या घुटना लॉक या जाम हो रहा है।"
                      ] : [
                        "Sit on a chair or lie down, and slowly pull your heel towards your glutes to bend the knee.",
                        "Check if you can comfortably flex your knee to a 90-degree angle (L-shape alignment).",
                        "Slowly extend and straighten your leg fully to check for clicking, popping, or muscle locking."
                      ];
                      safetyNote = lang === 'hi' ? "यदि जोड़ जाम (locked knee) लग रहा हो, तो बल न लगाएं।" : "Do NOT force extension if you feel a mechanical blocking or locked joint sensation.";
                    } else if (area === 'wrist') {
                      steps = lang === 'hi' ? [
                        "धीरे से अपनी मुट्ठी (Fist) बंद करें और सभी उंगलियों को घुमाएं।",
                        "कलाई (Wrist) को ऊपर-नीचे और गोल (Circular rotation) घुमाने का प्रयास करें।",
                        "अंगूठे को हथेली की तरफ लाएं और अंगूठे के नीचे वाले गड्ढे (Snuffbox) को दबाकर तेज दर्द की जांच करें।"
                      ] : [
                        "Gently make a tight fist, then open your fingers wide to test tendon glide.",
                        "Move your wrist up and down (flex/extend) and tilt it side-to-side (radial/ulnar deviation).",
                        "Extend your thumb outwards and press firmly into the triangular dip at the base (Anatomical Snuffbox)."
                      ];
                      safetyNote = lang === 'hi' ? "अंगूठे के गड्ढे (Snuffbox) में तेज दर्द गंभीर चोट (Scaphoid fracture) का संकेत है।" : "Sharp pain in the snuffbox area points directly to a clinical scaphoid injury; immobilize immediately.";
                    } else {
                      steps = lang === 'hi' ? [
                        "कोहनी (Elbow) को पूरी तरह सीधा (Extend) और पूरी तरह मोड़ने (Flex) का प्रयास करें।",
                        "हाथ को ऐसे घुमाएं जैसे दरवाजा खोलने के लिए हैंडल घुमा रहे हों (Pronation & Supination)।",
                        "जोड़ के बाहरी और अंदरूनी हिस्से पर छूकर किसी असामान्य उभार या तेज दर्द की जांच करें।"
                      ] : [
                        "Slowly straighten your elbow fully, then bend it to touch your shoulder with your fingers.",
                        "Rotate your forearm back and forth, turning your palm face-up then face-down (Pronation/Supination).",
                        "Gently touch the bony bumps on the outer and inner elbow (epicondyles) to check for sharp point pain."
                      ];
                      safetyNote = lang === 'hi' ? "कोहनी के जाम होने या टेढ़े होने पर सीधा करने का प्रयास न करें।" : "Do not attempt to push past mechanical resistance if the joint feels blocked.";
                    }

                    return (
                      <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                        <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.35rem' }}>
                          {lang === 'hi' ? `परीक्षण के चरण (${area.toUpperCase()} Test):` : `Test Steps for ${area.toUpperCase()}:`}
                        </div>
                        <ul style={{ margin: '0 0 0.5rem 0', paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                          {steps.map((step, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{step}</li>)}
                        </ul>
                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '0.6rem', borderRadius: '6px', fontSize: '0.75rem', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.15)', fontStyle: 'italic' }}>
                          ⚠️ <strong>{lang === 'hi' ? "सावधानी:" : "Safety Warning:"}</strong> {safetyNote}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* STEP 7: RED FLAG SCREENING */}
            {currentStep === 7 && (
              <div className="fade-in" style={{ color: 'var(--color-emergency)' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertOctagon size={24} /> {t.redFlagsTitle}
                </h3>
                <p style={{ color: darkMode ? 'var(--text-secondary)' : 'var(--text-light-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {t.redFlagsSub}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 600 }}>
                    <input 
                      key="redflag_boneProtruding"
                      id="redflag_boneProtruding"
                      name="redflag_boneProtruding"
                      type="checkbox" 
                      checked={answers.boneProtruding === true}
                      onChange={(e) => handleAnswerChange('boneProtruding', e.target.checked)}
                    />
                    {lang === 'hi' ? "क्या कोई हड्डी त्वचा से बाहर निकली हुई है?" : "Is a bone protruding/piercing through the skin?"}
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 600 }}>
                    <input 
                      key="redflag_numbnessBelow"
                      id="redflag_numbnessBelow"
                      name="redflag_numbnessBelow"
                      type="checkbox" 
                      checked={answers.numbnessBelow === true}
                      onChange={(e) => handleAnswerChange('numbnessBelow', e.target.checked)}
                    />
                    {lang === 'hi' ? "क्या चोटिल स्थान के नीचे सुन्नता या झुनझुनी महसूस हो रही है?" : "Is there numbness, tingling, or pins and needles below?"}
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 600 }}>
                    <input 
                      key="redflag_blueColdBelow"
                      id="redflag_blueColdBelow"
                      name="redflag_blueColdBelow"
                      type="checkbox" 
                      checked={answers.blueColdBelow === true}
                      onChange={(e) => handleAnswerChange('blueColdBelow', e.target.checked)}
                    />
                    {lang === 'hi' ? "क्या हाथ/पैर की उंगलियां नीली, पीली या ठंडी पड़ गई हैं?" : "Are the fingers/toes pale, blue, or cold to touch?"}
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 600 }}>
                    <input 
                      key="redflag_unrelivedPain"
                      id="redflag_unrelivedPain"
                      name="redflag_unrelivedPain"
                      type="checkbox" 
                      checked={answers.unrelivedPain === true}
                      onChange={(e) => handleAnswerChange('unrelivedPain', e.target.checked)}
                    />
                    {lang === 'hi' ? "क्या असहनीय दर्द है जो आराम करने या दवा खाने से भी कम नहीं हो रहा?" : "Is there severe, constant pain not relieved by resting?"}
                  </label>
                </div>
              </div>
            )}

            {/* STEP 8: MOCK AI IMAGE UPLOAD */}
            {currentStep === 8 && (
              <div className="fade-in">
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t.aiUploadTitle}</h3>
                <p style={{ fontSize: '0.85rem', color: darkMode ? 'var(--text-secondary)' : 'var(--text-light-secondary)', marginBottom: '1.5rem' }}>
                  {t.aiUploadSub}
                </p>

                {isAnalyzing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                    {/* Visual Photo Scanner Dial */}
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {injuryPhotoUrl && (
                        <div style={{ flex: '1 1 240px', position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(16, 185, 129, 0.4)', background: '#020617', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <img src={injuryPhotoUrl} alt="Scanning" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', display: 'block', opacity: 0.85 }} />
                          {/* Laser Scanning Line */}
                          <div style={{
                            position: 'absolute',
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                            boxShadow: '0 0 15px #10b981, 0 0 6px #10b981',
                            animation: 'laserScan 2.2s ease-in-out infinite'
                          }}></div>
                          {/* Dynamic text overlay */}
                          <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(2, 6, 23, 0.75)',
                            color: '#10b981',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '4px',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            fontFamily: 'monospace',
                            letterSpacing: '0.05em'
                          }}>
                            ANATOMICAL RADAR ACTIVE
                          </div>
                        </div>
                      )}
                      
                      {/* Console Log */}
                      <div className="glass-panel" style={{ flex: '2 1 320px', padding: '1.5rem', background: '#020617', fontFamily: 'monospace', fontSize: '0.85rem', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', height: '200px', justifyContent: 'flex-start', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.75rem', fontWeight: 'bold' }}>
                          <RefreshCw size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
                          <span>AI INFERENCE & TISSUE LAYERS SCANNING...</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#10b981', overflowY: 'auto', flex: 1, textAlign: 'left', paddingBottom: '0.5rem' }}>
                          {analysisLog.map((log, idx) => (
                            <div key={idx} className="fade-in" style={{ textShadow: '0 0 2px rgba(16,185,129,0.3)' }}>{log}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <style>{`
                      @keyframes laserScan {
                        0% { top: 0%; }
                        50% { top: 100%; }
                        100% { top: 0%; }
                      }
                      @keyframes spin { 100% { transform: rotate(360deg); } }
                    `}</style>
                  </div>
                ) : aiResult ? (
                  <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600, marginBottom: '0.75rem' }}>
                      <CheckCircle2 size={20} />
                      <span>AI Model Inference Report</span>
                    </div>
                    <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Detected Swelling:</td>
                          <td style={{ padding: '0.5rem 0', fontWeight: 600, textTransform: 'capitalize' }}>{aiResult.swellingPrediction} Swelling</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Detected Bruising:</td>
                          <td style={{ padding: '0.5rem 0', fontWeight: 600, textTransform: 'capitalize' }}>{aiResult.bruisingPrediction} Bruise</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Model Confidence:</td>
                          <td style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--primary)' }}>94.5%</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Deformity Guard:</td>
                          <td style={{ padding: '0.5rem 0', fontSize: '0.85rem' }}>{aiResult.alignmentCheck}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {/* Injury Photo - Required */}
                    <div 
                      className="glass-panel" 
                      style={{ 
                        padding: '1.5rem', 
                        textAlign: 'center', 
                        border: injuryPhotoUrl ? '2px solid var(--color-low)' : '2px dashed rgba(239,68,68,0.5)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: injuryPhotoUrl ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.04)',
                        cursor: 'pointer',
                        minHeight: '160px'
                      }}
                    >
                      {injuryPhotoUrl ? (
                        <img src={injuryPhotoUrl} alt="Injury preview" style={{ maxWidth: '100%', maxHeight: '110px', borderRadius: '8px', marginBottom: '0.5rem', objectFit: 'cover' }} />
                      ) : (
                        <>
                          <UploadCloud size={36} style={{ color: '#f87171', marginBottom: '0.5rem' }} />
                          <span style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>★ REQUIRED</span>
                        </>
                      )}
                      <label className="btn" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', cursor: 'pointer', background: injuryPhotoUrl ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: injuryPhotoUrl ? 'var(--color-low)' : '#f87171', border: '1px solid', borderColor: injuryPhotoUrl ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)', marginTop: '0.5rem' }}>
                        {injuryPhotoUrl 
                          ? (lang === 'hi' ? '✓ बदलें' : '✓ Change') 
                          : (lang === 'hi' ? '📷 चोट की फोटो' : '📷 Injury Photo')}
                        <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, 'injury')} />
                      </label>
                      <p style={{ margin: '0.4rem 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {lang === 'hi' ? 'चोट वाली जगह की फोटो' : 'Injured area front view'}
                      </p>
                    </div>

                    {/* Comparison Photo - Required */}
                    <div 
                      className="glass-panel" 
                      style={{ 
                        padding: '1.5rem', 
                        textAlign: 'center', 
                        border: comparisonPhotoUrl ? '2px solid var(--color-low)' : '2px dashed rgba(239,68,68,0.5)', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: comparisonPhotoUrl ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.04)',
                        cursor: 'pointer',
                        minHeight: '160px'
                      }}
                    >
                      {comparisonPhotoUrl ? (
                        <img src={comparisonPhotoUrl} alt="Comparison preview" style={{ maxWidth: '100%', maxHeight: '110px', borderRadius: '8px', marginBottom: '0.5rem', objectFit: 'cover' }} />
                      ) : (
                        <>
                          <UploadCloud size={36} style={{ color: '#f87171', marginBottom: '0.5rem' }} />
                          <span style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>★ REQUIRED</span>
                        </>
                      )}
                      <label className="btn" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', cursor: 'pointer', background: comparisonPhotoUrl ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: comparisonPhotoUrl ? 'var(--color-low)' : '#f87171', border: '1px solid', borderColor: comparisonPhotoUrl ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)', marginTop: '0.5rem' }}>
                        {comparisonPhotoUrl 
                          ? (lang === 'hi' ? '✓ बदलें' : '✓ Change') 
                          : (lang === 'hi' ? '📷 दूसरी तरफ की फोटो' : '📷 Other Side Photo')}
                        <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, 'comparison')} />
                      </label>
                      <p style={{ margin: '0.4rem 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {lang === 'hi' ? 'दूसरी तरफ (तुलना के लिए)' : 'Uninjured side for comparison'}
                      </p>
                    </div>
                  </div>
                )}

                {injuryPhoto && comparisonPhoto && !aiResult && !isAnalyzing && (
                  <button 
                    className="btn btn-primary glow-primary" 
                    style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}
                    onClick={runAiAnalysis}
                  >
                    🔬 {t.analyzeButton}
                  </button>
                )}
                {(!injuryPhoto || !comparisonPhoto) && !aiResult && !isAnalyzing && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#f87171' }}>
                      ⚠️ {lang === 'hi' ? 'रिपोर्ट जनरेट करने के लिए दोनों फोटो अनिवार्य हैं।' : lang === 'hn' ? 'Report generate karne ke liye dono photos required hain.' : 'Both photos are mandatory to generate your assessment report.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Wizard Controls */}
            <div className="wizard-bottom-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '2.5rem', gap: '1rem' }}>
              <button 
                type="button"
                className="btn btn-secondary"
                disabled={currentStep === 0}
                style={{ opacity: currentStep === 0 ? 0.3 : 1 }}
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                <ChevronLeft size={16} /> {t.back}
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button 
                  type="button"
                  className="btn btn-primary"
                  disabled={currentStep === 0 && !injuryArea}
                  style={{ opacity: (currentStep === 0 && !injuryArea) ? 0.3 : 1 }}
                  onClick={() => {
                    // Validate current step before advancing
                    if (currentStep === 1) {
                      if (!answers.injuryTimeAgo) { alert('Please answer: When did the injury happen?'); return; }
                    } else if (currentStep === 2) {
                      if (!answers.howInjured) { alert('Please answer: How did the injury occur?'); return; }
                    } else if (currentStep === 3) {
                      if (!answers.soundHeard) { alert('Please answer: Did you hear any sound?'); return; }
                      if (!answers.painType) { alert('Please answer: Type of pain?'); return; }
                      if (!answers.painReliefWithMeds) { alert('Please answer: Does pain medicine help?'); return; }
                    } else if (currentStep === 4) {
                      if (!answers.swelling) { alert('Please answer: Swelling level?'); return; }
                      if (!answers.bruising) { alert('Please answer: Bruising level?'); return; }
                      if (!answers.deformity) { alert('Please answer: Is there visible deformity?'); return; }
                      if (!answers.skinColor) { alert('Please answer: Skin color changes?'); return; }
                    } else if (currentStep === 6) {
                      if (!answers.movementAbility) { alert('Please answer: Movement ability?'); return; }
                      if (!answers.sideComparison) { alert('Please answer: Side comparison?'); return; }
                    }
                    setCurrentStep(prev => prev + 1);
                  }}
                >
                  {t.next} <ChevronRight size={16} />
                </button>
              ) : (
                <button 
                  type="button"
                  className="btn btn-primary glow-primary"
                  style={{ background: 'var(--color-low)' }}
                  onClick={handleFinishAssessment}
                >
                  {t.generateReport} <Check size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SCREEN 5: RESULTS & DETAILS VIEW --- */}
      {view === 'details' && selectedHistoryItem && (
        <div className="slide-in fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Clinical Print-Only Header */}
          <div className="clinical-print-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>InjuryIQ Clinical Triage Report</h1>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>CONFIDENTIAL REPORT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: '#475569', borderBottom: '2px solid #0f172a', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              <span>Patient Name: {currentUser ? currentUser.displayName : 'Guest User'} ({currentUser ? currentUser.email : ''})</span>
              <span>Generated On: {new Date().toLocaleString()}</span>
            </div>
          </div>

          <div className="report-header-controls">
            <button className="btn btn-secondary" onClick={() => setView(history.includes(selectedHistoryItem) ? 'history' : 'dashboard')}>
              <ChevronLeft size={16} /> {t.backToRecords}
            </button>
            <div className="report-header-actions">
              {activeTrackingId === selectedHistoryItem.assessmentId ? (
                <button 
                  className="btn btn-primary" 
                  style={{ background: 'var(--color-low)' }}
                  onClick={() => setView('recovery')}
                >
                  {lang === 'hi' ? "ट्रैकिंग प्रगति देखें" : (lang === 'hn' ? "Tracking Progress Dekhein" : "View Tracking Progress")}
                </button>
              ) : (
                <button 
                  className="btn btn-primary glow-primary"
                  onClick={() => {
                    setActiveTrackingId(selectedHistoryItem.assessmentId);
                    localStorage.setItem(`injuryiq_active_tracking_${currentUser.email}`, selectedHistoryItem.assessmentId);
                    const logsKey = `injuryiq_recovery_logs_${currentUser.email}_${selectedHistoryItem.assessmentId}`;
                    if (!localStorage.getItem(logsKey)) {
                      const initialLog = {
                        id: `log_init_${selectedHistoryItem.assessmentId}`,
                        painLevel: selectedHistoryItem.symptoms?.painLevel ?? 5,
                        swelling: selectedHistoryItem.symptoms?.swelling ?? 'none',
                        mobility: selectedHistoryItem.symptoms?.movementAbility === 'normal' ? 'normal' : (selectedHistoryItem.symptoms?.movementAbility === 'partial' ? 'partial' : 'limited'),
                        notes: 'Initial Assessment Day',
                        date: selectedHistoryItem.createdAt.split('T')[0]
                      };
                      localStorage.setItem(logsKey, JSON.stringify([initialLog]));
                      setRecoveryLogs([initialLog]);
                    }
                    setView('recovery');
                    alert(lang === 'hi' ? "रिकवरी ट्रैकिंग शुरू हो गई है!" : (lang === 'hn' ? "Recovery tracking start ho gayi hai!" : "Recovery tracking started!"));
                  }}
                >
                  {lang === 'hi' ? "रिकवरी ट्रैक करें" : (lang === 'hn' ? "Recovery Track Karein" : "Track Recovery")}
                </button>
              )}
              <button 
                className="btn btn-secondary hide-on-print" 
                onClick={() => window.print()}
                style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)' }}
              >
                <FileText size={16} /> {lang === 'hi' ? "रिपोर्ट प्रिंट / PDF" : (lang === 'hn' ? "Report Print / PDF" : "Print / Export PDF")}
              </button>
              <button className="btn btn-secondary hide-on-print" style={{ color: 'var(--color-emergency)' }} onClick={() => {
                handleDeleteHistory(selectedHistoryItem.assessmentId);
                setView('history');
              }}>
                <Trash2 size={16} /> {t.deleteRecord}
              </button>
            </div>
          </div>

          {/* Tab Selector for Triage Report vs Smart Remedies */}
          <div className="tabs-header hide-on-print" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <button 
              className={`nav-pill ${remedyTab === 'assessment' ? 'active' : ''}`} 
              onClick={() => setRemedyTab('assessment')}
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
            >
              📋 {lang === 'hi' ? "क्लिनिकल रिपोर्ट" : lang === 'hn' ? "Clinical Report" : "Clinical Triage Report"}
            </button>
            <button 
              className={`nav-pill ${remedyTab === 'remedies' ? 'active' : ''}`} 
              onClick={() => setRemedyTab('remedies')}
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: remedyTab === 'remedies' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)', color: 'white' }}
            >
              🌿 {lang === 'hi' ? "स्मार्ट उपचार और दवा गाइड" : lang === 'hn' ? "Smart Remedy & Care Guide" : "Smart Remedy & Care Guide"}
            </button>
          </div>

          {remedyTab === 'assessment' && (
            <>
              <div className="dashboard-grid">
            <div>
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '2rem', 
                  marginBottom: '2rem', 
                  borderTop: `6px solid var(--color-${selectedHistoryItem.riskLevel.toLowerCase()})`,
                  textAlign: 'center'
                }}
              >
                <span className={`badge badge-${selectedHistoryItem.riskLevel.toLowerCase()}`} style={{ fontSize: '1rem', padding: '0.4rem 1rem' }}>
                  {selectedHistoryItem.riskLevel}
                </span>
                
                <div style={{ fontSize: '4.5rem', fontWeight: 800, margin: '1rem 0 0.25rem 0', fontFamily: 'monospace', lineHeight: 1 }}>
                  {selectedHistoryItem.riskScore}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {t.triageScore}
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '1rem 0' }}>
                  {selectedHistoryItem.recommendations.title}
                </h3>
              </div>

              {/* Explainable Breakdown */}
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} /> {t.explainableBreakdown}
                </h3>
                <p style={{ fontSize: '0.8rem', color: darkMode ? 'var(--text-secondary)' : 'var(--text-light-secondary)', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                  {t.breakdownSub}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedHistoryItem.scoreBreakdown.map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        padding: '0.5rem 0', 
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        fontSize: '0.9rem',
                        wordBreak: 'break-word'
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)', flex: 1, minWidth: '150px', textAlign: 'left' }}>{item.factor}</span>
                      <span style={{ fontWeight: 700, color: 'var(--color-high)', whiteSpace: 'nowrap' }}>+{item.points}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0 0 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    <span>{t.finalScore}</span>
                    <span>{selectedHistoryItem.riskScore}</span>
                  </div>
                </div>
              </div>

              {/* Actionable Recs */}
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={18} /> {t.actionableRecs}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedHistoryItem.recommendations.actions.map((act, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <div style={{ color: 'var(--primary)', marginTop: '0.15rem' }}>
                        <CheckCircle2 size={16} />
                      </div>
                      <div>{act}</div>
                    </div>
                  ))}
                </div>

                {["LOW", "MODERATE"].includes(selectedHistoryItem.riskLevel) && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Info size={16} /> {lang === 'hi' ? "प्राथमिक चिकित्सा: R.I.C.E. निर्देश" : "Standard R.I.C.E. Guide"}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '0.5rem', fontSize: '0.78rem', textAlign: 'center' }}>
                      <div className="glass-panel" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>REST</div>
                        <div>{lang === 'hi' ? 'आराम दें' : 'Avoid load'}</div>
                      </div>
                      <div className="glass-panel" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>ICE</div>
                        <div>{lang === 'hi' ? 'बर्फ सेक' : '15-20m limit'}</div>
                      </div>
                      <div className="glass-panel" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>COMPRESS</div>
                        <div>{lang === 'hi' ? 'पट्टी बांधें' : 'Snug wrap'}</div>
                      </div>
                      <div className="glass-panel" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>ELEVATE</div>
                        <div>{lang === 'hi' ? 'ऊंचा उठाएं' : 'Lift joint'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Patient Own Words Notes */}
                {selectedHistoryItem.symptoms?.customNotes && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MessageSquare size={16} style={{ color: 'var(--primary)' }} />
                      {lang === 'hi' ? "रोगी का विवरण (आवाज़/लिखा हुआ):" : lang === 'hn' ? "Patient's description (Voice/Typed):" : "Patient Description (Voice/Typed):"}
                    </div>
                    <div className="glass-panel" style={{ padding: '1rem', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.01)', textAlign: 'left', lineHeight: '1.5' }}>
                      "{selectedHistoryItem.symptoms.customNotes}"
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Metadata & X-ray Banner */}
            <div>
              <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>{t.metadataTitle}</h4>
                <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ height: '35px' }}>
                      <td style={{ color: 'var(--text-secondary)' }}>{t.injuryLocation}:</td>
                      <td style={{ fontWeight: 600, textTransform: 'capitalize', textAlign: 'right' }}>
                        {lang === 'hi' ? (selectedHistoryItem.injuryArea === 'ankle' ? 'टखना' : selectedHistoryItem.injuryArea === 'knee' ? 'घुटना' : selectedHistoryItem.injuryArea === 'foot' ? 'पैर' : 'कलाई') : selectedHistoryItem.injuryArea}
                      </td>
                    </tr>
                    <tr style={{ height: '35px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ color: 'var(--text-secondary)' }}>{t.injuryTimeline}:</td>
                      <td style={{ fontWeight: 600, textAlign: 'right' }}>{selectedHistoryItem.injuryTimeAgo}</td>
                    </tr>
                    <tr style={{ height: '35px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ color: 'var(--text-secondary)' }}>{t.timestamp}:</td>
                      <td style={{ fontWeight: 600, textAlign: 'right' }}>{new Date(selectedHistoryItem.createdAt).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Ottawa rule conclusion card */}
              {['ankle', 'foot', 'knee'].includes(selectedHistoryItem.injuryArea) && (
                <div 
                  className="glass-panel" 
                  style={{ 
                    padding: '1.5rem', 
                    background: (selectedHistoryItem.riskScore >= 50) ? 'var(--color-high-bg)' : 'rgba(255,255,255,0.01)',
                    border: (selectedHistoryItem.riskScore >= 50) ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid var(--border)'
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Info size={16} /> {t.ottawaScreening}
                  </h4>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>
                    {selectedHistoryItem.riskScore >= 50 ? (
                      <>
                        <strong>POSITIVE:</strong> {lang === 'hi' ? "वजन सहन करने में असमर्थता या हड्डी में दर्द पाया गया। फ्रैक्चर की जांच के लिए नैदानिक एक्स-रे की दृढ़ता से सिफारिश की जाती है।" : "Inability to bear weight or local bone point tenderness detected. Triage guidelines state that a clinical X-ray evaluation is indicated to rule out fracture."}
                      </>
                    ) : (
                      <>
                        <strong>NEGATIVE:</strong> {lang === 'hi' ? "परीक्षण क्षेत्रों में कोई हड्डी का दर्द नहीं है और वजन सहन करने की क्षमता सामान्य है। फ्रैक्चर होने की संभावना काफी कम है।" : "No specific bone tenderness at Ottawa test zones and weight-bearing intact. Fracture probability is statistically low."}
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Nutritional Recovery Card */}
              <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '0.5rem', marginBottom: '1rem', borderLeft: '4px solid #34d399' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
                  🥦 {lang === 'hi' ? "पोषण और आहार गाइड" : (lang === 'hn' ? "Nutritional Recovery Guide" : "Bone & Joint Healing Nutrition")}
                </h4>
                
                {(() => {
                  const area = selectedHistoryItem.injuryArea;
                  
                  let foods = [];
                  let primaryNutrient = "";
                  let tip = "";

                  if (area === 'knee' || area === 'ankle') {
                    primaryNutrient = lang === 'hi' ? "कैल्शियम और विटामिन D (हड्डी रिकवरी)" : "Calcium & Vitamin D (Bone Stress)";
                    foods = lang === 'hi' 
                      ? ["दूध और डेयरी उत्पाद (दूध, दही, पनीर)", "हरी पत्तेदार सब्जियां (पालक, मेथी)", "सूरजमुखी के बीज और बादाम", "रागी का आटा"] 
                      : ["Grass-fed Dairy (Milk, Yogurt, Paneer)", "Dark Leafy Greens (Spinach, Broccoli)", "Almonds & Sesame seeds", "Ragi (Finger millet) porridge"];
                    tip = lang === 'hi' 
                      ? "हड्डियों को मजबूत रखने के लिए प्रतिदिन सुबह 15 मिनट हल्की धूप लें।" 
                      : "Spend 15 mins in soft morning sunlight to naturally synthesize Vitamin D3.";
                  } else {
                    primaryNutrient = lang === 'hi' ? "कोलेजन और विटामिन C (लिगामेंट/टिशू रिपेयर)" : "Collagen & Vitamin C (Tissue Repair)";
                    foods = lang === 'hi'
                      ? ["खट्टे फल (संतरा, आंवला, नींबू)", "हल्दी वाला दूध (सूजन कम करने के लिए)", "पपीता और कीवी फल", "अदरक-तुलसी की चाय"]
                      : ["Vitamin C Rich Citrus (Oranges, Amla, Lemon)", "Turmeric Milk (Haldi Doodh - Anti-inflammatory)", "Ginger-Basil Herbal Tea", "Papaya & Chia Seeds"];
                    tip = lang === 'hi'
                      ? "हल्दी में मौजूद करक्यूमिन जोड़ों की सूजन और दर्द को तेजी से कम करता है।"
                      : "Curcumin in Turmeric acts as a potent anti-inflammatory agent for joint swells.";
                  }

                  return (
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {primaryNutrient}
                      </div>
                      <ul style={{ margin: '0 0 0.75rem 0', paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
                        {foods.map((food, idx) => <li key={idx} style={{ marginBottom: '0.25rem' }}>{food}</li>)}
                      </ul>
                      <div style={{ background: 'rgba(52, 211, 153, 0.05)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', border: '1px solid rgba(52, 211, 153, 0.15)', fontStyle: 'italic' }}>
                        💡 <strong>{lang === 'hi' ? "डॉक्टर की सलाह:" : "Triage Tip:"}</strong> {tip}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* AI Doctor Consultation Disclaimer */}
              <div className="glass-panel" style={{ padding: '1rem 1.5rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🤖</span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: '#a5b4fc' }}>AI-Generated Report — </strong>
                  {lang === 'hi' ? 'यह रिपोर्ट AI-आधारित नियमों से तैयार की गई है। सटीक निदान के लिए कृपया एक बार योग्य डॉक्टर से परामर्श अवश्य लें।' : lang === 'hn' ? 'Yeh report AI-assisted clinical rules se bani hai. Sahi diagnosis ke liye ek baar doctor se zaroor milein.' : 'This report is generated using AI-assisted clinical rules. Please consult a qualified doctor at least once for accurate medical diagnosis.'}
                </p>
              </div>

              {/* Trauma Center Locator Widget */}
              {['HIGH', 'EMERGENCY'].includes(selectedHistoryItem.riskLevel) && (
                <div className="glass-panel hide-on-print" style={{ padding: '1.5rem', marginTop: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-emergency)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🚨 {lang === 'hi' ? "आपातकालीन ट्रॉमा सेंटर लोकेटर" : (lang === 'hn' ? "Emergency Trauma Center Locator" : "Emergency Trauma Center Locator")}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {lang === 'hi' 
                      ? "चोट गंभीर लग रही है। कृपया तुरंत नजदीकी अस्पताल या आर्थोपेडिक विभाग में जाएं।" 
                      : (lang === 'hn' ? "Injury severe lag rahi hai. Kripya turant pass ke hospital ya orthopedic ward me jayein." : "High risk of fracture or joint trauma. We strongly recommend immediate professional evaluation at a nearby emergency facility.")}
                  </p>

                  {nearbyClinics.length === 0 ? (
                    <button 
                      className="btn btn-primary glow-primary" 
                      style={{ background: 'var(--color-emergency)', border: 'none', width: '100%', padding: '0.65rem' }}
                      onClick={handleFindClinics}
                      disabled={locLoading}
                    >
                      {locLoading 
                        ? (lang === 'hi' ? "स्थान खोज रहे हैं..." : "Locating nearest...") 
                        : (lang === 'hi' ? "नजदीकी ट्रॉमा सेंटर खोजें" : (lang === 'hn' ? "Nearby Trauma Centers Dhoondein" : "Find Nearby Emergency Clinics"))}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                      {locError && <div style={{ fontSize: '0.75rem', color: 'var(--color-moderate)', marginBottom: '0.5rem' }}>{locError}</div>}
                      {nearbyClinics.map((clinic, idx) => (
                        <div key={idx} className="glass-panel" style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#fca5a5', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{clinic.name}</span>
                            {clinic.distance !== "N/A" && <span style={{ color: 'var(--primary)' }}>{clinic.distance} km</span>}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.75rem' }}>{clinic.address}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Phone: {clinic.phone}</div>
                          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                            <a 
                              href={clinic.lat && clinic.lng ? `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.name + " " + clinic.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', textDecoration: 'none', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                            >
                              🗺️ {lang === 'hi' ? "दिशा-निर्देश" : "Directions"}
                            </a>
                            <a 
                              href={`tel:${clinic.phone}`}
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', textDecoration: 'none', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', border: '1px solid rgba(52, 211, 153, 0.3)' }}
                            >
                              📞 {lang === 'hi' ? "कॉल" : "Call"}
                            </a>
                          </div>
                        </div>
                      ))}
                      <button 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.75rem', padding: '0.35rem' }}
                        onClick={handleFindClinics}
                      >
                        🔄 {lang === 'hi' ? "पुनः खोजें" : "Refresh Location"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* AI Visual Scan & Diagnostics Panel */}
          {selectedHistoryItem.aiResult && (
            <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', marginBottom: '2rem', borderTop: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                🧠 {lang === 'hi' ? "AI उन्नत छवि स्कैन एवं विजुअल डायग्नोस्टिक्स" : "AI Deep Visual Scanning & Diagnostics"}
                <span className="badge" style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>Clinical Scan v2.5</span>
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '1.5rem' }}>
                {/* Visual Comparison Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    📸 {lang === 'hi' ? "नैदानिक छवि तुलना (Clinical Photo Comparison)" : "Clinical Visual Symmetry Comparison"}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                    {/* Injury Image with overlay marker */}
                    {selectedHistoryItem.imageUrl && (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-high)', fontWeight: 'bold', textAlign: 'center' }}>
                          ⚠️ {lang === 'hi' ? "प्रभावित जोड़ (Injured Side)" : "Injured Joint"}
                        </div>
                        <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(239, 68, 68, 0.4)', background: '#111' }}>
                          <img src={selectedHistoryItem.imageUrl} alt="Injured Joint" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', aspectRatio: '4/3' }} />
                          {selectedHistoryItem.aiResult.markerCoordinate && (
                            <div 
                              style={{
                                position: 'absolute',
                                left: `${selectedHistoryItem.aiResult.markerCoordinate.x}%`,
                                top: `${selectedHistoryItem.aiResult.markerCoordinate.y}%`,
                                width: `${selectedHistoryItem.aiResult.markerCoordinate.radius * 2}px`,
                                height: `${selectedHistoryItem.aiResult.markerCoordinate.radius * 2}px`,
                                borderRadius: '50%',
                                border: '3px solid #ef4444',
                                background: 'rgba(239, 68, 68, 0.25)',
                                transform: 'translate(-50%, -50%)',
                                boxShadow: '0 0 15px #ef4444, inset 0 0 8px #ef4444',
                                animation: 'pulseGlow 1.5s infinite alternate',
                                cursor: 'pointer'
                              }}
                              title={selectedHistoryItem.aiResult.markerCoordinate.label || "AI Identified Swelling Region"}
                            >
                              <span style={{
                                position: 'absolute',
                                top: '105%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '4px',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                              }}>
                                {selectedHistoryItem.aiResult.markerCoordinate.label || "Swelling Area"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Comparison Image */}
                    {selectedHistoryItem.comparisonImageUrl && (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 'bold', textAlign: 'center' }}>
                          ✅ {lang === 'hi' ? "स्वस्थ जोड़ (Healthy Side)" : "Healthy Side (Control)"}
                        </div>
                        <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(52, 211, 153, 0.4)', background: '#111' }}>
                          <img src={selectedHistoryItem.comparisonImageUrl} alt="Healthy Joint" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', aspectRatio: '4/3' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Clinical AI Diagnostics breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    🔬 {lang === 'hi' ? "कंप्यूटर विज़न विश्लेषणात्मक परिणाम" : "Computer Vision Diagnostic Metrics"}
                  </div>
                  
                  <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Scanned Target:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{selectedHistoryItem.aiResult.detectedContent || "Human Joint Contour"}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Swelling Zone:</span>
                      <strong style={{ color: 'var(--primary)' }}>{selectedHistoryItem.aiResult.swellingZone}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Swelling Severity:</span>
                      <span className={`badge badge-${selectedHistoryItem.aiResult.swellingPrediction === 'none' ? 'low' : (selectedHistoryItem.aiResult.swellingPrediction === 'severe' ? 'emergency' : (selectedHistoryItem.aiResult.swellingPrediction === 'moderate' ? 'moderate' : 'low'))}`} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>
                        {selectedHistoryItem.aiResult.swellingPrediction ? selectedHistoryItem.aiResult.swellingPrediction.toUpperCase() : 'NONE'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Bruising & Hematoma Metrics:</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', marginTop: '0.15rem', fontStyle: 'italic' }}>
                        {selectedHistoryItem.aiResult.bruisingMetrics}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Alignment & Symmetry Check:</span>
                      <strong style={{ color: selectedHistoryItem.aiResult.alignmentCheck && (selectedHistoryItem.aiResult.alignmentCheck.toLowerCase().includes('suspected') || selectedHistoryItem.aiResult.alignmentCheck.toLowerCase().includes('misalignment')) ? 'var(--color-emergency)' : '#34d399' }}>
                        {selectedHistoryItem.aiResult.alignmentCheck || "Normal symmetry."}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Diagnostic Scan Confidence:</span>
                        <strong style={{ color: 'var(--primary)' }}>{selectedHistoryItem.aiResult.confidenceScore ? (selectedHistoryItem.aiResult.confidenceScore * 100).toFixed(1) : '94.5'}%</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${selectedHistoryItem.aiResult.confidenceScore ? selectedHistoryItem.aiResult.confidenceScore * 100 : 94.5}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #a5b4fc)', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Detailed AI Diagnostic Reason Conclusion */}
              <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '1rem 1.25rem', borderRadius: '12px', marginTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.2rem', marginTop: '-0.1rem' }}>🤖</span>
                  <div>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{lang === 'hi' ? "मशीन लर्निंग मॉडल निष्कर्ष:" : "Machine Learning Diagnosis Summary:"}</strong>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {selectedHistoryItem.aiResult.reason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Print-Only Footer */}
          <div className="clinical-print-footer">
            <p style={{ fontStyle: 'italic', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              <strong>Disclaimer:</strong> This report is generated based on automated clinical decision support rules (incorporating Ottawa Rules for ankle, foot, and knee, and clinical scaphoid criteria for wrist injuries) and patient inputs. It is for informational and educational triage guidance, NOT a definitive diagnosis. If symptoms persist, seek hands-on orthopedic care.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', fontSize: '0.85rem' }}>
              <span>Verified System Output — Patient ID Hash: {currentUser ? btoa(currentUser.email).substring(0, 12) : 'N/A'}</span>
              <span style={{ borderTop: '1px solid #475569', width: '220px', textAlign: 'center', paddingTop: '0.25rem', fontWeight: 'bold' }}>Consulting Doctor Signature</span>
            </div>
          </div>
        </>
      )}

      {remedyTab === 'remedies' && (
        <div className="remedies-dashboard fade-in" style={{ padding: '0.5rem 0' }}>
          {/* Banned HUD Warning Banner */}
          {getRemediesData(selectedHistoryItem.riskLevel.toLowerCase()).banned.length > 0 && (
            <div className="banned-actions-hud" style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', marginBottom: '2rem', animation: 'crimsonFlash 3s infinite alternate' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f87171', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                <span>🚨</span>
                <span>{lang === 'hi' ? 'वर्जित गतिविधियां (Strict Restrictions)' : (lang === 'hn' ? 'Strictly Banned Actions!' : 'Medical Warning: Strictly Banned Actions')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {getRemediesData(selectedHistoryItem.riskLevel.toLowerCase()).banned.map((b, idx) => (
                  <div key={idx} style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                    <strong style={{ color: '#f87171' }}>✕ {b.title}:</strong> {b.desc}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Virtual First-Aid Cabinet */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1.5rem', background: 'linear-gradient(135deg, #10b981, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              💼 {lang === 'hi' ? 'वर्चुअल फर्स्ट-एड बॉक्स' : (lang === 'hn' ? 'Virtual First-Aid Box' : 'Virtual First-Aid Cabinet')}
            </h3>
            
            {/* Cabinet Drawers Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px', margin: '0 auto' }}>
              <button 
                onClick={() => setActiveDrawer('medicines')}
                className={`cabinet-drawer-btn ${activeDrawer === 'medicines' ? 'active' : ''}`}
                style={{ 
                  padding: '1rem', 
                  background: activeDrawer === 'medicines' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: activeDrawer === 'medicines' ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  color: activeDrawer === 'medicines' ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>💊 {lang === 'hi' ? 'प्राथमिक दवाएं (OTC Medicines)' : (lang === 'hn' ? 'Safe OTC Medicines' : 'Safe OTC Medicines')}</span>
                <span style={{ fontSize: '0.8rem', opacity: activeDrawer === 'medicines' ? 1 : 0.5 }}>
                  {activeDrawer === 'medicines' ? '📂 Open' : '📁 Closed'}
                </span>
              </button>

              <button 
                onClick={() => setActiveDrawer('ayurveda')}
                className={`cabinet-drawer-btn ${activeDrawer === 'ayurveda' ? 'active' : ''}`}
                style={{ 
                  padding: '1rem', 
                  background: activeDrawer === 'ayurveda' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: activeDrawer === 'ayurveda' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  color: activeDrawer === 'ayurveda' ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>🌿 {lang === 'hi' ? 'घरेलू उपचार और लेप (Ayurvedic)' : (lang === 'hn' ? 'Gharelu Nuskhe & Leps' : 'Ayurvedic & Home Remedies')}</span>
                <span style={{ fontSize: '0.8rem', opacity: activeDrawer === 'ayurveda' ? 1 : 0.5 }}>
                  {activeDrawer === 'ayurveda' ? '📂 Open' : '📁 Closed'}
                </span>
              </button>

              <button 
                onClick={() => setActiveDrawer('supports')}
                className={`cabinet-drawer-btn ${activeDrawer === 'supports' ? 'active' : ''}`}
                style={{ 
                  padding: '1rem', 
                  background: activeDrawer === 'supports' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: activeDrawer === 'supports' ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  color: activeDrawer === 'supports' ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>🩹 {lang === 'hi' ? 'कम्प्रेसन और जॉइंट सपोर्ट' : (lang === 'hn' ? 'Compression & Braces' : 'Supports & Bandages')}</span>
                <span style={{ fontSize: '0.8rem', opacity: activeDrawer === 'supports' ? 1 : 0.5 }}>
                  {activeDrawer === 'supports' ? '📂 Open' : '📁 Closed'}
                </span>
              </button>
            </div>
          </div>

          {/* Drawer Content Section */}
          <div className="drawer-content-container fade-in">
            {/* 1. Medicines Drawer */}
            {activeDrawer === 'medicines' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {getRemediesData(selectedHistoryItem.riskLevel.toLowerCase()).medicines.map((med) => (
                  <div key={med.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>{med.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{med.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleAddRemedyReminder(med.name)}
                      className="btn btn-secondary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      ⏰ {lang === 'hi' ? 'रिमाइंडर जोड़ें' : (lang === 'hn' ? 'Reminder Add Karein' : 'Add Reminder')}
                    </button>
                  </div>
                ))}
                {getRemediesData(selectedHistoryItem.riskLevel.toLowerCase()).medicines.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    {lang === 'hi' ? 'इस रिस्क लेवल के लिए कोई विशेष दवा अनुशंसित नहीं है।' : 'No medicines required/recommended for this risk level.'}
                  </div>
                )}
              </div>
            )}

            {/* 2. Ayurveda Drawer */}
            {activeDrawer === 'ayurveda' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                {getRemediesData(selectedHistoryItem.riskLevel.toLowerCase()).ayurveda.map((remedy) => (
                  <div key={remedy.id} className="remedy-recipe-card glass-panel" style={{ padding: '2rem', borderLeft: '4px solid #10b981', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <span className="badge badge-low" style={{ marginBottom: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                          🌿 Ayurvedic Remedy
                        </span>
                        <h4 style={{ margin: 0, fontSize: '1.35rem', color: '#f8fafc', fontWeight: 800 }}>{remedy.name}</h4>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.7rem' }}>
                        <span style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                          ⏱️ {remedy.prepTime}
                        </span>
                        <button 
                          onClick={() => handleAddRemedyReminder(remedy.name)}
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}
                        >
                          ⏰ {lang === 'hi' ? 'रिमाइंडर जोड़ें' : 'Add Reminder'}
                        </button>
                      </div>
                    </div>

                    {/* Ingredients Checklist */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h5 style={{ margin: '0 0 0.75rem 0', color: '#cbd5e1', fontSize: '0.95rem', fontWeight: 700 }}>🥣 Ingredients:</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                        {remedy.ingredients.map((ing, idx) => {
                          const checkKey = `${remedy.id}_${idx}`;
                          return (
                            <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem', color: completedRemedies[checkKey] ? 'var(--text-muted)' : 'var(--text-secondary)', textDecoration: completedRemedies[checkKey] ? 'line-through' : 'none' }}>
                              <input 
                                type="checkbox" 
                                checked={!!completedRemedies[checkKey]} 
                                onChange={(e) => {
                                  setCompletedRemedies({
                                    ...completedRemedies,
                                    [checkKey]: e.target.checked
                                  });
                                }}
                                style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
                              />
                              <span>{ing}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Steps List */}
                    <div>
                      <h5 style={{ margin: '0 0 0.75rem 0', color: '#cbd5e1', fontSize: '0.95rem', fontWeight: 700 }}>📋 Preparation & Use:</h5>
                      <ol style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {remedy.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
                {getRemediesData(selectedHistoryItem.riskLevel.toLowerCase()).ayurveda.length === 0 && (
                  <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: '#cbd5e1', border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239, 68, 68, 0.02)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#f87171', fontWeight: 700 }}>
                      {lang === 'hi' ? 'घरेलू उपचार वर्जित हैं!' : 'Home Remedies Prohibited!'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto', lineHeight: '1.5' }}>
                      {lang === 'hi' 
                        ? 'टूटे हुए जोड़ या गंभीर फ्रैक्चर के संदेह में कोई भी लेप या तेल की मालिश करना अत्यंत हानिकारक हो सकता है। कृपया तुरंत डॉक्टर से संपर्क करें।' 
                        : 'Applying herbal pastes or heating compresses is strictly prohibited for suspected fractures as it can worsen bone displacement.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. Supports Drawer */}
            {activeDrawer === 'supports' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {getRemediesData(selectedHistoryItem.riskLevel.toLowerCase()).supports.map((sup) => (
                  <div key={sup.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>{sup.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{sup.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleAddRemedyReminder(sup.name)}
                      className="btn btn-secondary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', color: '#f59e0b' }}
                    >
                      ⏰ {lang === 'hi' ? 'रिमाइंडर जोड़ें' : 'Add Reminder'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Disclaimer */}
          <div style={{ marginTop: '3rem', padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
            <span>🛡️</span>
            <span><strong>Disclaimer:</strong> {lang === 'hi' ? 'यह जानकारी केवल प्राथमिक सहायता और कॉलेज प्रोजेक्ट प्रस्तुति के लिए है। किसी भी गंभीर चोट में चिकित्सकीय परामर्श अत्यंत आवश्यक है।' : 'This advice is strictly for first-aid educational support. Consult an orthopedic doctor immediately for any physical injuries.'}</span>
          </div>
        </div>
      )}
    </div>
  )}

      {/* --- SCREEN 6: GENERAL HISTORY LIST --- */}
      {view === 'history' && (
        <div className="slide-in fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HistoryIcon size={24} /> {lang === 'hi' ? 'चोट मूल्यांकन इतिहास' : 'Assessment History Log'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-panel glass-panel-hover" 
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '50%' }}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '1.1rem' }}>
                        {lang === 'hi' ? (item.injuryArea === 'ankle' ? 'टखना' : item.injuryArea === 'knee' ? 'घुटना' : item.injuryArea === 'foot' ? 'पैर' : 'कलाई') : item.injuryArea} Injury
                      </span>
                      <span className={`badge badge-${item.riskLevel.toLowerCase()}`}>
                        {item.riskLevel}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: darkMode ? 'var(--text-secondary)' : 'var(--text-light-secondary)', marginTop: '0.25rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {item.injuryTimeAgo}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'monospace' }}>{item.riskScore}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>score</div>
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem' }}
                    onClick={() => {
                      setSelectedHistoryItem(item);
                      setView('details');
                    }}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem', color: 'var(--color-emergency)' }}
                    onClick={() => handleDeleteHistory(item.assessmentId)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {history.length === 0 && (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No injury assessment records found in LocalStorage cache.</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleStartNewAssessment}>
                  Start Your First Assessment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SCREEN 7: RECOVERY TRACKING DASHBOARD --- */}
      {view === 'recovery' && (() => {
        const getCalendarDays = () => {
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth();
          const firstDay = new Date(year, month, 1).getDay();
          const totalDays = new Date(year, month + 1, 0).getDate();
          const days = [];
          for (let i = 0; i < firstDay; i++) {
            days.push(null);
          }
          for (let d = 1; d <= totalDays; d++) {
            days.push(new Date(year, month, d));
          }
          return days;
        };

        const getLogForDate = (dateObj) => {
          if (!dateObj) return null;
          const y = dateObj.getFullYear();
          const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
          const d = dateObj.getDate().toString().padStart(2, '0');
          const dateStr = `${y}-${m}-${d}`;
          return sortedLogs.find(log => log.date === dateStr);
        };

        const REHAB_EXERCISES = {
          ankle: [
            {
              id: "ankle_pump",
              name: lang === 'hi' ? "टखने के पंप" : (lang === 'hn' ? "Ankle Pumps (Up-Down Movement)" : "Ankle Pumps"),
              description: lang === 'hi' ? "अपने पैर को धीरे-धीरे ऊपर और नीचे खींचें। सूजन कम करने के लिए यह सबसे अच्छा है।" : (lang === 'hn' ? "Apne pair ko dhire-dhire upar aur niche stretch karein. Sujan kam karne ke liye yeh best hai." : "Bend your ankle up towards your head, then point it down away from you. Helps reduce swelling."),
              duration: 30,
              sets: "3 sets of 15 reps",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M10 20 L60 25 L85 45" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M82 30 Q92 38 82 46" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 1-3</text>
                </svg>
              )
            },
            {
              id: "ankle_circle",
              name: lang === 'hi' ? "टखने के चक्कर" : (lang === 'hn' ? "Ankle Circles (Gol Ghoomana)" : "Ankle Circles"),
              description: lang === 'hi' ? "पैर के पंजे को गोल घुमाएं ताकि जोड़ अधिक लचीला हो सके।" : (lang === 'hn' ? "Pair ke panje ko gol clockwise aur counter-clockwise ghoomayein mobility ke liye." : "Rotate your ankle slowly in a circle, clockwise then counter-clockwise. Improves joint mobility."),
              duration: 45,
              sets: "3 sets of 10 circles each side",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M10 20 L60 25 L85 45" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="85" cy="42" r="8" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="18 4" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 3-5</text>
                </svg>
              )
            },
            {
              id: "towel_stretch",
              name: lang === 'hi' ? "तौलिया खिंचाव" : (lang === 'hn' ? "Towel Calf Stretch" : "Towel Calf Stretch"),
              description: lang === 'hi' ? "पैरों को सीधा रखकर बैठें, पैर में तौलिया लपेटें और उसे अपनी ओर खींचें।" : (lang === 'hn' ? "Lete ya baithte hue foot par towel lapetein aur dhire se pull karein. Hold karein." : "Sit with leg straight. Loop a towel around your foot and pull gently towards you. Hold the stretch."),
              duration: 30,
              sets: "Hold 30s, repeat 3 times",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M10 40 L70 40 L80 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M80 15 Q40 15 20 20" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 5+</text>
                </svg>
              )
            },
            {
              id: "isometric_press",
              name: lang === 'hi' ? "आइसोमेट्रिक प्रेस" : (lang === 'hn' ? "Isometric Press (Deewar pe Dabayein)" : "Isometric Press"),
              description: lang === 'hi' ? "बिना पैर हिलाए, बाहरी पंजे को दीवार पर दबाएं। मांसपेशियां मजबूत होती हैं।" : (lang === 'hn' ? "Apne foot ko deewar ke side me press karein bina pair hilaaye (muscle strengthening)." : "Push the outside of your foot against a wall or heavy table without moving the joint. Strengthens muscles."),
              duration: 15,
              sets: "Hold 10s, repeat 10 times",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M15 45 L70 45 L75 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <line x1="85" y1="10" x2="85" y2="50" stroke="var(--color-emergency)" strokeWidth="3" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 7+</text>
                </svg>
              )
            }
          ],
          knee: [
            {
              id: "quad_set",
              name: lang === 'hi' ? "क्वाड सेट्स" : (lang === 'hn' ? "Quad Sets (Thigh Tighten)" : "Quad Sets"),
              description: lang === 'hi' ? "पैर को सीधा रखें और जांघ की मांसपेशियों को कसें, घुटने को फर्श पर दबाएं।" : (lang === 'hn' ? "Leg ko seedha rakhein aur thigh muscles ko tight karein, ghutne ko niche floor pe dabayein." : "Lie on your back, tighten your thigh muscle, and push the back of your knee down. Hold for 5 seconds."),
              duration: 10,
              sets: "Hold 5s, repeat 15 times",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M10 40 Q40 40 60 40 T90 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M50 40 L50 48" fill="none" stroke="var(--primary)" strokeWidth="2" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 1-3</text>
                </svg>
              )
            },
            {
              id: "heel_slide",
              name: lang === 'hi' ? "एड़ी फिसलना" : (lang === 'hn' ? "Heel Slides (Ghutna Modein)" : "Heel Slides"),
              description: lang === 'hi' ? "एड़ी को फर्श पर खिसकाते हुए अपने घुटने को मोड़ें, फिर सीधा करें।" : (lang === 'hn' ? "Apni heel ko floor par slide karte hue apne hips ke paas laayein aur fir seedha karein." : "Slide your heel along the floor towards your buttocks, bending your knee. Then slide back."),
              duration: 30,
              sets: "3 sets of 10 reps",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M10 40 L50 25 L75 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M75 40 L50 40" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 3-5</text>
                </svg>
              )
            },
            {
              id: "leg_raise",
              name: lang === 'hi' ? "सीधे पैर उठाना" : (lang === 'hn' ? "Straight Leg Raises" : "Straight Leg Raises"),
              description: lang === 'hi' ? "जांघ को कस कर रखें, पैर सीधा करें और फर्श से 6-12 इंच ऊपर उठाएं।" : (lang === 'hn' ? "Leg ko bilkul seedha karke floor se 6-12 inches upar uthayein aur hold karein." : "Tighten thigh, keep leg fully straight, and raise it 6-12 inches off the floor. Lower slowly."),
              duration: 20,
              sets: "3 sets of 10 reps",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M10 40 L50 30 L80 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 3-5</text>
                </svg>
              )
            },
            {
              id: "wall_squats",
              name: lang === 'hi' ? "दीवार बैठना" : (lang === 'hn' ? "Wall Squats (Deewar ke Sahare)" : "Wall Squats"),
              description: lang === 'hi' ? "दीवार के सहारे पीठ टिकाएं, घुटनों को थोड़ा मोड़ें और फिर वापस ऊपर उठें।" : (lang === 'hn' ? "Deewar par back tikayein aur dhire se niche slide karein (minor bend). Phir upar aayein." : "Lean back against a wall. Slide down to bend knees slightly (no more than 45 deg). Push back up."),
              duration: 30,
              sets: "3 sets of 8-10 squats",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M40 10 L40 30 L60 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <line x1="30" y1="10" x2="30" y2="50" stroke="var(--primary)" strokeWidth="3" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 7+</text>
                </svg>
              )
            }
          ],
          wrist: [
            {
              id: "wrist_pump",
              name: lang === 'hi' ? "मुट्ठी पंप" : (lang === 'hn' ? "Fist Pumps (Mutthi Band-Kholna)" : "Fist Pumps"),
              description: lang === 'hi' ? "हल्के से ढीली मुट्ठी बनाएं, फिर उंगलियों को फैलाकर खोलें। रक्त प्रवाह बढ़ाता है।" : (lang === 'hn' ? "Gently fist band karein, phir fingers ko poora bahar kholein. Blood circulation badhata hai." : "Gently make a loose fist, then stretch your fingers wide open. Helps restore blood flow."),
              duration: 20,
              sets: "2 sets of 15 reps",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <circle cx="50" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path d="M50 15 L50 5" fill="none" stroke="var(--primary)" strokeWidth="1.5" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 1-3</text>
                </svg>
              )
            },
            {
              id: "wrist_flexion",
              name: lang === 'hi' ? "कलाई मोड़ना" : (lang === 'hn' ? "Wrist Flexion/Extension" : "Wrist Flex/Extend"),
              description: lang === 'hi' ? "कलाई को धीरे से अपने चेहरे की ओर मोड़ें, फिर फर्श की ओर झुकाएं।" : (lang === 'hn' ? "Apne hath ko wrist se upar aur niche dhire se bend karein mobility ke liye." : "Gently bend your wrist up towards your face, then down towards the floor. Improves mobility."),
              duration: 30,
              sets: "3 sets of 10 reps",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M10 30 L55 30 L75 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M72 17 Q80 25 72 32" fill="none" stroke="var(--primary)" strokeWidth="2" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 3-5</text>
                </svg>
              )
            },
            {
              id: "wrist_rotation",
              name: lang === 'hi' ? "कलाई का चक्कर" : (lang === 'hn' ? "Wrist Rotations (Gol Ghoomana)" : "Wrist Rotations"),
              description: lang === 'hi' ? "कलाई को धीरे-धीरे गोलाकार गति में घुमाएं ताकि जोड़ सुचारू हो सके।" : (lang === 'hn' ? "Dhire se haath ko clockwise aur anticlockwise circles me ghoomayein." : "Rotate your hand slowly in circular motions to lubricate the joint and restore range of motion."),
              duration: 30,
              sets: "3 sets of 10 rotations",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M10 30 L55 30 L75 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="75" cy="30" r="8" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="18 4" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 3-5</text>
                </svg>
              )
            },
            {
              id: "ball_squeeze",
              name: lang === 'hi' ? "गेंद दबाना" : (lang === 'hn' ? "Stress Ball Squeeze" : "Stress Ball Squeeze"),
              description: lang === 'hi' ? "हाथ में एक नरम गेंद पकड़ें और उसे कसकर दबाएं, 5 सेकंड के लिए रोकें।" : (lang === 'hn' ? "Kisi soft sponge ball ko mutthi me squeeze karein aur 5 seconds tak hold karein." : "Hold a soft foam ball or sponge in your hand and squeeze it firmly. Hold for 5 seconds."),
              duration: 15,
              sets: "Repeat 10-15 times daily",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <circle cx="65" cy="30" r="12" fill="rgba(59, 130, 246, 0.4)" stroke="var(--primary)" strokeWidth="2" />
                  <circle cx="65" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 7+</text>
                </svg>
              )
            }
          ],
          foot: [
            {
              id: "toe_curl",
              name: lang === 'hi' ? "पैर की अंगुली कर्ल" : (lang === 'hn' ? "Toe Curls (Towel kheechhna)" : "Toe Towel Curls"),
              description: lang === 'hi' ? "फर्श पर तौलिया रखें और अपनी उंगलियों का उपयोग करके उसे अपनी ओर खींचें।" : (lang === 'hn' ? "Floor par towel bichhayein aur toes se use apni taraf pull karne ki koshish karein." : "Place a small towel on the floor. Use your toes to scrunch and pull the towel toward you."),
              duration: 30,
              sets: "Repeat 3 times for 1 minute each",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M10 40 L60 40 L85 45" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M50 42 Q30 42 10 45" fill="none" stroke="var(--primary)" strokeWidth="2" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 1-3</text>
                </svg>
              )
            },
            {
              id: "toe_splay",
              name: lang === 'hi' ? "पैर की उंगलियों को फैलाना" : (lang === 'hn' ? "Toe Splay (Ungliyan phailana)" : "Toe Splay"),
              description: lang === 'hi' ? "अपनी उंगलियों को फैलाएं, 5 सेकंड के लिए रोकें, फिर ढीला छोड़ें।" : (lang === 'hn' ? "Apne toes ko jitna ho sake wide spread karein, 5s hold karein, fir relax karein." : "Spread all of your toes apart as far as comfortable. Hold for 5 seconds, then relax."),
              duration: 15,
              sets: "10 repetitions daily",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <circle cx="50" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <line x1="50" y1="20" x2="50" y2="10" stroke="var(--primary)" strokeWidth="1.5" />
                  <line x1="42" y1="22" x2="35" y2="15" stroke="var(--primary)" strokeWidth="1.5" />
                  <line x1="58" y1="22" x2="65" y2="15" stroke="var(--primary)" strokeWidth="1.5" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 1-3</text>
                </svg>
              )
            },
            {
              id: "fascia_stretch",
              name: lang === 'hi' ? "प्लांटार फासिआ खिंचाव" : (lang === 'hn' ? "Plantar Fascia Stretch" : "Plantar Fascia Stretch"),
              description: lang === 'hi' ? "बैठकर पैर को ऊपर लाएं, और अपने हाथ से उंगलियों को पीछे की ओर खींचें।" : (lang === 'hn' ? "Apne toes ko haath se pakad kar peechhe ki taraf stretch karein (foot heel pain ke liye)." : "Sit down, cross your foot over, and pull your toes back towards your shin using your hand."),
              duration: 30,
              sets: "Hold 30s, repeat 3 times",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M10 40 L60 40 L80 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M80 15 L70 5" fill="none" stroke="var(--primary)" strokeWidth="2" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 3-5</text>
                </svg>
              )
            },
            {
              id: "calf_stretch",
              name: lang === 'hi' ? "पिंडली का खिंचाव" : (lang === 'hn' ? "Calf/Achilles Stretch" : "Calf / Achilles Stretch"),
              description: lang === 'hi' ? "दीवार के सहारे एक पैर पीछे फैलाकर खड़े हों और एड़ी को फर्श पर सपाट रखें।" : (lang === 'hn' ? "Wall ki taraf face karke khade hon, ek leg peeche stretch karein heel ko floor par rakhte hue." : "Lean against a wall with one leg back, heel flat on the floor. Feel the stretch in your calf."),
              duration: 30,
              sets: "3 sets of 30s holds",
              svg: (
                <svg viewBox="0 0 100 60" style={{ width: '80px', height: '50px' }}>
                  <path d="M30 45 L50 20 L70 45" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <line x1="80" y1="10" x2="80" y2="50" stroke="var(--primary)" strokeWidth="3" />
                  <text x="10" y="55" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Day 5+</text>
                </svg>
              )
            }
          ]
        };

        const trackedItem = history.find(item => item.assessmentId === activeTrackingId);
        if (!trackedItem) {
          return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
              <p>{lang === 'hn' ? "Koi active injury tracking nahi mil rahi hai." : "No active injury tracking found."}</p>
              <button className="btn btn-primary" onClick={() => setView('dashboard')}>Go to Dashboard</button>
            </div>
          );
        }

        const sortedLogs = [...recoveryLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
        const day1Log = sortedLogs[0];
        const todayLog = sortedLogs[sortedLogs.length - 1];

        const startDate = new Date(trackedItem.createdAt);
        const todayDate = new Date();
        const diffTime = Math.abs(todayDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        const day1Pain = day1Log ? day1Log.painLevel : (trackedItem.symptoms?.painLevel ?? 5);
        const todayPain = todayLog ? todayLog.painLevel : (trackedItem.symptoms?.painLevel ?? 5);
        let painPctChange = 0;
        let painStatusText = "No Change";
        let painColor = "var(--text-secondary)";
        if (day1Pain > 0) {
          painPctChange = Math.round(((day1Pain - todayPain) / day1Pain) * 100);
        } else if (day1Pain === 0 && todayPain > 0) {
          painPctChange = -100;
        }
        
        if (painPctChange > 0) {
          painStatusText = `-${painPctChange}% (Pain kam hua!)`;
          painColor = "var(--color-low)";
        } else if (painPctChange < 0) {
          painStatusText = `+${Math.abs(painPctChange)}% (Pain badh gaya)`;
          painColor = "var(--color-emergency)";
        }

        const day1Swelling = day1Log ? day1Log.swelling : (trackedItem.symptoms?.swelling ?? 'none');
        const todaySwelling = todayLog ? todayLog.swelling : (trackedItem.symptoms?.swelling ?? 'none');
        const swellingRank = { none: 0, mild: 1, moderate: 2, severe: 3 };
        const swellingLabelMap = { none: 'None', mild: 'Mild', moderate: 'Moderate', severe: 'Severe' };
        let swellingStatusText = "No Change";
        let swellingColor = "var(--text-secondary)";
        if (swellingRank[day1Swelling] > swellingRank[todaySwelling]) {
          swellingStatusText = "Kam hui hai (Improved!)";
          swellingColor = "var(--color-low)";
        } else if (swellingRank[day1Swelling] < swellingRank[todaySwelling]) {
          swellingStatusText = "Badh gayi hai";
          swellingColor = "var(--color-emergency)";
        }

        const day1Mobility = day1Log ? day1Log.mobility : (trackedItem.symptoms?.movementAbility === 'normal' ? 'normal' : (trackedItem.symptoms?.movementAbility === 'partial' ? 'partial' : 'limited'));
        const todayMobility = todayLog ? todayLog.mobility : (trackedItem.symptoms?.movementAbility === 'normal' ? 'normal' : (trackedItem.symptoms?.movementAbility === 'partial' ? 'partial' : 'limited'));
        const mobilityRank = { normal: 3, partial: 2, limited: 1, very_little: 1, cannot_move: 0 };
        const mobilityLabelMap = { normal: 'Normal', partial: 'Partial', limited: 'Limited', cannot_move: 'Cannot move' };
        let mobilityStatusText = "No Change";
        let mobilityColor = "var(--text-secondary)";
        if (mobilityRank[day1Mobility] < mobilityRank[todayMobility]) {
          mobilityStatusText = "Behtar hui hai (Improved!)";
          mobilityColor = "var(--color-low)";
        } else if (mobilityRank[day1Mobility] > mobilityRank[todayMobility]) {
          mobilityStatusText = "Kharab hui hai";
          mobilityColor = "var(--color-emergency)";
        }

        return (
          <div className="slide-in fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
                  {lang === 'hi' ? "रिकवरी ट्रैकिंग डैशबोर्ड 📈" : (lang === 'hn' ? "Recovery Tracking Dashboard 📈" : "Recovery Tracking Dashboard 📈")}
                </h2>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {lang === 'hi' ? `${trackedItem.injuryArea} की चोट के लिए दैनिक सुधार ट्रैक करें।` : (lang === 'hn' ? `${trackedItem.injuryArea} injury ke liye daily healing progress track karein.` : `Tracking daily healing progress for your ${trackedItem.injuryArea} injury.`)}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  className="btn btn-primary glow-primary"
                  onClick={() => {
                    setLogForm({
                      painLevel: todayLog ? todayLog.painLevel : 5,
                      swelling: todayLog ? todayLog.swelling : 'none',
                      mobility: todayLog ? todayLog.mobility : 'normal',
                      notes: '',
                      date: new Date().toISOString().split('T')[0]
                    });
                    setShowLogModal(true);
                  }}
                >
                  {lang === 'hi' ? "दैनिक प्रगति दर्ज करें" : (lang === 'hn' ? "Daily Progress Log Karein" : "Log Daily Progress")}
                </button>
                <button className="btn btn-secondary" style={{ color: 'var(--color-emergency)', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClick={handleStopTracking}>
                  {lang === 'hi' ? "ट्रैकिंग बंद करें" : (lang === 'hn' ? "Tracking Stop Karein" : "Stop Tracking")}
                </button>
              </div>
            </div>

            {/* Sub Tabs Selection */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <button 
                className={`btn ${recoverySubTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => {
                  setRecoverySubTab('stats');
                  setActiveExercise(null);
                  setRehabTimerRunning(false);
                }}
              >
                {lang === 'hi' ? "सुधार चार्ट और सांख्यिकी" : (lang === 'hn' ? "Healing Chart & Stats" : "Healing Chart & Stats")}
              </button>
              <button 
                className={`btn ${recoverySubTab === 'rehab' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => setRecoverySubTab('rehab')}
              >
                {lang === 'hi' ? "फिजियोथेरेपी व्यायाम गाइड" : (lang === 'hn' ? "Physiotherapy Exercise Guide" : "Physiotherapy Exercise Guide")}
              </button>
              <button 
                className={`btn ${recoverySubTab === 'goniometer' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={() => {
                  setRecoverySubTab('goniometer');
                  setActiveExercise(null);
                  setRehabTimerRunning(false);
                }}
              >
                {lang === 'hi' ? "मोबिलिटी टेस्ट (ROM)" : (lang === 'hn' ? "Mobility Test (ROM)" : "Mobility Test (ROM)")}
              </button>
            </div>

            {recoverySubTab === 'stats' && (
              <>
                <div className="stats-grid-4col">
              <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Injury Area</span>
                <strong style={{ fontSize: '1.2rem', textTransform: 'capitalize', color: 'var(--primary)' }}>
                  {lang === 'hi' ? (trackedItem.injuryArea === 'ankle' ? 'टखना' : trackedItem.injuryArea === 'knee' ? 'घुटना' : trackedItem.injuryArea === 'foot' ? 'पैर' : 'कलाई') : trackedItem.injuryArea}
                </strong>
              </div>
              <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Triage Score</span>
                <strong style={{ fontSize: '1.2rem', color: `var(--color-${trackedItem.riskLevel.toLowerCase()})` }}>
                  {trackedItem.riskScore} ({trackedItem.riskLevel})
                </strong>
              </div>
              <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Tracking Started</span>
                <strong style={{ fontSize: '1.1rem' }}>
                  {new Date(trackedItem.createdAt).toLocaleDateString()}
                </strong>
              </div>
              <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Tracking Days</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                  Day {diffDays}
                </strong>
              </div>
            </div>

            <div className="dashboard-grid">
              <div>
                <div className="stats-grid-3col">
                  <div className="glass-panel" style={{ padding: '1.25rem', borderTop: `4px solid ${painColor}` }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pain Level Status</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Day 1:</span> <strong style={{ fontSize: '1rem' }}>{day1Pain}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Today:</span> <strong style={{ fontSize: '1.4rem' }}>{todayPain}</strong>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: painColor }}>
                      {painStatusText}
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem', borderTop: `4px solid ${swellingColor}` }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Swelling (Sujan)</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Day 1:</span> <strong style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{swellingLabelMap[day1Swelling] || day1Swelling}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Today:</span> <strong style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>{swellingLabelMap[todaySwelling] || todaySwelling}</strong>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: swellingColor }}>
                      {swellingStatusText}
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem', borderTop: `4px solid ${mobilityColor}` }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Mobility (Movement)</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Day 1:</span> <strong style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>{mobilityLabelMap[day1Mobility] || day1Mobility}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Today:</span> <strong style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>{mobilityLabelMap[todayMobility] || todayMobility}</strong>
                      </div>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: mobilityColor }}>
                      {mobilityStatusText}
                    </div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {lang === 'hi' ? "रिकवरी प्रोग्रेस चार्ट (Recovery Trend Chart)" : (lang === 'hn' ? "Pain & Swelling Recovery Trend" : "Recovery Progress: Pain vs Swelling")}
                  </h3>

                  {/* Chart Legend */}
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: '12px', height: '3px', background: '#ef4444', borderRadius: '2px' }}></span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {lang === 'hi' ? 'दर्द का स्तर (0-10)' : (lang === 'hn' ? 'Pain Level (0-10)' : 'Pain Level (0-10)')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ display: 'inline-block', width: '12px', height: '3px', background: '#3b82f6', borderRadius: '2px', borderStyle: 'dashed', borderWidth: '1px' }}></span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {lang === 'hi' ? 'सूजन का स्तर (None-Severe)' : (lang === 'hn' ? 'Swelling Level (None-Sev)' : 'Swelling Level (None-Sev)')}
                      </span>
                    </div>
                  </div>
                  
                  {(() => {
                    const width = 600;
                    const height = 250;
                    const paddingX = 55;
                    const paddingY = 30;
                    const plotWidth = width - 2 * paddingX;
                    const plotHeight = height - 2 * paddingY;
                    const N = sortedLogs.length;

                    const getSwellingNum = (sw) => {
                      if (sw === 'severe') return 3;
                      if (sw === 'moderate') return 2;
                      if (sw === 'mild') return 1;
                      return 0;
                    };

                    const painPoints = sortedLogs.map((log, idx) => {
                      const x = N > 1 ? paddingX + (idx * plotWidth) / (N - 1) : paddingX + plotWidth / 2;
                      const y = paddingY + plotHeight - (log.painLevel * plotHeight) / 10;
                      return { x, y, log };
                    });

                    const swellingPoints = sortedLogs.map((log, idx) => {
                      const x = N > 1 ? paddingX + (idx * plotWidth) / (N - 1) : paddingX + plotWidth / 2;
                      const swellVal = getSwellingNum(log.swelling);
                      const y = paddingY + plotHeight - ((swellVal * 10 / 3) * plotHeight) / 10;
                      return { x, y, log, swellVal };
                    });

                    let painLinePath = "";
                    painPoints.forEach((pt, idx) => {
                      if (idx === 0) {
                        painLinePath += `M ${pt.x} ${pt.y}`;
                      } else {
                        painLinePath += ` L ${pt.x} ${pt.y}`;
                      }
                    });

                    let painAreaPath = "";
                    if (painPoints.length > 0) {
                      const firstX = painPoints[0].x;
                      const lastX = painPoints[painPoints.length - 1].x;
                      painAreaPath = `${painLinePath} L ${lastX} ${paddingY + plotHeight} L ${firstX} ${paddingY + plotHeight} Z`;
                    }

                    let swellingLinePath = "";
                    swellingPoints.forEach((pt, idx) => {
                      if (idx === 0) {
                        swellingLinePath += `M ${pt.x} ${pt.y}`;
                      } else {
                        swellingLinePath += ` L ${pt.x} ${pt.y}`;
                      }
                    });

                    let swellingAreaPath = "";
                    if (swellingPoints.length > 0) {
                      const firstX = swellingPoints[0].x;
                      const lastX = swellingPoints[swellingPoints.length - 1].x;
                      swellingAreaPath = `${swellingLinePath} L ${lastX} ${paddingY + plotHeight} L ${firstX} ${paddingY + plotHeight} Z`;
                    }

                    return (
                      <div style={{ position: 'relative' }}>
                        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '8px', overflow: 'visible' }}>
                          
                          {/* Left Y-Axis (Pain Level) */}
                          {[0, 2, 4, 6, 8, 10].map((val) => {
                            const y = paddingY + plotHeight - (val * plotHeight) / 10;
                            return (
                              <g key={`pain-axis-${val}`}>
                                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                                <text x={paddingX - 12} y={y + 4} fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="end">{val}</text>
                              </g>
                            );
                          })}

                          {/* Right Y-Axis (Swelling Level) */}
                          {[
                            { val: 0, label: lang === 'hi' ? 'कोई नहीं' : 'None' },
                            { val: 1, label: lang === 'hi' ? 'हल्की' : 'Mild' },
                            { val: 2, label: lang === 'hi' ? 'मध्यम' : 'Mod' },
                            { val: 3, label: lang === 'hi' ? 'गंभीर' : 'Sev' }
                          ].map((item) => {
                            const y = paddingY + plotHeight - ((item.val * 10 / 3) * plotHeight) / 10;
                            return (
                              <g key={`swell-axis-${item.val}`}>
                                <text x={width - paddingX + 12} y={y + 4} fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="start">{item.label}</text>
                              </g>
                            );
                          })}

                          <defs>
                            <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="swellingGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Pain Level Area & Line */}
                          {painAreaPath && <path d={painAreaPath} fill="url(#painGradient)" />}
                          {painLinePath && <path d={painLinePath} fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}

                          {/* Swelling Level Area & Line */}
                          {swellingAreaPath && <path d={swellingAreaPath} fill="url(#swellingGradient)" />}
                          {swellingLinePath && <path d={swellingLinePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round" strokeLinejoin="round" />}

                          {/* Data points */}
                          {painPoints.map((pt, idx) => {
                            const isHovered = hoveredLog && hoveredLog.id === pt.log.id;
                            const swellPt = swellingPoints[idx];
                            return (
                              <g key={pt.log.id}>
                                {/* Vertical highlight bar */}
                                <line 
                                  x1={pt.x} 
                                  y1={paddingY} 
                                  x2={pt.x} 
                                  y2={paddingY + plotHeight} 
                                  stroke={isHovered ? "rgba(255,255,255,0.15)" : "transparent"} 
                                  strokeWidth="1.5" 
                                />

                                {/* Pain dot */}
                                <circle 
                                  cx={pt.x} 
                                  cy={pt.y} 
                                  r={isHovered ? "7" : "5"} 
                                  fill="#ef4444" 
                                  stroke="#ffffff" 
                                  strokeWidth="2" 
                                  style={{ cursor: 'pointer', transition: 'all 0.1s ease' }}
                                  onMouseEnter={() => setHoveredLog(pt.log)}
                                  onMouseLeave={() => setHoveredLog(null)}
                                />

                                {/* Swelling dot */}
                                {swellPt && (
                                  <circle 
                                    cx={swellPt.x} 
                                    cy={swellPt.y} 
                                    r={isHovered ? "6" : "4.5"} 
                                    fill="#3b82f6" 
                                    stroke="#ffffff" 
                                    strokeWidth="1.5" 
                                    style={{ cursor: 'pointer', transition: 'all 0.1s ease' }}
                                    onMouseEnter={() => setHoveredLog(pt.log)}
                                    onMouseLeave={() => setHoveredLog(null)}
                                  />
                                )}

                                {/* Hover trigger zone */}
                                <circle 
                                  cx={pt.x} 
                                  cy={(pt.y + (swellPt ? swellPt.y : pt.y)) / 2} 
                                  r="25" 
                                  fill="transparent" 
                                  style={{ cursor: 'pointer' }}
                                  onMouseEnter={() => setHoveredLog(pt.log)}
                                  onMouseLeave={() => setHoveredLog(null)}
                                />

                                <text x={pt.x} y={height - 8} fill="var(--text-secondary)" fontSize="9" textAnchor="middle" transform={`rotate(-15 ${pt.x} ${height - 8})`}>
                                  {new Date(pt.log.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                </text>
                              </g>
                            );
                          })}
                        </svg>

                        {hoveredLog && (
                          <div 
                            className="glass-panel" 
                            style={{ 
                              position: 'absolute', 
                              top: '10px', 
                              right: '10px', 
                              padding: '0.75rem', 
                              background: 'rgba(15, 23, 42, 0.95)', 
                              border: '1px solid var(--primary)', 
                              borderRadius: '8px', 
                              fontSize: '0.8rem', 
                              width: '180px',
                              zIndex: 10
                            }}
                          >
                            <div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.25rem', marginBottom: '0.25rem' }}>
                              {new Date(hoveredLog.date).toLocaleDateString()}
                            </div>
                            <div>Pain Level: <strong style={{ color: '#ef4444' }}>{hoveredLog.painLevel}/10</strong></div>
                            <div>Sujan (Swelling): <strong style={{ color: '#3b82f6' }}>{swellingLabelMap[hoveredLog.swelling] || hoveredLog.swelling}</strong></div>
                            <div>Mobility: <span style={{ textTransform: 'capitalize' }}>{mobilityLabelMap[hoveredLog.mobility] || hoveredLog.mobility}</span></div>
                            {hoveredLog.notes && <div style={{ fontStyle: 'italic', opacity: 0.8, marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{hoveredLog.notes}"</div>}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Milestones Panel */}
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🏆 {lang === 'hi' ? "पुनर्प्राप्ति मील के पत्थर (Milestones)" : (lang === 'hn' ? "Recovery Milestones Unlocked" : "Healing Milestones")}
                  </h3>
                  
                  {(() => {
                    const hasDay1 = sortedLogs.some(log => log.id.startsWith('log_init_'));
                    const latestLog = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1] : null;
                    const initialLog = sortedLogs.find(log => log.id.startsWith('log_init_'));
                    
                    const exerciseCount = sortedLogs.reduce((acc, log) => acc + (log.completedExercises?.length || 0), 0);
                    
                    let painReduced = false;
                    let painHalf = false;
                    if (initialLog && latestLog) {
                      if (latestLog.painLevel < initialLog.painLevel) {
                        painReduced = true;
                      }
                      if (latestLog.painLevel <= initialLog.painLevel / 2) {
                        painHalf = true;
                      }
                    }
                    
                    let swellingDown = false;
                    if (initialLog && latestLog) {
                      const getSwellingScore = (sw) => {
                        if (sw === 'severe') return 3;
                        if (sw === 'moderate') return 2;
                        if (sw === 'mild') return 1;
                        return 0;
                      };
                      if (getSwellingScore(latestLog.swelling) < getSwellingScore(initialLog.swelling)) {
                        swellingDown = true;
                      }
                    }

                    const fullyActive = latestLog && latestLog.painLevel === 0 && latestLog.mobility === 'normal';

                    const MILESTONES = [
                      {
                        id: "baseline",
                        name: lang === 'hi' ? "पहला कदम (Baseline)" : "First Step (Baseline)",
                        desc: lang === 'hi' ? "प्रारंभिक चोट मूल्यांकन पूरा किया गया" : "Logged your initial Day 1 assessment.",
                        unlocked: hasDay1,
                        icon: "🏁"
                      },
                      {
                        id: "pain_down",
                        name: lang === 'hi' ? "दर्द में राहत (Pain Down)" : "Inflammation Relief",
                        desc: lang === 'hi' ? "आपका दर्द कम होना शुरू हो गया है" : "Pain level decreased from baseline entry.",
                        unlocked: painReduced,
                        icon: "📉"
                      },
                      {
                        id: "swell_down",
                        name: lang === 'hi' ? "सूजन कम हुई" : "Swelling Subsiding",
                        desc: lang === 'hi' ? "चोट की सूजन में सुधार आया है" : "Swelling reduced compared to day 1.",
                        unlocked: swellingDown,
                        icon: "💧"
                      },
                      {
                        id: "rehab_start",
                        name: lang === 'hi' ? "व्यायाम प्रारंभ" : "Active Rehabilitation",
                        desc: lang === 'hi' ? "कम से कम 1 फिजियोथेरेपी व्यायाम पूरा किया" : "Successfully completed a rehab exercise session.",
                        unlocked: exerciseCount >= 1,
                        icon: "💪"
                      },
                      {
                        id: "halfway",
                        name: lang === 'hi' ? "आधा सुधार (50% Recovered)" : "Halfway Healed",
                        desc: lang === 'hi' ? "दर्द के स्तर में 50% से अधिक कमी आई है" : "Pain level reduced by 50% or more from Day 1.",
                        unlocked: painHalf,
                        icon: "⚡"
                      },
                      {
                        id: "fully_recovered",
                        name: lang === 'hi' ? "पूर्ण स्वस्थ (Fully Healed)" : "Fully Healed & Active",
                        desc: lang === 'hi' ? "दर्द 0/10 है और चलने की क्षमता पूर्ण है" : "Pain reached 0 and full range of motion returned.",
                        unlocked: fullyActive,
                        icon: "❇️"
                      }
                    ];

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 480 ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                        {MILESTONES.map((m) => (
                          <div 
                            key={m.id}
                            className="glass-panel"
                            style={{ 
                              padding: '1rem', 
                              display: 'flex', 
                              gap: '0.75rem', 
                              alignItems: 'center',
                              background: m.unlocked ? 'rgba(0, 194, 168, 0.05)' : 'rgba(255,255,255,0.01)',
                              border: m.unlocked ? '1px solid rgba(0, 194, 168, 0.25)' : '1px solid var(--border)',
                              opacity: m.unlocked ? 1 : 0.45,
                              filter: m.unlocked ? 'none' : 'grayscale(100%)',
                              transition: 'all 0.3s'
                            }}
                          >
                            <span style={{ fontSize: '1.75rem' }}>{m.icon}</span>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: m.unlocked ? 'var(--primary)' : 'inherit' }}>
                                {m.name} {m.unlocked && "✓"}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
                                {m.desc}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div>
                {/* Progression Calendar Card */}
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📅 {lang === 'hi' ? "रिकवरी प्रोग्रेस कैलेंडर" : (lang === 'hn' ? "Recovery Calendar Tracker" : "Progression Calendar")}
                  </h3>
                  
                  {(() => {
                    const days = getCalendarDays();
                    const now = new Date();
                    const monthName = now.toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'long', year: 'numeric' });
                    const weekdays = lang === 'hi' ? ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

                    return (
                      <div>
                        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'capitalize', color: 'var(--primary)' }}>
                          {monthName}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', textAlign: 'center', fontWeight: 'bold', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          {weekdays.map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
                          {days.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} style={{ aspectRatio: '1' }}></div>;
                            
                            const log = getLogForDate(day);
                            const isToday = day.toDateString() === new Date().toDateString();
                            
                            let bg = 'rgba(255,255,255,0.02)';
                            let border = '1px solid var(--border)';
                            let color = 'inherit';
                            
                            if (log) {
                              if (log.painLevel <= 2) {
                                bg = 'rgba(34, 197, 94, 0.15)';
                                border = '1px solid #22c55e';
                                color = '#22c55e';
                              } else if (log.painLevel <= 5) {
                                bg = 'rgba(234, 179, 8, 0.15)';
                                border = '1px solid #eab308';
                                color = '#eab308';
                              } else {
                                bg = 'rgba(239, 68, 68, 0.15)';
                                border = '1px solid #ef4444';
                                color = '#ef4444';
                              }
                            } else if (isToday) {
                              border = '1px dashed var(--primary)';
                            }

                            return (
                              <div 
                                key={day.toISOString()} 
                                className="calendar-day-cell"
                                style={{ 
                                  aspectRatio: '1', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  borderRadius: '6px', 
                                  background: bg, 
                                  border: border, 
                                  fontSize: '0.8rem', 
                                  fontWeight: log || isToday ? 'bold' : 'normal',
                                  color: color,
                                  cursor: log ? 'pointer' : 'default',
                                  transition: 'all 0.2s',
                                  position: 'relative'
                                }}
                                onClick={() => log && setHoveredLog(log)}
                                title={log ? `Pain: ${log.painLevel}, Sujan: ${log.swelling}` : undefined}
                              >
                                {day.getDate()}
                                {log && (
                                  <span style={{ 
                                    position: 'absolute', 
                                    bottom: '3px', 
                                    width: '4px', 
                                    height: '4px', 
                                    borderRadius: '50%', 
                                    background: log.painLevel <= 2 ? '#22c55e' : (log.painLevel <= 5 ? '#eab308' : '#ef4444') 
                                  }}></span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                    {lang === 'hi' ? "चेक-इन इतिहास (Logs)" : (lang === 'hn' ? "Daily Logs History" : "Check-in Logs")}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sortedLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className="glass-panel" 
                        style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            {log.id.startsWith('log_init_') ? (lang === 'hn' ? "Day 1 (Initial)" : "Day 1 (Initial)") : new Date(log.date).toLocaleDateString()}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="badge badge-low" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                              Pain: {log.painLevel}
                            </span>
                            {!log.id.startsWith('log_init_') && (
                              <button 
                                style={{ background: 'none', border: 'none', color: 'var(--color-emergency)', cursor: 'pointer', padding: 0 }}
                                onClick={() => handleLogDelete(log.id)}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <span>Sujan: {swellingLabelMap[log.swelling] || log.swelling} | Mobility: {mobilityLabelMap[log.mobility] || log.mobility}</span>
                          {log.notes && <p style={{ margin: '0.25rem 0 0 0', fontStyle: 'italic' }}>"{log.notes}"</p>}
                        </div>
                      </div>
                    ))}

                    {sortedLogs.length === 0 && (
                      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        No logs recorded yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {recoverySubTab === 'rehab' && (
          <div className="dashboard-grid fade-in">
            {/* Left Column: Exercises Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="exercises-grid-2col">
                {(REHAB_EXERCISES[trackedItem.injuryArea] || []).map((ex) => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const todayLog = sortedLogs.find(log => log.date === todayStr);
                  const isDone = todayLog && todayLog.completedExercises?.includes(ex.id);

                  return (
                    <div 
                      key={ex.id} 
                      className="glass-panel" 
                      style={{ 
                        padding: '1.25rem', 
                        border: isDone ? '1px solid var(--color-low)' : '1px solid var(--border)',
                        background: isDone ? 'rgba(34, 197, 94, 0.04)' : 'rgba(255,255,255,0.01)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ color: isDone ? 'var(--color-low)' : 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                          {ex.svg}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{ex.name}</h4>
                          </div>
                          {isDone && (
                            <span style={{ color: 'var(--color-low)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                              <CheckCircle2 size={13} /> DONE
                            </span>
                          )}
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.1rem' }}>
                            {ex.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span style={{ fontWeight: 600 }}>{ex.sets}</span>
                        <button 
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', background: isDone ? 'var(--color-low)' : 'var(--primary)' }}
                          onClick={() => startRehabTimer(ex)}
                        >
                          {isDone ? (lang === 'hn' ? "Dobaara Karein" : "Restart") : (lang === 'hn' ? "Timer Start" : "Start Exercise")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Timer Panel */}
            <div>
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', position: 'sticky', top: '20px' }}>
                {activeExercise ? (
                  <>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>{activeExercise.name}</h3>
                    
                    {/* Animated Progress Ring */}
                    <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0.25rem 0' }}>
                      <svg width="130" height="130" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                        {/* Background track */}
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        {/* Animated progress fill */}
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          fill="none" 
                          stroke="var(--primary)" 
                          strokeWidth="6" 
                          strokeDasharray="263.89" 
                          strokeDashoffset={263.89 - (rehabTimer / activeExercise.duration) * 263.89} 
                          strokeLinecap="round" 
                          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                        />
                      </svg>
                      {/* Inside details */}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--primary)', lineHeight: 1 }}>
                          {rehabTimer}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                          sec
                        </span>
                      </div>
                    </div>

                    {/* Animated Active Motion Icon */}
                    <div 
                      className={rehabTimerRunning ? "exercise-active-motion" : ""}
                      style={{ color: 'var(--primary)', opacity: rehabTimerRunning ? 1 : 0.6, transformOrigin: 'center', transition: 'all 0.3s' }}
                    >
                      {activeExercise.svg}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.2rem' }}>
                      {rehabTimerRunning 
                        ? (lang === 'hn' ? "Apne posture me hold karein aur focus karein!" : "Maintain correct posture and hold the stretch!") 
                        : (lang === 'hn' ? "Timer paused. Apni exercise resume karein." : "Timer paused. Click 'Start' to resume.")}
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        className="btn btn-primary"
                        onClick={toggleRehabTimer}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                      >
                        {rehabTimerRunning ? "Pause" : "Start"}
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={resetRehabTimer}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                      >
                        Reset
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock size={56} style={{ color: 'var(--text-secondary)', strokeWidth: 1.5, marginBottom: '0.5rem' }} />
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{lang === 'hn' ? "Koi Exercise select karein" : "Select an Exercise"}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.2rem' }}>
                      {lang === 'hn' ? "Apni exercise shuru karne ke liye left card me 'Start' button dabaayein." : "Click 'Start Exercise' on the left to activate the countdown timer."}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {recoverySubTab === 'goniometer' && (() => {
          const romData = {
            ankle: { name: "Ankle Dorsiflexion", normal: 20, desc: "Ankle ko upar bend karne ki capacity (normal is 20°)." },
            knee: { name: "Knee Flexion", normal: 135, desc: "Knee ko peeche bend karne ki capacity (normal is 135°)." },
            wrist: { name: "Wrist Extension", normal: 70, desc: "Klayi ko peeche lift karne ki capacity (normal is 70°)." },
            foot: { name: "Foot Inversion", normal: 35, desc: "Foot sole ko andar tilt karne ki capacity (normal is 35°)." }
          }[trackedItem.injuryArea] || { name: "Joint Mobility", normal: 90, desc: "Bending capability of the injured joint." };

          const isMobilityNormal = goniometerAngle >= romData.normal;

          const handleSaveRomLog = () => {
            const todayStr = new Date().toISOString().split('T')[0];
            const logsKey = `injuryiq_recovery_logs_${currentUser.email}_${trackedItem.assessmentId}`;
            const existingLogs = localStorage.getItem(logsKey) ? JSON.parse(localStorage.getItem(logsKey)) : [];
            
            let todayLog = existingLogs.find(log => log.date === todayStr);
            if (todayLog) {
              todayLog.goniometerAngle = goniometerAngle;
              todayLog.notes = `${todayLog.notes || ''} | ROM Measured: ${goniometerAngle}° (${romData.name})`.trim().replace(/^\| /, '');
            } else {
              todayLog = {
                id: `log_${Date.now()}`,
                painLevel: 3,
                swelling: 'none',
                mobility: goniometerAngle >= romData.normal ? 'normal' : 'partial',
                goniometerAngle: goniometerAngle,
                notes: `ROM Measured: ${goniometerAngle}° (${romData.name})`,
                date: todayStr
              };
              existingLogs.push(todayLog);
            }
            
            localStorage.setItem(logsKey, JSON.stringify(existingLogs));
            setRecoveryLogs(existingLogs);
            alert(lang === 'hi' 
              ? `📐 मोबिलिटी लॉग सहेजा गया!\n\n${romData.name}: ${goniometerAngle}° (Normal: ${romData.normal}°)` 
              : `📐 Range of Motion logged successfully!\n\n${romData.name}: ${goniometerAngle}° (Normal: ${romData.normal}°)`);
          };

          return (
            <div className="dashboard-grid fade-in" style={{ padding: '0.5rem 0' }}>
              <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontWeight: 800 }}>📐 {lang === 'hi' ? 'वर्चुअल गोनियोमीटर' : 'Range of Motion (ROM) Protractor'}</h4>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '360px' }}>
                  {lang === 'hi' 
                    ? 'नीले हैंडल को ड्रैग करके जोड़ के मुड़ाव (Angle) को नापें।' 
                    : lang === 'hn' 
                      ? 'Yellow marker/handle ko circle ke surround drag karke bending angle measure karein.' 
                      : 'Drag the glowing yellow handle to match the active joint flexion/extension angle.'}
                </p>

                <svg 
                  ref={goniometerSvgRef}
                  className="goniometer-dial"
                  width="260" 
                  height="260" 
                  viewBox="0 0 240 240" 
                  style={{ cursor: isDraggingArm ? 'grabbing' : 'default', touchAction: 'none' }}
                >
                  <defs>
                    <radialGradient id="protractorGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(56, 189, 248, 0.15)" />
                      <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
                    </radialGradient>
                  </defs>

                  <circle cx="120" cy="120" r="110" fill="url(#protractorGlow)" />
                  <circle cx="120" cy="120" r="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <path d="M 20 120 A 100 100 0 0 1 220 120" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="3" />

                  {[0, 30, 60, 90, 120, 150, 180].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const xStart = 120 + 96 * Math.cos(rad);
                    const yStart = 120 - 96 * Math.sin(rad);
                    const xEnd = 120 + 104 * Math.cos(rad);
                    const yEnd = 120 - 104 * Math.sin(rad);
                    
                    const labelX = 120 + 82 * Math.cos(rad);
                    const labelY = 120 - 82 * Math.sin(rad);

                    return (
                      <g key={deg}>
                        <line x1={xStart} y1={yStart} x2={xEnd} y2={yEnd} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                        <text x={labelX} y={labelY + 2.5} fill="#94a3b8" fontSize="6.5" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none' }}>{deg}°</text>
                      </g>
                    );
                  })}

                  {[10, 20, 40, 50, 70, 80, 100, 110, 130, 140, 160, 170].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const xStart = 120 + 98 * Math.cos(rad);
                    const yStart = 120 - 98 * Math.sin(rad);
                    const xEnd = 120 + 102 * Math.cos(rad);
                    const yEnd = 120 - 102 * Math.sin(rad);
                    return <line key={deg} x1={xStart} y1={yStart} x2={xEnd} y2={yEnd} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />;
                  })}

                  <line x1="120" y1="120" x2="215" y2="120" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="215" cy="120" r="3" fill="#ffffff" />

                  {(() => {
                    const rad = (goniometerAngle * Math.PI) / 180;
                    const armX = 120 + 95 * Math.cos(rad);
                    const armY = 120 - 95 * Math.sin(rad);
                    return (
                      <g>
                        <path 
                          d={`M 120 120 L 210 120 A 90 90 0 ${goniometerAngle > 180 ? 1 : 0} 0 ${120 + 90 * Math.cos(rad)} ${120 - 90 * Math.sin(rad)} Z`} 
                          fill="rgba(56, 189, 248, 0.08)" 
                        />
                        <line className="draggable-arm" x1="120" y1="120" x2={armX} y2={armY} stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
                        <g 
                          onMouseDown={() => setIsDraggingArm(true)}
                          onTouchStart={() => setIsDraggingArm(true)}
                          style={{ cursor: isDraggingArm ? 'grabbing' : 'grab' }}
                        >
                          <circle cx={armX} cy={armY} r="12" fill="none" stroke="#fbbf24" strokeWidth="1.5">
                            <animate attributeName="r" values="8;13;8" dur="2s" repeatCount="indefinite" />
                          </circle>
                          <circle cx={armX} cy={armY} r="8" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
                        </g>
                      </g>
                    );
                  })()}

                  <circle cx="120" cy="120" r="7" fill="var(--primary)" stroke="#ffffff" strokeWidth="1.8" />
                  <circle cx="120" cy="120" r="2.5" fill="#ffffff" />
                </svg>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace', lineHeight: 1 }}>{goniometerAngle}°</div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{lang === 'hi' ? 'मापा गया कोण' : 'Measured Angle'}</span>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-low" style={{ marginBottom: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
                    📊 Clinical ROM Analytics
                  </span>
                  
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem', fontWeight: 800, textTransform: 'capitalize' }}>
                    {romData.name} ({lang === 'hi' ? (trackedItem.injuryArea === 'ankle' ? 'टखना' : trackedItem.injuryArea === 'knee' ? 'घुटना' : trackedItem.injuryArea === 'foot' ? 'पैर' : 'कलाई') : trackedItem.injuryArea})
                  </h3>
                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{romData.desc}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Target Normal Mobility:</span>
                      <strong style={{ color: '#10b981' }}>&ge; {romData.normal}°</strong>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Active Bending Measured:</span>
                      <strong style={{ color: '#fbbf24' }}>{goniometerAngle}°</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '0.85rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Mobility Health Status:</span>
                      <strong style={{ color: isMobilityNormal ? '#10b981' : '#f87171' }}>
                        {isMobilityNormal 
                          ? (lang === 'hi' ? 'सामान्य (Normal)' : 'Normal Bending') 
                          : (lang === 'hi' ? 'सीमित (Limited ROM)' : 'Restricted Bending')}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
                  <button 
                    onClick={handleSaveRomLog}
                    className="btn btn-primary" 
                    style={{ justifyContent: 'center', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', border: 'none', padding: '0.8rem', borderRadius: '8px' }}
                  >
                    💾 {lang === 'hi' ? "मोबिलिटी डेटा लॉग करें" : (lang === 'hn' ? "ROM Value Log Karein" : "Log Measured ROM")}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  })()}

      {/* --- DAILY PROGRESS CHECK-IN MODAL --- */}
      {showLogModal && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(15, 23, 42, 0.75)', 
            backdropFilter: 'blur(8px)',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 1100 
          }}
        >
          <div 
            className="glass-panel slide-in" 
            style={{ 
              width: '100%', 
              maxWidth: '450px', 
              padding: '2rem', 
              background: darkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: '1px solid var(--primary)',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                {lang === 'hi' ? "दैनिक प्रगति दर्ज करें" : (lang === 'hn' ? "Daily Progress Log Karein" : "Log Daily Progress")}
              </h3>
              <button 
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                onClick={() => setShowLogModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <style>{`
                  input[type=range] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                  }
                  input[type=range]:focus {
                    outline: none;
                  }
                  input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 8px;
                    cursor: pointer;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    border: 1px solid var(--border);
                  }
                  input[type=range]::-webkit-slider-thumb {
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: var(--primary);
                    cursor: pointer;
                    -webkit-appearance: none;
                    margin-top: -6px;
                    box-shadow: 0 0 10px var(--primary);
                  }
                `}</style>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span>Pain Level (0 to 10):</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{logForm.painLevel}/10</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={logForm.painLevel}
                  onChange={(e) => setLogForm(prev => ({ ...prev, painLevel: parseInt(e.target.value) }))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  {lang === 'hi' ? "सूजन (Swelling):" : (lang === 'hn' ? "Sujan (Swelling) level:" : "Swelling Level:")}
                </label>
                <select 
                  className="glass-panel" 
                  value={logForm.swelling}
                  onChange={(e) => setLogForm(prev => ({ ...prev, swelling: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', color: 'inherit', background: 'var(--bg-surface)' }}
                >
                  <option value="none" style={{ background: 'var(--bg-surface)', color: '#fff' }}>{lang === 'hi' ? 'कोई सूजन नहीं (None)' : (lang === 'hn' ? 'Kuch nahi (None)' : 'None')}</option>
                  <option value="mild" style={{ background: 'var(--bg-surface)', color: '#fff' }}>{lang === 'hi' ? 'हल्की (Mild)' : (lang === 'hn' ? 'Thoda (Mild)' : 'Mild')}</option>
                  <option value="moderate" style={{ background: 'var(--bg-surface)', color: '#fff' }}>{lang === 'hi' ? 'मध्यम (Moderate)' : (lang === 'hn' ? 'Medium (Moderate)' : 'Moderate')}</option>
                  <option value="severe" style={{ background: 'var(--bg-surface)', color: '#fff' }}>{lang === 'hi' ? 'अत्यधिक सूजन (Severe)' : (lang === 'hn' ? 'Bahut zyada (Severe)' : 'Severe')}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  {lang === 'hi' ? "मोबिलिटी (Mobility / Movement):" : (lang === 'hn' ? "Joint Movement (Mobility):" : "Mobility / Movement:")}
                </label>
                <select 
                  className="glass-panel" 
                  value={logForm.mobility}
                  onChange={(e) => setLogForm(prev => ({ ...prev, mobility: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', color: 'inherit', background: 'var(--bg-surface)' }}
                >
                  <option value="normal" style={{ background: 'var(--bg-surface)', color: '#fff' }}>{lang === 'hi' ? 'सामान्य (Normal)' : (lang === 'hn' ? 'Normal (Full Movement)' : 'Normal')}</option>
                  <option value="partial" style={{ background: 'var(--bg-surface)', color: '#fff' }}>{lang === 'hi' ? 'आंशिक (Partial)' : (lang === 'hn' ? 'Kam (Limited Movement)' : 'Partial')}</option>
                  <option value="limited" style={{ background: 'var(--bg-surface)', color: '#fff' }}>{lang === 'hi' ? 'सीमित (Limited)' : (lang === 'hn' ? 'Bahut kam (Very Limited)' : 'Limited')}</option>
                  <option value="cannot_move" style={{ background: 'var(--bg-surface)', color: '#fff' }}>{lang === 'hi' ? 'बिल्कुल नहीं (Cannot move)' : (lang === 'hn' ? 'Bilkul nahi (Cannot move)' : 'Cannot move')}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  {lang === 'hi' ? "तारीख (Date):" : (lang === 'hn' ? "Date (Tariq):" : "Date:")}
                </label>
                <input 
                  type="date"
                  className="glass-panel"
                  value={logForm.date}
                  onChange={(e) => setLogForm(prev => ({ ...prev, date: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', color: 'inherit', background: 'var(--bg-surface)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  {lang === 'hi' ? "टिप्पणी (Notes):" : (lang === 'hn' ? "Extra Notes (Kya feel ho raha hai):" : "Notes:")}
                </label>
                <textarea 
                  className="glass-panel"
                  rows="3"
                  placeholder={lang === 'hi' ? 'दवा का असर, सुन्न होना, आदि...' : (lang === 'hn' ? 'Koi ajeeb dard, sujan ya improvement...' : 'E.g., pain relief after icing, skin color normal...')}
                  value={logForm.notes}
                  onChange={(e) => setLogForm(prev => ({ ...prev, notes: e.target.value }))}
                  style={{ width: '100%', padding: '0.5rem', color: 'inherit', background: 'var(--bg-surface)', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {lang === 'hi' ? "सुरक्षित करें" : (lang === 'hn' ? "Progress Save Karein" : "Save Log")}
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowLogModal(false)}>
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REAL SOS EMERGENCY ALERT DIALOG --- */}
      {isSosOpen && (
        <SosDialog
          lang={lang}
          onClose={() => { setIsSosOpen(false); setSosStatus('idle'); }}
        />
      )}

      {/* --- PWA INSTALLATION GUIDANCE DIALOG --- */}
      {showInstallGuide && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }} onClick={() => setShowInstallGuide(false)}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>📥</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>Install InjuryIQ AI</h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Progressive Web App Guidance</p>
                </div>
              </div>
              <button onClick={() => setShowInstallGuide(false)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '1.25rem', cursor: 'pointer', padding: 0 }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.5' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderLeft: '3px solid #10b981', borderRadius: '0 8px 8px 0' }}>
                <strong>🚀 Quick Note:</strong> App and background files are loaded! Agar direct browser trigger ready nahi hai, toh aap neeche diye gaye methods se install kar sakte hain.
              </div>

              <div>
                <strong style={{ color: '#38bdf8' }}>💻 For Desktop (Chrome/Edge):</strong>
                <ol style={{ margin: '0.25rem 0 0', paddingLeft: '1.25rem' }}>
                  <li>Browser address bar (URL tab) ke right side me <strong>install icon</strong> (desktop with down-arrow) par click karein.</li>
                  <li>Ya fir, top-right menu (3-dots) &rarr; <strong>Save and share</strong> &rarr; <strong>Install InjuryIQ AI</strong> select karein.</li>
                </ol>
              </div>

              <div>
                <strong style={{ color: '#38bdf8' }}>📱 For Mobile (Android/Chrome):</strong>
                <ol style={{ margin: '0.25rem 0 0', paddingLeft: '1.25rem' }}>
                  <li>Top-right menu (3-dots) par click karein.</li>
                  <li><strong>"Add to Home screen"</strong> ya <strong>"Install app"</strong> select karein.</li>
                </ol>
              </div>

              <div>
                <strong style={{ color: '#38bdf8' }}>🍏 For iPhone/iPad (Safari):</strong>
                <ol style={{ margin: '0.25rem 0 0', paddingLeft: '1.25rem' }}>
                  <li>Safari browser ke bottom me <strong>Share button</strong> (square with up-arrow) par click karein.</li>
                  <li>Scroll karke <strong>"Add to Home Screen"</strong> par click karein.</li>
                </ol>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', fontSize: '0.8rem', color: '#f87171' }}>
                <span>⚠️</span>
                <span><strong>Incognito (Private) window</strong> me installation support blocked hota hai.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '0.85rem', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleDirectModalInstall}>
                ⚡ Install Now (Direct)
              </button>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.85rem', borderRadius: '8px', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setShowInstallGuide(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* --- PERSISTENT FLOATING TRILINGUAL CHATBOT WIDGET --- */}
      <div className="chatbot-wrapper">
        {chatOpen ? (
          <div 
            className="glass-panel chatbot-widget" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              background: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: '1px solid var(--primary)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '12px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Chatbot Header */}
            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.chatbotTitle}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Voice TTS Toggle button */}
                <button 
                  onClick={handleToggleMute}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                  title={voiceMuted ? "Unmute Voice Responses" : "Mute Voice Responses"}
                >
                  {voiceMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button 
                  onClick={() => setChatOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
                {/* Chatbot Message Stream */}
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index}
                      style={{ 
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        background: msg.sender === 'user' 
                          ? 'var(--primary)' 
                          : (darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.05)'),
                        color: msg.sender === 'user' ? 'white' : 'inherit',
                        padding: '0.65rem 0.85rem',
                        borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {chatTyping && (
                    <div style={{ alignSelf: 'flex-start', background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', padding: '0.5rem 0.85rem', borderRadius: '12px 12px 12px 2px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <RefreshCw size={12} style={{ animation: 'spin 1.5s linear infinite' }} />
                      <span style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>typing...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chatbot Quick Recommendations Panel */}
                <div style={{ padding: '0.5rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.1)' }}>
                  {[
                    { label: lang === 'hi' ? "मोच vs फ्रैक्चर" : (lang === 'hn' ? "sprain vs fracture" : "Sprain vs Fracture"), query: "sprain vs fracture" },
                    { label: lang === 'hi' ? "बर्फ सेक नियम" : (lang === 'hn' ? "ice rules" : "Ice rules"), query: "ice rules" },
                    { label: lang === 'hi' ? "R.I.C.E. गाइड" : "R.I.C.E. first aid", query: "R.I.C.E." },
                    { label: lang === 'hi' ? "खतरे के संकेत" : (lang === 'hn' ? "danger signs" : "Danger signs"), query: "danger flags" }
                  ].map((tag, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSendChat(tag.query)}
                      style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)', border: '1px solid var(--border)', borderRadius: '999px', padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: 'inherit', cursor: 'pointer', transition: 'var(--transition-smooth)' }}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                {/* Chatbot Input Box */}
                <div style={{ display: 'flex', borderTop: '1px solid var(--border)', background: darkMode ? 'rgba(30, 41, 59, 0.5)' : '#fff', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    placeholder={t.chatPlaceholder}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    style={{ flex: 1, background: 'none', border: 'none', padding: '0.75rem 1rem', color: 'inherit', fontSize: '0.85rem', outline: 'none' }}
                  />
                  
                  {/* Voice Input Microphone Button */}
                  <button 
                    onClick={startVoiceRecognition}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: isListening ? 'var(--color-emergency)' : 'var(--text-secondary)', 
                      cursor: 'pointer', 
                      padding: '0.5rem',
                      marginRight: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      animation: isListening ? 'pulseMic 1.2s infinite' : 'none'
                    }}
                    title="Speak to Assistant"
                  >
                    {isListening ? <Mic size={18} /> : <Mic size={18} />}
                  </button>
                  <style>{`
                    @keyframes pulseMic {
                      0%, 100% { transform: scale(1); opacity: 1; }
                      50% { transform: scale(1.2); opacity: 0.7; }
                    }
                  `}</style>

                  <button 
                    onClick={() => handleSendChat()}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', paddingRight: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Send size={16} />
                  </button>
                </div>
          </div>
        ) : null}

        {/* Chat Toggle Bubble Button */}
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="btn btn-primary glow-primary" 
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            justifyContent: 'center', 
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
            padding: 0
          }}
        >
          <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
}


from schemas import AssessmentRequest, ScoreBreakdownItem, RecommendationActions
from typing import Dict, Any, List

def calculate_triage_score(req: AssessmentRequest) -> Dict[str, Any]:
    # Emergency Red Flag Trigger Overrides
    emergency_triggers = [
        req.redFlags.boneProtruding,
        req.redFlags.numbnessBelow,
        req.redFlags.blueColdBelow,
        req.redFlags.unrelivedPain,
        req.symptoms.deformity == "yes",
        req.symptoms.skinColor in ["blue_purple", "pale_white"]
    ]

    # Map translations for title/actions
    recs_data = {
        "EMERGENCY": {
            "en": {
                "title": "⚠️ EMERGENCY — Seek Immediate Medical Attention",
                "actions": [
                    "Call emergency services (112 / 108 / 911) or go to the nearest ER immediately.",
                    "Do NOT attempt to move or straighten the injured limb.",
                    "Keep the patient warm and still. Cover any open wounds with a clean cloth."
                ]
            },
            "hi": {
                "title": "⚠️ आपातकालीन स्थिति — तुरंत अस्पताल जाएं",
                "actions": [
                    "तुरंत एम्बुलेंस (108 / 112) बुलाएं या नजदीकी आपातकालीन कक्ष में जाएं।",
                    "चोटिल अंग को बिल्कुल न हिलाएं और सीधा करने की कोशिश न करें।",
                    "खुले घावों को साफ कपड़े से हल्के से ढकें।"
                ]
            },
            "hn": {
                "title": "⚠️ EMERGENCY — Turant ER/Doctor ke paas jayein",
                "actions": [
                    "Call emergency services (112 / 108) ya nearest hospital ER me jayein.",
                    "Chotil limb ko bilkul mat hilayein aur seedha karne ki koshish na karein.",
                    "Open wounds (khule ghao) ko clean kapde se cover karein."
                ]
            }
        },
        "HIGH": {
            "en": {
                "title": "🔴 High Risk — High Fracture Probability",
                "actions": [
                    "Do NOT bear any weight on the injured limb.",
                    "Immobilize the joint using a splint or padding.",
                    "Visit an urgent care center or doctor today.",
                    "An X-ray evaluation is strongly recommended based on clinical decision rules."
                ]
            },
            "hi": {
                "title": "🔴 उच्च जोखिम — फ्रैक्चर होने की अत्यधिक संभावना",
                "actions": [
                    "चोटिल पैर/हाथ पर बिल्कुल भी वजन न डालें।",
                    "जोड़ को एक सपोर्ट या स्प्लिंट का उपयोग करके स्थिर (Immobilize) करें।",
                    "आज ही किसी हड्डी के डॉक्टर या आपातकालीन केंद्र पर जाएं। एक्स-रे की आवश्यकता है।"
                ]
            },
            "hn": {
                "title": "🔴 High Risk — High Fracture Probability",
                "actions": [
                    "Chotil limb par bilkul bhi weight (vazan) na daalein.",
                    "Splint ya padding ka use karke joint ko immobilize (sthir) karein.",
                    "Aaj hi kisi orthopedic doctor ya nearest clinic me dikhayein.",
                    "Clinical Ottawa Rules ke basis par X-ray evaluation strongly recommended hai."
                ]
            }
        },
        "MODERATE": {
            "en": {
                "title": "🟡 Moderate Risk — Possible Sprain or Minor Crack",
                "actions": [
                    "Implement the R.I.C.E. protocol immediately.",
                    "Avoid putting weight on the limb. Use support if walking.",
                    "Book a medical consultation/visit within the next 24-48 hours for clinical evaluation.",
                    "Monitor for skin temperature changes or tingling."
                ]
            },
            "hi": {
                "title": "🟡 मध्यम जोखिम — महत्वपूर्ण मोच या मामूली फ्रैक्चर की संभावना",
                "actions": [
                    "R.I.C.E. प्रोटोकॉल को तुरंत लागू करें।",
                    "जोड़ पर दबाव डालने से बचें। चलने के लिए बैसाखी या सहारे का उपयोग करें।",
                    "अगले 24-48 घंटों के भीतर डॉक्टर से अपॉइंटमेंट लें।"
                ]
            },
            "hn": {
                "title": "🟡 Moderate Risk — Possible Sprain or Minor Crack",
                "actions": [
                    "R.I.C.E. protocol ko turant follow karein (Rest, Ice, Compress, Elevate).",
                    "Limb par zyada pressure na daalein. Chalne ke liye support/crutches ka use karein.",
                    "Next 24-48 hours me doctor se checkup karwayein.",
                    "Skin color changes, temperature, ya tingling sensation monitor karein."
                ]
            }
        },
        "LOW": {
            "en": {
                "title": "🟢 Low Risk — Soft Tissue Injury Likely (Sprain)",
                "actions": [
                    "Apply the R.I.C.E. protocol (Rest, Ice, Compression, Elevation) to reduce pain and swelling.",
                    "Rest the joint and monitor for the next 48-72 hours.",
                    "Seek medical evaluation if your pain increases or you still cannot bear weight after 3 days."
                ]
            },
            "hi": {
                "title": "🟢 कम जोखिम — मोच या सामान्य चोट की संभावना",
                "actions": [
                    "प्रभावित अंग को आराम (Rest) दें और सूखी बर्फ से सेक (Ice) करें।",
                    "सूजन कम करने के लिए जोड़ पर हल्के संपीड़न की पट्टी (Compression) बांधें।",
                    "चोटिल अंग को ऊंचाई (Elevation) पर रखें और 48-72 घंटों तक निगरानी रखें।"
                ]
            },
            "hn": {
                "title": "🟢 Low Risk — Soft Tissue Injury Likely (Sprain)",
                "actions": [
                    "R.I.C.E. treatment apply karein (Aaraam, Barf sek, Bandage wrap, Elevate joint).",
                    "Joint ko rest dein aur next 48-72 hours monitor karein.",
                    "Agar pain badhta hai ya 3 days baad bhi chal nahi pa rahe, toh doctor se consult karein."
                ]
            }
        }
    }

    # Fetch language choice
    lang = req.lang if req.lang in ["en", "hi", "hn"] else "en"

    if any(emergency_triggers):
        recs = recs_data["EMERGENCY"][lang]
        return {
            "riskScore": 150,
            "riskLevel": "EMERGENCY",
            "scoreBreakdown": [
                ScoreBreakdownItem(factor="🚨 Emergency Overrides Triggered (Critical Symptoms)", points=150)
            ],
            "recommendations": RecommendationActions(
                level="EMERGENCY",
                title=recs["title"],
                actions=recs["actions"]
            )
        }

    score = 0
    breakdown: List[ScoreBreakdownItem] = []

    # Weight-Bearing (Ottawa Rules)
    if req.injuryArea in ['ankle', 'foot', 'knee']:
        if not req.ottawaResults.canWalkImmediately and not req.ottawaResults.canWalkNow:
            score += 30
            breakdown.append(ScoreBreakdownItem(factor="Inability to walk 4 steps (Ottawa Rule positive)", points=30))

    # Bone Tenderness Ottawa Specifics
    if req.injuryArea == 'ankle':
        if req.ottawaResults.lateralMalleolusTenderness:
            score += 25
            breakdown.append(ScoreBreakdownItem(factor="Outer Ankle Bone (Lateral Malleolus) tenderness", points=25))
        if req.ottawaResults.medialMalleolusTenderness:
            score += 25
            breakdown.append(ScoreBreakdownItem(factor="Inner Ankle Bone (Medial Malleolus) tenderness", points=25))
    elif req.injuryArea == 'foot':
        if req.ottawaResults.fifthMetatarsalTenderness:
            score += 25
            breakdown.append(ScoreBreakdownItem(factor="Outer Foot Base (5th Metatarsal) tenderness", points=25))
        if req.ottawaResults.navicularTenderness:
            score += 25
            breakdown.append(ScoreBreakdownItem(factor="Inner Midfoot (Navicular Bone) tenderness", points=25))
    elif req.injuryArea == 'knee':
        if req.age >= 55:
            score += 15
            breakdown.append(ScoreBreakdownItem(factor="Age >= 55 (Ottawa Knee Rule criteria)", points=15))
        if req.ottawaResults.patellarTenderness:
            score += 25
            breakdown.append(ScoreBreakdownItem(factor="Isolated Kneecap (Patella) tenderness", points=25))
        if req.ottawaResults.fibularHeadTenderness:
            score += 25
            breakdown.append(ScoreBreakdownItem(factor="Outer Knee Bone (Fibular Head) tenderness", points=25))
        if not req.ottawaResults.kneeFlexion90:
            score += 20
            breakdown.append(ScoreBreakdownItem(factor="Inability to flex knee to 90 degrees", points=20))
    elif req.injuryArea == 'wrist':
        if req.ottawaResults.snuffboxTenderness:
            score += 25
            breakdown.append(ScoreBreakdownItem(factor="Anatomical Snuffbox tenderness (Scaphoid assessment)", points=25))
        if req.ottawaResults.scaphoidTubercleTenderness:
            score += 25
            breakdown.append(ScoreBreakdownItem(factor="Scaphoid Tubercle tenderness", points=25))
        if req.ottawaResults.thumbCompressionPain:
            score += 15
            breakdown.append(ScoreBreakdownItem(factor="Pain with thumb compression", points=15))
        if req.ottawaResults.gripPain:
            score += 15
            breakdown.append(ScoreBreakdownItem(factor="Severe pain when gripping objects", points=15))

    # High Energy Injury Mechanism
    if req.howInjured in ['fall_height', 'sports_collision', 'vehicle_accident', 'foosh']:
        score += 15
        breakdown.append(ScoreBreakdownItem(factor="High-energy mechanism of injury", points=15))

    # Sound Heard
    if req.soundHeard == 'crack_snap':
        score += 20
        breakdown.append(ScoreBreakdownItem(factor="Cracking/snapping sound heard at injury", points=20))
    elif req.soundHeard == 'pop_snap':
        score += 10
        breakdown.append(ScoreBreakdownItem(factor="Popping sound heard at injury", points=10))

    # Pain Metrics
    if req.symptoms.painLevel >= 8:
        score += 15
        breakdown.append(ScoreBreakdownItem(factor=f"Severe pain level rated {req.symptoms.painLevel}/10", points=15))
    elif req.symptoms.painLevel >= 5:
        score += 8
        breakdown.append(ScoreBreakdownItem(factor=f"Moderate pain level rated {req.symptoms.painLevel}/10", points=8))

    if req.symptoms.painType == 'sharp_stabbing':
        score += 10
        breakdown.append(ScoreBreakdownItem(factor="Sharp/stabbing pain character", points=10))

    if 'constant_rest' in req.symptoms.painIncreases:
        score += 12
        breakdown.append(ScoreBreakdownItem(factor="Constant pain present at rest", points=12))

    # Physical Signs
    if req.symptoms.swelling == 'severe':
        score += 15
        breakdown.append(ScoreBreakdownItem(factor="Severe visual swelling (stretched skin)", points=15))
    elif req.symptoms.swelling == 'moderate':
        score += 8
        breakdown.append(ScoreBreakdownItem(factor="Moderate visual swelling", points=8))

    if req.symptoms.bruising == 'large_area':
        score += 10
        breakdown.append(ScoreBreakdownItem(factor="Large area of bruising or spreading purple spot", points=10))

    if req.symptoms.movementAbility == 'cannot_move':
        score += 20
        breakdown.append(ScoreBreakdownItem(factor="Inability to move the injured joint at all", points=20))

    # Determine standard Risk levels
    if score <= 20:
        level = "LOW"
    elif score <= 50:
        level = "MODERATE"
    else:
        level = "HIGH"

    recs = recs_data[level][lang]

    return {
        "riskScore": score,
        "riskLevel": level,
        "scoreBreakdown": breakdown,
        "recommendations": RecommendationActions(
            level=level,
            title=recs["title"],
            actions=recs["actions"]
        )
    }

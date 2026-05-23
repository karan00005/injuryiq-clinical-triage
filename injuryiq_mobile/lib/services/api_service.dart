import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/assessment_model.dart';

class ApiService {
  // Use http://10.0.2.2:8000 for standard Android Emulator loopback to access host's localhost FastAPI server
  static const String baseApiUrl = "http://10.0.2.2:8000/api/v1";

  // POST /api/v1/assess to process triage questionnaire
  Future<AssessmentModel> submitAssessment(AssessmentModel model) async {
    final url = Uri.parse("$baseApiUrl/assess");
    final headers = {"Content-Type": "application/json"};
    final body = json.encode(model.toJson());

    try {
      final response = await http.post(url, headers: headers, body: body).timeout(
        const Duration(seconds: 8),
      );

      if (response.statusCode == 200) {
        final decodedData = json.decode(response.body);
        return AssessmentModel.fromJson(decodedData);
      } else {
        throw Exception("Server Error: HTTP ${response.statusCode}");
      }
    } catch (e) {
      // Fallback offline calculation rules engine in case backend server is offline or unreachable
      return _calculateOfflineTriageFallback(model);
    }
  }

  // Offline mock rules score calculation system mapping to rules.py scoring parameters
  AssessmentModel _calculateOfflineTriageFallback(AssessmentModel input) {
    int score = 0;
    List<Map<String, dynamic>> breakdown = [];

    // Red flag overrides (EMERGENCY)
    bool boneProtruded = input.redFlags['boneProtruding'] ?? false;
    bool numb = input.redFlags['numbnessBelow'] ?? false;
    bool cold = input.redFlags['blueColdBelow'] ?? false;
    bool deformity = input.symptoms['deformity'] == 'yes';

    if (boneProtruded || numb || cold || deformity) {
      return AssessmentModel(
        userId: input.userId,
        injuryArea: input.injuryArea,
        age: input.age,
        injuryTimeAgo: input.injuryTimeAgo,
        howInjured: input.howInjured,
        soundHeard: input.soundHeard,
        lang: input.lang,
        symptoms: input.symptoms,
        ottawaResults: input.ottawaResults,
        redFlags: input.redFlags,
        riskScore: 150,
        riskLevel: "EMERGENCY",
        scoreBreakdown: [
          {"factor": "Offline: Critical Red Flags / Deformity Triggered", "points": 150}
        ],
        recommendations: {
          "level": "EMERGENCY",
          "title": "🚨 EMERGENCY (Offline Mode)",
          "actions": [
            "Go to the nearest emergency room immediately.",
            "Do NOT move or bear weight on the injured joint.",
            "Immobilize the area with splints."
          ]
        },
        createdAt: DateTime.now().toIso8601String(),
      );
    }

    // Weight bearing (Ottawa Ankle/Foot/Knee criteria)
    bool canWalkImmediate = input.ottawaResults['canWalkImmediately'] ?? true;
    bool canWalkNow = input.ottawaResults['canWalkNow'] ?? true;
    if (!canWalkImmediate && !canWalkNow) {
      score += 30;
      breakdown.add({"factor": "Cannot bear weight immediately and now", "points": 30});
    }

    // Bone tenderness Ottawa specifics
    if (input.injuryArea == 'ankle') {
      if (input.ottawaResults['lateralMalleolusTenderness'] ?? false) {
        score += 25;
        breakdown.add({"factor": "Outer Ankle Malleolus tenderness", "points": 25});
      }
      if (input.ottawaResults['medialMalleolusTenderness'] ?? false) {
        score += 25;
        breakdown.add({"factor": "Inner Ankle Malleolus tenderness", "points": 25});
      }
    } else if (input.injuryArea == 'foot') {
      if (input.ottawaResults['fifthMetatarsalTenderness'] ?? false) {
        score += 25;
        breakdown.add({"factor": "5th Metatarsal Base tenderness", "points": 25});
      }
      if (input.ottawaResults['navicularTenderness'] ?? false) {
        score += 25;
        breakdown.add({"factor": "Navicular Bone tenderness", "points": 25});
      }
    }

    // Sound
    if (input.soundHeard == 'crack_snap') {
      score += 20;
      breakdown.add({"factor": "Cracking sound at injury", "points": 20});
    } else if (input.soundHeard == 'pop_snap') {
      score += 10;
      breakdown.add({"factor": "Popping sound at injury", "points": 10});
    }

    // Pain level
    int painLevel = input.symptoms['painLevel'] ?? 3;
    if (painLevel >= 8) {
      score += 15;
      breakdown.add({"factor": "Severe pain rating", "points": 15});
    } else if (painLevel >= 5) {
      score += 8;
      breakdown.add({"factor": "Moderate pain rating", "points": 8});
    }

    // Swelling
    String swelling = input.symptoms['swelling'] ?? 'none';
    if (swelling == 'severe') {
      score += 15;
      breakdown.add({"factor": "Severe swelling", "points": 15});
    }

    String riskLevel = "LOW";
    if (score > 50) {
      riskLevel = "HIGH";
    } else if (score > 20) {
      riskLevel = "MODERATE";
    }

    return AssessmentModel(
      userId: input.userId,
      injuryArea: input.injuryArea,
      age: input.age,
      injuryTimeAgo: input.injuryTimeAgo,
      howInjured: input.howInjured,
      soundHeard: input.soundHeard,
      lang: input.lang,
      symptoms: input.symptoms,
      ottawaResults: input.ottawaResults,
      redFlags: input.redFlags,
      riskScore: score,
      riskLevel: riskLevel,
      scoreBreakdown: breakdown,
      recommendations: {
        "level": riskLevel,
        "title": "${riskLevel == 'HIGH' ? '🔴' : riskLevel == 'MODERATE' ? '🟡' : '🟢'} Risk Level: $riskLevel",
        "actions": [
          riskLevel == 'HIGH'
              ? "Visit a clinical doctor/urgent care today."
              : riskLevel == 'MODERATE'
                  ? "Restrict movements. Apply R.I.C.E. protocol."
                  : "Implement standard R.I.C.E. care at home.",
          "Perform clinical X-ray checks if pain doesn't subside.",
        ]
      },
      createdAt: DateTime.now().toIso8601String(),
    );
  }
}

class AssessmentModel {
  final String? assessmentId;
  final String userId;
  final String injuryArea;
  final int age;
  final String injuryTimeAgo;
  final String howInjured;
  final String soundHeard;
  final String lang;
  final Map<String, dynamic> symptoms;
  final Map<String, dynamic> ottawaResults;
  final Map<String, dynamic> redFlags;
  
  // Results populated by API backend
  final int? riskScore;
  final String? riskLevel;
  final List<dynamic>? scoreBreakdown;
  final Map<String, dynamic>? recommendations;
  final String? imageUrl;
  final String? comparisonImageUrl;
  final String? createdAt;

  AssessmentModel({
    this.assessmentId,
    required this.userId,
    required this.injuryArea,
    required this.age,
    required this.injuryTimeAgo,
    required this.howInjured,
    required this.soundHeard,
    required this.lang,
    required this.symptoms,
    required this.ottawaResults,
    required this.redFlags,
    this.riskScore,
    this.riskLevel,
    this.scoreBreakdown,
    this.recommendations,
    this.imageUrl,
    this.comparisonImageUrl,
    this.createdAt,
  });

  // Convert to JSON mapping for FastAPI request payload
  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'injuryArea': injuryArea,
      'age': age,
      'injuryTimeAgo': injuryTimeAgo,
      'howInjured': howInjured,
      'soundHeard': soundHeard,
      'lang': lang,
      'symptoms': symptoms,
      'ottawaResults': ottawaResults,
      'redFlags': redFlags,
      'imageUrl': imageUrl,
      'comparisonImageUrl': comparisonImageUrl,
    };
  }

  // Create from Firestore map / API response payload
  factory AssessmentModel.fromJson(Map<String, dynamic> json) {
    return AssessmentModel(
      assessmentId: json['assessmentId'] as String?,
      userId: json['userId'] ?? '',
      injuryArea: json['injuryArea'] ?? '',
      age: json['age'] is int ? json['age'] : (json['age'] != null ? int.parse(json['age'].toString()) : 25),
      injuryTimeAgo: json['injuryTimeAgo'] ?? '',
      howInjured: json['injuryMechanism'] ?? json['howInjured'] ?? '',
      soundHeard: json['soundHeard'] ?? json['soundHeard'] ?? 'no_sound',
      lang: json['lang'] ?? 'en',
      symptoms: json['symptoms'] ?? {},
      ottawaResults: json['ottawaResults'] ?? {},
      redFlags: json['redFlags'] ?? {},
      riskScore: json['riskScore'] as int?,
      riskLevel: json['riskLevel'] as String?,
      scoreBreakdown: json['scoreBreakdown'] as List<dynamic>?,
      recommendations: json['recommendations'] ?? {},
      imageUrl: json['imageUrl'] as String?,
      comparisonImageUrl: json['comparisonImageUrl'] as String?,
      createdAt: json['createdAt'] as String?,
    );
  }
}

class UserModel {
  final String uid;
  final String displayName;
  final String email;
  final int? age;
  final String? gender;
  final bool disclaimerAccepted;
  final String? disclaimerAcceptedAt;
  final String createdAt;

  UserModel({
    required this.uid,
    required this.displayName,
    required this.email,
    this.age,
    this.gender,
    required this.disclaimerAccepted,
    this.disclaimerAcceptedAt,
    required this.createdAt,
  });

  // Convert to Firestore Map
  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'displayName': displayName,
      'email': email,
      'age': age,
      'gender': gender,
      'disclaimerAccepted': disclaimerAccepted,
      'disclaimerAcceptedAt': disclaimerAcceptedAt,
      'createdAt': createdAt,
    };
  }

  // Create from Firestore Map
  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      uid: map['uid'] ?? '',
      displayName: map['displayName'] ?? '',
      email: map['email'] ?? '',
      age: map['age'] as int?,
      gender: map['gender'] as String?,
      disclaimerAccepted: map['disclaimerAccepted'] ?? false,
      disclaimerAcceptedAt: map['disclaimerAcceptedAt'] as String?,
      createdAt: map['createdAt'] ?? '',
    );
  }
}

import 'package:flutter/foundation.dart';

class AuthService extends ChangeNotifier {
  bool _isAuthenticated = false;
  String? _userId;
  String? _userEmail;
  String? _displayName;

  bool get isAuthenticated => _isAuthenticated;
  String? get userId => _userId;
  String? get userEmail => _userEmail;
  String? get displayName => _displayName;

  // Mock Login for local testing without Firebase configuration dependencies
  Future<bool> loginMock(String email, String password) async {
    await Future.delayed(const Duration(seconds: 1)); // Simulate latency
    if (email.contains('@') && password.length >= 6) {
      _isAuthenticated = true;
      _userId = "mock_user_${email.split('@')[0]}";
      _userEmail = email;
      _displayName = email.split('@')[0].toUpperCase();
      notifyListeners();
      return true;
    }
    return false;
  }

  // Mock Register
  Future<bool> registerMock(String name, String email, String password) async {
    await Future.delayed(const Duration(seconds: 1));
    if (name.isNotEmpty && email.contains('@') && password.length >= 6) {
      _isAuthenticated = true;
      _userId = "mock_user_${email.split('@')[0]}";
      _userEmail = email;
      _displayName = name;
      notifyListeners();
      return true;
    }
    return false;
  }

  // Logout
  Future<void> logout() async {
    _isAuthenticated = false;
    _userId = null;
    _userEmail = null;
    _displayName = null;
    notifyListeners();
  }
}

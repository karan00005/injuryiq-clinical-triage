import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import 'questionnaire_wizard.dart';
import 'chatbot_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  // Timer state variables
  int _iceSecondsLeft = 1200; // 20 minutes standard
  bool _timerRunning = false;
  Timer? _timer;

  void _toggleIceTimer() {
    if (_timerRunning) {
      _timer?.cancel();
      setState(() {
        _timerRunning = false;
      });
    } else {
      _timerRunning = true;
      _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (_iceSecondsLeft > 0) {
          setState(() {
            _iceSecondsLeft--;
          });
        } else {
          timer.cancel();
          setState(() {
            _timerRunning = false;
            _iceSecondsLeft = 1200;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("🧊 Ice session completed! Remove ice pack.")),
          );
        }
      });
    }
  }

  void _resetIceTimer() {
    _timer?.cancel();
    setState(() {
      _timerRunning = false;
      _iceSecondsLeft = 1200;
    });
  }

  String _formatDuration(int totalSecs) {
    int mins = totalSecs ~/ 60;
    int secs = totalSecs % 60;
    return "${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}";
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _showSosDialog(BuildContext context) {
    String status = "locating";
    
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            // Simulated stateful workflows
            if (status == "locating") {
              Timer(const Duration(milliseconds: 1500), () {
                if (Navigator.canPop(context)) {
                  setDialogState(() {
                    status = "sending";
                  });
                }
              });
            } else if (status == "sending") {
              Timer(const Duration(milliseconds: 2000), () {
                if (Navigator.canPop(context)) {
                  setDialogState(() {
                    status = "sent";
                  });
                }
              });
            }

            return AlertDialog(
              backgroundColor: const Color(0xFF1E293B),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: Row(
                children: [
                  const Icon(Icons.warning_amber_rounded, color: Colors.redAccent),
                  const SizedBox(width: 8),
                  Text(
                    "Emergency SOS",
                    style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                ],
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (status == "locating") ...[
                    const Center(child: SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.redAccent, strokeWidth: 2.5))),
                    const SizedBox(height: 16),
                    const Text(
                      "📍 Locating device GPS coordinates...",
                      style: TextStyle(color: Colors.white70, fontSize: 13),
                      textAlign: TextAlign.center,
                    ),
                  ] else if (status == "sending") ...[
                    const Center(child: SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.redAccent, strokeWidth: 2.5))),
                    const SizedBox(height: 16),
                    const Text(
                      "📡 Sending pre-configured clinical SOS SMS to Athletic Coach (+91 98765-43210)...",
                      style: TextStyle(color: Colors.white70, fontSize: 13),
                      textAlign: TextAlign.center,
                    ),
                  ] else if (status == "sent") ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.greenAccent.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.greenAccent.withOpacity(0.25)),
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "✅ SMS DELIVERED SUCCESSFULLY",
                            style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 11),
                          ),
                          SizedBox(height: 6),
                          Text(
                            "\"🚨 EMERGENCY SOS! Patient Karan has triggered an InjuryIQ AI Triage Emergency Alert. GPS Coordinates: 28.6139, 77.2090. Please provide medical assistance immediately.\"",
                            style: TextStyle(color: Colors.white70, fontSize: 12, fontStyle: FontStyle.italic, height: 1.4),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      "✅ Mock Alert SMS Sent! Local authorities and medical coaches notified.",
                      style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 13),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text("Close", style: TextStyle(color: Colors.white70)),
                )
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthService>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        title: Text(
          "InjuryIQ Dashboard",
          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 20),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: Colors.white70),
            onPressed: () {
              auth.logout();
              Navigator.of(context).popUntil((route) => route.isFirst);
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Welcome card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF3B82F6).withOpacity(0.3),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  )
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Hello, ${auth.displayName ?? 'Guest'} 👋",
                    style: GoogleFonts.outfit(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Have a new joint sprain or bone concern? Assess injury instantly to check risk levels against evidence-based Ottawa Rules.",
                    style: TextStyle(color: Colors.white80, fontSize: 13, height: 1.4),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const QuestionnaireWizard()),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF1D4ED8),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: const Text(
                            "Start Triage Assessment",
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      ElevatedButton.icon(
                        onPressed: () => _showSosDialog(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.redAccent,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        icon: const Icon(Icons.warning_amber_rounded, size: 18),
                        label: const Text("SOS", style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // R.I.C.E. Active Ice Session Timer
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.ac_unit_rounded, color: Colors.lightBlueAccent, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        "R.I.C.E. Ice Session Timer",
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _formatDuration(_iceSecondsLeft),
                        style: GoogleFonts.outfit(
                          fontSize: 34,
                          fontWeight: FontWeight.bold,
                          color: Colors.lightBlueAccent,
                        ),
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: Icon(
                              _timerRunning ? Icons.pause_circle_filled : Icons.play_circle_fill,
                              size: 40,
                              color: Colors.white,
                            ),
                            onPressed: _toggleIceTimer,
                          ),
                          IconButton(
                            icon: const Icon(Icons.replay_circle_filled, size: 40, color: Colors.white54),
                            onPressed: _resetIceTimer,
                          ),
                        ],
                      )
                    ],
                  )
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Recent reports mock logs placeholder
            Text(
              "Recent Assessments",
              style: GoogleFonts.outfit(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Column(
                children: [
                  Icon(Icons.history_rounded, size: 36, color: Colors.white24),
                  SizedBox(height: 12),
                  Text(
                    "No Assessment History",
                    style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 4),
                  Text(
                    "Your completed bone and joint triage results will appear here.",
                    style: TextStyle(color: Colors.white38, fontSize: 12),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF8B5CF6), // Purple
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ChatbotScreen()),
          );
        },
        child: const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../models/assessment_model.dart';
import 'report_screen.dart';

class QuestionnaireWizard extends StatefulWidget {
  const QuestionnaireWizard({super.key});

  @override
  State<QuestionnaireWizard> createState() => _QuestionnaireWizardState();
}

class _QuestionnaireWizardState extends State<QuestionnaireWizard> {
  int _currentStep = 0;
  final _apiService = ApiService();

  // Wizard state values
  bool _disclaimerAccepted = false;
  String _selectedArea = "ankle";
  int _age = 25;
  String _timeAgo = "1-6 hours";
  String _howInjured = "twist_roll";
  String _soundHeard = "no_sound";

  // Symptoms
  double _painLevel = 5.0;
  String _painType = "dull_aching";
  String _swelling = "none";
  String _bruising = "none";
  bool _deformity = false;
  bool _tightTense = false;

  // Ottawa specific symptoms
  bool _canWalkImmediately = true;
  bool _canWalkNow = true;
  bool _lateralTenderness = false;
  bool _medialTenderness = false;
  bool _fifthMetatarsalTenderness = false;
  bool _navicularTenderness = false;
  bool _patellarTenderness = false;
  bool _fibularHeadTenderness = false;
  bool _kneeFlex90 = true;
  bool _snuffboxTenderness = false;
  bool _scaphoidTubercleTenderness = false;

  // Red flags
  bool _boneProtruding = false;
  bool _numbnessBelow = false;
  bool _blueColdBelow = false;
  bool _unrelivedPain = false;

  void _nextStep() {
    if (_currentStep == 0 && !_disclaimerAccepted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please accept the medical disclaimer to continue.")),
      );
      return;
    }

    if (_currentStep < 6) {
      setState(() {
        _currentStep++;
      });
    } else {
      _submitAssessment();
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
    }
  }

  Future<void> _submitAssessment() async {
    // Show AI processing load dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        backgroundColor: const Color(0xFF1E293B),
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(color: Color(0xFF3B82F6)),
              const SizedBox(height: 20),
              Text(
                "Analyzing Assessment...",
                style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              const Text(
                "Running clinical scoring, loading PyTorch CNN layers, and executing Grad-CAM visual maps classification...",
                style: TextStyle(color: Colors.white60, fontSize: 12),
                textAlign: TextAlign.center,
              )
            ],
          ),
        ),
      ),
    );

    final auth = Provider.of<AuthService>(context, listen: false);

    // Prepare symptoms payload
    final symptomsMap = {
      "painLevel": _painLevel.toInt(),
      "painType": _painType,
      "painIncreases": ["when_moving"],
      "painReliefWithMeds": "yes",
      "swelling": _swelling,
      "bruising": _bruising,
      "deformity": _deformity ? "yes" : "no",
      "skinColor": "normal",
      "tightTense": _tightTense,
      "movementAbility": "partial",
      "sideComparison": "slightly_different",
    };

    // Prepare Ottawa payload
    final ottawaMap = {
      "canWalkImmediately": _canWalkImmediately,
      "canWalkNow": _canWalkNow,
      "lateralMalleolusTenderness": _lateralTenderness,
      "medialMalleolusTenderness": _medialTenderness,
      "fifthMetatarsalTenderness": _fifthMetatarsalTenderness,
      "navicularTenderness": _navicularTenderness,
      "patellarTenderness": _patellarTenderness,
      "fibularHeadTenderness": _fibularHeadTenderness,
      "kneeFlexion90": _kneeFlex90,
      "snuffboxTenderness": _snuffboxTenderness,
      "scaphoidTubercleTenderness": _scaphoidTubercleTenderness,
    };

    // Prepare red flags payload
    final redFlagsMap = {
      "boneProtruding": _boneProtruding,
      "numbnessBelow": _numbnessBelow,
      "blueColdBelow": _blueColdBelow,
      "unrelivedPain": _unrelivedPain,
    };

    final requestModel = AssessmentModel(
      userId: auth.userId ?? "guest_user",
      injuryArea: _selectedArea,
      age: _age,
      injuryTimeAgo: _timeAgo,
      howInjured: _howInjured,
      soundHeard: _soundHeard,
      lang: "en",
      symptoms: symptomsMap,
      ottawaResults: ottawaMap,
      redFlags: redFlagsMap,
    );

    final result = await _apiService.submitAssessment(requestModel);

    if (mounted) {
      Navigator.pop(context); // Close processing dialog
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => ReportScreen(assessment: result)),
      );
    }
  }

  Widget _buildDisclaimerStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Icon(Icons.warning_amber_rounded, size: 60, color: Colors.orangeAccent),
        const SizedBox(height: 16),
        Text(
          "Safety & Medical Disclaimer",
          textAlign: TextAlign.center,
          style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 12),
        const Text(
          "This app is an AI-assisted clinical triage assistant designed for informational and educational purposes. It is NOT a medical device and does NOT replace a doctor's diagnosis.\n\n"
          "Exclusion Criteria:\n"
          "• NOT suitable for children under 18.\n"
          "• Do NOT use if the patient is intoxicated or has severe cognitive impairments.\n"
          "• Always visit an ER immediately for life-threatening emergencies.",
          style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.5),
        ),
        const SizedBox(height: 24),
        CheckboxListTile(
          title: const Text("I understand and accept the medical disclaimer.", style: TextStyle(color: Colors.white, fontSize: 13)),
          value: _disclaimerAccepted,
          activeColor: const Color(0xFF3B82F6),
          onChanged: (val) {
            setState(() {
              _disclaimerAccepted = val ?? false;
            });
          },
          controlAffinity: ListTileControlAffinity.leading,
        )
      ],
    );
  }

  Widget _buildAreaStep() {
    final areas = [
      {"id": "ankle", "name": "Ankle / टखना"},
      {"id": "foot", "name": "Foot / पैर का पंजा"},
      {"id": "knee", "name": "Knee / घुटना"},
      {"id": "wrist", "name": "Wrist / कलाई"},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          "Select Injured Area",
          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 16),
        ...areas.map((area) {
          final isSelected = _selectedArea == area['id'];
          return Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            key: ValueKey(area['id']),
            child: InkWell(
              onTap: () {
                setState(() {
                  _selectedArea = area['id']!;
                });
              },
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFF3B82F6).withOpacity(0.1) : const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: isSelected ? const Color(0xFF3B82F6) : Colors.white10),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(area['name']!, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    if (isSelected) const Icon(Icons.check_circle, color: Color(0xFF3B82F6))
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildBasicInfoStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          "Age & Injury Duration",
          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 16),
        const Text("Patient's Age (years)", style: TextStyle(color: Colors.white70)),
        Slider(
          value: _age.toDouble(),
          min: 18,
          max: 100,
          divisions: 82,
          label: "$_age yrs",
          activeColor: const Color(0xFF3B82F6),
          onChanged: (val) {
            setState(() {
              _age = val.toInt();
            });
          },
        ),
        Text("Selected: $_age years", style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        const SizedBox(height: 24),
        const Text("When did the injury happen?", style: TextStyle(color: Colors.white70)),
        DropdownButton<String>(
          dropdownColor: const Color(0xFF1E293B),
          value: _timeAgo,
          style: const TextStyle(color: Colors.white),
          items: const [
            DropdownMenuItem(value: "less_than_1_hour", child: Text("Less than 1 hour ago")),
            DropdownMenuItem(value: "1-6 hours", child: Text("1 to 6 hours ago")),
            DropdownMenuItem(value: "6-24 hours", child: Text("6 to 24 hours ago")),
            DropdownMenuItem(value: "1-3 days", child: Text("1 to 3 days ago")),
          ],
          onChanged: (val) {
            setState(() {
              _timeAgo = val ?? "1-6 hours";
            });
          },
        ),
      ],
    );
  }

  Widget _buildSymptomsStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          "Injury Mechanism & Sounds",
          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 16),
        const Text("How did the injury happen?", style: TextStyle(color: Colors.white70)),
        DropdownButton<String>(
          dropdownColor: const Color(0xFF1E293B),
          value: _howInjured,
          style: const TextStyle(color: Colors.white),
          items: const [
            DropdownMenuItem(value: "twist_roll", child: Text("Twisted or rolled joint")),
            DropdownMenuItem(value: "fall_height", child: Text("Fall from a height")),
            DropdownMenuItem(value: "direct_hit", child: Text("Direct blow or impact")),
            DropdownMenuItem(value: "sports_collision", child: Text("Collision during sports")),
          ],
          onChanged: (val) {
            setState(() {
              _howInjured = val ?? "twist_roll";
            });
          },
        ),
        const SizedBox(height: 16),
        const Text("Any sound heard during injury?", style: TextStyle(color: Colors.white70)),
        DropdownButton<String>(
          dropdownColor: const Color(0xFF1E293B),
          value: _soundHeard,
          style: const TextStyle(color: Colors.white),
          items: const [
            DropdownMenuItem(value: "no_sound", child: Text("No sound")),
            DropdownMenuItem(value: "pop_snap", child: Text("Popping sound")),
            DropdownMenuItem(value: "crack_snap", child: Text("Cracking or snapping sound")),
          ],
          onChanged: (val) {
            setState(() {
              _soundHeard = val ?? "no_sound";
            });
          },
        ),
      ],
    );
  }

  Widget _buildPhysicalStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          "Physical Symptoms",
          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 16),
        Text("Pain Level: ${_painLevel.toInt()}/10", style: const TextStyle(color: Colors.white70)),
        Slider(
          value: _painLevel,
          min: 0,
          max: 10,
          divisions: 10,
          label: "${_painLevel.toInt()}",
          activeColor: Colors.redAccent,
          onChanged: (val) {
            setState(() {
              _painLevel = val;
            });
          },
        ),
        const SizedBox(height: 12),
        const Text("Swelling Severity", style: TextStyle(color: Colors.white70)),
        DropdownButton<String>(
          dropdownColor: const Color(0xFF1E293B),
          value: _swelling,
          style: const TextStyle(color: Colors.white),
          items: const [
            DropdownMenuItem(value: "none", child: Text("None")),
            DropdownMenuItem(value: "mild", child: Text("Mild")),
            DropdownMenuItem(value: "moderate", child: Text("Moderate")),
            DropdownMenuItem(value: "severe", child: Text("Severe")),
          ],
          onChanged: (val) {
            setState(() {
              _swelling = val ?? "none";
            });
          },
        ),
        const SizedBox(height: 12),
        SwitchListTile(
          title: const Text("Visible joint deformity?", style: TextStyle(color: Colors.white, fontSize: 14)),
          value: _deformity,
          activeColor: Colors.redAccent,
          onChanged: (val) {
            setState(() {
              _deformity = val;
            });
          },
        )
      ],
    );
  }

  Widget _buildOttawaStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          "Ottawa Rules Screening",
          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 12),
        SwitchListTile(
          title: const Text("Could you walk 4 steps immediately after injury?", style: TextStyle(color: Colors.white, fontSize: 13)),
          value: _canWalkImmediately,
          activeColor: const Color(0xFF3B82F6),
          onChanged: (val) {
            setState(() {
              _canWalkImmediately = val;
            });
          },
        ),
        SwitchListTile(
          title: const Text("Can you bear weight (walk 4 steps) NOW?", style: TextStyle(color: Colors.white, fontSize: 13)),
          value: _canWalkNow,
          activeColor: const Color(0xFF3B82F6),
          onChanged: (val) {
            setState(() {
              _canWalkNow = val;
            });
          },
        ),
        if (_selectedArea == "ankle") ...[
          SwitchListTile(
            title: const Text("Pain when touching Outer Ankle Bone (Lateral Malleolus)?", style: TextStyle(color: Colors.white, fontSize: 13)),
            value: _lateralTenderness,
            activeColor: const Color(0xFF3B82F6),
            onChanged: (val) {
              setState(() {
                _lateralTenderness = val;
              });
            },
          ),
          SwitchListTile(
            title: const Text("Pain when touching Inner Ankle Bone (Medial Malleolus)?", style: TextStyle(color: Colors.white, fontSize: 13)),
            value: _medialTenderness,
            activeColor: const Color(0xFF3B82F6),
            onChanged: (val) {
              setState(() {
                _medialTenderness = val;
              });
            },
          ),
        ],
        if (_selectedArea == "foot") ...[
          SwitchListTile(
            title: const Text("Pain at the outer midfoot base (5th metatarsal)?", style: TextStyle(color: Colors.white, fontSize: 13)),
            value: _fifthMetatarsalTenderness,
            activeColor: const Color(0xFF3B82F6),
            onChanged: (val) {
              setState(() {
                _fifthMetatarsalTenderness = val;
              });
            },
          ),
          SwitchListTile(
            title: const Text("Pain when touching inner midfoot (Navicular bone)?", style: TextStyle(color: Colors.white, fontSize: 13)),
            value: _navicularTenderness,
            activeColor: const Color(0xFF3B82F6),
            onChanged: (val) {
              setState(() {
                _navicularTenderness = val;
              });
            },
          ),
        ],
      ],
    );
  }

  Widget _buildRedFlagsStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          "Critical Red Flags",
          style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        const SizedBox(height: 12),
        const Text(
          "Select any of the following critical emergency parameters if present:",
          style: TextStyle(color: Colors.white60, fontSize: 13),
        ),
        const SizedBox(height: 12),
        SwitchListTile(
          title: const Text("Bone protruding through the skin?", style: TextStyle(color: Colors.white, fontSize: 13)),
          value: _boneProtruding,
          activeColor: Colors.redAccent,
          onChanged: (val) {
            setState(() {
              _boneProtruding = val;
            });
          },
        ),
        SwitchListTile(
          title: const Text("Extreme numbness or tingling below injury?", style: TextStyle(color: Colors.white, fontSize: 13)),
          value: _numbnessBelow,
          activeColor: Colors.redAccent,
          onChanged: (val) {
            setState(() {
              _numbnessBelow = val;
            });
          },
        ),
        SwitchListTile(
          title: const Text("Cold, pale, or blue extremities below injury?", style: TextStyle(color: Colors.white, fontSize: 13)),
          value: _blueColdBelow,
          activeColor: Colors.redAccent,
          onChanged: (val) {
            setState(() {
              _blueColdBelow = val;
            });
          },
        ),
        SwitchListTile(
          title: const Text("Extreme, constant unrelieved pain?", style: TextStyle(color: Colors.white, fontSize: 13)),
          value: _unrelivedPain,
          activeColor: Colors.redAccent,
          onChanged: (val) {
            setState(() {
              _unrelivedPain = val;
            });
          },
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: Text(
          "Assessment Progress: ${((_currentStep / 6) * 100).toInt()}%",
          style: GoogleFonts.outfit(fontSize: 16),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            // Linear Progress Bar
            LinearProgressIndicator(
              value: _currentStep / 6.0,
              backgroundColor: Colors.white10,
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF3B82F6)),
            ),
            const SizedBox(height: 32),
            // Current step switcher container
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white.withOpacity(0.04)),
              ),
              child: IndexedStack(
                index: _currentStep,
                children: [
                  _buildDisclaimerStep(),
                  _buildAreaStep(),
                  _buildBasicInfoStep(),
                  _buildSymptomsStep(),
                  _buildPhysicalStep(),
                  _buildOttawaStep(),
                  _buildRedFlagsStep(),
                ],
              ),
            ),
            const SizedBox(height: 32),
            // Wizard Nav Controls
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (_currentStep > 0)
                  TextButton.icon(
                    onPressed: _prevStep,
                    icon: const Icon(Icons.arrow_back, color: Colors.white70),
                    label: const Text("Back", style: TextStyle(color: Colors.white70)),
                  )
                else
                  const SizedBox.shrink(),
                ElevatedButton.icon(
                  onPressed: _nextStep,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF3B82F6),
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                  ),
                  icon: const Icon(Icons.arrow_forward, color: Colors.white),
                  label: Text(
                    _currentStep == 6 ? "Analyze Result" : "Next",
                    style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}

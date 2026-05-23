import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/assessment_model.dart';

class ReportScreen extends StatelessWidget {
  final AssessmentModel assessment;

  const ReportScreen({super.key, required this.assessment});

  Color _getRiskColor(String level) {
    switch (level.toUpperCase()) {
      case 'EMERGENCY':
        return Colors.red.shade900;
      case 'HIGH':
        return Colors.redAccent;
      case 'MODERATE':
        return Colors.orangeAccent;
      case 'LOW':
      default:
        return Colors.greenAccent;
    }
  }

  @override
  Widget build(BuildContext context) {
    final riskLevel = assessment.riskLevel ?? 'LOW';
    final riskColor = _getRiskColor(riskLevel);
    final recsTitle = assessment.recommendations?['title'] ?? 'Triage Recommendations';
    final recsActions = assessment.recommendations?['actions'] as List<dynamic>? ?? [];

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: Text(
          "Clinical Triage Report",
          style: GoogleFonts.outfit(fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Risk Level Gauge & Score Container
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: riskColor.withOpacity(0.3), width: 1.5),
              ),
              child: Column(
                children: [
                  Text(
                    "RISK LEVEL",
                    style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white54, letterSpacing: 1.5),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    riskLevel.toUpperCase(),
                    style: GoogleFonts.outfit(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: riskColor,
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Score Indicator
                  Text(
                    "Triage Risk Score: ${assessment.riskScore ?? 0}",
                    style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Calculated using Ottawa rules criteria, pain indexes, physical indicators, and injury dynamics.",
                    style: TextStyle(color: Colors.white38, fontSize: 11),
                    textAlign: TextAlign.center,
                  )
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Ottawa rule recommendation banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: assessment.riskScore != null && assessment.riskScore! >= 30
                    ? Colors.redAccent.withOpacity(0.08)
                    : Colors.greenAccent.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: assessment.riskScore != null && assessment.riskScore! >= 30
                      ? Colors.redAccent.withOpacity(0.2)
                      : Colors.greenAccent.withOpacity(0.2),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    assessment.riskScore != null && assessment.riskScore! >= 30
                        ? Icons.report_problem_rounded
                        : Icons.check_circle_outline_rounded,
                    color: assessment.riskScore != null && assessment.riskScore! >= 30 ? Colors.redAccent : Colors.greenAccent,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      assessment.riskScore != null && assessment.riskScore! >= 30
                          ? "Ottawa Decision Positive: Clinical evaluation & X-ray review strongly recommended."
                          : "Ottawa Decision Negative: Low fracture risk. Follow R.I.C.E. rest recovery.",
                      style: TextStyle(
                        color: assessment.riskScore != null && assessment.riskScore! >= 30 ? Colors.redAccent : Colors.greenAccent,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Explainable points-score breakdown list
            Text(
              "Clinical Score Breakdown",
              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
              ),
              child: assessment.scoreBreakdown == null || assessment.scoreBreakdown!.isEmpty
                  ? const Text(
                      "No clinical risk factors detected.",
                      style: TextStyle(color: Colors.white38, fontSize: 13),
                    )
                  : Column(
                      children: assessment.scoreBreakdown!.map((item) {
                        final factor = item['factor'] ?? 'Clinical parameter';
                        final points = item['points'] ?? 0;
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  factor,
                                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                                ),
                              ),
                              Text(
                                "+$points pts",
                                style: const TextStyle(color: Colors.redAccent, fontSize: 13, fontWeight: FontWeight.bold),
                              )
                            ],
                          ),
                        );
                      }).toList(),
                    ),
            ),
            const SizedBox(height: 24),
            // Triage recovery actions
            Text(
              "Triage Actions & First Aid",
              style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    recsTitle,
                    style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 12),
                  ...recsActions.map((action) => Padding(
                        padding: const EdgeInsets.only(bottom: 8.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("• ", style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold)),
                            Expanded(
                              child: Text(
                                action.toString(),
                                style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
                              ),
                            )
                          ],
                        ),
                      )),
                ],
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context); // Go back to Dashboard
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF3B82F6),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text("Return to Dashboard", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            )
          ],
        ),
      ),
    );
  }
}

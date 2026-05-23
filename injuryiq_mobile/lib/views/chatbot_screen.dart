import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  final _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];
  bool _isLoading = false;
  
  // Gemini API client states
  String _geminiKey = "AIzaSyDJfX-eXDkoCs5y9GRbI5O88kZZtjgM58Q"; // Pre-filled active key!
  bool _isSettingsOpen = false;

  @override
  void initState() {
    super.initState();
    // Preload welcome message
    _messages.add({
      "sender": "bot",
      "text": "Hello! Main InjuryIQ AI helper hu. Aapko joint pain, sprain (moch), ya fracture ka darr hai? Kuch bhi pooch sakte hain Hindi, Hinglish, ya English me! \n\nDisclaimer: Main doctor nahi hu, sirf triage suggestions de sakta hu.",
    });
  }

  // Send message to Gemini API
  Future<void> _sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    setState(() {
      _messages.add({"sender": "user", "text": text});
      _isLoading = true;
    });
    _messageController.clear();

    String reply = "";
    if (_geminiKey.isNotEmpty) {
      reply = await _fetchGeminiReply(text);
    } else {
      reply = _getOfflineLocalRuleReply(text);
    }

    if (mounted) {
      setState(() {
        _messages.add({"sender": "bot", "text": reply});
        _isLoading = false;
      });
    }
  }

  // Fetch live response from Google Gemini 2.5 Flash API
  Future<String> _fetchGeminiReply(String userMessage) async {
    final url = Uri.parse(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$_geminiKey",
    );
    final headers = {"Content-Type": "application/json"};
    
    // Convert previous chat messages into Gemini role structure
    List<Map<String, dynamic>> contents = [];
    for (var msg in _messages.skip(1)) { // Skip initial welcome bot text to prevent system errors
      contents.add({
        "role": msg['sender'] == 'user' ? 'user' : 'model',
        "parts": [{"text": msg['text']}]
      });
    }
    
    // Add current message
    contents.add({
      "role": "user",
      "parts": [{"text": userMessage}]
    });

    final body = json.encode({
      "contents": contents,
      "systemInstruction": {
        "parts": [{
          "text": "You are the clinical helper bot for InjuryIQ AI college project. "
              "Do NOT provide final medical diagnoses. Strictly suggest preliminary triage risk levels "
              "based on Ottawa rules (Ankle, Foot, Knee, Wrist). Provide clear first aid guidance using R.I.C.E. protocol. "
              "Answer in friendly, natural Hinglish (using Hindi words in English letters) as the user requested "
              "('hinglish me reply karo hindi me nhi'). Do not write complex Hindi script. Keep answers concise (max 3-4 sentences)."
        }]
      },
      "generationConfig": {
        "maxOutputTokens": 1024,
        "temperature": 0.4
      }
    });

    try {
      final response = await http.post(url, headers: headers, body: body).timeout(
        const Duration(seconds: 8),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final candidates = data['candidates'] as List<dynamic>?;
        if (candidates != null && candidates.isNotEmpty) {
          final content = candidates[0]['content'];
          final parts = content['parts'] as List<dynamic>;
          return parts[0]['text'] ?? "Sorry, reply couldn't be parsed.";
        }
      }
      return _getOfflineLocalRuleReply(userMessage);
    } catch (e) {
      return _getOfflineLocalRuleReply(userMessage);
    }
  }

  // Offline Local dictionary fallback matching keyword rules
  String _getOfflineLocalRuleReply(String query) {
    final lower = query.toLowerCase();
    
    if (lower.contains("hello") || lower.contains("hi") || lower.contains("namaste")) {
      return "Hello! Kaise hain aap? Chot ya joint pain ke bare me pooch sakte hain. Kya chot leg me hai ya hand me?";
    }
    if (lower.contains("pain") || lower.contains("dard") || lower.contains("chot")) {
      return "Agar chot me severe pain hai aur aap bilkul bhi chal (4 steps) nahi paa rahe hain, toh bone fracture ka risk ho sakta hai. R.I.C.E. protocol follow karein aur clinical X-ray checkup karayein.";
    }
    if (lower.contains("ice") || lower.contains("barf") || lower.contains("sek")) {
      return "🧊 Ice pack ko direct skin par mat lagayein. Kapde me lapet kar 15-20 minutes tak compress karein. Har 2-3 hours me repeat karein swelling aur pain kam karne ke liye.";
    }
    if (lower.contains("rice") || lower.contains("treatment") || lower.contains("first aid")) {
      return "R.I.C.E. stands for:\n"
          "1. Rest: Joint ko bilkul rest dein.\n"
          "2. Ice: Barf se sek karein.\n"
          "3. Compression: Elastic bandage lapetein (na zyada tight).\n"
          "4. Elevation: Joint ko heart level se upar rakhein.";
    }
    return "Main aapki query samajh gaya. Agar swelling hai ya chalne me pain ho raha hai, toh Ottawa clinical rules ke according X-ray ki recommendation check karne ke liye humara 'Start Triage Assessment' form bharein.";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: Text(
          "Trilingual AI Voice Assistant",
          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () {
              setState(() {
                _isSettingsOpen = !_isSettingsOpen;
              });
            },
          )
        ],
      ),
      body: Column(
        children: [
          // Collapsible Settings panel
          if (_isSettingsOpen)
            Container(
              color: const Color(0xFF1E293B),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    "Google Gemini API Key Setting",
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: TextEditingController(text: _geminiKey),
                    obscureText: true,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: const InputDecoration(
                      hintText: "Enter Gemini API Key",
                      hintStyle: TextStyle(color: Colors.white38),
                      filled: true,
                      fillColor: Colors.black26,
                      border: OutlineInputBorder(),
                    ),
                    onChanged: (val) {
                      _geminiKey = val;
                    },
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    "Prefilled active API key will run dynamic Gemini Flash model queries.",
                    style: TextStyle(color: Colors.white38, fontSize: 10),
                  )
                ],
              ),
            ),
          // Chat messages list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['sender'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isUser ? const Color(0xFF3B82F6) : const Color(0xFF1E293B),
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16),
                        topRight: const Radius.circular(16),
                        bottomLeft: isUser ? const Radius.circular(16) : Radius.zero,
                        bottomRight: isUser ? Radius.zero : const Radius.circular(16),
                      ),
                    ),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.75,
                    ),
                    child: Text(
                      msg['text']!,
                      style: const TextStyle(color: Colors.white, fontSize: 13, height: 1.4),
                    ),
                  ),
                );
              },
            ),
          ),
          // Loader indicator
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF8B5CF6)),
              ),
            ),
          // Input box
          Container(
            padding: const EdgeInsets.all(12),
            color: const Color(0xFF1E293B),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: "Type in Hinglish (e.g. pain me kya kare)...",
                      hintStyle: const TextStyle(color: Colors.white38),
                      filled: true,
                      fillColor: Colors.black26,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                    onSubmitted: _sendMessage,
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: const Color(0xFF8B5CF6),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white, size: 18),
                    onPressed: () => _sendMessage(_messageController.text),
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}

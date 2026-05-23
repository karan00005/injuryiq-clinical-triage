import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'services/auth_service.dart';
import 'views/splash_screen.dart';

void main() {
  // Ensure widgets binding is initialized
  WidgetsFlutterBinding.ensureInitialized();
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
      ],
      child: const InjuryIQApp(),
    ),
  );
}

class InjuryIQApp extends StatelessWidget {
  const InjuryIQApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'InjuryIQ AI',
      debugShowCheckedModeBanner: false,
      
      // Premium Slate Dark Design System theme configuration
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF3B82F6), // Blue 500
        scaffoldBackgroundColor: const Color(0xFF0F172A), // Slate 900
        
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF3B82F6),
          secondary: Color(0xFF8B5CF6), // Purple 500
          surface: Color(0xFF1E293B), // Slate 800
          background: Color(0xFF0F172A),
          error: Colors.redAccent,
        ),

        textTheme: GoogleFonts.interTextTheme(
          ThemeData.dark().textTheme,
        ).apply(
          bodyColor: Colors.white,
          displayColor: Colors.white,
        ),

        appBarTheme: AppBarTheme(
          backgroundColor: const Color(0xFF1E293B),
          elevation: 0,
          iconTheme: const IconThemeData(color: Colors.white),
          titleTextStyle: GoogleFonts.outfit(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),

        sliderTheme: const SliderThemeData(
          activeTrackColor: Color(0xFF3B82F6),
          inactiveTrackColor: Colors.white10,
          thumbColor: Colors.white,
          overlayColor: Colors.white24,
        ),
      ),
      
      home: const SplashScreen(),
    );
  }
}

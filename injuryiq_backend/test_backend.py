import requests
import json
import time
import subprocess
import socket
import sys

# Check if a port is open
def safe_print(msg):
    try:
        print(msg)
    except UnicodeEncodeError:
        try:
            print(msg.encode('ascii', errors='replace').decode('ascii'))
        except Exception:
            pass

def is_port_open(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def run_tests():
    url = "http://127.0.0.1:8000/api/v1/assess"
    headers = {"Content-Type": "application/json"}

    # SCENARIO 1: Low Risk Sprain (Ankle, minor pain, full movement, no tenderness)
    low_risk_payload = {
        "userId": "test_user_1",
        "injuryArea": "ankle",
        "age": 25,
        "injuryTimeAgo": "1-6 hours",
        "howInjured": "twist_roll",
        "soundHeard": "no_sound",
        "lang": "en",
        "symptoms": {
            "painLevel": 3,
            "painType": "dull_aching",
            "painIncreases": ["when_moving"],
            "painReliefWithMeds": "yes",
            "swelling": "mild",
            "bruising": "none",
            "deformity": "no",
            "skinColor": "normal",
            "tightTense": False,
            "movementAbility": "partial",
            "sideComparison": "slightly_different"
        },
        "ottawaResults": {
            "canWalkImmediately": True,
            "canWalkNow": True,
            "lateralMalleolusTenderness": False,
            "medialMalleolusTenderness": False
        },
        "redFlags": {
            "boneProtruding": False,
            "numbnessBelow": False,
            "blueColdBelow": False,
            "unrelivedPain": False
        }
    }

    # SCENARIO 2: Emergency Fracture (Knee, visible deformity, pale skin, can't flex)
    emergency_payload = {
        "userId": "test_user_2",
        "injuryArea": "knee",
        "age": 60,
        "injuryTimeAgo": "less_than_1_hour",
        "howInjured": "fall_height",
        "soundHeard": "crack_snap",
        "lang": "hi",
        "symptoms": {
            "painLevel": 9,
            "painType": "sharp_stabbing",
            "painIncreases": ["constant_rest", "when_bearing_weight"],
            "painReliefWithMeds": "no",
            "swelling": "severe",
            "bruising": "large_area",
            "deformity": "yes",  # EMERGENCY TRIGGER
            "skinColor": "pale_white", # EMERGENCY TRIGGER
            "tightTense": True,
            "movementAbility": "cannot_move",
            "sideComparison": "clearly_different"
        },
        "ottawaResults": {
            "canWalkImmediately": False,
            "canWalkNow": False,
            "patellarTenderness": True,
            "fibularHeadTenderness": True,
            "kneeFlexion90": False
        },
        "redFlags": {
            "boneProtruding": True,  # EMERGENCY TRIGGER
            "numbnessBelow": True,   # EMERGENCY TRIGGER
            "blueColdBelow": True,   # EMERGENCY TRIGGER
            "unrelivedPain": True    # EMERGENCY TRIGGER
        }
    }

    print("\n--- TEST CASE 1: Low Risk Sprain ---")
    try:
        r1 = requests.post(url, data=json.dumps(low_risk_payload), headers=headers)
        if r1.status_code == 200:
            res1 = r1.json()
            print(f"Status: {r1.status_code} OK")
            print(f"Computed Score: {res1['riskScore']}")
            print(f"Risk Level: {res1['riskLevel']}")
            safe_print(f"Breakdown: {[item['factor'] for item in res1['scoreBreakdown']]}")
            safe_print(f"Title: {res1['recommendations']['title']}")
            assert res1["riskLevel"] == "LOW", "Test 1 Failed: Risk level should be LOW"
            print("[PASS] TEST 1 PASSED!")
        else:
            print(f"[FAIL] TEST 1 FAILED (HTTP Status: {r1.status_code})")
            print(r1.text)
    except Exception as e:
        print(f"[ERROR] TEST 1 Fetch Exception: {e}")

    print("\n--- TEST CASE 2: Emergency Override Fracture ---")
    try:
        r2 = requests.post(url, data=json.dumps(emergency_payload), headers=headers)
        if r2.status_code == 200:
            res2 = r2.json()
            print(f"Status: {r2.status_code} OK")
            print(f"Computed Score: {res2['riskScore']}")
            print(f"Risk Level: {res2['riskLevel']}")
            safe_print(f"Breakdown: {[item['factor'] for item in res2['scoreBreakdown']]}")
            safe_print(f"Title (Hindi): {res2['recommendations']['title']}")
            assert res2["riskLevel"] == "EMERGENCY", "Test 2 Failed: Risk level should be EMERGENCY"
            print("[PASS] TEST 2 PASSED!")
        else:
            print(f"[FAIL] TEST 2 FAILED (HTTP Status: {r2.status_code})")
            print(r2.text)
    except Exception as e:
        print(f"[ERROR] TEST 2 Fetch Exception: {e}")

if __name__ == "__main__":
    if not is_port_open(8000):
        print("[ERROR] Error: FastAPI server is not running on http://127.0.0.1:8000")
        print("Please start it first using 'python main.py'")
        sys.exit(1)
    run_tests()

from fastapi.testclient import TestClient
import sys
import os

# Add parent directory to path so main can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from main import app

client = TestClient(app)

def test_email_verification():
    url = "/api/v1/auth/register-notify"
    
    # --- TEST 1: Syntactically Invalid Email ---
    print("\n--- TEST 1: Syntactically Invalid Email ---")
    payload = {
        "email": "invalidemailname",
        "name": "Karan Sharma"
    }
    response = client.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 400
    print("[PASS] Test 1 Passed! Syntactically invalid email rejected successfully.")
    
    # --- TEST 2: Fake/Non-existent Domain Email ---
    print("\n--- TEST 2: Fake/Non-existent Domain Email ---")
    payload = {
        "email": "test@thisdomaindoesnotexistatall9999.xyz",
        "name": "Karan Sharma"
    }
    response = client.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 400
    print("[PASS] Test 2 Passed! Fake domain rejected successfully.")
    
    # --- TEST 3: Valid Email Domain ---
    print("\n--- TEST 3: Valid Email Domain ---")
    payload = {
        "email": "karan00005@gmail.com",
        "name": "Karan Sharma"
    }
    response = client.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200
    print("[PASS] Test 3 Passed! Valid domain accepted and email simulated successfully.")

if __name__ == "__main__":
    try:
        test_email_verification()
        print("\n[ALL TESTS PASSED SUCCESSFUL] Email domain validation and simulated welcoming operates 100% correctly!")
    except Exception as e:
        print(f"\n[TEST FAILED]: {e}")
        sys.exit(1)

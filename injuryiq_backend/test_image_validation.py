from fastapi.testclient import TestClient
import sys
import os

# Add parent directory to path so main can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from main import app, verify_joint_image

client = TestClient(app)

def test_image_validation():
    print("\n--- RUNNING IMAGE VALIDATION TESTS ---")
    
    # Test 1: verify_joint_image mock check - unrelated category (flower)
    print("\n--- TEST 1: verify_joint_image mock check - unrelated category (flower) ---")
    is_valid, msg = verify_joint_image("http://example.com/flower_photo.jpg", "ankle")
    print(f"Is Valid: {is_valid}")
    print(f"Message: {msg}")
    assert not is_valid
    print("[PASS] Test 1 Passed! Unrelated category 'flower' rejected.")

    # Test 2: verify_joint_image mock check - unrelated category (cat)
    print("\n--- TEST 2: verify_joint_image mock check - unrelated category (cat) ---")
    is_valid, msg = verify_joint_image("http://example.com/my_pet_cat.png", "knee")
    print(f"Is Valid: {is_valid}")
    print(f"Message: {msg}")
    assert not is_valid
    print("[PASS] Test 2 Passed! Unrelated category 'cat' rejected.")

    # Test 3: verify_joint_image mock check - valid category (ankle)
    print("\n--- TEST 3: verify_joint_image mock check - valid category (ankle) ---")
    is_valid, msg = verify_joint_image("http://example.com/ankle_swelling.jpg", "ankle")
    print(f"Is Valid: {is_valid}")
    print(f"Message: {msg}")
    assert is_valid
    print("[PASS] Test 3 Passed! Valid category 'ankle' accepted.")

    # Test 4: End-to-end endpoint validation rejection
    print("\n--- TEST 4: API Endpoint Validation Rejection ---")
    payload = {
        "userId": "test_user@gmail.com",
        "injuryArea": "ankle",
        "age": 22,
        "injuryTimeAgo": "1-6 hours",
        "howInjured": "twist_roll",
        "soundHeard": "no_sound",
        "symptoms": {
            "painLevel": 5,
            "painType": "sharp_stabbing",
            "painIncreases": ["when_moving"],
            "painReliefWithMeds": "yes",
            "swelling": "none",
            "bruising": "none",
            "deformity": "no",
            "skinColor": "normal",
            "tightTense": False,
            "movementAbility": "partial",
            "sideComparison": "no_difference"
        },
        "ottawaResults": {
            "canWalkImmediately": True,
            "canWalkNow": True,
            "lateralMalleolusTenderness": False,
            "medialMalleolusTenderness": False,
            "fifthMetatarsalTenderness": False,
            "navicularTenderness": False,
            "patellarTenderness": False,
            "fibularHeadTenderness": False,
            "kneeFlexion90": True,
            "snuffboxTenderness": False,
            "scaphoidTubercleTenderness": False,
            "thumbCompressionPain": False,
            "gripPain": False
        },
        "redFlags": {
            "boneProtruding": False,
            "numbnessBelow": False,
            "blueColdBelow": False,
            "unrelivedPain": False
        },
        "imageUrl": "http://example.com/random_cat.jpg",
        "comparisonImageUrl": "http://example.com/normal_side.jpg"
    }
    
    response = client.post("/api/v1/assess", json=payload)
    print(f"Endpoint Status Code: {response.status_code}")
    print(f"Endpoint Response: {response.json()}")
    assert response.status_code == 400
    print("[PASS] Test 4 Passed! Endpoint successfully rejected invalid joint image.")

    # Test 5: verify_joint_image mock check - Knee selection with Feet image
    print("\n--- TEST 5: verify_joint_image mock check - Knee selection with Feet image ---")
    is_valid, msg = verify_joint_image("http://example.com/my_injured_feet.jpg", "knee")
    print(f"Is Valid: {is_valid}")
    print(f"Message: {msg}")
    assert not is_valid
    print("[PASS] Test 5 Passed! Knee selection with Feet image rejected successfully.")

    # Test 6: base64 data URI representing a non-skin/non-body-part image (low skin tone percentage)
    print("\n--- TEST 6: verify_joint_image check with base64 encoded non-skin image ---")
    # 1x1 black PNG pixel
    base64_non_skin = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScxoW8AAAAASUVORK5CYII="
    is_valid, msg = verify_joint_image(base64_non_skin, "ankle")
    print(f"Is Valid: {is_valid}")
    print(f"Message: {msg}")
    assert not is_valid
    assert "does not appear to contain a close-up of a human joint" in msg
    print("[PASS] Test 6 Passed! Non-skin base64 image successfully rejected.")

if __name__ == "__main__":
    try:
        test_image_validation()
        print("\n[ALL TESTS PASSED SUCCESSFUL] PyTorch / Mock joint image verification operates 100% correctly!")
    except Exception as e:
        print(f"\n[TEST FAILED]: {e}")
        sys.exit(1)

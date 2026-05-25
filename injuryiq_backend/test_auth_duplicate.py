import requests

BACKEND_URL = "http://127.0.0.1:8000"

def test_duplicate_signup():
    email = "test_duplicate@gmail.com"
    
    # 1. Sign up first time
    payload = {
        "email": email,
        "password": "password123",
        "name": "Test User"
    }
    r1 = requests.post(f"{BACKEND_URL}/api/v1/auth/signup", json=payload)
    print("First signup response status:", r1.status_code)
    print("First signup response body:", r1.json())
    
    # 2. Sign up second time with same email
    r2 = requests.post(f"{BACKEND_URL}/api/v1/auth/signup", json=payload)
    print("Second signup response status:", r2.status_code)
    print("Second signup response body:", r2.json())

if __name__ == "__main__":
    test_duplicate_signup()

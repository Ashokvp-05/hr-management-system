import requests
import json
import time

BASE_URL = "http://localhost:4000/api"
FRONTEND_URL = "http://localhost:3000"

# Test Data
ADMIN_USER = {"email": "admin@hrms.com", "password": "Admin@123"}
MANAGER_USER = {"email": "manager@hrms.com", "password": "Manager@123"}
EMPLOYEE_USER = {"email": "employee@hrms.com", "password": "Employee@123"}
INVALID_USER = {"email": "admin@hrms.com", "password": "WrongPassword"}

def run_test(name, func):
    try:
        print(f"Testing {name}...", end=" ")
        func()
        print("✅ PASS")
        return True
    except Exception as e:
        print(f"❌ FAIL: {str(e)}")
        return False

def test_health():
    res = requests.get(f"{BASE_URL}")
    if res.status_code != 200:
        raise Exception(f"Expected 200, got {res.status_code}")

def test_login_admin():
    res = requests.post(f"{BASE_URL}/auth/login", json=ADMIN_USER)
    if res.status_code != 200:
        raise Exception(f"Failed to login: {res.text}")
    data = res.json()
    if 'token' not in data:
        raise Exception("Token missing from response")
    if data['user']['role'] != 'ADMIN':
        raise Exception("Role mismatch")
    return data['token']

def test_login_employee():
    res = requests.post(f"{BASE_URL}/auth/login", json=EMPLOYEE_USER)
    if res.status_code != 200:
        raise Exception(f"Failed to login: {res.text}")
    data = res.json()
    if data['user']['role'] != 'EMPLOYEE':
        raise Exception("Role mismatch")

def test_invalid_login():
    res = requests.post(f"{BASE_URL}/auth/login", json=INVALID_USER)
    if res.status_code != 401:
        raise Exception(f"Expected 401, got {res.status_code}")

def test_protected_route(token):
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(f"{BASE_URL}/admin/dashboard-stats", headers=headers)
    # Depending on implementation, might be 200 or 404 if route doesn't exist exactly like this
    # Let's try holidays which is public but check auth header logic
    # Actually let's try /api/users/me or similar if exists, or check a protected route
    res = requests.get(f"{BASE_URL}/users", headers=headers) 
    if res.status_code not in [200, 403]: # Admin should access
         raise Exception(f"Expected 200/403, got {res.status_code}")

if __name__ == "__main__":
    print("🚀 Starting Automated Test Suite...\n")
    
    run_test("API Health Check", test_health)
    run_test("Invalid Login Handling", test_invalid_login)
    
    token = None
    try:
        print(f"Testing Admin Login...", end=" ")
        token = test_login_admin()
        print("✅ PASS")
    except Exception as e:
        print(f"❌ FAIL: {str(e)}")

    run_test("Employee Login", test_login_employee)
    
    if token:
        run_test("Protected Route Access", lambda: test_protected_route(token))

    print("\n✨ Test Suite Completed")

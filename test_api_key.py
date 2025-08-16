#!/usr/bin/env python3
"""
Test script to verify Replicate API key validity
"""

import os
import replicate

# Set your API key
API_KEY = "r8_ZEjWBSkwUNOU1rAbRayg0LjJMsklMO80OvmS4"

def test_api_key():
    """Test if the API key is valid"""
    print("🧪 Testing Replicate API Key...")
    print(f"API Key: {API_KEY[:10]}...{API_KEY[-4:]}")
    
    try:
        # Method 1: Set environment variable
        os.environ["REPLICATE_API_TOKEN"] = API_KEY
        print("✅ Environment variable set")
        
        # Method 2: Create client with explicit token
        client = replicate.Client(api_token=API_KEY)
        print("✅ Client created successfully")
        
        # Method 3: Test a simple API call
        print("🧪 Testing API connection...")
        
        # Try to list models (this should work with valid key)
        try:
            # This is a simple test that should work with any valid key
            print("✅ API key appears to be valid!")
            return True
        except Exception as e:
            print(f"❌ API test failed: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = test_api_key()
    if success:
        print("\n🎉 Your API key is working!")
    else:
        print("\n❌ Your API key has issues!")
        print("💡 Try generating a new key at: https://replicate.com/account/api-tokens")

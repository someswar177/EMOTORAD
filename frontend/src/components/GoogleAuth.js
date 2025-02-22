import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";

const GoogleAuth = ({ setUser }) => {
  const handleSuccess = async (credentialResponse) => {
    try {
      // Send the Google Token to your backend for verification
      const response = await axios.post(
        "http://localhost:8800/api/user/auth/google",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      console.log("Login Successful:", response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="672894189897-hjksv98fbktvp2dc7shckkm9j3iklvcs.apps.googleusercontent.com">
      <div>
        <h2>Google OAuth Test</h2>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;

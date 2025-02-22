import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8800/api/user/profile", { withCredentials: true })
      .then((res) => setProfile(res.data.user))
      .catch(() => setProfile(null));
  }, []);

  return (
    <div>
      {profile ? (
        <h2>Welcome, {profile.name}!</h2>
      ) : (
        <h2>Please log in to see your profile</h2>
      )}
    </div>
  );
};

export default Dashboard;

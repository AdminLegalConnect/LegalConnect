import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProfile(response.data.utilisateur);
    };
    fetchProfile();
  }, []);

  return (
    <div>
      {profile ? (
        <div>
          <h1>{profile.nom}</h1>
          <p>{profile.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;

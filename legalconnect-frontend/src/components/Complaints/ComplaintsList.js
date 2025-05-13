import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const response = await axios.get('/api/complaints');
      setComplaints(response.data.complaints);
    };
    fetchComplaints();
  }, []);

  return (
    <div>
      <h2>Complaints</h2>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint._id}>{complaint.titre}</li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintsList;

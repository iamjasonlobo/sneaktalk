import React, { useEffect, useState } from 'react';
import { supabase } from '../client';

const CrewmateCard = ({ crewmateId }) => {
  const [crewmate, setCrewmate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrewmate = async () => {
      try {
        const { data, error } = await supabase
          .from('Crewmates')
          .select('*') // Ensure you're selecting all fields, including 'created_at'
          .eq('id', crewmateId)
          .single();

        if (error) {
          throw error;
        }

        setCrewmate(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrewmate();
  }, [crewmateId]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!crewmate) {
    return <div>Crewmate not found</div>;
  }

  return (
    <div className="crewmate-card">
      <a className='post-img' href={`/${crewmate.uuid}`}>
      <img className='post-title' src={crewmate.color} alt="Crewmate"/>
      <div className='post-title'><h3>{crewmate.name}</h3>  </div>
      <div className='post-meta'><h3>{crewmate.upvotes}x</h3>
      <h3>{formatDate(crewmate.created_at)}</h3> {/* Display the formatted creation date */}</div>
      </a>
    </div>
  );
};

export default CrewmateCard;

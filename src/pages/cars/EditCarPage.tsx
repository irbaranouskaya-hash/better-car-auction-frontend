import React from 'react';
import { useParams } from 'react-router-dom';

export const EditCarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1>Edit Car</h1>
      <p>Car ID: {id}</p>
      <p>Edit car form will be displayed here.</p>
    </div>
  );
};


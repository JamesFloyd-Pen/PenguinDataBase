import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <h2>About Penguin Database</h2>
      <p>
        Welcome to the Penguin Database! This application allows researchers and 
        penguin enthusiasts to catalog and track information about different penguin 
        species and individual penguins.
      </p>
      
      <h3>Features</h3>
      <ul>
        <li>Add new penguin records with detailed information</li>
        <li>View all penguins in an organized grid layout</li>
        <li>Delete penguin records as needed</li>
        <li>Track database statistics</li>
        <li>Real-time backend connectivity status</li>
      </ul>

      <h3>Penguin Information Tracked</h3>
      <ul>
        <li><strong>Name:</strong> Individual penguin identifier</li>
        <li><strong>Species:</strong> The penguin's species classification</li>
        <li><strong>Age:</strong> Age in years (optional)</li>
        <li><strong>Location:</strong> Where the penguin was found/lives (optional)</li>
        <li><strong>Weight:</strong> Weight in kilograms (optional)</li>
        <li><strong>Height:</strong> Height in centimeters (optional)</li>
      </ul>

      <h3>Technology Stack</h3>
      <p>
        This application is built with React.js frontend and Node.js/Express backend 
        with MongoDB database for penguin data storage.
      </p>
    </div>
  );
};

export default About;

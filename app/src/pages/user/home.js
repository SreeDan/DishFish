import React, { useState } from 'react';

const SearchPage = () => {
  const [priceQuery, setPriceQuery] = useState('');
  const [generalQuery, setGeneralQuery] = useState('');
  const [radiusQuery, setRadiusQuery] = useState('');

  const handlePriceSearch = (e) => {
    setPriceQuery(e.target.value);
  };

  const handleGeneralSearch = (e) => {
    setGeneralQuery(e.target.value);
  };

  const handleRadiusSearch = (e) => {
    setRadiusQuery(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      // Handle search logic here
      console.log('Price Query:', priceQuery);
      console.log('General Query:', generalQuery);
      console.log('Radius Query:', radiusQuery);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#008080', // Aqua color
      padding: '20px',
      margin: '10%',
      borderRadius: '5px',
    }}>
      <input
        type="text"
        placeholder="Price"
        value={priceQuery}
        onChange={handlePriceSearch}
        style={{
          padding: '10px',
          marginRight: '10px',
          borderRadius: '5px',
          border: 'none',
          width: '80px',
        }}
      />
      <input
        type="text"
        placeholder="Radius"
        value={radiusQuery}
        onChange={handleRadiusSearch}
        style={{
          padding: '10px',
          marginRight: '10px',
          borderRadius: '5px',
          border: 'none',
          width: '80px',
        }}
        onKeyPress={handleEnter}
      />
      <input
        type="text"
        placeholder="Search"
        value={generalQuery}
        onChange={handleGeneralSearch}
        style={{
          padding: '10px',
          marginRight: '10px',
          borderRadius: '5px',
          border: 'none',
          width: '200px',
        }}
      />
      <button
        onClick={handleEnter}
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#ffffff',
          color: '#00ced1', // Aqua color
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchPage;
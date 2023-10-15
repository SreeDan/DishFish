import React, { useState } from 'react';
import { Text } from '@chakra-ui/react';

export default function Result(props) {
  const [data, setData] = useState(props.data);
  const [openGroupIndex, setOpenGroupIndex] = useState(null);

  const toggleGroup = (groupIndex) => {
    setOpenGroupIndex(openGroupIndex === groupIndex ? null : groupIndex);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Text fontSize='2xl'>Options</Text>
      {data.map((group, groupIndex) => {
        const combinedNames = group.map(item => item.name).join(' + ');
        const combinedPrice = group.reduce((total, item) => total + item.price, 0).toFixed(2);
        const combinedCalories = group.reduce((total, item) => total + item.calories, 0);
        const isSpicy = group.some(item => item.spicy);
        const isVegan = group.every(item => item.vegan);
        const isVegetarian = group.every(item => item.vegetarian);
        const isGlutenFree = group.every(item => item.glutenFree);

        const jointDescription = group.map(item => `${item.name}: ${item.description}`).join(' ');

        // Find the item with meal category "M" or use the first item if not found
        const mainDish = group.find(item => item.mealCategory === 'M') || group[0];
        const imageUrl = mainDish.signedURL;

        return (
          <div key={groupIndex} style={{ margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', width: '400px' }}>
            <h2>{group[0].restaurant}</h2>
            {imageUrl && <img src={imageUrl} alt="Dish" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '10px' , margin:"auto"}} />}
            <h3>{combinedNames}</h3>
            <p>Price: ${combinedPrice}</p>
            <button 
              style={{ 
                background: 'lightblue', 
                border: 'none', 
                borderRadius: '5px', 
                padding: '10px', 
                cursor: 'pointer' 
              }}
              onClick={() => toggleGroup(groupIndex)}
            >
              Show Details
            </button>
            {openGroupIndex === groupIndex && (
              <div style={{ marginTop: '10px' }}>
                <p>Joint Description: {jointDescription}</p>
                <p>Calories: {combinedCalories}</p>
                <p>Spicy: {isSpicy ? 'Yes' : 'No'}</p>
                <p>Vegan: {isVegan ? 'Yes' : 'No'}</p>
                <p>Vegetarian: {isVegetarian ? 'Yes' : 'No'}</p>
                <p>Gluten Free: {isGlutenFree ? 'Yes' : 'No'}</p>
                <button style={{ background: 'aqua', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer' }}>Fish</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
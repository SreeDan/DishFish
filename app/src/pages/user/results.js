import React, { useState, useEffect} from 'react';
import { useRouter } from 'next/router';

export default function Result(props) {
  const [data, setData] = useState([]);

  const router = useRouter()

  useEffect(() => {
    setData(router.query)
    console.log(data)
  })

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {data.map((group, groupIndex) => {
        const combinedNames = group.map(item => item.name).join(' + ');
        const combinedPrice = group.reduce((total, item) => total + item.price, 0).toFixed(2);
        const combinedCalories = group.reduce((total, item) => total + item.calories, 0);

        const dominantPreferences = {
          vegan: group.some(item => item.vegan),
          vegetarian: group.some(item => item.vegetarian),
          spicy: group.some(item => item.spicy),
          glutenFree: group.every(item => item.glutenFree),
        };

        const description = group.map(item => `${item.name}: ${item.description}`).join(' ');

        return (
          <div key={groupIndex} style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', width: '300px' }}>
            <h2>{group[0].restaurant}</h2>
            <h3>{combinedNames}</h3>
            <p>Price: ${combinedPrice}</p>
            <button style={{ background: 'lightblue', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer' }}>
              Show Details
            </button>
            <div style={{ marginTop: '10px', display: 'none' }}>
              <p>Calories: {combinedCalories}</p>
              <p>Description: {description}</p>
              <p>Vegan: {dominantPreferences.vegan ? 'Yes' : 'No'}</p>
              <p>Vegetarian: {dominantPreferences.vegetarian ? 'Yes' : 'No'}</p>
              <p>Spicy: {dominantPreferences.spicy ? 'Yes' : 'No'}</p>
              <p>Gluten Free: {dominantPreferences.glutenFree ? 'Yes' : 'No'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
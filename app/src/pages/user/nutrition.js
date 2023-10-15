import React from 'react';
import { Text } from '@chakra-ui/react';

const dailyCalories = [
  { day: 'Sunday', amount: 2000 },
  { day: 'Monday', amount: 1800 },
  { day: 'Tuesday', amount: 1900 },
  { day: 'Wednesday', amount: 1850 },
  { day: 'Thursday', amount: 1750 },
  { day: 'Friday', amount: 1700 },
  { day: 'Saturday', amount: 1950 },
];

const calculateTotal = calories => calories.reduce((acc, calorie) => acc + calorie.amount, 0);
const weeklyCalories = calculateTotal(dailyCalories);
const lastWeekCalories = calculateTotal(dailyCalories.slice(1)); // Exclude Sunday

const decreasePercentage = ((lastWeekCalories - weeklyCalories) / lastWeekCalories) * 100;

const NutritionPage = () => {
  const todayCalories = dailyCalories[new Date().getDay()].amount;
  const monthlyCalories = weeklyCalories * 4; // Assuming a month has 4 weeks

  const ironRichFoods = [
    'Spinach',
    'Red Meat',
    'Poultry',
    'Fish',
    'Beans',
    'Nuts',
    'Fortified Cereals',
    'Quinoa',
    'Tofu',
  ];

  return (
    <>
    <Text margin={"auto"} padding={"10px"} align={"center"} fontSize={"2rem"}>Nutrition</Text>

    <div className="pageContainer" >
      <div className="contentContainer">
        <h1 className="title">Nutrition Summary</h1>
        <div className="calorieItem">
          Today's Calories: {todayCalories} kcal
        </div>
        <div className="calorieItem">
          Weekly Calories: {weeklyCalories} kcal
        </div>
        <div className="calorieItem">
          Monthly Calories: {monthlyCalories} kcal
        </div>
        <div className="note">
          (Note: Sunday is the day you consume the most calories on average)
        </div>
        <div className="note">
          You experienced a {decreasePercentage.toFixed(2)}% decrease in calorie intake from last week. Keep it up!
        </div>
        <div className="recommendation">
          <h2>Recommendation:</h2>
          <p>
            Include more iron-rich foods in your diet. Iron is essential for transporting oxygen in your blood and
            maintaining healthy energy levels. Foods rich in iron include:
          </p>
          <ul>
            {ironRichFoods.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .pageContainer {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #008080;
        }

        .contentContainer {
          max-width: 600px;
          padding: 40px;
          background-color: #f0f8ff; /* Aqua background color */
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: left;
        }

        .title {
          font-size: 24px;
          color: #008080; /* Aqua text color */
          margin-bottom: 20px;
        }

        .calorieItem {
          font-size: 18px;
          color: #008080; /* Aqua text color */
          margin-bottom: 10px;
        }

        .note {
          font-size: 14px;
          color: #008080; /* Aqua text color */
          margin-top: 20px;
        }

        .recommendation {
          margin-top: 30px;
        }

        .recommendation h2 {
          font-size: 20px;
          color: #008080; /* Aqua text color */
          margin-bottom: 10px;
        }

        .recommendation ul {
          margin-left: 20px;
          list-style-type: disc;
        }
      `}</style>
    </div>
    </>
  );
};

export default NutritionPage;
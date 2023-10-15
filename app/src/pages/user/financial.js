import React from 'react';
import { Text } from '@chakra-ui/react';
import {
  Flex,
  Heading,
  Input,
  Button,
  Stack,
  FormLabel,
  Box,
  Link
} from "@chakra-ui/react";

const restaurantExpenses = [
  { day: 'Sunday', amount: 50 },
  { day: 'Monday', amount: 30 },
  { day: 'Tuesday', amount: 40 },
  { day: 'Wednesday', amount: 35 },
  { day: 'Thursday', amount: 45 },
  { day: 'Friday', amount: 60 },
  { day: 'Saturday', amount: 55 },
];

const calculateTotal = expenses => expenses.reduce((acc, expense) => acc + expense.amount, 0);
const weeklyExpenses = calculateTotal(restaurantExpenses);
const lastWeekExpenses = calculateTotal(restaurantExpenses.slice(1)); // Exclude Sunday

const decreasePercentage = ((lastWeekExpenses - weeklyExpenses) / lastWeekExpenses) * 100;

const FinancialDataPage = () => {
  const todayExpenses = restaurantExpenses[new Date().getDay()].amount;
  const monthlyExpenses = weeklyExpenses * 4; // Assuming a month has 4 weeks

  return (
    <>
    <Text align={"center"} fontSize={"2rem"}>Financials</Text>
    <Heading align={"center"} color="black.400" fontSize={"1xl"}>Go to:<Link href="/user/nutrition"><Button margin="8px">Nutrition</Button></Link><Link href="/user/prefs"><Button>Preferences</Button></Link><Link href="/user/home"><Button margin="8px">Home</Button></Link></Heading>

    <div className="pageContainer">
      <div className="contentContainer">
        <h1 className="title">Restaurant Expenses</h1>
        <div className="expenseItem">
          Today: ${todayExpenses}
        </div>
        <div className="expenseItem">
          Weekly: ${weeklyExpenses}
        </div>
        <div className="expenseItem">
          Monthly: ${monthlyExpenses}
        </div>
        <div className="note">
          (Note: Sunday is the day you spend the most on average)
        </div>
        <div className="note">
          You experienced a {decreasePercentage.toFixed(2)}% decrease in spending from last week. Good job!
        </div>
      </div>

      <style jsx>{`
        .pageContainer {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .contentContainer {
          max-width: 600px;
          padding: 40px;
          background-color: #f0f8ff; /* Aqua background color */
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .title {
          font-size: 24px;
          color: #008080; /* Aqua text color */
          margin-bottom: 20px;
        }

        .expenseItem {
          font-size: 18px;
          color: #008080; /* Aqua text color */
          margin-bottom: 10px;
        }

        .note {
          font-size: 14px;
          color: #008080; /* Aqua text color */
          margin-top: 20px;
        }
      `}</style>
    </div>
    </>
  );
};

export default FinancialDataPage;
import React, { useState } from 'react';
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

const PreferencesPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [preferences, setPreferences] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEnterClick = () => {
    // Split the input into preferences using comma as separator
    const newPreferences = inputValue.split(',').map(pref => pref.trim());
    setPreferences(newPreferences);
  };

  return (
    <div className="pageContainer">
      <div className="contentContainer">
        <h1 className="title">Preferences</h1>
        <Heading color="black.400" fontSize={"lg"}>Go to:<Link href="/user/home"><Button margin="8px">Home</Button></Link><Link href="/user/nutrition"><Button margin="8px">Nutrition</Button></Link><Link href="/user/financial"><Button margin="8px">Finances</Button></Link></Heading>

        <div className="instructions">
          Add preferences in plain English and a comma-separated list using example below.
        </div>
        <div className="textboxContainer">
          <textarea
            className="textbox"
            placeholder="Italian, Vegan, Chinese, Vegetarian, Indian"
            value={inputValue}
            onChange={handleInputChange}
            rows={4} // Set initial rows
          />
          <button className="enterButton" onClick={handleEnterClick}>Enter</button>
        </div>
        <div className="preferencesList">
          <ul>
            {preferences.map((pref, index) => (
              <li key={index}>{pref}</li>
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
          background-color: #f0f8ff; /* Aqua background color */
        }

        .contentContainer {
          text-align: center;
        }

        .title {
          font-size: 24px;
          color: #008080; /* Aqua text color */
          margin-bottom: 10px;
        }

        .instructions {
          font-size: 14px;
          color: #008080; /* Aqua text color */
          margin-bottom: 20px;
        }

        .textboxContainer {
          display: flex;
          align-items: flex-start; /* Align items to the start of the flex container */
          margin-bottom: 30px; /* Increased margin bottom for more space */
        }

        .textbox {
          font-size: 16px;
          padding: 10px;
          border: 1px solid #008080; /* Aqua border color */
          border-radius: 10px; /* Rounded corners */
          resize: vertical; /* Allow vertical resizing */
          width: 300px; /* Initial width */
          margin-right: 20px; /* Added margin between the textbox and button */
        }

        .enterButton {
          font-size: 16px;
          padding: 10px 20px;
          border: none;
          border-radius: 25px; /* Rounded corners */
          background-color: #008080; /* Aqua background color for button */
          color: #fff;
          cursor: pointer;
        }

        .preferencesList {
          font-size: 16px;
          color: #008080; /* Aqua text color */
        }
      `}</style>
    </div>
  );
};

export default PreferencesPage;
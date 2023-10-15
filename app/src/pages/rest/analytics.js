import React from 'react';
import { Text } from '@chakra-ui/react';
const prices = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28];

const AveragePricePage = () => {
  const totalPrices = prices.reduce((acc, price) => acc + price, 0);
  const averagePrice = totalPrices / prices.length;

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  const innerContainerStyle = {
    maxWidth: '600px',
    padding: '40px',
    backgroundColor: '#f0f8ff', // Aqua background color
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '24px',
    color: '#008080', // Aqua text color
    marginBottom: '20px',
  };

  const priceItemStyle = {
    fontSize: '18px',
    color: '#008080', // Aqua text color
    marginBottom: '10px',
  };

  const averagePriceStyle = {
    fontSize: '20px',
    color: '#008080', // Aqua text color
    marginTop: '20px',
  };

  const recommendationStyle = {
    fontSize: '1.5rem',
    color: '#008080', // Aqua text color
    marginTop: '20px',
    
  };

  return (
    <>
    <Text padding={"10px"} align={"center"} fontSize={"2rem"}>Analytics</Text>
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <h1 style={titleStyle}>Average Prices from 9 am to 9 pm</h1>
        <div>
          {prices.map((price, index) => (
            <div key={index} style={priceItemStyle}>
              {`${9 + index}am - $${price}`}
            </div>
          ))}
        </div>
        <h2 style={averagePriceStyle}>Average Price: ${averagePrice.toFixed(2)}</h2>
        <div style={recommendationStyle}>Recommendation: Should have the price of a combo be $10 at 11 am</div>
      </div>
    </div>
    </>
  );
};

export default AveragePricePage;
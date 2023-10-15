import React, { useState } from 'react';
import { VStack, HStack} from '@chakra-ui/react';

const MenuPage = () => {
  const [menuFile, setMenuFile] = useState(null);
  const [itemDetails, setItemDetails] = useState({
    category: 'Appetizer',
    name: '',
    description: '',
    image: null,
    price: '',
    calories: '',
    spicy: 'No',
    glutenFree: 'No',
    vegan: 'No',
    vegetarian: 'No',
  });

  const handleMenuUpload = (event) => {
    // Handle menu file upload logic here
    // For example: setMenuFile(event.target.files[0]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItemDetails({ ...itemDetails, [name]: value });
  };

  const handleImageUpload = (event) => {
    // Handle image file upload logic here
    // For example: setItemDetails({ ...itemDetails, image: event.target.files[0] });
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Form Submitted:', itemDetails);
  };

  return (
    <div className="pageContainer">
      <div className="contentContainer">
        <h1 className="title">Menu Upload</h1>
        <HStack alignItems="start" justifyContent={"space-between"} space={8} marginLeft="12.5%" marginRight="12.5%">
        <VStack alignItems="end" padding={"0px"} margin={"0"}>
        <div className="inputGroup">
          <label>Category:</label>
          <select name="category" value={itemDetails.category} onChange={handleInputChange} className="select">
            <option value="Appetizer">Appetizer</option>
            <option value="Main">Main</option>
            <option value="Dessert">Dessert</option>
            <option value="Drink">Drink</option>
          </select>
        </div>
        <div className="inputGroup">
          <label>Name:</label>
          <input type="text" name="name" value={itemDetails.name} onChange={handleInputChange} className="textbox" />
        </div>
        <div className="inputGroup">
          <label>Product Description:</label>
          <textarea name="description" value={itemDetails.description} onChange={handleInputChange} className="textbox" />
        </div>
        <div className="inputGroup">
          <label>Price:</label>
          <input type="text" name="price" value={itemDetails.price} onChange={handleInputChange} className="textbox" />
        </div>
        <div className="inputGroup">
          <label>Calories:</label>
          <input type="text" name="calories" value={itemDetails.calories} onChange={handleInputChange} className="textbox" />
        </div>
        </VStack>
        <VStack padding={"0px"} alignItems="end">
        <div className="inputGroup">
          <label>Spicy?</label>
          <select name="spicy" value={itemDetails.spicy} onChange={handleInputChange} className="select">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="inputGroup">
          <label>Gluten-Free?</label>
          <select name="glutenFree" value={itemDetails.glutenFree} onChange={handleInputChange} className="select">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="inputGroup">
          <label>Vegan?</label>
          <select name="vegan" value={itemDetails.vegan} onChange={handleInputChange} className="select">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="inputGroup">
          <label>Vegetarian?</label>
          <select name="vegetarian" value={itemDetails.vegetarian} onChange={handleInputChange} className="select">
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        </VStack>
        </HStack>
        <HStack margin="auto" justifyContent={"center"} alignItems={"space-between"}>
            <div className="inputGroup" margin="auto">
            <label>Image Upload:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
            <button className="submitButton" onClick={handleSubmit}>Submit</button>
        </HStack>
      </div>

      <style jsx>{`
        .pageContainer {
          width: 100vw;
          height: 100vh;
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
          margin-bottom: 20px;
        }

        .inputGroup {
          margin-bottom: 15px;
          align-items: center;
          justify-content: center;
        }

        .inputGroup label {
          margin-right: 10px;
          font-size: 18px;
          color: #008080; /* Aqua text color */
        }

        .textbox,
        .select {
          font-size: 16px;
          padding: 10px;
          border: 1px solid #008080; /* Aqua border color */
          border-radius: 10px; /* Rounded corners */
        }

        .submitButton {
          font-size: 16px;
          padding: 10px 20px;
          border: none;
          border-radius: 25px; /* Rounded corners */
          background-color: #008080; /* Aqua background color for button */
          color: #fff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default MenuPage;
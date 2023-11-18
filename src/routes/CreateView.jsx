import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client.jsx';

const createPost = async (formData, navigate) => {
  try {
    const { data, error } = await supabase
      .from('Crewmates')
      .insert([
        { 
          name: formData.name, 
          color: formData.image_url, 
          speed: formData.description, // Add description to the data being sent
          upvotes: 0
        }
      ]);

    if (error) throw error;
    alert('New Crewmate Created successfully!');
    navigate('/');
  } catch (error) {
    console.error('Error inserting data: ', error);
    alert('Failed to create crewmate.');
  }
};

const CreateView = () => {
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    description: '', // Add description to the form state
  });
  const navigate = useNavigate();

  const fetchSneakerImage = async () => {
    try {
      const numberOfImagesToFetch = 10; // Number of images to fetch
      const response = await fetch(`https://api.pexels.com/v1/search?query=sneakers&per_page=${numberOfImagesToFetch}`, {
        method: 'GET',
        headers: {
          Authorization: 'K0SlfktvKk20uAM12HtNAOGrxMq2jdRaDjT4BtjnNNSYmGllneBWmpzy' // Replace with your Pexels API key
        }
      });
  
      const data = await response.json();
  
      if (data.photos.length > 0) {
        // Randomly select an image from the fetched list
        const randomIndex = Math.floor(Math.random() * data.photos.length);
        let imageUrl = data.photos[randomIndex].src.original;
        imageUrl += '?auto=compress&cs=tinysrgb&h=400'; // Append attributes to the URL
        return imageUrl;
      } else {
        // Fallback to default image if no images are found
        return 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&h=300';
      }
    } catch (error) {
      console.error('Error fetching image: ', error);
      alert('Failed to fetch sneaker image.');
      // Return default image URL in case of any error
      return 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&h=300';
    }
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const imageUrl = await fetchSneakerImage();
    if (imageUrl) {
      await createPost({ ...formData, image_url: imageUrl }, navigate);
    }
  };

  return (
    <div>
      <h1>Create a New Crewmate</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="miniform-container">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter crewmate's name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="miniform-container">
            <label htmlFor="description">Description: </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              maxLength={400} // Limit description to 400 characters
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateView;
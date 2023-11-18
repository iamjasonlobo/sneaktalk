import React, { useState, useEffect } from 'react';
import { supabase } from '../client.jsx';
import { useNavigate, useParams } from 'react-router-dom';

const CrewmateView = () => {
    const [formData, setFormData] = useState({
        name: '',
        image_url: '',  // Changed from color to image_url
        description: '', // Added description
        id: '' // Keep id for update/delete operations
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { uuid } = useParams(); // Get the uuid from the URL

    useEffect(() => {
        const fetchCrewmate = async () => {
            try {
                const { data, error } = await supabase
                    .from('Crewmates')
                    .select('*')
                    .eq('uuid', uuid) // Find crewmate by uuid
                    .single();

                if (error) throw error;

                // Update formData with the crewmate data
                setFormData({ 
                    name: data.name, 
                    image_url: data.color, // Note the color field is actually the image_url
                    description: data.speed, // Note the speed field is actually the description
                    id: data.id 
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (uuid) fetchCrewmate();
    }, [uuid]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };



    const updateCrewmate = async () => {
        const { name, image_url, description, id } = formData;

        if (!name || !image_url || !description) {
            alert('Please fill all fields and try again');
            return;
        }

        try {
            const { error } = await supabase
                .from('Crewmates')
                .update({ name, color: image_url, speed: description })
                .eq('id', id); // Use id to update the crewmate

            if (error) throw error;

            alert('Crewmate updated successfully!');
            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    };

    const deleteCrewmate = async (idToDelete) => {
        try {
            const { error } = await supabase
                .from('Crewmates')
                .delete()
                .eq('id', idToDelete); // Use the numerical id to delete the crewmate

            if (error) throw error;

            alert('Crewmate successfully deleted!');
            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        updateCrewmate(); // Update the crewmate
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Update Post</h1>
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
                            maxLength={400}
                        />
                    </div>
                    {/* Add any additional form inputs as needed */}
                    <button type="submit">Update Post</button>
                    <button type="button" onClick={() => deleteCrewmate(formData.id)}>Delete Post</button>
                </form>
            </div>
        </div>
    );
};

export default CrewmateView;

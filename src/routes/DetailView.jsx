import React, { useState, useEffect } from 'react';
import { supabase } from '../client.jsx';
import { useNavigate, useParams } from 'react-router-dom';

const DetailView = () => {
    const [formData, setFormData] = useState({
        name: '',
        image_url: '',
        description: '',
        id: '',
        upvotes: 0,
        comments: [] // Add comments to your state
    });
    const [newComment, setNewComment] = useState(''); // State to hold the new comment text
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { uuid } = useParams();

    const fetchComments = async (crewmateId) => {
        const { data, error } = await supabase
            .from('Comments')
            .select('*')
            .eq('crewmate_id', crewmateId);

        if (error) {
            console.error('Error fetching comments:', error);
        } else {
            setFormData(formData => ({ ...formData, comments: data }));
        }
    };

     // Function to format date
     const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    useEffect(() => {
        const fetchCrewmate = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('Crewmates')
                    .select('*')
                    .eq('uuid', uuid)
                    .single();

                if (error) throw error;

                setFormData({ 
                    ...data,
                    image_url: data.color, // Assuming 'color' is storing the image_url
                    description: data.speed // Assuming 'speed' is storing the description
                });

                await fetchComments(data.id);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (uuid) fetchCrewmate();
    }, [uuid]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const submitComment = async () => {
        if (!newComment.trim()) return;

        try {
            const { error } = await supabase
                .from('Comments')
                .insert([{ crewmate_id: formData.id, text: newComment }]);

            if (error) throw error;

            setNewComment('');
            await fetchComments(formData.id); // Refetch comments to include the new one
        } catch (error) {
            console.error('Error submitting comment: ', error);
        }
    };

    const navigateToEditPage = () => {
        navigate(`/${uuid}/edit`); // Navigate to the edit page
    };

    const toggleUpvote = async () => {
        const newUpvotes = formData.upvotes + 1; // Always increase upvotes by 1
    
        try {
            const { error } = await supabase
                .from('Crewmates')
                .update({ upvotes: newUpvotes })
                .eq('id', formData.id);
    
            if (error) throw error;
    
            setFormData({ ...formData, upvotes: newUpvotes });
        } catch (error) {
            console.error('Error updating upvote: ', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className='post'>
                <div><button className='edit-post' onClick={navigateToEditPage}>Edit Post</button></div>
                <div className='post-complete'>
                    <div className='post-half'>
                    <img src={formData.image_url} alt="Sneaker Image" />
                    </div>
                    <div className='post-half'>
                    <div>
                    <h3 className='detail-title'>{formData.name}</h3>
                    <p className='detail-description'>{formData.description}</p>
                    <button onClick={toggleUpvote}>
                         {formData.upvotes}x
                    </button>
                    <div className='comment-section'>
                    <h3>Comments</h3>
                    {formData.comments.map(comment => (
                        <p key={comment.id}>
                            {comment.text} <span>{formatDate(comment.created_at)}</span>
                        </p>
                    ))}
                    <textarea value={newComment} onChange={handleCommentChange}></textarea>
                    <button onClick={submitComment}>Post Comment</button>
                </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailView;

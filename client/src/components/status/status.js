import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom" 
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BASE_URL


const Status = () => {
  const navigate = useNavigate()
  const [instructions, setInstructions] = useState([]);

  const fetchStatuses = async () => {
    // Fetch status from the server
    try {
      const response = await axios.get(`${baseUrl}/get-statuses`); 
      setInstructions(response.data.data);
      // setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  // const postComment = async () => {
  //   // Post a new comment to the server
  //   try {
  //     const response = await axios.post('/api/comments', {
  //       statusId: status._id, 
  //       text: commentText,
  //     });
  //     setCommentText('');
  //     fetchStatuses(); 
  //   } catch (error) {
  //     console.error('Error posting comment:', error);
  //   }
  // };

  useEffect(() => {
    fetchStatuses(); 
  }, []);

  return (
    <div className='flex flex-col gap-5' >
      
        {instructions && instructions.map((instruction, index) => (
          <div 
          className='border-2 border-slate-500' 
          onClick={() => navigate(`/inspect-case/${instruction._id}`)}
          >
            {instruction.instruction}
            </div>
        ))}
    </div>
  );
};

export default Status;


/**
 * <h2>Status:</h2>
      <p>{status.text}</p>
      
      <h3>Comments:</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>{comment.text}</li>
        ))}
      </ul>
      
      <div>
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={postComment}>Submit Comment</button>
      </div> 
 */

import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
const baseUrl = process.env.REACT_APP_BASE_URL


const InspectCase = () => {
    const { id } = useParams();
    const [selectedInstruction, setSelectedInstruction] = useState({})
    const [commentsList, setCommentsList] = useState([])
    const [newComment, setNewComment] = useState("")

    const fetchInstruction = async () => {
        // Fetch status from the server
        try {
            const response = await axios.get(`${baseUrl}/get-status/${id}`);
            if (response.status === 200) {
                setSelectedInstruction(response.data.data)
            } else {
                console.log("Error")
            }
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    };

    useEffect(() => {
        fetchInstruction();
    }, [])

    const submitComment = async () => {
        // Fetch status from the server
        try {
            const response = await axios.put(`${baseUrl}/add-comment/${id}`,
                { commentText: newComment });
            if (response.status === 200) {
                setCommentsList(response.data.updated.comments);
                window.location.reload()
            } else {
                console.log("Error")
            }
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    };


    return (
        <div className='flex flex-col gap-5' >
            <div>
                {selectedInstruction.instruction}
            </div>
            <div>
                {selectedInstruction.comments && selectedInstruction.comments.map((comment, index) => (
                    <div>
                        {comment.commentText}
                    </div>
                ))}
            </div>
            <div>
                <input
                    onChange={(e) => setNewComment(e.target.value)}
                    className='border-2 border-slate-500 p-1'
                />
                <button
                    onClick={submitComment}
                    className='bg-blue-500 rounded-sm text-white m-2'
                >Submit</button>
            </div>

        </div>
    );
};


export default InspectCase
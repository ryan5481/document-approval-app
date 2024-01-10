import React, { useState } from 'react'
import Comment from './comment'
import useNode from './hooks/useNode'

const comments = {
    id: 1,
    items: [

    ]
}

const MainThread = () => {
    const [commentsData, setCommentsData] = useState(comments)
    const { insertNode, deleteNode } = useNode()

    const handleInsertNode = (folderId, item) => {
        const finalStructure = insertNode(commentsData, folderId, item)
        setCommentsData(finalStructure)
    console.log(JSON.stringify(commentsData))

    }
    
    const handleDeleteNode = (folderId) => {
        const finalStructure = deleteNode(commentsData, folderId)
        const temp = {...finalStructure}
        setCommentsData(temp)
    }


    return (
        <div className='flex items-center justify-center m-10' >
            <Comment 
            comment={commentsData} 
            handleInsertNode={handleInsertNode}
            handleDeleteNode={handleDeleteNode}
            />
        </div>
    )
}

export default MainThread
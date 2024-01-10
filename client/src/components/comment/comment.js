import React, { useState, useEffect, useRef } from 'react'

const Comment = ({
  comment,
  handleInsertNode,
  handleDeleteNode
}) => {
  const [input, setInput] = useState("")

  const onAddComment = () => {
    handleInsertNode(comment.id, input)
    setInput("")
  }

  const handleDelete = () => {
    handleDeleteNode(comment.id)
  }
  return (
    <div className='flex flex-col gap-5' >
      <div>
        {comment.id === 1 ? (
          <div className='flex flex-row gap-2'>
            <input
              type='text'
              className='flex border-2 border-gray-500 rounded-md p-1'
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='type ...'
            />
            <button
              className='bg-blue-400 rounded-md'
              onClick={onAddComment}
            >
              COMMENT
            </button>
          </div>
        ) : (
          <div className='flex gap-5'>
            <span className='flex items-center justify-start gap-5' >
              {comment.name}
            </span>
            <button
              className='bg-red-400 rounded-md'
              onClick={handleDelete}
            >delete</button>
          </div>
        )}
      </div>
      {comment?.items?.map((cmnt, index) => {
        return (
          <Comment
            key={cmnt.id}
            comment={cmnt}
            handleInsertNode={handleInsertNode}
            handleDeleteNode={handleDeleteNode}
          />)
      })}
    </div>
  )
}

export default Comment
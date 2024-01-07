
  import React from 'react'
  import {Editor, convertFromRaw, ContentState, EditorState} from 'draft-js'
  import Type from 'typeHelpers'
  
  function isDraftable(content) {
      return Type(content, 'object') && content.hasOwnProperty('entityMap')
  }
  
  export default class FormattedTextViewer extends React.Component {
  
      constructor(props) {
          super(props)
      }
  
      render() {
          let content = this.props.children
          try {
              content = JSON.parse(content)
          }
          catch(e) {}
          if (isDraftable(content)) {
              content = EditorState.createWithContent(
                  ContentState.createFromBlockArray(
                      convertFromRaw(content)))
  
              return <Editor readOnly={true} editorState={content} />
          }
          return <p>{content}</p>
      }
  
  }
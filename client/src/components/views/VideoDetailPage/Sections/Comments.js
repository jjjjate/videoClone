import React, {useState} from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {useParams} from "react-router-dom";
import SingleComment from "../Sections/SingleComment"

function Comments(props) {
  const videoId = useParams().videoId
  const user = useSelector(state => state.user);
  const [commentValue, setCommentValue] = useState("")
  const handleClick = (e) => {
    setCommentValue(e.currentTarget.value)
  }
  const onSubmit = (e) => {
    e.preventDefault();
    const  variables = {
      content: commentValue,
      writer: user.userData._id,
      postId: videoId
    }

    axios.post('/api/comment/saveComment', variables)
      .then(response => {
        if(response.data.success) {
          setCommentValue('');
          props.refreshFunction(response.data.result);
          console.log(response.data.result)
        } else {
          alert('댓글 저장에 실패했습니다.')
        }
      })
  }
  console.log(user)

  return (
    <div>
      <br/>
      <p>댓글</p>
      <hr/>
      {props.commentLists && props.commentLists.map((comment, index) => (
        (!comment.responseTo &&
          <SingleComment comment={comment} postId={props.postId} key={index} />
        )
        ))}

      <form style={{ display: 'flex' }} onSubmit={onSubmit} >
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleClick}
          value={commentValue}
          placeholder="댓글을 적어주세요"
        />
        <br/>
        <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>댓글</button>
      </form>
    </div>
  )
}

export default Comments
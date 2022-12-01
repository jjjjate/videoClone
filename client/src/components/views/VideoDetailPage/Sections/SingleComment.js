import React, {useState} from "react";
import { Comment, Avatar, Button, Input} from "antd";
import axios from "axios";
import {useSelector} from "react-redux";

const { Textarea } = Input;

function SingleComment(props) {

  const [openReply, setOpenReply] = useState(false)
  const [commentValue, setCommentValue] = useState("")

  const user = useSelector((state) => state.user);

  const onClickReplyOpen = () => {
    setOpenReply(!openReply)
  }
  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.value)
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const  variables = {
      writer: user.userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
      content: commentValue
    };

    axios.post('/api/comment/saveComment', variables)
      .then(response => {
        if(response.data.success) {
          setCommentValue("")
          setOpenReply(!openReply)
          props.refreshFunction(response.data.result);
        } else {
          alert('댓글 저장에 실패했습니다.')
        }
      })
  }
  const actions = [
    <span onClick={onClickReplyOpen} key={'comment-basic-reply-to'}>댓글 달기</span>,
  ];

  console.log(props.comment)
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.postId}
        avatar={<Avatar src={props.comment.updatedAt} alt="image"/>}
        content={<p>{props.comment.content}</p>}
      />
      {openReply && (
        <form style={{ display: 'flex' }} onSubmit={ onSubmit }>
      <textarea
        style={{width: '100%', borderRadius: '5px'}}
        onChange={onHandleChange}
        value={commentValue}
        placeholder="대댓글을 적어주세요"
      />
          <br/>
          <Button style={{width: '20%', height: '52px'}} onClick={ onSubmit }>대댓글</Button>
        </form>
        )}
    </div>
  )
}

export default SingleComment
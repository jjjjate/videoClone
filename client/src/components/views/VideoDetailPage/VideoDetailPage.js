import React, {useEffect, useState} from "react";
import {Row, Col, List, Avatar} from "antd";
import axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Comments from "./Sections/Comments";

function VideoDetailPage(props) {

  const videoId = props.match.params.videoId
  const videoVariable = {
    videoId : videoId
  }

  const [VideoDetail, setVideoDetail] = useState([])
  const [comments, setComments] = useState([])

  useEffect(() => {
    axios.post('/api/video/getVideoDetail', videoVariable)
      .then(response => {
        if (response.data.success) {
          setVideoDetail(response.data.video)
        } else {
          alert('비디오 정보를 불러오기 실패했습니다.')
        }
      })
    axios.post('/api/comment/getComments', videoVariable)
      .then(response => {
        if(response.data.success) {
          setComments(response.data.comments)
        } else {
          alert('댓글 정보를 가져올 수 없습니다.')
        }
      })
  }, [])

  const updateComment = (newComment) => {
    setComments(comments.concat(newComment))
  };

  console.log(VideoDetail)
  if(VideoDetail.writer) {
    return(
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: '100%', padding: '3rem 4rem' }}>
            <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls></video>
            <List.Item
              actions
            >
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>
            <Comments commentLists={comments} postId={videoId} refreshFunction={updateComment} />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    )
  } else {
    return (
      <div>Loading...</div>
    )
  }
}

export default VideoDetailPage;
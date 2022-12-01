import React, {useEffect, useState} from 'react'
import { Card, Avatar, Col, Typography, Row } from "antd";
import axios from "axios";
import moment from "moment";

const { Title } = Typography
const { Meta } = Card

function LandingPage() {
  const [video, setVideo] = useState([])

  useEffect(() => {
    axios.get('/api/video/getVideos')
      .then(response => {
        if(response.data.success) {
          setVideo(response.data.videos)
        } else {
          alert('비디오 가져오기를 실패했습니다.')
        }
      })
  },[])

  const renderCards = video.map((video, index) => {

    let hours = Math.floor(video.duration / 24);
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor((video.duration - minutes * 60));

    if (video.writer) {
      return <Col key={index} lg={6} md={8} xs={24}>
        <div style={{ position: 'relative' }}>
          <a href={`/video/${video._id}`}>
            <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
            <div
              style={{ bottom: 0, right:0, position: 'absolute', margin: '4px',
                color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8,
                padding: '2px 4px', borderRadius:'2px', letterSpacing:'0.5px', fontSize:'12px',
                fontWeight:'500', lineHeight:'12px' }}>
              <span>{hours} : {minutes} : {seconds}</span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          avatar={ <Avatar src={video.writer.image} /> }
          title={video.title}
        />
        <span>{video.writer.name}</span>
        <br />
        <span style={{ marginLeft: '3rem' }}>{video.views} views</span>-{" "}
        <span>{moment(video.createdAt).format("MMM Do YY")}</span>
      </Col>
    }
  })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
          <Title level={2}> 비디오 </Title>
          <hr />
          <Row gutter={16}>
            {renderCards}
          </Row>
        </div>
    )
}

export default LandingPage;

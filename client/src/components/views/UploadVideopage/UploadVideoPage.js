import React, { useState } from 'react'
import { Typography, Button, Form, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;

const Private = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' }
]

const Catogory = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
  { value: 4, label: "Sports" },
]

function UploadVideoPage(props) {
  const user = useSelector(state => state.user);

  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(0);
  const [Categories, setCategories] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [Thumbnail, setThumbnail] = useState("");


  const handleChangeTitle = (event) => {
    setTitle(event.currentTarget.value)
  }

  const handleChangeDescription = (event) => {
    setDescription(event.currentTarget.value)
  }

  const handleChangeOne = (event) => {
    setPrivacy(event.currentTarget.value)
  }

  const handleChangeTwo = (event) => {
    setCategories(event.currentTarget.value)
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (user.userData && !user.userData.isAuth) {
      return alert('로그인을 먼저 해 주세요')
    }
    if (title === "" || Description === "" ||
      Categories === "" || FilePath === "" ||
      Duration === "" || Thumbnail === "") {
      return alert('Please first fill all the fields')
    }
    const variables = {
      writer: user.userData._id,
      title: title,
      description: Description,
      privacy: privacy,
      filePath: FilePath,
      category: Categories,
      duration: Duration,
      thumbnail: Thumbnail
    }

    axios.post('/api/video/uploadVideo', variables)
      .then(response => {
        if (response.data.success) {
          alert('성공적으로 업로드되었습니다.')
          props.history.push('/')
        } else {
          alert('업로드에 실패하였습니다.')
        }
      })

  }

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        console.log(response.data);

        let variable = {
          filePath: response.data.filePath,
          fileName: response.data.fileName
        }
        setFilePath(response.data.filePath)

        axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration)
            setThumbnail(response.data.thumbsFilePath)
          } else {
            alert("썸네일 에러 발생");
          }
        });
      } else {
        alert("업로드 실패");
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2} > Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropzone
            onDrop={onDrop}
            multiple={false}
            maxSize={800000000}>
            {({ getRootProps, getInputProps }) => (
              <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                   {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem' }} />

              </div>
            )}
          </Dropzone>

          {Thumbnail !== "" &&
            <div>
              <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
            </div>
          }
        </div>

        <br /><br />
        <label>Title</label>
        <Input
          onChange={handleChangeTitle}
          value={title}
        />
        <br /><br />
        <label>Description</label>
        <TextArea
          onChange={handleChangeDescription}
          value={Description}
        />
        <br /><br />

        <select onChange={handleChangeOne}>
          {Private.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>
        <br /><br />

        <select onChange={handleChangeTwo}>
          {Catogory.map((item, index) => (
            <option key={index} value={item.label}>{item.label}</option>
          ))}
        </select>
        <br /><br />

        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>

      </Form>
    </div>
  )
}

export default UploadVideoPage
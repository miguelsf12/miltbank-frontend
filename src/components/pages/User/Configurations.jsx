import Back from "../../utilities/Back"
import styles from './Configurations.module.css'
import FormConfig from "../../form/FormConfig"
import { useEffect, useRef, useState } from "react"
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditIcon from '@mui/icons-material/Edit'
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import api from "../../../utils/api"
import { useNavigate } from "react-router-dom"

function Configurations() {
  const [userData, setUserData] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [preview, setPreview] = useState(null)
  const [image, setImage] = useState({})

  const navigate = useNavigate()

  const fileInputRef = useRef(null)

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file))
      setImage(file)
    }
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  })

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      return navigate('/login')
    }

    api.get('/users/checkuser', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setUserData(response.data)
      setUserLoaded(true)
    })

  }, [navigate])

  return (
    <section>
      <Back toWhere={'/user/home'} />
      <div className={styles.container}>
        <header>
          <div style={{ marginBottom: '30px', marginTop: '10px' }}>
            <div onClick={handleImageClick} style={{ cursor: 'pointer', display: 'inline-block' }}>
              {userData && userData.image ? (
                <Badge overlap="circular" badgeContent={<EditIcon style={{ color: '#1F2440', width: 30, height: 30, marginRight: 4, marginTop: 2 }} />} >
                  <img src={preview ? preview : `${process.env.REACT_APP_API}/images/user/${userData.image}`} alt="Uploaded" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
                </Badge>
              ) : (
                <Badge overlap="circular" badgeContent={<EditIcon style={{ color: '#1F2440', width: 20, height: 20, marginRight: 4, marginTop: 2 }} />} >
                  <AccountCircleIcon fontSize="large" style={{ borderRadius: '50%', color: '#ccc', width: 60, height: 60 }} />
                </Badge>
              )}
            </div>
            <VisuallyHiddenInput type="file" name="image" onChange={handleImageChange} ref={fileInputRef} />
          </div>
        </header>
        <p>Altere ou adicione os dados:</p>
        <FormConfig image={image} userData={userData} />
      </div>
    </section>
  )
}

export default Configurations
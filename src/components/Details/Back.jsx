import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
function Back({toWhere}) {

  return (
    <div>
      <Link to={toWhere} style={{ textDecoration: 'none', color: '#F28907' }}>
        <ArrowBackIcon fontSize='large' />
      </Link>
    </div>
  )
}

export default Back
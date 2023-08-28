import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logoutBtnTriggered = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <div className="nav-content-container">
        <Link to="/" className="link-el">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="nav-image-el"
          />
        </Link>
        <ul className="nav-content-list-container">
          <Link to="/" className="link-el">
            <li className="small-device-icons">
              <AiFillHome />
            </li>
            <li className="large-device-buttons">Home</li>
          </Link>
          <Link to="/jobs" className="link-el">
            <li className="small-device-icons">
              <BsFillBriefcaseFill />
            </li>
            <li className="large-device-buttons">Jobs</li>
          </Link>
        </ul>
        <button
          className="large-logout-btn"
          type="button"
          onClick={logoutBtnTriggered}
        >
          Logout
        </button>
        <button
          className="small-logout-btn"
          type="button"
          onClick={logoutBtnTriggered}
        >
          <FiLogOut />
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)

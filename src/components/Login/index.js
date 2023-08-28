import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccessProcess = jwtToken => {
    this.setState({showError: false})
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailureProcess = message => {
    this.setState({showError: true, errorMsg: message})
  }

  submitBtnTriggered = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const receivedData = await response.json()
    console.log(receivedData)
    if (response.ok) {
      this.onSubmitSuccessProcess(receivedData.jwt_token)
    } else {
      this.onSubmitFailureProcess(receivedData.error_msg)
    }
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="login-label-el" htmlFor="username-el">
          USERNAME
        </label>
        <input
          type="text"
          id="username-el"
          value={username}
          className="login-input-el"
          placeholder="Username"
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="login-label-el" htmlFor="password-el">
          PASSWORD
        </label>
        <input
          type="password"
          id="password-el"
          value={password}
          className="login-input-el"
          placeholder="Password"
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  render() {
    const {showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="loginForm-background-container">
        <form className="form-container" onSubmit={this.submitBtnTriggered}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-login"
          />
          <div>
            <div className="input-container">{this.renderUsernameField()}</div>
            <div className="input-container">{this.renderPasswordField()}</div>
          </div>
          <button className="login-btn" type="submit">
            Login
          </button>
          {showError && <p className="error-el">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login

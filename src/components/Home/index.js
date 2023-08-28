import {Link} from 'react-router-dom'
import './index.css'

import Header from '../Header'

const Home = () => (
  <>
    <Header />
    <div className="home-bg-container">
      <h1 className="home-title">Find The Job That Fits Your Life</h1>
      <p className="home-description">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs" className="link-el">
        <button className="find-job-button" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)

export default Home

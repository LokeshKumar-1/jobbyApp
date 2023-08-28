import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'

const apiStatusForSelectedJobDetails = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    selectedJobDetails: {},
    similarJobList: [],
    fetchingStatus: apiStatusForSelectedJobDetails.initial,
  }

  componentDidMount() {
    this.getJobDetailsData()
  }

  getJobDetailsData = async () => {
    this.setState({fetchingStatus: apiStatusForSelectedJobDetails.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const jobData = await response.json()

      const formattedJobDetailsData = {
        jobDetails: {
          companyLogoUrl: jobData.job_details.company_logo_url,
          companyWebsiteUrl: jobData.job_details.company_website_url,
          employmentType: jobData.job_details.employment_type,
          id: jobData.job_details.id,
          jobDescription: jobData.job_details.job_description,
        },
        lifeAtCompany: {
          description: jobData.job_details.life_at_company.description,
          imageUrl: jobData.job_details.life_at_company.image_url,
        },
        location: jobData.job_details.location,
        packagePerAnnum: jobData.job_details.package_per_annum,
        rating: jobData.job_details.rating,
        skills: jobData.job_details.skills.map(item => ({
          imageUrl: item.image_url,
          name: item.name,
        })),
        title: jobData.job_details.title,
      }

      const formattedSimilarJobs = jobData.similar_jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        rating: item.rating,
        title: item.title,
      }))

      this.setState({
        selectedJobDetails: formattedJobDetailsData,
        similarJobList: formattedSimilarJobs,
        fetchingStatus: apiStatusForSelectedJobDetails.success,
      })
    } else {
      this.setState({fetchingStatus: apiStatusForSelectedJobDetails.failure})
    }
  }

  renderSelectedJobDetailsView = () => {
    const {selectedJobDetails, similarJobList} = this.state

    if (Object.keys(selectedJobDetails).length === 0) {
      return null
    }

    const {
      jobDetails,
      title,
      rating,
      location,
      skills,
      lifeAtCompany,
      packagePerAnnum,
    } = selectedJobDetails
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
    } = jobDetails

    return (
      <>
        <div className="item-details-content-card">
          <div className="logo-and-title-rating-selected-job">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-ele"
            />
            <div className="title-and-rating-selected-container">
              <h1>{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating-el">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-and-type-container">
            <div className="location-container">
              <MdLocationOn className="location-icon" />
              <p className="para-ele">{location}</p>
            </div>
            <div className="jobType-container">
              <BsBriefcaseFill />
              <p className="para-ele">{employmentType}</p>
            </div>
            <p className="package-el">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line" />
          <div className="descTitle-and-webSitLink-container">
            <h1 className="SJ-dec-title">Description</h1>
            <a href={companyWebsiteUrl} className="website-link-container">
              Visit <FiExternalLink className="link-icon" />
            </a>
          </div>
          <p className="SJ-desc">{jobDescription}</p>
          <h1 className="title">Skills</h1>
          <ul className="skill-list-container">
            {skills.map(item => (
              <li className="skillItem" key={item.name}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="skill-image"
                />
                <h1 className="skill-name">{item.name}</h1>
              </li>
            ))}
          </ul>
          <h1 className="title">Life at Company</h1>
          <div className="lifeAtCompany-container">
            <p className="LAC-text">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="LAC-image"
            />
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="title">Similar Jobs</h1>
          <ul className="similar-list-container">
            {similarJobList.map(item => (
              <SimilarJobItem item={item} key={item.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  selectedJobItemRetryBtnClicked = () => {
    this.getJobDetailsData()
  }

  renderFailureViewForSelectedJobsData = () => (
    <div className="selected-jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="selected-jobs-failure-image"
      />
      <h1 className="selected-jobs-failure-title">
        Oops! Something went wrong
      </h1>
      <p className="selected-jobs-failure-des">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="selected-retry-button"
        type="button"
        onClick={this.selectedJobItemRetryBtnClicked}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderViewForSelectedJobItem = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemDetailsResult = () => {
    const {fetchingStatus} = this.state

    switch (fetchingStatus) {
      case 'INPROGRESS':
        return this.renderLoaderViewForSelectedJobItem()
      case 'SUCCESS':
        return this.renderSelectedJobDetailsView()
      case 'FAILURE':
        return this.renderFailureViewForSelectedJobsData()
      default:
        return null
    }
  }

  render() {
    const {fetchingStatus} = this.state
    console.log(fetchingStatus)
    return (
      <>
        <Header />
        <div className="itemDetails-background-container">
          {this.renderJobItemDetailsResult()}
        </div>
      </>
    )
  }
}

export default JobItemDetails

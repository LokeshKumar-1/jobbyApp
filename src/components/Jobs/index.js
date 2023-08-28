import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import './index.css'
import Header from '../Header'
import JobItem from '../JobItem'

const apiStatusForProfile = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const apiStatusForJobList = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    statusForProfileData: apiStatusForProfile.initial,
    statusForJobsData: apiStatusForJobList.initial,
    employmentType: [],
    minimumPackage: '',
    search: '',
    profileData: {},
    jobsData: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getListOfJobs()
  }

  jobListFailure = () => {
    this.setState({statusForJobsData: apiStatusForJobList.failure})
  }

  getListOfJobs = async () => {
    this.setState({statusForJobsData: apiStatusForJobList.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {employmentType, minimumPackage, search} = this.state

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${search}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const {jobs} = data

      const formattedData = jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))

      this.setState({
        jobsData: formattedData,
        statusForJobsData: apiStatusForJobList.success,
      })
    } else {
      this.jobListFailure()
    }
  }

  getProfileDetails = async () => {
    this.setState({statusForProfileData: apiStatusForProfile.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const formattedProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: formattedProfileData,
        statusForProfileData: apiStatusForProfile.success,
      })
    } else {
      this.setState({statusForProfileData: apiStatusForProfile.failure})
    }
  }

  renderUserProfileView = () => {
    const {profileData} = this.state
    const {profileImageUrl, name, shortBio} = profileData
    return (
      <div className="userProfile">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="name-in-profile">{name}</h1>
        <p className="bio-in-profile">{shortBio}</p>
      </div>
    )
  }

  updateCheckboxList = event => {
    const {employmentType} = this.state

    const numberOfSelectedCheckboxes = employmentType.filter(
      item => item === event.target.id,
    )

    if (numberOfSelectedCheckboxes.length === 0) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.id],
        }),
        this.getListOfJobs,
      )
    } else {
      const filteredData = employmentType.filter(
        item => item !== event.target.id,
      )

      this.setState({employmentType: filteredData}, this.getListOfJobs)
    }
  }

  renderEmploymentCheckboxView = () => (
    <div className="employment-checkbox-container">
      <h3>Type of Employment</h3>
      <ul className="checkbox-list-container">
        {employmentTypesList.map(item => (
          <li className="checkbox-list-el" key={item.employmentTypeId}>
            <input
              type="checkbox"
              id={item.employmentTypeId}
              onChange={this.updateCheckboxList}
            />
            <label htmlFor={item.employmentTypeId}>{item.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  updateRadioOption = event => {
    this.setState({minimumPackage: event.target.id}, this.getListOfJobs)
  }

  renderEmploymentRadioView = () => (
    <div className="employment-radio-container">
      <h3>Salary Range</h3>
      <ul className="radio-list-container">
        {salaryRangesList.map(item => (
          <li className="radio-list-el" key={item.salaryRangeId}>
            <input
              type="radio"
              id={item.salaryRangeId}
              name="option"
              onChange={this.updateRadioOption}
            />
            <label htmlFor={item.salaryRangeId}>{item.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  profileRetryBtnClicked = () => {
    this.getProfileDetails()
  }

  JobRetryBtnClicked = () => {
    this.getListOfJobs()
  }

  failureViewForProfileData = () => (
    <div className="profile-view-failure-container">
      <button
        className="retry-button"
        type="button"
        onClick={this.profileRetryBtnClicked}
      >
        Retry
      </button>
    </div>
  )

  onChangeSearchInput = event => {
    this.setState({search: event.target.value})
  }

  onSubmitSearchIcon = () => {
    this.getListOfJobs()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getListOfJobs()
    }
  }

  renderListOfJobItemsView = () => {
    const {jobsData} = this.state

    if (jobsData.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image-el"
          />
          <h1 className="no-jobs-title">No Jobs Found</h1>
          <p className="no-job-des">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }
    return (
      <ul className="jobs-to-display-container">
        {jobsData.map(item => (
          <JobItem item={item} key={item.id} />
        ))}
      </ul>
    )
  }

  renderFailureViewForJobsData = () => (
    <div className="jobs-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-image"
      />
      <h1 className="jobs-failure-title">Oops! Something went wrong</h1>
      <p className="jobs-failure-des">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.JobRetryBtnClicked}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileResult = () => {
    const {statusForProfileData} = this.state
    switch (statusForProfileData) {
      case 'INPROGRESS':
        return this.renderLoaderView()
      case 'SUCCESS':
        return this.renderUserProfileView()
      case 'FAILURE':
        return this.failureViewForProfileData()

      default:
        return null
    }
  }

  renderJobResult = () => {
    const {statusForJobsData} = this.state
    switch (statusForJobsData) {
      case 'INPROGRESS':
        return this.renderLoaderView()
      case 'SUCCESS':
        return this.renderListOfJobItemsView()
      case 'FAILURE':
        return this.renderFailureViewForJobsData()

      default:
        return null
    }
  }

  render() {
    const {search} = this.state

    return (
      <>
        <Header />
        <div className="all-jobs-background-container">
          <div className="userProfile-container">
            <div className="search-el-forSmallDevice">
              <input
                type="search"
                className="SD-inputEl"
                placeholder="Search"
                value={search}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                className="SD-searchIcon"
                data-testid="searchButton"
                onClick={this.onSubmitSearchIcon}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderProfileResult()}
            <hr className="hr-line" />
            {this.renderEmploymentCheckboxView()}
            <hr className="hr-line" />
            {this.renderEmploymentRadioView()}
          </div>
          <div className="jobs-background-container">
            <div className="search-el-forLargerDevice">
              <input
                type="search"
                className="SD-inputEl"
                placeholder="Search"
                value={search}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                className="SD-searchIcon"
                data-testid="searchButton"
                onClick={this.onSubmitSearchIcon}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobResult()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobItem = props => {
  const {item} = props
  const {
    companyLogoUrl,
    title,
    jobDescription,
    rating,
    location,
    employmentType,
  } = item

  return (
    <li className="similar-job-item">
      <div className="logo-and-title-rating-selected-job">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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
      <h1 className="similar-title">Description</h1>
      <p className="similar-desc">{jobDescription}</p>
      <div className="location-and-type-container">
        <div className="location-container">
          <MdLocationOn className="location-icon" />
          <p className="para-ele">{location}</p>
        </div>
        <div className="jobType-container">
          <BsBriefcaseFill />
          <p className="para-ele">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem

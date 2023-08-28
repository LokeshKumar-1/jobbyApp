import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'

import './index.css'

const JobItem = props => {
  const {item} = props
  const {
    id,
    title,
    rating,
    location,
    employmentType,
    jobDescription,
    companyLogoUrl,
  } = item

  return (
    <Link to={`/jobs/${id}`} className="link-el">
      <li className="job-item-container">
        <div className="logo-title-rating-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo-image"
          />
          <div className="title-and-rating-container">
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
        </div>
        <hr className="item-hr-line" />
        <h1 className="des">Description</h1>
        <p className="des">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem

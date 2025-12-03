import { Link } from "react-router-dom";




const CourseDetailsArea = () => {



  return (
    <section className="courses__details-area section-py-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6">
            <div className="courses__details-thumb">
              <img src="/assets/img/courses/courses_details.jpg" alt="img" />
            </div>
            <div className="courses__details-content">
              
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
            <div className="courses__details-content">
                <h2 className="title">Full Stack Engineering</h2>
             <p>Master the art of building, scaling, and deploying modern web apps.From React and Node.js to Docker and AWS, you will learn every layer of a production-ready system  frontend, backend, databases, and CI/CD.</p>
            <p><b style={{color: "rgb(0, 0, 0)"}}>Outcome</b> : Engineers who can build and ship real products end-to-end</p>
            <h5 className="price">Rs 15000</h5>
              <div className="courses__item-bottom">
                          <div className="button">
                            <Link to="/course-details">
                              <span className="text">Enroll Now</span>
                              <i className="flaticon-arrow-right"></i>
                            </Link>
                          </div>
                         
                        </div>
            </div>
          </div>
        
        </div>
      </div>
    </section>
  )
}

export default CourseDetailsArea

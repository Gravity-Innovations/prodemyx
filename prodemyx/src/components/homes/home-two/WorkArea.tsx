import { useState } from "react"
import { Link } from "react-router-dom";
import VideoPopup from "../../../modals/VideoPopup";
import BtnArrow from "../../../svg/BtnArrow";

const WorkArea = () => {

   const [isVideoOpen, setIsVideoOpen] = useState(false);

   return (
      <>
         <section className="work__area section-py-120">
            <div className="container">
               <div className="row align-items-center justify-content-center">
                  <div className="col-lg-6 col-md-9">
                     <div className="about__images work__images">
                        <img src="/assets/img/others/about_img.png" alt="img" className="main-img" />
                        <img src="/assets/img/others/about_shape.svg" alt="img" className="shape alltuchtopdown" />
                        <a onClick={() => setIsVideoOpen(true)} style={{ cursor: "pointer" }} className="popup-video">
                           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="28" viewBox="0 0 22 28" fill="none">
                              <path d="M0.19043 26.3132V1.69421C0.190288 1.40603 0.245303 1.12259 0.350273 0.870694C0.455242 0.6188 0.606687 0.406797 0.79027 0.254768C0.973854 0.10274 1.1835 0.0157243 1.39936 0.00193865C1.61521 -0.011847 1.83014 0.0480663 2.02378 0.176003L20.4856 12.3292C20.6973 12.4694 20.8754 12.6856 20.9999 12.9535C21.1245 13.2214 21.1904 13.5304 21.1904 13.8456C21.1904 14.1608 21.1245 14.4697 20.9999 14.7376C20.8754 15.0055 20.6973 15.2217 20.4856 15.3619L2.02378 27.824C1.83056 27.9517 1.61615 28.0116 1.40076 27.9981C1.18536 27.9847 0.97607 27.8983 0.792638 27.7472C0.609205 27.596 0.457661 27.385 0.352299 27.1342C0.246938 26.8833 0.191236 26.6008 0.19043 26.3132Z" fill="currentcolor" />
                           </svg>
                        </a>
                     </div>
                  </div>
                  <style>
                     {`
                     .work__content > p {
                           margin-bottom: 25px;
                        }
                     `}
                  </style>

                  <div className="col-lg-6">
                     <div className="work__content">
                        <div className="section__title mb-20">
                           <span className="sub-title">ProdemyX isn’t a course. It’s a transformation</span>
                           <h2 className="title">What Makes ProdemyX Different</h2>
                        </div>
                          <h5 className="title">Production-Grade Infra</h5>
                          <p>No virtual “mock labs.” You’ll operate on actual Production cloud infrastructure  
with live clusters, monitoring, and deployments running 24/7.</p>
                          
                          
                                 <h5 className="title">AI-Powered Mentorship</h5>
                             
                              <p>Get real-time, personalized insights from an AI mentor trained on your progress, 
combined with human guidance from real engineers.</p>
                          


                           
                                 <h5 className="title">Real Projects. Real Downtime. Real Learning</h5>
                            
                              <p>Our learners don’t memorize; they experience. We introduce chaos, 
simulate outages, and teach recovery  because production never goes smoothly, 
and that’s where real learning happens.</p>
                          
                                 <h5 className="title">Global Exposure</h5>
                             
                              <p>
Designed for learners from India, GCC, US, and beyond  aligned with global DevOps and 
AI engineering standards.</p>
                          
                                 <h5 className="title">Career-Focused Learning</h5>
                             
                              <p>Every course outcome is tied to real job skills project portfolio, GitHub pipelines, 
resume-ready case studies, and cloud certifications.</p>
                          
                        <div className="tg-button-wrap">
                           <Link to="" className="btn arrow-btn">Quick Join Now <BtnArrow /></Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
         <VideoPopup
            isOpen={isVideoOpen}
            onClose={() => setIsVideoOpen(false)}
            videoId="b2Az7_lLh3g"
         />
      </>
   )
}

export default WorkArea

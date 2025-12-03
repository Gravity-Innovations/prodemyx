import { Link } from "react-router-dom"

const FooterCommon = () => {
   return (
      <>
        <style>
      {`
      .flogo_width
      {
       width:50% !important;
      }
      @media(max-width:768px)
      {
         .flogo_width
         {
         width:50% !important;
         }
      }
      `}
   </style>
         <div className="col-xl-3 col-lg-4 col-md-6">
            <div className="footer__widget">
               <div className="logo mb-35">
                  <Link to="/"><img src="/assets/img/logo/logo.png" alt="img" className="flogo_width"/></Link>
               </div>
               <div className="footer__content">
                  <p>We’d love to hear from you  whether you’re a learner,<br/>
                            mentor, or partner who wants to be part of the next big shift in tech education.</p>
                  
                 
               </div>
            </div>
         </div>
         <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div className="footer__widget">
               <h4 className="footer__widget-title">Contact Us</h4>
               <div className="footer__link">
                  <ul className="list-wrap">
                     <li className="text-light">connect@prodemyx.com</li>
                     <li className="text-light">www.prodemyx.com</li>
                      <li className="text-light"> India | UAE | USA </li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <div className="footer__widget">
               <h4 className="footer__widget-title">Our Company</h4>
               <div className="footer__link">
                  <ul className="list-wrap">
                     <li><Link to="/">Contact Us</Link></li>
                     <li><Link to="/">Become Teacher</Link></li>
                     <li><Link to="/">Blog</Link></li>
                     <li><Link to="/">Instructor</Link></li>
                     <li><Link to="/">Events</Link></li>
                  </ul>
               </div>
            </div>
         </div>
      </>
   )
}

export default FooterCommon

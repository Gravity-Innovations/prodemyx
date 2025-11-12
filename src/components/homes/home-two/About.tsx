import { Link } from "react-router-dom";
import InjectableSvg from "../../../hooks/InjectableSvg";
import SvgAnimation from "../../../hooks/SvgAnimation";
import CurvedCircle from "../home-one/CurvedCircle"
import BtnArrow from "../../../svg/BtnArrow";

const About = () => {
   const svgIconRef = SvgAnimation('/assets/img/objects/title_shape.svg');

   return (
      <section className="about-area-two tg-motion-effects section-pb-120">
         <div className="container">
            <div className="row align-items-center justify-content-center">
               <div className="col-lg-6">
                  <div className="faq__img-wrap tg-svg" ref={svgIconRef}>
                     <div className="faq__round-text">
                        <CurvedCircle />
                     </div>
                     <div className="faq__img faq__img-two">
                        <img src="/assets/img/others/faq_img.png" alt="img" />
                        <div className="shape-one">
                           <InjectableSvg src="/assets/img/others/faq_shape01.svg" className="injectable tg-motion-effects4" alt="img" />
                        </div>
                        <div className="shape-two">
                           <span className="svg-icon"></span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-lg-6">
                  <div className="about__content">
                     <div className="section__title">
                        <span className="sub-title">ProdemyX — The Future Is Built Here</span>
                        <h2 className="title">
                          Where Engineers Are Trained Like It’s Production
                         
                        </h2>
                     </div>
                     <p className="desc">At ProdemyX, we’re building the world’s first production-simulated learning platform where every student learns by operating real systems, not by watching slides or demo labs.
You won’t just study coding,cloud, AI, or DevOps; you’ll deploy, monitor, and debug them exactly like engineers at Google, Netflix, or Tesla do.
We prepare you for the real engineering world where uptime, reliability, pipelines, and performance define success.
ProdemyX isn’t a course. It’s a transformation.</p>


 <style>
        {`
        .list-wrap li {
          list-style: none;
          float: left;
          padding-left: 15px;
        }
        `}
 </style>
 <div style={{clear:"both"}}>
<ul className="about__info-list list-wrap">
                        <li className="about__info-list-item">
                           <i className="flaticon-angle-right"></i>
                           <p className="content">Code</p>
                        </li>
                        <li className="about__info-list-item">
                           <i className="flaticon-angle-right"></i>
                           <p className="content">Deploy</p>
                        </li>
                        <li className="about__info-list-item">
                           <i className="flaticon-angle-right"></i>
                           <p className="content">Break</p>
                        </li>
                        <li className="about__info-list-item">
                           <i className="flaticon-angle-right"></i>
                           <p className="content">Fix</p>
                        </li>
                        <li className="about__info-list-item">
                           <i className="flaticon-angle-right"></i>
                           <p className="content">Learn</p>
                        </li>
                        <li className="about__info-list-item">
                           <i className="flaticon-angle-right"></i>
                           <p className="content">Repeat</p>
                        </li>
                     </ul>
                     </div>
                     <div>
<p className="desc" style={{display:"block"}}>That’s how real engineers grow and that’s how you’ll learn here.
</p></div>
                     
                     <div className="tg-button-wrap">
                        <Link to="" className="btn arrow-btn">Start Now <BtnArrow /></Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default About

import feature_data from "../../../data/home-data/FeatureData";
import InjectableSvg from "../../../hooks/InjectableSvg";

interface FeatureProps {
   style: boolean;
}

const Feature = ({ style }: FeatureProps) => {
   return (
      <section className={`${style ? "features__area-three" : "features__area-two"} section-pt-120 section-pb-90`}>
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-8">
                  <div className="section__title text-center mb-40">
                     <span className="sub-title">skill-to-impact learning</span>
                     <h2 className="title">Achieve Your Goal With ProdemyX</h2>
                     <p>The world no longer runs on theory it runs on systems.
At ProdemyX, we’re building the world’s first production-simulated learning platform where every student learns by operating real systems, not by watching slides or demo labs.
</p>
                  </div>
               </div>
            </div>
            <div className="features__item-wrap">
               <div className="row justify-content-center">
                  {feature_data.filter((items) => items.page === "home_2").map((item) => (
                     <div key={item.id} className="col-lg-4 col-md-6">
                        <div className="features__item-two" style={{minHeight:"225px"}}>
                           <div className="features__content-two">
                              <div className="content-top">
                                 <div className="features__icon-two">
                                    <InjectableSvg src={item.icon_2 ? item.icon_2 : ""} alt="img" className="injectable" />
                                 </div>
                                 <h2 className="title">{item.title}</h2>
                              </div>
                              <p>{item.desc}</p>
                           </div>
                           <div className="features__item-shape">
                              <InjectableSvg src="/assets/img/others/features_item_shape.svg" alt="img" className="injectable" />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   )
}

export default Feature

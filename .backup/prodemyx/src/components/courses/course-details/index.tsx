import FooterOne from "../../../layouts/footers/FooterOne";
import HeaderTwo from "../../../layouts/headers/HeaderTwo";
import CourseDetailsArea from "./CourseDetailsArea";

const CourseDetails = () => {

   return (
      <>
         <HeaderTwo/>
         <main className="main-area fix">
             <CourseDetailsArea />
         </main>
         <FooterOne style={false} style_2={true} />
      </>
   );
};

export default CourseDetails;

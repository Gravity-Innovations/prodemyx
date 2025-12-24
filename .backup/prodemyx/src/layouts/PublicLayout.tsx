import HeaderTwo from "./headers/HeaderTwo";
import FooterOne from "./footers/FooterOne";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <HeaderTwo />

      <div style={{ minHeight: "60vh" }}>
        <Outlet />
      </div>

      <FooterOne />
    </>
  );
}

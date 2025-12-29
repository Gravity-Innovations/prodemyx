import { useState } from "react";
import MobileSidebar from "./menu/MobileSidebar";
import UseSticky from "../../hooks/UseSticky";
import { Link } from "react-router-dom";
import InjectableSvg from "../../hooks/InjectableSvg";
import NavMenu from "./menu/NavMenu";

const HeaderTwo = () => {
  const { sticky } = UseSticky();
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <style>
        {`
          .logo_width {
            width: 23% !important;
          }

          @media (max-width: 768px) {
            .logo_width {
              width: 50% !important;
            }
          }
        `}
      </style>

      <header>
        <div id="header-fixed-height"></div>

        <div
          id="sticky-header"
          style={{ background: "#000431" }}
          className={`tg-header__area tg-header__style-two ${
            sticky ? "sticky-menu" : ""
          }`}
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="tgmenu__wrap">
                  <nav className="tgmenu__nav">
                    {/* LOGO */}
                    <div className="logo">
                      <Link to="/">
                        <img
                          src="/assets/img/logo/logo.png"
                          className="logo_width"
                          alt="ProdemyX logo"
                        />
                      </Link>
                    </div>

                    {/* DESKTOP MENU */}
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex">
                      <NavMenu />
                    </div>

                    {/* ACTIONS */}
                    <div className="tgmenu__action tgmenu__action-two">
                      <ul className="list-wrap">
                        <li className="header-btn login-btn">
                          {/* LOGIN – SAME TAB */}
                          <a
                            href="https://prodemyx.com/app/"
                            className="btn"
                          >
                            Login
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* MOBILE LOGIN ICON – SAME TAB */}
                    <div className="mobile-login-btn">
                      <a href="https://prodemyx.com/app/">
                        <InjectableSvg
                          src="/assets/img/icons/user.svg"
                          alt="Login"
                          className="injectable"
                        />
                      </a>
                    </div>

                    {/* MOBILE MENU TOGGLER */}
                    <div
                      onClick={() => setIsActive(true)}
                      className="mobile-nav-toggler"
                    >
                      <i className="tg-flaticon-menu-1"></i>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileSidebar isActive={isActive} setIsActive={setIsActive} />
    </>
  );
};

export default HeaderTwo;

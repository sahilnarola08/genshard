import React, { useState } from "react";
import Profile from "../profile";
import Investment from "./components/Investment/Investment";
import Investments from "./components/Investments/Investments";
import ListOfProjects from "./components/ListOfProjects/ListOfProjects";
import NFTCollection from "./components/NFTCollection/NFTCollection";
import worldBlog from "../../images/homepage/world-img.svg";
import SentnlImg from "../../images/homepage/sentnl-btn-img.svg"
import "./UserProfilePage.sass";
import Footercmp from "../../shared/components/footercmp/footercmp";

const UserProfilePage = () => {
  const navItems = ["INVESTMENT", "LIST OF PROJECTS", "NFT COLLECTIONS"];
  const [selectedNavItem, setselectedNavItem] = useState(navItems[0]);
  return (
    <div className="user-profile-section">
      <div className="container container-maxwidth">
        <div className="profile">
          <div className="row">
            <div className="col-lg-3">
              <div className="text-lg-start text-md-start text-center">
                <p className="paragraph-new-medium color-white-new text-start">HOME <i className="ri-arrow-right-s-line"></i> Profile</p>
                <h2 className="heading-new-2 mt-lg-5">Profile</h2>
                <h5 className="heading-new-5 my-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</h5>
                <p className="paragraph-new color-white-new fw-light">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p className="paragraph-new color-white-new fw-light">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <h5 className="heading-new-5 my-lg-4 d-lg-block d-md-block d-none">We’re excited to have you in our community</h5>
                <div className="Performance-sec mt-5 d-lg-block d-md-block d-none">
                  {/* <div > */}
                  <h5 className="heading-new-5 mt-lg-4 mb-3 "><div className="heading-new-5" style={{ color: "#2479DF" }}>110,000</div> Members</h5>
                  <div className="text-center">
                    <img src={worldBlog} style={{ width: "80%" }} className='img-fluid world-map-img' alt="" />
                  </div>
                  <h5 className="heading-new-5 d-flex justify-content-end mt-3">Across<div className="heading-new-5 ms-2" style={{ color: "#2479DF" }}> 6</div></h5>
                  <h5 className="heading-new-5 d-flex justify-content-end">Continents</h5>
                  {/* </div> */}
                </div>
                <button className="audited-btn m-auto mt-4 d-lg-block d-md-block d-none"><p className="paragraph-new mb-0">Platform Audited by</p> <img src={SentnlImg} className='img-fluid ms-2' alt="" /></button>
              </div>
            </div>
            <div className="col-lg-9 p-0">
              <div className="userProfilePage">
                <div className="profileNav">
                  {/* {navItems.map((item, ind) => (
                    <div
                      key={ind}
                      className={
                        // selectedNavItem === item
                        "selectedProfileItem profileItem"
                        // : "profileItem"
                      }
                    // onClick={() => setselectedNavItem(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div> */}
                  {/* {selectedNavItem === "INVESTMENT" && } */}

                  <Profile />
                  {/* {selectedNavItem === "LIST OF PROJECTS" && } */}
                  <ListOfProjects />
                  {/* {selectedNavItem === "NFT COLLECTIONS" && <NFTCollection />} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footercmp/>
    </div>
  );
};

export default UserProfilePage;

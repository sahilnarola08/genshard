import React, { useState } from 'react'
import "./partner-network.sass"
import PartnerListTable from '../../../../homepage/components/ecosystem/components/partner-list-table/partner-list-table';
import ConnectionStatusTable from './components/connection-status-table/connection-status-table';


const PartnersNetwork = () => {

  const [active, setActive] = useState("");
  const [cardOneOpen, setCardOneOpen] = useState(false);
  const [cardTwoOpen, setCardTwoOpen] = useState(false);
  const [cardThreeOpen, setcardThreeOpen] = useState(false);

  const handleClick = (event: any) => {
    setActive(event.target.id);
  }

  return (
    <>
      <div className="partner-network-page">
        <div className="current-partner-list-content">
          <div className="d-flex align-items-baseline mb-4">
            <h5 className='heading-new-5'>Current Partners List</h5>
            <p className='paragraph-new-small fw-bold mb-0 ms-3' style={{ color: "#555555" }}>Use the filters below for more focused access</p>
          </div>
          <div className="top-card-content">
            <div className="card-content-part">
              <div className="same-content">
                <div className="list-card" >
                  <p className='paragraph-new fw-bold'>Company & Code</p>
                  <div className="center-dropdown position-relative">
                    <div className={cardOneOpen === true ? "dropdown-option active" : "dropdown-option"} >
                      <button className={active === "c-1" ? "active" : undefined} id={"c-1"} onClick={handleClick}>Legal</button>
                      <button className={active === "c-2" ? "active" : undefined} id={"c-2"} onClick={handleClick}>Audit</button>
                      <button className={active === "c-3" ? "active" : undefined} id={"c-3"} onClick={handleClick}>Audit</button>
                      <button className={active === "c-4" ? "active" : undefined} id={"c-4"} onClick={handleClick}>Audit</button>
                      <button className={active === "c-5" ? "active" : undefined} id={"c-5"} onClick={handleClick}>Audit</button>
                    </div>
                  </div>
                  <div className="more-options-button" role='button' onClick={() => setCardOneOpen(!cardOneOpen)} // onFocus={() => setButtonsActive(true)} onBlur={() => setButtonsActive(false)} 
                  >More options <i className="ri-arrow-down-s-line"></i></div>
                </div>
              </div>
              <div className="big-content">
                <div className="list-card" >
                  <p className='paragraph-new fw-bold'>Company & Code</p>
                  <div className="center-dropdown position-relative">
                    <div className={cardTwoOpen === true ? "dropdown-option active" : "dropdown-option"} >
                      <button className={active === "d-1" ? "active" : undefined} id={"d-1"} onClick={handleClick}>Legal</button>
                      <button className={active === "d-2" ? "active" : undefined} id={"d-2"} onClick={handleClick}>Audit</button>
                      <button className={active === "d-3" ? "active" : undefined} id={"d-3"} onClick={handleClick}>Audit</button>
                      <button className={active === "d-4" ? "active" : undefined} id={"d-4"} onClick={handleClick}>Audit</button>
                      <button className={active === "d-5" ? "active" : undefined} id={"d-5"} onClick={handleClick}>Audit</button>
                    </div>
                  </div>
                  <div className="more-options-button" role='button' onClick={() => setCardTwoOpen(!cardTwoOpen)} // onFocus={() => setButtonsActive(true)} onBlur={() => setButtonsActive(false)} 
                  >More options <i className="ri-arrow-down-s-line"></i></div>
                </div>
              </div>
              <div className="same-content">
                <div className="list-card" >
                  <p className='paragraph-new fw-bold'>Company & Code</p>
                  <div className="center-dropdown position-relative">
                    <div className={cardThreeOpen === true ? "dropdown-option active" : "dropdown-option"} >
                      <button className={active === "1" ? "active" : undefined} id={"1"} onClick={handleClick}>Legal</button>
                      <button className={active === "2" ? "active" : undefined} id={"2"} onClick={handleClick}>Audit</button>
                      <button className={active === "3" ? "active" : undefined} id={"3"} onClick={handleClick}>Audit</button>
                      <button className={active === "4" ? "active" : undefined} id={"4"} onClick={handleClick}>Audit</button>
                      <button className={active === "5" ? "active" : undefined} id={"5"} onClick={handleClick}>Audit</button>
                    </div>
                  </div>
                  <div className="more-options-button" role='button' onClick={() => setcardThreeOpen(!cardThreeOpen)} // onFocus={() => setButtonsActive(true)} onBlur={() => setButtonsActive(false)} 
                  >More options <i className="ri-arrow-down-s-line"></i></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-content">
            <div className="">
              <PartnerListTable />
            </div>
          </div>
        </div>
        
        <div className="current-partner-list-content mt-5">
          <div className="d-flex align-items-baseline mb-4">
            <h5 className='heading-new-5'>Current Partners List</h5>
            <p className='paragraph-new-small fw-bold mb-0 ms-3' style={{ color: "#555555" }}>Use the filters below for more focused access</p>
          </div>
          <div className="top-card-content">
            <div className="card-content-part">
              <div className="same-content">
                <div className="list-card" >
                  <p className='paragraph-new fw-bold'>Company & Code</p>
                  <div className="center-dropdown position-relative">
                    <div className={cardOneOpen === true ? "dropdown-option active" : "dropdown-option"} >
                      <button className={active === "c-1" ? "active" : undefined} id={"c-1"} onClick={handleClick}>Legal</button>
                      <button className={active === "c-2" ? "active" : undefined} id={"c-2"} onClick={handleClick}>Audit</button>
                      <button className={active === "c-3" ? "active" : undefined} id={"c-3"} onClick={handleClick}>Audit</button>
                      <button className={active === "c-4" ? "active" : undefined} id={"c-4"} onClick={handleClick}>Audit</button>
                      <button className={active === "c-5" ? "active" : undefined} id={"c-5"} onClick={handleClick}>Audit</button>
                    </div>
                  </div>
                  <div className="more-options-button" role='button' onClick={() => setCardOneOpen(!cardOneOpen)} // onFocus={() => setButtonsActive(true)} onBlur={() => setButtonsActive(false)} 
                  >More options <i className="ri-arrow-down-s-line"></i></div>
                </div>
              </div>
              <div className="big-content">
                <div className="list-card" >
                  <p className='paragraph-new fw-bold'>Company & Code</p>
                  <div className="center-dropdown position-relative">
                    <div className={cardTwoOpen === true ? "dropdown-option active" : "dropdown-option"} >
                      <button className={active === "d-1" ? "active" : undefined} id={"d-1"} onClick={handleClick}>Legal</button>
                      <button className={active === "d-2" ? "active" : undefined} id={"d-2"} onClick={handleClick}>Audit</button>
                      <button className={active === "d-3" ? "active" : undefined} id={"d-3"} onClick={handleClick}>Audit</button>
                      <button className={active === "d-4" ? "active" : undefined} id={"d-4"} onClick={handleClick}>Audit</button>
                      <button className={active === "d-5" ? "active" : undefined} id={"d-5"} onClick={handleClick}>Audit</button>
                    </div>
                  </div>
                  <div className="more-options-button" role='button' onClick={() => setCardTwoOpen(!cardTwoOpen)} // onFocus={() => setButtonsActive(true)} onBlur={() => setButtonsActive(false)} 
                  >More options <i className="ri-arrow-down-s-line"></i></div>
                </div>
              </div>
              <div className="same-content">
                <div className="list-card" >
                  <p className='paragraph-new fw-bold'>Company & Code</p>
                  <div className="center-dropdown position-relative">
                    <div className={cardThreeOpen === true ? "dropdown-option active" : "dropdown-option"} >
                      <button className={active === "1" ? "active" : undefined} id={"1"} onClick={handleClick}>Legal</button>
                      <button className={active === "2" ? "active" : undefined} id={"2"} onClick={handleClick}>Audit</button>
                      <button className={active === "3" ? "active" : undefined} id={"3"} onClick={handleClick}>Audit</button>
                      <button className={active === "4" ? "active" : undefined} id={"4"} onClick={handleClick}>Audit</button>
                      <button className={active === "5" ? "active" : undefined} id={"5"} onClick={handleClick}>Audit</button>
                    </div>
                  </div>
                  <div className="more-options-button" role='button' onClick={() => setcardThreeOpen(!cardThreeOpen)} // onFocus={() => setButtonsActive(true)} onBlur={() => setButtonsActive(false)} 
                  >More options <i className="ri-arrow-down-s-line"></i></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-content">
            <div className="">
              <ConnectionStatusTable />
            </div>
          </div>

          <div className="connection-request-model">
            
          </div>
        </div>
      </div>
    </>
  )
}

export default PartnersNetwork
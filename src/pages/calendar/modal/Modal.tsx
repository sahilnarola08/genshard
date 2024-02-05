import React, { useEffect, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

import "./modal.min.css"
import "./accordion.min.css"
import "./style.sass";
import { getEventDetailsById } from "../API/ApiCall";
import eventIcon from "../assert/images/eventIcon.png"

const Modals = ({ toggle, open, eventProjectData }: any) => {
  // const [modaldata, setData] = useState<any>()
  const [eventData, setEventData] = useState([]);
  // const [accordionOpen, setaccordionOpen] = useState<string>(`${eventData.length}`)
  const [accordionOpen, setaccordionOpen] = useState<string>(`1`)

  const accordionToggle = (id: any) => {

    // setaccordionOpen(!accordionOpen)
    // accordionOpen !== id ? id : null
    if (accordionOpen === id) {
      setaccordionOpen("")
    }
    else {
      setaccordionOpen(id)
    }
  }

  useEffect(() => {
    if (open) {
      // setData(eventProjectData)
      setEventData(eventProjectData)
      // getEventDetailsById(detailId).then(res =>
      //   setData(res.data)
      // )
    }
  }, [open])

  return (
    <div>
      <Modal centered toggle={toggle} isOpen={open} className="calender-modal">
        <ModalHeader toggle={toggle} ><div>Events</div> <img src="/images/icons/close.svg" alt="close" onClick={toggle} /></ModalHeader>
        <ModalBody>
          <Accordion
            open={accordionOpen}
            //@ts-ignore
            toggle={(targetId) => accordionToggle(targetId)}
          >
            {
              eventData.map((modaldata: any, index: number) => <AccordionItem
                //@ts-ignore
                className={accordionOpen === `${index + 1}` && "activeItem"}>
                <AccordionHeader targetId={`${index + 1}`}>
                  <div className="event-icon"><img src={eventIcon} alt="" /></div> {modaldata?.title}
                </AccordionHeader>
                <AccordionBody accordionId={`${index + 1}`}>
                  <div className="ido-name">{modaldata?.resources?.name} - IDO on Trustpad </div>
                  <p>{modaldata?.resources?.projectDescription}</p>
                  <div className="socialMedia">
                    <img src="/images/liveproject/twitter.svg" alt="twitter" onClick={() => window.open(modaldata?.resources?.socialLinks?.twitterURL, "_blank")} />
                    <img src="/images/liveproject/telegram.svg" alt="telegram" onClick={() => window.open(modaldata?.resources?.socialLinks?.telegramURL, "_blank")} />
                    <img src="/images/liveproject/mail.svg" alt="medium" onClick={() => window.open(modaldata?.resources?.socialLinks?.mediumURL, "_blank")} />
                    <img src="/images/liveproject/browser.svg" alt="website" onClick={() => window.open(modaldata?.resources?.socialLinks?.websiteURL, "_blank")} />
                  </div>
                  <div className="eventsInfo">
                    <div className="resInfo">
                      <span className="title">Start : </span>
                      <span className="detail">{modaldata && modaldata?.resources?.startDate && new Date(modaldata?.resources?.startDate * 1000)?.toString()?.slice(0, 24)}</span>
                    </div>
                    <div className="resInfo">
                      <span className="title">End : </span>
                      <span className="detail">{modaldata && modaldata?.resources?.endDate && new Date(modaldata?.resources?.endDate * 1000)?.toString()?.slice(0, 24)}</span>
                    </div>
                    <div className="resInfo">
                      <span className="title">Registration start : </span>
                      <span className="detail">{modaldata && modaldata?.resources?.timeline[0] && modaldata?.resources?.timeline[0].date && new Date(modaldata?.resources?.timeline[0]?.date * 1000)?.toString()?.slice(0, 24)}</span>
                    </div>
                    <div className="resInfo">
                      <span className="title">Registration End : </span>
                      <span className="detail">{modaldata && modaldata?.resources?.timeline[1] && modaldata?.resources?.timeline[1].date && new Date(modaldata?.resources?.timeline[1]?.date * 1000)?.toString()?.slice(0, 24)}</span>
                    </div>
                  </div>
                </AccordionBody>
              </AccordionItem>)
            }
          </Accordion>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Modals;

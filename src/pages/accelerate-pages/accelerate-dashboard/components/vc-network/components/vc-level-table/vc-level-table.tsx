import React, { useState } from 'react'
import "./vc-level-table.sass"
import tableIcon from "../../../../../../../images/homepage/table-icon.svg"
import ConnectionRequestModel from '../../../partner-network/components/connection-request-model/connection-request-model'

const cardData = [
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },
  {
    name: "Partner X",
    image: tableIcon,
    category: "Gaming",
  },

]

const VcLevelTable = () => {

  const [connectionRequestModal, setConnectionRequestModal] = useState<boolean>(false)
  const connectionRequestModalToggle = () => setConnectionRequestModal(!connectionRequestModal)

  return (
    <>
      <div className='list-table-section'>
        <div className="row">
          {cardData && cardData?.map((item: any, i: any) => (
            <div className="col-lg-3 mb-3">
              <div className='vc-list-card text-center'>
                <img src={item.image} alt="" />
                <h5 className='heading-new-5 mt-3'>{item.name}</h5>
                <p className='mb-0 paragraph-new-small mt-3'>{item.category}</p>
                <ul className='social-link-table mt-3'>
                  <li>
                    <a href="#"><i className="ri-twitter-fill"></i></a>
                  </li>
                  <li>
                    <a href="#"><i className="ri-links-line"></i></a>
                  </li>
                  <li>
                    <a href="#"><i className="ri-send-plane-fill"></i></a>
                  </li>
                </ul>
                <div className='text-center'>
                <button className='request-to-onnect-btn mt-3' onClick={() => connectionRequestModalToggle()}>Request to Connect</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConnectionRequestModel isOpen={connectionRequestModal} toggle={connectionRequestModalToggle} />

    </>
  )
}

export default VcLevelTable
import { useHistory } from "react-router-dom";
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap";

import './style.sass'

interface dataProps {
  title: string,
  dashbord: string,
  marketplace: string,
  img: string,
  imgTitle: string,
  imgMsg: string,
  nftContractAddress: string,
  nftTokenId: string,
  isOpen: boolean,
  toggle: () => void
}

const BuyNowModal = ({
  title,
  dashbord,
  marketplace,
  img,
  imgTitle,
  imgMsg,
  nftContractAddress,
  nftTokenId,
  isOpen,
  toggle
}: dataProps) => {

  const history = useHistory()

  return (
      <Modal className='success_modal_wrapper' funk={true} fade={false} isOpen={isOpen} toggle={toggle} size='lg'>
        {/* <div className="main_modal_content"> */}
        <div className="modal_header_wrapper">
          <ModalHeader toggle={toggle}>
          <div className='modal-header-title'>{title}</div>
            <div className="close_btn" onClick={toggle}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 3C9.705 3 3 9.705 3 18C3 26.295 9.705 33 18 33C26.295 33 33 26.295 33 18C33 9.705 26.295 3 18 3ZM18 30C11.385 30 6 24.615 6 18C6 11.385 11.385 6 18 6C24.615 6 30 11.385 30 18C30 24.615 24.615 30 18 30ZM23.385 10.5L18 15.885L12.615 10.5L10.5 12.615L15.885 18L10.5 23.385L12.615 25.5L18 20.115L23.385 25.5L25.5 23.385L20.115 18L25.5 12.615L23.385 10.5Z"
                  fill="black"
                />
              </svg>
            </div>
          </ModalHeader>
        </div>

        <ModalBody>
          <div className="modal_body_img">
            <img src={img} alt="" />
          </div>
          <div className="modal_body_img_caption">
            {imgTitle}
          </div>
          <div className="modal_body_msg">
            {imgMsg}
          </div>
          <div className="modal_footer">
            <Button className="marketplace_btn" onClick={() => history.push('/marketplace')}>
              {marketplace}
            </Button>
            <Button className="dashboard_btn" onClick={() => {
              toggle() 
              history.push(`/assets/${nftContractAddress}/${nftTokenId}`)}
            }>
              {dashbord}
            </Button>
          </div>
        </ModalBody>
        {/* </div> */}
      </Modal>
  );
};

export default BuyNowModal;

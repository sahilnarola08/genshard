import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Modal, ModalFooter,ModalHeader, ModalBody} from "reactstrap"
import Itemimg from '../../../../images/marketplace/hand.png';
import './style.css';

interface approveModalProps {
  isOpen: boolean,
  toggle: () => void,
  currentProjectData?: any,
  creatorFeesForNFT?: any
}

const ApproveModal = ({ isOpen, toggle, currentProjectData, creatorFeesForNFT }: approveModalProps) => {

  const [modal, setModal] = React.useState(false);
  
  return (
    <div className="approve-model-mobile">
      <Modal funk={true} fade={false} isOpen={isOpen} toggle={toggle} className="Purchase-model" >
          <ModalHeader
              toggle={toggle}>Approve Purchase</ModalHeader>
          <ModalBody>
              <div className="model-content">
                <div className="item-details">
                  <div><img className="item-img" src={Itemimg} /></div>
                  <div className="item-cotent">
                    <h6>2 items</h6>
                    <div>Chain: Goerli</div>
                  </div>
                </div>
                <div className="item-price">
                  <h6>0000000000000000002 ETH</h6>
                  <div>$0.01</div>
                </div>
              </div>
          </ModalBody>
          <ModalFooter className="footer">
              <h6>Go to your wallet</h6>
              <div>You'll be asked to approve this purchase from your wallet.</div>
          </ModalFooter>
      </Modal>
  </div >
  );
}

export default ApproveModal;

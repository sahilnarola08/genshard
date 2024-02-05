import { Modal, ModalBody, ModalHeader, Button } from "reactstrap";
import useCopyClipboard from "../../../../../../../hooks/useCopyClipboard";
import { Tooltip } from "../../../profileSide";

import styled from 'styled-components'
import { useActiveWeb3React } from "../../../../../../../hooks/web3";
import "./style.sass";
interface AddFundProps {
  isOpen: boolean,
  toggle: () => void
}

export const ModalTooltip = styled(Tooltip)({
  backgroundColor: "#111",
  color: "#fff",
  top: "-30px",
  right: "0",
  "&:after": {
    borderTopColor: "#111",
  },
  '@media(max-width: 768px)': {
    top: '-38px',
    right: '-15px'
  }
});

function AddFundModal({ isOpen, toggle }: AddFundProps) {

  const [isCopied, setCopied] = useCopyClipboard()
  const { account }  = useActiveWeb3React()

  return (
    <>
      <Modal className='add_fund_modal_container' funk={true} fade={false} isOpen={isOpen} toggle={toggle}>
        <div className="modal_header_wrapper">
          <ModalHeader toggle={toggle}>
            <div className='modal-header-title'>Add Funds</div>
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
          <div className="modal_body_img_caption">
            <div className="bold-text">Deposit funds from your Exchange to the following address</div>
          </div>
          <div className="modal_body_msg">

            <div className='modal_body_text'>{account}</div>
            
            <svg className="add_fund_svg"
              width="19"
              height="22"
              viewBox="0 0 19 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setCopied(account ?? '')}
            >
              <path
                d="M14 0H2C0.9 0 0 0.9 0 2V16H2V2H14V0ZM17 4H6C4.9 4 4 4.9 4 6V20C4 21.1 4.9 22 6 22H17C18.1 22 19 21.1 19 20V6C19 4.9 18.1 4 17 4ZM17 20H6V6H17V20Z"
                fill="#C4C4C4"
              />
            </svg>
            {isCopied && <ModalTooltip role='tooltip' aria-describedby="copied text">Copied!</ModalTooltip>}
          </div>
          <div className="modal_footer">
            <Button className="marketplace_btn" onClick={toggle}>
              Deposit Made
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default AddFundModal;

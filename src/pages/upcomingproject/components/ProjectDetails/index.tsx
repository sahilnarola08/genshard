import moment from "moment";
import { timeline } from "../ProjectProfile";
import "./style.sass"
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux"
import { abi as USDT_ABI } from '../../../../contracts/USDT.json'
import { AppState } from '../../../../state'
import {
  useContractTicket,
  useGenFactory,
  useGenTicket,
  useWeb3Contract,
} from "../../../../hooks/useContract"
import { calculateGasMargin, getContract, getERC20Contract } from "../../../../utils";
import { useActiveWeb3React } from "../../../../hooks/web3";
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils";
import { abi as GEN_DEX_ABI } from "../../../../contracts/GenIDO.json"
import { abi as GEN_STACKING_CONTRACT_ABI } from "../../../../contracts/StakeTESTToken.json"
import { Contract } from "@ethersproject/contracts";
import { ERC20_ABI } from "../../../../constants/abis/erc20";
import bannerIMG from '../../../../images/homepage/banner-img.svg';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Slider from "react-slick";
// import MultiProgress from 'react-multi-progress'
import MultiProgress, { IMultiProgressProps, ProgressComponentProps } from 'react-multi-progress'
import ReactPlayer from "react-player";
import MediaSlider from "../media-slider-comp/mediaSlider";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

var _ = require("lodash");
const ProjectDetails = ({ selectedProjectData }: any) => {
  console.log("selectedProjectData?.data---details", selectedProjectData); //startDate
  const network = useSelector((state: AppState) => state.application.network)
  const genDexAddress = selectedProjectData?.data?.data?.dexAddress;
  const { account, chainId, library } = useActiveWeb3React()
  const [lowAllocPerUserPerTier, setLowAllocPerUserPerTier] = useState(0);
  const [selectedMenu, setselectedMenu] = useState("Description");
  const [projectMenu, setProjectMenu] = useState(["Description"]);

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const genDex = useWeb3Contract(GEN_DEX_ABI)

  const getTGE = async () => {
    if (!genDexAddress || account === undefined) return

    try {

      let getBCProjectInfo = await genDex(genDexAddress!).methods.getProjectInfo().call()

      const erc20 = new Contract(getBCProjectInfo?._underlyingToken as string, ERC20_ABI, library)
      if (!erc20) throw new Error('No Contract!')
      const getTokenDecimals = await erc20.decimals()

      const getTokensPerUSD = getBCProjectInfo?._tokenRate
      const tokensforUSDProject = getTokensPerUSD && formatUnits(getTokensPerUSD, getTokenDecimals)

      const lowTierAllocPerUser = getBCProjectInfo?._minTokenAllocationPermitted
      setLowAllocPerUserPerTier(Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals)) / Number(tokensforUSDProject))
      console.log("lowTierAllocPerUser", lowTierAllocPerUser, Number(lowTierAllocPerUser && formatUnits(lowTierAllocPerUser, getTokenDecimals)) / Number(tokensforUSDProject));

    } catch (error) {
    }
  }

  useEffect(() => {
    getTGE();
  }, [selectedProjectData, account, chainId])

  function createData(
    color: string,
    share: string,
    entity: string,
    amount: string,
    visitingShidule: string,
    tokenPrice: string,
  ) {
    return { color, share, entity, amount, visitingShidule, tokenPrice };
  }

  const rows = [
    createData('#8CBCF5', '20%', "Early Contributors", "2,000,000,000", "12 Months Lock In", "$0.45"),
    createData('#AFD4FF', '14%', "Investors", "1,400,000,000", "12 Months Lock In", "$0.45"),
    createData('#1066CD', '10%', "Mysten Labs Treasury", "1,000,000,000", "12 Months Lock In", "$0.45"),
    createData('#064590', '6%', "Community Access (Public Sale)", "600,000,000", "12 Months Lock In", "$0.45"),
    createData('#2479DF', '50%', "Community Reserve", "5,000,000,000", "12 Months Lock In", "$0.45"),
  ];

  let settings = {
    dots: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
  };

  const collections = [
    {
      desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea"
    },
    {
      desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea"
    },
    {
      desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea"
    }
  ]

  const [playing, setPlaying] = useState(false)

  return (
    <>
      <div className="projectDetails-top">
        <div className="projectDetails">


          <Box
            sx={{ flexGrow: 1, display: 'flex' }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="Description" {...a11yProps(0)} />
              <Tab label="Detailed Metrics" {...a11yProps(1)} />
              <Tab label="Token Details" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <div className="description-content">
                <div className="">

                  <p className="paragraph-new-medium color-white-new">Our project aims to bring the world of gaming to the Web3 ecosystem by leveraging blockchain technology and decentralized finance (DeFi) protocols. Our platform will allow users to buy and sell in-game assets using cryptocurrency, providing a secure and transparent environment for gamers to trade and compete.</p>
                  <p className="paragraph-new-medium color-white-new">Key Features:</p>
                  <ul>
                    <li>
                      <p className="paragraph-new-medium color-white-new">NFT Marketplace: Our platform will feature an NFT marketplace where gamers can buy and sell unique in-game items and assets. These items will be stored on the blockchain, ensuring their authenticity and ownership.</p>
                    </li>
                    <li>
                      <p className="paragraph-new-medium color-white-new">Decentralized Gaming: We believe that decentralized gaming is the future, and our platform will be built on a decentralized network, allowing users to participate in fair and transparent games.</p>
                    </li>
                    <li>
                      <p className="paragraph-new-medium color-white-new">Play-to-Earn: Our platform will enable gamers to earn cryptocurrency by playing games. Players will be rewarded with tokens for their achievements in the game, which they can then use to purchase other in-game assets or withdraw as real-world currency.</p>
                    </li>
                    <li>
                      <p className="paragraph-new-medium color-white-new">Community-Driven: We believe that the success of any gaming platform depends on its community. Our platform will be community-driven, with users having a say in the development of genshard, including the types of games that are offered.</p>
                    </li>
                    <li>
                      <p className="paragraph-new-medium color-white-new">Cross-Chain Interoperability: Our platform will be built on a cross-chain infrastructure, allowing users to trade and transact using different cryptocurrencies and blockchain networks.</p>
                    </li>
                  </ul>
                  <p className="paragraph-new-medium color-white-new">With our platform, we aim to bring the world of gaming to the Web3 ecosystem, offering a secure, transparent, and community-driven environment for gamers to trade and compete.</p>
                  <p className="paragraph-new-medium color-white-new">Problem: Lack of Personalization, Same and Basic Speech Structures, Repetitive and Monotonous Gaming Experience, Basic AI Mechanics Solution: Eldarune offers a unique and personalized gaming experience that is revolutionized by AI integration by adaping player's play style and behavior and Eldarune creates a dynamic, ever-changing gaming world that keeps players engaged and entertained.</p>
                </div>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className="metrics-content">
                <div className="metrics-row">
                  <p className="paragraph-new-medium color-white-new m-0">Price per token</p>
                  <p className="paragraph-new-medium m-0" style={{ color: "#54C4FC" }} >0.009 BUSD per $SOULS</p>
                </div>
                <div className="metrics-row">
                  <p className="paragraph-new-medium color-white-new m-0">Swap Amount</p>
                  <p className="paragraph-new-medium m-0" style={{ color: "#54C4FC" }}>16,111,111 $SOULS</p>
                </div>
                <div className="metrics-row">
                  <p className="paragraph-new-medium color-white-new m-0">Total Raise</p>
                  <p className="paragraph-new-medium m-0" style={{ color: "#54C4FC" }}>$145,000</p>
                </div>
                <div className="metrics-row">
                  <p className="paragraph-new-medium color-white-new m-0">Claim Type</p>
                  <p className="paragraph-new-medium m-0" style={{ color: "#54C4FC" }}>Claim on Red Kite</p>
                </div>
                <div className="metrics-row">
                  <p className="paragraph-new-medium color-white-new m-0">Accepted Currency</p>
                  <p className="paragraph-new-medium m-0" style={{ color: "#54C4FC" }}>0.009 BUSD per $SOULS</p>
                </div>
                <div className="metrics-row">
                  <p className="paragraph-new-medium color-white-new m-0">Swap Network</p>
                  <p className="paragraph-new-medium m-0" style={{ color: "#54C4FC" }}>Binance Smart Chain</p>
                </div>
                <div className="metrics-row">
                  <p className="paragraph-new-medium color-white-new m-0">Token Claim Network</p>
                  <p className="paragraph-new-medium m-0" style={{ color: "#54C4FC" }}>Binance Smart Chain</p>
                </div>
                <div className="metrics-row">
                  <p className="paragraph-new-medium color-white-new m-0">Vesting Schedule</p>
                  <p className="paragraph-new-medium m-0" style={{ color: "#54C4FC" }}>TBA</p>
                </div>
              </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div className="table-color-bar">
                <div className="malti-color-progress-bar">
                  <MultiProgress
                    transitionTime={1.2}
                    elements={[
                      {
                        value: 50,
                        color: "#2479DF",
                      },
                      {
                        value: 6,
                        color: "#064591",
                      },
                      {
                        value: 10,
                        color: "#1066CD",
                      },
                      {
                        value: 14,
                        color: "#AFD4FF",
                      },
                      {
                        value: 20,
                        color: "#8CBCF5",
                      }
                    ]}
                    height={15}
                    backgroundColor="gray"
                    className="my-custom-css-class"
                  // component={CustomComponent}
                  />
                </div>
                <div className="token-details-table">
                  <TableContainer className="table-bar " component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Share</TableCell>
                          <TableCell>Entity</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Vesting Schedule</TableCell>
                          <TableCell>Token Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows && rows.map((row) => (
                          <TableRow
                            key={row?.share}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>{row?.share}</TableCell>
                            <TableCell>{row?.entity}</TableCell>
                            <TableCell>{row?.amount}</TableCell>
                            <TableCell>{row?.visitingShidule}</TableCell>
                            <TableCell>{row?.tokenPrice}</TableCell>
                          </TableRow>
                        ))}

                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </TabPanel>
          </Box>
        </div>
        <div className="d-lg-block d-md-block d-none">
          <MediaSlider />
        </div>
        {/* <div className="description">
        {selectedProjectData?.data?.projectDescription}
      </div> */}
        {/* <div className="startsDate">
        <div className="title">Starts</div>
        <div className="value">{moment.unix(parseInt(selectedProjectData?.data?.startDate!)).utc().format('MMM DD, kk:mm')} UTC</div>
      </div> */}

        {/* <div className="pricePRJX">
        <div className="title">Price</div>
        <div className="value">1 ${selectedProjectData?.data?.projectShortCode} = ${Number(selectedProjectData?.totalTokenAllocation) / Number(selectedProjectData?.data?.hardCapValue)}</div>
      </div> */}
        {/* <div className="token">
            <div className="tokenText">Token</div>
            <div className="allTokenDetails">
              <div className="details">
                <div className="title">Token</div>
                <div className="value">{selectedProjectData?.data?.name} ({selectedProjectData?.data?.projectShortCode})</div>
              </div>
              <div className="details">
                <div className="title">Type</div>
                <div className="value">{network === 'BSC' || network === 'T-BSC' ? "BEP-20" : "ERC-20"}</div>
              </div>
              <div className="details">
                <div className="title">Total Supply</div>
                <div className="value">{Number(selectedProjectData?.totalTokenAllocation ? selectedProjectData?.totalTokenAllocation : selectedProjectData?.data?.totalSuppliedTokenSize).toFixed(0)} {selectedProjectData?.data?.projectShortCode}</div>
              </div>
              <div className="details">
                <div className="title">Intial Supply</div>
                <div className="value">{selectedProjectData?.data?.initialSuppliedTokenSize}</div>
              </div>
              <div className="details">
                <div className="title">Token Listing</div>
                <div className="value">{
                  moment.unix(selectedProjectData?.tge!).utc().format('MMM DD, kk:mm') == "Invalid date" ? 'TBC' : moment.unix(selectedProjectData?.tge!).utc().format('MMM DD, kk:mm') + ' UTC'}</div>
              </div>
            </div>
          </div>
          <div className="distribution">
            <div className="distributionText">Distribution</div>
            <div className="allDistribution">
              <div className="details">
                <div className="title">Distribution</div>
                <div className="value">Claimed on Genpad</div>
              </div>
              <div className="details">
                <div className="title">Vesting</div>
                <div className="value">
                  {
                    selectedProjectData?.arrayOfWeightages?.length > 0 ? `${selectedProjectData?.arrayOfWeightages?.[0]}% at TGE, from 2nd Month linear vesting in ${selectedProjectData?.arrayOfWeightages?.length - 1} months` : "-"
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="poolDetails">
            <div className="poolDetailsText">Pool Details</div>
            <div className="allPoolDetails">
              <div className="details">
                <div className="title">Hard Cap</div>
                <div className="value">${selectedProjectData?.data?.hardCapValue}</div>
              </div>
              <div className="details">
                <div className="title">Swap rate</div>
                <div className="value">1 {selectedProjectData?.data?.projectShortCode} = ${Number(selectedProjectData?.data?.totalSuppliedTokenSize) / Number(selectedProjectData?.data?.hardCapValue)} || {Number(selectedProjectData?.tokensPerUSD ? selectedProjectData?.tokensPerUSD : selectedProjectData?.data?.perTokenPrice).toFixed(2)} {selectedProjectData?.data?.projectShortCode} per 1 BUSD</div>
              </div>
              <div className="details">
                <div className="title">Start</div>
                <div className="value">{moment.unix(parseInt(selectedProjectData?.data?.preIdo!)).utc().format('MMM DD, kk:mm')} UTC</div>
              </div>
            </div>
          </div>
          */}
        {/* {selectedProjectData?.cardTitle === "Ended" && <div className="cardTypeLabel">Base Allocation = ${lowAllocPerUserPerTier}</div>}
      {selectedProjectData?.cardTitle === "Upcoming" && <div className="cardTypeLabel">Registration will open soon</div>}
      {selectedProjectData?.cardTitle === "LIVE" && <>
        <div className="timeLime">TIMELIME</div>
        <ul className="timeline-main-container">
          <div className="timeline-background-container">
            <div className="timeline-background" />
          </div>
          {_.map(selectedProjectData?.data?.timeline, (item: { title: string; date: number }) => {
            console.log(item?.date, "=============", moment().unix());

            return (
              <li
                className={`timeline-item-container ${item.date < moment().unix() ? "select-timeline-item" : ""
                  }`}
              >
                <div className="ball-outer">
                  <div className="ball-middle">
                    <div className="ball-inner" />
                  </div>
                </div>
                <div className="timeline-title" style={{ color: (item.date < moment().unix()) ? '#FF0071' : '' }}> - {item.title}</div>
              </li>

            );
          })}
          <div className="timeline-bottom-background-container">
            <div className="timeline-bottom-background" />
          </div>
        </ul>
      </>} */}
      </div>
      <div className="d-lg-none d-md-none d-block">
        <MediaSlider />
      </div>
    </>
  );
};

export default ProjectDetails;
function renderReactPlayer(videoContainer: HTMLElement | null, arg1: { url: string; playing: boolean; }) {
  throw new Error("Function not implemented.");
}


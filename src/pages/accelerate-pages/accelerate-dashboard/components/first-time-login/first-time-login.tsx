import React, { useEffect, useState } from 'react'
import "./first-time-login.sass"
import Accelerate from '../../../../../images/accelerate/accelerate.svg';
import ArbitrumIcon from '../../../../../images/accelerate/arbitrum-icon.svg';
import ZksyncIcon from '../../../../../images/accelerate/zksync-icon.svg';
import Raised from "../../../../../images/homepage/raised.svg"
import ProjectLaunch from "../../../../../images/homepage/project-launch.svg"
import Partners from "../../../../../images/homepage/partners.svg"
import GlobalCommunity from "../../../../../images/homepage/global-community.svg"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Checkbox, Chip, FormControl, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, Theme, useTheme } from '@mui/material';
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useAddPopup } from '../../../../../state/application/hooks';
import { WelcomingSection } from '../welcoming-section/welcoming-section';
import CelebrateBGIcon from '../../../../../images/accelerate/pages/celebrate-bg-icon.svg';
import { DashbordTopSection } from '../dashbord-top-section/dashbord-top-section';


const counterData = [
    {
        image: ProjectLaunch,
        name: "Project Launches",
        number: "50+"
    },
    {
        image: Raised,
        name: "Raised",
        number: "$1.6M+"
    },
    {
        image: Partners,
        name: 'Partners',
        number: "450+"
    },
    {
        image: GlobalCommunity,
        name: "Global Community",
        number: "110K+"
    },
]

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const names = [
    "Humaira Sims",
    "Santiago Solis",
    "Dawid Floyd",
    "Mateo Barlow",
    "Samia Navarro",
    "Kaden Fields",
    "Genevieve Watkins",
    "Mariah Hickman",
    "Rocco Richardson",
    "Harris Glenn"
];

const accelerateFormInputData: any = {
    "Founder Information": [
        {
            questionid: 1,
            questionTitle: "Hello there! Can we get your full name",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Pleasure to meet you!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 2,
            questionTitle: "Can you please give us your date of birth",
            questiontype: "datepicker",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "What is the best email address to contact you on?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 4,
            questionTitle: "Can we also have a phone number, please?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: "Please paste the link to your LinkedIn profile",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
        },
        {
            questionid: 6,
            questionTitle: "Please upload your latest CV",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
    ],
    "Company information": [
        {
            questionid: 1,
            questionTitle: "Company name - What is the legal name of your venture?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 2,
            questionTitle: "Creation date - When did you begin building this?",
            questiontype: "datepicker",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Location - In what legal jurisdiction is it based? (City, Country)",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
        },
        {
            questionid: 4,
            questionTitle: "If your company has a website, please share the link",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: "Company description - Briefly describe your company. What is your value proposition? What sector do you operate in? Etc.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
        },
        {
            questionid: 6,
            questionTitle: "What is your role within the company? (Options - CEO, CTO, CMO, COO, Other)",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 7,
            questionTitle: "Employee count: How many employees do you have?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 8,
            questionTitle: "If you have a pitch deck that describes your company, please upload it",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 9,
            questionTitle: "If you have your company’s whitepaper, please upload it",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 10,
            questionTitle: "What stage is your company currently in",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
            dropdownOption: [
                "MVP",
                "Early Traction",
                "Growth Phase",
                "Other"
            ]
        },
    ],
    "Company Metrics": [
        {
            questionid: 1,
            questionTitle: "How many users do you currently have?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: false,
            dropdownOption: [
                "Less than 10",
                "10-100",
                "100-1000",
                "1000-10",
                "000",
                "10,000+"
            ]
        },
        {
            questionid: 2,
            questionTitle: "What is your average monthly spending? (Amount in $)",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
            dropdownOption: [
                "Under 1k",
                "1k-5k",
                "5k-10k",
                "10k-50k",
                "50k+"
            ]
        },
        {
            questionid: 3,
            questionTitle: "What is your average monthly revenue? (Amount in $)",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
            dropdownOption: [
                "Under 1k",
                "1k-5k",
                "5k-10k",
                "10k-50k",
                "50k+"
            ]
        },
        {
            questionid: 4,
            questionTitle: "Does your company currently have any debt?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
            dropdownOption: [
                "Yes",
                "NO",
            ]
        },
        {
            questionid: 5,
            questionTitle: "Have you raised any capital for your business?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
            dropdownOption: [
                "Yes",
                "NO",
            ]
        },
        {
            questionid: 6,
            questionTitle: "Have you previously participated in an incubator, accelerator or pre-accelerator program?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
            dropdownOption: [
                "Yes",
                "NO",
            ]
        },
    ],
    "Team Details": [
        {
            questionid: 1,
            questionTitle: "How many co-founders do you have?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: true,
            dropdownOption: [
                "1",
                "2",
                "3",
                "More",
            ]
        },
        {
            questionid: 2,
            questionTitle: "Please give us your co-founder(s) LinkedIn profile(s)",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
        },
        {
            questionid: 3,
            questionTitle: "How long have you known each other?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
            dropdownOption: [
                " Less than a year",
                "1-2 years",
                "2-5 years",
                "5-10 years",
                "10+ years"
            ]
        },
        {
            questionid: 4,
            questionTitle: "Is the team working full time on this project?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
            dropdownOption: [
                "Yes",
                "NO",
            ],
            isdropdownNo: {
                questionid: 5,
                questionTitle: "What other professional activities are you involved in?",
                questiontype: "textbox",
                userAnswered: "",
                successMsg: "We promise, no spam!",
                errorMsg: "please enter your number",
                isRequired: false,
            },
        },
        {
            questionid: 6,
            questionTitle: "Please outline the equity ownership of your company and any other relevant information regarding its structure.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
        },
        {
            questionid: 7,
            questionTitle: "If you have anything else you would like to share regarding your venture, please elaborate.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
    ],
    "Additional information": [
        {
            questionid: 1,
            questionTitle: "Why are you applying to our accelerator program? Choose as many as you like",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: true,
            multiSelectDropdownOption: [
                " Idea clarity and MVP build",
                "Product market fit",
                "Company structuring and legal",
                "Team",
                "Networks with ecosystem partners",
                "Capital and VC Networks",
                "Marketing and KOL connections",
                "Public Launch",
                "Other"
            ]
        },
        {
            questionid: 2,
            questionTitle: " Are you committed to working exclusively on this project during the course of the accelerator program?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
            dropdownOption: [
                "Yes",
                "NO",
            ],
        },
    ],
}

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
            style={{ width: "100%" }}
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

const FirstTimeLogin = () => {
    const [selectedNames, setSelectedNames] = useState<any>([]);
    const [inputValue, setInputValue] = useState<any>();
    const [selectedObjData, setSelectedObjData] = useState<any>();
    const [value, setValue] = useState(0);
    const [jsonDict, setJsonDict] = useState<any>([]);
    const addErrorPopup = useAddPopup();

    const handleSubmitData = async () => {

        addErrorPopup({
            txn: {
                hash: '',
                success: true,
                summary: "Your request submitted successfully.",
                description: '',
                withExternalLink: false,
            }
        });
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setJsonDict([])
        for (let index = 0; index < Number(newValue); index++) {
            let isHavingError = true
            let keyElement = Object.keys(selectedObjData)[index];
            selectedObjData[keyElement].map((dataItemObj: any, p: any) => {
                if (dataItemObj?.isRequired == true && dataItemObj?.userAnswered.length > 0) {
                    isHavingError = false
                }
            })
            let errorObj = { "key": keyElement, "isError": isHavingError }
            setJsonDict((prev: any) => [...prev, errorObj])
        }
        setValue(newValue);
    };

    const checkIsSectionHavingError = (sectionkeyName: any) => {
        const filtered = jsonDict.filter(obj => {
            return obj.key === sectionkeyName;
        });
        return filtered
    }

    const [personName, setPersonName] = React.useState<string[]>([]);

    const location = useLocation()
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    console.log("splitLocationsplitLocation", splitLocation)
    const isProjectProfile = pathname.includes("/project-view/profile")


    useEffect(() => {
        setSelectedObjData(accelerateFormInputData)
    }, [])

    const handelValueChange = (e: any, itemOBJ: any, position: number, itemKey: any) => {
        setInputValue(e || "")
        itemOBJ.userAnswered = e || ""
    };

    const handleChangeSelectEvent = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChangeMultiSelect = (event: SelectChangeEvent<typeof selectedNames>, itemOBJ: any) => {
        console.log("eventevent", event)
        console.log("itemOBJitemOBJ", itemOBJ)
        const value : any = event;
        setSelectedNames(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
        itemOBJ.userAnswered = selectedNames || ""
      };

      
    const history = useHistory()

    const isProjectFirstTimeLogin = pathname.includes("/project-view/first-time-login")

    return (
        <>
            <div className='position-relative'>
                {isProjectFirstTimeLogin &&
                    <>
                        <img className='cele-bg' src={CelebrateBGIcon} alt="" />
                        <WelcomingSection />
                    </>
                }
                {isProjectProfile &&
                    <DashbordTopSection symbioteScore={undefined} setSymbioteScore={undefined} />
                }
                <div className='form-section mb-5'>
                    <div className='container container-maxwidth'>
                        {/* <div className=' mt-lg-4 mt-md-3 mt-2 data-sections d-flex align-items-center justify-content-center position-relative'>
                            <div className='heading-new-6 text-center' style={{ color: "#848484" }}>Fields and sections marked in Orange will guide you to the unfilled data sections</div>
                            <div className='text-end position-absolute end-0'><button className='new-primary-button' onClick={() => history.push('/project-dashboard')}>Skip</button></div>
                        </div> */}
                        <div className="projectDetails-top background-primary mt-lg-5 mt-md-3 mt-2">
                            <div className="projectDetails">
                                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                                    <Tabs
                                        orientation="vertical"
                                        variant="scrollable"
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="Vertical tabs example"
                                        sx={{ borderRight: 1, borderColor: 'divider' }}
                                    >
                                        {selectedObjData && Object.keys(selectedObjData).map((key: any, i: any) => (

                                            <Tab label={key} {...a11yProps(key)} key={i} className={checkIsSectionHavingError(key).length == 0 ? 'defaultTab' : checkIsSectionHavingError(key)[0].isError === true ? "warningTab" : "successTab"} />
                                        ))}
                                    </Tabs>
                                    {selectedObjData && Object.keys(selectedObjData).map((key: any, i: any) => (
                                        <>
                                            <TabPanel value={value} index={i} key={i} >
                                                <div className='founders-form'>
                                                    <form>
                                                        {selectedObjData[key].map((item: any, index: any) => (
                                                            <div key={i}>
                                                                {/* inpute text box */}
                                                                {item && item?.questiontype === "textbox" &&
                                                                    <div className="form-group mb-lg-4 mb-md-3 mb-2 position-relative">
                                                                        <label className='paragraph-new fw-lighter mb-3'>{item?.questionTitle}</label>
                                                                        <input type="text" className="form-control" value={item && item?.userAnswered || ""} id={item.questionid} onChange={(e: any) => { handelValueChange(e?.target?.value, item, index, key) }} />
                                                                        {item && item?.isRequired ? item?.userAnswered?.length > 0 ?
                                                                            <>
                                                                                <div className='paragraph-new-medium success mb-0 mt-2 text-end'>{item?.successMsg}</div>
                                                                            </> :
                                                                            <>
                                                                                <div className='paragraph-new-medium error mb-0 mt-2 text-end'>{item?.errorMsg}</div>
                                                                            </> : null
                                                                        }
                                                                    </div>
                                                                }
                                                                {/* date inpute */}
                                                                {item && item?.questiontype === "datepicker" &&
                                                                    <div className="form-group mb-lg-4 mb-md-3 mb-2">
                                                                        <label className='paragraph-new fw-lighter mb-3'>{item?.questionTitle}</label>
                                                                        <input type="date" className="form-control" value={item && item?.userAnswered || ""} name="dateofbirth" id={item.questionid} onChange={(e: any) => { handelValueChange(e?.target?.value, item, index, key) }} />
                                                                        {item && item?.isRequired ? item?.userAnswered?.length > 0 ?
                                                                            <>
                                                                                <div className='paragraph-new-medium success mb-0 mt-2 text-end'>{item?.successMsg}</div>
                                                                            </> :
                                                                            <>
                                                                                <div className='paragraph-new-medium error mb-0 mt-2 text-end'>{item?.errorMsg}</div>
                                                                            </> : null
                                                                        }
                                                                    </div>
                                                                }
                                                                {/* file uploader */}
                                                                {item && item?.questiontype === "fileupload" &&
                                                                    <div className="form-group mb-lg-4 mb-md-3 mb-2 position-relative">
                                                                        <label className='paragraph-new fw-lighter mb-3'>{item?.questionTitle}</label>
                                                                        <div className="file-uploader position-relative">
                                                                            <input type="file" className="form-control" name="file" value={item && item?.userAnswered || ""} id={item.questionid} onChange={(e: any) => { handelValueChange(e?.target?.value, item, index, key) }} />
                                                                            <i className="ri-upload-2-line"></i>
                                                                        </div>
                                                                        {item && item?.isRequired ? item?.userAnswered?.length > 0 ?
                                                                            <>
                                                                                <div className='paragraph-new-medium success mb-0 mt-2 text-end'>{item?.successMsg}</div>
                                                                            </> :
                                                                            <>
                                                                                <div className='paragraph-new-medium error mb-0 mt-2 text-end'>{item?.errorMsg}</div>
                                                                            </> : null
                                                                        }
                                                                    </div>
                                                                }

                                                                {/* malti select dropdown */}
                                                                {item && item?.questiontype === "dropdown" && item?.multiSelectDropdownOption &&
                                                                    <div className="form-group mb-lg-4 mb-md-3 mb-2 position-relative">
                                                                        <label className='paragraph-new fw-lighter mb-3'>{item?.questionTitle}</label>
                                                                        <div className="malti-select">
                                                                            <FormControl sx={{ width: "100%" }}>
                                                                                <Select
                                                                                    multiple
                                                                                    // value={item && item?.userAnswered || ""}
                                                                                    value={selectedNames}
                                                                                    onChange={(e: any) => handleChangeMultiSelect(e.target.value, item)}
                                                                                    input={<OutlinedInput label="Multiple Select" />}
                                                                                    renderValue={(selected) => (
                                                                                        <Stack gap={1} direction="row" flexWrap="wrap">
                                                                                            {selected.map((value: any) => (
                                                                                                <Chip
                                                                                                    key={value + 1}
                                                                                                    label={value}
                                                                                                    onDelete={() =>
                                                                                                        setSelectedNames(
                                                                                                            selectedNames.filter((item: any) => item !== value)
                                                                                                        )
                                                                                                    }
                                                                                                    deleteIcon={
                                                                                                        <CancelIcon
                                                                                                            onMouseDown={(event) => event.stopPropagation()}
                                                                                                        />
                                                                                                    }
                                                                                                />
                                                                                            ))}
                                                                                        </Stack>
                                                                                    )}
                                                                                >
                                                                                    {item?.multiSelectDropdownOption.map((name: any) => (
                                                                                        <MenuItem
                                                                                            key={name}
                                                                                            value={name}
                                                                                            sx={{ justifyContent: "space-between" }}
                                                                                        >
                                                                                            {name}
                                                                                            {selectedNames.includes(name) ? <CheckIcon color="info" /> : null}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </Select>
                                                                            </FormControl>
                                                                            {item && item?.isRequired ? item?.userAnswered?.length > 0 ?
                                                                                <>
                                                                                    <div className='paragraph-new-medium success mb-0 mt-2 text-end'>{item?.successMsg}</div>
                                                                                </> :
                                                                                <>
                                                                                    <div className='paragraph-new-medium error mb-0 mt-2 text-end'>{item?.errorMsg}</div>
                                                                                </> : null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {/* single select dropdown */}
                                                                {item && item?.questiontype === "dropdown" && item?.dropdownOption &&
                                                                    <>
                                                                        <div className="form-group mb-lg-4 mb-md-3 mb-2" >
                                                                            <label className='paragraph-new fw-lighter mb-3'>{item?.questionTitle}</label>
                                                                            <select className="form-select select-option" aria-label="Default select example" onChange={(e: any) => { handelValueChange(e?.target?.value, item, index, key) }} value={item?.userAnswered}>
                                                                                <option selected disabled>Open this select menu</option>
                                                                                {item?.dropdownOption.map((name: any) => (
                                                                                    <option value={name} >{name}</option>
                                                                                ))}
                                                                            </select>
                                                                            {item && item?.isRequired ? item?.userAnswered?.length > 0 ?
                                                                                <>
                                                                                    <div className='paragraph-new-medium success mb-0 mt-2 text-end'>{item?.successMsg}</div>
                                                                                </> :
                                                                                <>
                                                                                    <div className='paragraph-new-medium error mb-0 mt-2 text-end'>{item?.errorMsg}</div>
                                                                                </> : null
                                                                            }
                                                                        </div>
                                                                        {item && item.isdropdownNo && item?.userAnswered === "NO" &&
                                                                            <div className="form-group mb-lg-4 mb-md-3 mb-2 position-relative">
                                                                                <label className='paragraph-new fw-lighter mb-3'>{item?.isdropdownNo?.questionTitle}</label>
                                                                                <input type="text" className="form-control" value={item && item?.isdropdownNo?.userAnswered || ""} id={item?.isdropdownNo?.questionid} onChange={(e: any) => { handelValueChange(e?.target?.value, item, index, key) }} />
                                                                                {item && item?.isdropdownNo?.isRequired ? item?.isdropdownNo?.userAnswered?.length > 0 ?
                                                                                    <>
                                                                                        <div className='paragraph-new-medium success mb-0 mt-2 text-end'>{item?.isdropdownNo?.successMsg}</div>
                                                                                    </> :
                                                                                    <>
                                                                                        <div className='paragraph-new-medium error mb-0 mt-2 text-end'>{item?.isdropdownNo?.errorMsg}</div>
                                                                                    </> : null
                                                                                }
                                                                            </div>
                                                                        }
                                                                    </>
                                                                }
                                                            </div>
                                                        ))}
                                                    </form>
                                                    <div className="text-center">
                                                        {Number(value) === Object.keys(selectedObjData).length - 1 ?
                                                            <button className='new-primary-button' onClick={() => history.push('/project-thanks')}>Submit</button> : ""
                                                        }
                                                    </div>
                                                </div >
                                            </TabPanel>
                                        </>
                                    ))}
                                </Box>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default FirstTimeLogin
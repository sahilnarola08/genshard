import React, { useEffect, useState } from 'react'
import "./all-form.sass"
import accelerate from '../../../../images/accelerate/accelerate.svg';
import arbitrumIcon from '../../../../images/accelerate/arbitrum-icon.svg';
import zksyncIcon from '../../../../images/accelerate/zksync-icon.svg';
import Raised from "../../../../images/homepage/raised.svg"
import ProjectLaunch from "../../../../images/homepage/project-launch.svg"
import Partners from "../../../../images/homepage/partners.svg"
import GlobalCommunity from "../../../../images/homepage/global-community.svg"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Checkbox, Chip, FormControl, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, Theme, useTheme } from '@mui/material';
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { useLocation, useParams } from 'react-router-dom';
import { useAddPopup } from '../../../../state/application/hooks';
import Accelerateprogram from './components/accelerate-program/accelerate-program';

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
            isdropdownNo: {
                questionid: 5,
                questionTitle: "please explain why you are unable to work full-time on this project.",
                questiontype: "textbox",
                userAnswered: "",
                successMsg: "We promise, no spam!",
                errorMsg: "please enter your number",
                isRequired: false,
            },

        },
    ],
}
const partnerFormInputData: any = {
    "PERSONAL DETAILS": [
        {
            questionid: 1,
            questionTitle: "Can we have your full name, please?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Pleasure to meet you!",
            errorMsg: "please fillup the question",
            isRequired: false,
        },
        {
            questionid: 2,
            questionTitle: "Please share your email ID.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
        },
        {
            questionid: 3,
            questionTitle: "Please share your Telegram ID.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
        },
        {
            questionid: 4,
            questionTitle: "Where are you from? (City, Country)",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
    ],
    "COMPANY DETAILS": [
        {
            questionid: 1,
            questionTitle: "Please share your company name",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: false,
        },
        {
            questionid: 2,
            questionTitle: "Please share the link to your company's website",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
        },
        {
            questionid: 3,
            questionTitle: "Which area do you operate in?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
            multiSelectDropdownOption: [
                "Audit",
                "Legal",
                "Marketing",
                "KOL",
                "Community",
                "DeFi",
            ]
        },
        {
            questionid: 4,
            questionTitle: "What does your company do? Please share a short description.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: "What kind of partner connections are you expecting from Symbiote?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
    ],
}
const VCFormInputData: any = {
    "PERSONAL INFORMATION": [
        {
            questionid: 1,
            questionTitle: "Please specify your name / the name of your fund",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Pleasure to meet you!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 2,
            questionTitle: "Please share your email address",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Can we also have your Telegram ID?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 4,
            questionTitle: "Where are you from? (City, Country)",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: "Please provide a link to your LinkedIn profile.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
        },
    ],
    "VC INFORMATION": [
        {
            questionid: 1,
            questionTitle: "Are you an accredited investor?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: true,
            dropdownOption: [
                "Yes",
                "No"
            ]

        },
        {
            questionid: 2,
            questionTitle: "Please provide a link to your website.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Please share the number of portfolio companies",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 4,
            questionTitle: "Please provide a link to your portfolio",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: " Which stage do you invest in?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
            dropdownOption: [
                "Early Stage",
                "Private",
                "Seed",
                "Series A",
                "Post Series A"
            ]
        },
        {
            questionid: 6,
            questionTitle: "What is your average investment ticket?  (Amount in $)",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
            dropdownOption: [
                "Under 10k",
                "10k-50k",
                "50k-100k",
                "100k-200k",
                "200k-500k",
                "500k+",
            ]
        },
        {
            questionid: 7,
            questionTitle: "Which assets do you invest in?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
            dropdownOption: [
                "Equity",
                "Tokens",
                "Both",
            ]
        },
        {
            questionid: 8,
            questionTitle: "Which sector(s) would you like to invest in?",
            questiontype: "fileupload",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
            multiSelectDropdownOption: [
                "DeFi",
                "DAOs",
                "Web3 Education",
                "Marketplaces",
                "NFTs",
                "Web3 Social Platforms",
                "Other",
            ]
        }
    ],
    "ADDITIONAL INFORMATION": [
        {
            questionid: 1,
            questionTitle: "What are the top things you look for in a startup?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: false,
        },
        {
            questionid: 2,
            questionTitle: "What are your value adds to a startup?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Please share details of your partnerships with other web3 companies",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: false,
        },
        {
            questionid: 4,
            questionTitle: " Please specify your investment thesis & your industry expertise",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
        }
    ],
}
const mentorFormInputData: any = {
    "PERSONAL INFORMATION": [
        {
            questionid: 1,
            questionTitle: "Please specify your full name.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Pleasure to meet you!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 2,
            questionTitle: "Please share your email address",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Can we also have your Telegram ID?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 4,
            questionTitle: "Where are you from? (City, Country)",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: "Please provide a link to your LinkedIn profile.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
        },
    ],
    "MENTORSHIP DETAILS": [
        {
            questionid: 1,
            questionTitle: "What unique contribution can you bring to the startups that you mentor?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: true
        },
        {
            questionid: 2,
            questionTitle: "How many years of experience do you have mentoring startups?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Please share your past work records (link(s)) that show the credibility of your experience.",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your birth date",
            isRequired: true,
        },
        {
            questionid: 4,
            questionTitle: "Why are you interested in becoming a Symbiote mentor?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
        },
        {
            questionid: 5,
            questionTitle: " Choose at least one of the following areas of expertise",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: true,
            multiSelectDropdownOption: [
                "Product development",
                "Market-fit",
                "Technology",
                "Fundraising",
                "Unit economics",
                "Business development",
                "Marketing",
                "Community engagement",
                "Go to market strategy",
                "Legal",
            ]
        },
        {
            questionid: 6,
            questionTitle: "What else should we know about you?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please enter your number",
            isRequired: false,
        }
    ]
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

const AllForms = () => {
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
        console.log("newValuenewValue", newValue, jsonDict)
        setValue(newValue);
    };

    const checkIsSectionHavingError = (sectionkeyName: any) => {
        console.log('sectionkeyName', sectionkeyName, jsonDict);
        const filtered = jsonDict.filter(obj => {
            return obj.key === sectionkeyName;
        });
        console.log('filteredfilteredfiltered', filtered);
        return filtered
    }

    const [personName, setPersonName] = React.useState<string[]>([]);

    const location = useLocation()
    const { pathname } = location;
    const splitLocation = pathname.split("/");

    useEffect(() => {
        if (splitLocation && splitLocation[2] === "project-ahead") {
            setSelectedObjData(accelerateFormInputData)
        } else if (splitLocation && splitLocation[2] === "become-partner") {
            setSelectedObjData(partnerFormInputData)
        } else if (splitLocation && splitLocation[2] === "invest") {
            setSelectedObjData(VCFormInputData)
        } else if (splitLocation && splitLocation[2] === "mentor-projects") {
            setSelectedObjData(mentorFormInputData)
        }
    }, [])

    const submitFormData = (e: any) => {
        debugger
    };

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
    return (
        <>
            <div>
                <div className='form-header-section'>
                    <div className='container container-maxwidth'>
                        <div className='d-flex justify-content-between form-hrading mb-5'>
                            <div className='d-flex align-items-center'>
                                <img className='accelerate-img' src={accelerate} alt="" />
                                <h4 className='form-text mt-0'>Contact Form</h4>
                            </div>
                            <div className='launch-text d-lg-flex d-md-flex d-none'>
                                <p className='mb-0'>Home for launches on</p>
                                <img src={arbitrumIcon} alt="" />
                                <p>&</p>
                                <img src={zksyncIcon} alt="" />
                            </div>
                            <div className='launch-text d-lg-none d-md-none d-block text-center'>
                                <div>
                                    <p className='mb-0'>Home for launches on</p>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <img src={arbitrumIcon} alt="" />
                                    <p >&</p>
                                    <img src={zksyncIcon} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row mt-lg-5 mt-md-3 mt-2">
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="row">
                                        {counterData && counterData.map((item: any, i: number) => {
                                            return <div className="col-lg-3 col-md-4 col-6">
                                                <div className="counter-card">
                                                    <div className="counter-img">
                                                        <img src={item.image} className='img-fluid' alt="" />
                                                    </div>
                                                    <h2 className='heading-new-2'>{item.number}</h2>
                                                    <p className='paragraph-new-medium'>{item.name}</p>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='form-section mb-5'>
                    <div className='container container-maxwidth'>
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
                                        {/* <Tab label="Company Information" {...a11yProps(1)} />
                                        <Tab label="Company Metrics" {...a11yProps(2)} />
                                        <Tab label="Management Information" {...a11yProps(3)} />
                                        <Tab label="Additional Information" {...a11yProps(4)} /> */}
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
                                                                        <label className='paragraph-new fw-lighter mb-lg-3 mb-md-3 mb-2'>{item?.questionTitle}</label>
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
                                                                        <label className='paragraph-new fw-lighter mb-lg-3 mb-md-3 mb-2'>{item?.questionTitle}</label>
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
                                                                        <label className='paragraph-new fw-lighter mb-lg-3 mb-md-3 mb-2'>{item?.questionTitle}</label>
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
                                                                        <label className='paragraph-new fw-lighter mb-lg-3 mb-md-3 mb-2'>{item?.questionTitle}</label>
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
                                                                                                    key={value+1}
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
                                                                            <label className='paragraph-new fw-lighter mb-lg-3 mb-md-3 mb-2'>{item?.questionTitle}</label>
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
                                                                                <label className='paragraph-new fw-lighter mb-lg-3 mb-md-3 mb-2'>{item?.isdropdownNo?.questionTitle}</label>
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
                                                            <button className='new-primary-button' onClick={handleSubmitData}>Submit</button> : ""
                                                        }
                                                    </div>
                                                </div>
                                            </TabPanel>
                                        </>
                                    ))}
                                    {/* <TabPanel value={value} index={1}>
                                        <p>We are currently planning to be a fully remote and virtual program. There may be the opportunity for in-person events in major cities. We have so far incubated companies from all over the globe.</p>
                                    </TabPanel>
                                    <TabPanel value={value} index={2}>
                                        <p>Symbiote Accelerate is designed to support decentralized projects to design, build, and scale at every stage of their development.</p>
                                        <p>We provide support via relationships, introductions, and access to specialists from across the venture platform. We have incubated and supported leading Web 3.0 teams and can bring a powerhouse of support to ventures building Web 3.0 infrastructure.</p>
                                    </TabPanel>
                                    <TabPanel value={value} index={3}>
                                        <p>Once we help you with your public launch and listing, expect to establish a long-term relationship with our founders and team. We will be there at every step of your success and continue providing value.</p>
                                    </TabPanel>
                                    <TabPanel value={value} index={4}>
                                        <p>Once we help you with your public launch and listing, expect to establish a long-term relationship with our founders and team. We will be there at every step of your success and continue providing value.</p>
                                    </TabPanel> */}
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Accelerateprogram />
                </div>

            </div >
        </>
    )
}

export default AllForms
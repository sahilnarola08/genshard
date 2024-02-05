import React, { useEffect, useState } from 'react'
import "../accelerate-dashboard/accelerate-dashboard.sass"
import "./vc-dashboard.sass"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Footercmp from '../../../shared/components/footercmp/footercmp';
import { VCHeroSection } from './components/vc-hero-section/vc-hero-section';
import { Avatar, Chip, FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack } from '@mui/material';
import { VCCard } from './components/vc-card/vc-card';
import { VCDashboardComp } from './components/vc-dashboard-comp/vc-dashboard-comp';
import VcProjects from './components/vc-projects/vc-projects';
import VcAllProjects from './components/vc-all-projects/vc-all-projects';
import VCConnectionRequest from './components/vc-connection-request/vc-connection-request';
import { useHistory, useLocation } from 'react-router-dom';
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAddPopup } from '../../../state/application/hooks';

const vcFormInputData: any = {
    "Contact Information": [
        {
            questionid: 1,
            questionTitle: "Full Name",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Pleasure to meet you!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 2,
            questionTitle: "Email ID",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your email id",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Telegram ID",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your telegram id",
            isRequired: true,
        },
        {
            questionid: 4,
            questionTitle: "Where are you fom?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter address",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: "Please paste the link to your LinkedIn profile",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your profie link",
            isRequired: true,
        },
    ],
    "Company Information": [
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
            questionTitle: "What is your average investment ticket?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please fillup the question",
            isRequired: true,
            dropdownOption: [
                "Under 10k",
                "10k-50k",
                "50k-100k",
                "100k-200k",
                "200k-500k",
                "500k+"
            ]
        },
        {
            questionid: 3,
            questionTitle: "Which assets do you invest in?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please fillup the question",
            isRequired: true,
            dropdownOption: [
                "Yes",
                "No"
            ]
        },
        {
            questionid: 4,
            questionTitle: "Which sector(s) would you like to invest in?",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please fillup the question",
            isRequired: true,
            multiSelectDropdownOption: [
                "DeFi   ",
                "DAOs",
                "Web3 Education",
                "Marketplaces",
                "Unit economics",
                "NFTs",
                "Web3 Social Platforms",
                "Others",
            ]
        },
        {
            questionid: 5,
            questionTitle: "Please specify your investment thesis & your industry expertise",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
    ],
    "Investment Information": [
        {
            questionid: 1,
            questionTitle: "Link to your website",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 2,
            questionTitle: "Link to your portfolio",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Which stage do you invest in",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please fillup the question",
            isRequired: true,
            dropdownOption: [
                "Early Stage",
                "Private",
                "Seed",
                "Series A",
                "Post Series A",
            ]
        },
        {
            questionid: 4,
            questionTitle: "The top things you look for in a startup",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 5,
            questionTitle: "Your Value Adds for a startup",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 6,
            questionTitle: "Details of your partnerships with other web3 companies",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
    ]
}
const MentorFormInputData: any = {
    "Contact Information": [
        {
            questionid: 1,
            questionTitle: "Full Name",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Pleasure to meet you!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 2,
            questionTitle: "Email ID",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your email id",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Telegram ID",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your telegram id",
            isRequired: true,
        },
        {
            questionid: 4,
            questionTitle: "Where are you fom?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter address",
            isRequired: false,
        },
        {
            questionid: 5,
            questionTitle: "Please paste the link to your LinkedIn profile",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please enter your profie link",
            isRequired: true,
        },
    ],
    "Mentorship Information": [
        {
            questionid: 1,
            questionTitle: "What unique contribution can you bring to the startups that you mentor?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 2,
            questionTitle: "How many years of experience do you have mentoring startups?",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 3,
            questionTitle: "Past work records (link(s)) that show the credibility of your experience",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "Thanks!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 4,
            questionTitle: "Past work records (link(s)) that show the credibility of your experience",
            questiontype: "textbox",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please fillup the question",
            isRequired: true,
        },
        {
            questionid: 5,
            questionTitle: "Choose at least one of the following areas of expertise:",
            questiontype: "dropdown",
            userAnswered: "",
            successMsg: "We promise, no spam!",
            errorMsg: "please fillup the question",
            isRequired: true,
            multiSelectDropdownOption: [
                "Product development",
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
            errorMsg: "please fillup the question",
            isRequired: true,
        },
    ],
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    formValue: number;
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
function FormTabPanel(props: TabPanelProps) {
    const { children, formValue, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={formValue !== index}
            id={`vertical-tabpanel-${index + 1}`}
            aria-labelledby={`vertical-tab-${index + 1}`}
            style={{ width: "100%" }}
            {...other}
        >
            {formValue === index && (
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

function formProps(index: number) {
    return {
        id: `vertical-tab-${index + 1}`,
        'aria-controls': `vertical-tabpanel-${index + 1}`,
    };
}

const VCDashboard = () => {
    const [value, setValue] = useState<any>(0);
    const [formValue, setFormValue] = useState<any>(0);
    const history = useHistory()
    const location = useLocation();
    const { pathname } = location;
    const isProfileInfo = pathname.includes("/profile-information");
    const isVcProfileInfo = pathname.includes("/vc-dashboard/profile-information");
    const isMentorProfileInfo = pathname.includes("/mentor-dashboard/profile-information");
    const isMentorPublicProfile = pathname.includes("/mentor-dashboard/profile-information");
    const [jsonDict, setJsonDict] = useState<any>([]);
    const [inputValue, setInputValue] = useState<any>();
    const [selectedNames, setSelectedNames] = useState<any>([]);
    const [selectedObjData, setSelectedObjData] = useState<any>();


    const handelValueChange = (e: any, itemOBJ: any, position: number, itemKey: any) => {
        setInputValue(e || "")
        itemOBJ.userAnswered = e || ""
    };

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
        setValue(newValue);
        if (pathname === "/vc-dashboard/profile-information") {
            history.push('/vc-dashboard')
        }
    };

    const handleChangeFormData = (event: React.SyntheticEvent, newValue: number) => {
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
        setFormValue(newValue);
    };

    const checkIsSectionHavingError = (sectionkeyName: any) => {
        const filtered = jsonDict.filter(obj => {
            return obj.key === sectionkeyName;
        });
        console.log('filteredfilteredfiltered', filtered);
        return filtered
    }
    const handleChangeMultiSelect = (event: SelectChangeEvent<typeof selectedNames>, itemOBJ: any) => {
        console.log("eventevent", event)
        console.log("itemOBJitemOBJ", itemOBJ)
        const value: any = event;
        setSelectedNames(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        itemOBJ.userAnswered = selectedNames || ""
    };

    useEffect(() => {
        if (isProfileInfo) {
            setValue(null)
        }
    }, [isProfileInfo])

    useEffect(() => {
        if (isVcProfileInfo && isVcProfileInfo) {
            setSelectedObjData(vcFormInputData)
        }
        else if (isMentorProfileInfo && isMentorProfileInfo) {
            setSelectedObjData(MentorFormInputData)
        }
    }, [isVcProfileInfo, isMentorProfileInfo])

    return (
        <>
            <div className="vc-dashbord-main-page">
                <div className='position-relative'>
                    <VCHeroSection />
                    <div className='container container-maxwidth profil-text'>
                        <div className='dashboard-tabs-section mt-lg-5 mt-md-3 mt-2'>
                            <Box sx={{ flexGrow: 1, display: 'flex' }}>
                                <div>
                                    <Tabs
                                        orientation="vertical"
                                        variant="scrollable"
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="Vertical tabs example"
                                        sx={{ borderRight: 1, borderColor: 'divider' }}
                                    >
                                        <Tab label="Dashboard" {...a11yProps(0)} />
                                        <Tab label="My Projects" {...a11yProps(1)} />
                                        <Tab label="All Projects" {...a11yProps(2)} />
                                        <Tab label="Connection Requests" {...a11yProps(3)} />
                                    </Tabs>
                                </div>
                                {!isProfileInfo &&
                                    <div className="container">
                                        <TabPanel value={value} index={0} formValue={0}>
                                            <VCDashboardComp />
                                        </TabPanel>

                                        <TabPanel value={value} index={1} formValue={0}>
                                            <VcProjects />
                                        </TabPanel>

                                        <TabPanel value={value} index={2} formValue={0}>
                                            <VcAllProjects />
                                        </TabPanel>

                                        <TabPanel value={value} index={3} formValue={0}>
                                            <VCConnectionRequest />
                                        </TabPanel>
                                    </div>
                                }
                                {isProfileInfo &&
                                    <div className="form-section w-100">
                                        <div className="container">
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div>
                                                    <h5 className='heading-new-5'>Your Profile</h5>
                                                </div>
                                                <div className='public-btn'>
                                                    <button className='new-primary-button' onClick={() => history.push('/Mentor-public-profile')}><i className="ri-eye-line"></i>View as Public Profile</button>
                                                </div>
                                            </div>
                                            <div className="projectDetails-top background-primary mt-lg-5 mt-md-3 mt-2">
                                                <div className="projectDetails">
                                                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                                                        <Tabs
                                                            orientation="vertical"
                                                            variant="scrollable"
                                                            value={formValue}
                                                            onChange={handleChangeFormData}
                                                            aria-label="Vertical tabs example"
                                                            sx={{ borderRight: 1, borderColor: 'divider' }}
                                                        >
                                                            {selectedObjData && Object.keys(selectedObjData).map((key: any, i: any) => (

                                                                <Tab label={key} {...formProps(key + 1)} key={i} className={checkIsSectionHavingError(key).length == 0 ? 'defaultTab' : checkIsSectionHavingError(key)[0].isError === true ? "warningTab" : "successTab"} />
                                                            ))}
                                                        </Tabs>
                                                        {selectedObjData && Object.keys(selectedObjData).map((key: any, i: any) => (
                                                            <>
                                                                <FormTabPanel value={0} index={i} key={i} formValue={formValue} >
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
                                                                            {Number(formValue) === Object.keys(selectedObjData).length - 1 ?
                                                                                <button className='new-primary-button' onClick={handleSubmitData}>Submit</button> : ""
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </FormTabPanel>
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
                                }
                            </Box>
                        </div>
                    </div>
                </div>

                <Footercmp />
            </div>
        </>
    )
}

export default VCDashboard;
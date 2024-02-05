import React from 'react'
import "./progress.sass"
import Slider from 'rc-slider'
import { RangeSlider } from './components/range-slider/range-slider'
import ProgressTable from './components/progress-table/progress-table'

interface PastProgressData {
  date: string;
  area: string;
  update: string;
  docs: string;
}

function pastProgressCreateData(
  date: string,
  area: string,
  update: string,
  docs: string
): PastProgressData {
  return { date, area, update, docs };
}

interface mentorFeedbackData {
  date: string;
  mentorName: string;
  feedback: string;
}

function mentorFeedbackCreateData(
  date: string,
  mentorName: string,
  feedback: string,
): mentorFeedbackData {
  return { date, mentorName, feedback };
}

interface PastProgressColumn {
  id: 'date' | 'area' | 'update' | 'docs';
  label: string;
  minWidth?: number;
}
interface Column {
  id: 'date' | 'mentorName' | 'feedback';
  label: string;
  minWidth?: number;
}

const pastProgressTableColumns: readonly PastProgressColumn[] = [
  { id: 'date', label: 'Date', minWidth: 170 },
  { id: 'area', label: 'Area', minWidth: 100 },
  { id: 'update', label: 'Update', minWidth: 170 },
  { id: 'docs', label: 'Docs', minWidth: 170 },
];

const mentorFeedbackTableColumns: readonly Column[] = [
  { id: 'date', label: 'Date', minWidth: 170 },
  { id: 'mentorName', label: 'Mentor Name', minWidth: 100 },
  { id: 'feedback', label: 'Feedback', minWidth: 170 },
];

const Progress = () => {

  const pastProgressTableData = [
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
    pastProgressCreateData("5 May 23", "Community", 'The BitBoost wallet UI is ready and inegration is in progress. We are currently optimising the backend to make the app faster.', 'screenshot_10_ssja.png'),
  ];

  const mentorFeedbackTableData = [
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
    mentorFeedbackCreateData("5 May 23", "Elon Musk", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
  ];

  return (
    <>
      <div className="project-progress">
        <div className="">
          <RangeSlider />
          <div className="update-progres">
            <div className="">
              <h3 className='heading-new-3 color-white-new text-start mb-4'>Update your progress</h3>
              <form action="">
                <div className="row">
                  <div className="col-lg-3">
                    <p className='paragraph-new'>Area</p>
                    <select className="form-select" aria-label="Default select example">
                      <option selected disabled>Community</option>
                      <option value="VC">VC</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Fundraise">Fundraise</option>
                      <option value="Growth">Growth</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="col-lg-6">
                    <p className='paragraph-new'>Update</p>
                    <div className="mb-3">
                      <textarea className="form-control" id="exampleFormControlTextarea1" rows={4}></textarea>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <p className='paragraph-new'>Any supporting Documents</p>
                    <div className="file-uploader position-relative">
                      <input type="file" className="form-control" name="file" />
                      <i className="ri-upload-2-line"></i>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <button className='new-color-button'>Update</button>
                </div>
              </form>
            </div>
          </div>

          <div className='progress-table mt-5'>
            <div className="table-heading d-flex align-items-center justify-content-between">
              <h3 className='heading-new-3 color-white-new'>Past Progress</h3>
              <a className='paragraph-new-medium' href="#">Raise a concern</a>
            </div>
            <ProgressTable tableData={pastProgressTableData} tableColumn={pastProgressTableColumns} />
          </div>

          <div className='progress-table mt-5'>
            <div className="table-heading d-flex align-items-center justify-content-between">
              <h3 className='heading-new-3 color-white-new'>Mentor Feedback</h3>
              <a className='paragraph-new-medium' href="#">Raise a concern</a>
            </div>
            <ProgressTable tableData={mentorFeedbackTableData} tableColumn={mentorFeedbackTableColumns} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Progress
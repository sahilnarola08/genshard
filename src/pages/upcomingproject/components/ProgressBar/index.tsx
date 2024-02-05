import "./style.sass"
type ProgressBarProps = {
  bgcolor?: any;
  progress?: any;
  height: any;
};
const ProgressBar = ({ bgcolor, progress, height }: ProgressBarProps) => {
  


  const progresstext = {
    padding: 10,
    color: "black",
    fontWeight: 900,
  };
  return (
    <div className="parentdiv" style={{height:height}}>
      <div style={{width:`${progress}%`,backgroundColor:bgcolor}} className="childdiv" >
        {/* <span style={progresstext}>{`${progress}%`}</span> */}
      </div>
    </div>
  );
};

export default ProgressBar;

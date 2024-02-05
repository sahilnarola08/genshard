import {
  NavLink,
  useRouteMatch,
} from 'react-router-dom'
import './style.sass';
import { useMemo, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../../state';
import { projectTypes } from '../../../../state/ticket/reducer_dashboard';
import { StyledDropDown } from '../../../dashboard/components/select-project';
import { setCurrentProjectType } from '../../../../state/ticket/actions';
const Tabs = [
  {
    title: 'LIVE & UPCOMING',
    to: '',
    altTitle: 'See live & upcoming projects',
  },
  {
    title: 'PAST PROJECTS',
    to: 'past-project',
    altTitle: 'See past projects',
  },
]

const HeaderMarket = () => {
  let { path } = useRouteMatch();
  const [openTypeDropdown, setOpenTypeDropdown] = useState<boolean>(false)
  const dispatch = useDispatch()

  const { currentProject = {}, selectedProjectType = '' }: any = useSelector<AppState>((state) => state.dashboard)

  const selectedType: any = useMemo(() => {
    return projectTypes.find(type => type.value === selectedProjectType) || {}
  }, [selectedProjectType])

  const remainingTypes: any = useMemo(() => {
    return projectTypes.filter(type => type.value !== selectedProjectType)
  }, [selectedProjectType])


  const onChangeProjectType = (type: String) => {
    dispatch(setCurrentProjectType(type))
  }

  console.log(selectedProjectType, "selectedProjectType_header")

  return (
    <div className="header-market">
      <div className="header-stuff">
        <div style={{display: "flex" ,alignItems: "center"}}>
          <div className="title">market</div>

          <div className={`type-selection-item`} style={{marginLeft: 20}} onClick={() => setOpenTypeDropdown(prev => !prev)}>
            <div className='type-dropdown'>
              <span onClick={(e) => {e.stopPropagation(); setOpenTypeDropdown(prev => !prev)}} >{(selectedType && selectedType.label) || ''}</span>
              {openTypeDropdown ? <>
                <div>
                  {remainingTypes.map((type: any) => {
                    return <span onClick={() => onChangeProjectType(type.value)}>{type.label}</span>
                  })}
                </div>
              </> : null}
            </div>
            <div style={{ position: 'absolute', right: 0 }}>
              <StyledDropDown selected={true} style={{ marginRight: 20 }} />
            </div>

          </div>

        </div>
        {/* tabs navigation */}
        <div className="navigation">
          {Tabs.map((tab, index) => (
            <NavLink
              key={index}
              className="link-item"
              to={`${path}/${tab.to}`}
              activeClassName="active-link"
              title={tab.altTitle}
              isActive={(match) => match?.isExact || false}
            >
              {tab.title}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeaderMarket

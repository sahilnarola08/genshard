import { Currency, Token } from '@uniswap/sdk'
import React, { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import Button from '../../../../shared/components/buttons'
import SelectProjectModal from './SelectProjectModal'
import { ReactComponent as DropDown } from '../../../../images/dropdown.svg'
import Web3ReactManager from '../../../../shared/components/Web3ReactManager'
import { wrappedCurrency } from '../../../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../../../hooks/web3'
import { useSelector, useDispatch } from 'react-redux'
import { AppState } from '../../../../state'
import { Project } from '../../../../state/ticket/types'
import { setCurrentProject, setCurrentProjectType } from '../../../../state/ticket/actions'
import web3 from 'web3'
import { projectTypes } from '../../../../state/ticket/reducer_dashboard'
import './style.sass'
import { bottom } from '@popperjs/core'

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const FlexBox = styled.div`
  display: flex;
  align-items: center;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) =>
    active
      ? '  margin: 0 0.25rem 0 0.75rem;'
      : '  margin: 0 0.25rem 0 0.25rem;'}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
  white-space: nowrap;
  overflow: hidden;
`

export const StyledDropDown = styled(DropDown) <{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  path {
    stroke: ${(theme) => (theme as any).white};
    stroke-width: 1.5px;
  }
`

export default function SelectProject() {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  const [openTypeDropdown, setOpenTypeDropdown] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { currentProject = {}, selectedProjectType = '' }: any = useSelector<AppState>((state) => state.dashboard)

  const onSelectProject = (project: Project, cb: () => void) => {
    let isValid = true
    try {
      const address = web3.utils.toChecksumAddress(project.address)
    } catch (e) {
      isValid = false
    }
    if (!isValid) {
      alert('This is an invalid contract address.')
      return
    }
    dispatch(setCurrentProject(project))
    cb()
  }

  const onDismiss = useCallback(() => {
    setIsOpenModal(false)
  }, [])

  const onOpen = useCallback(() => {
    setIsOpenModal(true)
  }, [])

  const onChangeProjectType = (type: String) => {
    dispatch(setCurrentProjectType(type))
  }

  const selectedType: any = useMemo(() => {
    return projectTypes.find(type => type.value === selectedProjectType) || {}
  }, [selectedProjectType])

  const remainingTypes: any = useMemo(() => {
    return projectTypes.filter(type => type.value !== selectedProjectType)
  }, [selectedProjectType])

  return (
    <>
      <Web3ReactManager>
        <SelectProjectModal
          isOpen={isOpenModal}
          onDismiss={onDismiss}
          selectedType={selectedType}
          onSelectProject={onSelectProject}
        />
      </Web3ReactManager>

      <Aligner>
        <FlexBox>
          {/* <Button
            type="button"
            onClick={() => onChangeProjectType('nftCollection')}
            className="outline--highlight"
            style={{ minHeight: 42 }}
          >
            <Aligner>
              <StyledTokenName
                className="token-symbol-container"
              >
                {(selectedType && selectedType.label) || ''}
              </StyledTokenName>
            </Aligner>
          </Button> */}


          <div className={`type-selection-item`} onClick={() => setOpenTypeDropdown(prev => !prev)}>
            <div className='type-dropdown'>
              <span onClick={(e) => {e.stopPropagation(); setOpenTypeDropdown(prev => !prev)}}  >{(selectedType && selectedType.label) || ''}</span>
              {openTypeDropdown ? <>
              <div>
                {remainingTypes.map((type: any) => {
                  return <span onClick={() => onChangeProjectType(type.value)}>{type.label}</span>
                })}
              </div>
              </> : null}
            </div>
            <div style={{position: 'absolute', right: 0}}>
              <StyledDropDown selected={true} style={{ marginRight: 20 }} />
            </div>
          </div>

        </FlexBox>
        <FlexBox>
          <Button
            type="button"
            onClick={onOpen}
            className="outline--highlight genesis-btn"
            style={{ minHeight: 42 }}
          >
            <Aligner>
              <StyledTokenName
                className="token-symbol-container"
              >
                {currentProject === undefined ? 'No Tickets Available' : currentProject.name}
              </StyledTokenName>
            </Aligner>
          </Button>

          {/* <StyledDropDown selected={true} /> */}
        </FlexBox>
      </Aligner>
    </>
  )
}
import { Currency, Token } from '@uniswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'
// import Modal from '../Modal'
import { useWeb3React } from '@web3-react/core'
import Modal from '../../../../shared/components/UniModal'
import { CloseIcon, TYPE } from '../../../../theme'
import { PaddedColumn, SearchInput, Separator } from '../../../creation/components/SelectToken/styleds'
import styled from 'styled-components'
import { isAddress } from '../../../../utils'
import Row, { RowBetween } from '../../../../shared/components/Row'
import Column from '../../../../shared/components/Column'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Text } from 'rebass'
import { StyledDropDown } from './'
import { ReactComponent as QMark } from '../../../../images/qmark.svg'
import { Project } from '../../../../state/ticket/types'
import WhitelistedBases from './WhitelistedBases'
import { useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import _ from 'lodash'

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
  background: #2C2F36;
`

const Aligner = styled.span`
    width: 100%;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const QMarkStyled = styled(QMark)`
    opacity: 1.0;
    transition: 0.4s;
    cursor: pointer;
    margin: 0 0.25rem 0 1.0rem;

    &:hover {
        opacity: 0.7;
    }
`

const BaseContainer = styled.div`
    max-height: 250px;
    overflow-y: scroll;
    width: 100%;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`

interface SelectProjectModalProps {
    isOpen: boolean
    onDismiss: () => void
    onSelectProject: (project: Project, cb: () => void) => any
    selectedType: any
}

export default function SelectProjectModal({ isOpen, onDismiss, onSelectProject, selectedType }: SelectProjectModalProps) {
    const [searchAddress, setSearchAddress] = useState('')
    const [projectName, setProjectName] = useState('')

    const [sortedList, setSortedList] = useState<Project[] | undefined>(undefined)
    const whitelist: Project[] | undefined = useSelector<AppState>(
        (state) => state.dashboard.whitelist
    ) as Project[] | undefined

    useEffect(() => {
        setSortedList(whitelist)
    }, [whitelist])

    useEffect(() => {
        if (whitelist === undefined) {
            return
        }
        let list: Project[] = _.filter(whitelist, (project) => {
            if (selectedType.value === 'nftCollection') {
                return project.projectType === "nftCollection" && project.name.toLowerCase().includes(projectName.toLowerCase())
            } else {
                return project.projectType !== "nftCollection" && project.name.toLowerCase().includes(projectName.toLowerCase())
            }
        })
        onSelectProject(list[0], () => { })
        setSortedList(list)
    }, [projectName, selectedType])

    const selectedItem = (project: Project) => {
        onSelectProject(project, () => onDismiss())
    }
    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            maxHeight={80}
            minHeight={20}
        >
            <ContentWrapper>
                <PaddedColumn gap="16px">
                    <RowBetween>
                        <Text color={'white'} fontWeight={500} fontSize={16}>
                            Find a Project
                        </Text>
                        <CloseIcon style={{ color: 'white' }} onClick={onDismiss} />
                    </RowBetween>
                </PaddedColumn>
                <Separator />
                {sortedList !== undefined ?
                    <>
                        <Row>
                            <Aligner>
                                <SearchInput
                                    type="text"
                                    id="token-search-input"
                                    placeholder="Search with Project Name"
                                    autoComplete="off"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                                <StyledDropDown style={{ margin: '0 0.25rem 0 1.0rem' }} selected={true} />
                            </Aligner>
                        </Row>
                        <Row>
                            <BaseContainer>
                                <WhitelistedBases list={sortedList} onSelect={selectedItem} />
                            </BaseContainer>
                        </Row>
                    </> : null}
                <Separator />
                <Row>
                    <Aligner>
                        <SearchInput
                            type="text"
                            id="token-search-input"
                            placeholder="Search with Contract"
                            autoComplete="off"
                            value={searchAddress}
                            onChange={(e) => setSearchAddress(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    selectedItem({ address: searchAddress, name: 'Unknown' })
                                }
                            }}
                        />
                        <QMarkStyled onClick={() => selectedItem({ address: searchAddress, name: 'Unknown' })} />
                    </Aligner>
                </Row>
            </ContentWrapper>
        </Modal>
    )
}

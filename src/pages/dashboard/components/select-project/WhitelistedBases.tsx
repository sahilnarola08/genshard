import React from 'react'
import { Text } from 'rebass'
import { ChainId, Currency, currencyEquals, ETHER, Token } from '@uniswap/sdk'
import styled from 'styled-components'
import { SUGGESTED_BASES } from '../../../../constants'
import { AutoColumn } from '../../../../shared/components/Column'
import { AutoRow } from '../../../../shared/components/Row'
import { Project } from '../../../../state/ticket/types'
import {useSelector} from 'react-redux'
import {AppState} from '../../../../state'

const BaseWrapper = styled.div<{ disable?: boolean }>`
  display: flex;
  padding: 12px;
  width: 100%;
  padding-left: 22px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && '#2C2F36'};
  }

  background-color: ${({ theme, disable }) => disable && '#40444F'};
  opacity: ${({ disable }) => disable && '0.4'};
`

export default function WhitelistedBases({
    onSelect,
    list
}: {
  onSelect: (project: Project) => void,
  list?: Project[]
}) {
    const currentProject: Project = useSelector<AppState>(
      (state) => state.dashboard.currentProject
    ) as Project

    return (
        <AutoColumn gap="md" style={{width: '100%', maxHeight: 250, paddingBottom: 15}}>
            <AutoRow>
                {list !== undefined ? (list).map((project: Project) => {
                const selected =
                    currentProject.address === project.address
                return (
                    <BaseWrapper
                    onClick={() => !selected && onSelect(project)}
                    disable={selected}
                    key={project.address}
                    >
                    <Text color={'#fff'} fontWeight={500} fontSize={16}>
                        {project.name}
                    </Text>
                    </BaseWrapper>
                )
                }) : null}
            </AutoRow>
        </AutoColumn>
    )
}

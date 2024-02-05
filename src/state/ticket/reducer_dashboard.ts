import { createReducer } from '@reduxjs/toolkit'
import { DashboardState } from './types'
import { GEN_TICKET_ADDRESS, PROJECT_WHITELIST, PROJECT_WHITELIST_BSC, PROJECT_WHITELIST_MATIC, PROJECT_WHITELIST_IOTEX, PROJECT_WHITELIST_HARMONY, PROJECTS_DATA_MUMBAI, PROJECT_WHITELIST_IOTEX_NETWORK_TESTNET, PROJECT_WHITELIST_HARMONY_NETWORK_TESTNET, PROJECT_WHITELIST_GOERLI_NETWORK_TESTNET, PROJECT_WHITELIST_MUMBAI_NETWORK_TESTNET, PROJECT_WHITELIST_BSC_NETWORK_TESTNET, PROJECT_WHITELIST_AVALANCHE, PROJECT_WHITELIST_AVALANCHE_NETWORK_TESTNET} from '../../constants'
import {
    setCurrentProject, setCurrentProjectType, updateCurrentProject
} from './actions'

export const projectTypes = [
    {
        label: 'GenPad',
        value: 'genpad'
    },
    {
        label: 'NFT Collection',
        value: 'nftCollection'
    }
]

export const initialState: DashboardState = {
    currentProject: {
        address: GEN_TICKET_ADDRESS,
        name: 'Genesis Shards'
    },
    whitelist: PROJECT_WHITELIST,
    selectedProjectType: 'genpad'
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(setCurrentProject, (state, action) => {
        state.currentProject = {
            address: action.payload.address,
            name: action.payload.name,
            projectDuration: action.payload.projectDuration
        }
    })
    .addCase(setCurrentProjectType, (state, action) => {
        state.selectedProjectType = action.payload || projectTypes[0].value
    })
    .addCase(updateCurrentProject, (state, action) => {
        state.currentProject = action.payload ? {
                address: GEN_TICKET_ADDRESS,
                name: 'Genesis Shards'
            } : undefined
        console.log('action.payload-------->', action.payload);
        
        state.whitelist = 
        action.payload == 'BSC' ? PROJECT_WHITELIST_BSC : action.payload == 'MATIC' ? PROJECT_WHITELIST_MATIC : action.payload == 'IOTEX' ? PROJECT_WHITELIST_IOTEX : action.payload == 'HARMONY' ? PROJECT_WHITELIST_HARMONY : action.payload == 'AVALANCHE' ? PROJECT_WHITELIST_AVALANCHE : action.payload == 'GOERLI' ? PROJECT_WHITELIST_GOERLI_NETWORK_TESTNET : action.payload == 'MUMBAI' ? PROJECT_WHITELIST_MUMBAI_NETWORK_TESTNET : action.payload == 'T-IoTeX' ? PROJECT_WHITELIST_IOTEX_NETWORK_TESTNET : action.payload == 'T-HRMNY' ? PROJECT_WHITELIST_HARMONY_NETWORK_TESTNET : action.payload == 'T-AVALANCHE' ? PROJECT_WHITELIST_AVALANCHE_NETWORK_TESTNET : action.payload == 'T-BSC' ? PROJECT_WHITELIST_BSC_NETWORK_TESTNET : PROJECT_WHITELIST
    })
})

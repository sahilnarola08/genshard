import axios from 'axios'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiBaseUrl } from '../constants'
import { saveUserToken } from '../state/user/actions'
import { ethers } from 'ethers';
import { useActiveWeb3React } from './web3'
import moment from 'moment'
import { AppState } from '../state'

function useUserAuth() {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [loaderMsg, setLoaderMsg] = useState<string>("Please wait")

    const { library, account } = useActiveWeb3React()
    const storedAddress = useSelector((state: AppState) => state.user && state.user.storedAddress)

    const getUserAuthToken = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const localData = JSON.parse(localStorage.getItem("authorization") || "{}")
                const currentTimestamp = moment().unix()
                const isLocalDataExists = localData && localData?.time ? true : false || false
                const isTokenExpired = isLocalDataExists && (localData.time - currentTimestamp) < 3600
                const localAddress = isLocalDataExists && localData.address || ""
                const isSameAccount = account && account === localAddress
                if (isLocalDataExists && isSameAccount && !isTokenExpired) {
                    const { access_token, userId, address } = localData || {}
                    dispatch(saveUserToken({ access_token, userId, address }))
                    setTimeout(() => {
                        resolve(access_token)
                    }, 500)
                    return
                }
                setIsLoading(true)
                setLoaderMsg("Please sign Transaction from metamask")
                await getUserProfile(account!)
                const tokenResponse = await getUserToken(account!) as any
                const { access_token, userId, address } = tokenResponse
                dispatch(saveUserToken({ access_token, userId, address }))
                setTimeout(() => {
                    resolve(access_token)
                    setIsLoading(false)
                }, 500)
            } catch (ex: any) {
                const message = (ex.response && ex.response.data && ex.response.data.message) || ""
                if (message === "User with this address doesn't exists") {
                    try {
                        await createUserProfile(account!)
                        const tokenResponse = await getUserToken(account!) as any
                        const { access_token, userId, address } = tokenResponse
                        dispatch(saveUserToken({ access_token, userId, address }))
                        setLoaderMsg("Please wait")
                        setTimeout(() => {
                            setIsLoading(false)
                            resolve(access_token)
                        }, 500)
                    } catch (ex) {
                        setLoaderMsg("Please wait")
                        setIsLoading(false)
                        setTimeout(() => {
                            setIsLoading(false)
                            reject({})
                        }, 500)
                    }
                } else {
                    setLoaderMsg("Please wait")
                    setIsLoading(false)
                    setTimeout(() => {
                        setIsLoading(false)
                        reject({})
                    }, 500)
                }
            }
        })
    }

    const getUserProfile = (walletAddress: string) => new Promise((resolve, reject) => {
        axios.get(apiBaseUrl.concat(`/api/v1/marketplace/user/${walletAddress}`))
            .then(({ data }) => resolve(data))
            .catch(err => reject(err))
    })

    const createUserProfile = (walletAddress: string) => new Promise((resolve, reject) => {
        axios.post(apiBaseUrl.concat(`/api/v1/marketplace/user`), { walletAddress })
            .then(({ data }) => resolve(data))
            .catch(err => reject(err))
    })

    const getUserToken = (walletAddress: string) => new Promise(async (resolve, reject) => {
        const message = ethers.utils.id(Date.now().toString());
        const signature = await library!.getSigner().signMessage(message)
        const sendObj = { message, signature, address: walletAddress }
        axios.post(apiBaseUrl.concat(`/api/v1/marketplace/user/auth`), sendObj)
            .then(({ data }) => resolve(data))
            .catch(err => reject(err))
    })

    return { getUserAuthToken, isLoading, loaderMsg }
}

export default useUserAuth
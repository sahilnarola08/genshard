import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../state'
import { addItemsToCart, addLocalCartItems, clearUserCart, removeItemsFromCart } from '../state/user/actions'
import { UserCart } from '../state/user/types'
import { useActiveWeb3React } from './web3'

function useCart() {
    const dispatch = useDispatch()
    const { account, chainId } = useActiveWeb3React()
    const [isLoading, setIsLoading] = useState(false)

    const userCart = useSelector((state: AppState) => state.user.userCart)
    const cartItems = (account && chainId) && userCart[account!] && userCart[account!][chainId!] || []

    const addToCart = (
        id: string,
        tokenAddress: string,
        tokenId: string,
        name: string,
        nftAsset: string,
        price: number,
        quantity: number,
        listingItemId: number,
        fromAddress: string) => {
        if (!account || !chainId || cartItems.length >= 10) return
        const itemExists = cartItems.find(item => item.tokenAddress === tokenAddress && item.tokenId === tokenId)
        if (!itemExists) {
            setIsLoading(true)
            setTimeout(() => {
                dispatch(addItemsToCart({
                    item: {
                        id,
                        tokenAddress,
                        tokenId,
                        listingItemId,
                        price,
                        name,
                        fromAddress,
                        nftAsset,
                        quantity,
                    },
                    chainId: chainId,
                    walletAddress: account
                }))
                setIsLoading(false)
            }, 800)
        }
    }

    const addLocalStorageCartItems = (localItems: UserCart) => {
        setIsLoading(true)
        setTimeout(() => {
            dispatch(addLocalCartItems({ localItems }))
            setIsLoading(false)
        }, 800)
    }

    const removeFromCart = (id: string) => {
        if (!account || !chainId) return
        setIsLoading(true)
        setTimeout(() => {
            dispatch(removeItemsFromCart({ id, walletAddress: account, chainId: chainId }))
            setIsLoading(false)
        }, 800)
    }

    const clearCart = () => {
        if (!cartItems.length || !account || !chainId) return
        setIsLoading(true)
        setTimeout(() => {
            dispatch(clearUserCart({ walletAddress: account, chainId: chainId }))
            setIsLoading(false)
        }, 800)
    }
    return { addToCart, removeFromCart, clearCart, addLocalStorageCartItems, isLoading }

}

export default useCart
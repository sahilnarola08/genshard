import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'reactstrap'
import useCart from '../../../../hooks/useCart'
import useUserAuth from '../../../../hooks/useUserAuth'
import { useActiveWeb3React } from '../../../../hooks/web3'
import LoaderComp from '../../../../shared/components/LoaderComponent'
import { AppState } from '../../../../state'
import { useAddPopup } from '../../../../state/application/hooks'
import { calculateGasMargin, getContract, getERC20Contract, shortenAddress } from '../../../../utils'
import "./style.sass"
import { GEN_NFT_MARKETPLACE_ADDRESS_DATA, GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA } from '../../../../constants'
import { TransactionResponse } from '@ethersproject/providers'
import { formatEther, parseUnits } from 'ethers/lib/utils'
import { abi as GS_MARKETPLACE_ABI } from '../../../../contracts/GSMarketPlace1.json';
import { useHistory } from 'react-router-dom'
import { postCreateNFTListingTransactionCallBack } from '../../API/ApiCall'
import ApproveModal from '../approveModal'
import PurchaseSuccessModal from '../purchaseSuccessModal'

const Cart = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [msg, setMsg] = useState("Please Wait")
    const [isCompleted, setIsCompleted] = useState<boolean>(false)

    const userCart = useSelector((state: AppState) => state.user.userCart)
    const storedAddress = useSelector((state: AppState) => state.user && state.user.storedAddress)
    const network = useSelector((state: AppState) => state.application.network)
    const { account, chainId, library } = useActiveWeb3React()
    const { clearCart, removeFromCart, isLoading: cartLoader } = useCart()
    const addErrorPopup = useAddPopup();
    const { getUserAuthToken } = useUserAuth()

    const cartItems = (account && chainId) && userCart && userCart[account!] && userCart[account!][chainId!] || []
    const genMarketPlaceContractAddress = GEN_NFT_MARKETPLACE_ADDRESS_DATA[network]
    const wethAddress = GEN_NFT_MARKETPLACE_WETH_ADDRESS_DATA[network]
    const currencySymbol = Number(chainId) === 97 ? "WBNB" : "ETH"
    const [approveModal, setApproveModal] = useState<boolean>(false)
    const approveModalToggle = () => setApproveModal(!approveModal)
    const [purchaseSuccessModal, setPurchaseSuccessModal] = useState<boolean>(false)
    const purchaseSuccessModalToggle = () => setPurchaseSuccessModal(!purchaseSuccessModal)

    console.log(cartItems, "cartItems")

    const fetchAuthToken = async () => {
        try {
            if (account && account !== storedAddress && library) {
                await getUserAuthToken()
            }
        }
        catch (error: any) {
        }
    };

    const sendCartTransaction = async () => {
        try {
            setIsLoading(true);
            await fetchAuthToken()
            if (!genMarketPlaceContractAddress || !library || !chainId || !account) return
            if (!cartItems.length) return

            setMsg("Sending Transaction")
            const dbTransactionsRequest = [] as any
            cartItems.forEach(item => {
                dbTransactionsRequest.push(
                    postCreateNFTListingTransactionCallBack(
                        item.id, item.fromAddress, account!, item.price, item.quantity
                    ))
            })
            await Promise.all(dbTransactionsRequest)

            setMsg("Please wait")
            const erc20 = getERC20Contract(wethAddress, chainId, library, account)
            if (!erc20) throw new Error('No UNI Contract!')

            let totalCartApproveValue = 0
            cartItems.forEach(item => {
                const { price, quantity } = item
                totalCartApproveValue += (Number(price) * Number(quantity))
            })

            const approveValue = parseUnits(totalCartApproveValue.toFixed(10) + '')
            const approveArgs = [genMarketPlaceContractAddress, approveValue]

            const getAllowanceForWETHMarket = await erc20.allowance(account!, genMarketPlaceContractAddress!)

            if (Number(formatEther(getAllowanceForWETHMarket)) >= (Number(approveValue))) {
                console.log("Direct Buy Cart Items");
                checkoutAndbuyFixedPriceItems()
            }
            else {
                setMsg("Sending Approve Request")
                const estimatedGasLimit = await erc20.estimateGas.approve(...approveArgs, {})
                const approveTransactionResponse: TransactionResponse = await erc20.approve(...approveArgs, { value: null, gasLimit: calculateGasMargin(estimatedGasLimit) })
                const data = await approveTransactionResponse.wait()
                console.log("is Success from approveTransactionResponse Cart Process ====> ", data);
                if (data.status) {
                    console.log("Successfully Approved");
                    checkoutAndbuyFixedPriceItems()
                }
                else {
                    setIsLoading(false);
                    setMsg("Please wait")
                }
            }
        } catch (err: any) {
            setIsLoading(false)
            setMsg("Please wait")
            let e = err.code === 4001 ? err : err.code === -32603 ? err.data : err.message.slice(err.message.indexOf('{'), err.message.indexOf('}') + 3);
            if (err.code === -32603) { }
            else if (err.code !== 4001) e = JSON.parse(e);
            addErrorPopup({
                txn: {
                    hash: '',
                    success: false,
                    summary: err.code === 4001 ? e.message : "MetaMask - RPC Error",
                    description: err.code === -32603 ? e.message : e.data?.originalError?.message ?? '',
                    withExternalLink: false,
                }
            });
        }
    }

    const checkoutAndbuyFixedPriceItems = async () => {
        
        if (!genMarketPlaceContractAddress || !library || !chainId || !account) return
        if (!cartItems.length) return

        setMsg("Buy Now Listing")
        const market = getContract(genMarketPlaceContractAddress, GS_MARKETPLACE_ABI, library!, account!)
        let method = market.buyFixedPriceItems
        let estimate = market.estimateGas.buyFixedPriceItems

        let buyArgs = [
            cartItems.map(item => item.listingItemId),
            cartItems.map(item => item.quantity),
        ]

        const estimatedGasLimitBuyNow = await estimate(...buyArgs, {})
        const buyTransactionResponse: TransactionResponse = await method(...buyArgs, {
            ...({}), gasLimit: calculateGasMargin(estimatedGasLimitBuyNow)
        })
        await buyTransactionResponse.wait()
        setIsLoading(false)
        setMsg("Please wait")
        setIsCompleted(true)
        clearCart()
    }

    const onClickProceedCart = async () => {
        // approveModalToggle()
        purchaseSuccessModalToggle()
        // if (account === cartAddress && chainId === cartChainId) {
            // sendCartTransaction()
        // }
    }

    const [totalPrice, totalQuantity] = useMemo(() => {
        let price = 0
        let quantity = 0
        cartItems.forEach(item => {
            price += Number(item.price) * Number(item.quantity) || 0
            quantity += item.quantity || 0
        })
        const str = String(price)
        let [first = "", second = ""] = str.split(".")
        if (second.length > 5) price = Math.floor(Number(price) * 100000) / 1000000
        return [price, quantity]
    }, [cartItems])

    const compLoader = isLoading || cartLoader

    if (isCompleted) {
        return <div className="cart">
            {compLoader && <LoaderComp msg={msg} isOpen={true} onClose={() => { }} />}
            <div className="cart-wrapper">
                <div className="cart-text">Cart</div>
                <hr className='cart-text-line' />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                    <p style={{ color: "green", fontSize: 22 }}>Listing buy successful.</p>
                </div>
            </div>
        </div>
    }

    return (
        <div className="cart">
            {compLoader && <LoaderComp msg={msg} isOpen={true} onClose={() => { }} />}
            <div className="cart-wrapper">
                <div className="cart-text">Cart</div>
                {/* <hr className='cart-text-line' /> */}
                <div className='clear-cart-div'><button onClick={clearCart}>Clear Cart</button></div>
                <div className="cart-items-wrapper">
                    <Table
                        responsive
                    >
                        <thead>
                            <tr>
                                <th>ITEM</th>
                                <th>QTY</th>
                                <th>PRICE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartItems.length ? cartItems?.map((tData) => <tr>
                                    <td>
                                        <div className="cart-item-wrapper" onClick={() => history.push(`/assets/${tData?.tokenAddress}/${tData?.tokenId}`, tData)}>
                                            <div className="item-img">
                                                <img src={tData?.nftAsset && tData?.nftAsset.split('.').pop() !== "svg+xml" ? tData?.nftAsset : `/images/noimageavailable.png`} alt="" />
                                            </div>
                                            <div className="item-labels">
                                                <div className="main-label">{tData?.name}</div>
                                                <div className="sub-label">{tData?.fromAddress ? shortenAddress(tData?.fromAddress) : "unknown"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ minWidth: 80, maxWidth: 200, fontSize: 22 }}>{tData?.quantity || 0}</td>
                                    <td style={{ minWidth: 80, maxWidth: 200, fontSize: 22 }}>{`${tData?.price} ${currencySymbol}`}</td>
                                    <td align="center"><span onClick={() => removeFromCart(tData.id)} className="remove-cart-item">Remove</span></td>
                                </tr>) : <tr><td colSpan={4} align="center">No item added</td></tr>
                            }

                            {cartItems.length ? <tr>
                                <td>Total</td>
                                <td>{totalQuantity}</td>
                                <td style={{ fontSize: 22 }} colSpan={4}>{totalPrice} {currencySymbol}</td>
                            </tr> : null}
                        </tbody>
                    </Table>
                    <ApproveModal isOpen={approveModal} toggle={approveModalToggle} />
                    <PurchaseSuccessModal isOpen={purchaseSuccessModal} toggle={purchaseSuccessModalToggle}  />

                    {cartItems.length ? <div className='checkout-btn-wrapper'>
                        <button onClick={onClickProceedCart}>Proceed</button>
                    </div> : null}
                </div>
            </div>
        </div>
    )
}

export default Cart
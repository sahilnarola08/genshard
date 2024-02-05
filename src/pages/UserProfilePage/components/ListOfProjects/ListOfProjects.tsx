import React, { memo, useEffect, useMemo, useState } from 'react'
import "./style.sass";
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../../../state'
import { useActiveWeb3React } from './../../../../hooks/web3'
import { formatUnits } from 'ethers/lib/utils';
import { calculateGasMargin, getContract, getERC20Contract } from "../../../../utils";
import { TransactionResponse } from "@ethersproject/providers";
import { useTransactionAdder } from "../../../../state/transactions/hooks";
import { useAddPopup } from "../../../../state/application/hooks";
import { abi as GEN_DEX_ABI } from "../../../../contracts/GenIDO.json"
import LoaderComp from "../../../../shared/components/LoaderComponent";
import moment from "moment";
import { NetworkSymbol, NetworkSymbolAndId } from "../../../../connectors";
import { changeNetwork } from '../../../../state/application/actions'

const ListOfProjects = () => {
  const columnDef = ["Ranking", "Project name", "Chain", "Amount", "Claim tokens", "Claim"];
  const [isLoading, setIsLoading] = useState(false)
  const [msg, setMsg] = useState("Please Wait")

  const listOfPeojects = [
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
    {
      name: "text",
      chainId: 22,
      purchases: {
        usdAllocationBought: "text"
      },
      ranking: "#001",
      dexAddress: "#001",
      projectName: "Lorem Ipsum Project 01",
      amount: "5,000,000",
      returnTrancheLength: {
        item: ""
      }
    },
  ];
  const addTransaction = useTransactionAdder()
  const addErrorPopup = useAddPopup();
  const dispatch = useDispatch();
  const [projectsData, setProjectsData] = useState<any>([])
  const [resData, setResData] = useState<any>()
  const { account, chainId, library } = useActiveWeb3React()
  const currentTimestamp = Math.round(+new Date() / 1000);
  const network = useSelector((state: AppState) => state.application.network)
  const headers = {
    Authorization: process.env.REACT_APP_BASE_TOKEN,
  };
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const { ethereum } = window as any

  const getProjectData = async () => {
    setMsg("Loading Projects")
    setIsLoading(true);
    try {
      const url = `${baseUrl}/api/v1/projects/wallet/${account}`
      const resp = await axios.get(url, { headers: headers }
      );
      setResData(resp?.data?.values)
    } catch (error: any) {
      addErrorPopup({
        txn: {
          hash: '',
          success: false,
          summary: error.message,
          description: '',
          withExternalLink: false,
        }
      });
    }
    setMsg("Please wait")
    setIsLoading(false);
    // return resp;
  };

  const getRedeemedAndRedeemableTokens = (project: any, type: string): any => {

    let redeemablePercentage = 0;
    let redeemedPercentage = 0;
    let tranche = Number(project?.position)
    console.log('project?.returnTrancheWeightage', project);

    for (let i:any = 0; i < Number(project?.returnTrancheWeightage?.length); i++) {
      if (i < Number(tranche)) {
        redeemedPercentage += Number(project?.returnTrancheWeightage![i] ?? 0);
      }
      if (Number(project?.tge) + Number(project?.returnTrancheLength![i] ?? 0) <= Number(moment().unix())) {
        redeemablePercentage += Number(project?.returnTrancheWeightage![i] ?? 0);
      } else {
        break;
      }
    }

    let actualRedeemablePercentage = Number(redeemablePercentage) - Number(redeemedPercentage)
    console.log('actualRedeemablePercentage', actualRedeemablePercentage);

    return (type == "redeemable") ? (Number(project?.tokenAllocationBought) > 0 ? (Number(project?.tokenAllocationBought) * (Number(actualRedeemablePercentage) / 100)) : 0) : (Number(project?.tokenAllocationBought) > 0 ? (Number(project?.tokenAllocationBought) * (Number(redeemedPercentage) / 100)) : 0);
  }

  const handleClaim = async (genDexAddress: string) => {
    console.log("Redeem Clicked", genDexAddress);
    setMsg("Claiming Tokens")
    setIsLoading(true);
    const args: any = [
      // account!
    ]
    const genDexIDO = getContract(genDexAddress, GEN_DEX_ABI, library!, account!)
    genDexIDO.estimateGas
      .redeem(...args, {})
      .then((estimatedGasLimit) => {
        return genDexIDO
          .redeem(...args, {
            value: null,
            gasLimit: calculateGasMargin(estimatedGasLimit),
          })
          .then(async (response: TransactionResponse) => {
            const waitResponse = await response.wait();
            if (waitResponse.status) {
              setIsLoading(false);
              // add the transaction to store and show the popup
              addTransaction(response, {
                summary: `Tokens Redeemed Successfully.`,
              })
            }
            else {
              setIsLoading(false);
            }
          })
          .catch((err: any) => {
            setIsLoading(false);
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
          });
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log('error', err);
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
      });
  }

  const switchChain = (networkSymbol: NetworkSymbol) => {
    console.log("Switch Chain Clicked");
    if (!account) {
      dispatch(changeNetwork({
        network: networkSymbol,
        chainId: account ? chainId : null
      }))
    }

    if (networkSymbol == NetworkSymbol.ETH && (!account || chainId !== process.env.REACT_APP_CHAIN_ID)) {
      // Reference for default switching to ETH Chain
      // https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: '0x1'
          // chainName: 'Ethereum Mainnet',
          // nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          // rpcUrls: [process.env.REACT_APP_NETWORK_URL!],
          // blockExplorerUrls: ['https://etherscan.io/']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.BSC && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_BSC)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x38',
          chainName: 'Binance Smart Chain',
          nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_BSC_URL!],
          blockExplorerUrls: ['https://bscscan.com/']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.MATIC && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_MATIC)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x89',
          chainName: 'Matic Mainnet',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_MATIC_URL!],
          blockExplorerUrls: ['https://polygonscan.com/']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.IOTEX && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_IOTEX)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x1251',
          chainName: 'IoTeX Network Mainnet',
          nativeCurrency: { name: 'IOTX', symbol: 'IOTX', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_IOTEX_URL!],
          blockExplorerUrls: ['https://iotexscan.io']
        }]
      })
    }


    if (networkSymbol == NetworkSymbol.HARMONY && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_HARMONY)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x63564C40',
          chainName: 'Harmony Mainnet Shard 0',
          nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_HARMONY_URL!],
          blockExplorerUrls: ['https://explorer.harmony.one']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.AVALANCHE && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_AVALANCHE)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xA86A',
          chainName: 'Avalanche C-Chain',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_AVALANCHE_URL!],
          blockExplorerUrls: ['https://snowtrace.io']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.GOERLI && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_GOERLI)) {
      ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{
          chainId: '0x5'
          // chainName: 'Goerli test network',
          // nativeCurrency: { name: 'GETH', symbol: 'GETH', decimals: 18 },
          // rpcUrls: [process.env.REACT_APP_GOERLI_URL!],
          // blockExplorerUrls: ['https://goerli.etherscan.io/']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.MUMBAI && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_MUMBAI)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x13881',
          chainName: 'Matic(Polygon) Testnet Mumbai',
          nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_MUMBAI_URL!],
          blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.IOTEX_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_IOTEX_NETWORK_TESTNET)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x1252',
          chainName: 'IoTeX Network Testnet',
          nativeCurrency: { name: 'IOTX', symbol: 'IOTX', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_IOTEX_NETWORK_TESTNET_URL!],
          blockExplorerUrls: ['https://testnet.iotexscan.io']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.HARMONY_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_HARMONY_NETWORK_TESTNET)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x6357D2E0',
          chainName: 'Harmony Testnet Shard 0',
          nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_HARMONY_NETWORK_TESTNET_URL!],
          blockExplorerUrls: ['https://explorer.pops.one']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.AVALANCHE_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_AVALANCHE_NETWORK_TESTNET)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xA869',
          chainName: 'Avalanche Fuji Testnet',
          nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_AVALANCHE_NETWORK_TESTNET_URL!],
          blockExplorerUrls: ['https://testnet.snowtrace.io']
        }]
      })
    }

    if (networkSymbol == NetworkSymbol.BSC_NETWORK_TESTNET && (!account || chainId !== process.env.REACT_APP_CHAIN_ID_BSC_NETWORK_TESTNET)) {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x61',
          chainName: 'Binance Smart Chain Testnet',
          nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
          rpcUrls: [process.env.REACT_APP_BSC_NETWORK_TESTNET_URL!],
          blockExplorerUrls: ['https://testnet.bscscan.com']
        }]
      })
    }

  }

  useEffect(() => {
    getProjectData();
  }, [network])

  useEffect(() => {
    projectsData.splice(0, projectsData.length)
    console.log("projectsData", projectsData);
    setProjectsData([])

    resData?.forEach((data: any) => {
      console.log('project?.purchase?.usdAllocationBought', data?.purchases?.usdAllocationBought, data?.usdtDecimals);
      setProjectsData((prev: any) => [...prev, data])
    })
  }, [resData])

  return (
    <div className="listOfProjects profile-container">
      <div className="paragraph-new color-white-new">List of Projects</div>
      <hr style={{ width: "80px", color: "#54C4FC" }} className='mt-3 mb-4' />
      {isLoading && <LoaderComp msg={msg} isOpen={isLoading} onClose={() => { }} />}
      {listOfPeojects && listOfPeojects.length ?
        <table cellSpacing={0}>
          <thead>
            <tr>
              {columnDef.map((def, ind) => (
                <th className="tHeading" key={ind}>
                  {def}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listOfPeojects && listOfPeojects?.map((project:any, ind) => (
              <tr className="tRow" key={ind}>
                <td className="tData">{"#" + (ind + 1)}</td>
                <td className="tData">{project?.name}</td>
                <td className="tData">{project?.chainId == 56 ? "BSC" : project?.chainId == 137 ? "POLYGON" : project?.chainId == 4689 ? "IOTEX" : project?.chainId == 1666600000 ? "HARMONY" : project?.chainId == 43114 ? "AVALANCHE" : project?.chainId == 5 ? "GOERLI" : project?.chainId == 80001 ? "MUMBAI" : project?.chainId == 4690 ? "IOTEX TESTNET" : project?.chainId == 1666700000 ? "HARMONY TESTNET" : project?.chainId == 43113 ? "AVALANCHE TESTNET" : project?.chainId == 97 ? "BSC TESTNET" : "ETH"}</td>
                <td className="tData">{`$${project?.purchases?.usdAllocationBought}`}</td>
                {/* && formatUnits(project?.purchases?.usdAllocationBought, project?.usdtDecimals) */}
                <td className="tData">{getRedeemedAndRedeemableTokens(project, "redeemable").toFixed(2) || 0}</td>
                <td className="tData">
                  {NetworkSymbolAndId[project?.chainId] === network ? <button className="claimBtn"
                    onClick={() => handleClaim(project?.dexAddress)}
                    disabled={Number(project?.purchases?.position) >= Number(project?.returnTrancheLength?.length)}
                  >
                    Claim
                  </button>
                    :
                    <button className="claimBtn"
                      onClick={() => switchChain(NetworkSymbolAndId[project?.chainId])}
                    >
                      Switch Chain
                    </button>}
                  {/* <button className="claimBtn"
                onClick={() => handleClaim(project?.dexAddress)}
                disabled={Number(project?.purchases?.position) >= Number(project?.returnTrancheLength.length)}
                >
                  Claim Reward
                </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        :
        <div className="no-project-found paragraph-new color-white-new">
          No Projects Found.
        </div>
      }
    </div>
  );
};

export default ListOfProjects;

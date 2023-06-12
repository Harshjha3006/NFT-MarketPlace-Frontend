import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { useNotification } from 'web3uikit'
import nftAbi from "../constants/BasicNft.json"
import marketPlaceAbi from "../constants/NftMarketPlace.json"
import networkMapping from "../constants/networkMapping.json"
import { ethers } from "ethers";
import console from '../console-browserify';

function SellNft2() {
    const [nftAddress, setNftAddress] = useState("");
    const [tokenId, setTokenId] = useState(0);
    const [price, setPrice] = useState("");
    const { runContractFunction: approve } = useWeb3Contract();
    const { runContractFunction: listItem } = useWeb3Contract();
    const { runContractFunction: getProceeds } = useWeb3Contract();
    const { runContractFunction: withdrawProceeds } = useWeb3Contract();
    const { chainId, account, isWeb3Enabled } = useMoralis();
    const [proceeds, setProceeds] = useState("0");
    const chainString = chainId ? parseInt(chainId).toString() : null;
    const marketPlaceAddress = chainId ? networkMapping[chainString].NftMarketPlace : null;
    const dispatch = useNotification();
    const approveAndList = async () => {
        console.log("Approving ...");
        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketPlaceAddress,
                tokenId: tokenId
            }
        }
        await approve({
            params: approveOptions,
            onError: (error) => {
                console.log(error);
            },
            onSuccess: () => { handleApproveSuccess(tokenId, nftAddress, price) }
        })

    }
    const handleApproveSuccess = async (tokenId, nftAddress, price) => {
        console.log("Listing ...")
        const listOptions = {
            abi: marketPlaceAbi,
            contractAddress: marketPlaceAddress,
            functionName: "listItem",
            params: {
                tokenId: tokenId,
                nftAddress: nftAddress,
                price: price
            }
        }
        await listItem({
            params: listOptions,
            onError: (error) => {
                console.log(error);
            },
            onSuccess: () => { handleListSuccess() }
        })

    }
    const handleListSuccess = () => {
        dispatch({
            type: "success",
            message: "Item Listed!",
            title: "Item Listed !",
            position: "topR"
        })
    }
    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }
    async function setupUI() {
        const returnedProceeds = await getProceeds({
            params: {
                abi: marketPlaceAbi,
                contractAddress: marketPlaceAddress,
                functionName: "getProceeds",
                params: {
                    owner: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }
    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])
    return (
        <>
            <h2 class="text-2xl font-bold leading-7 text-center  sm:truncate sm:text-3xl sm:tracking-tight text-slate-200"
                style={{ marginBottom: "30px", marginTop: "50px", height: "30px" }}>SELL YOUR NFT</h2>
            <div style={{ marginTop: "100px", width: "800px", height: "400px", marginLeft: "600px" }}>
                <div class="w-full max-w-xs">
                    <form class="bg-slate-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div class="mb-4">
                            <label class="block text-white text-sm font-bold mb-2" for="nftAddress">
                                NFT Address
                            </label>
                            <input onChange={(e) => { setNftAddress(e.target.value) }}
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="nftAddress" type="text" placeholder="" />
                        </div>
                        <div class="mb-6">
                            <label class="block text-white text-sm font-bold mb-2" for="TokenId">
                                TOKEN ID
                            </label>
                            <input onChange={(e) => { setTokenId(e.target.value) }}
                                class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="TokenId" type="number" placeholder="" />
                        </div>
                        <div class="mb-6">
                            <label class="block text-white text-sm font-bold mb-2" for="price">
                                PRICE (in ETH)
                            </label>
                            <input onChange={(e) => { setPrice(ethers.parseEther(e.target.value)) }}
                                class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="price" type="number" />
                        </div>
                        <div class="flex items-center justify-between">
                            <button onClick={approveAndList} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                Sell NFT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="text-2xl font-bold leading-7 text-center my-8 sm:truncate sm:text-3xl sm:tracking-tight text-slate-200"
                style={{ marginBottom: "20px" }}>Withdraw {proceeds}(in ETH) proceeds</div>
            {proceeds !== "0" ? (
                <div className='flex flex-col items-center' style={{ marginBottom: "30px" }}>
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => {
                            withdrawProceeds({
                                params: {
                                    abi: marketPlaceAbi,
                                    contractAddress: marketPlaceAddress,
                                    functionName: "withdrawProceeds",
                                    params: {},
                                },
                                onError: (error) => console.log(error),
                                onSuccess: () => handleWithdrawSuccess(),
                            })
                        }}
                        text="Withdraw"
                        type="button"
                    >Withdraw</button></div>
            ) : (
                <div className='text-center text-slate-200 text-bold text-xl' style={{ marginBottom: "100px" }}>No proceeds detected</div>
            )}
        </>
    )
}

export default SellNft2

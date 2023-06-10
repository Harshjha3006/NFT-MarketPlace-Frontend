import { useState, useEffect } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { Form, useNotification, Button } from 'web3uikit'
import nftAbi from "../constants/BasicNft.json"
import marketPlaceAbi from "../constants/NftMarketPlace.json"
import networkMapping from "../constants/networkMapping.json"
import { ethers } from "ethers";
import console from '../console-browserify'
function SellNft() {
    const { runContractFunction: approve } = useWeb3Contract();
    const { runContractFunction: listItem } = useWeb3Contract();
    const { runContractFunction: getProceeds } = useWeb3Contract();
    const { runContractFunction: withdrawProceeds } = useWeb3Contract();
    const { chainId, account, isWeb3Enabled } = useMoralis();
    const [proceeds, setProceeds] = useState("0");
    const chainString = chainId ? parseInt(chainId).toString() : null;
    const marketPlaceAddress = chainId ? networkMapping[chainString].NftMarketPlace : null;
    const dispatch = useNotification();
    const approveAndList = async (data) => {
        console.log("Approving ...")
        const nftAddress = data.data[0].inputResult;
        const tokenId = data.data[1].inputResult;
        const price = ethers.parseEther(data.data[2].inputResult);
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
    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }
    return (
        <>
            <Form
                title="Sell Your NFTs !"
                onSubmit={(data) => approveAndList(data)}
                data={
                    [
                        {
                            name: "NFT Address",
                            type: "text",
                            value: "",
                            key: "nftAddress",
                            inputWidth: 50
                        },
                        {
                            name: "Token ID",
                            type: "number",
                            value: "",
                            key: "tokenId",
                        },
                        {
                            name: "Price",
                            type: "number",
                            value: "",
                            key: "price"
                        }
                    ]
                }
            />
            <div>Withdraw {proceeds} proceeds</div>
            {proceeds != "0" ? (
                <Button
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
                />
            ) : (
                <div>No proceeds detected</div>
            )}
        </>
    )
}

export default SellNft

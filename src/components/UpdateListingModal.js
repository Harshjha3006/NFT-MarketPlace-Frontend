import { useState } from 'react'
import { Input, Modal, useNotification } from 'web3uikit'
import marketPlaceAbi from "../constants/NftMarketPlace.json";
import networkMapping from "../constants/networkMapping.json";
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { ethers } from 'ethers';
import console from "../console-browserify/index.js"
function UpdateListingModal({ isVisible, nftAddress, tokenId, onClose }) {
    const [newPrice, setNewPrice] = useState("0");
    const { chainId } = useMoralis();
    const chainString = chainId ? parseInt(chainId).toString() : null;
    const marketPlaceAddress = chainId ? networkMapping[chainString].NftMarketPlace : null;
    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: marketPlaceAbi,
        contractAddress: marketPlaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.parseEther(newPrice) || "0"
        }
    })
    const dispatch = useNotification();
    const handleUpdateListingSuccess = () => {
        dispatch({
            type: "success",
            message: "Listing Updated",
            title: "Listing Updated - please refresh and (move blocks)",
            position: "topR"
        })
        onClose && onClose();
        setNewPrice("0");
    }
    return (
        <Modal isVisible={isVisible} onCloseButtonPressed={onClose} onCancel={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: () => handleUpdateListingSuccess()
                })
            }}>
            <Input type="number" label="Update Listing in L1 currency (ETH)" name="new Listing price" onChange={(event) => {
                setNewPrice(event.target.value);
            }}>
            </Input>

        </Modal>
    )
}

export default UpdateListingModal

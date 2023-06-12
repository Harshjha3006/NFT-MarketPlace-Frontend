import { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis';
import nftAbi from "../constants/BasicNft.json";
import marketPlaceAbi from "../constants/NftMarketPlace.json";
import { Card, useNotification } from 'web3uikit';
import { ethers } from "ethers";
import UpdateListingModal from './UpdateListingModal';
import networkMapping from "../constants/networkMapping.json";
import console from '../console-browserify';
function NFTBox({ price, seller, tokenId, nftAddress }) {
    const [imageUri, setImageUri] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [tokenDesc, setTokenDesc] = useState("");
    const { isWeb3Enabled, account, chainId } = useMoralis();
    const [showModal, setShowModal] = useState(false);
    const chainString = chainId ? parseInt(chainId).toString() : null;
    const marketPlaceAddress = chainId ? networkMapping[chainString].NftMarketPlace : null;
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId
        }
    })
    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: marketPlaceAbi,
        contractAddress: marketPlaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId
        }
    })
    async function updateUi() {
        // get the token Uri
        // get the image uri from the token uri
        const tokenUri = await getTokenURI();
        const fetchResponse = await (await fetch(tokenUri)).json();
        if (fetchResponse) {
            setImageUri(fetchResponse.image);
            setTokenName(fetchResponse.name);
            setTokenDesc(fetchResponse.description);
        }

    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi();
        }
    }, [isWeb3Enabled]);
    const dispatch = useNotification();
    const isOwnedByUser = seller == account || seller === undefined;
    const formattedSeller = isOwnedByUser ? "you" : seller.slice(0, 4) + "..." + seller.slice(seller.length - 4);
    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item Bought",
            title: "Item Bought!",
            position: "topR"
        })
    }
    const handleCardClick = () => {
        if (isOwnedByUser) {
            setShowModal(true);
        }
        else {
            buyItem({
                onError: (error) => {
                    console.log(error);
                },
                onSuccess: () => handleBuyItemSuccess()
            })
        }
    }
    const hideModal = () => {
        setShowModal(false);
    }
    return (
        <div>
            <div>
                {imageUri ? <div style={{ width: "200px", height: "150px", color: "#5A5A5A" }}>
                    <UpdateListingModal isVisible={showModal} nftAddress={nftAddress} tokenId={tokenId} onClose={hideModal}></UpdateListingModal>
                    <Card title={tokenName} description={tokenDesc} onClick={handleCardClick} style={{ backgroundColor: "#5fb7cf" }}>
                        <div className='p-2 '>
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">Owned By {formattedSeller}</div>
                                <img className="mx-auto" height="200" width="200" src={imageUri} alt="nft"></img>
                                <div className="text-bold" style={{ color: "black" }}>{ethers.formatEther(price)} ETH</div>
                            </div>
                        </div>
                    </Card></div> : <div></div>}
            </div>
        </div>
    )
}

export default NFTBox

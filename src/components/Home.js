import { React } from 'react'
import NFTBox from './NFTBox';
import { useMoralis } from 'react-moralis';

function Home({ listedNfts, loading }) {
    const { isWeb3Enabled } = useMoralis();
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className='flex flex-wrap'>
                {isWeb3Enabled ? (
                    loading ?
                        (<div> Loading ...</div>) :
                        (listedNfts.activeItems.map((nft) => {
                            const { price, tokenId, seller, nftAddress } = nft;
                            return (
                                <div className="mx-4">
                                    <NFTBox price={price} tokenId={tokenId} seller={seller} nftAddress={nftAddress} key={`${nftAddress}+${tokenId}`}></NFTBox>
                                </div>
                            )
                        }))) : (<div>Web3 not Enabled! Please Connect your Wallet!</div>)}

            </div>
        </div >
    )
}

export default Home

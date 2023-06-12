import { React } from 'react'
import NFTBox from './NFTBox';
import { useMoralis } from 'react-moralis';
import Spinner from './Spinner';

function Home({ listedNfts, loading }) {
    const { isWeb3Enabled } = useMoralis();
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl text-slate-200 text-center" >Recently Listed NFTs</h1>
            <div className='flex flex-wrap text-slate-200 '>
                {isWeb3Enabled ? (
                    loading ?
                        (<Spinner />) :
                        (listedNfts.activeItems.map((nft) => {
                            const { price, tokenId, seller, nftAddress } = nft;
                            return (
                                <div className="mx-4">
                                    <NFTBox price={price} tokenId={tokenId} seller={seller} nftAddress={nftAddress} key={`${nftAddress}+${tokenId}`}></NFTBox>
                                </div>
                            )
                        }))) : (<span className="text-slate-200 text-bold text-xl" >Web3 not Enabled! Please Connect your Wallet!</span>)}

            </div>
        </div >
    )
}

export default Home

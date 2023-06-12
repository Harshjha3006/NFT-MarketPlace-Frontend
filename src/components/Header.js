import React from 'react'
import { ConnectButton } from "web3uikit"
import { Link } from "react-router-dom";
function Header() {
    return (
        // <nav className="p-5  flex flex-row justify-between items-center text-slate-200 border-none"
        //     style={{ backgroundColor: "#D3D3D3" }}>
        //     <div className="py-4 px-4 font-bold text-3xl">NFT Marketplace</div>
        //     <div className="flex flex-row items-center text-bold">
        //         <Link to="/" className="mr-6 p-4 text-bold">
        //             Home
        //         </Link>
        //         <Link to="/sell-nft" className="mr-6 p-4">
        //             Sell NFT
        //         </Link>
        //         <ConnectButton moralisAuth={false} />
        //     </div>
        // </nav>
        <nav class="bg-slate-200">
            <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 font-sans">
                <div class="relative flex h-16 items-center justify-between  font-extrabold text-xl">
                    NFT MARKETPLACE
                    <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div class="hidden sm:ml-6 sm:block">
                            <div class="flex space-x-4">
                                <Link to="/" class="  rounded-md px-3 py-2 hover:bg-gray-300 text-base font-medium tracking-wide" aria-current="page">Home</Link>
                                <Link to="/sell-nft" class="t hover:bg-gray-300  rounded-md px-3 py-2 text-base font-medium tracking-wide">Sell NFT</Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ConnectButton />
                    </div>
                </div>
            </div>


        </nav>

    )
}

export default Header

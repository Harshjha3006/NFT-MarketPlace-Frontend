import React from 'react'
import { ConnectButton } from "web3uikit"
import { Link } from "react-router-dom";
function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <div className="flex flex-row items-center">
                <Link to="/" className="mr-6 p-4">
                    Home
                </Link>
                <Link to="/sell-nft" className="mr-6 p-4">
                    Sell NFT
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}

export default Header

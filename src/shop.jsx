import React, { useEffect, useState } from "react";
import axios from "axios";
import './assets/css/custom2.css';
import './assets/css/custom3.css';
import { signAndConfirmTransactionFe } from "./utilityfunc";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import disPic from './assets/images/upload-file.jpg';
import 'boxicons/css/boxicons.min.css'; // Import CSS file

import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

const Shop = () => {

    const xKey = "lEHeaJLm_TKtI1bU";
    const [wallID, setWallID] = useState("");
    const [network, setNetwork] = useState("devnet");
    const [isLoaded, setLoaded] = useState(false);
    const [isLoadedBuy, setLoadedBuy] = useState(false);
    const [isLoadedMarketPlaceNFTs, setIsLoadedMarketPlaceNFTs] = useState(false);
    const [dataFetched, setDataFetched] = useState();
    const [connStatus, setConnStatus] = useState(false);
    const [buy, setBuy] = useState();
    const [nfts, setNfts] = useState();
    const [loading, setLoading] = useState(false);

    // Phantom Adaptor
    const solanaConnect = async () => {
        console.log('clicked solana connect');
        const { solana } = window;
        if (!solana) {
            alert("Please Install Solana");
        }

        try {
            setLoading(true);
            //const network = "devnet";
            const phantom = new PhantomWalletAdapter();
            await phantom.connect();
            const rpcUrl = clusterApiUrl(network);
            const connection = new Connection(rpcUrl, "confirmed");
            const wallet = {
                address: phantom.publicKey.toString(),
            };

            if (wallet.address) {
                console.log(wallet.address);
                setWallID(wallet.address);
                const accountInfo = await connection.getAccountInfo(new PublicKey(wallet.address), "confirmed");
                console.log(accountInfo);
                setConnStatus(true);
                getNFTsFromMarketPlace(isLoadedMarketPlaceNFTs);
            }
            setLoading(false);
        }
        catch (err) {
            console.log(err);
            setLoading(false);
        }

    }

    const getNFTsFromMarketPlace = () => {

        const marketplaceAddress = "3y4rUzcCRZH4TstRJGYmUUKuod8hd4Rvu2Fnf2FhQoY4";

        let nftUrl = `https://api.shyft.to/sol/v1/marketplace/active_listings?network=devnet&marketplace_address=${marketplaceAddress}`;

        axios({
            // Endpoint to get NFTs
            url: nftUrl,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": xKey,
            },
        })
            // Handle the response from backend here
            .then((res) => {
                console.log(res.data);
                if (res.data.success === true) {
                    setNfts(res.data);
                    //ReactSession.set("NumberNfts", res.data.result.length);
                    setIsLoadedMarketPlaceNFTs(true)
                }
                else {
                    //setMssg("Some Error Occured");
                    setNfts([]);
                }
            })
            // Catch errors if any
            .catch((err) => {
                console.warn(err);
            });
    }
    const callback = (signature, result) => {
        console.log("Signature ", signature);
        console.log("result ", result);
        if (signature.err === null) {
            setMinted(saveMinted);
            setStatus("success: Successfully Signed and Minted.");
        }
    }
    const buyNow = (nftAddr,price, sellerAddress) => {
        
        //e.preventDefault();
        let nftUrl = `https://api.shyft.to/sol/v1/marketplace/buy`;
        setLoading(true);
        axios({
                url: nftUrl,
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": xKey,
                },
                data: {
                    network:'devnet',
                    marketplace_address: '3y4rUzcCRZH4TstRJGYmUUKuod8hd4Rvu2Fnf2FhQoY4',
                    nft_address: nftAddr,
                    price: Number(price),
                    seller_address: sellerAddress,
                    buyer_wallet: wallID
                }
              })
                // Handle the response from backend here
                .then(async (res) => {
                    if (res.data.success === true) {
                        //setOkModal(true);
    
                        const transaction = res.data.result.encoded_transaction;
                        const ret_result = await signAndConfirmTransactionFe('devnet', transaction, callback);
                        console.log(ret_result);
                        //setListingPrice(0);
                    } else {
                        //setFailedModal(true);
                        //setShowLister(false);
                    }
                    setLoading(false);
                })
                // Catch errors if any
                .catch((err) => {
                  console.warn(err);
                  setLoading(false);
                });
      }
      const findOwner = (seller_address) => {
        //e.preventDefault();
        
                //Note, we are not mentioning update_authority here for now
                let nftUrl = `https://api.shyft.to/sol/v1/nft/read_all?network=${network}&address=${seller_address}`;
                axios({
                    // Endpoint to send files
                    url: nftUrl,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": xKey,
                    },
                    // Attaching the form data
                })
                    // Handle the response from backend here
                    .then((res) => {
                        console.log(res.data);
                        setDataFetched(res.data);
                        setLoaded(true);
                    })
        
                    // Catch errors if any
                    .catch((err) => {
                        console.warn(err);
                    });
              }

    return (

        <div className=" gradient-background">
            <nav className="navbar bg-light fixed-top p-3">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasNavbar"
                        aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="button-25 mb-3 nav-link active" aria-current="page" href="/">Marketplace</a>
                                </li>
                                <li className="nav-item">
                                    <a className="button-25 mb-3 nav-link" href="/create">Create NFT</a>
                                </li>
                                <li className="nav-item">
                                    <a className="button-25 nav-link" href="/myNFT">My NFT</a>
                                </li>
                            </ul>
                           

                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      
                    </div>
                </div>
            </nav>
            <div className="container content">
                {!connStatus && (<div className="">
                    <div className="text-center pt-4">
                        <h1 className="">Connect Your Wallet</h1>
                        <p className="">You need to connect your wallet to deploy and interact with your contracts.</p>
                        <button className="button-25 custom-heading" onClick={solanaConnect}>Connect Phantom Wallet</button>
                    </div>
                </div>)}

                <div className="gradient-background">
                    {/* ... (other JSX content) */}
                    {loading && (
                        <div className="loading-overlay">
                            <div className="spinner"></div>
                        </div>
                    )}
                </div>

                {connStatus && (<div className="">
                    <div className="">
                        <form>
                            <div className="">
                                <div className="col-sm-12">
                                    <input
                                        type="hidden"
                                        className="form-control"
                                        placeholder="Enter Wallet Id"
                                        value={wallID}
                                        onChange={(e) => setWallID(e.target.value)}  // Add this line
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>)}

                <div className="row">
                    {isLoadedMarketPlaceNFTs &&
                        nfts.result.map((item) => (
                            <div className="col-6 col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 port-cust-padding" key={item.nft_address}>
                                <div className="cards-outer-port position-relative">
                                    <div className="inner-box-img-container">
                                        <a href={`/get-details?token_address=${item.nft_address}&apiKey=${xKey}`} target="_blank" rel="noreferrer">
                                            <img
                                                className="img-fluid"
                                                src={item.nft.image_uri}
                                                alt="img"
                                            />
                                        </a>
                                    </div>


                                    <div className="buy-overlay position-absolute top-0 start-0 d-flex justify-content-center align-items-center">
                                        <button className="button-24 buy-button" onClick={() =>buyNow(item.nft_address, item.price, item.seller_address)}>Buy</button>
                                        {/* <button className="button-24 buy-button" onClick={() =>findOwner(item.seller_address)}>Owner</button> */}
                                    </div>
                                </div>
                                <div className="col-lg-12 text-center mt-2">
                                    <a
                                        href={`/get-details?token_address=${item.nft_address}&apiKey=${xKey}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="link-no-underline"
                                    >
                                        <h5>{item.nft.name}</h5>
                                        <h5><i>{item.price}</i> SOL</h5>
                                    </a>
                                </div>
                            </div>
                        ))}
                </div>
             
            </div>
        </div >
    );
};

export default Shop;
import { useState } from "react";
import axios from "axios";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ListAll = () => {
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

    const fetchNFTs = (e) => {
        e.preventDefault();

        //Note, we are not mentioning update_authority here for now
        let nftUrl = `https://api.shyft.to/sol/v1/nft/read_all?network=${network}&address=${wallID}`;
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
    };

    const getYourBuyHistory = (e) => {

        e.preventDefault
        //const xKey = xKey;
        const marketplaceAddress = "3y4rUzcCRZH4TstRJGYmUUKuod8hd4Rvu2Fnf2FhQoY4";
        //setMssg("");

        let nftUrl = `https://api.shyft.to/sol/v1/marketplace/buy_history?network=devnet&marketplace_address=${marketplaceAddress}&buyer_address=${wallID}`;

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
                // setLoadBuy(true);
                console.log(res.data);
                if (res.data.success === true) {
                    //setDataFetched(res.data);
                    //setLoaded(true);
                    // Truy cập giá từng đối tượng trong mảng result
                    setBuy(res.data)
                    setLoadedBuy(true);
                }
                else {
                    //setMssg("Some Error Occured");
                }

            })
            // Catch errors if any
            .catch((err) => {
                console.warn(err);
                //setMssg(err.message);
                //setLoadBuy(true);
            });
    }


    // Phantom Adaptor
    const solanaConnect = async () => {
        console.log('clicked solana connect');
        const { solana } = window;
        if (!solana) {
            alert("Please Install Solana");
        }

        try {
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
            }
        }
        catch (err) {
            console.log(err);
        }

    }

    const getNFTsFromMarketPlace = (e) => {
        e.preventDefault

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
                //setIsLoadedMarketPlaceNFTs(true);
                //ReactSession.set("nfts", res.data.result);
                //setLoaded(true);
            })
            // Catch errors if any
            .catch((err) => {
                console.warn(err);
                //setNfts([]);
                //setIsLoadedMarketPlaceNFTs(true);
            });
    }

    return (
        <div className="container">
            <div className="">
                <div className="">
                    <h1>List All Your NFTs</h1>
                    <p>
                        This is a sample project which will list all your NFTs associated
                        with your wallet
                    </p>
                </div>
            </div>

            <div className="">
                {!connStatus && (<div className="">
                    <div className="">
                        <h2 className="custom-h2">Connect Your Wallet</h2>
                        <p className="">You need to connect your wallet to deploy and interact with your contracts.</p>
                        <button className="" onClick={solanaConnect}>Connect Phantom Wallet</button>
                        {/* <select className="form-select" onChange={(e) => {
          console.log(e.target.value);
          (e.target.value === 'mtmsk') ? mtmskConnect() : solanaConnect();
        }}>
          <option value="none">Connect</option>
          <option value="phntm">Phantom</option>
        </select> */}
                    </div>
                </div>)}
                {connStatus && (<div className="">
                    <div className="">
                        <form>
                            <div className="">

                                <div className="">
                                    <select
                                        name="network"
                                        className="form-control form-select"
                                        id=""
                                        onChange={(e) => setNetwork(e.target.value)}
                                    >
                                        <option value="devnet">Devnet</option>
                                        <option value="testnet">Testnet</option>
                                        <option value="mainnet-beta">Mainnet Beta</option>
                                    </select>
                                </div>
                                <div className="">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Wallet Id"
                                        value={wallID}
                                        onChange={(e) => setWallID(e.target.value)}  // Add this line
                                    />
                                </div>

                            </div>
                            <div className="text-center p-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={fetchNFTs}
                                >
                                    Get NFTs
                                </button>
                            </div>
                        </form>
                        <button
                            className="btn btn-primary"
                            onClick={getYourBuyHistory}
                        >
                            Get your buy history
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={getNFTsFromMarketPlace}
                        >
                            Get NFTs From MarketPlace
                        </button>
                    </div>
                </div>)}
            </div>

            <div className="">
                <div className="">
                    <div className="">
                        {isLoaded &&
                            dataFetched.result.map((item) => (
                                <div className="" key={item.mint}>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <a href={`/get-details?token_address=${item.mint}&apiKey=${xKey}`} target="_blank" rel="noreferrer">
                                                <img style={{
                                                    width: "200px"
                                                }} className="img-fluid" src={item.image_uri} alt="img" />
                                            </a>
                                            <a href={`/get-details?token_address=${item.mint}&apiKey=${xKey}`} target="_blank" rel="noreferrer">
                                                <h5>{item.name}</h5>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}

                    </div>
                </div>
            </div>

            <div className="">
                <div className="">
                    <div className="">

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Price</th>
                                    <th scope="col">NFT Address</th>
                                    <th scope="col">Last</th>
                                    <th scope="col">Purchased Time</th>
                                    <th scope="col">Created Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoadedBuy &&
                                    buy.result.map((item) => (
                                        <tr key={item.nft_address}>
                                            <th>{item.price}</th>
                                            <th><a href={``}></a>{item.nft_address}</th>
                                            <td>{item.seller_address}</td>
                                            <td>{item.purchased_at}</td>
                                            <td>{item.created_at}</td>
                                        </tr>))}
                            </tbody>
                        </table>


                    </div>
                </div>
            </div>

            <div className="">
                <div className="">
                    <div className="">
                        {isLoadedMarketPlaceNFTs &&
                            nfts.result.map((item) => (
                                <div className="" key={item.nft_address}>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <a href={`/get-details?token_address=${item.nft_address}&apiKey=${xKey}`} target="_blank" rel="noreferrer">
                                                <img style={{
                                                    width: "200px"
                                                }} className="img-fluid" src={item.nft.image_uri} alt="img" />
                                            </a>
                                            <a href={`/get-details?token_address=${item.nft_address}&apiKey=${xKey}`} target="_blank" rel="noreferrer">
                                                <h5>{item.nft.name}</h5>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}

                    </div>
                </div>
            </div>

        </div>
    );
};

export default ListAll;
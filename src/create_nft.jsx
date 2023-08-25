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

const xApiKey = "lEHeaJLm_TKtI1bU"; //Enter Your x-api-key here
const Create = () => {
  const [file, setfile] = useState();
  const [displayPic, setDisplayPic] = useState(disPic);
  const [network, setnetwork] = useState("devnet");
  // const [privKey, setprivKey] = useState();
  const [publicKey, setPublicKey] = useState('');
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();
  const [desc, setDesc] = useState();
  const [attr, setAttr] = useState(JSON.stringify([{ "trait_type": "edification", "value": "100" }]));
  const [extUrl, setExtUrl] = useState();
  const [maxSup, setMaxSup] = useState(0);
  const [roy, setRoy] = useState(99);

  const [minted, setMinted] = useState();
  const [saveMinted, setSaveMinted] = useState();
  const [errorRoy, setErrorRoy] = useState();

  const [status, setStatus] = useState("Awaiting Upload");
  const [dispResponse, setDispResp] = useState("");

  const [connStatus, setConnStatus] = useState(true);

  const callback = (signature, result) => {
    console.log("Signature ", signature);
    console.log("result ", result);
    if (signature.err === null) {
      setMinted(saveMinted);
      setStatus("success: Successfully Signed and Minted.");
    }
  }

  const mintNow = (e) => {
    e.preventDefault();
    setStatus("Loading");
    let formData = new FormData();
    formData.append("network", network);
    formData.append("wallet", publicKey);
    formData.append("name", name);
    formData.append("symbol", symbol);
    formData.append("description", desc);
    formData.append("attributes", JSON.stringify(attr));
    formData.append("external_url", extUrl);
    formData.append("max_supply", maxSup);
    formData.append("royalty", roy);
    formData.append("file", file);

    axios({
      // Endpoint to send files
      url: "https://api.shyft.to/sol/v1/nft/create_detach",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "x-api-key": xApiKey,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
      },

      // Attaching the form data
      data: formData,
    })
      // Handle the response from backend here
      .then(async (res) => {
        console.log(res);
        if (res.data.success === true) {
          setStatus("success: Transaction Created. Signing Transactions. Please Wait.");
          const transaction = res.data.result.encoded_transaction;
          setSaveMinted(res.data.result.mint);
          const ret_result = await signAndConfirmTransactionFe(network, transaction, callback);
          console.log(ret_result);
          setDispResp(res.data);

        }
      })

      // Catch errors if any
      .catch((err) => {
        console.warn(err);
        setStatus("success: false");
      });

  }

  return (
    <div className=" gradient-background">
          <nav className="navbar bg-light fixed-top">
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
                                    <a className="button-25 nav-link" href="/create">Create NFT</a>
                                </li>
                            </ul>
                            <form className="d-flex mt-3" role="search">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form>

                        </div>
                    </div>
                    <div className="d-flex justify-content-end mt-3">

                        <a><i className='bx bxs-user'></i></a>
                        <a><i className='bx bx-cart'></i></a>

                        <ul className=" custom-dropdown" >
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li></ul>

                    </div>
                </div>
            </nav>
      <div className="mint-single rounded py-3 px-5">
        {connStatus && (<div className="form-container ">
          <h1 className="text-center pt-4 custom-heading">CREATE  NFT</h1>
          <label className="text-center col-md-12">
            This Sample Project Illustrates how to create new NFTs using SHYFT
            APIs.
          </label>
          <form className=" pt-5" >
            <div className="row">
              <div className="col-sm-12 col-md-5">
                <div
                  className="uploaded-img"
                  style={{
                    border: "2px solid",
                    height: "300px",
                    width: "300px",
                    backgroundColor: "grey",
                    margin: "0 auto",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    className="img-fluid"
                    src={displayPic}
                    alt="To be uploaded"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                  
                </div>
              <div className="text-center">
              <br /><input type="button" value={"Select Image"} className="button-25 text-center text-light pr rounded-pill" />
              </div>
                <input
                  type="file"
                  style={{ position: "absolute", zIndex: "3", marginTop: "-50px", marginLeft: "-70px", width: "150px", height: "40px", opacity: "0" }}
                  onChange={(e) => {
                    const [file_selected] = e.target.files;
                    setfile(e.target.files[0]);
                    setDisplayPic(URL.createObjectURL(file_selected));
                  }}
                />
                <div className="mb-3"></div>
              </div>
              <div className="col-sm-12 col-md-7">
                <div className="form-section">
                  <div className="form-elements-container">
                    <div className="white-form-group ">
                      <label className="w-100 pb-2 text-start"> Network:</label>
                      <select
                        name="network"
                        className="form-control form-select"
                        onChange={(e) => setnetwork(e.target.value)}
                      >
                        <option value="devnet">Devnet</option>
                        <option value="testnet">Testnet</option>
                        <option value="mainnet-beta">Mainnet Beta</option>
                      </select>
                    </div>
                    <div className="white-form-group pt-3 ">
                      <label className="w-100 pb-2 text-start">
                        Public Key:<br /> </label>
                      <input type="text" className="form-control" placeholder="Enter Your Wallet's Public Key" value={publicKey} onChange={(e) => setPublicKey(e.target.value)} required />
                    </div>
                    <div className="white-form-group pt-3 ">
                      <label className="w-100 pb-2 text-start">Name:<br /> </label>
                      <input type="text" className="form-control" placeholder="Enter NFT Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="white-form-group pt-3 ">
                      <label className="w-100 pb-2 text-start">
                        Symbol:
                      </label>
                      <input type="text" className="form-control" placeholder="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
                    </div>
                    <div className="white-form-group pt-3 ">
                      <label className="w-100 pb-2 text-start">
                        Description: <br />
                      </label>
                      <textarea className="form-control" placeholder="Enter Description" value={desc} onChange={(e) => setDesc(e.target.value)} required></textarea>
                    </div>
                    <div className="white-form-group pt-3 ">
                      <label className="w-100 pb-2 text-start">
                        Attributes: <br />
                      </label>
                      <textarea className="form-control" placeholder="Enter Attributes" value={attr} onChange={(e) => setAttr(e.target.value)} required></textarea>
                    </div>
                    <div className="white-form-group pt-3 ">
                      <label className="w-100 pb-2 text-start">
                        External Url: <br />
                      </label>
                      <input type="text" className="form-control" placeholder="Enter Url if Any" value={extUrl} onChange={(e) => setExtUrl(e.target.value)} />
                    </div>

                  </div>
                  <div className="p-5 text-center">
                    <button type="submit" className="button-25" id="liveToastBtn" onClick={mintNow}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <label className="text-center col-md-12">
            This creates one of kind NFTs by setting the <code>max_supply</code> parameter to 0. But you can update it needed, it should be between <i>0-100</i>.
          </label>
        </div>)}

        <div className="py-5 white-form-group pt-3">
          <h2 className="text-center pb-3">Response</h2>
          <div className="status text-center text-warning p-3"><h3 className="custom-status">{status}</h3>
          </div>
          <textarea
            className="form-control"
            name=""
            value={JSON.stringify(dispResponse)}
            id=""
            cols="30"
            rows="2"
          ></textarea>
        </div>
        <div className="p-3 text-center">
          {dispResponse && (<a href={`https://explorer.solana.com/address/${minted}?cluster=devnet`} target="_blank" className="btn btn-warning m-2 py-2 px-4">View on Explorer</a>)}
        </div>
      </div>
    </div>
  );
};

export default Create;
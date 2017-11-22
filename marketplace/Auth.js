module.exports.inferMarketplaceWalletAddressFromRequest = (req) => {
  /* Marketplaces need to authenticate with us and from that
  we can look up their registered wallet address.
  For now, they're just going to pass us a header with 
  their address for the sake of time and simplicity. 
  Need some more product guidance on this. */
  const tempWalletHeader = "x-splyt-temp-marketplacewallet";
  let walletAddress = req.headers[tempWalletHeader];
  if(walletAddress) {
    console.log("inferMarketplaceWalletAddressFromRequest.X-Splyt-Temp-MarketplaceWallet", walletAddress);
    return walletAddress;
  }
  // An additional temporary workaround, infer the wallet address from referer :\
  // TODO: This needs to go away ASAP! Waiting on front end implementation
  const referer = req.headers.referer;
  const map = [{
      contains:"splytportal.exhibitweb.com", 
      walletAddress:"0x4De5E911bAb66bE8e1Da9488Ca590F50c74942C5", 
      name:"Marketplace 1"
    }, {
      contains:"splytdemo.exhibitweb.com",
      walletAddress:"0x51738cdAD0bba06FB6BE44C851D45219b97c480F", 
      name:"Marketplace 2"
    }
  ];
  let chosen = map[0];
  if (referer) {
    chosen = map.find(i=>referer.indexOf(i.contains) == 0) || map[0];
  } 
  
  console.log("inferMarketplaceWalletAddressFromRequest.referer", referer, chosen);
  return chosen.walletAddress;
};
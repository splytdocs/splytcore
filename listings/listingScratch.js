/* 
I wanted to separate the listings from assets,
since listing seem temporary, the actual asset would stay 
the same once it's funded. 
*/
const listing = {
  id:"AAUJCg0MDAYBAQYGBAoFDA",
  listedBy: {
    id:   "BQgLBwcLAAUAAwgGBAMOBg",
    name: "Georgette McTiernan", 
  },
  dateListed:"2016-08-24T07:01:13Z",
  latitude:41.9,
  longitude:-8.5367,
  isActive:true,
  contributionTotal:33500, // denormalized if the UI doesn't want all the contributions 
  /* The user (listedBy), asset, and contributions stay the same after the listing is funded. 
  And storage-wise these would be records in other "tables" */
  asset: {
    id:"CQAMAgwPDQsHBQ0GBAEODg",
    name:"2016 Maserati Ghibli S Q4",
    price:80500
  },
  contributions: [
    {
      id:"AwsMBwIIBQAGDAMDBA0EDw",
      amount: 21000,
    },
    {
      id:"AA0OAQcODQQHAg0LBAgEAg",
      amount: 14500,
    },
    {
      id:"AgYKCwEHDAsFDQYHBAAHAg",
      amount: 8000,
    }
  ]
}


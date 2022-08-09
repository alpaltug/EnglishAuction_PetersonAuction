//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./auctionSimple.sol";
import "./auctionPeterson.sol";


contract FactorySimple {
  EnglishAuction[] public auctions;
  Auction[] public pederson_auctions;
  string[] descs;
  string[] pederson_descs;
  address[] addresses;
  address[] pederson_addresses;

  event bidEvent(uint _bidAmount);

  event auctionEvent(string d);


  function CreateEnglishNewAuction(string memory desc) public {
    EnglishAuction auction = new EnglishAuction();
    auctions.push(auction);
    descs.push(desc);
    addresses.push(msg.sender);
    emit auctionEvent(desc);

  }
  function CreateNewPedersonAuction(string memory desc) public {
    Auction auction = new Auction();
    pederson_auctions.push(auction);
    pederson_descs.push(desc);
    pederson_addresses.push(msg.sender);
    emit auctionEvent(desc);

  }

  function getDescs() view public returns(string[] memory) {
      return descs;
  }
  function getAuctions() view public returns(EnglishAuction[] memory) {
      return auctions;
  }
  function getAuction(uint num) view public returns(EnglishAuction) {
      return auctions[num];
  }
  function getPedersnDescs() view public returns(string[] memory) {
      return pederson_descs;
  }
  function getPedersonAuctions() view public returns(Auction[] memory) {
      return pederson_auctions;
  }
  function getPedersonAuction(uint num) view public returns(Auction) {
      return pederson_auctions[num];
  }
  function getAddresses() view public returns(address[] memory) {
      return addresses;
  }
  function getPedersonAddresses() view public returns(address[] memory) {
      return pederson_addresses;
  }

}
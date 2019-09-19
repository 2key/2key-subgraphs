import {
  Visited as VisitedEvent,
  Plasma2Ethereum as Plasma2EthereumEvent,
  Plasma2Handle as Plasma2HandleEvent

} from "../generated/Contract/TwoKeyPlasmaEvents"

import { Campaign, User, Visit, Test, Meta} from "../generated/schema"
import { log,Address, BigInt } from '@graphprotocol/graph-ts'


function createMetadata(eventAddress: Address, timeStamp:BigInt): void {
  let metadata = Meta.load(eventAddress.toHex());
  if (metadata == null){
    metadata = new Meta(eventAddress.toHex());
    metadata._visitCounter = 0;
    metadata._version = 9;
    metadata._plasmaToHandleCounter = 0;
    metadata._plasmaToEthereumCounter = 0;
    metadata._timeStamp = timeStamp;
    metadata._updatedAt = timeStamp;
    metadata.save();
  }
}

export function handleHandled(event: Plasma2HandleEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._plasmaToHandleCounter = metadata._plasmaToHandleCounter + 1;
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  let user = User.load(event.params.plasma.toHex());
  if (user == null){
    user = new User(event.params.plasma.toHex());
    user._handle = event.params.handle;
    user._timeStamp = event.block.timestamp;
    user.save();
  }
  else{
    user._handle = event.params.handle;
    user.save();
  }
}


export function handleVisited(event: VisitedEvent): void {
  // event.params.to            - Plamsa address
  // event.params.c             - Campaign contract on Ethereum
  // event.params.contractor    - Contractor Web3 Address
  // event.params.from          - Previous plasma Address


  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._visitCounter = metadata._visitCounter + 1;
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  //Add user by new visitor address
  log.debug('Handle {} Visited))))))))',['string arg']);
  log.info('info - Handle {} Visited))))))))',['string arg']);

  let referrer = User.load(event.params.from.toHex());
  if (referrer== null){
    referrer = new User(event.params.from.toHex());
    referrer._timeStamp = event.block.timestamp;
    referrer.save();
  }

  let visitor = User.load(event.params.to.toHex());
  if (visitor == null){
    visitor = new User(event.params.to.toHex());
    visitor._timeStamp = event.block.timestamp;
    visitor.save();
  }

  let campaign = Campaign.load(event.params.c.toHex());
  if (campaign == null){
    campaign = new Campaign(event.params.c.toHex());
    campaign._version = 1;
    campaign._timeStamp = event.block.timestamp;
    campaign.save();
  }

  let visitByCampaign = Visit.load(event.params.from.toHex()+'-'+event.params.to.toHex()+'-'+ event.params.c.toHex());
  if (visitByCampaign == null){
    let visit = new Visit(event.params.from.toHex()+'-'+event.params.to.toHex()+'-'+ event.params.c.toHex());
    visit._visitor = visitor.id;
    visit._campaign = campaign.id;
    visit._referrer = referrer.id;
    visit._timeStamp = event.block.timestamp;
    visit.save();
  }
}

export function handlePlasma2Ethereum(event: Plasma2EthereumEvent): void {
  // event.params.plasma
  // event.params.eth
  log.debug('Handle {} Plasma2EthereumEvent))))))))',['string arg']);
  log.info('INFO - Handle {} Plasma2EthereumEvent))))))))',['string arg']);

  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._plasmaToEthereumCounter = metadata._plasmaToEthereumCounter + 1;
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  let user = User.load(event.params.plasma.toHex());
  if(user == null){
    user = new User(event.params.plasma.toHex());
    user._web3Address = event.params.eth;
    user._timeStamp = event.block.timestamp;
    user.save();
  }
  else{
    user._web3Address = event.params.eth;
    user.save();
  }
}

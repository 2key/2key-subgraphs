import {
  Visited as VisitedEvent,
  Joined as JoinedEvent,

} from "../generated/TwoKeyPlasmaEvents/TwoKeyPlasmaEvents"

import {
  Plasma2Ethereum as Plasma2EthereumEvent,
  Plasma2Handle as Plasma2HandleEvent,
  CPCCampaignCreated as CPCCampaignCreatedEvent,
  ConversionCreated as ConversionCreatedEvent,
  ConversionExecuted as ConversionExecutedEvent

} from "../generated/TwoKeyPlasmaEventSource/TwoKeyPlasmaEventSource"

import { Campaign, Conversion, User, Visit, Meta, VisitEvent, PlasmaToEthereumMappingEvent, JoinEvent, Join} from "../generated/schema"
import { Address, BigInt } from '@graphprotocol/graph-ts'


function createMetadata(eventAddress: Address, timeStamp:BigInt): void {
  let metadata = Meta.load(eventAddress.toHex());
  if (metadata == null){
    metadata = new Meta(eventAddress.toHex());
    metadata._conversionsExecuted = 0;
    metadata._visitCounter = 0;
    metadata._joinsCounter = 0;
    metadata._subgraphType = 'PLASMA';
    metadata._n_campaigns = 0;
    metadata._version = 11;
    metadata._plasmaToHandleCounter = 0;
    metadata._n_conversions = 0;
    metadata._plasmaToEthereumCounter = 0;
    metadata._timeStamp = timeStamp;
    metadata._updatedAt = timeStamp;
    metadata.save();
  }
}


function createUser(userAddress: Address, timeStamp: BigInt): void {
  let user = User.load(userAddress.toHex());
  if (user == null){
    user = new User(userAddress.toHex());
    user._n_campaigns = 0;
    user._n_conversions = 0;
    user._n_joins = 0;
    user._timeStamp = timeStamp;
    user._updatedAt = timeStamp;
    user.save();
  }
}

function createConversion(event: ConversionCreatedEvent): void {
  let campaign = Campaign.load(event.params.campaignAddressPlasma.toHex());
  let converter = User.load(event.params.converter.toHex());

  let conversion = Conversion.load(campaign.id + '-' + event.params.conversionID.toString());
  if (conversion == null){
    conversion = new Conversion(campaign.id + '-' + event.params.conversionID.toString());
    conversion._campaign = campaign.id;
    conversion._timeStamp = event.block.timestamp;
    conversion._converter = converter.id;
    conversion._status = 'PENDING';
    conversion._conversionId = event.params.conversionID;
    conversion.save();
  }
}


function createCampaignObject(eventAddress:Address, campaignAddress: Address, timeStamp: BigInt): void {
  let campaign = Campaign.load(campaignAddress.toHex());
  if (campaign == null){
    let metadata = Meta.load(eventAddress.toHex());
    metadata._n_campaigns++;
    metadata._updatedAt = timeStamp;
    metadata.save();

    campaign = new Campaign(campaignAddress.toHex());
    campaign._timeStamp = timeStamp;
    campaign._n_visits = 0;
    campaign._n_joins = 0;
    campaign._subgraphType = 'PLASMA';
    campaign._updatedTimeStamp = timeStamp;
    campaign._version = 12;
    campaign.save();
  }
}

export function handleCPCCampaignCreated(event: CPCCampaignCreatedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  createCampaignObject(event.address, event.params.proxyCPCCampaignPlasma, event.block.timestamp);
  let campaign = Campaign.load(event.params.proxyCPCCampaignPlasma.toHex());

  createUser(event.params.contractorPlasma, event.block.timestamp);
  let contractor = User.load(event.params.contractorPlasma.toHex());
  campaign._contractor = contractor.id;
  campaign.save();
}

export function handleConversionCreated(event: ConversionCreatedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._updatedAt = event.block.timestamp;
  metadata._n_conversions += 1;
  metadata.save();


  // let campaign = Campaign.load(event.params.campaignAddressPlasma.toHex());
  // let conversionId = event.params.conversionID;

  createUser(event.params.converter, event.block.timestamp);

  createConversion(event);
  //TODO: need to create it with parameters and not event (To Support other type of conversions in Future)

  let converter = User.load(event.params.converter.toHex());
  converter._n_conversions += 1;
  converter.save();
}



export function handleHandled(event: Plasma2HandleEvent): void {
  // log.debug('Handle {} Visited))))))))',['string arg']);
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._plasmaToHandleCounter = metadata._plasmaToHandleCounter + 1;
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  // let user = User.load(event.params.plasma.toHex());
  createUser(event.params.plasma, event.block.timestamp);

  let user = User.load(event.params.plasma.toHex());
  user._handle = event.params.handle;
  user.save();
}

export function handleJoined(event: JoinedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._joinsCounter++;
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  //Add user by new visitor address
  // log.debug('Handle {} Visited))))))))',['string arg']);
  // log.info('info - Handle {} 1))))))))',['string arg']);

  createUser(event.params.fromPlasma, event.block.timestamp);

  let referrer = User.load(event.params.fromPlasma.toHex());

  // log.info('info - Handle {} 2))))))))',['string arg']);
  createUser(event.params.fromPlasma, event.block.timestamp);
  let visitor = User.load(event.params.toPlasma.toHex());

  createCampaignObject(event.address, event.params.campaignAddress, event.block.timestamp);
  let campaign = Campaign.load(event.params.campaignAddress.toHex());

  campaign._n_joins++;
  campaign._updatedTimeStamp = event.block.timestamp;
  campaign.save();

  let join = Join.load(event.params.fromPlasma.toHex()+'-'+event.params.toPlasma.toHex()+'-'+ event.params.campaignAddress.toHex());
  if (join == null){
    join = new Join(event.params.fromPlasma.toHex()+'-'+event.params.toPlasma.toHex()+'-'+ event.params.campaignAddress.toHex());
    join._visitor = visitor.id;
    join._campaign = campaign.id;
    join._referrer = referrer.id;
    join._timeStamp = event.block.timestamp;
    join.save();
  }

  let joinEvent = JoinEvent.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  if(joinEvent == null){
    joinEvent = new JoinEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    joinEvent._campaign = campaign.id;
    joinEvent._referrer = referrer.id;
    joinEvent._visitor = visitor.id;
    joinEvent._timeStamp = event.block.timestamp;
    joinEvent.save();
  }
}


export function handleVisited(event: VisitedEvent): void {
  // event.params.to            - Plamsa address
  // event.params.c             - Campaign contract on Ethereum
  // event.params.contractor    - Contractor Web3 Address
  // event.params.from          - Previous plasma Address

  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._visitCounter++;
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  //Add user by new visitor address
  // log.debug('Handle {} Visited))))))))',['string arg']);
  // log.info('info - Handle {} 1))))))))',['string arg']);

  createUser(event.params.from, event.block.timestamp);
  let referrer = User.load(event.params.from.toHex());


  createUser(event.params.to, event.block.timestamp);
  let visitor = User.load(event.params.to.toHex());

  createCampaignObject(event.address, event.params.c, event.block.timestamp);
  let campaign = Campaign.load(event.params.c.toHex());

  campaign._n_visits++;
  campaign._updatedTimeStamp = event.block.timestamp;
  campaign.save();

  let visit = Visit.load(event.params.from.toHex()+'-'+event.params.to.toHex()+'-'+ event.params.c.toHex());
  if (visit == null){
    visit = new Visit(event.params.from.toHex()+'-'+event.params.to.toHex()+'-'+ event.params.c.toHex());
    visit._visitor = visitor.id;
    visit._campaign = campaign.id;
    visit._referrer = referrer.id;
    visit._timeStamp = event.block.timestamp;
    visit.save();
  }

  let visitEvent = VisitEvent.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  if(visitEvent == null){
    visitEvent = new VisitEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    visitEvent._campaign = campaign.id;
    visitEvent._referrer = referrer.id;
    visitEvent._visitor = visitor.id;
    visitEvent._timeStamp = event.block.timestamp;
    visitEvent.save();
  }
}

export function handlePlasma2Ethereum(event: Plasma2EthereumEvent ): void {
  // event.params.plasma
  // event.params.eth
  // log.debug('Handle {} Plasma2EthereumEvent))))))))',['string arg']);
  // log.info('INFO - Handle {} Plasma2EthereumEvent))))))))',['string arg']);

  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._plasmaToEthereumCounter = metadata._plasmaToEthereumCounter + 1;
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  createUser(event.params.plasma, event.block.timestamp);
  let user = User.load(event.params.plasma.toHex());
  user._web3Address = event.params.eth;
  user.save();

  let mappingEvent = PlasmaToEthereumMappingEvent.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  if(mappingEvent == null){
    mappingEvent = new PlasmaToEthereumMappingEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    mappingEvent._ethereum = event.params.eth;
    mappingEvent._plasma = user.id;
    mappingEvent._timeStamp = event.block.timestamp;
    mappingEvent.save();
  }
}

export function handleConversionExecuted(event: ConversionExecutedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._conversionsExecuted += 1;
  // metadata._updatedAt = event.block.timestamp;
  metadata.save();

  let conversion = Conversion.load(event.params.campaignAddressPlasma.toHex() + '-' + event.params.conversionID.toString());
  conversion._status = 'EXECUTED';
  conversion.save();
}

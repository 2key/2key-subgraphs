import {
  Visited as VisitedEvent,
  Joined as JoinedEvent,

} from "../generated/TwoKeyPlasmaEvents/TwoKeyPlasmaEvents"

import {
  Plasma2Ethereum as Plasma2EthereumEvent,
  Plasma2Handle as Plasma2HandleEvent,
  CPCCampaignCreated as CPCCampaignCreatedEvent,
  ConversionCreated as ConversionCreatedEvent,
  ConversionExecuted as ConversionExecutedEvent,
  ConversionRejected as ConversionRejectedEvent,
  HandleChanged as HandleChangedEvent,
  PlasmaMirrorCampaigns as PlasmaMirrorCampaignsEvent
} from "../generated/TwoKeyPlasmaEventSource/TwoKeyPlasmaEventSource"


import { Campaign, Conversion, User, Visit, Meta, VisitEvent, PlasmaToEthereumMappingEvent, JoinEvent, Join, ForwardedByCampaign, CampaignPlasmaByWeb3, CampaignWeb3ByPlasma} from "../generated/schema"
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import {Debug} from "../../public/generated/schema";


function createMetadata(eventAddress: Address, timeStamp:BigInt): void {
  let metadata = Meta.load('Meta');
  if (metadata == null){
    metadata = new Meta('Meta');
    metadata._conversionsExecuted = 0;
    metadata._contracts = [];
    metadata._visitCounter = 0;
    metadata._joinsCounter = 0;
    metadata._subgraphType = 'PLASMA';
    metadata._n_campaigns = 0;
    metadata._n_forwarded = 0;
    metadata._n_conversions_rejected = 0;
    metadata._version = 11;
    metadata._plasmaToHandleCounter = 0;
    metadata._handleChanged = 0;
    metadata._plasmaWeb3Mapping = 0;
    metadata._n_conversions = 0;
    metadata._plasmaToEthereumCounter = 0;
    metadata._timeStamp = timeStamp;
    metadata._updatedAt = timeStamp;
    metadata.save();
  }

  if (metadata._contracts.indexOf(eventAddress) == -1) {
    let contracts = metadata._contracts;
    contracts.push(eventAddress);
    metadata._contracts = contracts;
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
    conversion._subgraphType = 'PLASMA';
    conversion._timeStamp = event.block.timestamp;
    conversion._participate = converter.id;
    conversion._status = 'PENDING';
    conversion._conversionId = event.params.conversionID;
    conversion._updatedTimeStamp = event.block.timestamp;
    conversion._version = 10;
    conversion._fiatAmountSpent = BigInt.fromI32(0);
    conversion._ethAmountSpent = BigInt.fromI32(0);
    conversion._tokens = BigInt.fromI32(0);
    conversion._refundable = true;
    conversion._isFiatConversion = false;
    conversion.save();
  }
}

function createCampaign(eventAddress:Address, campaignAddress: Address, timeStamp: BigInt): void {
  let campaign = Campaign.load(campaignAddress.toHex());
  if (campaign == null){
    let metadata = Meta.load('Meta');
    metadata._n_campaigns++;
    metadata._updatedAt = timeStamp;
    metadata.save();

    campaign = new Campaign(campaignAddress.toHex());
    campaign._timeStamp = timeStamp;
    campaign._n_conversions_executed = 0;
    campaign._n_unique_converters = 0;
    campaign._n_conversions_approved = 0;
    campaign._n_forwarded = 0;
    campaign._n_conversions_rejected = 0;
    campaign._converters_addresses = [];
    campaign._n_visits = 0;
    campaign._n_joins = 0;
    campaign._n_conversions = 0;
    campaign._subgraphType = 'PLASMA';
    campaign._updatedTimeStamp = timeStamp;
    campaign._version = 12;
    campaign.save();
  }
}

function createDebugObject(event: ethereum.Event, info: string): void {
  let debug = Debug.load(event.transaction.hash.toHex());

  if (debug != null){
    let temp = debug._info;
    debug._info = temp + info;
  }
  else{
    debug = new Debug(event.transaction.hash.toHex());
    debug._info = info;
  }

  debug.save();
}

export function handleCPCCampaignCreated(event: CPCCampaignCreatedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load('Meta');
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  createCampaign(event.address, event.params.proxyCPCCampaignPlasma, event.block.timestamp);
  let campaign = Campaign.load(event.params.proxyCPCCampaignPlasma.toHex());

  createUser(event.params.contractorPlasma, event.block.timestamp);
  let contractor = User.load(event.params.contractorPlasma.toHex());

  campaign._owner = contractor.id;
  campaign.save();
}

export function handleConversionCreated(event: ConversionCreatedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load('Meta');
  metadata._updatedAt = event.block.timestamp;
  metadata._n_conversions += 1;
  metadata.save();

  let campaignAddress = event.params.campaignAddressPlasma;
  createCampaign(event.address, campaignAddress, event.block.timestamp);

  // let conversionId = event.params.conversionID;

  createUser(event.params.converter, event.block.timestamp);

  createConversion(event);


  //TODO: need to create it with parameters and not event (To Support other type of conversions in Future)

  let converter = User.load(event.params.converter.toHex());
  converter._n_conversions += 1;
  converter.save();

  let campaign = Campaign.load(campaignAddress.toHex());

  if (campaign._converters_addresses.indexOf(converter.id) == -1){
    let convertersAddresses = campaign._converters_addresses;
    convertersAddresses.push(converter.id);
    campaign._converters_addresses = convertersAddresses;
    campaign._n_unique_converters++;
  }

  campaign._n_conversions += 1;
  campaign.save();

}



export function handleHandled(event: Plasma2HandleEvent): void {
  // log.debug('Handle {} Visited))))))))',['string arg']);
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load('Meta');
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
  //Add user by new visitor address
  // log.debug('Handle {} Visited))))))))',['string arg']);
  // log.info('info - Handle {} 1))))))))',['string arg']);

  if (event.params.fromPlasma.toHex() == event.params.toPlasma.toHex()){
    createDebugObject(event, `JoinedEvent: ${event.params.fromPlasma.toHex()} is on 2 vertex of that joined edge.`);
    return;
  }

  createUser(event.params.fromPlasma, event.block.timestamp);

  let referrer = User.load(event.params.fromPlasma.toHex());

  // log.info('info - Handle {} 2))))))))',['string arg']);
  createUser(event.params.toPlasma, event.block.timestamp);
  let visitor = User.load(event.params.toPlasma.toHex());

  createCampaign(event.address, event.params.campaignAddress, event.block.timestamp);
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

  let visitCreated = false;

  let visit = Visit.load(event.params.fromPlasma.toHex()+'-'+event.params.toPlasma.toHex()+'-'+ event.params.campaignAddress.toHex());
  if (visit == null){
    visit = new Visit(event.params.fromPlasma.toHex()+'-'+event.params.toPlasma.toHex()+'-'+ event.params.campaignAddress.toHex());
    visit._visitor = visitor.id;
    visit._campaign = campaign.id;
    visit._createdByJoin = true;
    visit._overrideTxHash = event.transaction.hash;
    visit._overridJoinCreationWithVisit = false;
    visit._tx_hash = event.transaction.hash;
    visit._referrer = referrer.id;
    visit._timeStamp = event.block.timestamp;
    visit._updatedAt = event.block.timestamp;
    visit.save();
    visitCreated = true;
  }

  let forwarded = ForwardedByCampaign.load(campaign.id + '-' + event.params.fromPlasma.toHex());
  if (forwarded == null) {
    forwarded = new ForwardedByCampaign(campaign.id + '-' + event.params.fromPlasma.toHex());
    forwarded._exists = 1;
    campaign._n_forwarded +=1;
    campaign.save();
  }

  forwarded.save();

  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load('Meta');
  metadata._joinsCounter++;
  if (visitCreated){
    metadata._visitCounter++;
    campaign._n_visits++;
    campaign.save();
  }
  metadata._updatedAt = event.block.timestamp;
  metadata.save();
}


export function handleVisited(event: VisitedEvent): void {
  // event.params.to            - Plamsa address
  // event.params.c             - Campaign contract on Ethereum
  // event.params.contractor    - Contractor Web3 Address
  // event.params.from          - Previous plasma Address

  if (event.params.from.toHex() == event.params.to.toHex()){
    createDebugObject(event, `VisitedEvent: ${event.params.from.toHex()} is on 2 vertex of that joined edge.`);
    return;
  }

  createUser(event.params.from, event.block.timestamp);
  let referrer = User.load(event.params.from.toHex());

  createUser(event.params.to, event.block.timestamp);
  let visitor = User.load(event.params.to.toHex());

  createCampaign(event.address, event.params.c, event.block.timestamp);
  let campaign = Campaign.load(event.params.c.toHex());

  let visit = Visit.load(event.params.from.toHex()+'-'+event.params.to.toHex()+'-'+ event.params.c.toHex());
  if (visit == null){
    visit = new Visit(event.params.from.toHex()+'-'+event.params.to.toHex()+'-'+ event.params.c.toHex());
    visit._visitor = visitor.id;
    visit._campaign = campaign.id;
    visit._createdByJoin = false;
    visit._overridJoinCreationWithVisit = false;
    visit._overrideTxHash = event.transaction.hash;
    visit._tx_hash = event.transaction.hash;
    visit._referrer = referrer.id;
    visit._timeStamp = event.block.timestamp;
    visit._updatedAt = event.block.timestamp;
    campaign._n_visits++;
    campaign._updatedTimeStamp = event.block.timestamp;
    campaign.save();
  }
  else{
    visit._overrideTxHash = event.transaction.hash;
    visit._overridJoinCreationWithVisit = true;
    visit._updatedAt = event.block.timestamp;
  }

  visit.save();

  let forwarded = ForwardedByCampaign.load(campaign.id + '-' + event.params.from.toHex());
  if (forwarded == null) {
    forwarded = new ForwardedByCampaign(campaign.id + '-' + event.params.from.toHex());
    forwarded._exists = 1;
    campaign._n_forwarded +=1;
    campaign.save()
  }

  forwarded.save();

  // let visitEvent = VisitEvent.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  // if(visitEvent == null){
  //   visitEvent = new VisitEvent(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  //   visitEvent._campaign = campaign.id;
  //   visitEvent._referrer = referrer.id;
  //   visitEvent._visitor = visitor.id;
  //   visitEvent._timeStamp = event.block.timestamp;
  //   visitEvent.save();
  // }

  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load('Meta');
  metadata._visitCounter++;
  metadata._updatedAt = event.block.timestamp;
  metadata.save();
}

export function handlePlasma2Ethereum(event: Plasma2EthereumEvent ): void {
  // event.params.plasma
  // event.params.eth
  // log.debug('Handle {} Plasma2EthereumEvent))))))))',['string arg']);
  // log.info('INFO - Handle {} Plasma2EthereumEvent))))))))',['string arg']);

  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load('Meta');
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

export function handlePlasmaMirrorCampaigns(event: PlasmaMirrorCampaignsEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load('Meta');
  metadata._plasmaWeb3Mapping = metadata._plasmaWeb3Mapping + 1;
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  let campaignPlasmaAddress = event.params.proxyPlasmaAddress;
  let campaignPublicAddress = event.params.proxyPublicAddress;

  let campaignPlasmaByWeb3 = CampaignPlasmaByWeb3.load(campaignPublicAddress.toHex());
  if (campaignPlasmaByWeb3 == null){
    campaignPlasmaByWeb3 = new CampaignPlasmaByWeb3(campaignPublicAddress.toHex());
    campaignPlasmaByWeb3._address = campaignPlasmaAddress;
    campaignPlasmaByWeb3.save();
  }

  let campaignWeb3ByPlasma = CampaignWeb3ByPlasma.load(campaignPlasmaAddress.toHex());
  if (campaignWeb3ByPlasma == null){
    campaignWeb3ByPlasma = new CampaignWeb3ByPlasma(campaignPlasmaAddress.toHex());
    campaignWeb3ByPlasma._address = campaignPublicAddress;
    campaignWeb3ByPlasma.save();
  }
}

export function handleChangedHandle(event: HandleChangedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load('Meta');
  metadata._handleChanged = metadata._handleChanged + 1;
  metadata._updatedAt = event.block.timestamp;
  metadata.save();

  // let user = User.load(event.params.plasma.toHex());
  createUser(event.params.userPlasmaAddress, event.block.timestamp);

  let user = User.load(event.params.userPlasmaAddress.toHex());
  user._handle = event.params.newHandle;
  user.save();
}


export function handleConversionExecuted(event: ConversionExecutedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load('Meta');
  metadata._conversionsExecuted += 1;
  // metadata._updatedAt = event.block.timestamp;
  metadata.save();

  let campaign = Campaign.load(event.params.campaignAddressPlasma.toHex());
  campaign._n_conversions_executed += 1;
  campaign.save();

  let conversion = Conversion.load(event.params.campaignAddressPlasma.toHex() + '-' + event.params.conversionID.toString());
  conversion._status = 'EXECUTED';
  conversion.save();
}


export function handleConversionRejected(event: ConversionRejectedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load('Meta');
  metadata._n_conversions_rejected += 1;
  // metadata._updatedAt = event.block.timestamp;
  metadata.save();

  let campaign = Campaign.load(event.params.campaignAddressPlasma.toHex());
  campaign._n_conversions_rejected += 1;
  campaign.save();

  let conversion = Conversion.load(event.params.campaignAddressPlasma.toHex() + '-' + event.params.conversionID.toString());
  conversion._status = 'REJECTED';
  conversion._rejected_status_code = event.params.statusCode.toI32();
  conversion._rejected_at = event.block.timestamp;
  conversion.save();
}

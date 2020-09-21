import {
  Visited as VisitedEvent,
  Joined as JoinedEvent,

} from "../generated/TwoKeyPlasmaEvents/TwoKeyPlasmaEvents"

import {
  ReputationUpdated as ReputationUpdatedEvent,
  FeedbackSubmitted as FeedbackSubmittedEvent
} from "../generated/TwoKeyPlasmaReputationRegistry/TwoKeyPlasmaReputationRegistry"

import {
  Plasma2Ethereum as Plasma2EthereumEvent,
  Plasma2Handle as Plasma2HandleEvent,
  CPCCampaignCreated as CPCCampaignCreatedEvent,
  ConversionCreated as ConversionCreatedEvent,
  ConversionExecuted as ConversionExecutedEvent,
  ConversionRejected as ConversionRejectedEvent,
  HandleChanged as HandleChangedEvent,
  PlasmaMirrorCampaigns as PlasmaMirrorCampaignsEvent,
  ConversionPaid as ConversionPaidEvent,
  AddedPendingRewards as AddedPendingRewardsEvent,
  PaidPendingRewards as PaidPendingRewardsEvent
} from "../generated/TwoKeyPlasmaEventSource/TwoKeyPlasmaEventSource"


import {
  Campaign, Conversion, User, Visit, Meta, Debug, PlasmaToEthereumMappingEvent, JoinEvent,
  Join, ForwardedByCampaign, CampaignPlasmaByWeb3, CampaignWeb3ByPlasma, Reputation, Feedback, Reward
} from "../generated/schema"

import {
  Address, BigInt, ethereum
 } from '@graphprotocol/graph-ts'

function getOrCreateMetadata(eventAddress: Address, timeStamp: BigInt): Meta {
  let id = 'Meta';

  let metadata = Meta.load(id);
  if (metadata == null){
    metadata = new Meta(id);
    metadata._conversionsExecuted = 0;
    metadata._contracts = [];
    metadata._visitCounter = 0;
    metadata._visitCounterPpc = 0;
    metadata._n_conversions_paid = 0;
    metadata._n_ppcCampaignsCreated = 0;
    metadata._n_clicks = 0;
    metadata._n_referred = 0;
    metadata._n_referredPpc = 0;
    metadata._n_conversions_unpaid = 0;
    metadata._joinsCounter = 0;
    metadata._subgraphType = 'PLASMA';
    metadata._n_campaigns = 0;
    metadata._n_forwarded = 0;
    metadata._n_reputationEvents = 0;
    metadata._n_feedbackEvents = 0;
    metadata._n_conversions_rejected = 0;
    metadata._version = 11;
    metadata._plasmaToHandleCounter = 0;
    metadata._handleChanged = 0;
    metadata._plasmaWeb3Mapping = 0;
    metadata._n_conversions = 0;
    metadata._plasmaToEthereumCounter = 0;
    metadata._timeStamp = timeStamp;
  }

  metadata._updatedAt = timeStamp;

  if (metadata._contracts.indexOf(eventAddress) == -1) {
    let contracts = metadata._contracts;
    contracts.push(eventAddress);
    metadata._contracts = contracts;
  }

  metadata.save();

  return metadata as Meta;
}


function getOrCreateUser(userAddress: Address, timeStamp: BigInt): User {
  let id = userAddress.toHex();
  let user = User.load(id);

  if (user == null){
    user = new User(id);
    user._n_campaigns = 0;
    user._n_conversions = 0;
    user._n_joins = 0;
    user._n_conversions_paid = 0;
    user._n_conversions_unpaid = 0;
    user._pending_rewards_wei_non_rebalanced = BigInt.fromI32(0);
    user._pending_rewards_ppc_wei_non_rebalanced = BigInt.fromI32(0);
    user._paid_rewards_wei_rebalanced = BigInt.fromI32(0);
    user._paid_rewards_wei_non_rebalanced = BigInt.fromI32(0);
    user._paid_rewards_ppc_wei_rebalanced = BigInt.fromI32(0);
    user._paid_rewards_ppc_wei_non_rebalanced = BigInt.fromI32(0);
    user._contractorMonetaryRep = BigInt.fromI32(0);
    user._contractorBudgetRep = BigInt.fromI32(0);
    user._contractorFeedbackRep = BigInt.fromI32(0);
    user._referrerMonetaryRep = BigInt.fromI32(0);
    user._referrerBudgetRep = BigInt.fromI32(0);
    user._referrerFeedbackRep = BigInt.fromI32(0);
    user._converterMonetaryRep = BigInt.fromI32(0);
    user._converterBudgetRep = BigInt.fromI32(0);
    user._converterFeedbackRep = BigInt.fromI32(0);
    user._timeStamp = timeStamp;
    user._updatedAt = timeStamp;
    user.save();
  }

  return user as User;
}

function getOrCreateForwardByCampaign(eventAddress: Address, campaignAddress: Address, referrerAddress: Address, timeStamp: BigInt) : ForwardedByCampaign {
  let id = campaignAddress.toHex() + '-' + referrerAddress.toHex();
  let forwardBy = ForwardedByCampaign.load(id);

  if (forwardBy == null) {
    let campaign = getOrCreateCampaign(eventAddress, campaignAddress, timeStamp);
    let metadata = getOrCreateMetadata(eventAddress, timeStamp);

    forwardBy = new ForwardedByCampaign(id);
    forwardBy._exists = 1;
    metadata._n_forwarded += 1;
    metadata._n_referred += 1;

    if (campaign._type == 'ppc'){
      metadata._n_referredPpc += 1;
    }
    metadata.save();
  }

  forwardBy.save();

  return forwardBy as ForwardedByCampaign;
}

function getOrCreateConversion(eventAddress: Address, campaignAddress: Address, conversionID: BigInt, timestamp: BigInt): Conversion {
  let id = campaignAddress.toHex() + '-' + conversionID.toString();

  let conversion = Conversion.load(id);
  if (conversion == null){
    let campaign = getOrCreateCampaign(eventAddress, campaignAddress, timestamp);
    let metadata = getOrCreateMetadata(eventAddress, timestamp);

    conversion = new Conversion(id);
    conversion._campaign = campaign.id;
    conversion._subgraphType = 'PLASMA';
    conversion._timeStamp = timestamp;
    conversion._status = 'PENDING';
    conversion._conversionId = conversionID;
    conversion._updatedTimeStamp = timestamp;
    conversion._version = 10;
    conversion._fiatAmountSpent = BigInt.fromI32(0);
    conversion._ethAmountSpent = BigInt.fromI32(0);
    conversion._tokens = BigInt.fromI32(0);
    conversion._setPaid = false;
    conversion._refundable = true;
    conversion._isFiatConversion = false;
    conversion.save();

    campaign._n_conversions += 1;
    campaign.save();

    metadata._n_conversions +=1;
    if (campaign._type == 'ppc'){
      metadata._n_clicks +=1;
      metadata.save();
    }
  }

  return conversion as Conversion;
}

function getOrCreateVisit(eventAddress: Address, campaignAddress: Address, referrerAddress: Address, visitorAddress: Address, timeStamp: BigInt): Visit {
  let id = referrerAddress.toHex() + '-' + visitorAddress.toHex() + '-' + campaignAddress.toHex();
  let visit = Visit.load(id);

  if (visit == null){
    let referrer = getOrCreateUser(referrerAddress, timeStamp);
    let visitor = getOrCreateUser(visitorAddress, timeStamp);

    let campaign = getOrCreateCampaign(eventAddress, campaignAddress, timeStamp);
    if (campaign._n_visits == 0){
      campaign._plasmaRootNode = referrer.id;
    }
    campaign._n_visits += 1;
    campaign.save();

    let metadata = getOrCreateMetadata(eventAddress, timeStamp);
    metadata._visitCounter+=1;

    if (campaign._type == 'ppc'){
      metadata._visitCounterPpc += 1;
    }
    metadata.save();

    visit = new Visit(id);

    visit._visitor = visitor.id;
    visit._campaign = campaign.id;
    visit._referrer = referrer.id;
    visit._timeStamp = timeStamp;

  }
  visit._updatedAt = timeStamp;
  visit.save();

  return visit as Visit;
}


function getOrCreateReward(eventAddress: Address, campaignAddress: Address, userAddress: Address, timeStamp: BigInt): Reward {
  let id = campaignAddress.toHex() + '-' + userAddress.toHex();

  let reward = Reward.load(id);
  if (reward == null){
    let user = getOrCreateUser(userAddress, timeStamp);
    let campaign = getOrCreateCampaign(eventAddress, campaignAddress, timeStamp);

    reward = new Reward(id);
    reward._amount_added_wei_non_rabalanced = BigInt.fromI32(0);
    reward._amount_paid_wei_rebalanced = BigInt.fromI32(0);
    reward._user = user.id;
    reward._campaign = campaign.id;
    reward.save()
  }

  return reward as Reward;
}


function getOrCreateCampaign(eventAddress: Address, campaignAddress: Address, timeStamp: BigInt): Campaign {
  let id = campaignAddress.toHex();
  let campaign = Campaign.load(id);

  if (campaign == null){
    let metadata = getOrCreateMetadata(eventAddress, timeStamp);
    metadata._n_campaigns++;
    metadata.save();

    campaign = new Campaign(id);
    campaign._timeStamp = timeStamp;
    campaign._type = 'not-set';
    campaign._n_conversions_executed = 0;
    campaign._n_conversions_paid = 0;
    campaign._n_conversions_unpaid = 0;
    campaign._n_unique_converters = 0;
    campaign._n_conversions_approved = 0;
    campaign._n_forwarded = 0;
    campaign._n_referred = 0;
    campaign._n_conversions_rejected = 0;
    campaign._converters_addresses = [];
    campaign._n_visits = 0;
    campaign._n_joins = 0;
    campaign._n_conversions = 0;
    campaign._subgraphType = 'PLASMA';
    campaign._version = 12;
  }

  campaign._updatedTimeStamp = timeStamp;
  campaign.save();

  return campaign as Campaign;
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


export function handleReputationUpdated(event: ReputationUpdatedEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._n_reputationEvents += 1;
  metadata.save();

  let campaign = getOrCreateCampaign(event.address, event.params._campaignAddress, event.block.timestamp);
  let user = getOrCreateUser(event.params._plasmaAddress, event.block.timestamp);

  let reputation = new Reputation(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  reputation._user = user.id;
  reputation._role = event.params._role;
  reputation._type = event.params._type;
  reputation._pointsWei = event.params._points;
  reputation._campaign = campaign.id;

  reputation.save();

  if (reputation._role == 'CONTRACTOR' && reputation._type == 'MONETARY') {
    user._contractorMonetaryRep = user._contractorMonetaryRep.plus(reputation._pointsWei as BigInt);
  }
  else if (reputation._role == 'CONTRACTOR' && reputation._type == 'BUDGET') {
    user._contractorBudgetRep = user._contractorBudgetRep.plus(reputation._pointsWei as BigInt);
  }
  else if (reputation._role == 'REFERRER' && reputation._type == 'MONETARY') {
    user._referrerMonetaryRep = user._referrerMonetaryRep.plus(reputation._pointsWei as BigInt);
  }
  else if (reputation._role == 'REFERRER' && reputation._type == 'BUDGET') {
    user._referrerBudgetRep = user._referrerBudgetRep.plus(reputation._pointsWei as BigInt);
  }
  else if (reputation._role == 'CONVERTER' && reputation._type == 'MONETARY') {
    user._converterMonetaryRep = user._converterMonetaryRep.plus(reputation._pointsWei as BigInt);
  }
  else if (reputation._role == 'CONVERTER' && reputation._type == 'BUDGET') {
    user._converterBudgetRep = user._converterBudgetRep.plus(reputation._pointsWei as BigInt);
  }
  user.save();
}


export function handleFeedbackSubmitted(event: FeedbackSubmittedEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._n_feedbackEvents += 1;
  metadata.save();

  let campaign = getOrCreateCampaign(event.address, event.params._campaignAddress, event.block.timestamp);

  let user = getOrCreateUser(event.params._plasmaAddress, event.block.timestamp);
  let reporter = getOrCreateUser(event.params._reporterPlasma, event.block.timestamp);

  let feedback = new Feedback(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  feedback._user = user.id;
  feedback._reporter = reporter.id;
  feedback._role = event.params._role;
  feedback._type = event.params._type;
  feedback._pointsWei = event.params._points;
  feedback._campaign = campaign.id;

  feedback.save();

  if (feedback._role == 'CONTRACTOR') {
    user._contractorFeedbackRep = user._contractorFeedbackRep.plus(feedback._pointsWei as BigInt);
  }
  else if (feedback._role == 'REFERRER') {
    user._referrerFeedbackRep = user._referrerFeedbackRep.plus(feedback._pointsWei as BigInt);
  }
  else if (feedback._role == 'CONVERTER') {
    user._converterFeedbackRep = user._converterFeedbackRep.plus(feedback._pointsWei as BigInt);
  }
  user.save();
}


export function handleConversionPaid(event: ConversionPaidEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._n_conversions_paid += 1;
  metadata.save();

  let campaign = getOrCreateCampaign(event.address, event.params.campaignAddressPlasma, event.block.timestamp);
  campaign._n_conversions_paid += 1;
  campaign.save();

  let conversion = getOrCreateConversion(event.address, event.params.campaignAddressPlasma, event.params.conversionID, event.block.timestamp)

  conversion._paid = true;
  conversion._setPaid = true;
  conversion.save();

  let converter = getOrCreateUser(Address.fromString(conversion._participate), event.block.timestamp);
  converter._n_conversions_paid += 1;
  converter.save()
}


export function handleCPCCampaignCreated(event: CPCCampaignCreatedEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._n_ppcCampaignsCreated += 1;
  metadata.save();

  let contractor = getOrCreateUser(event.params.contractorPlasma, event.block.timestamp);

  let campaign = getOrCreateCampaign(event.address, event.params.proxyCPCCampaignPlasma, event.block.timestamp);
  campaign._type = 'ppc';
  campaign._owner = contractor.id;
  campaign.save();
}

export function handleConversionCreated(event: ConversionCreatedEvent): void {


  // let conversionId = event.params.conversionID;

  let converter = getOrCreateUser(event.params.converter, event.block.timestamp);

  converter._n_conversions += 1;
  converter.save();

  let conversion = getOrCreateConversion(event.address, event.params.campaignAddressPlasma, event.params.conversionID, event.block.timestamp)

  conversion._participate = converter.id;
  conversion.save();

  let campaign = getOrCreateCampaign(event.address, event.params.campaignAddressPlasma, event.block.timestamp);

  if (campaign._converters_addresses.indexOf(converter.id) == -1){
    let convertersAddresses = campaign._converters_addresses;
    convertersAddresses.push(converter.id);
    campaign._converters_addresses = convertersAddresses;
    campaign._n_unique_converters++;
  }

  campaign.save();

}


export function handleHandled(event: Plasma2HandleEvent): void {
  // log.debug('Handle {} Visited))))))))',['string arg']);
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._plasmaToHandleCounter = metadata._plasmaToHandleCounter + 1;

  metadata.save();

  let user = getOrCreateUser(event.params.plasma, event.block.timestamp);

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

  let referrer = getOrCreateUser(event.params.fromPlasma, event.block.timestamp);
  let visitor = getOrCreateUser(event.params.toPlasma, event.block.timestamp);

  let campaign = getOrCreateCampaign(event.address, event.params.campaignAddress, event.block.timestamp);
  campaign._n_joins++;
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

  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._joinsCounter++;
  metadata.save();

  getOrCreateVisit(event.address, event.params.campaignAddress, event.params.fromPlasma, event.params.toPlasma, event.block.timestamp);
  getOrCreateForwardByCampaign(event.address, event.params.campaignAddress, event.params.fromPlasma, event.block.timestamp);
}


export function handleVisited(event: VisitedEvent): void {
  // event.params.to            - Plamsa address
  // event.params.c             - Campaign contract on Ethereum
  // event.params.contractor    - Contractor Web3 Address
  // event.params.from          - Previous plasma Address

  getOrCreateVisit(event.address, event.params.c, event.params.from, event.params.to, event.block.timestamp);
  getOrCreateForwardByCampaign(event.address, event.params.c, event.params.from, event.block.timestamp);

}

export function handlePlasma2Ethereum(event: Plasma2EthereumEvent ): void {
  // event.params.plasma
  // event.params.eth
  // log.debug('Handle {} Plasma2EthereumEvent))))))))',['string arg']);
  // log.info('INFO - Handle {} Plasma2EthereumEvent))))))))',['string arg']);

  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._plasmaToEthereumCounter = metadata._plasmaToEthereumCounter + 1;

  metadata.save();

  let user = getOrCreateUser(event.params.plasma, event.block.timestamp);

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
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._plasmaWeb3Mapping = metadata._plasmaWeb3Mapping + 1;

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
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._handleChanged = metadata._handleChanged + 1;
  metadata.save();

  // let user = User.load(event.params.plasma.toHex());

  let user = getOrCreateUser(event.params.userPlasmaAddress, event.block.timestamp);

  user._handle = event.params.newHandle;
  user.save();
}


export function handleConversionExecuted(event: ConversionExecutedEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._conversionsExecuted += 1;


  let campaign = Campaign.load(event.params.campaignAddressPlasma.toHex());
  campaign._n_conversions_executed += 1;

  let conversion = Conversion.load(event.params.campaignAddressPlasma.toHex() + '-' + event.params.conversionID.toString());
  conversion._status = 'EXECUTED';

  if (conversion._setPaid == false || (conversion._setPaid && conversion._paid == false)){
    conversion._paid = false;
    campaign._n_conversions_unpaid += 1;
    metadata._n_conversions_unpaid += 1;
    conversion._setPaid = true;

    let converter = User.load(conversion._participate);
    converter._n_conversions_unpaid += 1;
    converter.save();
  }

  metadata.save();
  campaign.save();
  conversion.save();
}


export function handleConversionRejected(event: ConversionRejectedEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._n_conversions_rejected += 1;
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


export function handleAddedPendingRewards(event: AddedPendingRewardsEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata.save();

  let influencerPlasma = event.params.influencer;

  let reward = getOrCreateReward(event.address, event.params.contractAddress, influencerPlasma, event.block.timestamp);
  reward._amount_added_wei_non_rabalanced = reward._amount_added_wei_non_rabalanced.plus(event.params.rewards as BigInt);
  reward.save();

  let campaign = getOrCreateCampaign(event.address, event.params.contractAddress, event.block.timestamp);

  let user = getOrCreateUser(influencerPlasma, event.block.timestamp);
  if (campaign._type == 'ppc'){
    user._pending_rewards_ppc_wei_non_rebalanced = user._pending_rewards_ppc_wei_non_rebalanced.plus(reward._amount_added_wei_non_rabalanced as BigInt);
  }
  user._pending_rewards_wei_non_rebalanced = user._pending_rewards_wei_non_rebalanced.plus(reward._amount_added_wei_non_rabalanced as BigInt);
  user.save();
}

export function handlePaidPendingRewards(event: PaidPendingRewardsEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata.save();

  let ppcPaid = false;

  let campaignsPaid = event.params.campaignsPaid;
  let rewardsArray = event.params.earningsPerCampaign;

  let nRewards = rewardsArray.length;
  let nCampaigns = campaignsPaid.length;

  if (nRewards != nCampaigns) {
    return;
  }

  for (let campaignRewardIdx = 0; campaignRewardIdx < nCampaigns; campaignRewardIdx++){
    let campaign = getOrCreateCampaign(event.address, campaignsPaid[campaignRewardIdx], event.block.timestamp);
    let reward = getOrCreateReward(event.address, campaignsPaid[campaignRewardIdx], event.params.influencer, event.block.timestamp);

    reward._amount_paid_wei_rebalanced = reward._amount_paid_wei_rebalanced.plus(rewardsArray[campaignRewardIdx] as BigInt);
    reward.save();

    if (campaign._type == 'ppc'){
      ppcPaid = true;
    }
  }

  // campaignsPaid.forEach(function(campaignAddress, idx){
  //   // let reward = getOrCreateReward(campaignAddress, event.params.influencer, event.block.timestamp);
  //   // reward._amount_paid_wei = reward._amount_paid_wei.plus(event.params.amountPaid as BigInt);
  //   // reward.save();
  //   let campaign = getOrCreateCampaign(event.address, campaignAddress, event.block.timestamp);
  //   let reward = getOrCreateReward(event.address, campaignAddress, event.params.influencer, event.block.timestamp);
  //
  //   reward._amount_paid_wei = reward._amount_paid_wei.plus(rewardsArray[idx] as BigInt);
  //   reward.save();
  //
  //   if (campaign._type == 'ppc'){
  //     ppcPaid = true;
  //   }
  // });

  let user = getOrCreateUser(event.params.influencer, event.block.timestamp);

  user._paid_rewards_wei_non_rebalanced = user._paid_rewards_wei_non_rebalanced.plus(event.params.nonRebalancedRewards as BigInt);
  user._paid_rewards_wei_rebalanced = user._paid_rewards_wei_rebalanced.plus(event.params.rewards as BigInt);

  if (ppcPaid){
    user._paid_rewards_ppc_wei_non_rebalanced = user._paid_rewards_ppc_wei_non_rebalanced.plus(event.params.nonRebalancedRewards as BigInt);
    user._paid_rewards_ppc_wei_rebalanced = user._paid_rewards_ppc_wei_rebalanced.plus(event.params.rewards as BigInt);
  }
  user.save();
}

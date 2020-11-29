import {
  ReputationUpdated as ReputationUpdatedEvent,
  FeedbackSubmitted as FeedbackSubmittedEvent
} from "../generated/TwoKeyPlasmaReputationRegistry/TwoKeyPlasmaReputationRegistry"

import {
  User, Meta, Debug, Reputation, Feedback, Campaign
} from "../generated/schema"

import {
  Address, BigInt, ethereum
 } from '@graphprotocol/graph-ts'


function getOrCreateCampaign(campaignAddress: Address, event: ethereum.Event): Campaign {
  let id = campaignAddress.toHex();

  let campaign = Campaign.load(id);

  if (campaign == null){
    let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
    metadata._n_campaigns++;
    metadata.save();

    campaign = new Campaign(id);
  }

  campaign.save();

  return campaign as Campaign;
}


function getOrCreateMetadata(eventAddress: Address, timeStamp: BigInt): Meta {
  let id = 'Meta';

  let metadata = Meta.load(id);
  if (metadata == null){
    metadata = new Meta(id);
    metadata._contracts = [];
    metadata._n_reputationEvents = 0;
    metadata._n_feedbackEvents = 0;
    metadata._n_campaigns = 0;
    metadata._version = 11;
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


function getOrCreateUser(userAddress: Address, event: ethereum.Event): User {
  let id = userAddress.toHex();
  let user = User.load(id);

  if (user == null){
    user = new User(id);
    user._contractorMonetaryRep = BigInt.fromI32(0);
    user._contractorBudgetRep = BigInt.fromI32(0);
    user._contractorFeedbackRep = BigInt.fromI32(0);
    user._referrerMonetaryRep = BigInt.fromI32(0);
    user._referrerBudgetRep = BigInt.fromI32(0);
    user._referrerFeedbackRep = BigInt.fromI32(0);
    user._converterMonetaryRep = BigInt.fromI32(0);
    user._converterBudgetRep = BigInt.fromI32(0);
    user._converterFeedbackRep = BigInt.fromI32(0);
    user._signupRep = BigInt.fromI32(0);
    user._timeStamp = event.block.timestamp;
    user._updatedAt = event.block.timestamp;
    user.save();
  }

  return user as User;
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


function getOrCreateFeedback(event: ethereum.Event): Feedback {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let feedback = Feedback.load(id);

  if (feedback == null){
    let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
    metadata._n_feedbackEvents++;
    metadata.save();

    feedback = new Feedback(id);
  }

  feedback.save();

  return feedback as Feedback;
}

function getOrCreateReputation(event: ethereum.Event): Reputation {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let reputation = Reputation.load(id);

  if (reputation == null){
    let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
    metadata._n_reputationEvents++;
    metadata.save();

    reputation = new Reputation(id);
  }

  reputation.save();

  return reputation as Reputation;
}

export function handleReputationUpdated(event: ReputationUpdatedEvent): void {
  let campaign = getOrCreateCampaign(event.params._campaignAddress, event);
  let user = getOrCreateUser(event.params._plasmaAddress, event);

  let reputation = getOrCreateReputation(event);

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
  else if (reputation._role == '' && reputation._type == 'SIGNUP'){
    user._signupRep = user._signupRep.plus(reputation._pointsWei as BigInt);
  }
  user.save();
}


export function handleFeedbackSubmitted(event: FeedbackSubmittedEvent): void {
  let campaign = getOrCreateCampaign(event.params._campaignAddress, event);

  let user = getOrCreateUser(event.params._plasmaAddress, event);
  let reporter = getOrCreateUser(event.params._reporterPlasma, event);

  let feedback = getOrCreateFeedback(event);

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

import {
  AddedPendingRewards as AddedPendingRewardsEvent,
  PaidPendingRewards as PaidPendingRewardsEvent,
  PaidPendingRewards1 as PaidPendingRewardsDepEvent,
  CPCCampaignCreated as CPCCampaignCreatedEvent,
} from "../generated/TwoKeyPlasmaEventSource/TwoKeyPlasmaEventSource"


import {
  Campaign, User, Meta, Reward
} from "../generated/schema"

import {
  Address, BigInt, ethereum
 } from '@graphprotocol/graph-ts'


function getOrCreateMetadata(eventAddress: Address, timeStamp: BigInt): Meta {
  let id = 'Meta';

  let metadata = Meta.load(id);
  if (metadata == null){
    metadata = new Meta(id);
    metadata._contracts = [];
    metadata._n_addPendingRewards = 0;
    metadata._n_paidPendingRewards = 0;
    metadata._n_paidPendingRewardsDep = 0;
    metadata._subgraphType = 'PLASMA';
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


function getOrCreateUser(userAddress: Address, timeStamp: BigInt): User {
  let id = userAddress.toHex();
  let user = User.load(id);

  if (user == null){
    user = new User(id);
    user._pending_rewards_wei_non_rebalanced = BigInt.fromI32(0);
    user._pending_rewards_ppc_wei_non_rebalanced = BigInt.fromI32(0);
    user._paid_rewards_wei_rebalanced = BigInt.fromI32(0);
    user._paid_rewards_wei_non_rebalanced = BigInt.fromI32(0);
    user._paid_rewards_ppc_wei_rebalanced = BigInt.fromI32(0);
    user._paid_rewards_ppc_wei_non_rebalanced = BigInt.fromI32(0);
    user._timeStamp = timeStamp;
    user._updatedAt = timeStamp;
    user.save();
  }

  return user as User;
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
    metadata.save();

    campaign = new Campaign(id);
    campaign._timeStamp = timeStamp;
    campaign._type = 'not-set';
    campaign._subgraphType = 'PLASMA';
    campaign._version = 13;
  }

  campaign._updatedTimeStamp = timeStamp;
  campaign.save();

  return campaign as Campaign;
}


export function handleCPCCampaignCreated(event: CPCCampaignCreatedEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata.save();

  let contractor = getOrCreateUser(event.params.contractorPlasma, event.block.timestamp);

  let campaign = getOrCreateCampaign(event.address, event.params.proxyCPCCampaignPlasma, event.block.timestamp);
  campaign._type = 'ppc';
  campaign.save();
}


export function handleAddedPendingRewards(event: AddedPendingRewardsEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._n_addPendingRewards += 1;
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
  metadata._n_paidPendingRewards += 1;
  metadata.save();

  // let debug = Debug.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  // if (debug == null){
  //   debug = new Debug(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  //   debug._info = event.transaction.hash.toHex();
  //   debug.save();
  // }

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

  let user = getOrCreateUser(event.params.influencer, event.block.timestamp);

  user._paid_rewards_wei_non_rebalanced = user._paid_rewards_wei_non_rebalanced.plus(event.params.nonRebalancedRewards as BigInt);
  user._paid_rewards_wei_rebalanced = user._paid_rewards_wei_rebalanced.plus(event.params.rewards as BigInt);

  if (user._pending_rewards_wei_non_rebalanced <= event.params.nonRebalancedRewards){
    user._pending_rewards_wei_non_rebalanced = BigInt.fromI32(0);
  }
  else{
    user._pending_rewards_wei_non_rebalanced = user._pending_rewards_wei_non_rebalanced.minus(event.params.nonRebalancedRewards as BigInt);
  }

  if (ppcPaid){
    if (user._pending_rewards_ppc_wei_non_rebalanced <= event.params.nonRebalancedRewards){
      user._pending_rewards_ppc_wei_non_rebalanced = BigInt.fromI32(0);
    }
    else{
      user._pending_rewards_ppc_wei_non_rebalanced = user._pending_rewards_ppc_wei_non_rebalanced.minus(event.params.nonRebalancedRewards as BigInt);
    }

    user._paid_rewards_ppc_wei_non_rebalanced = user._paid_rewards_ppc_wei_non_rebalanced.plus(event.params.nonRebalancedRewards as BigInt);
    user._paid_rewards_ppc_wei_rebalanced = user._paid_rewards_ppc_wei_rebalanced.plus(event.params.rewards as BigInt);
  }

  user.save();
}


export function handlePaidPendingRewardsDep(event: PaidPendingRewardsDepEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  metadata._n_paidPendingRewardsDep += 1;
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

  let user = getOrCreateUser(event.params.influencer, event.block.timestamp);

  user._paid_rewards_wei_non_rebalanced = user._paid_rewards_wei_non_rebalanced.plus(event.params.nonRebalancedRewards as BigInt);
  user._paid_rewards_wei_rebalanced = user._paid_rewards_wei_rebalanced.plus(event.params.rewards as BigInt);

  if (user._pending_rewards_wei_non_rebalanced <= event.params.nonRebalancedRewards){
    user._pending_rewards_wei_non_rebalanced = BigInt.fromI32(0);
  }
  else{
    user._pending_rewards_wei_non_rebalanced = user._pending_rewards_wei_non_rebalanced.minus(event.params.nonRebalancedRewards as BigInt);
  }

  if (ppcPaid){
    if (user._pending_rewards_ppc_wei_non_rebalanced <= event.params.nonRebalancedRewards){
      user._pending_rewards_ppc_wei_non_rebalanced = BigInt.fromI32(0);
    }
    else{
      user._pending_rewards_ppc_wei_non_rebalanced = user._pending_rewards_ppc_wei_non_rebalanced.minus(event.params.nonRebalancedRewards as BigInt);
    }

    user._paid_rewards_ppc_wei_non_rebalanced = user._paid_rewards_ppc_wei_non_rebalanced.plus(event.params.nonRebalancedRewards as BigInt);
    user._paid_rewards_ppc_wei_rebalanced = user._paid_rewards_ppc_wei_rebalanced.plus(event.params.rewards as BigInt);
  }

  user.save();
}

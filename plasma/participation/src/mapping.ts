import {
  RewardsAssignedToUserInParticipationMiningEpoch as RewardsAssignedToUserInParticipationMiningEpochEvent,
  EpochDeclared as EpochDeclaredEvent,
  EpochRegistered as EpochRegisteredEvent,
  EpochFinalized as EpochFinalizedEvent
} from "../generated/TwoKeyPlasmaEventSource/TwoKeyPlasmaEventSource"


import {
  Meta, User, Epoch, ParticipationMiningReward
} from "../generated/schema"


import {
  Address, BigInt, ethereum
 } from '@graphprotocol/graph-ts'


function getOrCreateMetadata(eventAddress: Address, event: ethereum.Event): Meta {
  let id = 'Meta';

  let metadata = Meta.load(id);
  if (metadata == null){
    metadata = new Meta(id);
    metadata._contracts = [];
    metadata._version = 11;
    metadata._timeStamp = event.block.timestamp;
  }

  metadata._updatedAt = event.block.timestamp;

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
    user._timeStamp = event.block.timestamp;
    user._updatedAt = event.block.timestamp;
    user.save();
  }

  return user as User;
}


export function getOrCreateEpoch(epochId: BigInt, event: ethereum.Event): Epoch {
  let id = epochId.toString();
  let epoch = Epoch.load(id);

  if (epoch == null){
    epoch = new Epoch(id);
    epoch._registered = false;
    epoch._nUsers = BigInt.fromI32(0);
    epoch._declared = false;
    epoch._finalized = false;
    epoch._timeStamp = event.block.timestamp;
  }

  epoch._updatedAt = event.block.timestamp;
  epoch.save();

  return epoch as Epoch;
}


export function getOrCreateParticipationMiningReward(userAddress: Address, epochId: BigInt, event: ethereum.Event): ParticipationMiningReward {
  let id = userAddress.toHex() + '-' + epochId.toString();
  let participationMiningReward = ParticipationMiningReward.load(id);

  if (participationMiningReward == null){
    let epoch = getOrCreateEpoch(epochId, event);
    let user = getOrCreateUser(userAddress, event);

    participationMiningReward = new ParticipationMiningReward(id);
    participationMiningReward._timeStamp = event.block.timestamp;
    participationMiningReward._epoch = epoch.id;
    participationMiningReward._user = user.id;
  }

  participationMiningReward.save();

  return participationMiningReward as ParticipationMiningReward;
}

export function handleEpochDeclared(event: EpochDeclaredEvent): void {
  let epoch = getOrCreateEpoch(event.params.epochId, event);
  epoch._declared = true;
  epoch.save();
}

export function handleEpochRegistered(event: EpochRegisteredEvent): void {
  let epoch = getOrCreateEpoch(event.params.epochId, event);
  epoch._registered = true;
  epoch._nUsers = event.params.numberOfUsers;
  epoch.save();
}

export function handleEpochFinalized(event: EpochFinalizedEvent): void {
  let epoch = getOrCreateEpoch(event.params.epochId, event);
  epoch._finalized = true;
  epoch.save();
}


export function handleRewardsAssignedToUserInParticipationMiningEpoch(event: RewardsAssignedToUserInParticipationMiningEpochEvent): void {
  let epochId = event.params.epochId;
  let userAddress = event.params.user;

  let participationMiningReward = getOrCreateParticipationMiningReward(userAddress, epochId, event);
  participationMiningReward._rewardsWei = event.params.reward2KeyWei;

  participationMiningReward.save();
}

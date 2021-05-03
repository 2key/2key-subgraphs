import {
  Withdraw as WithdrawEvent,
  Deposit as DepositEvent
} from "../generated/Farm/Farm"

import {
  User, Meta, WithdrawEntity, DepositEntity
} from "../generated/schema"

import {
  Address, BigInt, ethereum, log, BigDecimal,
 } from '@graphprotocol/graph-ts'


function getOrCreateMetadata(eventAddress: Address, timeStamp: BigInt): Meta {
  let id = 'Meta';

  let metadata = Meta.load(id);
  if (metadata == null){
    metadata = new Meta(id);
    metadata._contracts = [];
    metadata._version = 0;
    metadata._withdrawCounter = new BigDecimal(BigInt.fromString('0'));
    metadata._depositCounter = new BigDecimal(BigInt.fromString('0'));
    metadata._netStaked = BigInt.fromI32(0);
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
    user._timeStamp = event.block.timestamp;
    user._updatedAt = event.block.timestamp;
    user.save();
  }

  return user as User;
}


export function handleWithdraw(event: WithdrawEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);

  let user = getOrCreateUser(event.params.user, event);
  metadata._withdrawCounter = metadata._withdrawCounter.plus(new BigDecimal(BigInt.fromString('1')));
  metadata._netStaked = metadata._netStaked.minus(event.params.amount as BigInt);
  metadata.save();


  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  let withdraw = new WithdrawEntity(id);

  withdraw._user = user.id;
  withdraw._amount = event.params.amount;
  withdraw._pid = event.params.pid;
  withdraw._timeStamp = event.block.timestamp;
  withdraw._updatedAt = event.block.timestamp;
  withdraw.save();
}


export function handleDeposit(event: DepositEvent): void {
  let metadata = getOrCreateMetadata(event.address, event.block.timestamp);
  let user = getOrCreateUser(event.params.user, event);
  metadata._depositCounter = metadata._depositCounter.plus(new BigDecimal(BigInt.fromString('1')));
  metadata._netStaked = metadata._netStaked.plus(event.params.amount as BigInt);
  metadata.save();

  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let deposit = new DepositEntity(id);

  deposit._user = user.id;
  deposit._amount = event.params.amount;
  deposit._pid = event.params.pid;
  deposit._timeStamp = event.block.timestamp;
  deposit._updatedAt = event.block.timestamp;

  deposit.save();
}

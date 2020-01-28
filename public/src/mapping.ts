import {log, Address, EthereumEvent, EthereumBlock, BigInt} from '@graphprotocol/graph-ts'
import {SetInitialParamsCall} from '../generated/Contract/TwoKeyEventSource'

import {
  Joined as JoinedEvent,
  Rewarded as RewardedEvent,
  DonationCampaignCreated,
  AcquisitionCampaignCreated,
  TwoKeyEventSource,
  UserRegistered as UserRegisteredEvent,
  ConvertedAcquisition as ConvertedAcquisitionEvent,
  ConvertedDonation as ConvertedDonationEvent,
  Rejected as RejectedEvent,
  Executed as ExecutedEvent,
  PriceUpdated as PriceUpdatedEvent,
  CPCCampaignCreated as CPCCampaignCreatedEvent,
  Debt as DebtEvent,
  ReceivedTokensDeepFreezeTokenPool as TokenPoolFeeEvent,
  ReceivedTokensAsModerator as ModeratorFeeEvent

} from "../generated/Contract/TwoKeyEventSource"


import {
    Meta,
    Variable,
    Campaign,
    Conversion,
    ConversionByTxHash,
    Fee,
    User,
    Join,
    Reward,
    Debug,
    ConCampUser,
    UserReg,
    PriceUpdated,
    Rate,
    Event
} from "../generated/schema"


function createMetadata(eventAddress: Address, timeStamp: BigInt): void {
  let metadata = Meta.load(eventAddress.toHex());
  if (metadata == null){
    metadata = new Meta(eventAddress.toHex());
    metadata._convertedAcquisitionCounter = 0;
    metadata._convertedDonationCounter = 0;
    metadata._totalDebtAdded = BigInt.fromI32(0);
    metadata._totalDebtRemoved = BigInt.fromI32(0);
    metadata._n_debtAdded = 0;
    metadata._n_debtRemoved = 0;
    metadata._donationCampaignCreatedCounter = 0;
    metadata._acquisitionCampaignCreatedCounter = 0;
    metadata._subgraphType = 'PUBLIC';
    metadata._total_rewards_amount = BigInt.fromI32(0);
    metadata._n_conversions = 0;
    metadata._total_conversions_amount = BigInt.fromI32(0);
    metadata._createdCounter = 0;
    metadata._convertedCounter = 0;
    metadata._joinedCounter = 0;
    metadata._rewardedCounter = 0;
    metadata._rejectedCounter = 0;
    metadata._cpcCampaignCreatedCounter = 0;
    metadata._executedCounter = 0;
    metadata._version = 2;
    metadata._userRegisteredCounter = 0;
    metadata._n_moderatorFee = 0;
    metadata._n_tokenPoolFee = 0;
    metadata._totalTokenPoolFee = BigInt.fromI32(0);
    metadata._totalModeratorFee = BigInt.fromI32(0);
    metadata._timeStamp = timeStamp;
    metadata._updatedTimeStamp = timeStamp;
    metadata.save();

    let metaVariable = new Variable('Meta');
    metaVariable._variableId = eventAddress.toHex()
    metaVariable.save();
  }
}


function createCampaignObject(campaignAddress: Address, timeStamp: BigInt): void {
  let campaign = Campaign.load(campaignAddress.toHex());
  if (campaign == null){
    campaign = new Campaign(campaignAddress.toHex());
    campaign._timeStamp = timeStamp;
    campaign._subgraphType = 'PUBLIC';
    campaign._updatedTimeStamp = timeStamp;
    campaign._version = 11;
    campaign._n_conversions_executed = 0;
    campaign._n_conversions = 0;
    campaign._n_conversions_rejected = 0;
    campaign._n_joined = 0;
    campaign._n_rewards = 0;
    campaign._total_conversions_amount = BigInt.fromI32(0);
    campaign._n_conversions_approved = 0;
    campaign._total_rewards_amount = BigInt.fromI32(0);
    campaign._converters_addresses = [];
    campaign._n_unique_converters = 0;
    campaign.save();
  }
}

function createConversionObject(conversionId: BigInt, participant: Address,campaignAddress: Address, timeStamp: BigInt): void {
  let campaign = Campaign.load(campaignAddress.toHex());
  let conversion = Conversion.load(campaign.id + '-' + conversionId.toString());
  let converter = User.load(participant.toHex());
  if (conversion == null){
    conversion = new Conversion(campaign.id + '-'+ conversionId.toString());
    conversion._timeStamp = timeStamp;
    conversion._participate = converter.id;
    conversion._subgraphType = 'PUBLIC';
    conversion._updatedTimeStamp = timeStamp;
    conversion._version = 10;
    conversion._fiatAmountSpent = BigInt.fromI32(0);
    conversion._ethAmountSpent = BigInt.fromI32(0);
    conversion._tokens = BigInt.fromI32(0);
    conversion._campaign = campaign.id;
    conversion._status = 'PENDING';
    conversion._refundable = true;
    conversion._isFiatConversion = false;
    conversion._conversionId = conversionId;
    conversion.save();
  }
}


function createEventObject(event: EthereumEvent, eventType: string, notes: string): void {
  let inputEvent = Event.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  if (inputEvent == null){
    inputEvent = new Event(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    inputEvent._address = event.address;
    inputEvent._timeStamp = event.block.timestamp;
    inputEvent._tx_hash = event.transaction.hash.toHex();
    inputEvent._type = eventType;
    inputEvent._notes = notes;
    inputEvent.save();
  }
}

function createUserObject(eventAddress: Address, userAddress: Address, timeStamp: BigInt): void {
  let user = User.load(userAddress.toHex());
  if (user == null){
    user = new User(userAddress.toHex());
    user._timeStamp = timeStamp;
    user._totalDebtAdded = BigInt.fromI32(0);
    user._totalDebtRemoved = BigInt.fromI32(0);
    user._n_debtAdded = 0;
    user._n_debtRemoved = 0;
    user._subgraphType = 'PUBLIC';
    user._updatedTimeStamp = timeStamp;
    user._version = 0;
    user._n_rewards = 0;
    user._total_rewards_amount = BigInt.fromI32(0);
    user._n_conversions = 0;
    user._n_conversions_rejected = 0;
    user._n_conversions_approved = 0;
    user._n_conversions_executed = 0;
    user._total_conversions_amount = BigInt.fromI32(0);
    user.save();
  }

  let twoKeyEventSource = TwoKeyEventSource.bind(eventAddress);
  let web3Address = twoKeyEventSource.ethereumOf(userAddress);

  if (web3Address != userAddress){
    user._web3Address = web3Address;
    user._updatedTimeStamp = timeStamp;
  }
  user.save();
}



export function handlePriceUpdated(event: PriceUpdatedEvent): void {
  createEventObject(event, 'PriceUpdated','');
  let priceUpdated = PriceUpdated.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  if(priceUpdated == null){
    priceUpdated = new PriceUpdated(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    priceUpdated._caller = event.params._updater;
    priceUpdated._rate = event.params.newRate;
    priceUpdated._currency = event.params._currency.toString();
    priceUpdated._timeStamp = event.params._timestamp;
    priceUpdated._txHash = event.transaction.hash;
    priceUpdated._block = event.block.number;
    priceUpdated.save();
  }

  let rate = Rate.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  if (rate == null){
    rate = new Rate(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    let currencyString = event.params._currency.toString();
    let seperator = currencyString.indexOf('-');
    if(seperator > 0){
      rate._from = currencyString.substring(0, seperator);
      rate._to = currencyString.substring(seperator + 1, currencyString.length);
    }
    else{
      rate._from = 'ETH';
      rate._to = currencyString;
    }
    rate._rate = event.params.newRate;
    rate._timeStamp = event.block.timestamp;
    rate._maintainer = event.params._updater;
    rate._event = priceUpdated.id;
    rate.save();
  }
}

// export function handleBlock(block: EthereumBlock): void{
//   let metadata = Meta.load(Variable.load('Meta')._variableId);
//
//   if (metadata == null){
//     return;
//   }
//   metadata._lastBlock = block.number;
//   metadata.save();
// }


export function handleRejected(event: RejectedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._rejectedCounter++;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();


  createCampaignObject(event.params._campaign, event.block.timestamp);
  createUserObject(event.address, event.params._converter, event.block.timestamp);

  let user = User.load(event.params._converter.toHex());

  let campaign = Campaign.load(event.params._campaign.toHex());

  let conversionsForCampaignBySpecificUser = ConCampUser.load(campaign.id+'-'+user.id);
  if(conversionsForCampaignBySpecificUser == null){
    let deb = new Debug(event.block.number.toString()+'-'+event.transaction.hash.toHexString()+'conCampUser');
    deb._reason = 'conCampUser not exist for this campaign and user';
    deb._campaign = campaign.id;
    deb._user = user.id;
    deb.save();
  }
  else{
    let conversions = conversionsForCampaignBySpecificUser._conversions;
    for (let i = 0;i < conversions.length;i++){
      let conversionId = conversions[i].toString();
      let conversion = Conversion.load(campaign.id+'-'+conversionId);

      if (conversion != null){
        conversion._status = 'REJECTED';
        conversion.save();

        user._n_conversions_rejected++;
        campaign._n_conversions_rejected++;
      }
      else{
        let deb = new Debug(event.block.number.toString()+'-'+event.transaction.hash.toHexString()+'conversions');
        deb._reason = 'conversion id '+conversionId+' for that campaign does not exist';
        deb._campaign = campaign.id;
        deb.save();
      }
    }
    campaign.save();
    user.save();
  }
}

export function handleExecuted(event: ExecutedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._executedCounter++;
  metadata._updatedTimeStamp = event.block.timestamp;


  let campaign = Campaign.load(event.params.campaignAddress.toHex());
  campaign._n_conversions_executed++;

  //Added here creation because part of the users are still from the time we save them as web3.
  createUserObject(event.address, event.params.converterPlasmaAddress, event.block.timestamp);
  let user = User.load(event.params.converterPlasmaAddress.toHex());
  user._n_conversions_executed++;

  let conversion = Conversion.load(campaign.id +'-'+event.params.conversionId.toString());
  if (conversion == null){
    log.debug(
        'converter null in executedEvent',
        [

        ]
    );
    return;
  }

  conversion._status = 'EXECUTED';
  conversion._tokens = event.params.tokens;
  conversion._version = 2;
  conversion._refundable = false;
  conversion._execution_tx_hash = event.transaction.hash;
  conversion.save();


  let conversionByTxHash = new ConversionByTxHash(event.transaction.hash.toHex());
  conversionByTxHash._conversion = conversion.id;
  conversionByTxHash.save();


  if (campaign._converters_addresses.indexOf(user.id) == -1){
    let convertersAddresses = campaign._converters_addresses;
    convertersAddresses.push(user.id);
    campaign._converters_addresses = convertersAddresses;
    campaign._n_unique_converters++;
  }

  let conversionEthWei = conversion._ethAmountSpent;
  let campaignTotalConversionAmount = campaign._total_conversions_amount;
  campaign._total_conversions_amount = campaignTotalConversionAmount.plus(conversionEthWei as BigInt);
  campaign.save();

  let userTotalConversionAmount = user._total_conversions_amount;
  user._total_conversions_amount = userTotalConversionAmount.plus(conversionEthWei as BigInt);
  user.save();

  let metaTotalConversionAmount = metadata._total_conversions_amount;
  metadata._total_conversions_amount = metaTotalConversionAmount.plus(conversionEthWei as BigInt);
  metadata.save();
}


export function handleUserRegistered(event: UserRegisteredEvent): void{
  createEventObject(event, 'UserRegistered','');
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._userRegisteredCounter++;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();

  let twoKeyEventSource = TwoKeyEventSource.bind(event.address);

  let userReg = new UserReg(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  userReg._address = event.params._address;
  userReg._email = event.params._email;
  userReg._fullName = event.params._fullName;
  userReg._walletName = event.params._username_walletName;
  userReg._name = event.params._name;
  userReg._timeStamp = event.block.timestamp;
  userReg._tx_hash = event.transaction.hash.toHexString();
  userReg._web3 = twoKeyEventSource.ethereumOf(event.params._address);
  userReg.save();


  createUserObject(event.address, event.params._address, event.block.timestamp);

  let user = User.load(event.params._address.toHex());

  user._name = event.params._name;
  user._fullName = event.params._fullName;
  user._walletName = event.params._username_walletName;
  user._email = event.params._email;
  user._updatedTimeStamp = event.block.timestamp;
  user._version = 0;
  user._event = userReg.id;
  user.save();
}

export function handleConvertedAcquisition(event: ConvertedAcquisitionEvent): void{
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._convertedAcquisitionCounter++;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();


  let campaign = Campaign.load(event.params._campaign.toHex());
  let conversionId = event.params._conversionId;
  let converterPlasmaAddress = event.params._converterPlasma;

  createConversionObject(conversionId, converterPlasmaAddress, event.params._campaign, event.block.timestamp);
  let acquisitionConversion = Conversion.load(campaign.id + '-' + conversionId.toString());

  createUserObject(event.address, converterPlasmaAddress, event.block.timestamp);
  let converter = User.load(converterPlasmaAddress.toHex());

  acquisitionConversion._campaignType = 'Acquisition';
  acquisitionConversion._isFiatConversion = (event.params._isFiatConversion ? true : false);

  converter._n_conversions++;
  campaign._n_conversions++;

  if(acquisitionConversion._isFiatConversion == false){
    //Eth conversion
    acquisitionConversion._status = 'APPROVED';
    acquisitionConversion._ethAmountSpent = event.params._conversionAmount;
    campaign._n_conversions_approved++;
    converter._n_conversions_approved++;
  }
  else{
    acquisitionConversion._fiatAmountSpent = event.params._conversionAmount;
  }

  acquisitionConversion._participate = converter.id;
  acquisitionConversion._conversionId = event.params._conversionId;
  acquisitionConversion._campaign = campaign.id;

  acquisitionConversion.save();

  campaign._updatedTimeStamp = event.block.timestamp;
  campaign.save();

  converter._updatedTimeStamp = event.block.timestamp;
  converter.save();

  let conversionByCampaignUser = ConCampUser.load(campaign.id +'-'+ converter.id);
  if (conversionByCampaignUser == null){
    conversionByCampaignUser = new ConCampUser(campaign.id +'-'+ converter.id);
    conversionByCampaignUser._conversions = [conversionId];
    conversionByCampaignUser.save();
  }
  else{
    let conversionCampaignUserArray = conversionByCampaignUser._conversions;
    conversionCampaignUserArray.push(conversionId);
    conversionByCampaignUser._conversions = conversionCampaignUserArray;
    conversionByCampaignUser.save();
  }
}

export function handleConvertedDonation(event: ConvertedDonationEvent): void{
    createMetadata(event.address, event.block.timestamp);
    let metadata = Meta.load(event.address.toHex());
    metadata._convertedDonationCounter++;
    metadata._updatedTimeStamp = event.block.timestamp;
    metadata.save();

    let campaign = Campaign.load(event.params._campaign.toHex());
    let conversionId = event.params._conversionId;
    let converterPlasmaAddress = event.params._converterPlasma;

    createConversionObject(conversionId, converterPlasmaAddress, event.params._campaign, event.block.timestamp);
    let donationConversion = Conversion.load(campaign.id + '-' + conversionId.toString());


    createUserObject(event.address, converterPlasmaAddress, event.block.timestamp);
    let converter = User.load(converterPlasmaAddress.toHex());

    campaign._n_conversions++;
    campaign._n_conversions_approved++;
    campaign._updatedTimeStamp = event.block.timestamp;
    campaign.save();

    converter._n_conversions++;
    converter._n_conversions_approved++;
    converter._updatedTimeStamp = event.block.timestamp;
    converter.save();

    donationConversion._campaignType = 'Donation';
    donationConversion._status = 'APPROVED';
    donationConversion._ethAmountSpent = event.params._conversionAmount;
    donationConversion._participate = converter.id;
    donationConversion._conversionId = event.params._conversionId;
    donationConversion.save();

    let conversionByCampaignUser = ConCampUser.load(campaign.id +'-'+ converter.id);
    if (conversionByCampaignUser == null){
      conversionByCampaignUser = new ConCampUser(campaign.id +'-'+ converter.id);
      conversionByCampaignUser._conversions = [conversionId];
      conversionByCampaignUser.save();
    }
    else{
        let conversionCampaignUserArray = conversionByCampaignUser._conversions;
        conversionCampaignUserArray.push(conversionId);
        conversionByCampaignUser._conversions = conversionCampaignUserArray;
        conversionByCampaignUser.save();
    }
}

export function handleDonation(event: DonationCampaignCreated): void {
  createEventObject(event, 'DonationCampaignCreated',event.params.contractor.toHex()+'-'+event.params.proxyDonationCampaign.toHex());
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._donationCampaignCreatedCounter++;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();

  createUserObject(event.address, event.params.contractor, event.block.timestamp);

  let contractor = User.load(event.params.contractor.toHex());

  createCampaignObject(event.params.proxyDonationCampaign,event.block.timestamp);
  let newCampaign = Campaign.load(event.params.proxyDonationCampaign.toHex());
  newCampaign._conversionHandler = event.params.proxyDonationConversionHandler;
  newCampaign._owner = contractor.id;
  newCampaign._logicHandler = event.params.proxyDonationLogicHandler;
  newCampaign._type = "Donation";
  newCampaign.save()
}

export function handleCPCCampaignCreated(event: CPCCampaignCreatedEvent): void {
  createEventObject(event, 'CPCCampaignCreated',event.params.contractor.toHex()+'-'+event.params.proxyCPCCampaign.toHex());
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._cpcCampaignCreatedCounter++;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();

  createUserObject(event.address, event.params.contractor, event.block.timestamp);

  let contractor = User.load(event.params.contractor.toHex());

  createCampaignObject(event.params.proxyCPCCampaign,event.block.timestamp);
  let newCampaign = Campaign.load(event.params.proxyCPCCampaign.toHex());
  // newCampaign._conversionHandler = event.params.proxyDonationConversionHandler;
  newCampaign._owner = contractor.id;
  // newCampaign._logicHandler = event.params.proxyDonationLogicHandler;
  newCampaign._type = "Cpc";
  newCampaign.save()
}

export function handleAcquisition(event: AcquisitionCampaignCreated): void {
  createEventObject(event, 'AcquisitionCampaignCreated', event.params.contractor.toHex()+'-'+event.params.proxyAcquisitionCampaign.toHex());
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._acquisitionCampaignCreatedCounter++;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();


  createUserObject(event.address, event.params.contractor, event.block.timestamp);

  let contractor = User.load(event.params.contractor.toHex());

  createCampaignObject(event.params.proxyAcquisitionCampaign,event.block.timestamp);
  let newCampaign = Campaign.load(event.params.proxyAcquisitionCampaign.toHex());
  newCampaign._purchasesHandler = event.params.proxyPurchasesHandler;
  newCampaign._conversionHandler = event.params.proxyConversionHandler;
  newCampaign._logicHandler = event.params.proxyLogicHandler;
  newCampaign._owner = contractor.id;
  newCampaign._type = "Acquisition";
  newCampaign.save();
}

export function handleJoined(event: JoinedEvent): void {
  createEventObject(event, 'Joined','');
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._joinedCounter++;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();

  createUserObject(event.address, event.params._to ,event.block.timestamp);
  let joiner = User.load(event.params._to.toHex());

  createUserObject(event.address, event.params._from, event.block.timestamp);
  let referrer = User.load(event.params._from.toHex());

  createCampaignObject(event.params._campaign,event.block.timestamp);
  let campaign = Campaign.load(event.params._campaign.toHex());
  campaign._n_joined++;
  campaign.save();

  let join = new Join(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  join._campaign = campaign.id;
  join._from = referrer.id;
  join._to = joiner.id;
  join._timeStamp = event.block.timestamp;
  join._updatedTimeStamp = event.block.timestamp;
  join.save()
}

export function handleRewarded(event: RewardedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._rewardedCounter++;
  metadata._updatedTimeStamp = event.block.timestamp;

  let newReward = new Reward(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  let campaign = Campaign.load(event.params._campaign.toHex());
  let rewardAmount = event.params._amount;
  let user = User.load(event.params._to.toHex());

  campaign._n_rewards++;
  let campaignTotalRewarsAmount = campaign._total_rewards_amount;
  campaign._total_rewards_amount = campaignTotalRewarsAmount.plus(rewardAmount);
  campaign.save();

  user._n_rewards++;
  let userTotalRewarsAmount = user._total_rewards_amount;
  user._total_rewards_amount = userTotalRewarsAmount.plus(rewardAmount);
  user.save();

  let metaTotalRewardsAmount = metadata._total_rewards_amount;
  metadata._total_rewards_amount = metaTotalRewardsAmount.plus(rewardAmount);
  metadata.save();

  newReward._campaign = campaign.id;
  newReward._user = user.id;
  newReward._amount = rewardAmount;
  newReward._timeStamp = event.block.timestamp;
  newReward._updatedTimeStamp = event.block.timestamp;
  newReward.save();
}


export function handleDebt(event: DebtEvent): void {
  createMetadata(event.address, event.block.timestamp);
  createUserObject(event.address, event.params.plasmaAddress, event.block.timestamp);

  let fee = new Fee(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  fee._addition = event.params.addition;
  fee._weiAmount = event.params.weiAmount;
  fee._type = 'Debt';

  let user = User.load(event.params.plasmaAddress.toHex());
  fee._user = user.id;
  fee.save();

  let metadata = Meta.load(event.address.toHex());


  if (fee._addition){
    let userDebtAdded = user._totalDebtAdded;
    user._totalDebtAdded = userDebtAdded.plus(event.params.weiAmount);
    user._n_debtAdded += 1;

    let metadataDebtAdded = metadata._totalDebtAdded;
    metadata._totalDebtAdded = metadataDebtAdded.plus(event.params.weiAmount);
    metadata._n_debtAdded += 1;
  }
  else{
    let userDebtRemoved = user._totalDebtRemoved;
    user._totalDebtRemoved = userDebtRemoved.plus(event.params.weiAmount);
    user._n_debtRemoved += 1;
    let metadataDebtRemoved = metadata._totalDebtRemoved;
    metadata._totalDebtRemoved = metadataDebtRemoved.plus(event.params.weiAmount);
    metadata._n_debtRemoved += 1;
  }

  user.save();
  metadata.save();
}


export function handleModeratorFee(event: ModeratorFeeEvent): void {
  createMetadata(event.address, event.block.timestamp);

  let fee = new Fee(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  fee._addition = true;
  fee._weiAmount = BigInt.fromI32(0);
  fee._type = 'Moderator';
  fee._tokens = event.params.amountOfTokens;

  let conversionByTxHash = ConversionByTxHash.load(event.transaction.hash.toHex());
  if (conversionByTxHash == null){
    return;
  }

  let conversion = Conversion.load(conversionByTxHash._conversion);

  fee._conversion = conversion.id;

  let campaign = Campaign.load(conversion._campaign);

  fee._campaign = campaign.id;
  fee.save();

  let metadata = Meta.load(event.address.toHex());

  metadata._n_moderatorFee += 1;

  let totalModeratorFee = metadata._totalModeratorFee;
  metadata._totalModeratorFee = totalModeratorFee.plus(fee._tokens as BigInt);

  metadata.save();
}


export function handlerTokenPoolFee(event: TokenPoolFeeEvent): void {
  createMetadata(event.address, event.block.timestamp);

  let fee = new Fee(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  fee._addition = true;
  fee._weiAmount = BigInt.fromI32(0);
  fee._type = 'TokenPool';
  fee._tokens = event.params.amountOfTokens;

  let conversionByTxHash = ConversionByTxHash.load(event.transaction.hash.toHex());
  if (conversionByTxHash == null){
    return;
  }

  let conversion = Conversion.load(conversionByTxHash._conversion);

  fee._conversion = conversion.id;

  let campaign = Campaign.load(conversion._campaign);

  fee._campaign = campaign.id;
  fee.save();

  let metadata = Meta.load(event.address.toHex());

  metadata._n_tokenPoolFee += 1;

  let _totalTokenPoolFee = metadata._totalTokenPoolFee;
  metadata._totalTokenPoolFee = _totalTokenPoolFee.plus(fee._tokens as BigInt);

  metadata.save();
}


// log.debug(
//     'Block number: {}, block hash: {}, transaction hash: {}',
//     [
//       event.block.number.toString(),       // "47596000"
//       event.block.hash.toHexString(),      // "0x..."
//       event.transaction.hash.toHexString() // "0x..."
//     ]
// );

//
// log.debug(
//     'plasma: {}, ethereumOf: {}',
//     [
//       event.params._from.toHexString(),       // "47596000"
//       ethereumOf.toHexString()
//     ]
// );



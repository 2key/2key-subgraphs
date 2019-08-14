import {log, Address, EthereumEvent, EthereumBlock, BigInt} from '@graphprotocol/graph-ts'
import {SetInitialParamsCall} from '../generated/Contract/TwoKeyEventSource'

import {
  Joined as JoinedEvent,
  Rewarded as RewardedEvent,
  DonationCampaignCreated,
  AcquisitionCampaignCreated,
  TwoKeyEventSource,
  UserRegistered as UserRegisteredEvent,
  ConvertedAcquisitionV2 as ConvertedAcquisitionV2Event,
  ConvertedDonationV2 as ConvertedDonationV2Event,
  Rejected as RejectedEvent,
  ExecutedV1 as ExecutedV1Event,
  PriceUpdated as PriceUpdatedEvent
} from "../generated/Contract/TwoKeyEventSource"


import {
    Meta,
    Variable,
    Rejected,
    Campaign,
    Conversion,
    User,
    Join,
    Reward,
    Debug,
    Web3ToUser,
    ConCampUser,
    UserReg,
    PriceUpdated,
    Rate
} from "../generated/schema"


function createMetadata(eventAddress: Address, timeStamp: BigInt): void {
  let metadata = Meta.load(eventAddress.toHex());
  if (metadata == null){
    metadata = new Meta(eventAddress.toHex());
    metadata._version = 1;
    metadata._userRegisteredCounter = 0;
    metadata._convertedAcquisitionCounter = 0;
    metadata._convertedDonationCounter = 0;
    metadata._donationCampaignCreatedCounter = 0;
    metadata._acquisitionCampaignCreatedCounter = 0;
    metadata._createdCounter = 0;
    metadata._convertedCounter = 0;
    metadata._joinedCounter = 0;
    metadata._rewardedCounter = 0;
    metadata._rejectedCounter = 0;
    metadata._convertedAcquisitionV2Counter = 0;
    metadata._convertedDonationV2Counter = 0;
    metadata._executedCounter = 0;
    metadata._executedV1Counter = 0;
    metadata._timeStamp = timeStamp;
    metadata._updatedTimeStamp = timeStamp;
    metadata.save();

    let metaVariable = new Variable('Meta');
    metaVariable._variableId = eventAddress.toHex()
    metaVariable.save();
  }
}

// export function handleSetInitialParams(call: SetInitialParamsCall){
//
//   let metadata = Meta.load(Variable.load('Meta')._variableId);
//   if (metadata == null){
//     return;
//   }
//
// }


export function handlerPriceUpdated(event: PriceUpdatedEvent): void {
  let priceUpdated = PriceUpdated.load(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  if(priceUpdated == null){
    priceUpdated = new PriceUpdated(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    priceUpdated._caller = event.params._updater;
    priceUpdated._rate = event.params.newRate;
    priceUpdated._currency = event.params._currency.toString();
    priceUpdated._timeStemp = event.params._timestamp;
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
      rate._from = currencyString.substring(0,seperator);
      rate._to = currencyString.substring(seperator+1,currencyString.length);
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

function createCampaignObject(campaignAddress: Address, event: EthereumEvent): void {
  let campaign = Campaign.load(campaignAddress.toHex());
  if (campaign == null){
    campaign = new Campaign(campaignAddress.toHex());
    campaign._timeStamp = event.block.timestamp;
    //...

    campaign.save();
  }
}

export function handleRejected(event: RejectedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._rejectedCounter = metadata._rejectedCounter + 1;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();

  let campaign = Campaign.load(event.params._campaign.toHex());
  let user = User.load(event.params._converter.toHex());
  if (campaign == null || user == null){
    let deb = new Debug(event.block.number.toString()+'-'+event.transaction.hash.toHexString()+'Rejected');
    deb._reason = 'For converter '+event.params._converter.toHexString()+' in campaign '+ event.params._campaign.toHexString()+'rejected event exist and no campaign/user';
    deb.save();
  }
  else{
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
      for (let i = 0;i<conversions.length;i++){
        let conversionId = conversions[i].toString();
        let conversion = Conversion.load(campaign.id+'-'+conversionId);
        if (conversion != null){
          conversion._status = 'REJECTED';
          conversion.save();
        }
        else{
          let deb = new Debug(event.block.number.toString()+'-'+event.transaction.hash.toHexString()+'conversions');
          deb._reason = 'conversion id '+conversionId+' for that campaign does not exist';
          deb._campaign = campaign.id;
          deb.save();
        }
      }
    }
  }
}

export function handleExecutedV1(event: ExecutedV1Event): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._executedV1Counter = metadata._executedV1Counter + 1;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();

  let campaign = Campaign.load(event.params.campaignAddress.toHex());
  let conversion = Conversion.load(campaign.id +'-'+event.params.conversionId.toString());
  if (conversion != null){
    conversion._status = 'EXECUTED';
    conversion._tokens = event.params.tokens;
    conversion._version = 1;
    conversion.save();
  }
  else{
    log.debug(
        'converter null in executedEvent',
        [

        ]
    );
  }
}

export function handleUserRegistered(event: UserRegisteredEvent): void{
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._userRegisteredCounter= metadata._userRegisteredCounter + 1;
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


  let newUser = User.load(event.params._address.toHex());
  if (newUser == null){
    newUser = new User(event.params._address.toHex());
    newUser._timeStamp = event.block.timestamp;
  }
  newUser._name = event.params._name;
  newUser._fullName = event.params._fullName;
  newUser._walletName = event.params._username_walletName;
  newUser._email = event.params._email;

  let web3Address = twoKeyEventSource.ethereumOf(event.params._address);
  if (web3Address != event.params._address){
    newUser._web3Address = web3Address;
  }

  newUser._updatedTimeStamp = event.block.timestamp;
  newUser._version = 0;
  newUser._event = userReg.id;
  newUser.save();
}

export function handleConvertedAcquisitionV2(event: ConvertedAcquisitionV2Event): void{
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._convertedAcquisitionV2Counter= metadata._convertedAcquisitionV2Counter + 1;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();

  let twoKeyEventSource = TwoKeyEventSource.bind(event.address);
  let campaign = Campaign.load(event.params._campaign.toHex());
  let conversionId = event.params._conversionId;
  let acquisitionConversion = new Conversion(campaign.id + '-' + conversionId.toString())
  let converterPlasmaAddress = event.params._converterPlasma;
  let converter = User.load(converterPlasmaAddress.toHex());
  if (converter == null) {
    converter = new User(converterPlasmaAddress.toHex());
  }

  let web3Address = twoKeyEventSource.ethereumOf(converterPlasmaAddress);
  if (web3Address != converterPlasmaAddress){
    converter._web3Address = web3Address;
  }

  converter.save();

  acquisitionConversion._campaignType = 'Acquisition';
  acquisitionConversion._isFiatConversion = (event.params._isFiatConversion? true:false);
  if(acquisitionConversion._isFiatConversion == false){
    //Eth conversion
    acquisitionConversion._status = 'APPROVED';
    acquisitionConversion._ethAmountSpent = event.params._conversionAmount;
    acquisitionConversion._fiatAmountSpent = BigInt.fromI32(0);
  }
  else{
    acquisitionConversion._status = 'PENDING';
    acquisitionConversion._ethAmountSpent = BigInt.fromI32(0);
    acquisitionConversion._fiatAmountSpent = event.params._conversionAmount;
  }
  acquisitionConversion._participate = converter.id;
  acquisitionConversion._conversionId = event.params._conversionId;
  acquisitionConversion._campaign = campaign.id;
  acquisitionConversion._timeStamp = event.block.timestamp;
  acquisitionConversion.save();

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

export function handleConvertedDonationV2(event: ConvertedDonationV2Event): void{
    createMetadata(event.address, event.block.timestamp);
    let metadata = Meta.load(event.address.toHex());
    metadata._convertedDonationV2Counter= metadata._convertedDonationV2Counter + 1;
    metadata._updatedTimeStamp = event.block.timestamp;
    metadata.save();

    let twoKeyEventSource = TwoKeyEventSource.bind(event.address);

    let campaign = Campaign.load(event.params._campaign.toHex());
    let conversionId = event.params._conversionId;
    let donationConversion = new Conversion(campaign.id + '-' + conversionId.toString())
    let converterPlasmaAddress = event.params._converterPlasma;
    let converter = User.load(converterPlasmaAddress.toHex());
    if (converter == null) {
    converter = new User(converterPlasmaAddress.toHex());
    }

    let web3Address = twoKeyEventSource.ethereumOf(converterPlasmaAddress);
    if (web3Address != converterPlasmaAddress){
    converter._web3Address = web3Address;
    }

    converter.save();

    donationConversion._campaignType = 'Donation';
    donationConversion._status = 'APPROVED';
    donationConversion._ethAmountSpent = event.params._conversionAmount;
    donationConversion._fiatAmountSpent = BigInt.fromI32(0);
    donationConversion._participate = converter.id;
    donationConversion._conversionId = event.params._conversionId;
    donationConversion._isFiatConversion = false;
    donationConversion._campaign = campaign.id;
    donationConversion._timeStamp = event.block.timestamp;
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
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._donationCampaignCreatedCounter= metadata._donationCampaignCreatedCounter + 1;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();

  let twoKeyEventSource = TwoKeyEventSource.bind(event.address);
  let contractor = User.load(event.params.contractor.toHex());
  if (contractor == null) {
    contractor = new User(event.params.contractor.toHex());

    let web3Address = twoKeyEventSource.ethereumOf(event.params.contractor);
    if (web3Address != event.params.contractor){
      contractor._web3Address = web3Address;
    }
    contractor._timeStamp = event.block.timestamp;
    contractor._updatedTimeStamp = event.block.timestamp;
    contractor.save();
  }

  let newCampaign = new Campaign(
      event.params.proxyDonationCampaign.toHex()
  );

  newCampaign._conversionHandler = event.params.proxyDonationConversionHandler;
  newCampaign._owner = contractor.id;
  newCampaign._logicHandler = event.params.proxyDonationLogicHandler;
  newCampaign._type = "Donation";
  newCampaign._timeStamp = event.block.timestamp;
  newCampaign._updatedTimeStamp = event.block.timestamp;
  newCampaign.save()
}

export function handleAcquisition(event: AcquisitionCampaignCreated): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._acquisitionCampaignCreatedCounter= metadata._acquisitionCampaignCreatedCounter + 1;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();

  let twoKeyEventSource = TwoKeyEventSource.bind(event.address);

  let contractor = User.load(event.params.contractor.toHex());
  if( contractor == null){
    contractor = new User(event.params.contractor.toHex());
    contractor._web3Address = event.params.contractor;
    contractor._timeStamp = event.block.timestamp;
    contractor._updatedTimeStamp = event.block.timestamp;
    let web3Address = twoKeyEventSource.ethereumOf(event.params.contractor);
    if (web3Address != event.params.contractor){
      contractor._web3Address = web3Address;
    }
    contractor.save();
  }


  let newCampaign = new Campaign(
      event.params.proxyAcquisitionCampaign.toHex()
  );

  newCampaign._purchasesHandler = event.params.proxyPurchasesHandler;
  newCampaign._conversionHandler = event.params.proxyConversionHandler;
  newCampaign._logicHandler = event.params.proxyLogicHandler;
  newCampaign._owner = contractor.id;
  newCampaign._type = "Acquisition";
  newCampaign._timeStamp = event.block.timestamp;
  newCampaign._updatedTimeStamp = event.block.timestamp;
  newCampaign.save();
}

export function handleJoined(event: JoinedEvent): void {
  createMetadata(event.address, event.block.timestamp);
  let metadata = Meta.load(event.address.toHex());
  metadata._joinedCounter= metadata._joinedCounter + 1;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();
  let twoKeyEventSource = TwoKeyEventSource.bind(event.address);
  let joiner = User.load(event.params._to.toHex());
  if (joiner == null){
    joiner = new User(event.params._to.toHex());
    joiner._timeStamp = event.block.timestamp;
  }
  if (joiner._web3Address == null){
    joiner._web3Address = twoKeyEventSource.ethereumOf(event.params._to);
    joiner._updatedTimeStamp = event.block.timestamp;
  }
  joiner.save();
  let referrer = User.load(event.params._from.toHex());
  if (referrer == null){
    referrer = new User(event.params._from.toHex());
    referrer._timeStamp = event.block.timestamp;
  }
  if(referrer._web3Address==null){
    referrer._web3Address = twoKeyEventSource.ethereumOf(event.params._from);
    referrer._updatedTimeStamp = event.block.timestamp;
  }
  referrer.save();

  let campaign = Campaign.load(event.params._campaign.toHex());
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
  metadata._rewardedCounter= metadata._rewardedCounter + 1;
  metadata._updatedTimeStamp = event.block.timestamp;
  metadata.save();

  let newReward = new Reward(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  newReward._campaign = Campaign.load(event.params._campaign.toHex()).id;

  newReward._user = User.load(event.params._to.toHex()).id;
  newReward._amount = event.params._amount;
  newReward._timeStamp = event.block.timestamp;
  newReward._updatedTimeStamp = event.block.timestamp;
  newReward.save();
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



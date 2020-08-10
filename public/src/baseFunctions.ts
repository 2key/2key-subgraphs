import {Address, BigInt, ethereum} from "@graphprotocol/graph-ts/index";
import {Campaign, Conversion, Debug, Event, Meta, User} from "../generated/schema";

export function createMetadata(eventAddress: Address, timeStamp: BigInt): void {
    let metadata = Meta.load('Meta');
    if (metadata == null){
        metadata = new Meta('Meta');
        metadata._convertedAcquisitionCounter = 0;
        metadata._convertedDonationCounter = 0;
        metadata._totalDebtAdded2key = BigInt.fromI32(0);
        metadata._totalDebtRemoved2key = BigInt.fromI32(0);
        metadata._totalDebtAddedDAI = BigInt.fromI32(0);
        metadata._totalDebtRemovedDAI = BigInt.fromI32(0);
        metadata._totalDebtAddedETHWEI = BigInt.fromI32(0);
        metadata._totalDebtRemovedETHWEI = BigInt.fromI32(0);
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
        metadata._n_reputationEvents = 0;
        metadata._n_moderatorFee = 0;
        metadata._n_tokenPoolFee = 0;
        metadata._contracts = [];
        metadata._totalTokenPoolFee = BigInt.fromI32(0);
        metadata._totalModeratorFee = BigInt.fromI32(0);
        metadata._timeStamp = timeStamp;
        metadata._updatedTimeStamp = timeStamp;
        metadata.save();
    }

    if (metadata._contracts.indexOf(eventAddress) == -1) {
        let contracts = metadata._contracts;
        contracts.push(eventAddress);
        metadata._contracts = contracts;
        metadata.save();
    }
}


export function createCampaignObject(campaignAddress: Address, timeStamp: BigInt): void {
    let campaign = Campaign.load(campaignAddress.toHex());
    if (campaign == null){
        campaign = new Campaign(campaignAddress.toHex());
        campaign._timeStamp = timeStamp;
        campaign._subgraphType = 'PUBLIC';
        campaign._updatedTimeStamp = timeStamp;
        campaign._version = 1;
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

export function createConversionObject(conversionId: BigInt, participant: Address,campaignAddress: Address, timeStamp: BigInt): void {
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

export function createDebugObject(event: ethereum.Event, info: string): void {
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


export function createEventObject(event: ethereum.Event, eventType: string, notes: string): void {
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

export function createUserObject(eventAddress: Address, userAddress: Address, timeStamp: BigInt): void {
    let user = User.load(userAddress.toHex());
    if (user == null){
        user = new User(userAddress.toHex());
        user._timeStamp = timeStamp;
        user._totalDebtAdded2key = BigInt.fromI32(0);
        user._totalDebtRemoved2key = BigInt.fromI32(0);
        user._totalDebtAddedDAI = BigInt.fromI32(0);
        user._totalDebtRemovedDAI = BigInt.fromI32(0);
        user._totalDebtAddedETHWEI = BigInt.fromI32(0);
        user._totalDebtRemovedETHWEI = BigInt.fromI32(0);
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
        user._contractorMonetaryRep = BigInt.fromI32(0);
        user._contractorBudgetRep = BigInt.fromI32(0);
        user._contractorFeedbackRep = BigInt.fromI32(0);
        user._referrerMonetaryRep = BigInt.fromI32(0);
        user._referrerBudgetRep = BigInt.fromI32(0);
        user._referrerFeedbackRep = BigInt.fromI32(0);
        user._converterMonetaryRep = BigInt.fromI32(0);
        user._converterBudgetRep = BigInt.fromI32(0);
        user._converterFeedbackRep = BigInt.fromI32(0);
        user._total_conversions_amount = BigInt.fromI32(0);
        user.save();
    }
    user.save();
}

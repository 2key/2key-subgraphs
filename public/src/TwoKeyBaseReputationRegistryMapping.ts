import {ReputationUpdated as ReputationUpdatedEvent} from "../generated/BaseReputationRegistry/TwoKeyBaseReputationRegistry";
import {createCampaignObject, createMetadata, createUserObject} from "./baseFunctions";
import {Campaign, Meta, Reputation, User} from "../generated/schema";
import {BigInt} from "@graphprotocol/graph-ts/index";
import { log } from '@graphprotocol/graph-ts'


export function handleReputationUpdated(event: ReputationUpdatedEvent): void {
    log.info('Enter {}',['reputationUpdated']);
    log.info('Values, campaign: {}, user: {}, points: {}, role: {}, type: {}',
        [
            event.params._campaignAddress.toHexString(),
            event.params._plasmaAddress.toHexString(),
            event.params._points.toString(),
            event.params._role,
            event.params._type
        ]);

    createMetadata(event.address, event.block.timestamp);

    log.info('After {}',['createMetadata']);

    let metadata = Meta.load('Meta');
    metadata._updatedTimeStamp = event.block.timestamp;
    metadata._n_reputationEvents += 1;
    metadata.save();

    log.info('After {}',['updateMetadata']);

    createCampaignObject(event.params._campaignAddress, event.block.timestamp);
    let campaign = Campaign.load(event.params._campaignAddress.toHex());

    log.info('After {}',['createCampaignObject']);

    createUserObject(event.address, event.params._plasmaAddress, event.block.timestamp);

    log.info('After {}',['createUserObject']);

    let user = User.load(event.params._plasmaAddress.toHex());

    let reputation = new Reputation(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
    reputation._user = user.id;
    reputation._role = event.params._role;
    reputation._type = event.params._type;
    reputation._pointsWei = event.params._points;
    reputation._campaign = campaign.id;

    reputation.save();

    log.info('After {}',['createReputationObject']);

    if (reputation._role == 'CONTRACTOR' && reputation._type == 'MONETARY') {
        user._contractorMonetaryRep = user._contractorMonetaryRep.plus(reputation._pointsWei as BigInt);
    }
    else if (reputation._role == 'CONTRACTOR' && reputation._type == 'BUDGET') {
        user._contractorBudgetRep = user._contractorBudgetRep.plus(reputation._pointsWei as BigInt);
    }
    else if (reputation._role == 'CONTRACTOR' && reputation._type == 'FEEDBACK') {
        user._contractorFeedbackRep = user._contractorFeedbackRep.plus(reputation._pointsWei as BigInt);
    }
    else if (reputation._role == 'REFERRER' && reputation._type == 'MONETARY') {
        user._referrerMonetaryRep = user._referrerMonetaryRep.plus(reputation._pointsWei as BigInt);
    }
    else if (reputation._role == 'REFERRER' && reputation._type == 'BUDGET') {
        user._referrerBudgetRep = user._referrerBudgetRep.plus(reputation._pointsWei as BigInt);
    }
    else if (reputation._role == 'REFERRER' && reputation._type == 'FEEDBACK') {
        user._referrerFeedbackRep = user._referrerFeedbackRep.plus(reputation._pointsWei as BigInt);
    }
    else if (reputation._role == 'CONVERTER' && reputation._type == 'MONETARY') {
        user._converterMonetaryRep = user._converterMonetaryRep.plus(reputation._pointsWei as BigInt);
    }
    else if (reputation._role == 'CONVERTER' && reputation._type == 'BUDGET') {
        user._converterBudgetRep = user._converterBudgetRep.plus(reputation._pointsWei as BigInt);
    }
    else if (reputation._role == 'CONVERTER' && reputation._type == 'FEEDBACK') {
        user._converterFeedbackRep = user._converterFeedbackRep.plus(reputation._pointsWei as BigInt);
    }
    user.save();
}

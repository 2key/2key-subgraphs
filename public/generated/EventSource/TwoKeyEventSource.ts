// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Created extends ethereum.Event {
  get params(): Created__Params {
    return new Created__Params(this);
  }
}

export class Created__Params {
  _event: Created;

  constructor(event: Created) {
    this._event = event;
  }

  get _campaign(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _owner(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _moderator(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class Joined extends ethereum.Event {
  get params(): Joined__Params {
    return new Joined__Params(this);
  }
}

export class Joined__Params {
  _event: Joined;

  constructor(event: Joined) {
    this._event = event;
  }

  get _campaign(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _to(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class Converted extends ethereum.Event {
  get params(): Converted__Params {
    return new Converted__Params(this);
  }
}

export class Converted__Params {
  _event: Converted;

  constructor(event: Converted) {
    this._event = event;
  }

  get _campaign(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _converter(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ConvertedAcquisition extends ethereum.Event {
  get params(): ConvertedAcquisition__Params {
    return new ConvertedAcquisition__Params(this);
  }
}

export class ConvertedAcquisition__Params {
  _event: ConvertedAcquisition;

  constructor(event: ConvertedAcquisition) {
    this._event = event;
  }

  get _campaign(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _converterPlasma(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _baseTokens(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _bonusTokens(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get _conversionAmount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get _isFiatConversion(): boolean {
    return this._event.parameters[5].value.toBoolean();
  }

  get _conversionId(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class ConvertedDonation extends ethereum.Event {
  get params(): ConvertedDonation__Params {
    return new ConvertedDonation__Params(this);
  }
}

export class ConvertedDonation__Params {
  _event: ConvertedDonation;

  constructor(event: ConvertedDonation) {
    this._event = event;
  }

  get _campaign(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _converterPlasma(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _conversionAmount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _conversionId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class Rewarded extends ethereum.Event {
  get params(): Rewarded__Params {
    return new Rewarded__Params(this);
  }
}

export class Rewarded__Params {
  _event: Rewarded;

  constructor(event: Rewarded) {
    this._event = event;
  }

  get _campaign(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Cancelled extends ethereum.Event {
  get params(): Cancelled__Params {
    return new Cancelled__Params(this);
  }
}

export class Cancelled__Params {
  _event: Cancelled;

  constructor(event: Cancelled) {
    this._event = event;
  }

  get _campaign(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _converter(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _indexOrAmount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Rejected extends ethereum.Event {
  get params(): Rejected__Params {
    return new Rejected__Params(this);
  }
}

export class Rejected__Params {
  _event: Rejected;

  constructor(event: Rejected) {
    this._event = event;
  }

  get _campaign(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _converter(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class UpdatedPublicMetaHash extends ethereum.Event {
  get params(): UpdatedPublicMetaHash__Params {
    return new UpdatedPublicMetaHash__Params(this);
  }
}

export class UpdatedPublicMetaHash__Params {
  _event: UpdatedPublicMetaHash;

  constructor(event: UpdatedPublicMetaHash) {
    this._event = event;
  }

  get timestamp(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get value(): string {
    return this._event.parameters[1].value.toString();
  }
}

export class UpdatedData extends ethereum.Event {
  get params(): UpdatedData__Params {
    return new UpdatedData__Params(this);
  }
}

export class UpdatedData__Params {
  _event: UpdatedData;

  constructor(event: UpdatedData) {
    this._event = event;
  }

  get timestamp(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get value(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get action(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class ReceivedEther extends ethereum.Event {
  get params(): ReceivedEther__Params {
    return new ReceivedEther__Params(this);
  }
}

export class ReceivedEther__Params {
  _event: ReceivedEther;

  constructor(event: ReceivedEther) {
    this._event = event;
  }

  get _sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class AcquisitionCampaignCreated extends ethereum.Event {
  get params(): AcquisitionCampaignCreated__Params {
    return new AcquisitionCampaignCreated__Params(this);
  }
}

export class AcquisitionCampaignCreated__Params {
  _event: AcquisitionCampaignCreated;

  constructor(event: AcquisitionCampaignCreated) {
    this._event = event;
  }

  get proxyLogicHandler(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get proxyConversionHandler(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get proxyAcquisitionCampaign(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get proxyPurchasesHandler(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get contractor(): Address {
    return this._event.parameters[4].value.toAddress();
  }
}

export class DonationCampaignCreated extends ethereum.Event {
  get params(): DonationCampaignCreated__Params {
    return new DonationCampaignCreated__Params(this);
  }
}

export class DonationCampaignCreated__Params {
  _event: DonationCampaignCreated;

  constructor(event: DonationCampaignCreated) {
    this._event = event;
  }

  get proxyDonationCampaign(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get proxyDonationConversionHandler(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get proxyDonationLogicHandler(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get contractor(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class CPCCampaignCreated extends ethereum.Event {
  get params(): CPCCampaignCreated__Params {
    return new CPCCampaignCreated__Params(this);
  }
}

export class CPCCampaignCreated__Params {
  _event: CPCCampaignCreated;

  constructor(event: CPCCampaignCreated) {
    this._event = event;
  }

  get proxyCPCCampaign(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get contractor(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PriceUpdated extends ethereum.Event {
  get params(): PriceUpdated__Params {
    return new PriceUpdated__Params(this);
  }
}

export class PriceUpdated__Params {
  _event: PriceUpdated;

  constructor(event: PriceUpdated) {
    this._event = event;
  }

  get _currency(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get newRate(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _updater(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class UserRegistered extends ethereum.Event {
  get params(): UserRegistered__Params {
    return new UserRegistered__Params(this);
  }
}

export class UserRegistered__Params {
  _event: UserRegistered;

  constructor(event: UserRegistered) {
    this._event = event;
  }

  get _name(): string {
    return this._event.parameters[0].value.toString();
  }

  get _address(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class UserRegistered1 extends ethereum.Event {
  get params(): UserRegistered1__Params {
    return new UserRegistered1__Params(this);
  }
}

export class UserRegistered1__Params {
  _event: UserRegistered1;

  constructor(event: UserRegistered1) {
    this._event = event;
  }

  get _name(): string {
    return this._event.parameters[0].value.toString();
  }

  get _address(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _fullName(): string {
    return this._event.parameters[2].value.toString();
  }

  get _email(): string {
    return this._event.parameters[3].value.toString();
  }

  get _username_walletName(): string {
    return this._event.parameters[4].value.toString();
  }
}

export class Executed extends ethereum.Event {
  get params(): Executed__Params {
    return new Executed__Params(this);
  }
}

export class Executed__Params {
  _event: Executed;

  constructor(event: Executed) {
    this._event = event;
  }

  get campaignAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get converterPlasmaAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get conversionId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get tokens(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class TokenWithdrawnFromPurchasesHandler extends ethereum.Event {
  get params(): TokenWithdrawnFromPurchasesHandler__Params {
    return new TokenWithdrawnFromPurchasesHandler__Params(this);
  }
}

export class TokenWithdrawnFromPurchasesHandler__Params {
  _event: TokenWithdrawnFromPurchasesHandler;

  constructor(event: TokenWithdrawnFromPurchasesHandler) {
    this._event = event;
  }

  get campaignAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get conversionID(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get tokensAmountWithdrawn(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Debt extends ethereum.Event {
  get params(): Debt__Params {
    return new Debt__Params(this);
  }
}

export class Debt__Params {
  _event: Debt;

  constructor(event: Debt) {
    this._event = event;
  }

  get plasmaAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get weiAmount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get addition(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }

  get currency(): string {
    return this._event.parameters[3].value.toString();
  }
}

export class ReceivedTokensAsModerator extends ethereum.Event {
  get params(): ReceivedTokensAsModerator__Params {
    return new ReceivedTokensAsModerator__Params(this);
  }
}

export class ReceivedTokensAsModerator__Params {
  _event: ReceivedTokensAsModerator;

  constructor(event: ReceivedTokensAsModerator) {
    this._event = event;
  }

  get campaignAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amountOfTokens(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ReceivedTokensDeepFreezeTokenPool extends ethereum.Event {
  get params(): ReceivedTokensDeepFreezeTokenPool__Params {
    return new ReceivedTokensDeepFreezeTokenPool__Params(this);
  }
}

export class ReceivedTokensDeepFreezeTokenPool__Params {
  _event: ReceivedTokensDeepFreezeTokenPool;

  constructor(event: ReceivedTokensDeepFreezeTokenPool) {
    this._event = event;
  }

  get campaignAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amountOfTokens(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TwoKeyEventSource extends ethereum.SmartContract {
  static bind(address: Address): TwoKeyEventSource {
    return new TwoKeyEventSource("TwoKeyEventSource", address);
  }

  PROXY_STORAGE_CONTRACT(): Address {
    let result = super.call(
      "PROXY_STORAGE_CONTRACT",
      "PROXY_STORAGE_CONTRACT():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_PROXY_STORAGE_CONTRACT(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "PROXY_STORAGE_CONTRACT",
      "PROXY_STORAGE_CONTRACT():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  implementation(): Address {
    let result = super.call("implementation", "implementation():(address)", []);

    return result[0].toAddress();
  }

  try_implementation(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "implementation",
      "implementation():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  TWO_KEY_SINGLETON_REGISTRY(): Address {
    let result = super.call(
      "TWO_KEY_SINGLETON_REGISTRY",
      "TWO_KEY_SINGLETON_REGISTRY():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_TWO_KEY_SINGLETON_REGISTRY(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "TWO_KEY_SINGLETON_REGISTRY",
      "TWO_KEY_SINGLETON_REGISTRY():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  plasmaOf(me: Address): Address {
    let result = super.call("plasmaOf", "plasmaOf(address):(address)", [
      ethereum.Value.fromAddress(me)
    ]);

    return result[0].toAddress();
  }

  try_plasmaOf(me: Address): ethereum.CallResult<Address> {
    let result = super.tryCall("plasmaOf", "plasmaOf(address):(address)", [
      ethereum.Value.fromAddress(me)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  ethereumOf(me: Address): Address {
    let result = super.call("ethereumOf", "ethereumOf(address):(address)", [
      ethereum.Value.fromAddress(me)
    ]);

    return result[0].toAddress();
  }

  try_ethereumOf(me: Address): ethereum.CallResult<Address> {
    let result = super.tryCall("ethereumOf", "ethereumOf(address):(address)", [
      ethereum.Value.fromAddress(me)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isAddressMaintainer(_maintainer: Address): boolean {
    let result = super.call(
      "isAddressMaintainer",
      "isAddressMaintainer(address):(bool)",
      [ethereum.Value.fromAddress(_maintainer)]
    );

    return result[0].toBoolean();
  }

  try_isAddressMaintainer(_maintainer: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isAddressMaintainer",
      "isAddressMaintainer(address):(bool)",
      [ethereum.Value.fromAddress(_maintainer)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  getTwoKeyDefaultIntegratorFeeFromAdmin(): BigInt {
    let result = super.call(
      "getTwoKeyDefaultIntegratorFeeFromAdmin",
      "getTwoKeyDefaultIntegratorFeeFromAdmin():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getTwoKeyDefaultIntegratorFeeFromAdmin(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTwoKeyDefaultIntegratorFeeFromAdmin",
      "getTwoKeyDefaultIntegratorFeeFromAdmin():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTwoKeyDefaultNetworkTaxPercent(): BigInt {
    let result = super.call(
      "getTwoKeyDefaultNetworkTaxPercent",
      "getTwoKeyDefaultNetworkTaxPercent():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getTwoKeyDefaultNetworkTaxPercent(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTwoKeyDefaultNetworkTaxPercent",
      "getTwoKeyDefaultNetworkTaxPercent():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get sender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class SetInitialParamsCall extends ethereum.Call {
  get inputs(): SetInitialParamsCall__Inputs {
    return new SetInitialParamsCall__Inputs(this);
  }

  get outputs(): SetInitialParamsCall__Outputs {
    return new SetInitialParamsCall__Outputs(this);
  }
}

export class SetInitialParamsCall__Inputs {
  _call: SetInitialParamsCall;

  constructor(call: SetInitialParamsCall) {
    this._call = call;
  }

  get _twoKeySingletonesRegistry(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _proxyStorage(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class SetInitialParamsCall__Outputs {
  _call: SetInitialParamsCall;

  constructor(call: SetInitialParamsCall) {
    this._call = call;
  }
}

export class CreatedCall extends ethereum.Call {
  get inputs(): CreatedCall__Inputs {
    return new CreatedCall__Inputs(this);
  }

  get outputs(): CreatedCall__Outputs {
    return new CreatedCall__Outputs(this);
  }
}

export class CreatedCall__Inputs {
  _call: CreatedCall;

  constructor(call: CreatedCall) {
    this._call = call;
  }

  get _campaign(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _owner(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _moderator(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class CreatedCall__Outputs {
  _call: CreatedCall;

  constructor(call: CreatedCall) {
    this._call = call;
  }
}

export class JoinedCall extends ethereum.Call {
  get inputs(): JoinedCall__Inputs {
    return new JoinedCall__Inputs(this);
  }

  get outputs(): JoinedCall__Outputs {
    return new JoinedCall__Outputs(this);
  }
}

export class JoinedCall__Inputs {
  _call: JoinedCall;

  constructor(call: JoinedCall) {
    this._call = call;
  }

  get _campaign(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _from(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _to(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class JoinedCall__Outputs {
  _call: JoinedCall;

  constructor(call: JoinedCall) {
    this._call = call;
  }
}

export class ConvertedCall extends ethereum.Call {
  get inputs(): ConvertedCall__Inputs {
    return new ConvertedCall__Inputs(this);
  }

  get outputs(): ConvertedCall__Outputs {
    return new ConvertedCall__Outputs(this);
  }
}

export class ConvertedCall__Inputs {
  _call: ConvertedCall;

  constructor(call: ConvertedCall) {
    this._call = call;
  }

  get _campaign(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _converter(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _conversionAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class ConvertedCall__Outputs {
  _call: ConvertedCall;

  constructor(call: ConvertedCall) {
    this._call = call;
  }
}

export class RejectedCall extends ethereum.Call {
  get inputs(): RejectedCall__Inputs {
    return new RejectedCall__Inputs(this);
  }

  get outputs(): RejectedCall__Outputs {
    return new RejectedCall__Outputs(this);
  }
}

export class RejectedCall__Inputs {
  _call: RejectedCall;

  constructor(call: RejectedCall) {
    this._call = call;
  }

  get _campaign(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _converter(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RejectedCall__Outputs {
  _call: RejectedCall;

  constructor(call: RejectedCall) {
    this._call = call;
  }
}

export class ExecutedCall extends ethereum.Call {
  get inputs(): ExecutedCall__Inputs {
    return new ExecutedCall__Inputs(this);
  }

  get outputs(): ExecutedCall__Outputs {
    return new ExecutedCall__Outputs(this);
  }
}

export class ExecutedCall__Inputs {
  _call: ExecutedCall;

  constructor(call: ExecutedCall) {
    this._call = call;
  }

  get _campaignAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _converterPlasmaAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _conversionId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get tokens(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class ExecutedCall__Outputs {
  _call: ExecutedCall;

  constructor(call: ExecutedCall) {
    this._call = call;
  }
}

export class ConvertedAcquisitionCall extends ethereum.Call {
  get inputs(): ConvertedAcquisitionCall__Inputs {
    return new ConvertedAcquisitionCall__Inputs(this);
  }

  get outputs(): ConvertedAcquisitionCall__Outputs {
    return new ConvertedAcquisitionCall__Outputs(this);
  }
}

export class ConvertedAcquisitionCall__Inputs {
  _call: ConvertedAcquisitionCall;

  constructor(call: ConvertedAcquisitionCall) {
    this._call = call;
  }

  get _campaign(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _converterPlasma(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _baseTokens(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _bonusTokens(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _conversionAmount(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _isFiatConversion(): boolean {
    return this._call.inputValues[5].value.toBoolean();
  }

  get _conversionId(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }
}

export class ConvertedAcquisitionCall__Outputs {
  _call: ConvertedAcquisitionCall;

  constructor(call: ConvertedAcquisitionCall) {
    this._call = call;
  }
}

export class ConvertedDonationCall extends ethereum.Call {
  get inputs(): ConvertedDonationCall__Inputs {
    return new ConvertedDonationCall__Inputs(this);
  }

  get outputs(): ConvertedDonationCall__Outputs {
    return new ConvertedDonationCall__Outputs(this);
  }
}

export class ConvertedDonationCall__Inputs {
  _call: ConvertedDonationCall;

  constructor(call: ConvertedDonationCall) {
    this._call = call;
  }

  get _campaign(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _converterPlasma(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _conversionAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _conversionId(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class ConvertedDonationCall__Outputs {
  _call: ConvertedDonationCall;

  constructor(call: ConvertedDonationCall) {
    this._call = call;
  }
}

export class RewardedCall extends ethereum.Call {
  get inputs(): RewardedCall__Inputs {
    return new RewardedCall__Inputs(this);
  }

  get outputs(): RewardedCall__Outputs {
    return new RewardedCall__Outputs(this);
  }
}

export class RewardedCall__Inputs {
  _call: RewardedCall;

  constructor(call: RewardedCall) {
    this._call = call;
  }

  get _campaign(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class RewardedCall__Outputs {
  _call: RewardedCall;

  constructor(call: RewardedCall) {
    this._call = call;
  }
}

export class CancelledCall extends ethereum.Call {
  get inputs(): CancelledCall__Inputs {
    return new CancelledCall__Inputs(this);
  }

  get outputs(): CancelledCall__Outputs {
    return new CancelledCall__Outputs(this);
  }
}

export class CancelledCall__Inputs {
  _call: CancelledCall;

  constructor(call: CancelledCall) {
    this._call = call;
  }

  get _campaign(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _converter(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _indexOrAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class CancelledCall__Outputs {
  _call: CancelledCall;

  constructor(call: CancelledCall) {
    this._call = call;
  }
}

export class AcquisitionCampaignCreatedCall extends ethereum.Call {
  get inputs(): AcquisitionCampaignCreatedCall__Inputs {
    return new AcquisitionCampaignCreatedCall__Inputs(this);
  }

  get outputs(): AcquisitionCampaignCreatedCall__Outputs {
    return new AcquisitionCampaignCreatedCall__Outputs(this);
  }
}

export class AcquisitionCampaignCreatedCall__Inputs {
  _call: AcquisitionCampaignCreatedCall;

  constructor(call: AcquisitionCampaignCreatedCall) {
    this._call = call;
  }

  get proxyLogicHandler(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get proxyConversionHandler(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get proxyAcquisitionCampaign(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get proxyPurchasesHandler(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get contractor(): Address {
    return this._call.inputValues[4].value.toAddress();
  }
}

export class AcquisitionCampaignCreatedCall__Outputs {
  _call: AcquisitionCampaignCreatedCall;

  constructor(call: AcquisitionCampaignCreatedCall) {
    this._call = call;
  }
}

export class DonationCampaignCreatedCall extends ethereum.Call {
  get inputs(): DonationCampaignCreatedCall__Inputs {
    return new DonationCampaignCreatedCall__Inputs(this);
  }

  get outputs(): DonationCampaignCreatedCall__Outputs {
    return new DonationCampaignCreatedCall__Outputs(this);
  }
}

export class DonationCampaignCreatedCall__Inputs {
  _call: DonationCampaignCreatedCall;

  constructor(call: DonationCampaignCreatedCall) {
    this._call = call;
  }

  get proxyDonationCampaign(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get proxyDonationConversionHandler(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get proxyDonationLogicHandler(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get contractor(): Address {
    return this._call.inputValues[3].value.toAddress();
  }
}

export class DonationCampaignCreatedCall__Outputs {
  _call: DonationCampaignCreatedCall;

  constructor(call: DonationCampaignCreatedCall) {
    this._call = call;
  }
}

export class CpcCampaignCreatedCall extends ethereum.Call {
  get inputs(): CpcCampaignCreatedCall__Inputs {
    return new CpcCampaignCreatedCall__Inputs(this);
  }

  get outputs(): CpcCampaignCreatedCall__Outputs {
    return new CpcCampaignCreatedCall__Outputs(this);
  }
}

export class CpcCampaignCreatedCall__Inputs {
  _call: CpcCampaignCreatedCall;

  constructor(call: CpcCampaignCreatedCall) {
    this._call = call;
  }

  get proxyCPC(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get contractor(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class CpcCampaignCreatedCall__Outputs {
  _call: CpcCampaignCreatedCall;

  constructor(call: CpcCampaignCreatedCall) {
    this._call = call;
  }
}

export class PriceUpdatedCall extends ethereum.Call {
  get inputs(): PriceUpdatedCall__Inputs {
    return new PriceUpdatedCall__Inputs(this);
  }

  get outputs(): PriceUpdatedCall__Outputs {
    return new PriceUpdatedCall__Outputs(this);
  }
}

export class PriceUpdatedCall__Inputs {
  _call: PriceUpdatedCall;

  constructor(call: PriceUpdatedCall) {
    this._call = call;
  }

  get _currency(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get _newRate(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _timestamp(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _updater(): Address {
    return this._call.inputValues[3].value.toAddress();
  }
}

export class PriceUpdatedCall__Outputs {
  _call: PriceUpdatedCall;

  constructor(call: PriceUpdatedCall) {
    this._call = call;
  }
}

export class UserRegisteredCall extends ethereum.Call {
  get inputs(): UserRegisteredCall__Inputs {
    return new UserRegisteredCall__Inputs(this);
  }

  get outputs(): UserRegisteredCall__Outputs {
    return new UserRegisteredCall__Outputs(this);
  }
}

export class UserRegisteredCall__Inputs {
  _call: UserRegisteredCall;

  constructor(call: UserRegisteredCall) {
    this._call = call;
  }

  get _name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get _address(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _fullName(): string {
    return this._call.inputValues[2].value.toString();
  }

  get _email(): string {
    return this._call.inputValues[3].value.toString();
  }

  get _username_walletName(): string {
    return this._call.inputValues[4].value.toString();
  }

  get _registrationFee(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }
}

export class UserRegisteredCall__Outputs {
  _call: UserRegisteredCall;

  constructor(call: UserRegisteredCall) {
    this._call = call;
  }
}

export class EmitDebtEventCall extends ethereum.Call {
  get inputs(): EmitDebtEventCall__Inputs {
    return new EmitDebtEventCall__Inputs(this);
  }

  get outputs(): EmitDebtEventCall__Outputs {
    return new EmitDebtEventCall__Outputs(this);
  }
}

export class EmitDebtEventCall__Inputs {
  _call: EmitDebtEventCall;

  constructor(call: EmitDebtEventCall) {
    this._call = call;
  }

  get _plasmaAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _isAddition(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }

  get _currency(): string {
    return this._call.inputValues[3].value.toString();
  }
}

export class EmitDebtEventCall__Outputs {
  _call: EmitDebtEventCall;

  constructor(call: EmitDebtEventCall) {
    this._call = call;
  }
}

export class EmitReceivedTokensAsModeratorCall extends ethereum.Call {
  get inputs(): EmitReceivedTokensAsModeratorCall__Inputs {
    return new EmitReceivedTokensAsModeratorCall__Inputs(this);
  }

  get outputs(): EmitReceivedTokensAsModeratorCall__Outputs {
    return new EmitReceivedTokensAsModeratorCall__Outputs(this);
  }
}

export class EmitReceivedTokensAsModeratorCall__Inputs {
  _call: EmitReceivedTokensAsModeratorCall;

  constructor(call: EmitReceivedTokensAsModeratorCall) {
    this._call = call;
  }

  get _campaignAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amountOfTokens(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class EmitReceivedTokensAsModeratorCall__Outputs {
  _call: EmitReceivedTokensAsModeratorCall;

  constructor(call: EmitReceivedTokensAsModeratorCall) {
    this._call = call;
  }
}

export class EmitReceivedTokensToDeepFreezeTokenPoolCall extends ethereum.Call {
  get inputs(): EmitReceivedTokensToDeepFreezeTokenPoolCall__Inputs {
    return new EmitReceivedTokensToDeepFreezeTokenPoolCall__Inputs(this);
  }

  get outputs(): EmitReceivedTokensToDeepFreezeTokenPoolCall__Outputs {
    return new EmitReceivedTokensToDeepFreezeTokenPoolCall__Outputs(this);
  }
}

export class EmitReceivedTokensToDeepFreezeTokenPoolCall__Inputs {
  _call: EmitReceivedTokensToDeepFreezeTokenPoolCall;

  constructor(call: EmitReceivedTokensToDeepFreezeTokenPoolCall) {
    this._call = call;
  }

  get _campaignAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amountOfTokens(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class EmitReceivedTokensToDeepFreezeTokenPoolCall__Outputs {
  _call: EmitReceivedTokensToDeepFreezeTokenPoolCall;

  constructor(call: EmitReceivedTokensToDeepFreezeTokenPoolCall) {
    this._call = call;
  }
}

export class TokensWithdrawnFromPurchasesHandlerCall extends ethereum.Call {
  get inputs(): TokensWithdrawnFromPurchasesHandlerCall__Inputs {
    return new TokensWithdrawnFromPurchasesHandlerCall__Inputs(this);
  }

  get outputs(): TokensWithdrawnFromPurchasesHandlerCall__Outputs {
    return new TokensWithdrawnFromPurchasesHandlerCall__Outputs(this);
  }
}

export class TokensWithdrawnFromPurchasesHandlerCall__Inputs {
  _call: TokensWithdrawnFromPurchasesHandlerCall;

  constructor(call: TokensWithdrawnFromPurchasesHandlerCall) {
    this._call = call;
  }

  get _campaignAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _conversionID(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _tokensAmountWithdrawn(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TokensWithdrawnFromPurchasesHandlerCall__Outputs {
  _call: TokensWithdrawnFromPurchasesHandlerCall;

  constructor(call: TokensWithdrawnFromPurchasesHandlerCall) {
    this._call = call;
  }
}

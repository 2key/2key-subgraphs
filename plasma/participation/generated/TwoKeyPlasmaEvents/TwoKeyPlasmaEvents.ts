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

export class Visited extends ethereum.Event {
  get params(): Visited__Params {
    return new Visited__Params(this);
  }
}

export class Visited__Params {
  _event: Visited;

  constructor(event: Visited) {
    this._event = event;
  }

  get to(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get c(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get contractor(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[3].value.toAddress();
  }
}

export class Plasma2Ethereum extends ethereum.Event {
  get params(): Plasma2Ethereum__Params {
    return new Plasma2Ethereum__Params(this);
  }
}

export class Plasma2Ethereum__Params {
  _event: Plasma2Ethereum;

  constructor(event: Plasma2Ethereum) {
    this._event = event;
  }

  get plasma(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get eth(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Plasma2Handle extends ethereum.Event {
  get params(): Plasma2Handle__Params {
    return new Plasma2Handle__Params(this);
  }
}

export class Plasma2Handle__Params {
  _event: Plasma2Handle;

  constructor(event: Plasma2Handle) {
    this._event = event;
  }

  get plasma(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get handle(): string {
    return this._event.parameters[1].value.toString();
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

  get campaignAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get fromPlasma(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get toPlasma(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class TwoKeyPlasmaEvents__visitsListExResult {
  value0: Array<Address>;
  value1: Array<BigInt>;

  constructor(value0: Array<Address>, value1: Array<BigInt>) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddressArray(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigIntArray(this.value1));
    return map;
  }
}

export class TwoKeyPlasmaEvents__getNumberOfVisitsAndJoinsAndForwardersResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    return map;
  }
}

export class TwoKeyPlasmaEvents extends ethereum.SmartContract {
  static bind(address: Address): TwoKeyPlasmaEvents {
    return new TwoKeyPlasmaEvents("TwoKeyPlasmaEvents", address);
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

  TWO_KEY_PLASMA_SINGLETON_REGISTRY(): Address {
    let result = super.call(
      "TWO_KEY_PLASMA_SINGLETON_REGISTRY",
      "TWO_KEY_PLASMA_SINGLETON_REGISTRY():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_TWO_KEY_PLASMA_SINGLETON_REGISTRY(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "TWO_KEY_PLASMA_SINGLETON_REGISTRY",
      "TWO_KEY_PLASMA_SINGLETON_REGISTRY():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  cutOf(c: Address, contractor: Address, me: Address): BigInt {
    let result = super.call(
      "cutOf",
      "cutOf(address,address,address):(uint256)",
      [
        ethereum.Value.fromAddress(c),
        ethereum.Value.fromAddress(contractor),
        ethereum.Value.fromAddress(me)
      ]
    );

    return result[0].toBigInt();
  }

  try_cutOf(
    c: Address,
    contractor: Address,
    me: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "cutOf",
      "cutOf(address,address,address):(uint256)",
      [
        ethereum.Value.fromAddress(c),
        ethereum.Value.fromAddress(contractor),
        ethereum.Value.fromAddress(me)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  publicLinkKeyOf(c: Address, contractor: Address, me: Address): Address {
    let result = super.call(
      "publicLinkKeyOf",
      "publicLinkKeyOf(address,address,address):(address)",
      [
        ethereum.Value.fromAddress(c),
        ethereum.Value.fromAddress(contractor),
        ethereum.Value.fromAddress(me)
      ]
    );

    return result[0].toAddress();
  }

  try_publicLinkKeyOf(
    c: Address,
    contractor: Address,
    me: Address
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "publicLinkKeyOf",
      "publicLinkKeyOf(address,address,address):(address)",
      [
        ethereum.Value.fromAddress(c),
        ethereum.Value.fromAddress(contractor),
        ethereum.Value.fromAddress(me)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  notes(c: Address, _plasma: Address): Bytes {
    let result = super.call("notes", "notes(address,address):(bytes)", [
      ethereum.Value.fromAddress(c),
      ethereum.Value.fromAddress(_plasma)
    ]);

    return result[0].toBytes();
  }

  try_notes(c: Address, _plasma: Address): ethereum.CallResult<Bytes> {
    let result = super.tryCall("notes", "notes(address,address):(bytes)", [
      ethereum.Value.fromAddress(c),
      ethereum.Value.fromAddress(_plasma)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  visitsListEx(
    c: Address,
    contractor: Address,
    from: Address
  ): TwoKeyPlasmaEvents__visitsListExResult {
    let result = super.call(
      "visitsListEx",
      "visitsListEx(address,address,address):(address[],uint256[])",
      [
        ethereum.Value.fromAddress(c),
        ethereum.Value.fromAddress(contractor),
        ethereum.Value.fromAddress(from)
      ]
    );

    return new TwoKeyPlasmaEvents__visitsListExResult(
      result[0].toAddressArray(),
      result[1].toBigIntArray()
    );
  }

  try_visitsListEx(
    c: Address,
    contractor: Address,
    from: Address
  ): ethereum.CallResult<TwoKeyPlasmaEvents__visitsListExResult> {
    let result = super.tryCall(
      "visitsListEx",
      "visitsListEx(address,address,address):(address[],uint256[])",
      [
        ethereum.Value.fromAddress(c),
        ethereum.Value.fromAddress(contractor),
        ethereum.Value.fromAddress(from)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new TwoKeyPlasmaEvents__visitsListExResult(
        value[0].toAddressArray(),
        value[1].toBigIntArray()
      )
    );
  }

  getNumberOfVisitsAndJoinsAndForwarders(
    campaignAddress: Address
  ): TwoKeyPlasmaEvents__getNumberOfVisitsAndJoinsAndForwardersResult {
    let result = super.call(
      "getNumberOfVisitsAndJoinsAndForwarders",
      "getNumberOfVisitsAndJoinsAndForwarders(address):(uint256,uint256,uint256)",
      [ethereum.Value.fromAddress(campaignAddress)]
    );

    return new TwoKeyPlasmaEvents__getNumberOfVisitsAndJoinsAndForwardersResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt()
    );
  }

  try_getNumberOfVisitsAndJoinsAndForwarders(
    campaignAddress: Address
  ): ethereum.CallResult<
    TwoKeyPlasmaEvents__getNumberOfVisitsAndJoinsAndForwardersResult
  > {
    let result = super.tryCall(
      "getNumberOfVisitsAndJoinsAndForwarders",
      "getNumberOfVisitsAndJoinsAndForwarders(address):(uint256,uint256,uint256)",
      [ethereum.Value.fromAddress(campaignAddress)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new TwoKeyPlasmaEvents__getNumberOfVisitsAndJoinsAndForwardersResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt()
      )
    );
  }

  getVisitedFrom(c: Address, contractor: Address, _address: Address): Address {
    let result = super.call(
      "getVisitedFrom",
      "getVisitedFrom(address,address,address):(address)",
      [
        ethereum.Value.fromAddress(c),
        ethereum.Value.fromAddress(contractor),
        ethereum.Value.fromAddress(_address)
      ]
    );

    return result[0].toAddress();
  }

  try_getVisitedFrom(
    c: Address,
    contractor: Address,
    _address: Address
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getVisitedFrom",
      "getVisitedFrom(address,address,address):(address)",
      [
        ethereum.Value.fromAddress(c),
        ethereum.Value.fromAddress(contractor),
        ethereum.Value.fromAddress(_address)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getJoinedFrom(_c: Address, _contractor: Address, _address: Address): Address {
    let result = super.call(
      "getJoinedFrom",
      "getJoinedFrom(address,address,address):(address)",
      [
        ethereum.Value.fromAddress(_c),
        ethereum.Value.fromAddress(_contractor),
        ethereum.Value.fromAddress(_address)
      ]
    );

    return result[0].toAddress();
  }

  try_getJoinedFrom(
    _c: Address,
    _contractor: Address,
    _address: Address
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getJoinedFrom",
      "getJoinedFrom(address,address,address):(address)",
      [
        ethereum.Value.fromAddress(_c),
        ethereum.Value.fromAddress(_contractor),
        ethereum.Value.fromAddress(_address)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getVisitsListTimestamps(
    _c: Address,
    _contractor: Address,
    _referrer: Address
  ): Array<BigInt> {
    let result = super.call(
      "getVisitsListTimestamps",
      "getVisitsListTimestamps(address,address,address):(uint256[])",
      [
        ethereum.Value.fromAddress(_c),
        ethereum.Value.fromAddress(_contractor),
        ethereum.Value.fromAddress(_referrer)
      ]
    );

    return result[0].toBigIntArray();
  }

  try_getVisitsListTimestamps(
    _c: Address,
    _contractor: Address,
    _referrer: Address
  ): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "getVisitsListTimestamps",
      "getVisitsListTimestamps(address,address,address):(uint256[])",
      [
        ethereum.Value.fromAddress(_c),
        ethereum.Value.fromAddress(_contractor),
        ethereum.Value.fromAddress(_referrer)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
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

  get _twoKeyPlasmaSingletonRegistry(): Address {
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

export class SetPublicLinkKeyCall extends ethereum.Call {
  get inputs(): SetPublicLinkKeyCall__Inputs {
    return new SetPublicLinkKeyCall__Inputs(this);
  }

  get outputs(): SetPublicLinkKeyCall__Outputs {
    return new SetPublicLinkKeyCall__Outputs(this);
  }
}

export class SetPublicLinkKeyCall__Inputs {
  _call: SetPublicLinkKeyCall;

  constructor(call: SetPublicLinkKeyCall) {
    this._call = call;
  }

  get c(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get contractor(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get new_public_key(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class SetPublicLinkKeyCall__Outputs {
  _call: SetPublicLinkKeyCall;

  constructor(call: SetPublicLinkKeyCall) {
    this._call = call;
  }
}

export class SetCutCall extends ethereum.Call {
  get inputs(): SetCutCall__Inputs {
    return new SetCutCall__Inputs(this);
  }

  get outputs(): SetCutCall__Outputs {
    return new SetCutCall__Outputs(this);
  }
}

export class SetCutCall__Inputs {
  _call: SetCutCall;

  constructor(call: SetCutCall) {
    this._call = call;
  }

  get c(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get contractor(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get cut(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class SetCutCall__Outputs {
  _call: SetCutCall;

  constructor(call: SetCutCall) {
    this._call = call;
  }
}

export class SetNoteByUserCall extends ethereum.Call {
  get inputs(): SetNoteByUserCall__Inputs {
    return new SetNoteByUserCall__Inputs(this);
  }

  get outputs(): SetNoteByUserCall__Outputs {
    return new SetNoteByUserCall__Outputs(this);
  }
}

export class SetNoteByUserCall__Inputs {
  _call: SetNoteByUserCall;

  constructor(call: SetNoteByUserCall) {
    this._call = call;
  }

  get c(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get note(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class SetNoteByUserCall__Outputs {
  _call: SetNoteByUserCall;

  constructor(call: SetNoteByUserCall) {
    this._call = call;
  }
}

export class JoinCampaignCall extends ethereum.Call {
  get inputs(): JoinCampaignCall__Inputs {
    return new JoinCampaignCall__Inputs(this);
  }

  get outputs(): JoinCampaignCall__Outputs {
    return new JoinCampaignCall__Outputs(this);
  }
}

export class JoinCampaignCall__Inputs {
  _call: JoinCampaignCall;

  constructor(call: JoinCampaignCall) {
    this._call = call;
  }

  get campaignAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get contractor(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get sig(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class JoinCampaignCall__Outputs {
  _call: JoinCampaignCall;

  constructor(call: JoinCampaignCall) {
    this._call = call;
  }
}

export class VisitedCall extends ethereum.Call {
  get inputs(): VisitedCall__Inputs {
    return new VisitedCall__Inputs(this);
  }

  get outputs(): VisitedCall__Outputs {
    return new VisitedCall__Outputs(this);
  }
}

export class VisitedCall__Inputs {
  _call: VisitedCall;

  constructor(call: VisitedCall) {
    this._call = call;
  }

  get c(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get contractor(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get sig(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class VisitedCall__Outputs {
  _call: VisitedCall;

  constructor(call: VisitedCall) {
    this._call = call;
  }
}

export class EmitPlasma2EthereumEventCall extends ethereum.Call {
  get inputs(): EmitPlasma2EthereumEventCall__Inputs {
    return new EmitPlasma2EthereumEventCall__Inputs(this);
  }

  get outputs(): EmitPlasma2EthereumEventCall__Outputs {
    return new EmitPlasma2EthereumEventCall__Outputs(this);
  }
}

export class EmitPlasma2EthereumEventCall__Inputs {
  _call: EmitPlasma2EthereumEventCall;

  constructor(call: EmitPlasma2EthereumEventCall) {
    this._call = call;
  }

  get _plasma(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _ethereum(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class EmitPlasma2EthereumEventCall__Outputs {
  _call: EmitPlasma2EthereumEventCall;

  constructor(call: EmitPlasma2EthereumEventCall) {
    this._call = call;
  }
}

export class EmitPlasma2HandleEventCall extends ethereum.Call {
  get inputs(): EmitPlasma2HandleEventCall__Inputs {
    return new EmitPlasma2HandleEventCall__Inputs(this);
  }

  get outputs(): EmitPlasma2HandleEventCall__Outputs {
    return new EmitPlasma2HandleEventCall__Outputs(this);
  }
}

export class EmitPlasma2HandleEventCall__Inputs {
  _call: EmitPlasma2HandleEventCall;

  constructor(call: EmitPlasma2HandleEventCall) {
    this._call = call;
  }

  get _plasma(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _handle(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class EmitPlasma2HandleEventCall__Outputs {
  _call: EmitPlasma2HandleEventCall;

  constructor(call: EmitPlasma2HandleEventCall) {
    this._call = call;
  }
}
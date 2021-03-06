// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Meta extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Meta entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Meta entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Meta", id.toString(), this);
  }

  static load(id: string): Meta | null {
    return store.get("Meta", id) as Meta | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _version(): i32 {
    let value = this.get("_version");
    return value.toI32();
  }

  set _version(value: i32) {
    this.set("_version", Value.fromI32(value));
  }

  get _depositCounter(): BigDecimal | null {
    let value = this.get("_depositCounter");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set _depositCounter(value: BigDecimal | null) {
    if (value === null) {
      this.unset("_depositCounter");
    } else {
      this.set("_depositCounter", Value.fromBigDecimal(value as BigDecimal));
    }
  }

  get _withdrawCounter(): BigDecimal | null {
    let value = this.get("_withdrawCounter");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set _withdrawCounter(value: BigDecimal | null) {
    if (value === null) {
      this.unset("_withdrawCounter");
    } else {
      this.set("_withdrawCounter", Value.fromBigDecimal(value as BigDecimal));
    }
  }

  get _netStaked(): BigInt | null {
    let value = this.get("_netStaked");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set _netStaked(value: BigInt | null) {
    if (value === null) {
      this.unset("_netStaked");
    } else {
      this.set("_netStaked", Value.fromBigInt(value as BigInt));
    }
  }

  get _contracts(): Array<Bytes> | null {
    let value = this.get("_contracts");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytesArray();
    }
  }

  set _contracts(value: Array<Bytes> | null) {
    if (value === null) {
      this.unset("_contracts");
    } else {
      this.set("_contracts", Value.fromBytesArray(value as Array<Bytes>));
    }
  }

  get _timeStamp(): BigInt {
    let value = this.get("_timeStamp");
    return value.toBigInt();
  }

  set _timeStamp(value: BigInt) {
    this.set("_timeStamp", Value.fromBigInt(value));
  }

  get _updatedAt(): BigInt {
    let value = this.get("_updatedAt");
    return value.toBigInt();
  }

  set _updatedAt(value: BigInt) {
    this.set("_updatedAt", Value.fromBigInt(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save User entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save User entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("User", id.toString(), this);
  }

  static load(id: string): User | null {
    return store.get("User", id) as User | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _timeStamp(): BigInt {
    let value = this.get("_timeStamp");
    return value.toBigInt();
  }

  set _timeStamp(value: BigInt) {
    this.set("_timeStamp", Value.fromBigInt(value));
  }

  get _updatedAt(): BigInt {
    let value = this.get("_updatedAt");
    return value.toBigInt();
  }

  set _updatedAt(value: BigInt) {
    this.set("_updatedAt", Value.fromBigInt(value));
  }
}

export class DepositEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save DepositEntity entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save DepositEntity entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("DepositEntity", id.toString(), this);
  }

  static load(id: string): DepositEntity | null {
    return store.get("DepositEntity", id) as DepositEntity | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _timeStamp(): BigInt {
    let value = this.get("_timeStamp");
    return value.toBigInt();
  }

  set _timeStamp(value: BigInt) {
    this.set("_timeStamp", Value.fromBigInt(value));
  }

  get _updatedAt(): BigInt {
    let value = this.get("_updatedAt");
    return value.toBigInt();
  }

  set _updatedAt(value: BigInt) {
    this.set("_updatedAt", Value.fromBigInt(value));
  }

  get _user(): string {
    let value = this.get("_user");
    return value.toString();
  }

  set _user(value: string) {
    this.set("_user", Value.fromString(value));
  }

  get _amount(): BigInt {
    let value = this.get("_amount");
    return value.toBigInt();
  }

  set _amount(value: BigInt) {
    this.set("_amount", Value.fromBigInt(value));
  }

  get _pid(): BigInt {
    let value = this.get("_pid");
    return value.toBigInt();
  }

  set _pid(value: BigInt) {
    this.set("_pid", Value.fromBigInt(value));
  }
}

export class WithdrawEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save WithdrawEntity entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save WithdrawEntity entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("WithdrawEntity", id.toString(), this);
  }

  static load(id: string): WithdrawEntity | null {
    return store.get("WithdrawEntity", id) as WithdrawEntity | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get _timeStamp(): BigInt {
    let value = this.get("_timeStamp");
    return value.toBigInt();
  }

  set _timeStamp(value: BigInt) {
    this.set("_timeStamp", Value.fromBigInt(value));
  }

  get _updatedAt(): BigInt {
    let value = this.get("_updatedAt");
    return value.toBigInt();
  }

  set _updatedAt(value: BigInt) {
    this.set("_updatedAt", Value.fromBigInt(value));
  }

  get _user(): string {
    let value = this.get("_user");
    return value.toString();
  }

  set _user(value: string) {
    this.set("_user", Value.fromString(value));
  }

  get _amount(): BigInt {
    let value = this.get("_amount");
    return value.toBigInt();
  }

  set _amount(value: BigInt) {
    this.set("_amount", Value.fromBigInt(value));
  }

  get _pid(): BigInt {
    let value = this.get("_pid");
    return value.toBigInt();
  }

  set _pid(value: BigInt) {
    this.set("_pid", Value.fromBigInt(value));
  }
}

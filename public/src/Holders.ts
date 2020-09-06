import { BigInt, Address } from '@graphprotocol/graph-ts'

import { Transfer } from '../generated/TwoKeyStandardToken/ERC20'
import { TokenTransfer, Token, Holder } from '../generated/schema'

const TwoKeyEconomy = '0xe48972fcd82a274411c01834e2f031d4377fa2c0';
const TwoKeyETH = '0x63e7aa05b78144013cfa4b23c9b61599d0a29023';
const TwoKeyDAI = '0xda9a09ed40015346f6b0704c5bf1a2ccbf94de43';
const Genesis = '0x0000000000000000000000000000000000000000';


function getOrCreateHolder(_walletAddress: Address): Holder {
    let id = _walletAddress.toHex();
    let holder = Holder.load(id);
    if (holder == null) {
        holder = new Holder(id);
        holder._twokeyBalance = new BigInt(0);
        holder._twokeyEthBalance = new BigInt(0);
        holder._twokeyDaiBalance = new BigInt(0);
    }
    return holder as Holder
}

function getOrCreateToken(_token: Address): Token {
    let id = _token.toHex();
    let token = Token.load(id);
    if (token == null) {
        token = new Token(id);
        token._amountAdded = new BigInt(0);
        token._amountBurned = new BigInt(0);
    }
    return token as Token
}


export function handleTransfer(event: Transfer): void {
    let fromHolder = getOrCreateHolder(event.params.from);
    let toHolder = getOrCreateHolder(event.params.to);
    let token = getOrCreateToken(event.address);


    if (event.params.value.gt(new BigInt(0))) {
        let tokenTransfer = new TokenTransfer(event.transaction.hash.toHex() + '-' + event.logIndex.toString());
        tokenTransfer._token = token.id;
        tokenTransfer._sender = event.params.from;
        tokenTransfer._receiver = event.params.to;
        tokenTransfer._amount = event.params.value;
        tokenTransfer._block = event.block.number;
        tokenTransfer._timestamp = event.block.timestamp;
        tokenTransfer._transaction = event.transaction.hash;
        tokenTransfer.save();

        if (token.id == TwoKeyEconomy){
            if (fromHolder._twokeyBalance.gt(event.params.value)) {
                fromHolder._twokeyBalance = fromHolder._twokeyBalance.minus(event.params.value)
            } else {
                fromHolder._twokeyBalance = new BigInt(0)
            }
            toHolder._twokeyBalance = toHolder._twokeyBalance.plus(event.params.value);
        }
        else if (token.id == TwoKeyETH){
            if (fromHolder._twokeyEthBalance.gt(event.params.value)) {
                fromHolder._twokeyEthBalance = fromHolder._twokeyEthBalance.minus(event.params.value)
            } else {
                fromHolder._twokeyEthBalance = new BigInt(0)
            }
            toHolder._twokeyEthBalance = toHolder._twokeyEthBalance.plus(event.params.value);
        }
        else if (token.id == TwoKeyDAI){
            if (fromHolder._twokeyDaiBalance.gt(event.params.value)) {
                fromHolder._twokeyDaiBalance = fromHolder._twokeyDaiBalance.minus(event.params.value)
            } else {
                fromHolder._twokeyDaiBalance = new BigInt(0)
            }
            toHolder._twokeyDaiBalance = toHolder._twokeyDaiBalance.plus(event.params.value);
        }

        fromHolder.save();
        toHolder.save();

        if (fromHolder.id == Genesis){
            token._amountAdded = token._amountAdded.plus(tokenTransfer._amount);
        }

        if (toHolder.id == Genesis){
            token._amountBurned = token._amountBurned.plus(tokenTransfer._amount);
        }

        token.save();
    }
}

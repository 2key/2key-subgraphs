import { BigInt, Address } from '@graphprotocol/graph-ts'

import { Transfer } from '../generated/TwoKeyStandardToken/ERC20'
import { TokenTransfer, Token, Holder } from '../generated/schema'

const TwoKeyEconomy = '0x3e200226b285eadeccf60036c18a52b7e88c9bb2';
const TwoKeyETH = '0xd067df0ca66f97d04246d90917ae2bae5f5f9fc7';
const TwoKeyDAI = '0x480cf5334e4092eed9e161ff0c3d96852ceb7cb3';
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

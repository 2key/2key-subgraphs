# 2key-subgraphs
2key-subgraph using [graph-node](https://github.com/graphprotocol/graph-node) to indexes for real-time querying of smart contract states on 2key Plasma and Public Blockchains.

2key has 2 subgraph project which serve the blockchain state easily for the dApp: 
1. ####TestNet subgraph:
    * Index the public blockchain using hosted solution of [The Graph](https://thegraph.com/)
    * [2key Ropsten GraphQL playground](https://thegraph.com/explorer/subgraph/2key/staging)
1. ####Plasma subgraph:
    * Index Plasma blockchain using in-house [graph-node](https://github.com/graphprotocol/graph-node) infrastructure.
    * [2key Plasma GraphQL playground](http://staging.api.graph.plasma.2key.net/subgraphs/name/plasma/graphql?)
___

## Installation
#### Testnet subgraph:
###### Steps to run Testnet subgraph locally and deploy it to another hosted solution.
1. `git clone https://github.com/2key/2key-subgraphs.git`
1. `git checkout staging` - Later it will be for prod as well. 
1. `yarn install`
1. `yarn codegen`
1. Create an account on [The Graph](https://thegraph.com/) your own subgraph.
1. Change the `yarn deploy` command on package.json and specify your user and subgraph name.
1. Run `yarn deploy` you will need to change the relevant information
1. Go for your subgraph playground and to check the changes made for the Subgraph.

#### Plasma blockchain
* This part will be release soon.

___

## Usage:
On the playground there's  a schema viewer and GraphQL interface to allow you query and see updated 2key smart contracts states. 

___

## Contributers:
* [4tal](https://github.com/4tal) - Idan Portal - <idan.4tal@gmail.com>




 





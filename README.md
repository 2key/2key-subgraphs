# 2key-subgraphs
2key-subgraph using [graph-node](https://github.com/graphprotocol/graph-node) to indexes for real-time querying of smart contract states on 2key Plasma and Public Blockchains.

2key has 2 subgraph, one to index the public blockchain using the hosted solution of [The Graph](https://thegraph.com/)
and can be queried live on:
1. [2key Ropsten GraphQL playground](https://thegraph.com/explorer/subgraph/2key/staging)
1. [2key Plasma GraphQL playground](http://staging.api.graph.plasma.2key.net/subgraphs/name/plasma/graphql?)

## Public blockchain
#### Steps to install locally:
1. Clone the project.
1. `yarn install`
1. `yarn codegen`
1. Create an account on [The Graph](https://thegraph.com/) your own subgraph.
1. Change the `yarn deploy` command on package.json and specify your user and subgraph name.
1. Run `yarn deploy` you will need to change the relevant information

## Plasma blockchain
Events which index:
 





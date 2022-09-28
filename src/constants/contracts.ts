import {
  BALANCER_VAULT_ADDRESSSES,
  BOND_AGGREGATOR_ADDRESSES,
  BOND_AUCTIONEER_ADDRESSES,
  BOND_DEPOSITORY_ADDRESSES,
  BOND_FIXED_EXPIRY_SDA_ADDRESSES,
  BOND_FIXED_EXPIRY_TELLER_ADDRESSES,
  BOND_FIXED_TERM_SDA_ADDRESSES,
  BOND_FIXED_TERM_TELLER_ADDRESSES,
  DEV_FAUCET,
  MIGRATOR_ADDRESSES,
  OP_BOND_DEPOSITORY_ADDRESSES,
  RANGE_ADDRESSES,
  RANGE_OPERATOR_ADDRESSES,
  RANGE_PRICE_ADDRESSES,
  STAKING_ADDRESSES,
  ZAP_ADDRESSES,
} from "src/constants/addresses";
import { Contract } from "src/helpers/contracts/Contract";
import {
  BalancerVault__factory,
  BondAuctioneer__factory,
  BondDepository__factory,
  BondFixedExpirySDA__factory,
  BondFixedExpiryTeller__factory,
  BondFixedTermSDA__factory,
  BondFixedTermTeller__factory,
  CrossChainMigrator__factory,
  OlympusProV2__factory,
  OlympusStakingv2__factory,
  Range__factory,
  RangeOperator__factory,
  RangePrice__factory,
  Zap__factory,
} from "src/typechain";
import { BondAggregator__factory } from "src/typechain/factories/BondAggregator__factory";
import { DevFaucet__factory } from "src/typechain/factories/DevFaucet__factory";

export const BOND_DEPOSITORY_CONTRACT = new Contract({
  factory: BondDepository__factory,
  name: "Bond Depository Contract",
  addresses: BOND_DEPOSITORY_ADDRESSES,
});

export const OP_BOND_DEPOSITORY_CONTRACT = new Contract({
  factory: OlympusProV2__factory,
  name: "Olympus Pro Bond Depository Contract",
  addresses: OP_BOND_DEPOSITORY_ADDRESSES,
});

export const STAKING_CONTRACT = new Contract({
  factory: OlympusStakingv2__factory,
  name: "Staking Contract",
  addresses: STAKING_ADDRESSES,
});

export const ZAP_CONTRACT = new Contract({
  factory: Zap__factory,
  name: "Zap Contract",
  addresses: ZAP_ADDRESSES,
});

export const MIGRATOR_CONTRACT = new Contract({
  factory: CrossChainMigrator__factory,
  name: "Cross-chain Migrator Contract",
  addresses: MIGRATOR_ADDRESSES,
});

export const BALANCER_VAULT = new Contract({
  factory: BalancerVault__factory,
  name: "Balancer Vault Contract",
  addresses: BALANCER_VAULT_ADDRESSSES,
});

export const RANGE_OPERATOR_CONTRACT = new Contract({
  factory: RangeOperator__factory,
  name: "Range Operator Contract",
  addresses: RANGE_OPERATOR_ADDRESSES,
});

export const RANGE_PRICE_CONTRACT = new Contract({
  factory: RangePrice__factory,
  name: "Range Price Contract",
  addresses: RANGE_PRICE_ADDRESSES,
});

export const RANGE_CONTRACT = new Contract({
  factory: Range__factory,
  name: "Range Contract",
  addresses: RANGE_ADDRESSES,
});

//TODO: Once new Range Contracts are deployed pointing to new bond protocol contracts
// this can be removed.
export const BOND_AUCTIONEER_CONTRACT = new Contract({
  factory: BondAuctioneer__factory,
  name: "Bond Auctioneer Contract",
  addresses: BOND_AUCTIONEER_ADDRESSES,
});
export const FAUCET = new Contract({
  factory: DevFaucet__factory,
  name: "Goerli Faucet Contract",
  addresses: DEV_FAUCET,
});

export const BOND_AGGREGATOR_CONTRACT = new Contract({
  factory: BondAggregator__factory,
  name: "Bond Aggregator Contract",
  addresses: BOND_AGGREGATOR_ADDRESSES,
});

export const BOND_FIXED_EXPIRY_TELLER = new Contract({
  factory: BondFixedExpiryTeller__factory,
  name: "Bond Teller Contract",
  addresses: BOND_FIXED_EXPIRY_TELLER_ADDRESSES,
});

export const BOND_FIXED_EXPIRY_SDA_CONTRACT = new Contract({
  factory: BondFixedExpirySDA__factory,
  name: "Bond Fixed Expiration SDA Contract",
  addresses: BOND_FIXED_EXPIRY_SDA_ADDRESSES,
});

export const BOND_FIXED_TERM_SDA_CONTRACT = new Contract({
  factory: BondFixedTermSDA__factory,
  name: "Bond Fixed Term SDA Contract",
  addresses: BOND_FIXED_TERM_SDA_ADDRESSES,
});

export const BOND_FIXED_TERM_TELLER = new Contract({
  factory: BondFixedTermTeller__factory,
  name: "Bond Fixed Term Teller Contract",
  addresses: BOND_FIXED_TERM_TELLER_ADDRESSES,
});

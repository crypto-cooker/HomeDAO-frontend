import { Metric } from "@olympusdao/component-library";
import { formatCurrency, formatCurrencyOrLoading, formatNumber, formatNumberOrLoading } from "src/helpers";
import { useGohmPrice, useOhmPrice } from "src/hooks/usePrices";
import {
  useCurrentIndex,
  useGOhmPrice as useGOhmPriceFromSubgraph,
  useOhmPrice as useOhmPriceFromSubgraph,
  useTotalValueDeposited,
} from "src/hooks/useProtocolMetrics";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useTreasuryAssetsLatestValue } from "src/hooks/useTokenRecordsMetrics";
import { useOhmCirculatingSupply, useOhmTotalSupply } from "src/hooks/useTokenSupplyMetrics";
import { useLiquidBackingPerGOhm, useLiquidBackingPerOhmBacked, useMarketCap } from "src/hooks/useTreasuryMetrics";

export type MetricSubgraphProps = {
  earliestDate?: string | null;
};
type MetricProps = PropsOf<typeof Metric>;
export type AbstractedMetricProps = Omit<MetricProps, "metric" | "label" | "tooltip" | "isLoading">;

export const MarketCap: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const [marketCap, ohmPrice, ohmCirculatingSupply] = useMarketCap(props.earliestDate);
  const _props: MetricProps = {
    ...props,
    label: `HX Market Cap`,
    tooltip: `Market capitalization is the dollar value of the outstanding HX tokens. It is calculated here as the price of HX (${formatCurrencyOrLoading(
      ohmPrice,
    )}) multiplied by the circulating supply (${formatNumberOrLoading(ohmCirculatingSupply)}). 
    
As the displayed HX price is rounded to 2 decimal places, a manual calculation using the displayed values is likely to slightly differ from the reported market cap. The reported market cap is accurate, as it uses the unrounded price of HX.

Note: other sources may be inaccurate.`,
  };

  if (marketCap) _props.metric = formatCurrency(marketCap, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * same as HXPriceFromSubgraph but uses HX-DAI on-chain price
 */
export const OHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useOhmPrice();
  const _props: MetricProps = {
    ...props,
    label: "HX " + `Price`,
    tooltip: `This price is sourced from the liquidity pools, so will show the real-time market rate.`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * same as HXPrice but uses Subgraph price
 */
export const OHMPriceFromSubgraph: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const ohmPrice = useOhmPriceFromSubgraph();
  const _props: MetricProps = {
    ...props,
    label: "HX " + `Price`,
    tooltip: `This price is determined at the time a snapshot is recorded (every 8 hours). As a result, it will lag the real-time market rate.`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * uses on-chain price
 */
export const SOHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useOhmPrice();

  const _props: MetricProps = {
    ...props,
    label: "sHX " + `Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const OhmCirculatingSupply: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const totalSupply = useOhmTotalSupply(props.earliestDate);
  const circSupply = useOhmCirculatingSupply(props.earliestDate);
  const _props: MetricProps = {
    ...props,
    label: `HX Circulating Supply / Total`,
    tooltip: `Circulating supply is the quantity of outstanding HX not held by the protocol in the treasury. HX deployed in Protocol-Owned Liquidity is therefore included in circulating supply.`,
  };

  if (circSupply && totalSupply) _props.metric = `${formatNumber(circSupply)} / ${formatNumber(totalSupply)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const GOhmCirculatingSupply: React.FC<AbstractedMetricProps> = props => {
  const _props: MetricProps = {
    ...props,
    label: `gHX Circulating Supply / Total`,
    tooltip: `gHX supply is synthetically derived from HX circulating supply divided by the index.`,
  };

  _props.metric = `- / -`;

  return <Metric {..._props} />;
};

export const BackingPerOHM: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const [liquidBackingPerOhmBacked, liquidBacking, backedSupply] = useLiquidBackingPerOhmBacked(props.earliestDate);

  // We include floating supply in the tooltip, as it is not displayed as a separate metric anywhere else
  const tooltip = `Liquid backing (${formatCurrencyOrLoading(
    liquidBacking,
  )}) is divided by backed supply of HX (${formatNumberOrLoading(backedSupply)}) to give liquid backing per HX.
  
Backed supply is the quantity of outstanding HX that is backed by assets in the treasury. This typically excludes pre-minted HX and user deposits for bonds, protocol-owned HX in liquidity pools and HX deployed into lending markets.`;

  const _props: MetricProps = {
    ...props,
    label: `Liquid Backing per HX`,
    tooltip: tooltip,
  };

  if (liquidBackingPerOhmBacked) _props.metric = `${formatCurrency(liquidBackingPerOhmBacked, 2)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const BackingPerGOHM: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const [liquidBackingPerGOhmCirculating, liquidBacking, , latestIndex, ohmFloatingSupply] = useLiquidBackingPerGOhm(
    props.earliestDate,
  );

  const tooltip = `Liquid backing per gHX is calculated as liquid backing (${formatCurrencyOrLoading(
    liquidBacking,
  )}) multiplied by the latest index (${formatNumberOrLoading(
    latestIndex,
    2,
  )}) and divided by HX floating supply (${formatNumberOrLoading(ohmFloatingSupply)}).`;

  const _props: MetricProps = {
    ...props,
    label: `Liquid Backing per gHX`,
    tooltip: tooltip,
  };

  if (liquidBackingPerGOhmCirculating) _props.metric = `${formatCurrency(liquidBackingPerGOhmCirculating, 2)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * React Component that displays the most recent HX index.
 *
 * @param props
 * @returns
 */
export const CurrentIndex: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const currentIndex = useCurrentIndex();
  const _props: MetricProps = {
    ...props,
    label: `Current Index`,
    tooltip: `The current index tracks the amount of HX accumulated since the beginning of staking. Basically, how much HX one would have if they staked and held 1 HX from launch.`,
  };

  if (currentIndex) _props.metric = `${formatNumber(currentIndex, 2)} HX`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * uses contract price
 */
export const GOHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: gOhmPrice } = useGohmPrice();

  const _props: MetricProps = {
    ...props,
    label: "gHX " + `Price`,
    tooltip:
      "gHX = sHX * index" + "\n\n" + `The price of gHX is equal to the price of HX multiplied by the current index`,
  };

  if (gOhmPrice) _props.metric = formatCurrency(gOhmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const GOHMPriceFromSubgraph: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const gOhmPrice = useGOhmPriceFromSubgraph();
  const _props: MetricProps = {
    ...props,
    label: "gHX " + `Price`,
    tooltip:
      "gHX = sHX * index" + "\n\n" + `The price of gHX is equal to the price of HX multiplied by the current index.`,
  };

  if (gOhmPrice) _props.metric = formatCurrency(gOhmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TotalValueDeposited: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const totalValueDeposited = useTotalValueDeposited();
  const _props: MetricProps = {
    ...props,
    label: `Total Value Deposited`,
  };

  if (totalValueDeposited) _props.metric = formatCurrency(totalValueDeposited, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const StakingAPY: React.FC<AbstractedMetricProps> = props => {
  const { data: rebaseRate } = useStakingRebaseRate();
  const _props: MetricProps = {
    ...props,
    label: `Annualized Rebases`,
  };

  if (rebaseRate) {
    const apy = (Math.pow(1 + rebaseRate, 365 * 3) - 1) * 100;
    const formatted = formatNumber(apy, 1);

    _props.metric = `${formatted}%`;
  } else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TreasuryBalance: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const marketValueQuery = useTreasuryAssetsLatestValue(false);

  const _props: MetricProps = {
    ...props,
    label: `Treasury Balance`,
  };

  if (marketValueQuery) _props.metric = formatCurrency(marketValueQuery);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

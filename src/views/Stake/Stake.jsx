import React, { useState, useCallback, } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Flex, Card } from "rimble-ui";
import { trim } from "../../helpers";
import { changeStake, changeApproval } from '../../actions/Stake.actions.js';
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import { Container, Grid } from "@material-ui/core";
import "../../style.scss";
import "./stake.scss";


function Stake({ provider, address }) {
  const dispatch = useDispatch();

  const [view, setView] = useState("stake");
  const [quantity, setQuantity] = useState();

  const fiveDayRate  = useSelector((state ) => { return state.app.fiveDayRate });
  

  const ohmBalance     = useSelector((state ) => { return state.app.balances && state.app.balances.ohm });
  const sohmBalance    = useSelector((state ) => { return state.app.balances && state.app.balances.sohm });
  const stakeAllowance = useSelector((state ) => { return state.app.staking &&  state.app.staking.ohmStake });
  const unstakeAllowance = useSelector((state) => { return state.app.staking &&  state.app.staking.ohmUnstake });
  const stakingRebase = useSelector((state ) => { return state.app.stakingRebase });
  const stakingAPY    = useSelector((state ) => { return state.app.stakingAPY });
  const currentBlock  = useSelector((state ) => { return state.app.currentBlock });

  const setMax = () => {
    if (view === 'stake') {
      setQuantity(ohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const onSeekApproval = async (token ) => {
    await dispatch(changeApproval({ address, token, provider, networkID: 1 }));
  };

  const onChangeStake = async (action ) => {
    if (isNaN(quantity  ) || quantity === 0 || quantity === '') {
      alert('Please enter a value!');
      return;
    } else {
      await dispatch(changeStake({ address, action, value: (quantity  ).toString(), provider, networkID: 1 }));
    }
  };

  const hasAllowance = useCallback((token) => {
    if (token === 'ohm')
      return stakeAllowance > 0;
    else if (token === 'sohm')
      return unstakeAllowance > 0;
  }, [stakeAllowance]);
  

  const ohmAssetImg = () => {
    return 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png';
  }

  const fraxAssetImg = () => {
    return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png";
  }



  return (
    // <Flex className="dapp-view">
      <Grid id="stake-view" container direction="column" justify="center">
        <Card className="ohm-card primary" backgroundColor={"#FFFFFF00"}>
          <div className="card-header">
            <h5>Single Stake (3, 3)</h5>
          </div> 

          <div className="card-content">
            
            <div className="stake-top-metrics">
              <div className="olympus-sushi">
                <div>
                  <img className="olympus-logo" src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png"/>
                  <h3>Olympus</h3>
                </div>
                <div>
                  <a href="" target="_blank">Buy on Sushiswap</a>
                  <i className="fa fa-external-link-alt"></i>
                </div>
                
              </div>

              <div className="stake-apy">
                <h2 className="title">APY</h2>
                <h2 className="content">{ trim(stakingAPY * 100, 1) }%</h2>
              </div>

              <div className="stake-tvl">
                <h2 className="title">TVL</h2>
                {/* need function for getting stakingTVL */}
                <h2 className="content">{ trim(stakingAPY * 100, 1) }%</h2> 
              </div>
            </div>
            
            <div className="stake-toggle-row">
              <div className="btn-group" role="group">
                <button type="button" className={`btn ${view === 'stake' ? 'btn-light' : ''}`} onClick={() => {setView('stake')}}>Stake</button>
                <button type="button" className={`btn ${view === 'unstake' ? 'btn-light' : ''}`} onClick={() => {setView('unstake')}}>Unstake</button>
              </div>
              
            </div>

            {address && (!hasAllowance('ohm') && view === 'stake' || !hasAllowance('sohm') && view === 'unstake')  &&
            <div className='stake-notification'>
              <em><p>Important: The "Approve" transaction is only needed when staking/unstaking for the first time; subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake" transaction.</p></em>
            </div>
            }

            <Flex className="stake-action-row">
              <div className="input-group ohm-input-group">
                <div className="logo-holder">
                  <div className="ohm-logo-bg">
                    <img className="ohm-logo-tiny" src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png"/>
                  </div>              
                </div>
                <input
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  type="number"
                  className="form-control stake-input"
                  placeholder="Type an amount"
                />
                <button type="button" onClick={setMax}>Max</button>
              </div>
            
                {address && hasAllowance('ohm') && view === 'stake' && <div>
                  <div className="stake-button" onClick={() => { onChangeStake('stake') }}>Stake OHM</div>
                </div>}

                {address && hasAllowance('sohm') && view === 'unstake' && <div>
                  <div className="stake-button" onClick={() => { onChangeStake('unstake') }}>Unstake OHM</div>
                </div>}

                {address && !hasAllowance('ohm') && view === 'stake' && <div>
                  <div className="stake-button" onClick={() => { onSeekApproval('ohm') }}>Approve</div>  {/* approve unstake */}
                </div>}

                {address && !hasAllowance('sohm') && view === 'unstake' && <div>
                  <div className="stake-button" onClick={() => { onSeekApproval('sohm') }}>Approve</div> {/* approve unstake */}
                </div>}
              </Flex>

              <div className="stake-price-data-column">
                <div className="stake-price-data-row">
                  <p className="price-label">Your Balance</p>
                  <p className="price-data">{ trim(ohmBalance) } OHM</p>
                </div>

                <div className="stake-price-data-row">
                  <p className="price-label">Your Staked Balance</p>
                  <p className="price-data">{ trim(sohmBalance, 4) } sOHM</p>
                </div>

                <div className="stake-price-data-row">
                  <p className="price-label">Reward Yield</p>
                  <p className="price-data">{ trim(stakingRebase * 100, 4) }%</p>
                </div>

                <div className="stake-price-data-row">
                  <p className="price-label">ROI (5-Day Rate)</p>
                  <p className="price-data">{ trim(fiveDayRate * 100, 4) }%</p>
                </div>

                {/* <div className="stake-price-data-row">
                  <p className="price-label">Current index</p>
                  <p className="price-data">{ trim(currentIndex, 4) } OHM</p>
                </div> */}
              </div>
          </div>

        </Card>

          
        
        <Card className="ohm-card secondary" backgroundColor={"#FFFFFF00"}>
          <div className="card-header">
            <h5>Stake OHM LP Tokens</h5>
          </div>  
          <div className="card-content">
            <table className="table table-borderless stake-table">
              <thead>
                <tr>
                  <th scope="col">Asset</th>
                  <th scope="col">APR</th>
                  <th scope="col">TVL</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Flex className="ohm-pairs mr-2">
                      <div className="ohm-pair" style={{zIndex: 2}}>
                        <img src={`${ohmAssetImg()}`} />
                      </div>
                      <div className="ohm-pair" style={{zIndex: 1}}>
                        <img src={`${fraxAssetImg()}`} />
                      </div>
                      <p>OHM-FRX</p>
                    </Flex>
                  </td>
                  <td>874%</td>
                  <td>$185,558,228</td>
                  <td><button className="stake-lp-button">Stake on Frax</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
    {/* </Flex> */}
    </Grid>
  );
}

export default Stake;

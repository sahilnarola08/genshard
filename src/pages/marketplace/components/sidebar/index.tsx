import { filter, get } from 'lodash';
import './style.sass'
import filterIcon from '../../../../images/marketplace/Filter.png';
import downArrow from '../../../../images/marketplace/downArrow.svg';
import transferArrow from '../../../../images/marketplace/transferArrow.svg'
import { useEffect, useState } from 'react';
import { apiBaseUrl } from '../../../../constants';
import axios from 'axios';

const listingTypeList = [
  {
    label: "New",
    value: 0
  },
  {
    label: "Buy now",
    value: 1
  },
  {
    label: "On Auction",
    value: 3
  },
  {
    label: "Dutch Auction",
    value: 4
  },
  {
    label: "Offers",
    value: 2
  },
]

const getCurrencyOptions = (network: string) => {
  switch (network) {
    case 'GOERLI':
      return [
        {
          label: 'GETH',
          value: 'GETH',
        }
      ];

    case 'BSC':
    case 'T-BSC':
      return [
        {
          label: 'BNB',
          value: 'BNB',
        }
      ];

    case 'IoTeX':
    case 'T-IoTeX':
      return [
        {
          label: 'IOTX',
          value: 'IOTX',
        }
      ];

    case 'HARMONY':
    case 'T-HRMNY':
      return [
        {
          label: 'ONE',
          value: 'ONE',
        }
      ];

    case 'AVALANCHE':
    case 'T-AVALANCHE':
      return [
        {
          label: 'AVAX',
          value: 'AVAX',
        }
      ];

    default:
      return [
        {
          label: network.toUpperCase(),
          value: network.toUpperCase(),
        }
      ];
  }
};

function SellingFilter({
  network,
  collections,
  filters,
  onApplyFilter,
  setIsOpened,
  isOpened,
  winSize,
  setPriceRange
}: any) {

  const [currencyOptions, setCurrencyOptions] = useState<any[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState([])
  const [chains, setChains] = useState([])

  useEffect(() => {
    setCurrencyOptions(getCurrencyOptions(network));
  }, [network]);

  useEffect(() => {
    getCategories()
    getAllChains()
  }, [])

  const getCategories = () => {
    axios.get(`${apiBaseUrl}/api/v1/marketplace/categories`).then(({ data }) => {
      setCategories(data.values || [])
    })
  }

  const getAllChains = () => {
    axios.get(`${apiBaseUrl}/api/v1/marketplace/nft/chains/get?type=testnet`).then(({ data }) => {
      setChains(data.values || [])
    })
  }

  const uniqueCollections = [...new Set(collections.map(item => item?.nameOfNFTProject))];
  console.log('collections', uniqueCollections);

  return (
    <>{isOpened ?
      <div className="side_bar">
        <div className="side_bar_wrapper">
          <div className="filters">
            <div className="close_btn" onClick={() => { winSize <= 768 && setIsOpened(false) }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 3C9.705 3 3 9.705 3 18C3 26.295 9.705 33 18 33C26.295 33 33 26.295 33 18C33 9.705 26.295 3 18 3ZM18 30C11.385 30 6 24.615 6 18C6 11.385 11.385 6 18 6C24.615 6 30 11.385 30 18C30 24.615 24.615 30 18 30ZM23.385 10.5L18 15.885L12.615 10.5L10.5 12.615L15.885 18L10.5 23.385L12.615 25.5L18 20.115L23.385 25.5L25.5 23.385L20.115 18L25.5 12.615L23.385 10.5Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="filters_heading">
              <div className="filter-title">FILTERS</div>
              <img src={filterIcon} alt="Filter" height={12} width={18} />
            </div>
            <div className="filter_status filter_type">
              <div className="filter_type_title remove_before">
                <span></span>
                <span onClick={() => {
                  onApplyFilter({ "listingType": "" })
                }}>RESET</span>
              </div>
              <ul>
                {listingTypeList.map((item, index) => {
                  const isSelected = filters.listingType === item.value
                  return <li className="status_list" key={index}>
                    <p className={`${isSelected ? "active" : ""}`} onClick={() => onApplyFilter({ "listingType": isSelected ? "" : item.value })}>{item.label}</p>
                  </li>
                })}
              </ul>
            </div>
            <div className="price filter_type">
              <div className="filter_type_title">
                <span>PRICE</span>
                <span onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                  setPriceRange("")
                }}>RESET</span>
              </div>
              <div className="currency_min_max">
                <div className="min">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                </div>
                <img src={transferArrow} alt="Right Arrow" />
                <div className="max">
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
              </div>
              <button onClick={() => setPriceRange(Number(minPrice) + "_" + Number(maxPrice))}>Apply</button>
            </div>

            <div className="price filter_type">
              <div className="filter_type_title">
                <span>CHAINS</span>
                <span onClick={() => {
                  onApplyFilter({ "chainId": "" })
                }}>RESET</span>
              </div>
              <div className="select_currency">
                <p style={{ marginRight: 5 }}>Chains</p>
                <select
                  name="currency"
                  id="currency"
                  className="currency"
                  value={filters.chainId}
                  onChange={({ target: { value = "" } }) => onApplyFilter({ "chainId": value })}
                >
                  <option className="currency_option" value="">All</option>
                  {chains.map((option: any, index: number) => (
                    <option
                      key={index}
                      className="currency_option"
                      value={option.chainId}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* <div className="collections filter_type">
              <div className="filter_type_title">
                <span>COLLECTIONS</span>
                <span onClick={() => onApplyFilter({'nameOfNFTProject': null})}>RESET</span>
              </div>

              <div className="collection_options">
                <ul>
                {uniqueCollections.map((collectionName: any, index: number) => (
                  <li key={index}>
                    <label>
                      <input 
                        type="checkbox" 
                        name="collection" 
                        checked={get(filters, 'nameOfNFTProject') === collectionName} 
                        onClick={() => onApplyFilter({'nameOfNFTProject': collectionName})} 
                      />
                      <p>{collectionName}</p>
                    </label>
                  </li>
                ))}
              </ul>
              </div>
            </div> */}
            <div className="categories filter_type">
              <div className="filter_type_title">
                <span>CATEGORIES</span>
                <span onClick={() => onApplyFilter({ categoryId: "" })}>RESET</span>
              </div>

              <div className="collection_options">
                <ul>
                  {categories.map((category: any, index: number) => (
                    <li key={index}>
                      <label>
                        <input
                          type="radio"
                          name="categories"
                          checked={filters.categoryId === category._id}
                          onClick={() => onApplyFilter({ categoryId: category._id })}
                        />
                        <p>{category.name}</p>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div> : null}
    </>
  );
}

export default SellingFilter;

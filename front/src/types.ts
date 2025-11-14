export type TokenTransaction = {
  date: Date
  from: string
  to: string
  value: number
  methodId: string
  contractAddress: string
}

type SecondaryMarketplace = {
  chainId: number
  chainName: string
  dexName: string
  contractPool: string
  pair?: {
    contract: string
    symbol: string
    name: string
  }
}

type SecondaryMarketplaces = SecondaryMarketplace[]

type BlockchainCommonFields = {
  chainName: string
  chainId: number
  contract: string | number
  distributor: string | number
}

type EthereumAddress = BlockchainCommonFields & {
  maintenance: string
}

type XDaiAddress = BlockchainCommonFields & {
  rmmPoolAddress: string | number
  rmmV3WrapperAddress: string | number
  chainlinkPriceContract: string
}

type SepoliaAddress = BlockchainCommonFields & {
  rmmPoolAddress: string | number
  chainlinkPriceContract: string | number
}

type BlockchainAddresses = {
  ethereum: EthereumAddress
  xDai: XDaiAddress
  sepolia: SepoliaAddress
}

type DateObject = {
  date: string
  timezone_type: number
  timezone: string
}

export type RealtToken = {
  fullName: string
  shortName: string
  symbol: string
  productType: string
  tokenPrice: number
  canal: string
  currency: string
  totalTokens: number
  totalTokensRegSummed: number
  uuid: string
  ethereumContract: string | null
  xDaiContract: string
  gnosisContract: string | null
  goerliContract: string | null
  totalInvestment: number
  grossRentYear: number
  grossRentMonth: number
  propertyManagement: number
  propertyManagementPercent: number
  realtPlatform: number
  realtPlatformPercent: number
  insurance: number
  propertyTaxes: number
  utilities: number
  initialMaintenanceReserve: number | null
  netRentDay: number
  netRentMonth: number
  netRentYear: number
  netRentDayPerToken: number
  netRentMonthPerToken: number
  netRentYearPerToken: number
  annualPercentageYield: number
  coordinate: { lat: number; lng: number }
  marketplaceLink: string
  imageLink: string[]
  propertyType: number | null
  propertyTypeName: string | null
  squareFeet: number | null
  lotSize: number | null
  bedroomBath: string | null
  hasTenants: boolean | null
  rentedUnits: number | null
  totalUnits: number | null
  termOfLease: null
  renewalDate: null
  section8paid: number | null
  subsidyStatus: string | null
  subsidyBy: string | null
  sellPropertyTo: string
  secondaryMarketplace: { UniswapV1: number; UniswapV2: number }
  secondaryMarketplaces: SecondaryMarketplaces
  blockchainAddresses: BlockchainAddresses
  underlyingAssetPrice: number
  renovationReserve: number | null
  propertyMaintenanceMonthly: number
  rentStartDate: DateObject | null
  lastUpdate: DateObject
  originSecondaryMarketplaces: SecondaryMarketplace
  initialLaunchDate: DateObject
  seriesNumber: number
  constructionYear: number | null
  constructionType: string | null
  roofType: string | null
  assetParking: string | null
  foundation: string | null
  heating: string | null
  cooling: string | null
  tokenIdRules: number
  rentCalculationType: string
  realtListingFeePercent: number | null
  realtListingFee: number | null
  miscellaneousCosts: number | null
  propertyStories: number | null
  rentalType: string
  neighborhood: string | null
}

export type ApiResponse = {
  timestamp: string
  path: string
  message: string
}

export type HistoryResponse = {
  uuid: string
  history: {
    date: string
    values: {
      canal?: string
      tokenPrice?: number
      underlyingAssetPrice?: number
      initialMaintenanceReserve?: number
      totalInvestment?: number
      grossRentYear?: number
      netRentYear?: number
      rentedUnits?: number
      renovationReserve?: number
    }
  }[]
}

export type GnosisToken = {
  location: TokenTransaction[]
  rmm: TokenTransaction[]
}

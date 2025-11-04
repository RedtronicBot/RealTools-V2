import { Injectable } from "@nestjs/common"
import axios from "axios"
import { TokenTransaction } from "./types"

@Injectable()
export class AppService {
  async gnosisscanToken(address: string): Promise<{
    location: TokenTransaction[]
    rmm: TokenTransaction[]
  }> {
    const { data } = await axios.get(`https://api.etherscan.io/v2/api`, {
      params: {
        chainid: 100,
        module: "account",
        action: "tokentx",
        address,
        startblock: 0,
        endblock: 99999999,
        sort: "asc",
        apikey: process.env.ETHERSCAN_API,
      },
    })
    const rawResult = data?.result || []
    const simplifiedResult = rawResult.map((data: Record<string, string>): TokenTransaction => {
      const decimals = parseInt(data.tokenDecimal || "18", 10)
      const divisor = 10 ** decimals
      return {
        date: new Date(parseInt(data.timeStamp) * 1000),
        from: data.from,
        to: data.to,
        methodId: data.methodId,
        value: parseFloat((+data.value / divisor).toFixed(4)),
        tokenName: data.tokenName,
        contractAddress: data.contractAddress,
      }
    })
    const locationMap = new Map<string, TokenTransaction>()
    const rmm: TokenTransaction[] = []
    for (const data of simplifiedResult) {
      const isRecipient = data.to.toLowerCase() === address.toLowerCase()
      const signedValue = isRecipient ? data.value : -data.value

      const transaction = {
        ...data,
        value: signedValue,
      }

      if (data.tokenName === "RealT RMM V3 WXDAI") {
        rmm.push(transaction)
      } else if (data.tokenName.toLowerCase().startsWith("realtoken") && data.tokenName !== "RealToken Ecosystem Governance") {
        const token = locationMap.get(data.tokenName)

        if (token) {
          // additionne les valeurs
          locationMap.set(data.tokenName, {
            ...token,
            value: parseFloat((token.value + signedValue).toFixed(4)),
          })
        } else {
          locationMap.set(data.tokenName, transaction)
        }
      }
    }
    const location = Array.from(locationMap.values()).filter((loc) => loc.value > 0)
    return { location, rmm }
  }

  async realtToken(): Promise<any> {
    const response = await axios.get(`https://api.realtoken.community/v1/token`, {
      headers: {
        "X-AUTH-REALT-TOKEN": process.env.REALT_API,
      },
    })
    return response.data
  }

  async tokenHistory(): Promise<any> {
    const response = await axios.get(`https://api.realtoken.community/v1/tokenHistory`, {
      headers: {
        "X-AUTH-REALT-TOKEN": process.env.REALT_API,
      },
    })
    return response.data
  }

  async gnosissContract(contractaddress: string): Promise<any> {
    const response = await axios.get(`https://api.etherscan.io/v2/api`, {
      params: {
        chainid: 100,
        module: "account",
        action: "tokentx",
        contractaddress,
        startblock: 0,
        endblock: 99999999,
        sort: "desc",
        apikey: process.env.ETHERSCAN_API,
      },
    })
    return response.data
  }

  async gnosisTransaction(address: string): Promise<any> {
    const response = await axios.get(`https://api.etherscan.io/v2/api`, {
      params: {
        chainid: 100,
        module: "account",
        action: "txlistinternal",
        address,
        startblock: 0,
        endblock: 99999999,
        sort: "asc",
        apikey: process.env.ETHERSCAN_API,
      },
    })
    return response.data
  }
}

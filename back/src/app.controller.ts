import { Controller, Get, Param } from "@nestjs/common"
import { AppService } from "./app.service"
import { TokenTransaction } from "./types"
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("token/gnosisscan/:key")
  gnosisscanToken(@Param("key") key: string): Promise<{
    location: TokenTransaction[]
    rmm: TokenTransaction[]
  }> {
    return this.appService.gnosisscanToken(key)
  }

  @Get("token/realt")
  realtToken(): Promise<any> {
    return this.appService.realtToken()
  }

  @Get("history")
  tokenHistory(): Promise<any> {
    return this.appService.tokenHistory()
  }

  @Get("contract/:contract")
  gnosisContract(@Param("contract") contract: string): Promise<any> {
    return this.appService.gnosissContract(contract)
  }
}

import L from "leaflet"

import singleFamily from "../../assets/map-icons/single-family.svg"
import multiFamily from "../../assets/map-icons/multi-family.svg"
import duplex from "../../assets/map-icons/duplex.png"
import portfolio from "../../assets/map-icons/portfolio.png"
import building from "../../assets/map-icons/building.svg"
import quadplex from "../../assets/map-icons/quadplex.png"
import commercial from "../../assets/map-icons/commercial.svg"
import { normalizePropertyType } from "./normalizePropertyType"
const ICON_SIZE: [number, number] = [32, 32]
const defaultLeafletIcon = new L.Icon.Default()
export const iconByPropertyType: Record<string, L.Icon> = {
  SingleFamily: L.icon({
    iconUrl: singleFamily,
    iconSize: ICON_SIZE,
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  MultiFamily: L.icon({
    iconUrl: multiFamily,
    iconSize: ICON_SIZE,
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  Duplex: L.icon({
    iconUrl: duplex,
    iconSize: ICON_SIZE,
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  SFRPortfolio: L.icon({
    iconUrl: portfolio,
    iconSize: ICON_SIZE,
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  Condominium: L.icon({
    iconUrl: building,
    iconSize: ICON_SIZE,
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  Quadplex: L.icon({
    iconUrl: quadplex,
    iconSize: ICON_SIZE,
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  Commercial: L.icon({
    iconUrl: commercial,
    iconSize: ICON_SIZE,
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
}

export const getPropertyIcon = (rawType?: string | null): L.Icon | L.Icon.Default => {
  const type = normalizePropertyType(rawType)

  return (type && iconByPropertyType[type]) ?? defaultLeafletIcon
}

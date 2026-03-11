import { gql } from "@apollo/client";

export const GET_SEAPORTS = gql`

query {
 seaports {
   portName
   locode
   latitude
   longitude
   countryIso
 }
}

`;
import { gql } from "@apollo/client";

export const GET_SEAPORTS = gql`

query {
 seaports {
   id
   portName
   locode
   latitude
   longitude
   countryIso
 }
}

`;
import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  {
    user {
      _id
      username
      email
      orders {
        _id
        purchaseDate
        products {
          _id
          name
          price
          unit
        }
      }
    }
  }
`;


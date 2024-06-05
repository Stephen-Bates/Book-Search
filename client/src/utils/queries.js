import { gql } from '@apollo/client';

export const GET_SINGLE_USER = gql`
query getUser {
  getUser {
    _id
    username
    email
    savedBooks {
      authors
      description
      bookId
      title
      image
      link
    }
  }
}
`;

export const GET_ME = gql`
query getMe {
  getMe {
    _id
    username
    email
    savedBooks {
      authors
      description
      bookId
      title
      image
      link
    }
  }
}
`;

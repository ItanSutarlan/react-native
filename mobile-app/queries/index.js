import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query Query($category: Int) {
    findAllPosts(category: $category) {
      statusCode
      data {
        author {
          username
          id
          email
        }
        category {
          name
          id
        }
        content
        createdAt
        id
        imgUrl
        slug
        tags {
          id
          name
          postId
        }
        title
      }
    }
  }
`;

export const GET_TODO_BY_SLUG = gql`
  query FindPostBySlug($slug: String!) {
    findPostBySlug(slug: $slug) {
      statusCode
      data {
        author {
          username
          id
          email
        }
        category {
          name
          id
        }
        content
        createdAt
        id
        imgUrl
        slug
        tags {
          id
          name
          postId
        }
        title
      }
    }
  }
`;

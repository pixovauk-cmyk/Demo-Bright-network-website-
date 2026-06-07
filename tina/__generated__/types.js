export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const CoursePartsFragmentDoc = gql`
    fragment CourseParts on Course {
  __typename
  title
  level
  sector
  duration
  tagline
  description
  heroImage
  featured
  whatYouLearn
  employerBenefits
  modules {
    __typename
    title
    slug
    duration
    videoUrl
    description
    resources
  }
}
    `;
export const HomePartsFragmentDoc = gql`
    fragment HomeParts on Home {
  __typename
  announcementText
  heroHeadline
  heroSubtext
  heroTrustLine1
  heroTrustLine2
  heroTrustLine3
  ctaHeadline
  ctaSubtext
  ctaPhone
  ctaEmail
  heroImage1
  heroImage2
  stats {
    __typename
    value
    suffix
    label
  }
  employers
  whyHeadline
  whySubtext
  whyImage1
  whyImage2
  features {
    __typename
    title
    desc
  }
  howHeadline
  howImage
  steps {
    __typename
    title
    desc
  }
  insightsHeadline
  insights {
    __typename
    tag
    title
    date
    read
    img
    href
  }
  dualHeadline
  dualSubtext
  employerCardHeadline
  employerCardSubtext
  employerCardImage
  employerBullets
  learnerCardHeadline
  learnerCardSubtext
  learnerCardImage
  learnerBullets
}
    `;
export const CourseDocument = gql`
    query course($relativePath: String!) {
  course(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...CourseParts
  }
}
    ${CoursePartsFragmentDoc}`;
export const CourseConnectionDocument = gql`
    query courseConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: CourseFilter) {
  courseConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...CourseParts
      }
    }
  }
}
    ${CoursePartsFragmentDoc}`;
export const HomeDocument = gql`
    query home($relativePath: String!) {
  home(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...HomeParts
  }
}
    ${HomePartsFragmentDoc}`;
export const HomeConnectionDocument = gql`
    query homeConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HomeFilter) {
  homeConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...HomeParts
      }
    }
  }
}
    ${HomePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    course(variables, options) {
      return requester(CourseDocument, variables, options);
    },
    courseConnection(variables, options) {
      return requester(CourseConnectionDocument, variables, options);
    },
    home(variables, options) {
      return requester(HomeDocument, variables, options);
    },
    homeConnection(variables, options) {
      return requester(HomeConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "https://content.tinajs.io/2.4/content/99b80054-1d77-4109-8c6b-7676356d37e5/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};

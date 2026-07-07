// Shopify Storefront API client + data helpers for Bloomify.
//
// Credentials come from .env (EXPO_PUBLIC_* vars are inlined into the app at
// build time by Expo). The fallbacks keep the app working even if the env vars
// aren't picked up for some reason.

const SHOPIFY_DOMAIN =
  process.env.EXPO_PUBLIC_SHOPIFY_DOMAIN ?? 'bloomsflowerae.myshopify.com';
const STOREFRONT_TOKEN =
  process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ??
  '035719ba86091c512aa58a3c8a1bae8b';
const API_VERSION = process.env.EXPO_PUBLIC_SHOPIFY_API_VERSION ?? '2024-10';

const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

// ---- App-facing types (shape the UI screens expect) -----------------------

export type ShopifyProduct = {
  id: string;
  handle: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  image: string;
  images: string[];
};

export type ShopifyCollection = {
  id: string;
  handle: string;
  name: string;
  items: string; // e.g. "12 Items" (used by the home category cards)
  image: string;
};

// ---- Low-level GraphQL fetch ----------------------------------------------

async function shopifyFetch<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify request failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}

// ---- Mappers ---------------------------------------------------------------

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/600x800.png?text=No+Image';

function mapProduct(node: any): ShopifyProduct {
  const images: string[] =
    node.images?.edges?.map((e: any) => e.node.url).filter(Boolean) ?? [];
  const priceObj = node.priceRange?.minVariantPrice;
  return {
    id: node.id,
    handle: node.handle,
    name: node.title,
    price: priceObj ? parseFloat(priceObj.amount) : 0,
    currency: priceObj?.currencyCode ?? 'AED',
    description: node.description ?? '',
    image: images[0] ?? PLACEHOLDER_IMAGE,
    images: images.length ? images : [PLACEHOLDER_IMAGE],
  };
}

// ---- Public data helpers ---------------------------------------------------

export async function getProducts(first = 30): Promise<ShopifyProduct[]> {
  const query = `
    query Products($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            priceRange { minVariantPrice { amount currencyCode } }
            images(first: 5) { edges { node { url } } }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<any>(query, { first });
  return data.products.edges.map((e: any) => mapProduct(e.node));
}

export async function getCollections(first = 20): Promise<ShopifyCollection[]> {
  const query = `
    query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
            image { url }
            products(first: 1) { edges { node { id } } }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<any>(query, { first });
  return data.collections.edges.map((e: any) => {
    const node = e.node;
    return {
      id: node.id,
      handle: node.handle,
      name: node.title,
      items: 'View items',
      image: node.image?.url ?? PLACEHOLDER_IMAGE,
    } as ShopifyCollection;
  });
}

export async function getProductsByCollection(
  handle: string,
  first = 30,
): Promise<ShopifyProduct[]> {
  const query = `
    query CollectionProducts($handle: String!, $first: Int!) {
      collectionByHandle(handle: $handle) {
        products(first: $first) {
          edges {
            node {
              id
              handle
              title
              description
              priceRange { minVariantPrice { amount currencyCode } }
              images(first: 5) { edges { node { url } } }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch<any>(query, { handle, first });
  const edges = data.collectionByHandle?.products?.edges ?? [];
  return edges.map((e: any) => mapProduct(e.node));
}

export function formatPrice(price: number, currency: string): string {
  return `${currency} ${price.toFixed(2)}`;
}

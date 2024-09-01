export interface InputRange {
    min: number;
    max: number;
    minSelected: number;
    maxSelected: number;
}

export interface RangeFacet {
    code: string;
    range: InputRange;
}

export interface FacetValue {
    code: string;
    count: number;
    selected: boolean;
}

export interface Facet {
    code: string;
    priority: number;
    category: boolean;
    multiSelect: boolean;
    visible: boolean;
    values: FacetValue[];
}

export interface Query {
    value: string;
    forceOffline: boolean;
    skipStockCheck: boolean;
    filterCategoryFacet: boolean;
}

export interface Pagination {
    pageSize: number;
    currentPage: number;
    sort: string;
    numberOfPages: number;
    totalNumberOfResults: number;
    totalNumberOfResultsUnfiltered: number;
}

export interface GalleryImage {
    url: string;
    baseUrl: string;
}

export interface OrderFilter {
    orderFilter: number;
    filterCode: string;
}

export interface Price {
    currencyIso: string;
    value: number;
    priceType: string;
    formattedValue: string;
    type: string;
}

export interface ColorFilter {
    code: string;
    text: string;
    filterName: string;
    hybrisCode: string;
}

export interface ProductArticle {
    code: string;
    name: string;
    images: GalleryImage[];
    pk: string;
    whitePrice: Price;
    logoPicture: GalleryImage[];
    normalPicture: GalleryImage[];
    visible: boolean;
    numberOfPieces: number;
    ticket: string;
    dummy: boolean;
    ecoTaxValue: number;
    redirectToPdp: boolean;
    comingSoon: boolean;
    color: ColorFilter;
    rgbColor: string;
    genArticle: string;
    turnToSku: string;
}

export interface StockLevel {
    stockLevel: number;
}

export interface ProductResult {
    code: string;
    name: string;
    stock: StockLevel;
    price: Price;
    images: GalleryImage[];
    categories: object[];
    pk: string;
    whitePrice: Price;
    articles: ProductArticle[];
    visible: boolean;
    concept: string[];
    numbersOfPieces: number;
    defaultArticle: ProductArticle;
    sale: false;
    variantSizes: OrderFilter;
    swatches: object[];
    articleCodes: string[];
    ticket: string;
    searchEngineProductId: string;
    dummy: false;
    linkPdp: string;
    categoryName: string;
    rgbColors: string[];
    articleColorNames: string[];
    ecoTaxValue: number;
    swatchesTotal: number;
    showPriceMarker: boolean;
    redirectToPdp: boolean;
    mainCategoryCode: string;
    comingSoon: boolean;
    brandName: string;
    galleryImages: GalleryImage[];
    allArticleCodes: string[];
    allArticleImages: string[];
    allArticleBaseImages: string[];
}

export interface ProductResults {
    results: ProductResult[];
    pagination: Pagination;
    currentQuery: {query: Query};
    facets: Facet[];
    freeTextSearch: string;
    categoryCode: string;
    isStopWord: boolean;
    noResultsForFirstRequest: boolean;
    showSizeFilter: boolean;
    rangeFacets: RangeFacet[];
}

/** Product Details */

export interface DetailsPrice {
    price: number;
    currency: string;
    referenceFlag: boolean;
    startDate: number;
    endDate:number;
}

export interface DetailsColor {
    code: string;
    text: string;
    rgbColor: string;
}

export interface LengthCollectionItem {
    code: string;
    value: string[];
}

export interface ProductCategory {
    name: string;
    code: string;
}

export interface ProductDetails {
    code: string;
    name: string;
    description: string;
    sapProductName: string;
    color: DetailsColor;
    whitePrice: DetailsPrice;
    redPrice: DetailsPrice;
    priceType: string;
    measurements: string[];
    assortmentTypeKey: string;
    lengthCollection: LengthCollectionItem[];
    fits: string[];
    showPriceMarker: boolean;
    sapSalesMode: string;
    baseProductCode: string;
    ancestorProductCode:string;
    mainCategory: ProductCategory;
    supercategories: ProductCategory[];
    constructionDescr: string;
    customerGroup: string;
    functions: string[]; /** what */
    newArrival: boolean;
    articlesList: ProductArticle[]; /** not quite the same!! */
    inStock: boolean;
    productUrl: string;
    swatchesType: string;
    rootCategoryPath: string;
    productKey: string;
    productCountryOfProduction: string;
    showGarmentsInfo: boolean;
    yearOfProduction: string;
    complianceMarkers: string[];
    styleCollection: string[];
    presentationTypes: string;
    presentationTypesCode: string;
    newProduct: boolean;
    multipack: boolean;
}


export interface ProductDetailsResult {
    responseStatusCode: string;
    product: ProductDetails;
}
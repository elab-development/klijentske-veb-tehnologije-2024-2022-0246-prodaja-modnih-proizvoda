import { EnumKeys, ObjectKeysFromEnum } from "./productModel";


export type FilterOperation = "eq" | "lt" | "le" | "gt" | "ge" | "in" | "bw";
export type FilterCriterion = string | number;
export type FilterCriteria = FilterCriterion[];
export type FilterOperationFunction<T> = ObjectKeysFromEnum<FilterOperation, (keyValue: T[EnumKeys<T>], values: FilterCriteria) => boolean>;
export type FilterData<T> = ObjectKeysFromEnum<T, {operation: FilterOperation, values: FilterCriteria}> | undefined;

export class ClientFilter<T> {
    protected filterOperationFunctionsObj: FilterOperationFunction<T> = {
          eq: (keyValue: T[EnumKeys<T>], values: FilterCriteria) => { /* equals */
            return keyValue == values[0];
            },
          lt: (keyValue: T[EnumKeys<T>], values: FilterCriteria) => { /* less than */
            return keyValue < values[0];
            },
          le: (keyValue: T[EnumKeys<T>], values: FilterCriteria) => { /* less than or equal */
            return keyValue <= values[0];
            },
          gt: (keyValue: T[EnumKeys<T>], values: FilterCriteria) => { /* greater than */
            return keyValue > values[0];
            },
          ge: (keyValue: T[EnumKeys<T>], values: FilterCriteria) => { /* greater than or equal */
            return keyValue >= values[0];
            },
          in: (keyValue: T[EnumKeys<T>], values: FilterCriteria) => { /* in array of values */
            return values.includes(keyValue as never);
            },
          bw: (keyValue: T[EnumKeys<T>], values: FilterCriteria) => { /* in range - between min and max value */
            return (keyValue >= values[0]) && (keyValue <= values[1]);
            },
        };
    
    protected filter: FilterData<T>;

    public get filterItems() : FilterData<T> {
        return this.filter;
    };

    public set filterItems(filtItems: FilterData<T> ) {
        this.filter = filtItems;
    }

    constructor (filt: FilterData<T>) {
        this.filter = filt;
    };

    // add new item into filter - all filter items should be true on a specific product item to be filtered and displayed
    public addFilter = (prodProp: EnumKeys<T>, prod: {operation: FilterOperation, values: FilterCriteria}) => {
        let filtNewItem : FilterData<T>;
        if (this.filter && Object.keys(this.filter).length) {
            filtNewItem = { ...this.filter, [prodProp]: prod};
        } else {
            filtNewItem = { [prodProp]: prod } as unknown as FilterData<T>;
        }
        this.filterItems = filtNewItem;
    };

    // remove filter item (regarding one of a product property) from filter
    public removeFromFilter = (prodProp: EnumKeys<T>) => {
        let filtNew : FilterData<T>;
        if (this.filter && Object.keys(this.filter).length) {
            filtNew = { ...this.filter };
            delete filtNew[prodProp];
            this.filterItems = filtNew;
        }
    }

    public applyFilter(toData: T[]) {
        const filtered = toData.filter((el) => {
            if (!this.filter) {
                return true; // take all data
            }
            const prodKeys = Object.keys(this.filter);
            if (prodKeys.length) {
                let acceptProd = true;
                for(const prodKey of prodKeys) {
                    const filtItem = this.filter ? this.filter[prodKey as EnumKeys<T>]: {operation: 'le', values: [0]} /* just to be type-safe */;
                    const oper = filtItem.operation as FilterOperation;
                    const values = filtItem.values;
                    const keyValue = el[prodKey as EnumKeys<T>];
                    acceptProd = (this.filterOperationFunctionsObj[oper])(keyValue, values);
                    if (!acceptProd) {
                        break; // exit for
                    }
                }
                return acceptProd;
            } else {
                return true; // take every product if no filter
            }
        });
        return filtered;
    }
};

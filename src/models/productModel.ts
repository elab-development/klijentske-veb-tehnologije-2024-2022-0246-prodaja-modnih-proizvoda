export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL"

export type EnumKeys<T> = {
    [K in keyof T]: T[K] extends number | string ? K : never;
}[keyof T];

export type ObjectKeysFromEnum<T, P> = {
    [K in EnumKeys<T>]: P; // P is the desired type of the object's properties
};


export class Product {
    productid: number;
    name: string;
    description: string | undefined;
    price: number | undefined;
    image: string | undefined;
    category: string | undefined;
    rating!: {
        rate: number;
        votesCount: number;
    };
    amounts!: ObjectKeysFromEnum<Size, number>;
    recommended: boolean;
    
    constructor(id: number, name: string, description?: string, price?: number, image?: string, category?: string, recommended = false) {
        this.productid = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
        this.recommended = recommended;
        this.rating = {rate: 0, votesCount: 0};
        this.amounts = {"XS": 0, "S": 0, "M": 0, "L": 0, "XL": 0, "XXL": 0}
    }

    public updateAmount = (size: Size, amount: number) => {
        this.amounts[size] = amount;
    }

    public newVote = (vote: number) => {
        this.rating.rate = (this.rating.rate * this.rating.votesCount + vote) / (this.rating.votesCount + 1);
        this.rating.votesCount++;
    }
}
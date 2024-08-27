export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL"

export type EnumKeys<T> = {
    [K in keyof T]: T[K] extends number | string ? K : never;
}[keyof T];

export type ObjectKeysFromEnum<T, P> = {
    [K in EnumKeys<T>]: P; // P is the desired type of the object's properties
};


export class Product {
    productid: number | string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    rating: {
        rate: number;
        votesCount: number;
    };
    amounts: ObjectKeysFromEnum<Size, number>;
    recommended: boolean;
    
    constructor(id: number | string, name: string, description: string, price: number, image: string, category: string, recommended = false,
        amounts = {"XS": 0, "S": 0, "M": 0, "L": 0, "XL": 0, "XXL": 0}) {
        this.productid = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.category = category;
        this.recommended = recommended;
        this.rating = {rate: 0, votesCount: 0};
        this.amounts = amounts;
    }

    public updateAmount = (size: Size, amount: number) => {
        this.amounts[size] = amount;
    }

    public countOfItems = () => {
        let itemsCount = 0;
        Object.keys(this.amounts).forEach((size) => {
            itemsCount += this.amounts[size];
        });
        return itemsCount;
    }

    public newVote = (vote: number) => {
        this.rating.rate = (this.rating.rate * this.rating.votesCount + vote) / (this.rating.votesCount + 1);
        this.rating.votesCount++;
    }

    public addToCart = (amount = 1, size: Size = 'M') => {
        this.updateAmount(size, this.amounts[size] + amount);
    }

    public removeFromCart = (size: Size, amount = 1) => {
        if (this.amounts[size] > 0) {
            this.updateAmount(size, this.amounts[size] - amount);
        }  else {
            alert("Amount of product is already 0.");
        }
    }

    public removeFromCartAllSizes = () => {
        Object.keys(this.amounts).forEach((size) => {this.amounts[size] = 0});
    }
}
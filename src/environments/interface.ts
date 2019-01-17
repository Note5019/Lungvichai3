export interface ItemShop {
    key?: string;
    name: string;
    price: number;
    imageUrl: string;
    imageName: string;
    qty: number;
};

export interface ItemFactory {
    key?: string;
    name: string;
    category: string;
    type: string;
    size: string;
    imageUrl: string;
    imagePath: string;
    qty: number;
    price: number;
};

export interface ItemCategories {
    key?: string;
    name: string;
    type: string[];
};
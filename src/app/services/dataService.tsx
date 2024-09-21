import { TableRow } from "../interface/TableRows";

export const fetchData = async (page: number, limit: number): Promise<TableRow[]> => {
  const response = await fetch(`https://dummyjson.com/products?skip=${page * limit}&limit=${limit}`);
  const data = await response.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.products.map((product: any) => ({
    id: product.id,
    name: product.title,
    category: product.category,
    price: product.price,
    quantity: product.stock,
    isChecked: false
  }));
};

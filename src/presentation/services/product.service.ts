import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";



export class ProductService {

    // DI
    constructor() { }

    public async createProduct(createProductDto: CreateProductDto) {

        const productExists = await ProductModel.findOne({ name: createProductDto.name });
        if (productExists) throw CustomError.badRequest('Product already exists');

        try {

            const newProduct = new ProductModel(createProductDto);
            await newProduct.save();

            return newProduct;

        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Error creating product');
        }


    }

    public async getProducts(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto;

        try {
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category')
            ]);

            return {
                page,
                limit,
                total,
                next: `/api/products?page=${page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/products?page=${page - 1}&limit=${limit}` : null,
                products,
            }

        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Error getting prodcuts');
        }


    }
}

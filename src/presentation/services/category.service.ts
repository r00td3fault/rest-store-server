import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";


export class CategoryService {

    constructor() { }

    public async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {

        const category = await CategoryModel.findOne({ name: createCategoryDto.name });
        if (category) throw CustomError.badRequest('Category already exists');

        try {

            const newCategory = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            });

            await newCategory.save();

            return {
                id: newCategory.id,
                name: newCategory.name,
                available: newCategory.available
            }

        } catch (error) {
            console.log(error);
            throw CustomError.internalServer('Error creating category');
        }

    }


    public async getCategories(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto;

        const [total, categories] = await Promise.all([
            CategoryModel.countDocuments(),
            CategoryModel.find()
                .skip((page - 1) * limit)
                .limit(limit)
        ]);

        return {
            page,
            limit,
            total,
            next: `/api/categories?page=${page + 1}&limit=${limit}`,
            prev: (page - 1 > 0) ? `/api/categories?page=${page - 1}&limit=${limit}` : null,
            categories: categories.map(category => {
                return {
                    id: category.id,
                    name: category.name,
                    available: category.available
                }
            })
        }
    }
}
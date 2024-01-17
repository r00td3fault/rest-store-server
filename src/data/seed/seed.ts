import { envs } from "../../config";
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";



(async () => {
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    await main();


    await MongoDatabase.disconnect();
})();


const randomBetween0AndX = (x: number) => {
    return Math.floor(Math.random() * x);
}


async function main() {

    // 0. Borrar todo
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany(),
    ])

    // 1. Create user
    const newUsers = await UserModel.insertMany(seedData.users);

    // 2. Create categories
    const categories = await CategoryModel.insertMany(
        seedData.categories.map(category => {
            return {
                ...category,
                user: newUsers[randomBetween0AndX(newUsers.length - 1)]._id
            }
        })
    )
    // 3. Create products
    await ProductModel.insertMany(
        seedData.products.map(product => {
            return {
                ...product,
                user: newUsers[randomBetween0AndX(newUsers.length - 1)]._id,
                category: categories[randomBetween0AndX(categories.length - 1)]._id,
            }
        })
    );

    console.log('SEED COMPLETED');
}
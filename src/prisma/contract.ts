import {
  defineContract,
  rel,
} from "@prisma/orm-postgres/contract-builder";

export const contract = defineContract({}, ({ field, model }) => {

  // USER
  const User = model("User", {
    fields: {
      id: field.id.uuidv4Native(),
      name: field.text(),
      email: field.text().unique(),
      password: field.text().optional(),

      googleId: field.text().unique().optional(),
      avatar: field.text().optional(),

      refreshToken: field.text().optional(),
      expiresAt: field.text(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAt(),
    },
  });

  // CATEGORY
  const Category = model("Category", {
    fields: {
      id: field.id.uuidv4Native(),
      name: field.text(),

      description: field.text().optional(),
      image: field.text().optional(),

      isActive: field.boolean().default(true),

      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAt(),
    },
  });

  // PRODUCT
const Product = model("Product", {
  fields: {
    id: field.id.uuidv4Native(),
    name: field.text(),

    description: field.text().optional(),
    price: field.decimal(),

    stock: field.int().default(0),
    image: field.text().optional(),

    isActive: field.boolean().default(true),

    categoryId: field.text().optional(),
    createdAt: field.temporal.createdAtString(),
    updatedAt: field.temporal.updatedAt(),
  },
});

  // CART
  const Cart = model("Cart", {
    fields: {
      id: field.id.uuidv4Native(),

      userId: field.text(),

      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAt(),
    },
  });

  // CART ITEM
  const CartItem = model("CartItem", {
    fields: {
      id: field.id.uuidv4Native(),

      cartId: field.text(),
      productId: field.text(),

      quantity: field.int().default(1),

      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAt(),
    },
  });


  // RETURN CONTRACT
  return {
      models: {
        // User,
        // Category,
        // Product,
        // Cart,
        // CartItem


        User: User.relations({
          cart: rel.hasOne(Cart, {
            by: "userId",
          }),
        }),

        
        Category: Category.relations({
          products: rel.hasMany(Product, {
            by: "categoryId",
          }),
        }),


        Product: Product.relations({
          category: rel.belongsTo(Category, {
            from: "categoryId",
            to: "id",
          }),


          cartItems: rel.hasMany(CartItem, {
            by: "productId",
          }),
        }),



        Cart: Cart.relations({
          user: rel.belongsTo(User, {
            from: "userId",
            to: "id",
          }),


          items: rel.hasMany(CartItem, {
            by: "cartId",
          }),
        }),


        CartItem: CartItem.relations({
          cart: rel.belongsTo(Cart, {
            from: "cartId",
            to: "id",
          }),


          product: rel.belongsTo(Product, {
            from: "productId",
            to: "id",
          }),
        }),
      },
  };
});
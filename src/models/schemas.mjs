export const userSchema = {
    type: "object",
    properties: {
        id: {
            type: "string"
        },
        username: {
            type: "string"
        },
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        cart: {
            type: "array",
            items: {
                type: "object",

                properties: {
                    productId: {
                        type: "string"
                    },
                    quantity: {
                        type: "integer",
                        minimum: 1
                    }
                },
                required: ["productId", "quantity"]
            },
        },
    },
    required: ["id","username", "email", "password", "cart"]
};



export const productSchema = {
  type: "object",

  properties: {
    id: {
      type: "string"
    },

    name: {
      type: "string"
    },

    description: {
      type: "string"
    },

    price: {
      type: "number",
      minimum: 0
    },

    category: {
      type: "string"
    },

    images: {
      type: "array",
      items: {
        type: "string"
      }
    },

    reviews: {
      type: "array",

      items: {
        type: "object",

        properties: {
          userId: {
            type: "string"
          },

          rating: {
            type: "integer",
            minimum: 1,
            maximum: 5
          },

          comment: {
            type: "string"
          }
        },

        required: [
          "userId",
          "rating",
          "comment"
        ]
      }
    }
  },

  required: [
    "id",
    "name",
    "description",
    "price",
    "category",
    "images",
    "reviews"
  ]
};
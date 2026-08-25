const  mongoose =require('mongoose');
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: true,
        match: /^03[0-9]{9}$/
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
        
            },
            quantity: {
                type:Number,
                required:true
            },
            
        price: {
            type: Number,
            required: true  
        },
        },
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,   
        required: true
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"]
    },
},
{timestamps: true}
);
module.exports = mongoose.model("Order", orderSchema);


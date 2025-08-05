const mongoose = require ("mongoose");



const subCategorySchema = new mongoose.Schema ({
    name:{
        type : String,
        trim : [true, "No Spaces"],
        unique : [true, "subCategory must be UNIQUE"],
        minlength : [2, "To short subCategory"],
        maxlength : [32, "To loooooong subCategory"],
    },
    slug:{
        type : String,
        lowercase : [true,"NO CAPITAL"]
    },
    Category : {
        type : mongoose.Schema.ObjectId,
        ref : "Category",
        required : [true , "subCategory must be belong (Parent: Category)"]
    }
},
    {
        timestamps:true
    }
    
);

module.exports = mongoose.model("subCategory",subCategorySchema)
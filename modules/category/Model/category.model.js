const mongoose = require ("mongoose")

const categorySchema = new mongoose.Schema({
    name : {
        type:String,
        required: [true , "Category required"],
        unique: [true , "Category must be unique"],
        minlength : [3, "Too short category name" ],
        maxlength : [32 , "Too long category name"]
    },
    slug : {
        type: String,
        lowercase : true
    },
    image : String,
},{
    timestamps:true
})

const setImgUrl = (doc) =>{
    if(doc.image){
        const ImgURL = `${process.env.BASE_URL}/categories/${doc.image}`
        doc.image = ImgURL
    }
}

categorySchema.post('init',(doc)=>{
    setImgUrl(doc)
})

categorySchema.post('save', (doc) => {
  setImgUrl(doc);
});



const categoryModel = mongoose.model("Category",categorySchema)


module.exports = categoryModel
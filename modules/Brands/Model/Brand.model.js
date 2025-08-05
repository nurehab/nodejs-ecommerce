const mongoose = require ("mongoose")

const brandSchema = new mongoose.Schema({
    name : {
        type:String,
        required: [true , "brand required"],
        unique: [true , "brand must be unique"],
        minlength : [3, "Too short brand name" ],
        maxlength : [32 , "Too long brand name"]
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
        const ImgURL = `${process.env.BASE_URL}/brands/${doc.image}`
        doc.image = ImgURL
    }
}

brandSchema.post('init',(doc)=>{
    setImgUrl(doc)
})

brandSchema.post("save", (doc) => {
  setImgUrl(doc);
});

const brandModel = mongoose.model("brand",brandSchema)


module.exports = brandModel
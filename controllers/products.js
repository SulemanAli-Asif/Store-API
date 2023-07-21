const Product=require('../models/product');


const getAllProductsStatic=async(req,res)=>{
const products=await Product.find({price:{$gt:30}})
.limit(10)
.sort('price')
.skip(4);//skip the first 4 items
    res.status(200).json({products, nbHits:products.length});//nbHits is the number of hits(total responses from the database)
}

const getAllProducts=async(req,res)=>{
    const {featured,company,name,sort,fields,numericFields}= req.query
    const queryObject={};

    if(featured){
        queryObject.featured=featured==='true'?true:false
    }
    if(company)
    {
        queryObject.company=company;
    }
    if(name){
        queryObject.name={$regex:name, $options:'i'};//regex is the regular express that matches a value to another value(strings)
    }
    if(numericFields){
        const operatorMap={
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',            
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        
        let filters=numericFields.replace(
            regEx,
            (match)=>`-${operatorMap[match]}-`
            )
        const options=['price','rating'];
        filters=filters.split(',').forEach((item)=>{//each item is splitted at ","
            const [field,operator,value]=item.split('-')//an item values are splitted at "-"
            if(options.includes(field)){
                queryObject[field]={[operator]:Number(value)}
            }
        })
        console.log(queryObject)
    }

    let result = Product.find(queryObject)
    //sort
    if (sort)
    {
       const sortList=sort.split(',').join(' ')//splitting the values of sort given in the query params then joining them at an empty space
       result=result.sort(sortList)//queryObject found in result be sorted by the values in the sortList
    }
    else{
        result=result.sort('createdAt')
    }
   //fields

   if (fields)
   {
      const fieldsList=fields.split(',').join(' ')//splitting the values of sort given in the query params then joining them at an empty space
      result=result.select(fieldsList)//queryObject found in result be sorted by the values in the sortList
   }
    
   const page=Number(req.query.page)||1;
   const limit = Number(req.query.limit)||10;
   const skip=(page-1)*limit;

   result=result.skip(skip).limit(limit)
   //23
   //4 pages=> 7(pg1),7(pg2),7(pg3),2(pg4)

    const products=await result
    res.status(200).json({nbHits:products.length,products});
}

module.exports={
    getAllProducts,
    getAllProductsStatic
}
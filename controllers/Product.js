const Product =require('../models/Product');


exports.createProduct = async (req, res) => {
    // this product we have to get from API body
    const product = await Product(req.body)
    try{
        product.save();
        res.status(201).json(product);
    }catch(err){
        res.status(400).json(err);
    }

  };

// fetching data as per queries(filter ,sorting and pagination )
  exports.fetchAllProducts = async (req, res) => {
    // here we need all query string
    
    let query =  Product.find({});
    let totalProductsQuery = Product.find({});
    
    if (req.query.category){
        query= query.find({category:req.query.category});
        totalProductsQuery =totalProductsQuery.find({category:req.query.category});
    }
    if(req.query._sort && req.query._order){
        query= query.sort({[req.query._sort]:req.query._order});
    }

    const totalDocs = await totalProductsQuery.count().exec();
    console.log({totalDocs})

    if(req.query._page && req.query._limit){
        const pageSize =req.query._limit;
        const page = req.query._page;   
        query= query.skip(pageSize*(page-1)).limit(pageSize);
    }
    
    try{
        const docs = await query.exec();
        res.set('X-Total-Count',totalDocs)
        res.status(200).json(docs);
    }catch(err){
        res.status(400).json(err);
    }

  };


// fetching data as per productId
  exports.fetchAllProductById = async (req, res) => {
    const {id} = req.params;
    try{
        const product = await Product.findById(id)
        res.status(200).json(product);
    }catch(err){
        res.status(400).json(err);
    }
  };

// update data
  exports.updateProduct = async (req, res) => {
    const {id} = req.params;
    try{
        const product = await Product.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json(product);
    }catch(err){
        res.status(400).json(err);
    }
  };

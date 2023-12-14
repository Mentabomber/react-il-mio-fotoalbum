const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function store(req, res){
    const inputData = req.body;
  
    const newCategory = await prisma.category.create({
      data: {
        type: inputData.type,
        description: inputData.description
      }
    })
  
    return res.json(newCategory);
  }
  
  async function showAllCategories(req, res){
  
    const allCategories = await prisma.category
    .findMany({
      
    })
    
    console.log(allCategories);
    return res.json(allCategories);
  
  }
  
  
  module.exports = {
    store,
    showAllCategories
  } 
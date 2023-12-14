const addUser = async (req,res)=>{
    res.status(200).json({message: "hello from add-user Controller"})
}



module.exports = { addUser}
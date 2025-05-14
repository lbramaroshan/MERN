// // 



// import Address from "../models/Address.js";

// // Add address: POST /api/address/add
// export const addAddress = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const address = req.body;

//     await Address.create({ ...address, userId });

//     res.json({ success: true, message: "Address added successfully" });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get addresses: GET /api/address/get
// export const getAddress = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const addresses = await Address.find({ userId });

//     res.json({ success: true, addresses });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// Add Address : /api/address/add
import Address from "../models/Address.js";


export const addAddress = async(req,res)=>{
  try {
    const {address} = req.body;
    await Address.create({...address,userId:req.userId});
    res.json({success:true,message:"Address added successfully"})
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}





// Get Address : /api/address/get
export const getAddress = async(req,res)=>{
  try {
    const {userId} = req.params;
    const addresses = await Address.find({userId:req.userId});
    res.json({success:true,addresses})
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message})
  }
}

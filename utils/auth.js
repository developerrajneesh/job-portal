
import  jwt  from'jsonwebtoken';

const auth = async (req, res, next) =>{
    try {
       
        const token = req.headers.authorization.split(" ")[1]
        const isCustomAuth = token.length < 500;
  
        let decodedData;
  
        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.JWT_KEY)
            req.userId = decodedData?.id
        }else{
            decodedData = jwt.decode(token)
            
            req.userId = decodedData?.sub;
            // sub is googles id 
        }
        next()
    } catch (error) {
        console.log("there is some error in backend side", error)
        res.send({success:false, message:"Token is invalid or expired"})
    }
  }
  
  export default auth
import {NextFunction, Request, Response} from 'express'
import  Jwt, { JwtPayload }  from 'jsonwebtoken'
import { UserInstance, UserModel} from '../models/userModel'

export const authMiddleware = async (req: JwtPayload, res: Response, next: NextFunction) =>{
   try {
    const authorization = req.headers.authorization
    if(!authorization){
      return  res.status(401).json({
            message: "Kindly signin as a user"
        })
    }
    const token = authorization.slice(7, authorization.length)
    let verified = Jwt.verify(token, process.env.SECRET!)
    // console.log(verified)
    if(!verified){
        return  res.status(401).json({
            message: "User not authorized"
        })
    }
    
    const {id} = verified as {[key:string]: string}
    
    // Find the user by id
    const user = await UserModel.find({where:{_id:id}}) as unknown as UserInstance
    if(!user){
        return  res.status(401).json({
            Error: "Invalid Credentials"
        })
    }
    // console.log('here', user);
    req.user = verified;
    next()
   } catch (error) {
    return  res.status(401).json({
        Error: `Internal server ${error}`,
        route: "/product/authMiddleware"
    })
   }
}

export const isAdmin = async (req: JwtPayload, res: Response, next: NextFunction)=>{
    const { email } = req.user
    const adminUser = await UserModel.findOne({email})

    if(adminUser?.role !== "admin"){
        return  res.status(401).json({
            Error: "You are not an admin"
        })
    }
    next()
}
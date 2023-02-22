import Jwt, { JwtPayload } from 'jsonwebtoken'
 
 //generating token or signature for the user.
 export const GenerateRefreshToken = async (_id: any) => {
    return Jwt.sign({_id}, process.env.SECRET!, { expiresIn: "1d" }); //for week use 'w', for month use 'm', for day use 'd', for minutes use 'min', for hour use 'hour'
  };
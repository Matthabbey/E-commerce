import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'

// Generating of salt code

export const GenerateSalt = async () => {
    return await bcrypt.genSalt();
  };
  
  export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
  };

  export const validatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
  ) => {
    return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
  };

 //generating token or signature for the user.
export const GenerateSignature = async (payload: AuthPayload) => {
  return Jwt.sign(payload, APP_SECRET, { expiresIn: "1d" }); //for week use 'w', for month use 'm', for day use 'd', for minutes use 'min', for hour use 'hour'
};
//Verifying the signature of the user before allowing login
export const verifySignature = async (signature: string) => {
  return Jwt.verify(signature, APP_SECRET) as unknown as JwtPayload;
};
import mongoose from "mongoose"; // Erase if already required

interface InstanceCoupon {
    name: string,
    expiry: Date,
    discount: string
}
// Declare the Schema of the Mongo model
const couponSchema = new mongoose.Schema<InstanceCoupon>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  discount: {
    type: String,
    required: true,
  }
});

//Export the model
export const CouponModel = mongoose.model<InstanceCoupon>("Coupon", couponSchema);

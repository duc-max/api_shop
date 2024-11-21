import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "any.required": "name là trường bắt buộc",
    "string.empty": "name không được bỏ trống",
  }),
  username: Joi.string().required().trim().messages({
    "any.required": "Username là trường bắt buộc",
    "string.empty": "Username không được bỏ trống",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email là trường bắt buộc",
    "string.email": "Email không hợp lệ",
  }),
  phone: Joi.string().max(10).required().messages({
    "any.required": "phone không được bỏ trống",
    "string.min": "phone phải có ít nhất {#limit} ký tự",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "Password không được bỏ trống",
    "string.min": "Password phải có ít nhất {#limit} ký tự",
  }),
  img: Joi.string().allow(""),
  gender: Joi.string().valid("male", "female", "other").messages({
    "string.valid": "Gender phải là 'male', 'female' hoặc 'other'",
  }),
  dob: Joi.string().messages({
    "any.required": "DOB không được bỏ trống",
  }),
});

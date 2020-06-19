const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { hash, compare } = require('bcryptjs')

var userSchema = mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		trim: true,
		unique: true,
		required: true
	},
	password: {
        type: String,
        required: true
	},
	isAdmin: {
        type: Boolean,
        default:false
    }
},{ timestamps: { createdAt: 'created_at' }})


userSchema.pre('save', async function () {
	if (this.isModified('password')) this.password = await hash(this.password, 12)
  })

userSchema.methods = {
	authenticate: async function (password) {
		return await compare(password, this.password)
	},
	getToken: function () {
		return jwt.sign({id:this._id,email: this.email,isAdmin:this.isAdmin}, config.secret, {expiresIn: '1d'});
	}
}

module.exports = mongoose.model('User', userSchema);
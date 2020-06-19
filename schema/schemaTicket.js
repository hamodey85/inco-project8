const mongoose = require('mongoose');

var commentsSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{ timestamps: { createdAt: 'created_at' }})

var ticketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
	description: {
		type: String,
		required: true
	},
	responsible: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref:"User"
    },
    priority: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    comments: [commentsSchema],
},{ timestamps: { createdAt: 'created_at' }})


ticketSchema.methods = {
	getId: function () {
        return this.id;
    }
}

module.exports = mongoose.model('Ticket', ticketSchema);
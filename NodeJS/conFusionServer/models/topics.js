const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    author: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const topicSchema = new Schema ({
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    author: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema]
},{
    timestamps: true
});

var Topics = mongoose.model('Topic', topicSchema);

module.exports = Topics;
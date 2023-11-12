const mongoose = require ('mongoose');
const validateMongodbid = (id => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error ('this token is not valid or not found!')
})

module.exports = {validateMongodbid};
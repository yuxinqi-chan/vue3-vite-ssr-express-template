const {db} = require('../mongodb');

async function getPosts() {
    return await db.collection('posts').find().toArray();
}

module.exports = {
    getPosts
};

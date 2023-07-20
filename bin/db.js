/**
 * 
 * @param {*} success 数据库连接成功的回调
 * @param {*} error 数据库连接失败的回调
 */
module.exports = function (success, error) {
    const mongoose = require('mongoose');
    //连接mongodb服务
    mongoose.connect('mongodb://127.0.0.1:27017/main');
    //设置连接成功回调
    mongoose.connection.once('open', () => {
        success();
    });
    //设置连接失败回调
    mongoose.connection.on('error', () => {
        error();
    });
    //设置连接关闭回调
    mongoose.connection.on('close', () => {
        console.log('mongodb连接关闭');
    });
}

/**
 *         console.log('mongodb连接成功');
        let MainSchema = new mongoose.Schema({
            count: Number,
        });
        let _MainSchema = mongoose.model('test', MainSchema);

        _MainSchema.create({
            count: 0,
        }), (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(data);
        }
 */
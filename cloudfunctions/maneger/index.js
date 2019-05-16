// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { type, data } = event;
  switch (type) {
    case 'DeteleItem': {
      const { _id } = data
      const result = await db.collection('check').doc(_id).remove();

      return {
        result
      }
    }

 
  }}
## IndexedDB 操作工具类

IndexedDB 操作工具类共返回10个方法，分别如下：

- 初始化方法(init)
- 添加数据方法(set)
- 更新单条或多条数据方法(updateData)
- 遍历数据表里所有的数据(getAllData)
- 获取数据表里单条数据(getData)
- 删除数据库(deleteDB)
- 关闭数据库(closeDB)
- 删除某一条记录(deleteData)
- 删除存储空间全部记录(clearData)
- 数据查询(searchData)

**要调用其他方法必须先初始化数据库。总大小无限制，但因浏览器机制限制，单条数据大小不超过130M。**

## 调用方式

### npm 安装

```
npm install indexedDB
```

## 初始化方法

```javascript
var dbObject = {
    dbName: 'userInfo', // 数据库名
    version: 1, // 版本号
    primaryKey: 'id', // 主键
    keyNames: [{ // 需要存储的数据字段对象
    	key: 'name', // 字段名
    	unique: false // 当前这条数据是否能重复 (最常用) 默认false
    }]
};

var userInfo = new IndexedDB(dbObject); 
userInfo.init();
```

## 添加数据方法

```javascript
/**
* 添加数据
* @param {Array || Object} option 存入数据库的数据
*/

userInfo.set(option)
```

## 更新单条或多条数据方法

```javascript
/**
* 更新单条或多条数据
* @param  {Array || object} option       更新的数据
* @return {[type]}              [description]
*/

userInfo.updateData(option)
```

## 遍历数据表里所有的数据

```javascript
/**
* 遍历数据表里所有的数据
* @return {Array || Obiect}             返回数据表里所有的数据
*/

userInfo.getAllData()
```

## 获取数据表里单条数据

```javascript
/**
* 获取数据表里单条数据
* @param  {String || Number} value        数据字段的值（按主键搜索）
* @return {[type]}              [description]
*/

userInfo.getData(valve)
```

## 删除数据库

```javascript
/**
* 删除数据库
* @return {[type]}              [description]
*/
userInfo.deleteDB()
```

## 关闭数据库

```javascript
/**
* 关闭数据库
* @return {[type]} [description]
*/
userInfo.closeDB()
```

## 删除某一条记录

```javascript
/**
* 删除某一条记录
* @param  {String || Number} value        主键的值
* @return {[type]}              [description]
*/

userInfo.deleteData(valve)
```

## 删除存储空间全部记录

```javascript
/**
* 删除存储空间全部记录
* @return {[type]}              [description]
*/

userInfo.clearData()
```

## 数据查询

```javascript
/**
* 数据查询
* @param  {String} key          数据字段名
* @param  {String || Number} value        按字段查询的值
* @return {[type]}              [description]
*/
userInfo.searchData(key, value)
```

## 兼容性

Chrome、Edge、Firefox 、Internet Explorer9+、Opera、Safari 
/**
 * IndexedDB 操作工具类，
 * 初始化数据库(init)
 * 新曾数据(set)  更新数据(updateData)
 * 获取数据(getData)  获取所有数据(getAllData)
 * 删除数据库(deleteDB) 关闭数据库(closeDB) 删除某条数据(deleteData) 删除数据库所有数据(clearData)
 * 搜索数据(searchData)
 * 
 */
  // 实例参数
  // var option = {
  //   dbName: '', // 数据库名
  //   version: 1, // 数据库版本号
  //   primaryKey: 'id' // 需要保存的数据字段
  //   keyNames: [{ // 需要保存的数据字段
  //     key: '', // 字段名
  //     unique: // 当前这条数据是否能重复 (最常用) 默认false
  //   }]
  // };
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS
    module.exports = factory();
  } else {
    // 浏览器全局变量(root 即 window)
    root.IndexedDB = factory();
  }
}(this, function() {
  /**
   * 数据库对象
   * @param {[type]} option [description]
   */
  // var option = {
  //   dbName: '', // 数据库名
  //   version: 1, // 数据库版本号
  //   primaryKey: 'id' // 需要保存的数据字段
  //   keyNames: [{ // 需要保存的数据字段
  //     key: '', // 字段名
  //     unique: // 当前这条数据是否能重复 (最常用) 默认false
  //   }] 
  // };
  var IndexedDB = function IndexedDB(option) {
    // 设置unique默认值为false
    var list
    if (option.keyNames) {
      list = option.keyNames
      for (var i = 0; i < list.length; i++) {
        if (!list[i].unique) {
          list[i].unique = false;
        }
      }
    }

    this.dbName = option.dbName;
    this.version = option.version;
    this.primaryKey = option.primaryKey || 'id';
    this.keyNames = option.keyNames;
    this.db = null; // 存储数据库对象
    this.allData = []; // 存储返回的所有数据
  }

  IndexedDB.prototype = {
    /**
     * 初始化数据库
     * @return {[type]} [description]
     */
    init: function() {
      var _this = this;
      var dbName = _this.dbName,
        version = _this.version,
        primaryKey = _this.primaryKey,
        keyNames = _this.keyNames;

      var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

      // 判断浏览器是否支持indexedDB
      if (!indexedDB) {
        window.alert("您的浏览器不支持当前内容");
        return false;
      }

      // 判断数据库名称是否为空
      if (!dbName) {
        window.alert("数据库名称不能为空");
        return false;
      }

      // 打开数据库
      var DBOpenRequest = window.indexedDB.open(dbName, version);

      // 数据库打开成功
      DBOpenRequest.onsuccess = function(event) {
        _this.db = DBOpenRequest.result;
      };

      // 数据库打开失败
      DBOpenRequest.onerror = function(event) {
        window.alert('数据库打开失败');
      };

      // 首次创建或者版本变更（更高版本）
      DBOpenRequest.onupgradeneeded = function(event) {
        _this.db = event.target.result;
        _this.db.onerror = function(event) {
          window.alert('数据库打开失败');
        };

        // 创建一个数据库存储对象
        /*
          // createIndex的语法
          objectStore.createIndex(indexName, keyPath, {
          unique: false,  // true
          multiEntry: false,  // 如果为true，同时keyPath是数组元素，则所以会加到所有数组元素上
          locale: 'auto'  // 目前仅Firefox支持，可以是字符串，类似en-US, 或 zh，也可以是auto或者null, undefined
        })
        */

        if (!_this.db.objectStoreNames.contains(dbName)) {
          var objectStore = _this.db.createObjectStore(dbName, {
            keyPath: primaryKey,
            autoIncrement: true
          });
        }

        keyNames.forEach(function(currentValue, index, array) {

          /**
           * 创建索引
           * @string indexName 设置当前 index 的名字
           * @string property 从存储数据中，指明 index 所指的属性。
           * @string property 从存储数据中，指明 index 所指的属性。
           * @object options options 有三个选项：
           * unique: 当前这条数据是否能重复 (最常用) 
           * multiEntry: 设置当前的 property 为数组时，会给数组里面每个元素都设置一个 index 值。
           * locale：目前仅支持Firefox（43+），这允许您为索引指定区域设置。
           */
          // objectStore.createIndex('indexName', 'property', options);
          objectStore.createIndex(currentValue.key, currentValue.key, {
            unique: currentValue.unique || false
          });
        });
      };
    },

    /**
     * 添加数据
     * @param {Array || Object} option 存入数据库的数据
     */
    set: function(option) {
      var _this = this;
      var dbName = _this.dbName,
        version = _this.version,
        db = _this.db,
        primaryKey = _this.primaryKey,
        keyNames = _this.keyNames;

      var transaction = db.transaction([dbName], 'readwrite');
      var objectStore = transaction.objectStore(dbName);

      if (Array.isArray(option)) {
        for (var i = 0; i < option.length; i++) {
          objectStore.add(option[i]).onsuccess = function(event) {
            console.log('数据写入成功');
          };

          transaction.onerror = function(event) {
            console.log('数据库中已有该数据');
          }
        }
      } else {
        objectStore.add(option).onsuccess = function(event) {
          console.log('数据写入成功');
        };

        transaction.onerror = function(event) {
          console.log('数据库中已有该数据');
        }
      }
    },

    /**
     * 更新单条或多条数据
     * @param  {Array || object} option       更新的数据
     * @return {[type]}              [description]
     */
    updateData: function(option) {
      var _this = this;
      var dbName = _this.dbName;

      var transaction = _this.db.transaction([dbName], 'readwrite');
      var objectStore = transaction.objectStore(dbName);

      if (Array.isArray(option)) {
        for (var i = 0; i < option.length; i++) {
          objectStore.put(option[i]).onsuccess = function(event) {
            console.log('数据更新成功');
          };

          transaction.onerror = function(event) {
            console.log('数据更新成功');
          }
        }
      } else {
        objectStore.put(option).onsuccess = function(event) {
          console.log('数据更新成功');
        };

        transaction.onerror = function(event) {
          console.log('数据更新成功');
        }
      }
    },

    /**
     * 遍历数据表里所有的数据
     * @return {Array || Obiect}             返回数据表里所有的数据
     */
    getAllData: function() {
      var _this = this
      var dbName = _this.dbName;
      _this.allData = [];
      var objectStore = _this.db.transaction(dbName).objectStore(dbName);
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          console.log(cursor.value);
          _this.allData.push(cursor.value);
          cursor.continue();
        }
      };
      return _this.allData;
    },

    /**
     * 获取数据表里单条数据
     * @param  {String || Number} value        数据字段的值（按主键搜索）
     * @return {[type]}              [description]
     */
    getData: function(value) {
      var _this = this;
      var dbName = _this.dbName;
      var objectStore = _this.db.transaction(dbName).objectStore(dbName);
      var request = objectStore.get(value);

      request.onerror = function(event) {
        console.log('获取失败');
      };

      request.onsuccess = function(event) {
        if (request.result) {
          console.log(request.result);
          return request.result;
        } else {
          console.log('未获得数据记录');
        }
      };
    },

    /**
     * 删除数据库
     * @return {[type]}              [description]
     */
    deleteDB: function() {
      var _this = this;
      var dbName = _this.dbName;
      window.indexedDB.deleteDatabase(dbName);
      console.log(dbName + '数据库已删除');
    },

    /**
     * 关闭数据库
     * @return {[type]} [description]
     */
    closeDB: function() {
      var _this = this;
      _this.db.close();
      console.log('数据库已关闭');
    },

    /**
     * 删除某一条记录
     * @param  {String || Number} value        主键的值
     * @return {[type]}              [description]
     */
    deleteData: function(value) {
      var _this = this;
      var dbName = _this.dbName;
      var request = _this.db.transaction(dbName, 'readwrite')
        .objectStore(dbName)
        .delete(value);

      request.onsuccess = function(event) {
        console.log('删除成功');
      };
    },

    /**
     * 删除存储空间全部记录
     * @return {[type]}              [description]
     */
    clearData: function() {
      var _this = this;
      var dbName = _this.dbName;
      var store = _this.db.transaction(dbName, 'readwrite').objectStore(dbName);
      store.clear();
      console.log('已删除存储空间' + dbName + '全部记录');
    },

    /**
     * 数据查询
     * @param  {String} key          数据字段名
     * @param  {String || Number} value        按字段查询的值
     * @return {[type]}              [description]
     */
    searchData: function(key, value) {
      var _this = this;
      var dbName = _this.dbName;
      var store = _this.db.transaction(dbName, 'readonly').objectStore(dbName);
      var index = store.index(key);
      var request = index.get(value);

      request.onerror = function() {
        console.error('搜索出错');
        return false;
      };

      request.onsuccess = function(e) {
        var result = e.target.result;
        if (result) {
          console.log(result);
          return result;
        } else {
          console.log('您搜索的数据不存在');
          return false;
        }
      }
    }
  };
  return IndexedDB;
}));
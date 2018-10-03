(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios'), require('qs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'axios', 'qs'], factory) :
  (factory((global.remote = {}),global.axios,global.qs));
}(this, (function (exports,axios,qs) { 'use strict';

  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;
  qs = qs && qs.hasOwnProperty('default') ? qs['default'] : qs;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var RemoteInstance =
  /*#__PURE__*/
  function () {
    function RemoteInstance(options) {
      _classCallCheck(this, RemoteInstance);

      var accessToken = options.accessToken,
          url = options.url,
          headers = options.headers,
          accessTokenType = options.accessTokenType,
          version = options.version,
          maxFileSize = options.maxFileSize;
      this.accessTokenType = accessTokenType || 'header';
      this.accessToken = accessToken;
      this.headers = headers || {};
      this.version = version || '1.1';
      this.maxFileSize = maxFileSize;

      if (!url) {
        throw new Error('No Directus URL provided');
      } // TEMP FIX FOR BACKWARD COMPATIBILTY


      var _url = url.replace('/api/1.1', '');

      this.base = _url.replace(/\/+$/, '');
      this.api = this.base + '/api/';
      this.url = this.api + this.version + '/';
    }

    _createClass(RemoteInstance, [{
      key: "_onCaughtError",
      value: function _onCaughtError(resolve, reject, err) {
        if (err.response && err.response.data) {
          return reject(err.response.data);
        }

        return reject(err);
      }
    }, {
      key: "_get",
      value: function _get$$1(endpoint) {
        var _this = this;

        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var isAPI = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        var headers = this._requestHeaders;
        var url = isAPI ? this.api : this.url;
        this.setAccessTokenParam(params);
        return new Promise(function (resolve, reject) {
          axios.get(url + endpoint, {
            params: params,
            headers: headers,
            paramsSerializer: function paramsSerializer(params) {
              return qs.stringify(params, {
                arrayFormat: 'brackets',
                encode: false
              });
            }
          }).then(function (res) {
            return resolve(res.data);
          }).catch(function (err) {
            return _this._onCaughtError(resolve, reject, err);
          });
        });
      }
    }, {
      key: "_post",
      value: function _post(endpoint) {
        var _this2 = this;

        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var isAPI = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var headers = this._requestHeaders;
        var url = isAPI ? this.api : this.url;
        this.setAccessTokenParam(params);
        return new Promise(function (resolve, reject) {
          axios.post(url + endpoint, data, {
            headers: headers,
            params: params,
            maxContentLength: _this2.maxFileSize
          }).then(function (res) {
            return resolve(res.data);
          }).catch(function (err) {
            return _this2._onCaughtError(resolve, reject, err);
          });
        });
      }
    }, {
      key: "_put",
      value: function _put(endpoint) {
        var _this3 = this;

        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var isAPI = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var headers = this._requestHeaders;
        var url = isAPI ? this.api : this.url;
        this.setAccessTokenParam(params);
        return new Promise(function (resolve, reject) {
          axios.put(url + endpoint, data, {
            headers: headers,
            params: params,
            maxContentLength: _this3.maxFileSize
          }).then(function (res) {
            return resolve(res.data);
          }).catch(function (err) {
            return _this3._onCaughtError(resolve, reject, err);
          });
        });
      }
    }, {
      key: "_delete",
      value: function _delete(endpoint) {
        var _this4 = this;

        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var isAPI = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var headers = this._requestHeaders;
        var url = isAPI ? this.api : this.url;
        this.setAccessTokenParam(params);
        return new Promise(function (resolve, reject) {
          axios.delete(url + endpoint, {
            headers: headers,
            data: data,
            params: params
          }).then(function (res) {
            return resolve(res.data);
          }).catch(function (err) {
            return _this4._onCaughtError(resolve, reject, err);
          });
        });
      } // Authentication
      // -------------------------------------------

    }, {
      key: "authenticate",
      value: function authenticate() {
        var _this5 = this;

        var email = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('email');
        var password = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('password');
        return new Promise(function (resolve, reject) {
          _this5._post('auth/request-token', {
            email: email,
            password: password
          }).then(function (res) {
            if (res.success) {
              _this5.accessToken = res.data.token;
              return resolve(res);
            }

            return reject(res);
          }).catch(function (err) {
            return reject(err);
          });
        });
      }
    }, {
      key: "deauthenticate",
      value: function deauthenticate() {
        this.accessToken = null;
      } // Items
      // ----------------------------------------------------------------------------------

    }, {
      key: "createItem",
      value: function createItem() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return this._post("tables/".concat(table, "/rows"), data, params);
      }
    }, {
      key: "getItems",
      value: function getItems() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._get("tables/".concat(table, "/rows"), params);
      }
    }, {
      key: "getItem",
      value: function getItem() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('id');
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return this._get("tables/".concat(table, "/rows/").concat(id), params);
      }
    }, {
      key: "updateItem",
      value: function updateItem() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('id');
        var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : requiredParam('data');
        var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        return this._put("tables/".concat(table, "/rows/").concat(id), data, params);
      }
    }, {
      key: "deleteItem",
      value: function deleteItem() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('id');
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return this._delete("tables/".concat(table, "/rows/").concat(id), {}, params);
      }
    }, {
      key: "createBulk",
      value: function createBulk() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');

        if (Array.isArray(data) === false) {
          throw new TypeError("Parameter data should be an array of objects");
        }

        return this._post("tables/".concat(table, "/rows/bulk"), {
          rows: data
        });
      }
    }, {
      key: "updateBulk",
      value: function updateBulk() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');

        if (Array.isArray(data) === false) {
          throw new TypeError("Parameter data should be an array of objects");
        }

        return this._put("tables/".concat(table, "/rows/bulk"), {
          rows: data
        });
      }
    }, {
      key: "deleteBulk",
      value: function deleteBulk() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');

        if (Array.isArray(data) === false) {
          throw new TypeError("Parameter data should be an array of objects");
        }

        return this._delete("tables/".concat(table, "/rows/bulk"), {
          rows: data
        });
      } // Files
      // ----------------------------------------------------------------------------------

    }, {
      key: "createFile",
      value: function createFile() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return this._post('files', data);
      }
    }, {
      key: "getFiles",
      value: function getFiles() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return this._get('files', params);
      }
    }, {
      key: "getFile",
      value: function getFile() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        return this._get("files/".concat(id));
      }
    }, {
      key: "updateFile",
      value: function updateFile() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');
        return this._put("files/".concat(id), data);
      }
    }, {
      key: "deleteFile",
      value: function deleteFile() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        return this._delete("files/".concat(id));
      } // Tables
      // ----------------------------------------------------------------------------------

    }, {
      key: "createTable",
      value: function createTable() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('name');
        return this._post('tables', {
          name: name
        });
      }
    }, {
      key: "getTables",
      value: function getTables() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return this._get('tables', params);
      }
    }, {
      key: "getTable",
      value: function getTable() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._get("tables/".concat(table), params);
      } // Columns
      // ----------------------------------------------------------------------------------

    }, {
      key: "createColumn",
      value: function createColumn() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._post("tables/".concat(table, "/columns"), data);
      }
    }, {
      key: "getColumns",
      value: function getColumns() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._get("tables/".concat(table, "/columns"), params);
      }
    }, {
      key: "getColumn",
      value: function getColumn() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var column = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('column');
        return this._get("tables/".concat(table, "/columns/").concat(column));
      }
    }, {
      key: "updateColumn",
      value: function updateColumn() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var column = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('column');
        var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return this._put("tables/".concat(table, "/columns/").concat(column), data);
      }
    }, {
      key: "deleteColumn",
      value: function deleteColumn() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var column = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('column');
        return this._delete("tables/".concat(table, "/columns/").concat(column));
      } // Groups
      // ----------------------------------------------------------------------------------

    }, {
      key: "createGroup",
      value: function createGroup() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('name');
        return this._post('groups', {
          name: name
        });
      }
    }, {
      key: "getGroups",
      value: function getGroups() {
        return this._get('groups');
      }
    }, {
      key: "getGroup",
      value: function getGroup() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        return this._get("groups/".concat(id));
      } // Privileges
      // ----------------------------------------------------------------------------------

    }, {
      key: "createPrivileges",
      value: function createPrivileges() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._post("privileges/".concat(id), data);
      }
    }, {
      key: "getPrivileges",
      value: function getPrivileges() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        return this._get("privileges/".concat(id));
      }
    }, {
      key: "getTablePrivileges",
      value: function getTablePrivileges() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        var table = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('table');
        return this._get("privileges/".concat(id, "/").concat(table));
      }
    }, {
      key: "updatePrivileges",
      value: function updatePrivileges() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        var table = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('table');
        return this._get("privileges/".concat(id, "/").concat(table));
      } // Preferences
      // ----------------------------------------------------------------------------------

    }, {
      key: "getPreferences",
      value: function getPreferences() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        return this._get("tables/".concat(table, "/preferences"));
      }
    }, {
      key: "updatePreference",
      value: function updatePreference() {
        var table = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('table');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._update("tables/".concat(table, "/preferences"), data);
      } // Messages
      // ----------------------------------------------------------------------------------

    }, {
      key: "getMessages",
      value: function getMessages() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return this._get('messages/rows', params);
      }
    }, {
      key: "getMessage",
      value: function getMessage() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        return this._get("messages/rows/".concat(id));
      }
    }, {
      key: "sendMessage",
      value: function sendMessage() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('data');
        return this._post('messages/rows/', data);
      } // Activity
      // ----------------------------------------------------------------------------------

    }, {
      key: "getActivity",
      value: function getActivity() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return this._get('activity', params);
      } // Bookmarks
      // ----------------------------------------------------------------------------------

    }, {
      key: "getBookmarks",
      value: function getBookmarks() {
        return this._get('bookmarks');
      }
    }, {
      key: "getUserBookmarks",
      value: function getUserBookmarks() {
        return this._get('bookmarks/self');
      }
    }, {
      key: "getBookmark",
      value: function getBookmark() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        return this._get("bookmarks/".concat(id));
      }
    }, {
      key: "createBookmark",
      value: function createBookmark() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('data');
        return this._post('bookmarks', data);
      }
    }, {
      key: "deleteBookmark",
      value: function deleteBookmark() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        return this._delete("bookmarks/".concat(id));
      } // Settings
      // ----------------------------------------------------------------------------------

    }, {
      key: "getSettings",
      value: function getSettings() {
        return this._get('settings');
      }
    }, {
      key: "getSettingsByCollection",
      value: function getSettingsByCollection() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('name');
        return this._get("settings/".concat(name));
      }
    }, {
      key: "updateSettings",
      value: function updateSettings() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('name');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._put("settings/".concat(name), data);
      } // Users
      // ----------------------------------------------------------------------------------

    }, {
      key: "getUsers",
      value: function getUsers() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return this._get('users', params);
      }
    }, {
      key: "getUser",
      value: function getUser() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        return this._get("users/".concat(id));
      }
    }, {
      key: "getMe",
      value: function getMe() {
        return this._get("users/me");
      }
    }, {
      key: "createUser",
      value: function createUser() {
        var user = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('user');
        return this._post('users', user);
      }
    }, {
      key: "updateUser",
      value: function updateUser() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('id');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');
        return this._put("users/".concat(id), data);
      }
    }, {
      key: "updateMe",
      value: function updateMe() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('data');
        return this._put('users/me', data);
      } // WARNING: Updating user password doesn't check strength or length

    }, {
      key: "updatePassword",
      value: function updatePassword() {
        var password = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('password');
        return this._put('users/me', {
          password: password
        });
      } // API Endpoints
      // ----------------------------------------------------------------------------------

    }, {
      key: "getApi",
      value: function getApi() {
        var api_endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('api_endpoint');
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._get(api_endpoint, params, true);
      }
    }, {
      key: "postApi",
      value: function postApi() {
        var api_endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('api_endpoint');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return this._post(api_endpoint, data, params, true);
      }
    }, {
      key: "putApi",
      value: function putApi() {
        var api_endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('api_endpoint');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');
        return this._put(api_endpoint, data, true);
      }
    }, {
      key: "deleteApi",
      value: function deleteApi() {
        var api_endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('api_endpoint');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : requiredParam('data');
        return this._delete(api_endpoint, data, true);
      } // Hash
      // ----------------------------------------------------------------------------------

    }, {
      key: "getHash",
      value: function getHash() {
        var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : requiredParam('string');
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return this._post('hash', data);
      } // Random
      // ----------------------------------------------------------------------------------

    }, {
      key: "getRandom",
      value: function getRandom() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return this._post('random', {}, params);
      }
    }, {
      key: "setAccessTokenParam",
      value: function setAccessTokenParam(params) {
        if (this.accessToken && this.accessTokenType === 'parameter') {
          params.access_token = this.accessToken;
        }
      }
    }, {
      key: "_requestHeaders",
      get: function get() {
        var headers = Object.assign({}, this.headers);

        if (this.accessToken && this.accessTokenType === 'header') {
          headers.Authorization = 'Bearer ' + this.accessToken;
        }

        return headers;
      }
    }]);

    return RemoteInstance;
  }();

  function requiredParam(name) {
    throw new Error("Missing parameter [".concat(name, "]"));
  }

  var remote = RemoteInstance;

  var directusSdkJavascript = {
    RemoteInstance: remote
  };
  var directusSdkJavascript_1 = directusSdkJavascript.RemoteInstance;

  exports.default = directusSdkJavascript;
  exports.RemoteInstance = directusSdkJavascript_1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

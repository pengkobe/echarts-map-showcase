'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1509068494645_6709';

  // add your config here
  config.middleware = [];

  // https://github.com/eggjs/egg-static
  config.static = {
    prefix: '/',
  };

  config.security={
    csrf: {
      enable: false // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    }
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials:true
  };


  return config;
};

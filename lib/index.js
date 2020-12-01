const compose = (middlewares) => {
  if (!Array.isArray(middlewares)) {
    throw new TypeError('middlewares should be a Array');
  }

  for (const fn of middlewares) {
    if (typeof fn !== 'function') {
      throw new TypeError('middleware should be a function');
    }
  }

  return (ctx, next) => {
    let index = -1;
    return dispatch(0);
    function dispatch (i) {
      if (i <= index) Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middlewares[0]
      // 处理没有fn的情况，也就是使用use时不传中间件
      if (!fn) return Promise.resolve()
      // 处理next
      if (i === middlewares.length) fn = next;
      try {
        // 递归，洋葱模型的重点
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (error) {
        return Promise.reject(error)
      }
    }
  };

};

module.exports = compose;
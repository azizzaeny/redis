
var first = (seq) => seq[0];
var lowerCase = (str) =>  str.toLowerCase();
var isFn = (value) => typeof value === 'function';
var isString = (value) => typeof value === 'string';
var concat=(...args)=>{
  let [arr1, ...rest] = args;
  if (args.length === 1) {
    return (...rest) => concat(arr1, ...rest);
  }
  return arr1.concat(...rest)
}
var peek = (stack) => stack[stack.length - 1];
var pop = (stack) => stack.slice(0, -1);
var rest = (seq) => seq.slice(1);
var isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
var map = (...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return coll => map(fn, coll);
  }
  return arr.map(fn);
}

var stringify = (data) => {
  return isObject(data) ? JSON.stringify(data) : (!isString(data) ? data.toString() : data);
}

var parseResult = (type) => (result) => {
  if(!result) return result;
  if(type === 'json.get'){
    let res = JSON.parse(result);    
    return isObject(res) ? res : first(res);
  }
  if(type === 'json.mget'){
    return map((r) => (r ? first(JSON.parse(r)) : r), result);
  }
  return result;
};

var commandType = {
  'json.set': (args) => { 
    let [_, key, path, value  ] = args; 
    return ['JSON.SET', key, path, stringify(value)];  
  },
  'json.get': (args) =>{
    let [_, key, path] = args;
    return (path) ? ['JSON.GET', key, path] : ['JSON.GET', key];
  },
  'json.mget': (args) => {
    let path = peek(args) || '$';
    let keys = pop(rest(args));    
    return concat(['JSON.MGET'], keys, path);
  }
}

var transformCommand = (commands) => {
  let resolve = commandType[lowerCase(first(commands))];
  if(resolve) return resolve(commands);
  return commands;
}

var command = (...args) =>{
  let [commands, client] = args;
  if (args.length === 1) return (client) => command(commands, client);
  let type = lowerCase(first(commands));  
  let adaptCommand = transformCommand(commands);
  if(isFn(client)) (client = client());
  return client.sendCommand(adaptCommand).then(parseResult(type));
}

var createRedis = (url) => require('redis').createClient({ url });

var connectRedis = (client, onError) => {
  if(!onError) onError = ((err) => console.log('redis error'));
  // client.on('error', onError);
  return client.connect();  
}

var disconnectRedis = (client) => client.disconnect();

module.exports = {command, createRedis, connectRedis, disconnectRedis};

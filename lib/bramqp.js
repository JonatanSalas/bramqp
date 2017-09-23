const pkgInfo = require('pkginfo');
const ConnectionHandler = require('./connectionHandle');

pkgInfo(module);

class BramQP {
    static initialize(socket, spec, callback) {
        const callbackOrPromise = handler => callback ? callback(null, handler) : Promise.resolve(handler);
        const handler = new ConnectionHandler(socket, spec);

        if (socket.readyState === 'open') {
            handler.once('init', _ => callbackOrPromise(handler));
        } else {
            socket.once('connect', _ => handler.once('init', _ => callbackOrPromise(handler)));

            // Node 0.10.x tls fix
            // tls only became a socket in 0.11.x
            socket.once('secureConnect', _ => socket.emit('connect'));
        }
    }
}

module.exports = BramQP;
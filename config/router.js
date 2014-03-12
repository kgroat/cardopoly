// get index and user routes to serve their content
var controllers = require('../controllers');


module.exports = {
    init: function(app){
        // configure routes
        app.get('/', controllers.main.get);
        app.get('/users', controllers.user.getAll);
        app.get('/usersList', controllers.user.listAll);
        app.get('/city', controllers.city.get);
    }
}
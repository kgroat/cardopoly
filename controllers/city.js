module.exports = {
    get: function(req, res){
        var resources = {
            food: 1000,
            iron: 4000
        };
        res.render('city', { resources: resources });
    }
}
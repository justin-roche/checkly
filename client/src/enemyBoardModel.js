var EnemyBoardModel = Backbone.Model.extend({
  

  url: 'https://localhost:3000/game',

  poll: function() {
    this.fetch({success: function(){
      var newboard = [];
      this.trigger('myturn',newboard);
    }.bind(this)});
  },

});
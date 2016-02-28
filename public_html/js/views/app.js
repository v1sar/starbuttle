define([
    'backbone'
], function(
    Backbone
) {
    var AppView = Backbone.View.extend({
        initialize: function () {
            var $page = $('#page'); 
            this.setElement($page);

            this._views = {};
        },

        setViews: function(views) {
            _.each(views, function(view, name) {
                this._views[name] = {
                    objConstructor: view
                }    
            }, this);
        },

        getView: function(name) {
            var view = this._views[name];
            
            if (!view.obj) {
                view.obj = new view.objConstructor();
                this.listenTo(view.obj, 'show', this.hideOtherViews);
                
                this.$el.append(view.obj.render().$el);
  
                this._views[name].obj = view.obj;
            }

            return view.obj;
        },

        hideOtherViews: function() {
            _.each(this._views, function(view) {
                if (view.obj) {
                    view.obj.hide();
                }
            }, this);
        }
    });

    return new AppView();
});
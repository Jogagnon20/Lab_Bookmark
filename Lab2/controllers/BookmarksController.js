const Repository = require('../models/Repository');

module.exports = 
class BookmarksController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
        this.bookmarksRepository = new Repository('Bookmarks');
    }
    help() {
        let content = "<div style=font-family:arial>";
        content += "<h3>GET : api/bookmarks endpoint  <br> List of possible query strings:</h3><hr>";
        content += '<h4>? sort = "name" <br>return {voir tous les bookmarks tries ascendant par Name} </h4>';
        content += '<h4>? sort = "category" <br>return {voir tous les bookmarks tries descendant par Category} </h4>';
        content += '<h4>/id <br>return {voir le bookmark Id} </h4>';
        content += '<h4>? name = "nom" <br>return {voir le bookmark avec Name = nom} </h4>';
        content += '<h4>? name = "ab*" <br>return {voir tous les bookmarks avec Name commencant par ab} </h4>';
        content += '<h4>? category = "sport" <br>return {voir tous les bookmarks avec Category = sport} </h4>';
        this.res.writeHead(200, {'content-type':'text/html'});
        this.res.end(content) + "</div>";
    }
    objectSize(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key))
                size++;
        }
        return size;
    }
    CheckBookmark(bookmark){
        if (bookmark.hasOwnProperty('Name'))
            if (bookmark.hasOwnProperty('Url'))
                if (bookmark.hasOwnProperty('Category'))
                    if (this.objectSize(bookmark) === 4) {
                        return true;
                    }
        return false;
    }

    get(id){
        let params = this.getQueryStringParams();

        if (!isNaN(id))
            this.response.JSON(this.bookmarksRepository.get(id));
        else if (params != null) {
            if (Object.keys(params).length === 0)
                this.help();
            else {
                let matchingBookmarks = [];
                if ('sort' in params) {
                    switch (params.sort.replace(/"/g, '')) {
                        case "name":
                            matchingBookmarks = this.bookmarksRepository.getSortByName();
                            break;
                        case "category":
                            matchingBookmarks = this.bookmarksRepository.getSortByCategory();
                            break;
                    }
                } 
                if ('name' in params)
                    matchingBookmarks = this.bookmarksRepository.getByName(params.name.replace(/"/g, ''), matchingBookmarks);
                if ('category' in params)
                    matchingBookmarks = this.bookmarksRepository.getByCategory(params.category.replace(/"/g, ''), matchingBookmarks);
                this.response.JSON(matchingBookmarks);
            }
        }
        else {
            this.response.JSON(this.bookmarksRepository.getAll());
        }
    }
    post(bookmark){  
        for (let i = 0; i < this.bookmarksRepository.objectsList.length; i++){
            if (this.bookmarksRepository.objectsList[i].Name === bookmark.Name){
                this.response.internalError();
                return null;
            }
            if (this.bookmarksRepository.objectsList[i].Url === bookmark.Url){
                this.response.internalError();
                return null;
            }
        }
        
        if (this.CheckBookmark(bookmark)) {
            let newBookmark = this.bookmarksRepository.add(bookmark);
            if (newBookmark)
                this.response.created(newBookmark);
            else
                this.response.internalError();
        }
        else 
            this.response.internalError();
    }
    put(bookmark){
        if (this.CheckBookmark(bookmark)){
            if (this.bookmarksRepository.update(bookmark))
                this.response.ok();
            else 
                this.response.notFound();
        }
        else 
            this.response.internalError();
    }
    remove(id){
        if (this.bookmarksRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }
}
module.exports = 
class Bookmark{
    constructor(site, name)
    {
        this.Id = 0;
        this.Name = name !== undefined ? name : "";
        this.Url = url !== undefined ? url : "";
    }
}
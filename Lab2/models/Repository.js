
const fs = require('fs');
///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file 
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////
module.exports = 
class Repository {
    constructor(objectsName) {
        objectsName = objectsName.toLowerCase();
        this.objectsList = [];
        this.objectsFile = `./data/${objectsName}.json`;
        this.read();
    }
    read() {
        try{
            // Here we use the synchronus version readFile in order  
            // to avoid concurrency problems
            let rawdata = fs.readFileSync(this.objectsFile);
            // we assume here that the json data is formatted correctly
            this.objectsList = JSON.parse(rawdata);
        } catch(error) {
            if (error.code === 'ENOENT') {
                // file does not exist, it will be created on demand
                this.objectsList = [];
            }
        }
    }
    write() {
        // Here we use the synchronus version writeFile in order
        // to avoid concurrency problems  
        fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
        this.read();
    }
    nextId() {
        let maxId = 0;
        for(let object of this.objectsList){
            if (object.Id > maxId) {
                maxId = object.Id;
            }
        }
        return maxId + 1;
    }
    add(object) {
        try {
            object.Id = this.nextId();
            this.objectsList.push(object);
            this.write();
            return object;
        } catch(error) {
            return null;
        }
    }
    getAll() {
        return this.objectsList;
    }
    get(id){
        for(let object of this.objectsList){
            if (object.Id === id) {
               return object;
            }
        }
        return null;
    }
    getSortByName() {
        for (let i = 0; i < this.objectsList.length - 1; i++)
            for (let j = 0; j < this.objectsList.length - i - 1; j++)
                if (this.objectsList[j].Name > this.objectsList[j+1].Name){
                    let temp = this.objectsList[j];
                    this.objectsList[j] = this.objectsList[j+1];
                    this.objectsList[j+1] = temp;
                }
        return this.objectsList;
    }
    getSortByCategory() {
        for (let i = 0; i < this.objectsList.length - 1; i++)
            for (let j = 0; j < this.objectsList.length - i - 1; j++)
                if (this.objectsList[j].Category < this.objectsList[j+1].Category){
                    let temp = this.objectsList[j];
                    this.objectsList[j] = this.objectsList[j+1];
                    this.objectsList[j+1] = temp;
                }
        return this.objectsList;
    }
    getByName(name, matchingBookmarks) {
        if (matchingBookmarks.length != 0) {
            if (name.indexOf('*') != -1) {
                let objectsMatchingList = [];
                for (let i = 0; i < matchingBookmarks.length; i++) 
                    if (matchingBookmarks[i].Name.toLowerCase().startsWith(name.replace('*', '').toLowerCase()))
                        objectsMatchingList.push(matchingBookmarks[i]);
                return objectsMatchingList;
            }
            else {
                for (let i = 0; i < matchingBookmarks.length; i++)
                if (matchingBookmarks[i].Name.toLowerCase() === name.toLowerCase())
                    return matchingBookmarks[i];
                return null;
            }
        } else {
            if (name.indexOf('*') != -1) {
                let objectsMatchingList = [];
                for (let i = 0; i < this.objectsList.length; i++) 
                    if (this.objectsList[i].Name.toLowerCase().startsWith(name.replace('*', '').toLowerCase()))
                        objectsMatchingList.push(this.objectsList[i]);
                return objectsMatchingList;
            }
            else {
                for (let i = 0; i < this.objectsList.length; i++)
                if (this.objectsList[i].Name.toLowerCase() === name.toLowerCase())
                    return this.objectsList[i];
                return null;
            }
        }
    }
    getByCategory(category, matchingBookmarks) {
        if (matchingBookmarks.length != 0) {
            let objectsMatchingList = [];
            for (let i = 0; i < matchingBookmarks.length; i++) 
                if (matchingBookmarks[i].Category.toLowerCase() === category.toLowerCase())
                    objectsMatchingList.push(matchingBookmarks[i]);
            return objectsMatchingList;
        } else {
            let objectsMatchingList = [];
            for (let i = 0; i < this.objectsList.length; i++) 
                if (this.objectsList[i].Category.toLowerCase() === category.toLowerCase())
                    objectsMatchingList.push(this.objectsList[i]);
            return objectsMatchingList;
        }
    }
    remove(id) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === id) {
                this.objectsList.splice(index,1);
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
    update(objectToModify) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === objectToModify.Id) {
                this.objectsList[index] = objectToModify;
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
}
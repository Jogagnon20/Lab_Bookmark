const Repository = require('../models/Repository');

module.exports = 
class CoursesController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
        this.coursesRepository = new Repository('Courses');
    }
    objectSize(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key))
                size++;
        }
        return size;
    }
    checkCourse(course) {
        if (course.hasOwnProperty('Title'))
            if (course.hasOwnProperty('Code'))
                if (this.objectSize(course) === 3) {
                    return true;
                }
        return false;
    }

    get(id){
        if(!isNaN(id))
            this.response.JSON(this.coursesRepository.get(id));
        else
            this.response.JSON(this.coursesRepository.getAll());
    }
    post(course){  
        for (let i = 0; i < this.coursesRepository.objectsList.length; i++){
            if (this.coursesRepository.objectsList[i].Title === course.Title){
                this.response.internalError();
                return null;
            }
            if (this.coursesRepository.objectsList[i].Code === course.Code){
                this.response.internalError();
                return null;
            }
        }
        
        if (this.checkCourse(course)) {
            let newCourse = this.coursesRepository.add(course);
            if (newCourse) 
                this.response.created(newCourse);
            else 
                this.response.internalError();
        }
        else
            this.response.internalError();
    }
    put(course){
        if (this.checkCourse(course)){
            if (this.coursesRepository.update(course))
                this.response.ok();
            else 
                this.response.notFound();
        }
        else 
            this.response.internalError();
    }
    remove(id){
        if (this.coursesRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }
}

const fs = require("fs");
const path = require('path');

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;
const coursesPath = path.resolve(__dirname, '../data/courses.json');
const studentsPath = path.resolve(__dirname, '../data/students.json');

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile(coursesPath,'utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile(studentsPath,'utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getCourseById = function(id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(c => c.courseId === parseInt(id));
        if (!course) {
            reject("query returned 0 results");
            return;
        }
        resolve(course);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        if (!studentData) {
            reject("No student data provided");
        } else {
            studentData.TA = studentData.TA !== undefined;
            studentData.studentNum = dataCollection.students.length + 1;
            dataCollection.students.push(studentData);
            resolve();
        }
    });
};

module.exports.updateStudent = function(updatedStudent) {
    return new Promise((resolve, reject) => {
        const index = dataCollection.students.findIndex(s => s.studentNum === parseInt(updatedStudent.studentNum));
        if (index === -1) {
            reject("Student not found");
            return;
        }
        dataCollection.students[index] = { ...dataCollection.students[index], ...updatedStudent };
        resolve();
    });
};


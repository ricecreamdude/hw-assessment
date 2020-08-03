//Command Line Arguments
const fs = require('fs')
const dataService = require('./dataService');

//node main.js data/courses.csv data/students.csv data/tests.csv data/marks.csv output.json
//Application Data
let coursesCache, marksCache, studentsCache, testsCache;

//Main Application
async function App(){

    const inputArgs = process.argv.slice(2);
    const outputFilename = inputArgs[4];
    const outputData = {students: [] };

    //Setup application data
    [coursesCache, studentsCache, testsCache, marksCache] = await dataService.createAppCache( inputArgs );
    
    //Construct output JSON file structure
    for (const id in studentsCache){
        let newStudent = makeStudent(id)
        if (newStudent) outputData.students.push(newStudent);
    }

    //Validate information

    //Write output.json
    dataService.writeFile(outputFilename, outputData);

}

App();

function makeStudent( id ){

    const studentData = studentsCache[id];
    let totalAvg = 0;

    let newStudent = {
        id: parseInt(id),
        name: studentData.name,
        totalAverage: 9999,
        courses: generateClass(id)
    }

    //Ignore students that have no grades
    if (!newStudent.courses) return;

    for (let i = 0; i < newStudent.courses.length; i++){
        totalAvg += newStudent.courses[i].courseAverage;   
    }

    totalAvg = Math.floor( (totalAvg * 100) / newStudent.courses.length) / 100;
     
    newStudent.totalAverage = totalAvg;
    
    return newStudent;
}


//returns course: combined weighted scores
//function getStudentCourseAverage( studentId ){
function getWeightedGrades( studentId ){
    
    //Creates weighted scores
    //If the weight is >100 then return error
    let gradesCache = {};

    let studentMarks = marksCache[studentId];

    if (!studentMarks) return;

    for (let i = 0; i < studentMarks.length; i++){
        
        let testIdToFind = studentMarks[i].testId;
        let test = testsCache[testIdToFind];
        let grade = test.weight * studentMarks[i].mark;
      
        if (!gradesCache[test.course_id]) {
            gradesCache[test.course_id] = grade
        } else gradesCache[test.course_id] += grade   
    }

    return gradesCache;

}

function generateClass(studentId){
    //Creates a whole course

    let answer = [];
    let gradesCache = getWeightedGrades(studentId);

    for( const classId in gradesCache){
        let data = {
            "id": parseInt(classId),
            "name": coursesCache[classId].name,
            "teacher": coursesCache[classId].teacher,
            "courseAverage": gradesCache[classId]/100
        }

        answer.push(data);
    }

    return answer;
}



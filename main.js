//Command Line Arguments
const fs = require('fs')
const inputArgs = process.argv.slice(2);

const dataService = require('./dataService');

let coursesCache, marksCache, studentsCache, testsCache;

//Data Setup

//Main Application
async function Setup(){

    let arr = []

    for( let i = 0; i < inputArgs.length - 1; i++ ){

        let path = inputArgs[i];

        if (i == 3) arr.push( await dataService.createMarksCache( path ) ) 
        else {
            let data = await dataService.createPrimaryKeyCache( path );
            arr.push( data );
        }
    }

    [coursesCache, studentsCache, testsCache, marksCache] = arr;
}

async function App(){

    await Setup();
    makeStudent(1);

}

App();

function makeStudent( id ){

    const studentData = studentsCache[id];
    let totalAvg = 0;

    let newStudent = {
        id: id,
        name: studentData.name,
        totalAverage: 9999,
        courses: getStudentCourseAverage(id)
    }

    for (let i = 0; i < newStudent.courses.length; i++){
        totalAvg += newStudent.courses[i].courseAverage;   
    }

    totalAvg = Math.floor( (totalAvg * 100) / 3) / 100;
     
    newStudent.totalAverage = totalAvg;

    console.log(newStudent);
    
    return newStudent;
}

//returns course: combined weighted scores
function getStudentCourseAverage( studentId ){
    
    let gradesCache = { };

    let studentMarks = marksCache[studentId];

    for (let i = 0; i < studentMarks.length; i++){
        
        let testIdToFind = studentMarks[i].testId;
        let test = testsCache[testIdToFind];
        let grade = test.weight * studentMarks[i].mark;
      
        if (!gradesCache[test.course_id]) {
            gradesCache[test.course_id] = grade
        } else gradesCache[test.course_id] += grade   
    }

    let answer = [];

    for( const classId in gradesCache){
        let data = {
            "id": classId,
            "name": coursesCache[classId].name,
            "teacher": coursesCache[classId].teacher,
            "courseAverage": gradesCache[classId]/100
        }

        answer.push(data)

    }

    return answer;
}

///WRITE FILE ///
function writeFile( data ){
    //Create a big ol data file first

    //Write once
    fs.writeFileSync( inputArgs[4], JSON.stringify(data) );
}

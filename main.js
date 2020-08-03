//Command Line Arguments
const fs = require('fs')

const dataService = require('./dataService');

//Application Data
let coursesCache, marksCache, studentsCache, testsCache;

//Main Application
async function App(){

    const inputArgs = process.argv.slice(2);
    const outputFilename = inputArgs[4];

    //Setup application data
    [coursesCache, studentsCache, testsCache, marksCache] = await dataService.createAppCache( inputArgs );
    

    //Construct output JSON file structure
    let data = makeStudent(1);

    //Validate information
    
    //Write output.json
    dataService.writeFile(outputFilename, data);

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


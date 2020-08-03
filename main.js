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

        // let data = await dataService.createPrimaryKeyCache( path );
        // arr.push( data );

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

//Student Services

//     id: int 1
//     name: string "a"
//     totalAverage: int 72.03, // Can't comput unless we have all grades
//     courses: array{}
//         id  int 1
//         name string “Biology”
//         teacher string “Mr. D”
//         courseAverage int 90.1

//Make student
    //Get all courses that student is in
        //Get the test that student has taken

        //Calculate the course average
    //calculate the total average

//Return Student

//Return that student

//Returns a single student
function makeStudent( id ){

    const studentData = studentsCache[id];

    let newStudent = {
        id: id,
        name: studentData.name,
        totalAverage: 999,
        courses: []
    }

    // markData = marksCache[id];
    let courseAverages = getStudentCourseAverage(id);

    for( const classId in courseAverages){

        let data = {
            "id": classId,
            "name": coursesCache[classId].name,
            "teacher": coursesCache[classId].teacher,
            "courseAverage": courseAverages[classId]
        }

        console.log(data);

        newStudent.courses.push(data)
    }



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

    for( const classId in gradesCache){
        gradesCache[classId] = gradesCache[classId]/100;
    }

    return gradesCache;
}

//                       10     //78
// function calculateGrade(weight, mark){

//     let nWeight = weight;
//     let nMark = mark;

//     let grade = (nWeight * nMark) * 100;

//     return parseFloat((grade).toFixed(2));
//     // return grade;
// }

///WRITE FILE ///
function writeFile( data ){
    //Create a big ol data file first

    //Write once
    fs.writeFileSync( inputArgs[4], JSON.stringify(data) );
}

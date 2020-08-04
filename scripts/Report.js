class Report{
    constructor( 
        coursesCache, 
        studentsCache, 
        testsCache, 
        marksCache
    ){
        this.coursesCache = coursesCache;
        this.studentsCache = studentsCache;
        this.testsCache = testsCache;
        this.marksCache = marksCache;
    }
    generate(){

        const reportData = {students: [] };

        this.validateCache();

        for (const id in this.studentsCache){
            let newStudent = this.generateStudent(id)
            if (newStudent) reportData.students.push(newStudent);
        }
    
        return reportData;
    }

    generateStudent( id ){

        const studentData = this.studentsCache[id];
        let totalAvg = 0;
        
        if (!studentData) return;

        let newStudent = {
            id: parseInt(id),
            name: studentData.name,
            totalAverage: 9999,
            courses: this.generateClass(id)
        }
    
        //Ignore students that have no grades
        if (!newStudent.courses.length ) return;
    
        for (let i = 0; i < newStudent.courses.length; i++){
            totalAvg += newStudent.courses[i].courseAverage;   
        }
    
        totalAvg = Math.floor( (totalAvg * 100) / newStudent.courses.length) / 100;
         
        newStudent.totalAverage = totalAvg;
        
        return newStudent;
    }

    generateClass(studentId){

        let answer = [];
        let tempGradesCache = this.generateWeightedGrades(studentId);
    
        for( const classId in tempGradesCache){
            let data = {
                "id": parseInt(classId),
                "name": this.coursesCache[classId].name,
                "teacher": this.coursesCache[classId].teacher,
                "courseAverage": tempGradesCache[classId]/100
            }
    
            answer.push(data);
        }

        return answer;
    }

    generateWeightedGrades( studentId ){

        let tempGradesCache = {};
        let studentMarks = this.marksCache[studentId];
        
        if (!studentMarks) return;
    
        for (let i = 0; i < studentMarks.length; i++){
            
            let testIdToFind = studentMarks[i].testId;
            let test = this.testsCache[testIdToFind];
            let grade = test.weight * studentMarks[i].mark;
            
            if (!tempGradesCache[test.course_id]) {
                tempGradesCache[test.course_id] = grade
            } else tempGradesCache[test.course_id] += grade   
        }
    
        return tempGradesCache;
    
    }

    validateCache(){
        
        //Room for lots of validation
        this.validateClassWeight();

    }

    validateClassWeight(){
        //Classes with tests !== 100 throw an error
        let courses = {};

        for (const cId in this.coursesCache){
            courses[cId] = {
                totalWeight:0
            }
        }

        for (const tId in this.testsCache){
            let test = this.testsCache[tId];
            let fetchId = test.course_id;

            courses[fetchId].totalWeight += parseInt(test.weight);
        }

        for (const cId in this.coursesCache){
            if (courses[cId].totalWeight !== 100){
                throw 'Invalid Weight Detected';
            }
        }

        return true;

    }
}

module.exports = Report;
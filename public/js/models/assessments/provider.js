let assessmentTestData = [
    {"id":1,"date":"3/4/2019","employees":[{"id":1}],"candidates":[{"id":4},{"id":6},{"id":15},{"id":16},{"id":9},{"id":11},{"id":11},{"id":10}]},
    {"id":2,"date":"11/25/2018","employees":[{"id":15},{"id":10},{"id":1},{"id":3}],"candidates":[]},
    {"id":3,"date":"8/26/2018","employees":[{"id":14},{"id":16},{"id":9},{"id":5}],"candidates":[{"id":12},{"id":7},{"id":16},{"id":2},{"id":10},{"id":5}]},
    {"id":4,"date":"8/28/2018","employees":[{"id":13},{"id":5}],"candidates":[{"id":17},{"id":8},{"id":7},{"id":5},{"id":16},{"id":6},{"id":13}]},
    {"id":5,"date":"9/18/2018","employees":[{"id":12},{"id":15}],"candidates":[{"id":17},{"id":16},{"id":12},{"id":14}]},
    {"id":6,"date":"9/21/2018","employees":[{"id":5},{"id":9},{"id":8},{"id":11},{"id":2}],"candidates":[{"id":16},{"id":9},{"id":14},{"id":1},{"id":11},{"id":13}]},
    {"id":7,"date":"3/24/2019","employees":[{"id":10},{"id":1},{"id":15},{"id":15}],"candidates":[{"id":18}]},
    {"id":8,"date":"3/6/2019","employees":[{"id":13},{"id":10},{"id":12}],"candidates":[{"id":4},{"id":2},{"id":9},{"id":10},{"id":16},{"id":18},{"id":8}]},
    {"id":9,"date":"9/22/2018","employees":[],"candidates":[]},
    {"id":10,"date":"8/2/2019","employees":[],"candidates":[]},
    {"id":11,"date":"10/10/2018","employees":[],"candidates":[{"id":13},{"id":12},{"id":7},{"id":7},{"id":10}]},
    {"id":12,"date":"1/26/2019","employees":[{"id":18},{"id":17},{"id":11},{"id":14},{"id":1}],"candidates":[{"id":12},{"id":14},{"id":13},{"id":8},{"id":11},{"id":18},{"id":5}]},
    {"id":13,"date":"7/31/2019","employees":[{"id":9},{"id":3}],"candidates":[]},
    {"id":14,"date":"6/21/2019","employees":[{"id":3}],"candidates":[{"id":4},{"id":5},{"id":10},{"id":2},{"id":17},{"id":16},{"id":8},{"id":2}]},
    {"id":15,"date":"4/25/2019","employees":[{"id":14},{"id":1},{"id":3},{"id":2},{"id":14}],"candidates":[{"id":5},{"id":14},{"id":9},{"id":15},{"id":11}]},
    {"id":16,"date":"6/17/2019","employees":[{"id":3},{"id":3}],"candidates":[{"id":16},{"id":1},{"id":3},{"id":16},{"id":11},{"id":13}]},
    {"id":17,"date":"4/28/2019","employees":[{"id":9},{"id":12},{"id":17},{"id":4},{"id":16}],"candidates":[{"id":15},{"id":10}]},
    {"id":18,"date":"12/12/2018","employees":[{"id":12},{"id":14},{"id":6},{"id":10},{"id":9}],"candidates":[{"id":18},{"id":9},{"id":6}]},
    {"id":19,"date":"12/26/2018","employees":[],"candidates":[{"id":12},{"id":9},{"id":10},{"id":8},{"id":16}]},
    {"id":20,"date":"1/6/2019","employees":[],"candidates":[]},
    {"id":21,"date":"7/20/2019","employees":[{"id":6},{"id":4},{"id":8},{"id":8},{"id":2}],"candidates":[]},
    {"id":22,"date":"10/28/2018","employees":[{"id":9},{"id":3},{"id":12},{"id":11}],"candidates":[{"id":1},{"id":18},{"id":1},{"id":5},{"id":9},{"id":2},{"id":16}]},
    {"id":23,"date":"12/14/2018","employees":[],"candidates":[]},
    {"id":24,"date":"4/23/2019","employees":[{"id":14},{"id":15},{"id":13}],"candidates":[{"id":15}]},
    {"id":25,"date":"4/20/2019","employees":[{"id":12},{"id":15}],"candidates":[{"id":16},{"id":16},{"id":5},{"id":2},{"id":18},{"id":17},{"id":14}]},
    {"id":26,"date":"5/20/2019","employees":[{"id":14},{"id":17},{"id":15},{"id":2},{"id":5}],"candidates":[{"id":9},{"id":12},{"id":15},{"id":18},{"id":3},{"id":13},{"id":10},{"id":16}]},
    {"id":27,"date":"9/12/2018","employees":[{"id":17}],"candidates":[{"id":10}]},
    {"id":28,"date":"2/28/2019","employees":[{"id":8},{"id":15}],"candidates":[{"id":10}]},
    {"id":29,"date":"2/11/2019","employees":[{"id":18},{"id":15}],"candidates":[{"id":4}]},
    {"id":30,"date":"9/21/2018","employees":[{"id":17}],"candidates":[{"id":8},{"id":18},{"id":6},{"id":3}]}
];

for (const item of assessmentTestData) {
    item.numberOfEmployees = item.employees.length;
    item.numberOfCandidates = item.candidates.length;
}

let nextAssessmentId = assessmentTestData.length + 1;

class AssessmentProvider {
    constructor() {
    }

    get(id) {
        return assessmentTestData.find(value => value.id === id);
    }

    add(assessment) {
        assessment.id = nextAssessmentId;
        nextAssessmentId++;
        assessmentTestData.push(assessment);
    }

    update(id, assessment) {
        assessment.id = id;
        assessmentTestData.every(function(item, index, array) {
            if (item.id === id) {
                array.splice(index, 1, assessment);
                return false;
            }
            return true;
        });
    }

    delete(id) {
        assessmentTestData.every(function(item, index, array) {
            if (item.id === id) {
                array.splice(index, 1);
                return false;
            }
            return true;
        });
    }

    getAll() {
        return assessmentTestData;
    }
}
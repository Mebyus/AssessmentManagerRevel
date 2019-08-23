import {encodeQueryData} from "./../query.js";

export class AssessmentRequester {
    constructor(url) {
        this.url = url;
    }

    search(dateRange, callAfterResponse) {
        let params = dateRange;
        let url = this.url + "/assessment" + "?" + encodeQueryData(params);

        fetch(url)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    getAllCandidatePromise(callAfterResponse) {
        let url = this.url + "/candidate";
        let options = {
            method: "GET",
        };

        return fetch(url, options).then(resp => resp.json()).then(result => callAfterResponse(result));
    }

    getAllEmployeePromise(callAfterResponse) {
        let url = this.url + "/employee";
        let options = {
            method: "GET",
        };

        return fetch(url, options).then(resp => resp.json()).then(result => callAfterResponse(result));
    }

    get(id, callAfterResponse) {
        let url = this.url + "/assessment" + "/" + id;
        let options = {
            method: "GET",
        };
        
        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    add(assessment, callAfterResponse) {
        let url = this.url + "/assessment";
        let options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assessment),
        };

        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    update(id, assessment, callAfterResponse) {
        assessment.id = id;
        let url = this.url + "/assessment" + "/" + id;
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assessment),
        };
        
        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    delete(id, callAfterResponse) {
        let url = this.url + "/assessment" + "/" + id;
        let options = {
            method: "DELETE",
        };

        fetch(url, options)
        .then(resp => callAfterResponse());
    }

    getAll(callAfterResponse) {
        let url = this.url + "/assessment";
        let options = {
            method: "GET",
        };

        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }
}
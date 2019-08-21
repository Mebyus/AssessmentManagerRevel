import {encodeQueryData} from "./../query.js";

export class EmployeeRequester {
    constructor(url) {
        this.url = url;
    }

    getAllAssessmentPromise(callAfterResponse) {
        let url = this.url + "/assessment";
        let options = {
            method: "GET",
        };

        return fetch(url, options).then(resp => resp.json()).then(result => callAfterResponse(result));
    }

    search(searchString, callAfterResponse) {
        let params = {search: searchString};
        let url = this.url + "/employee" + "?" + encodeQueryData(params);        

        fetch(url)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    get(id, callAfterResponse) {
        let url = this.url + "/employee" + "/" + id;
        let options = {
            method: "GET",
        };
        
        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    add(employee, callAfterResponse) {
        let url = this.url + "/employee";
        let options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        };

        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    update(id, employee, callAfterResponse) {
        employee.id = id;
        let url = this.url + "/employee" + "/" + id;
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employee),
        };

        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    delete(id, callAfterResponse) {
        let url = this.url + "/employee" + "/" + id;
        let options = {
            method: "DELETE",
        };

        fetch(url, options)
        .then(resp => callAfterResponse());
    }

    getAll(callAfterResponse) {
        let url = this.url + "/employee";
        let options = {
            method: "GET",
        };

        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }
}
export class CandidateRequester {
    constructor(url) {
        this.url = url;
    }

    search(searchString, callAfterResponse) {
        let url = new URL(this.url + "/candidate");
        let params = {search: searchString};

        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        fetch(url)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    get(id, callAfterResponse) {
        let url = this.url + "/candidate" + "/" + id;
        let options = {
            method: "GET",
        };
        
        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    add(candidate, callAfterResponse) {
        let url = this.url + "/candidate";
        let options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(candidate),
        };
        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    update(id, candidate, callAfterResponse) {
        candidate.id = id;
        let url = this.url + "/candidate" + "/" + id;
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(candidate),
        };
        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    delete(id, callAfterResponse) {
        let url = this.url + "/candidate" + "/" + id;
        let options = {
            method: "DELETE",
        };

        fetch(url, options)
        .then(resp => callAfterResponse());
    }

    getAll(callAfterResponse) {
        let url = this.url + "/candidate";
        let options = {
            method: "GET",
        };

        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }
}

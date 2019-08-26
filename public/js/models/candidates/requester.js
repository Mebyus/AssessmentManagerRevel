import {encodeQueryData} from "./../query.js";

/**
 * Класс для запроса данных кандидатов.
 */
export class CandidateRequester {
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

    /**
     * Запрос на поиск сотрудников.
     * @param {string} searchString Строка для поиска.
     * @param {CallableFunction} callAfterResponse Callback для вызова после того, как ответ 
     * на запрос будет получен.
     */
    search(searchString, callAfterResponse) {
        let params = {search: searchString};
        let url = this.url + "/candidate" + "?" + encodeQueryData(params);

        fetch(url)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    /**
     * Запрос данных сотрудника по id.
     * @param {string} id ID кандидата.
     * @param {CallableFunction} callAfterResponse Callback для вызова после того, как ответ 
     * на запрос будет получен. 
     */
    get(id, callAfterResponse) {
        let url = this.url + "/candidate" + "/" + id;
        let options = {
            method: "GET",
        };
        
        fetch(url, options)
        .then(resp => resp.json())
        .then(result => callAfterResponse(result));
    }

    /**
     * Запрос на создание нового сотрудника.
     * @param {object} candidate Данные кандидата.
     * @param {CallableFunction} callAfterResponse Callback для вызова после того, как ответ 
     * на запрос будет получен.
     */
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

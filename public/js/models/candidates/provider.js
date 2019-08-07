// function readTextFile(file, callback) {
//     let rawFile = new XMLHttpRequest();
//     rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", file, true);
//     rawFile.onreadystatechange = function() {
//         if (rawFile.readyState === 4 && rawFile.status == "200") {
//             callback(rawFile.responseText);
//         }
//     }
//     rawFile.send(null);
// }

// let testData;

// readTextFile("./models/candidates/candidates_mock_data.json", function(text){
//     testData = JSON.parse(text);
//     console.log("read", testData);
// });

let candidateTestData = [
    {"id":1,"firstName":"Phillip","middleName":"Rafaello","lastName":"Posner","birthDate":"3/24/1994","email":"rposner0@slideshare.net","phone":"+62 336 161 0590"},
    {"id":2,"firstName":"Dulcinea","middleName":"Reggy","lastName":"Wilcock","birthDate":"9/29/1992","email":"rwilcock1@arstechnica.com","phone":"+63 276 967 4179"},
    {"id":3,"firstName":"Theodora","middleName":"Rania","lastName":"Gainsboro","birthDate":"3/16/2000","email":"rgainsboro2@bigcartel.com","phone":"+976 340 103 4572"},
    {"id":4,"firstName":"Gustavus","middleName":"Auberon","lastName":"Chevers","birthDate":"7/20/2001","email":"achevers3@msu.edu","phone":"+62 990 373 9230"},
    {"id":5,"firstName":"Darcey","middleName":"Antoine","lastName":"Farnaby","birthDate":"12/28/1995","email":"afarnaby4@posterous.com","phone":"+976 546 476 3024"},
    {"id":6,"firstName":"Nichols","middleName":"Rickie","lastName":"Prydie","birthDate":"12/8/1993","email":"rprydie5@dot.gov","phone":"+7 537 719 0652"},
    {"id":7,"firstName":"Catlin","middleName":"Jackqueline","lastName":"Westrey","birthDate":"8/25/1994","email":"jwestrey6@nasa.gov","phone":"+506 402 409 2250"},
    {"id":8,"firstName":"Clea","middleName":"Olva","lastName":"Chafney","birthDate":"5/2/1999","email":"ochafney7@yelp.com","phone":"+86 737 985 4339"},
    {"id":9,"firstName":"Lynde","middleName":"Karine","lastName":"Yantsurev","birthDate":"11/23/1991","email":"kyantsurev8@ucsd.edu","phone":"+62 752 895 3971"},
    {"id":10,"firstName":"Kendall","middleName":"Meara","lastName":"Jancic","birthDate":"7/18/2004","email":"mjancic9@epa.gov","phone":"+63 436 922 0389"},
    {"id":11,"firstName":"Beitris","middleName":"Adamo","lastName":"Malthouse","birthDate":"2/4/1991","email":"amalthousea@51.la","phone":"+55 890 518 0179"},
    {"id":12,"firstName":"Lurlene","middleName":"Olin","lastName":"Bladesmith","birthDate":"10/26/1994","email":"obladesmithb@mtv.com","phone":"+66 650 328 0474"},
    {"id":13,"firstName":"Madlin","middleName":"Edouard","lastName":"Guyet","birthDate":"11/26/2001","email":"eguyetc@xrea.com","phone":"+63 708 778 3918"},
    {"id":14,"firstName":"Bradney","middleName":"Aura","lastName":"Sallnow","birthDate":"8/8/2002","email":"asallnowd@addtoany.com","phone":"+53 415 528 1966"},
    {"id":15,"firstName":"Dorene","middleName":"Luis","lastName":"Dalley","birthDate":"2/2/1998","email":"ldalleye@nymag.com","phone":"+263 327 737 0355"},
    {"id":16,"firstName":"Gery","middleName":"Guenevere","lastName":"Petyt","birthDate":"4/23/1999","email":"gpetytf@digg.com","phone":"+46 879 887 8984"},
    {"id":17,"firstName":"Clarke","middleName":"Alexandr","lastName":"Fairfoot","birthDate":"10/12/1990","email":"afairfootg@ucsd.edu","phone":"+7 318 238 0944"},
    {"id":18,"firstName":"Corbie","middleName":"Camilla","lastName":"Morch","birthDate":"7/11/1991","email":"cmorchh@msn.com","phone":"+7 712 480 6994"},
    {"id":19,"firstName":"Janeen","middleName":"Quinn","lastName":"Henriet","birthDate":"3/7/1994","email":"qhenrieti@hubpages.com","phone":"+52 915 116 2036"},
    {"id":20,"firstName":"Max","middleName":"Chicky","lastName":"Morse","birthDate":"12/18/2001","email":"cmorsej@si.edu","phone":"+86 111 689 9487"},
    {"id":21,"firstName":"Ranique","middleName":"Arlena","lastName":"Wellen","birthDate":"5/11/1997","email":"awellenk@51.la","phone":"+7 142 896 9529"},
    {"id":22,"firstName":"Lynette","middleName":"Jody","lastName":"Pridham","birthDate":"12/5/1990","email":"jpridhaml@miitbeian.gov.cn","phone":"+420 275 484 4412"},
    {"id":23,"firstName":"Cyndia","middleName":"Fraser","lastName":"Rathke","birthDate":"5/2/1999","email":"frathkem@quantcast.com","phone":"+62 226 582 0813"},
    {"id":24,"firstName":"Bing","middleName":"Karleen","lastName":"Silcocks","birthDate":"8/16/1997","email":"ksilcocksn@google.pl","phone":"+62 786 981 0939"},
    {"id":25,"firstName":"Theo","middleName":"Dehlia","lastName":"Janz","birthDate":"5/8/1994","email":"djanzo@hostgator.com","phone":"+63 304 925 2738"},
    {"id":26,"firstName":"Sandi","middleName":"Wolfie","lastName":"Meikle","birthDate":"12/24/2000","email":"wmeiklep@deviantart.com","phone":"+62 882 456 7908"},
    {"id":27,"firstName":"Lyndsey","middleName":"Brad","lastName":"Janous","birthDate":"10/13/1994","email":"bjanousq@chicagotribune.com","phone":"+386 916 205 2195"},
    {"id":28,"firstName":"Gabriela","middleName":"Martie","lastName":"Petyanin","birthDate":"6/2/2003","email":"mpetyaninr@bloglovin.com","phone":"+1 910 237 9872"},
    {"id":29,"firstName":"Mei","middleName":"May","lastName":"Grinikhinov","birthDate":"5/5/1998","email":"mgrinikhinovs@scientificamerican.com","phone":"+967 858 127 1074"},
    {"id":30,"firstName":"Gail","middleName":"Alberik","lastName":"Bowhay","birthDate":"10/2/1995","email":"abowhayt@nhs.uk","phone":"+968 347 472 5793"}
];

let nextCandidateId = candidateTestData.length + 1;

class CandidateProvider {
    constructor() {
    }

    get(id) {
        return candidateTestData.find(value => value.id === id);
    }

    add(candidate) {
        candidate.id = nextCandidateId;
        nextCandidateId++;
        candidateTestData.push(candidate);
    }

    update(id, candidate) {
        candidate.id = id;
        candidateTestData.every(function(item, index, array) {
            if (item.id === id) {
                array.splice(index, 1, candidate);
                return false;
            }
            return true;
        });
    }

    delete(id) {
        candidateTestData.every(function(item, index, array) {
            if (item.id === id) {
                array.splice(index, 1);
                return false;
            }
            return true;
        });
    }

    getAll() {
        return candidateTestData;
    }
}

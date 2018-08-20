
let sortType = true; // increase: true , decrease: false
let client_id = '587aa2d384f7333a886010d5f52f302a'; // Soundcloud

let loadJSON = (url, success, fail) => {
    setLoading("block");
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let status = xhr.status;
        if (status === 200) {
            if (success != null)
                success(xhr.response);
            setLoading("none");
            return xhr.response;
        } else {
            if (fail != null)
                fail(status);
            setLoading("none");
            return status;
        }
    };
    xhr.send();
};

let setLoading = (styleSet) => {  
    let l = document.getElementById('loading');
    l.style.display = styleSet;
}

//============ Sort ====================

let sortListSong = () => {
    let list = document.getElementById("ulResult");
    let b = list.getElementsByTagName("LI");

    quickSort(b, 0, b.length-1);
    sortType = !sortType;
}

let quickSort = (arr, left, right) => {
    let len = arr.length,
        pivot,
        partitionIndex;

    if (left < right) {
        pivot = right;
        partitionIndex = partition(arr, pivot, left, right);

        //sort left and right
        quickSort(arr, left, partitionIndex - 1);
        quickSort(arr, partitionIndex + 1, right);
    }
    return arr;
}


let partition = (arr, pivot, left, right) => {
    let pivotValue = arr[pivot].children[1].innerHTML.toLowerCase(),
        partitionIndex = left;

    for (let i = left; i < right; i++) {
        if (sortType && arr[i].children[1].innerHTML.toLowerCase() < pivotValue
        ||  !sortType && arr[i].children[1].innerHTML.toLowerCase() > pivotValue) {
            swap(arr, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(arr, right, partitionIndex);
    return partitionIndex;
}

let swap = (arr, i, j) => {
    let tempi = arr[i].cloneNode(true);
    let tempj = arr[j].cloneNode(true);
    arr[i].parentNode.replaceChild(tempj, arr[i]);
    arr[j].parentNode.replaceChild(tempi, arr[j]);
}

// ============ Delete all song ==============
let delChilds = (DivId) => {
    let p = document.getElementById(DivId);
    while(p.childElementCount > 0){
        p.removeChild(p.childNodes[0]);
    }
}

// ============ Add Song ===================
let addAnchor = (DivId, nameA, linkA, linkImg) => {
    // tạo img tag
    let img = document.createElement('img');
    img.setAttribute('src', linkImg||"image/Unknown_Character.png");

    // tạo a tag
    let aTag = document.createElement('a');
    aTag.setAttribute('href', linkA);
    aTag.setAttribute('target', "_blank");
    aTag.setAttribute('rel', "noopener noreferrer");
    aTag.innerHTML = nameA;

    // tạo li tag
    let contain = document.createElement('li');
    contain.appendChild(img); // thêm img vào li
    contain.appendChild(aTag); // thêm a vào li

    // thêm li vào ul , ul có sẵn trong html rồi
    let mydiv = document.getElementById(DivId);
    mydiv.appendChild(contain);
}

window.onload = () => {
    let sortbut = document.getElementById('sortButton');
    sortbut.addEventListener('click', () => {
        sortListSong();
    });

    let delbut = document.getElementById('delButton');
    delbut.addEventListener('click', () => {
        delChilds('ulResult');
    });

    let sc = document.getElementById('loadSc');
    sc.addEventListener('click', () => {
        let link = document.getElementById('scLink').value;
        loadJSON('https://api.soundcloud.com/resolve.json?url=' + link + '&client_id=' + client_id,
            (result) => {
                console.log(result);
                let numTrack = 1,
                    title, user, linkSC;
                let ok = true;

                if (result.kind == "playlist") {
                    numTrack = result.tracks.length;
                    for (let i = 0; i < numTrack; i++) {
                        title = result.tracks[i].title;
                        user = result.tracks[i].user.username;
                        linkSC = 'https://api.soundcloud.com/tracks/' +
                            result.tracks[i].id +
                            '/stream?client_id=' + client_id;
                        addAnchor("ulResult", title, linkSC, result.tracks[i].artwork_url);
                    }

                } else if (result.kind == "track") {
                    title = result.title;
                    user = result.user.username;
                    linkSC = 'https://api.soundcloud.com/tracks/' + result.id +
                        '/stream?client_id=' + client_id;
                    addAnchor("ulResult", title, linkSC, result.artwork_url);
                }
            }
        );
    });

    let zing = document.getElementById('loadZ');
    zing.addEventListener('click', () => {
        let ID = document.getElementById('zLink').value;
        loadJSON("https://mp3.zing.vn/xhr/media/get-source?type=audio&key=" + ID,
            (dataJson) => {
                if (dataJson.data.source[128]) {
                    let link = 'http:' + dataJson.data.source[128];
                    let title = dataJson.data.title + " - " + dataJson.data.artists_names;
                    let imgLink = dataJson.data.thumbnail;

                    addAnchor("ulResult", title, link, imgLink);
                }
            });
    });

    let inp = document.getElementById('inputFile');
    inp.addEventListener('change', (e) => {
        console.log(inp.files[0]);
        let nameFile = inp.files[0].name;
        let type = nameFile.substring(nameFile.length - 4, nameFile.length);
        let url = URL.createObjectURL(inp.files[0]);

        if (type == "json") {
            loadJSON(url,
                // loaded
                (data) => {

                }
            );
        } else {
            document.getElementsByTagName('body')[0]
                .setAttribute("style", "background-image: url(" + url + ")");
        }
    });
}

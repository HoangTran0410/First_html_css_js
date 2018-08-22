
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
let sortType = true; // increase: true , decrease: false

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

// ============ Filter =================
let filterSongs = () => {
    let keyW, filter, ul, li, a, i;
    keyW = document.getElementById('inpFilter');
    filter = keyW.value.toUpperCase();
    ul = document.getElementById("ulResult");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// ============ Delete all song ==============
let delChilds = (DivId) => {
    let p = document.getElementById(DivId);
    while(p.childElementCount > 0){
        p.removeChild(p.childNodes[0]);
    }
}

// ============  Custom  Alert  ==============
let addAlertBox = (text, bgcolor, textcolor) => {
    let aa = document.getElementById('alertArea');
    let al = document.getElementById('alert');
    al.childNodes[0].nodeValue = text;
    al.style.backgroundColor = bgcolor;
    al.style.display = 'block';

    if(textcolor) al.style.color = textcolor;
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
    var b = document.getElementsByTagName('body')[0];
    b.addEventListener('click', (e) => {
        switch(e.target.id){
            case 'login':
                addAlertBox('Log in for what \u211c No database yet', '#467');
                break;

            case 'about':
                addAlertBox('Made by Hoang Tran. click Contact to goto my facebook \u2665', '#8fb', '#111');
                break;

            case 'closebtn':
                e.target.parentElement.style.display='none';
                break; 

            case 'sortButton':
                sortListSong();
                break;

            case 'delButton':
                delChilds('ulResult');
                break;

            case 'load':
                let link = document.getElementById('link').value;
                if(link.indexOf('soundcloud.com') != -1){
                    loadJSON('https://api.soundcloud.com/resolve.json?url=' + link + '&client_id=' + client_id,
                        (data) => {
                            console.log(data);
                            let numTrack = 1, title, user, linkSC, ok = true;

                            if (data.kind == "playlist") {
                                numTrack = data.tracks.length;
                                for (let i = 0; i < numTrack; i++) {
                                    title = data.tracks[i].title;
                                    user = data.tracks[i].user.username;
                                    linkSC = 'https://api.soundcloud.com/tracks/' +
                                        data.tracks[i].id +
                                        '/stream?client_id=' + client_id;
                                    addAnchor("ulResult", title, linkSC, data.tracks[i].artwork_url);
                                }

                            } else if (data.kind == "track") {
                                title = data.title;
                                user = data.user.username;
                                linkSC = 'https://api.soundcloud.com/tracks/' + data.id +
                                    '/stream?client_id=' + client_id;
                                addAnchor("ulResult", title, linkSC, data.artwork_url);
                            }
                        },
                        (e) => {
                            addAlertBox("Error " + e + ". Please try another link", "#e44336");
                        }
                    );
                }else{
                    loadJSON("https://mp3.zing.vn/xhr/media/get-source?type=audio&key=" + link,
                        (dataJson) => {
                            if (dataJson.data) {
                                let link = 'http:' + dataJson.data.source[128];
                                let title = dataJson.data.title + " - " + dataJson.data.artists_names;
                                let imgLink = dataJson.data.thumbnail;

                                addAnchor("ulResult", title, link, imgLink);
                            } else 
                                addAlertBox("Error " + dataJson + ". Please try another link", "#e44336")
                        },
                        (e) => {
                            addAlertBox("Error " + e + ". Please try another link", "#e44336");
                        }
                    );
                }
                break;
        }
    })

    document.getElementById('inpFilter')
        .addEventListener('keyup', () => {
            filterSongs();
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
        } else if(inp.files[0].type.indexOf('image') != -1){
            document.getElementsByTagName('body')[0]
                .setAttribute("style", "background-image: url(" + url + ")");
        } else addAlertBox('This file type is not Support, try another files (image or json)\u2665', '#e44336');
    });
}

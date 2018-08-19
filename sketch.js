
let client_id = '587aa2d384f7333a886010d5f52f302a'; // Soundcloud

let loadJSON = (url, success, fail) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            if(success != null)
                success(xhr.response);
            return xhr.response;
        } else {
            if(fail != null)
                fail(status);
            return status;
        }
    };
    xhr.send();
};

let addAnchor = (DivId, nameA, linkA, linkImg) => {
    // tạo img tag
    let img = document.createElement('img');
    img.setAttribute('src', linkImg);

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
    let sc = document.getElementById('loadSc');
    sc.addEventListener('click', () => {
        let link = document.getElementById('scLink').value;
        loadJSON('https://api.soundcloud.com/resolve.json?url='+link+'&client_id='+client_id,
            (result)=>{
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
    })

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
    })
}
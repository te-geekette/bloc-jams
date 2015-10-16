// Example Album 
var albumPicasso = {
    name: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { name: 'Blue', length: '4:26' },
        { name: 'Green', length: '3:14' },
        { name: 'Red', length: '5:01' },
        { name: 'Pink', length: '3:21' },
        { name: 'Magenta', length: '2:15' },
    ]
};

// Another example album
var albumMarconi = {
     name: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { name: 'Hello, Operator?', length: '1:01' },
         { name: 'Ring, ring, ring', length: '5:01' },
         { name: 'Fits in your pocket', length: '3:21'},
         { name: 'Can you hear me now?', length: '3:14' },
         { name: 'Wrong phone number', length: '2:15'}
     ]
};

var createSongRow = function (songNumber, songName, songLength){
    var template = 
            '<tr class="album-view-song-item">'
        + '     <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '     <td class="song-item-title">' + songName + '</td>'
        + '     <td class="song-item-duration">' + songLength + '</td>'
        + ' </tr>'
    ;
    return template;
};

var setCurrentAlbum = function(album) {
    
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
    
    albumTitle.firstChild.nodeValue = album.name;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label; 
    albumImage.setAttribute('src', album.albumArtUrl);
    
    albumSongList.innerHTML = ' ';
    
    for (i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i +1, album.songs[i].name, album.songs[i].length);
    }
};

var findParentByClassName = function(element, targetClass){
    var currentParent = element.parentElement; 
    while (currentParent.className != targetClass) {
        currentParent = currentParent.parentElement;
    }
    return currentParent;
};

var getSongItem = function(element){
    switch (element.className){
        // case 1: The element is a child of the target element   
        case 'album-song-button':
        case 'ion-play' :
        case 'ion-pause':
            return findParentByClassName(element, "song-item-number"); 
            
        // case 2: The element is the parent of the target element 
        case 'album-view-song-item':
            return element.querySelector(".song-item-number");
        
        // case 3: The element is a sibling of the target element 
        case 'song-item-title' :
        case 'song-item-duration' :
            return element.parentElement.querySelector('.song-item-number');
        
        // case 4: The element is the target element     
        case 'song-item-number' :
            return element;
        
        default:
            return;
    }
};

var clickHandler = function(targetElement) {
    var songNumberElement = getSongItem(targetElement);
    
    if (currentlyPlayingSong === null){
        songNumberElement.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songNumberElement.getAttribute('data-song-number');
        
    } else if (currentlyPlayingSong === songNumberElement.getAttribute('data-song-number')){
        songNumberElement.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null; 
        
    } else if (currentlyPlayingSong !== songNumberElement.getAttribute('data-song-number')){
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songNumberElement.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songNumberElement.getAttribute('data-song-number');
    }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null; 

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    
    songListContainer.addEventListener('mouseover', function(event) {
        if(event.target.parentElement.className === 'album-view-song-item'){

            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            
            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }
        }
    });
    
    for (i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event){
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            
            if (songItemNumber != currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber; 
            }
            
;        });
        
        songRows[i].addEventListener('click', function(event){
            clickHandler(event.target); 
        });
    }
};
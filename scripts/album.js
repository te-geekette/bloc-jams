var createSongRow = function (songNumber, songName, songLength){
    var template = 
            '<tr class="album-view-song-item">'
        + '     <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '     <td class="song-item-title">' + songName + '</td>'
        + '     <td class="song-item-duration">' + songLength + '</td>'
        + ' </tr>'
    ;
    var $row = $(template);
    
    var clickHandler = function(){
        var $songNumber = parseInt($(this).attr('data-song-number'));

        // no song has started yet
        if (currentlyPlayingSongNumber == null){
            $(this).html(pauseButtonTemplate);
            setSong($songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
  
        // the musik is playing but it's not the clicked song 
        }  else if (currentlyPlayingSongNumber != $songNumber){
            var oldCurrentSong = getSongNumberCell(currentlyPlayingSongNumber);
//            currentSoundFile.stop();
            $(this).html(pauseButtonTemplate);
            oldCurrentSong.html(currentlyPlayingSongNumber);
            setSong($songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
            
        // the music should stop since the playing song was clicked
        } else if (currentlyPlayingSongNumber == $songNumber) {
            if(currentSoundFile.isPaused()){
                currentSoundFile.play();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause(); 
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        } 
        updatePlayerBarSong(); 
    }; 
    
    var onHover = function(event){
        var $songNumberCell = $(this).find('.song-item-number');
        var $songNumber = parseInt($songNumberCell.attr('data-song-number'));
            
        if ($songNumber !== currentlyPlayingSongNumber){
            $songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event){
        var $songNumberCell = $(this).find('.song-item-number');
        var $songNumber = parseInt($songNumberCell.attr('data-song-number'));
            
        if ($songNumber !== currentlyPlayingSongNumber){
            $songNumberCell.html($songNumber);
        }
    }; 
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover); 
    return $row;
};

var setCurrentAlbum = function(album) {
    
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.name);
    $albumArtist.text (album.artist);
    $albumReleaseInfo.text (album.year + ' ' + album.label); 
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty(); 
    
    for (i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i +1, album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song){
    return album.songs.indexOf(song);
};

var nextSong = function(){
    // Define the current song
    var oldCurrentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var oldCurrentSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    
    // Find the next song
    if (oldCurrentSongIndex >= 0 && oldCurrentSongIndex < (currentAlbum.songs.length -1)){
        var nextSong = currentAlbum.songs[oldCurrentSongIndex +1];
    } else {
        var nextSong = currentAlbum.songs[0];
    } 
    
    // Set the last song back to it's song number
    oldCurrentSongNumberCell.html(currentlyPlayingSongNumber); 
    
    // Update the current song variables
    setSong(trackIndex(currentAlbum, nextSong) +1);
    currentSoundFile.play();
    
    // Set the play button for the next song
    var nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    nextSongNumberCell.html(pauseButtonTemplate);
    
    // Update the player
    updatePlayerBarSong();
     
};


var previousSong = function(){
    var oldCurrentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var oldCurrentSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    
    if (oldCurrentSongIndex === 0){
        var previousSong = currentAlbum.songs[currentAlbum.songs.length -1];
    } else {
        var previousSong = currentAlbum.songs[oldCurrentSongIndex -1];
    }
    
    oldCurrentSongNumberCell.html(currentlyPlayingSongNumber); 
    
    setSong(trackIndex(currentAlbum, previousSong) +1);
    currentSoundFile.play();
    
    var nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    nextSongNumberCell.html(pauseButtonTemplate);
    
    updatePlayerBarSong();
};

var updatePlayerBarSong = function(){
    $('.song-name').text(currentSongFromAlbum.name);
    $('.artist-name').text(currentAlbum.artist);
    $('.artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton); 
};

var setSong = function(songNumber){
    if (currentSoundFile){
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber -1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true,
    });
    setVolume(currentVolume);
};

var setVolume = function(volume){
    if(currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null; 
var currentAlbum = null; 
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80; 
var $nextButton = $('.main-controls .next');
var $previousButton = $('.main-controls .previous');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
});
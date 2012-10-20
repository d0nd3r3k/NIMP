/*
 *Name: Nimp Jamendo Music Player
 *Author: Donald-Derek Haddad 
 *Description: Nimp is just an HTML5 Jamendo music player made for geeks and electronic/indie music lovers.
 *             Will be adding new features in the future.
 *             + Full Playlist Control
 *             + Twitter/Facebook login to share what your listening to
 *             + Remote Control mobile app sync to Nimp by QR
 *             
 **/

//API REQUEST URLs
var API = "http://api.jamendo.com/get2/";
var REQUEST = "id+name+url+stream+duration+album_name+album_url+album_id+artist_id+artist_name/track/json/track_album+album_artist/";
            
//Reset the Album Info elements.           
function reset(){
                
    $('#Playlist ul.list').remove();
    $("#list-name").remove();
    $('#Playlist').append("<h4 id='list-name'></h4>");
    $('#Playlist').append("<ul class='list'></ul>");
    $("#loading-list").show();
}


// Get playlist based on tag name
function getPlayList(tag,n){
                
    reset();
                
    var URL = API+REQUEST+"?n="+n+"&order=ratingweek_desc&tag_idstr="+tag+"";
                
    $.ajax({
        type: 'GET',
        url: URL,
        dataType: 'json',
        success: function( data, status ){
            $("#loading-list").hide();
            $.each(data,function(j) {
                $('#Playlist ul.list').append("<li album-name='"+this.album_name+"' artist-name='"+this.artist_name+"' albumid='"+this.album_id+"' albumurl='"+this.album_url+"' trackid='"+this.id+"' onclick='playTrack("+this.id+","+this.album_id+");' id='track_"+j+"'>"+this.name+" - " + this.artist_name + "</li>");
                $('#list-name').text(tag + " List");
            });
        }
    });        
}

//Returns search result from request
function search() {
                
    reset();
                       
    var query = $('input#Searchbox').val();
                
    var URL = API+REQUEST+'?searchquery='+ query +'&order=searchweight_desc&n=500';
                
    $.ajax({
        type: 'GET',
        url: URL,
        dataType: 'json',
        success: function( data, status ){
            $("#loading-list").hide();
            $.each(data,function(j) {
                $('#Playlist ul.list').append("<li album-name='"+this.album_name+"' artist-name='"+this.artist_name+"' albumid='"+this.album_id+"' albumurl='"+this.album_url+"' trackid='"+this.id+"' onclick='playTrack("+this.id+","+this.album_id+");' id='track_"+j+"'>"+this.name+" - " + this.artist_name + "</li>");
                $('#list-name').text("Search Result");
            });
        }
    });
}
   
//Play current track, the album id is needed to get some album info   
function playTrack(track_id,album_id){   
            
    //Hacks for the intro   
    if(track_id != "188753"){
        $("#image").show();
        $("#robot").hide();
        $("#hello-world").hide();
        $("#image").find("img").remove();
    }
   
                
    $("#info").remove();
    $("#AlbumInfo").append("<div id='info'></div>")
    $("#info").append("<div id='name'></div>")
    $("#info").append("<div id='album_name'></div>")
    $("#info").append("<div id='artist_name'></div>")
    $("#info").append("<div id='download'></div>")
    $("#image").append("<img src='"+API+"image/album/redirect/?id="+album_id+"&imagesize=100'/>");
            
    $('.list li').removeClass('selected');
                
    $('.list li').each(function(index) {
        id = $(this).attr('trackid');
        if(track_id == id){
            $(this).addClass('selected');
                        
            var track_name = $(this).text();
            var album_name = $(this).attr("album-name");
            var artist_name = $(this).attr("artist-name");
            var album_url = $(this).attr("albumurl");
                        
                        
            $("#name").append("<span class='boldy'>Name: </span>"+track_name);
            $("#album_name").append("<span class='boldy'>Album Name: </span>"+album_name);
            $("#artist_name").append("<span class='boldy'>Artist Name: </span>"+artist_name);
            $("#download").append("<<a class='boldy' href='"+album_url+"' target='_BLANK'>Download Album</a>");
        }
    });
                
    $("#MusicPlayer").attr('src','http:\/\/storage-new.newjamendo.com\/?trackid='+track_id+'&format=mp31&u=0&imagesize=200');
}

//USed to animate Acrobyte 
function animateRobot(targetElement, speed){

    $(targetElement).animate(
    {
        'left': 400
    },
    {
        duration: speed,
        complete: function(){
            animateRobot(this, speed);
        }
    }
    );

};

$(document).ready(function() {
    //Default List Chiptune FTW.
    getPlayList('chiptune','100');
    playTrack("188753","28244");

    
    
     $("#MusicPlayer").bind('ended', function(){
    // Play next track  
    var next_song = $(".selected").next();
    var album_id = $(next_song).attr("albumid");
    var track_id = $(next_song).attr("trackid");
    playTrack(track_id,album_id);
    
    
});
                
    $("#image").hide();
    $("#robot").find("img").remove();
    $("#robot").append("<img src='img/logo.png'/>");
    $("#hello-world").append("<h1>Hello, World</h1>").delay(10000).fadeOut(500);
                
    setTimeout(function() {
        animateRobot($('#robot'), 10000);
        $("#robot").delay(23000).fadeOut();
    }, 11000);
                
                     
                     
    $(".criteria li").click(function(){
        var tag = $(this).attr('tag');
        getPlayList(tag,'100');
    });
                
  
});
$(function(){
    var album = "134774698@N08";
    getPicture (album, "picturediv");
    function getPicture (the_user_id, your_div_id){
        var apiKey = "80882b00609df75b919104b460459462"; // replace this with your API key
        var photoPerPage = 100;
        // get an array of random photos
    $.getJSON(
        "http://api.flickr.com/services/rest/",
        {
            //method: 'flickr.interestingness.getList',
            method: 'flickr.people.getPhotos',
            api_key: apiKey,
            user_id: the_user_id,
            format: 'json',
            nojsoncallback: 1,
            per_page: photoPerPage // you can increase this to get a bigger array
        },
        function(pagesData){
	var nbPages = pagesData.photos.pages;
    // get an array of random photos
    $.getJSON(
        "http://api.flickr.com/services/rest/",
        {
            method: 'flickr.people.getPublicPhotos',
            api_key: apiKey,
            user_id: the_user_id,
            format: 'json',
            nojsoncallback: 1,
            extras: "description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o",
            page: Math.floor(Math.random() * (nbPages - 1)) + 1,
            per_page: photoPerPage // you can increase this to get a bigger array
        },
        function(data){

            // if everything went good
            if(data.stat == 'ok'){

                $("#log").text("First JSON is fine, we are loading second JSON (you can get all data from here anyway)");
                // get a random id from the array
                var photo = data.photos.photo[ Math.floor( Math.random() * data.photos.photo.length ) ];
                if (photo == undefined) {
                    // In some cases, flickr returns some incorrect id, reloading the page in this case
                     location.reload();
                }
                // now call the flickr API and get the picture with a nice size
                $.getJSON(
                    "http://api.flickr.com/services/rest/",
                    {
                        method: 'flickr.photos.getSizes',
                        api_key: apiKey,
                        photo_id: photo.id,
                        format: 'json',
                        nojsoncallback: 1
                    },
                    function(response){
                        if(response.stat == 'ok'){
                            console.log(photo.title);
                            $("#log").text("Second JSON is fine");
                            $('#'+your_div_id+'title').text(photo.title);
                            var the_url = response.sizes.size[10].source;
                            $("#"+your_div_id).attr("src", the_url);

                        }
                        else{
                            $("#log").text("Second JSON is not good)");
                            console.log(" The request to get the picture was not good ");
                        }
                    }
                );

            }
            else{
                $("#log").text("First JSON is not good)");
                console.log(" The request to get the array was not good :( ");
            }
        }
    );
}
  );
}
});//]]>

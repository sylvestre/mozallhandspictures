$(function(){
    var album = "134774698@N08";

    getPicture(album, "picturediv");

    function showPicture(response, photo, your_div_id) {
        console.log(photo.title);
        var d = photo.datetaken.split(" ");
        $("#log").text("Second JSON is fine");
        $('#'+your_div_id+'title').text(photo.title + ' - ' + d[0]);
        var the_url = response.sizes.size[10].source;
        $("#"+your_div_id).attr("src", the_url);
    }

    function getPicture (the_user_id, your_div_id){
        var apiKey = "0b0a0a23cc70e6ebfd82f03d25f3ecbe";
        var photoPerPage = 100;
        $.getJSON(
            "https://api.flickr.com/services/rest/",
            {
                method: 'flickr.people.getPhotos',
                api_key: apiKey,
                user_id: the_user_id,
                format: 'json',
                nojsoncallback: 1,
                per_page: photoPerPage
            },
            function(pagesData){
	            var nbPages = pagesData.photos.pages;
                // get an array of random photos
                $.getJSON(
                    "https://api.flickr.com/services/rest/",
                    {
                        method: 'flickr.people.getPublicPhotos',
                        api_key: apiKey,
                        user_id: the_user_id,
                        format: 'json',
                        nojsoncallback: 1,
                        extras: "date_taken",
                        page: Math.floor(Math.random() * (nbPages - 1)) + 1,
                        per_page: photoPerPage
                    },
                    function(data){

                        // if everything went good
                        if(data.stat == 'ok'){

                            console.log("First JSON is fine, we are loading second JSON (you can get all data from here anyway)");
                            // get a random id from the array
                            var photo = data.photos.photo[ Math.floor( Math.random() * data.photos.photo.length ) ];
                            if (photo == undefined) {
                                // In some cases, flickr returns some incorrect id, reloading the page in this case
                                location.reload();
                            }
                            // now call the flickr API and get the picture with a nice size
                            $.getJSON(
                                "https://api.flickr.com/services/rest/",
                                {
                                    method: 'flickr.photos.getSizes',
                                    api_key: apiKey,
                                    photo_id: photo.id,
                                    format: 'json',
                                    nojsoncallback: 1
                                },
                                function(response){
                                    if(response.stat == 'ok'){
                                        showPicture(response, photo, your_div_id);
                                    }
                                    else{
                                        console.log("Second JSON is not good");
                                    }
                                }
                            );

                        }
                        else{
                            console.log(" The request to get the array was not good :( ");
                        }
                    }
                );
            }
        );
    }
});

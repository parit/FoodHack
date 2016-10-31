/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var postTemplate = Handlebars.compile($("#post-template").html());
var postFooterTemplate = Handlebars.compile($('#post-footer-template').html());
var postingsData = [];
var mypostingData = [];
var userData = {};
var staticURL = "http://foodhack.bonnejournee.ch/web/app_dev.php/";
var app = {

    getNextPost: function() {
        return {
            "header": {
                "id": "sdadadada",
                "rewards" : "537",
                "title" : "Lassagna de la mama",
                "description" : "Chocolate cake liquorice I love jelly beans tiramisu. Cookie carrot cake tiramisu cookie chocolate danish." + 
                                    "I love biscuit jelly-o soufflé carrot cake I love soufflé cheesecake I love. Oat cake chocolate bar halvah" + 
                                    "bonbon powder ice cream candy canes candy liquorice. Gummi bears fruitcake marshmallow I love I love marzipan" + 
                                    "cookie. Fruitcake bonbon halvah cupcake toffee I love.",
                "image": "lassagna.jpg",
                "author": "Roberta Perez"
            },
            "footer": {
                "points" : "389"
            }
        }
    },

    getMyNextPost: function() {
        return {
            "id" : "dsdadasd",
            "title": "My amazing meal",
            "createdAt": "30 mins before",
            "description": "My kick-ass master-chef-style lasagne",
            "image": "lassagna.jpg",
            "requests": [
                {"buyer": "Stella Rodriguez", "text": "Looks Amazing!", "image" : "bella.jpg"},
                {"buyer": "Johnny Gomez", "text": "I am super hungryy please! Great cooking skills!", "image" : "cool.jpg"},
                {"buyer": "Eric Scholz", "text": "I'll be in less than 5min with my car", "image" : "hungry.jpg"}
            ]
        }
    },

    getCurrentUserData: function() {
        var context = this;
         $.ajax({
                type: "GET",
                url: staticURL + "users/" + this.getCurrentUser(),
                success : function(data) {
                    console.log("user data");
                    console.log(data);
                    userData = data;
                    var footer = $('#footer');
                    footer.html(''); 
                    footer.append(postFooterTemplate({"name" : userData.firstname + ' ' + userData.lastname, "points" : userData.points}));
                    context.attachEventHandlersForLikeDisLike();
                }
            });
    },

    viewPort: function() {
        return {
            width  : $(window).width() * 0.7,
            height : $(window).height() * 0.5
        };
    },

    makePost: function(url, data, fn) {
        var context = this;
        $.post(url, data)
            .done(function(dat){
                fn.call(context,dat);
            }); 
    },

    // updatePost: function(post) {
    //     var intro = $('#intro');
    //     intro.html(''); 
    //     intro.append(postTemplate(post.header));
    //     var footer = $('#footer');
    //     footer.html('');
    //     // console.log("user data rendering")?
    //     // footer.append(postFooterTemplate({"name" : userData.firstname + ' ' + userData.lastname, "points" : userData.points}));
    //     this.attachEventHandlersForLikeDisLike();
    // },

    loadNext: function() {
        var post = postingsData[0];
        // console.log("Loading next post");
        // console.log(post);
        var intro = $('#intro');
        intro.html(''); 
        intro.append(postTemplate(post.header));
    },

    fetchAndLoadDataDiscovery : function() {
        var context = this;
        $.ajax({
            type: "GET",
            data: {uid: context.getCurrentUser()}, 
            url: staticURL + "users/" + this.getCurrentUser() + "/postings/next",
            async: false,
            success : function(dat) {
                console.log("data received for discovery postings");
                console.log(dat);
                postingsData = dat.postings.map(function(el){
                return {
                    "header": {
                        "id": el.id,
                        "rewards" : el.co2Saved,
                        "title" : el.title,
                        "description" : el.description,
                        "image": el.image,
                        "author": el.seller.firstname + ' ' + el.seller.lastname
                    },
                    "footer": {
                        "points" : el.points,
                        "name": el.seller.firstname + ' ' + el.seller.lastname
                    }
                };
                });
                context.loadNext();
            }
        });

        // postingsData = [this.getNextPost()];
        // this.loadNext();
    },
    fetchAndloadListData: function() {
        var context = this;
        $.ajax({
            type: "GET",
            url: staticURL + "users/" + this.getCurrentUser() + "/postings",
            // data: {uid: context.getCurrentUser()}, 
            success : function(data) {
                console.log("postings received");
                console.log(data);
                mypostingData = data.postings;
                context.loadListPage();
            }
        });
        // mypostingData = [this.getMyNextPost()];
        // this.loadListPage();
    },
    // Application Constructor
    initialize: function() {
        console.log("initializing");
        this.fetchAndLoadDataDiscovery();
        this.fetchAndloadListData();
        this.getCurrentUserData();
    },

    loadListPage: function() {
        var reqList = $('#requestList');
        reqList.html('');
        var posting = mypostingData[0];
        console.log("Loading my post");
        console.log(posting);
        var html = '<li class="myPost list-item" data-role="list-divider">' +
                '<div class="myPost-image list-image" style="background:url(\'' + posting.image + '\');background-size: cover;"></div>' +
                '<div class=" list-text" id="' + posting.id+ '">' +
                    '<h3> ' + posting.title + '</h3>' + '<p>' + posting.createdAt + '</p>' + '<p>' + posting.description + ' </p>'  +
                '</div>' +
                '<div class="list-actions">' +
                    '<a href="" data-role="button" class="btn-round btn-requests">' + posting.requests.length + '</a>' +
                '</div>' +
            '</li>';
        // console.log("initial html" + html)
        posting.requests.forEach(function(el){
            var l = 
            '<li class="myPost-requests list-item" data-role="list-divider">' +
                '<div class="myPost-image list-image" style="background:url(\'' + el.buyer.picture + '\');background-size: cover;"></div>' +
            '<div class=" list-text">' +
                '<h3>' + el.buyer.firstname + ' ' + el.buyer.lastname + '</h3>' + '<p>Within 1 km</p>' + '<p>' + el.text + '</p>' +
            '</div>' +
            '<div class="list-actions">' +
                '<a href="" data-role="button"  class="btn-round btn-like "><img src="images/like.png"></a>' +
                '</div>' +
            '</li>';
            html = html + l;
        });
        // console.log("final html" + html)
        reqList.html(html);
    },

    getCurrentUser: function(){
        return $('#currentUser').val();
    },


    attachEventHandlersForLikeDisLike: function() {
        var context = this;

        $('#listbutton').on('click', function(e){
            $('body').pagecontainer("change", "#listPage", {});
            context.loadListPage();
            e.preventDefault();
        });
        $('#likeButton').on('click', function(e){
            // removed from the global list
            var currentData = postingsData.shift();
            console.log("liking" + currentData);
             $.ajax({
                type: "POST",
                data: {"buyerId": context.getCurrentUser()}, 
                url: staticURL + "postings/" + currentData.header.id + "/requests",
                async: false,
                success : function(data) {
                    console.log("like response");
                    console.log(data);
                    context.loadNext();
                }
            });
            e.preventDefault();
        });
        $('#dislikeButton').on('click', function(e){
            // removed from the global list
            var currentData = postingsData[0];
            console.log("disliking" + currentData);
             $.ajax({
                type: "GET",
                url: staticURL + "users/" + context.getCurrentUser() + "/ignores/" + currentData.header.id,
                async: false,
                success : function(data) {
                    postingsData.shift();
                    console.log("dislike response");
                    console.log(data);
                    console.log("new postings" + postingsData);
                    context.loadNext();
                }
            });
            e.preventDefault();
        });

        $('#cameraButton2').on('click', function(e){
            $('#cameraButton').trigger('click');
        });

        $('#cameraButton').on('click', function(e){
            console.log("Open camera for taking pictures");
            var con = context;
            navigator.camera.getPicture(function (imageData) {
                var image = document.getElementById('imageContainer');
                var viewport = context.viewPort();
                image.setAttribute('style', 'width:' + viewport.width + 'px;height:' + viewport.height +'px');
                image.src = "data:image/jpeg;base64," + imageData;
                $('#foodTitle').val('');
                $('#description').val('');
                $('body').pagecontainer("change", "#imagePage", {});
            }, function(message){
                alert('Failed because: ' + message);    
            },{   
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
                encodingType: 0     // 0=JPG 1=PNG
            });
            e.preventDefault();
        });

        $('#uploadImage').on('click', function(e){
            var data = {
                "title" : $('#foodTitle').val(),
                "description": $('#description').val(),
                "image": $('#imageContainer').attr('src'),
                "sellerId": $('#currentUser').val()
            };
            $.post(staticURL + "postings" , data).done(function(data) {
                console.log("post response");
                console.log(data);
                context.fetchAndloadListData();
                $('body').pagecontainer("change", "#main-page", {});
            });
            e.preventDefault();
        });
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    // http://gajus.com/sandbox/swing/examples/card-stack/

    takePicture: function() {
        console.log("Open camera for taking pictures")
        navigator.camera.getPicture(function (imageData) {
            document.getElementById('imgContainer').src = "data:image/jpeg;base64," + imageData;
        }, function(message){
              alert('Failed because: ' + message);    
        },{   
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
            encodingType: 0     // 0=JPG 1=PNG
         });
    }
};

app.initialize();
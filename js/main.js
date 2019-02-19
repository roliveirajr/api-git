'use strict';

/*SELECT ELEMENTS*/
let buttonSearch = $('#search-profiles button');
let __campTextSearch = $('#search-profiles input');
let _pageHome = $('body');
var dateUser =""

let home = {

    validateSearch: function () {

        if ($(__campTextSearch).val().length < 3){
            alert('Verifique os campos e tente novamente');
            return false
        }else {
            this.getInfos();
            this.getRepos();
        }
    },

    getInfos: function(){
        let dateUser = $(__campTextSearch).val();
        let urlGetUser ='https://api.github.com/users/' + dateUser;

        $.ajax({
            url: urlGetUser,
            type: "GET",
            dataType: 'json',
        }).done(function (data) {
            $(_pageHome).addClass('search-complete');

            let _avatar = data.avatar_url;
            let _name = data.name;
            let _followers = data.followers;
            let _following = data.following;
            let _email = data.email;


                $('.cont-resultuser img').attr('src', _avatar);
                $('.name-user span').text(_name);
                $('.followers span').text(_followers);
                $('.following span').text(_following);
                $('.email span').text(_email);
            
        }).fail(function () {
            alert('serviço indisponivel no momento! tente novamente mais tarde.');
        });
    },
    getRepos: function() {
        dateUser = $(__campTextSearch).val();
        let urlGetRepos = 'https://api.github.com/users/' + dateUser + '/repos';
        $.ajax({
            url: urlGetRepos,
            type: "GET",
            dataType: 'json',
        }).done(function (data) {
            var reposValue = data.sort(function (a, b) {
                return parseFloat(b.stargazers_count) - parseFloat(a.stargazers_count);
            });

            home.includeAndOrderby(reposValue);
            
            var orderBy = function(){
                $('.order-by a').on('click', function(){
                    if($(this).hasClass('less-stars')){
                        var reposValue = data.sort(function (a, b) {
                            return parseFloat(a.stargazers_count) - parseFloat(b.stargazers_count);
                        });
                        home.includeAndOrderby(reposValue);

                    }else if($(this).hasClass('more-stars')){
                        var reposValue = data.sort(function (a, b) {
                            return parseFloat(b.stargazers_count) - parseFloat(a.stargazers_count);
                        });
                        home.includeAndOrderby(reposValue);
                    }
                });
            };
            orderBy();
        })
    },

    includeAndOrderby: function(reposValue){
        var repoList = '';
        $.each(reposValue, function (index, value) {
            console.log(value);
            let stars = value.stargazers_count;
            let nameRepo = value.name.replace(new RegExp('-', 'g'), " ");
            let linkTo = '/detail.html?'+ value.name +'?'+ index +'?'+ dateUser +'';
            repoList += '<div class="repo-list" data-position="' + stars + '"><a href="'+ linkTo +'"><p>Title: ' + nameRepo + '</p> <span class="fav-stars">' + stars + ' stars</span><a/></div>'
        });
        $('.repos').html(repoList);
    }
};

let detail = {
    renderPage: function(){
        var parametersPage = window.location.search.split('?');
        var indexDirectore = parametersPage[2]
        var localDirectore = parametersPage[3]


        var urlGetRepo = 'https://api.github.com/users/' + localDirectore + '/repos';

        $.ajax({
            url: urlGetRepo,
            type: "GET",
            dataType: 'json',
        }).done(function (data) {
            var directore = data[indexDirectore];
            console.log(directore);
            $('h1.title').html(directore.name);
            $('.stars').html('<b>Stars: </b>' +directore.stargazers_count);
            $('.language').html('<b>Language</b>: ' + directore.language);
            $('.description').html('<b>Description</b>: ' + directore.description);
            $('.link-to').html('Link: <a href="https://github.com/'+ localDirectore +'/'+ directore.name +'">Click here!</a>')
            
        })
    }
}

$(document).ready(function(){
    if (window.location.pathname == '/detail.html'){
        detail.renderPage();
    }else {
        $(buttonSearch).on('click', function(){
            home.validateSearch();
        });
    }
});

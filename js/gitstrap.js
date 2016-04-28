/* get the file and send the text to the callback */
function getFile(filename, callback) {

    /* If the config file can be downloaded send its text to the callback.
        */
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.status==200 && req.readyState==4) {
            callback(req.responseText);
        }else if(req.status==404){
            fillDiv('ERROR: 404, File Not Found: "' + filename + '"', 'error_div');
        }
    }

    req.open('GET',filename,true);
    req.send();

} /* getFile() */

function appendAttribute(elem, name, value) {
    var attr = elem.getAttribute(name);
    if (attr == null) {
        elem.setAttribute(name, value);
    } else {
        elem.setAttribute(name, attr + " " + value);
    }
}

/* 0. TITLE - change title to user config */
function setTitle(title) {
    $('.main-title').html(title);

    if (title == 'GitStrap') {
        $('#github_ribbon').show()
    }
}

/* 1. THEME - get the theme loaded first to ensure css is setup before
    * adding other elements. */
function setTheme(theme) {

    /* check for theme name or url */
    var direct_url = theme;
    var name_url = 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/' +
        theme + '/bootstrap.min.css';

    /* who knows if this actually validates a url? */
    var theme_url = '';
    function valid_url(url){
        return /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(url);
    }

    /* see if the user specifies the full url */
    if (valid_url(direct_url)) {
        theme_url = direct_url;
    }
    /* see if the user specified a bootswatch name */
    else if (valid_url(name_url)) {
        theme_url = name_url;
    }
    
    function add_style(url){
        new_style = '<link rel="stylesheet" href="' + url +
            '" type="text/css" media="screen" />';
        $('head').append(new_style);
    }
    add_style(theme_url);
}

/* Parse the query string for 'name' */
function getURLParameter(name) {
    return decodeURI((RegExp(name + '=' +
        '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}

function blogON(blog_items) {
    return blog_items[0] != 'false';
}

function determineActivePage(nav_items, blog_items) {

    /* check for requested posts */
    var post_found = 0;
    var post_index = -1;
    var req_post = getURLParameter('post');
    if (! (req_post == 'null' || req_post == null)) {
        post_index = blog_items.indexOf(req_post);
        if (post_index > 0) { /* skip the post-index-page title (elem 0) */
            post_found = 1;
        }
    }
    console.log('req_post: '+ req_post);

    /* pages take precedence */
    var page_found = 0;
    var page_index = -1;
    var req_page = getURLParameter('page');
    if (! (req_page == 'null' || req_page == null)) {
        page_index = nav_items.indexOf(req_page);
        if (page_index >= 0) {
            page_found = 1;
        }
    }

    console.log('req_page: '+req_page);

    /* select page */
    active_page = nav_items[0]; /* default landing page */
    if (post_found) {
        active_page = blog_items[post_index];
    }
    if (page_found) {
        active_page = nav_items[page_index];
    console.log('active_page pf: '+active_page);
        if (active_page == 'BLOG') {
            active_page = blog_items[0];
        }
    }
    console.log('active_page: '+active_page);

    return active_page;
}

/* 2. NAVIGATION */
/* create buttons for each item and append to navbar and return the name
    * of the active page. */
function populateNavLinks(nav_items, blog_items) {

    var navbar_obj = document.getElementById('nav-placeholder');
    var req_page = determineActivePage(nav_items, blog_items);

    for (index=0;index<nav_items.length;index++) {

        var li = document.createElement('li');
        var a  = document.createElement('a');

        /* select active page and nav buttons */
        appendAttribute(a, 'class', 'non-active-nav');

        /* check for blog nav items */
        var item = nav_items[index];
        if (item == 'BLOG') {
            item = blog_items[0];
        }

        /* make the nav tab show up as 'active' by excluding it from
            * the non-active-nav class. */
        if (req_page == item) {
            a.removeAttribute('class');
            appendAttribute(li, 'class', 'active');
        }

        appendAttribute(li, 'id', 'navitem');
        appendAttribute(li, 'class', 'nav-item');

        /* setup nav links for each button */
        appendAttribute(a, 'class', 'nav-link');
        appendAttribute(a, 'href', '?page='+item+'#');
        appendAttribute(a, 'data-toggle','tab');

        /* make sure the ribbon doesn't get in the way */
        appendAttribute(a, 'style', 'z-index: 1000;');

        /* set nav button name */
        a.innerHTML = item;

        li.appendChild(a);
        navbar_obj.appendChild(li);
    }
    return req_page;
}

/* 3. HEADER */
/* Write the Jumbotron content. */
function setHeader(header) {
    if (header != 'false') {
        toHTML( header, 'markdown_header');
    }
}

/* 4. FOOTER */
function setFooter(footer) {
    if (footer != 'false') {
        toHTML( footer, 'markdown_footer');
    }
}

/* 5. BLOG */
function populateBlogIndex(blog_items) {
    if (blogON(blog_items)) {

        var md_body_obj = document.getElementById('markdown_body');
        var ul = document.createElement('ul');
        md_body_obj.appendChild(ul);
        for (i=0;i<blog_items.length;i++) {
            var li = document.createElement('li');
            li.innerHTML = blog_items[i];

            ul.appendChild(li);
        }
    }
}

/* act on all options given in the Config file */
function parseConfig(text) {

    /* Split config file into options. */
    var options = [];
    var words = text.split('\n');
    for (var i = 0; i < words.length; i++) {
        /* ignore '#' and blank lines */
        if(! (words[i].match(/^#/) || (! words[i]))) {
            /* options are only on lines that start with blockquotes '>' */
            if( words[i].match(/^>\S+/) ) {
                options.push(words[i].replace(/^>/, ''));
            }
        }
    }

    /* line 0: title 
        * line 1: nav filenames
        * line 2: theme name or url
        * line 3: header filename
        * line 4: footer filename
        * line 5: blog filenames
        */
    var title = options[0];
    var nav_items = options[1].split(' '); 
    var theme = options[2];
    var header = options[3];
    var footer = options[4];
    var blog_items = options[5].split(' ');

    /* process options */
    setTitle(title);
    setTheme(theme);
    var active_page = populateNavLinks(nav_items, blog_items);
    setHeader(header);
    setFooter(footer);

    console.log('active_page: '+active_page);

    /* if the blog index page is chosen */
    if (active_page == blog_items[0]) {
        populateBlogIndex(blog_items);
    } else {
        /* The active page needs to correspond to a file at this point so 
        * that the getter can download it.  The getter should be post aware.
        */
        toHTML(active_page, 'markdown_body'); 
    }
} /* parseConfig() */

/* translate markdown text to html then fillDiv() */
function writeMarkdownToTag(text, markdown_div) {
    var converter = new showdown.Converter(),
        html = converter.makeHtml(text);
    fillDiv(html, markdown_div);
}

/* fill in the specified div innerHTML with the given text */
function fillDiv(text, div){
    var node = document.getElementById(div);
    node.innerHTML = text;
    $('#'+div).show();
}

/* download a markdown file, convert to HTML, then post to given div-id */
function toHTML(pageName, markdown_div)
{
    var callback = function (text)
        { writeMarkdownToTag(text, markdown_div); };
    getFile(pageName, callback);
}

/* download a markdown file, convert to HTML, then post to given div-id */
function toFrontMatter(pageName)
{
    var callback = function (text)
    { 
        var obj =  jsyaml.loadFront(text)
        console.log(obj); 
        console.log(obj.__content); 
    };
    getFile(pageName, callback);
}
toFrontMatter('posts/GPI-v1-Release.md');


/* Link tab actions. */
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    var href = $(e.target).attr('href');
    window.location.assign(href);
})

/* start things off with the Config file */
$(document).ready(getFile('Config', parseConfig));

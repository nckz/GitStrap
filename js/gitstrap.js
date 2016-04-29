/* GitStrap.js 
 * requires:
 *  jQuery 1.12.0
 *  bootstrap 3.3.6
 *  showdown 1.3.0
 *  js-yaml-front-client 3.4.0
 */

/* GLOBAL ------------------------------------------------------------------ */
var gs_blog_keyword = 'GSBLOG';

/* HELPER FUNCTIONS -------------------------------------------------------- */
/* A file getter that dumps 404 errors to a tagged div on the index.html. */
function getFile(filename, callback, async = true) {

    /* If the config file can be downloaded send its text to the callback.
        */
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.status==200 && req.readyState==4) {
            callback(req.responseText);
        }else if(req.status==404){
            fillDiv('ERROR: 404, File Not Found: "' + filename + '"', 'error_div');
        }
    };

    req.open('GET',filename,async);
    req.send();

} // - getFile()

/* Add a value to an existing attribute. */
function appendAttribute(elem, name, value) {
    var attr = elem.getAttribute(name);
    if (attr == null) {
        elem.setAttribute(name, value);
    } else {
        elem.setAttribute(name, attr + " " + value);
    }
} // - appendAttribute()

/* Change the title div and 'title' tag to user config.*/
function setTitle(title) {
    $('.main-title').html(title);

    if (title == 'GitStrap') {
        $('#github_ribbon').show()
    }
} // - setTitle()

/* Get the theme loaded first to ensure css is setup before. */
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

/* Fill in the specified div innerHTML with the given text. */
function fillDiv(text, div){
    var node = document.getElementById(div);
    node.innerHTML = text;
    $('#'+div).show();
}

/* Download a markdown file, convert to HTML, then post to given div-id. */
function MarkdownToHTML(relpath, markdown_div)
{
    var callback = function (text) {
        var converter = new showdown.Converter(),
        html = converter.makeHtml(text);
        fillDiv(html, markdown_div);
    };

    getFile(relpath, callback);
}

/* Download a post file (yaml + markdown), parse YAML, convert to HTML, then
 * post to given div-id. */
function PostToHTML(relpath, markdown_div)
{
    var callback = function (text) {

        /* parse YAML header */
        var obj = jsyaml.loadFront(text)

        /* write some HTML to format the data */
        var md_body_obj = document.getElementById('markdown_body');
        var ul = document.createElement('ul');
        md_body_obj.appendChild(ul);
        var li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML = '<b>'+obj.Title + '</b><br> ' + obj.Author + ' - <small>' + obj.Date.toDateString() + '</small><br><i>' + obj.Summary + '</i>';

        console.log(obj); 

    };
    getFile(relpath, callback);
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
        if (item == gs_blog_keyword) {
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
        MarkdownToHTML( header, 'markdown_header');
    }
}

/* 4. FOOTER */
function setFooter(footer) {
    if (footer != 'false') {
        MarkdownToHTML( footer, 'markdown_footer');
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

/* OBJECTS ----------------------------------------------------------------- */
/* Config object
 * 'Config' file parser object */
function Config(filename) {

    var self = this;

    this.filename = filename
    this.title = "";      // string
    this.nav_items = [];  // list of string, filenames/nav-tab-titles
    this.nav_items_bname = []; // list of nav items with chosen blog index name
    this.theme = "";      // string theme-name or url
    this.header = "";     // string filename
    this.footer = "";     // string filename
    this.blog_items = []; // list of strings, filenames of posts
    this.requested_page = ""; // the client requested page based on url query

    this.parseFile = function (text) {

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
        self.title = options[0];
        self.nav_items = options[1].split(' '); 
        self.theme = options[2];
        self.header = options[3];
        self.footer = options[4];
        self.blog_items = options[5].split(' ');

        /* replace BLOG with blog name */
        self.nav_items_bname = self.nav_items.slice(); // copy
        var blog_index = self.nav_items_bname.indexOf(gs_blog_keyword);
        self.nav_items_bname[blog_index] = self.blog_items[0];

        self.determineActivePage();

    }; // - parseFile()

    this.determineActivePage = function() {
        /* This function verifies whether the url query resolves to an existing
         * page. If not, the landing page is selected. If there is both a
         * requested page and post, the page takes precedence. */

        /* check for requested posts */
        var post_found = 0;
        var post_index = -1;
        var req_post = self.getURLParameter('post');
        if (! (req_post == 'null' || req_post == null)) {
            post_index = self.blog_items.indexOf(req_post);
            if (post_index > 0) { /* skip the post-index-page title (elem 0) */
                post_found = 1;
            }
        }

        /* pages take precedence */
        var page_found = 0;
        var page_index = -1;
        var req_page = self.getURLParameter('page');
        if (! (req_page == 'null' || req_page == null)) {
            page_index = self.nav_items_bname.indexOf(req_page);
            if (page_index >= 0) {
                page_found = 1;
            }
        }

        /* select page */
        active_page = self.nav_items_bname[0]; /* default landing page */
        if (post_found) {
            active_page = self.blog_items[post_index];
        }
        if (page_found) {
            active_page = self.nav_items_bname[page_index];
        }

        self.requested_page = active_page;
    };

    /* Parse the query string for 'name'. */
    this.getURLParameter = function(name) {
        return decodeURI((RegExp(name + '=' +
            '(.+?)(&|$)').exec(location.search)||[,null])[1]);
    };

    /* Return true if the user choose to blog, else false. */
    this.isBlog = function() {
        return (self.nav_items.indexOf(gs_blog_keyword) >= 0);
    };
    
    /* Return true if the blog index was requested */
    this.blogIndexActive = function() {
        if (self.isBlog()) {
            if (self.requested_page == self.blog_items[0]) {
                return true;
            }
        }
        return false;
    };

    /* Initialize with Config data. This is the first required step for setting
     * up the website. -It is therefore required to be synchronous. */
    getFile(self.filename, self.parseFile, false);

} // - Config()

/* Nav object 
 * Populates navbar based on user config. */
function Nav(conf) {

    var self = this;

    this.conf = conf;
    this.navbar_obj = document.getElementById('nav-placeholder');

    /* The nav is a <ul> with items <li> and page links <a>. */
    this.genNavListTags = function() {

        for (index = 0; index < self.conf.nav_items.length; index++) {

            var li = document.createElement('li');
            var a  = document.createElement('a');
            var item = self.conf.nav_items_bname[index]; // get link names

            /* Select active page and nav buttons. Make nav items non-active
             * by default. */
            appendAttribute(a, 'class', 'non-active-nav');

            /* make the nav tab show up as 'active' by excluding it from
             * the non-active-nav class. */
            if (self.conf.requested_page == item) {
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
            self.navbar_obj.appendChild(li);
        }
    };
    this.genNavListTags();

} // - Nav()

/* BlogIndex object 
 * Populates the blog index page. 
 *  -eventually pagination.
 */
function BlogIndex(conf) {

    var self = this;

    this.conf = conf;

    

}

/* MAIN -------------------------------------------------------------------- */
function gitstrap() {
    var gsConfig = new Config('Config');
    console.log(gsConfig);

    /* make sure these show up before more expensive processes happen */
    setTitle(gsConfig.title);
    setTheme(gsConfig.theme);

    /* fill in the nav */
    var gsNav = new Nav(gsConfig);
    console.log(gsNav);

    /* async GETs */
    setHeader(gsConfig.header);
    setFooter(gsConfig.footer);

    PostToHTML('posts/GPI-v1-Release.md', 'markdown_body');

    return;
    /* if the blog index page is chosen */
    if (gsConfig.blogIndexActive()) {
        populateBlogIndex(gsConfig.blog_items);
    } else {
        /* The active page needs to correspond to a file at this point so 
         * that the getter can download it.  The getter should be post aware.
         */
        MarkdownToHTML(gsConfig.requested_page, 'markdown_body'); 
    }
} // - gitstrap()

/* Link tab actions. */
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    var href = $(e.target).attr('href');
    window.location.assign(href);
})

$(document).ready(gitstrap);

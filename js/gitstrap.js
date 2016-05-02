/* GitStrap.js 
 * requires:
 *  jQuery 1.12.0
 *  bootstrap 3.3.6
 *  showdown 1.3.0
 *  js-yaml-front-client 3.4.0
 */

/* GLOBAL ------------------------------------------------------------------ */
/* scripts and css */

/* DEV */

/* js */
var gs_jquery_url = "https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js";
var gs_bootstrap_url = "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js";
var gs_showdown_url = "https://cdn.rawgit.com/showdownjs/showdown/1.3.0/dist/showdown.min.js";

/* served from a specific github commit */
var gs_jsyaml_url = "https://cdn.rawgit.com/nckz/GitStrap/fa12906d40aac6596f8d7601fddf7b21dc9b47a3/js/js-yaml-front-client.min.js"
var gs_jsyaml_map_url = "https://cdn.rawgit.com/nckz/GitStrap/fa12906d40aac6596f8d7601fddf7b21dc9b47a3/js/js-yaml-front-client.min.js.map"

/* development url */
//var gs_bootgitstrap_url = "https://cdn.rawgit.com/nckz/GitStrap/gh-pages/js/bootgitstrap.min.js"; /* CDN */
var gs_bootgitstrap_url = "js/bootgitstrap.min.js"; /* local copy */

/* css */
var gs_default_theme_url = "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css";
//var gs_css_url = "https://cdn.rawgit.com/nckz/GitStrap/gh-pages/css/gitstrap.css" /* CDN */
var gs_css_url = "css/gitstrap.css" /* local copy */

/* configurable elements */
var gs_blog_keyword = 'GSBLOG';
var gs_post_path = 'posts';

/* object ids */
var gs_error_id = 'gs_error_id';
var gs_footer_id = 'gs_footer_id';
var gs_header_id = 'gs_header_id';
var gs_body_id = 'gs_body_id';
var gs_ribbon_id = 'gs_ribbon_id';
var gs_nav_title_id = 'gs_nav_title_id';
var gs_title_id = 'gs_title_id';
var gs_nav_placeholder_id = 'gs_nav_placeholder_id';
var gs_navbar_id = 'gs_navbar_id';

/* GITSTRAP VERSION -------------------------------------------------------- */
/* This will change the url string to point to the selected version of
 * GitStrap. The version
 */
var gs_version = ''

/* HEAD TAG ---------------------------------------------------------------- */
var gs_html_head_tag = ' \
    <meta charset="utf-8"> \
    <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
    <meta name="viewport" content="width=device-width, initial-scale=1">';

/* BODY TAG ---------------------------------------------------------------- */
var gs_html_body_tag = ' \
 \
<!-- GitHub ribbon --> \
<a href="https://github.com/nckz/GitStrap"><img style="display: none; position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" id="gs_ribbon_id"></a> \
 \
<title id="gs_title_id">GitStrap</title> \
 \
<div class="container"> <!-- all page content --> \
    <!-- Navigation --> \
    <nav class="navbar"> \
        <div class="container-fluid"> \
            <div class="navbar-header"> \
                <button type="button" class="navbar-toggle" type="button" \
                    data-toggle="collapse" \
                    data-target="#gs_navbar_id"> \
                    &#9776; \
                </button> \
                <h2 class="text-muted" id="gs_nav_title_id">GitStrap</h2> \
            </div><!-- navbar-header --> \
            <div class="collapse navbar-collapse navbar-right" id="gs_navbar_id"> \
                <ul class="nav navbar-nav" id="gs_nav_placeholder_id"></ul> \
            </div> \
        </div><!-- container-fluid --> \
    </nav> \
    <!-- Error --> \
    <div class="jumbotron" id="gs_error_id" style="display: none; color: red;"></div> \
    <!-- Running Header --> \
    <div class="jumbotron" id="gs_header_id" style="display: none;"></div> \
    <!-- Markdown Content --> \
    <div id="gs_body_id"> </div> \
    <!-- Running Footer--> \
    <hr> \
    <footer class="footer text-center" id="gs_footer_id" style="display: none;"> \
    </footer> \
</div> <!-- /container -->';

/* LOAD HTML --------------------------------------------------------------- */
/* Insert the html head and body tags, load the default bootstrap and gitstrap
 * css then the javascripts. */
window.onload = function() {

    if (document.head == null) { // IE 8
        alert("You must update your browser to view this website.");
    }

    document.head.innerHTML = gs_html_head_tag;
    document.body.innerHTML = gs_html_body_tag;

    /* load css afap */
    add_style(gs_default_theme_url);
    add_style(gs_css_url);

    /* load js synchronously */
    var scripts = [gs_jquery_url, gs_bootstrap_url, gs_showdown_url, gs_jsyaml_url, gs_bootgitstrap_url];
    loadAndExecuteScripts(scripts, 0, function () {} );
}

/* HELPER FUNCTIONS -------------------------------------------------------- */
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function add_style(url) {
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    head.appendChild(link);
}

function getScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    // most browsers
    script.onload = callback;
    // IE 6 & 7
    script.onreadystatechange = function() {
        if (this.readyState == 'complete') {
            callback();
        }
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}

function loadAndExecuteScripts(aryScriptUrls, index, callback) {
    getScript(aryScriptUrls[index], function () {
        if(index + 1 <= aryScriptUrls.length - 1) {
            loadAndExecuteScripts(aryScriptUrls, index + 1, callback);
        } else {
            if(callback)
                callback();
        }
    });
}

/* A file getter that dumps 404 errors to a tagged div on the index.html. */
function getFile(filename, callback, async) {

    var async = typeof async !== 'undefined' ?  async : true;

    /* If the config file can be downloaded send its text to the callback.
        */
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.status==200 && req.readyState==4) {
            callback(req.responseText);
        }else if(req.status==404){
            var err_txt = 'ERROR: 404, File Not Found: "' + filename + '"';
            fillDiv(err_txt, gs_error_id);
            console.log(err_txt);
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
    document.getElementById(gs_title_id).innerHTML = title;
    document.getElementById(gs_nav_title_id).innerHTML = title;

    if (title == 'GitStrap') {
        document.getElementById(gs_ribbon_id).style.display = 'block';
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
    
    /* css */
    add_style(theme_url);
}

/* Fill in the specified div innerHTML with the given text. */
function fillDiv(text, div){
    var node = document.getElementById(div);
    node.innerHTML = text;
    node.style.display = 'block';
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
function PostToHTML(relpath, markdown_body) {
    var callback = function (text) {

        /* circumvent github's auto-meta parsing */
        text = text.replace("(((",'---');
        text = text.replace(")))",'---');

        /* write some HTML to format the data */
        var body = document.getElementById(markdown_body);
        var post_head = document.createElement('div');
        var post_body = document.createElement('div');
        body.appendChild(post_head);
        body.appendChild(post_body);

        if ((isBlank(text)) || (text == null) || (text == 'null') || (typeof text === 'undefined')) {
            post_head.innerHTML = 'Unable to load text for: '+relpath;
            return;
        }

        /* parse YAML header */
        var obj = jsyaml.loadFront(text)

        /* check for post meta data */
        var date = typeof obj.Date !== 'undefined' ?  obj.Date.toDateString() : '';
        var author = typeof obj.Author !== 'undefined' ?  obj.Author : '';
        var summary = typeof obj.Summary !== 'undefined' ?  obj.Summary : '';
        var title = typeof obj.Title !== 'undefined' ?  obj.Title : '';

        /* write some HTML to format the data */
        post_head.innerHTML = '<b>'+title+'</b><br> &nbsp; &nbsp; '+author+
                              ' | <small>'+date+'</small><br><br>';

        /* convert the unparsed content as markdown */
        var converter = new showdown.Converter();
        post_body.innerHTML = converter.makeHtml(obj.__content);

    };
    getFile(relpath, callback);
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
    this.post_active = false; // signal if a post is active, set by determineActivePage().

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

    this.headerIsActive = function() {
        return self.header != 'false';
    };

    this.footerIsActive = function() {
        return self.footer != 'false';
    };

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
            self.post_active = true;
        }
        if (page_found) {
            active_page = self.nav_items_bname[page_index];
            self.post_active = false;
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
    this.blogIndexIsActive = function() {
        if (self.isBlog()) {
            if (self.requested_page == self.blog_items[0]) {
                return true;
            }
        }
        return false;
    };

    this.postIsActive = function() {
        return self.post_active;
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
    this.navbar_obj = document.getElementById(gs_nav_placeholder_id);

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

    this.genBlogIndex = function() {

        /* write some HTML to format the data */
        var md_body_obj = document.getElementById(gs_body_id);
        var ul = document.createElement('ul');
        appendAttribute(ul, 'class', 'list-group');
        md_body_obj.appendChild(ul);

        for (index = 1; index < self.conf.blog_items.length; index++) {
            var item = self.conf.blog_items[index];
            var li = document.createElement('li');
            li.setAttribute('id', item);
            appendAttribute(li, 'class', 'list-group-item');
            ul.appendChild(li);

            self.PostPreviewToHTML(gs_post_path+'/'+item, item);
        }
    };

    /* Download a post file (yaml + markdown), parse YAML, convert to HTML, then
     * post to given div-id. */
    this.PostPreviewToHTML = function(relpath, markdown_div) {
        var callback = function (text) {

            /* circumvent github's auto-meta parsing */
            text = text.replace("(((",'---');
            text = text.replace(")))",'---');

            if ((isBlank(text)) || (text == null) || (text == 'null') || (typeof text === 'undefined')) {
                var li = document.getElementById(markdown_div);
                li.innerHTML = 'Unable to load text for: '+relpath;
                return;
            }

            /* parse YAML header */
            var obj = jsyaml.loadFront(text)

            /* check for post meta data */
            var date = typeof obj.Date !== 'undefined' ?  obj.Date.toDateString() : '';
            var author = typeof obj.Author !== 'undefined' ?  obj.Author : '';
            var summary = typeof obj.Summary !== 'undefined' ?  obj.Summary : '';
            var title = typeof obj.Title !== 'undefined' ?  obj.Title : '';

            /* write some HTML to format the data */
            var li = document.getElementById(markdown_div);
            li.innerHTML = '<a href=?post='+markdown_div+'><b>'+title+
                '</b><br></a> ' + author + ' | <small>' + 
                date + '</small><br><i>' + summary +
                '</i>';

        };
        getFile(relpath, callback);
    };

    this.genBlogIndex();
}

/* MAIN -------------------------------------------------------------------- */
function gitstrap() {
    var gsConfig = new Config('Config');

    /* make sure these show up before more expensive processes happen */
    setTitle(gsConfig.title);
    setTheme(gsConfig.theme);

    /* fill in the navbar */
    var gsNav = new Nav(gsConfig);

    /* async GETs */
    if (gsConfig.headerIsActive() && ! gsConfig.postIsActive()) {
        MarkdownToHTML(gsConfig.header, gs_header_id);
    }
    if (gsConfig.footerIsActive()) {
        MarkdownToHTML(gsConfig.footer, gs_footer_id);
    }

    /* Fill the body content with either a blog-index, post or page. */
    if (gsConfig.blogIndexIsActive()) {
        /* If the blog index page is requested and the blog is turned on in the
         * Config, write the index. */
        var gsBlogIndex = new BlogIndex(gsConfig);
    } else if (gsConfig.postIsActive()) {
        /* If a post was found in the url query. */
        PostToHTML(gs_post_path+'/'+gsConfig.requested_page, gs_body_id);
    } else {
        /* The active page needs to correspond to a file at this point so 
         * that the getter can download it.  The getter should be post aware.*/
        MarkdownToHTML(gsConfig.requested_page, gs_body_id); 
    }
} // - gitstrap()

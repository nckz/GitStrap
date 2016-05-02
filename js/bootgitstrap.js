/* BootGitStrap.js 
 *  Loads the index.html with the appropriate tags and downloads the required
 *  javascript and css.
 *
 * requires:
 *  jQuery 1.12.0
 *
 */

/* jQuery ------------------------------------------------------------------ */
/* Link tab actions. */
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    var href = $(e.target).attr('href');
    window.location.assign(href);
})

/* start gitstrap processing */
$(document).ready(gitstrap);

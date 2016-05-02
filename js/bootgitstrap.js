/* BootGitStrap.js 
 *  Starts GitStrap on document ready and attaches actions to the nav buttons. 
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

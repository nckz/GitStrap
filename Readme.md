#### [GitStrap](#) is a simple [Bootstrap](http://getbootstrap.com/) template that allows web developers to quickly generate a static web page (like this one) on free hosting sites like [GitHub](http://github.com) and [GitLab](http://gitlab.com). 
This can be done without any code/web development background or knowledge of
the git versioning system.  The pages are written as simple text files (in
Markdown) and linked by listing in a Config file -both of which are editable
via the GitHub web tools. The requirements are:

* A [GitHub account](https://github.com/join?source=header-home)
* A modern web browser and connection to the internet
* 5 minutes

# Step 1 - Copy (i.e. 'Fork') This Project
Once you have a GitHub account you'll need to copy this project.  So head over
to the [GitStrap Project Page](https://github.com/nckz/GitStrap) and then
click the 'Fork' button in the upper right.

#### Fork
![centerImage](images/fork.png =25%x*)

# Step 2 - Make Your First Commit
In order for GitStrap to show up under your project url, you'll have to make at
least one commit. -The Config file is a good place to start. Click on the
'Config' file in your project's file browser.

#### Config
![centerImage](images/Config.png =100%x*)

Then click the edit button (the pencil icon) in the upper right hand corner.

#### Edit
![centerImage](images/Edit.png =50%x*)

Rename the website by modifying the "Site Title" option.  When you're finished
Scroll to the bottom of the page and submit your changes by clicking the
"Commit changes" button.

#### Commit
![centerImage](images/Commit.png =100%x*)

# Step 3 - Check Your GitHub URL
Point your browser to the following address (replacing the `<username>` with your
GitHub username):

    https://<username>.github.io/GitStrap/

At this point you should see the sample GitStrap webpage with this 'Readme.md'
file displayed.

# Step 4 - Add Your Own Content
You can now start to add your own content via the "New file", "Upload files" and
'edit' (pencil button) capabilities within the GitHub website.

#### New File, Upload Files
![centerImage](images/NewFile.png =50%x*)

You can start by modifying the text in any of the existing documents:
'Readme.md', 'Header', 'Footer', and 'Example'. If you create a new page file
using the "New file" button, make sure to add that file to the list of pages 
under the "Pages / Navigation" heading in the
'[Config](?page=Config#pagesandnav)' file.

## Markdown
Your text content should be written in the Markdown format.  Markdown is a
simple way of formatting text without requiring any knowledge of html or css.
For a quick intro to Markdown you can start
[here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
and
[here](https://daringfireball.net/projects/markdown/).

## Images
Use the "Upload file" button to add images. For organization sake, upload your
new images to the existing 'images' folder.  Images can then be added to your
site pages with the following Markdown tag:

#### `![centerImage](images/img_03.jpg =100%x*)`
Where the '`100%`' means *scale the image to fit the width of the page*. The
'`x`' separates the image width and height parameters and the '`*`' means auto
scale the height. The '`centerImage`' tag is optional and centers the image on
the page horizontally. The '`images/img_03.jpg`' refers to an image file
('img_03.jpg') stored in the 'images' folder. 

![centerImage](images/img_03.jpg =100%x*)

Other options may look like these:

```
![](images/foo.jpg =100x80)   simple, assumes units are in px
![](images/bar.jpg =100x*)    sets the height to "auto"
![](images/baz.jpg =80%x5em)  image with width of 80% and height of 5em
```

For more information visit the
[Showdown project page](https://github.com/showdownjs/showdown).

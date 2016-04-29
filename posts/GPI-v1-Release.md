---
Title:  GPI v1 Release
Date:   2016-01-13 13:56:00
Author: Nicholas Zwart
Header_Cover: /images/banner_v1.jpg
Summary: The GPI version 1-beta is available for download!
---

The GPI version 1-beta is available for download!  This version marks some
major framework changes with the transition to <a
href="https://docs.python.org/3/" target="_blank">Python 3</a>, packaging via
<a href="http://anaconda.org" target="_blank">Anaconda.org</a>, PyFI API
support for the <a href="http://eigen.tuxfamily.org/" target="_blank">Eigen</a>
template library, mmap based node communication, the BORG interface for binary
encapsulation, and <a href="http://www.json.org/" target="_blank">JSON</a>
based network descriptions to name a few.

### Python 3
GPI has moved to Python 3! As GPI development continues we hope to take
advantage of the new features offered in Python 3 such as the updated fork
server, coroutines, and maybe even some lighthearted type hinting.  The core
node library has also been updated to work with Python 3.  Those who are
interested in porting their code to should pay attention to some of the <a
href="http://python-future.org/compatible_idioms.html"
target="_blank">differences in syntax</a>, most notably for `print` statements
and <a href="https://www.python.org/dev/peps/pep-0238/" target="_blank">integer
division</a>.

Many of the improvements made in GPI v1 are also available in a Python 2 branch
of the framework and core node projects (tagged as GPI version 0.6).  These can
be found on github <a href="https://github.com/gpilab/framework/tree/v0.6.0-rc"
target="_blank">here</a>.

### Conda Packaging
GPI is now available as a conda installer script as well as a preassembled
conda stack.  GPI can also be installed in an existing conda distro from <a
href="https://anaconda.org/GPI/packages" target="_blank">Anaconda.org/gpi</a>
using the `conda` command.  The move to conda packaging has also given GPI the
capability to check for framework and core node updates.

### Eigen in PyFI
The Eigen template library has been wrapped in PyFI to add some linear algebra
functionality to the C++ API.  These new interfaces further facilitate the
translation of PyFI code for use in the Philips online reconstruction platform.

Eigen also provides an effective workaround for a <a
href="https://github.com/obspy/obspy/wiki/Notes-on-Parallel-Processing-with-Python-and-ObsPy"
target="_blank">bug in the OSX accelerate framework</a> when forking processes.

### mmap
The use of memory mapped data has further improved the speed and memory usage
in the multi-processing regime of node execution.  This does not affect the
main loop or thread based modes of operation.

### BORG
The BORG (Building Outside Relationships with GPI) interface has been developed
to assist in assimilating the functionality of other software projects for
native use in GPI.  The interface reduces the coding overhead for generating a
communication layer to external command-line programs.  This is accomplished by
providing wrappers that handle the inputs, outputs and arguments to the system
call that executes the external program.  The inputs and outputs are handled
with temporary files that are managed by the interface.  The result allows a
GPI developer to quickly encapsulate the functionality of other software
projects to be used in conjunction with their own GPI node library for fleet
prototyping.  Examples of the BORG interface can be found in the <a
href="https://github.com/nckz/bart/tree/master/gpi" target="_blank">BART
(Berkeley Advanced Reconstruction Toolbox)</a> and <a
href="https://github.com/aganders3/gpi-neurotools" target="_blank">FSL (FMRIB
Software Library)</a> projects.

### Download
For more information about the updates check out the
[changelog](http://docs.gpilab.com/en/develop/CHANGELOG.html) or
just download the latest release at [gpilab.com/downloads](/downloads).

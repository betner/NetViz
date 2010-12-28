#!/usr/bin/perl
print "Content-Type: text/plain", "\n\n";
print exec("/usr/bin/perl test.pl"), "\n";

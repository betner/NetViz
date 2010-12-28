#!/usr/bin/perl
use strict;
use warnings;
use CGI;

my $cgi = new CGI;
my $param = $cgi->param( "key" );

print $cgi->header();
print $param, " performed AJAX call";
